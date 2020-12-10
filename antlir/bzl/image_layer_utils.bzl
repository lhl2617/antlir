load("@bazel_skylib//lib:paths.bzl", "paths")
load("@bazel_skylib//lib:shell.bzl", "shell")
load("@bazel_skylib//lib:types.bzl", "types")
load(":image_utils.bzl", "image_utils")
load(":oss_shim.bzl", "buck_genrule", "config", "get_visibility")
load(":query.bzl", "layer_deps_query")
load(":target_helpers.bzl", "targets_and_outputs_arg_list")

def _add_run_in_subvol_target(name, kind, extra_args = None):
    target = name + "-" + kind
    buck_genrule(
        name = target,
        out = "run",
        bash = """
cat > "$TMP/out" << 'EOF'
#!/bin/sh
set -ue -o pipefail -o noclobber
exec $(exe //antlir/nspawn_in_subvol:run) \
--layer $(location {layer_quoted}) \
{maybe_extra_args} \
{targets_and_outputs} \
"$@"
EOF
chmod a+x "$TMP/out"
mv "$TMP/out" "$OUT"
        """.format(
            layer_quoted = shell.quote(":" + name),
            maybe_extra_args = " ".join(extra_args) if extra_args else "",
            targets_and_outputs = " ".join(
                targets_and_outputs_arg_list(
                    name = target,
                    query = layer_deps_query(
                        layer = image_utils.current_target(name),
                    ),
                ),
            ),
        ),
        # This genrule is unique to the host on which it is generated
        cacheable = False,
        executable = True,
        visibility = [],
        antlir_rule = "user-internal",
    )

def _image_layer_impl(
        _rule_type,
        _layer_name,
        _make_subvol_cmd,
        # For now, layer implementations mark this explicitly.  I doubt that
        # "antlir-private" is a sensible default here.
        antlir_rule,
        # Layers can be used in the `mounts` field of an `image.feature`.
        # This setting affects how **this** layer may be mounted inside
        # others.
        #
        # This argument may be a dict, or a target path whose outputs is a
        # JSON dict of the same form.  The latter as added to allow
        # generating mount configs for fetched packages.
        #
        # The default mount config for a layer only provides a
        # `build_source`, specifying how the layer should be mounted at
        # development time inside the in-repo `buck-image-out` subtree.
        #
        # This argument can set `runtime_source` and `default_mountpoint`.
        # The former is essential -- to get a layer from `mounts` to be
        # mounted at container run-time, we have to tell the container agent
        # how to obtain the layer-to-be-mounted.  This can be done in a
        # variety of ways, so it's not part of `image.layer` itself, and
        # must be set from outside.
        mount_config = None,
        # Most use-cases should never need to set this.  A string is used
        # instead of int because Skylark supports only 32-bit integers.
        # Future:
        #  (i) Should we determine this dynamically from the installed
        #      artifacts (by totaling up the bytes needed for copied files,
        #      RPMs, tarballs, etc)?  NB: At the moment, this number doesn't
        #      work precisely as a user would want -- we just require that
        #      the base volume have at least this much space, -- but
        #      hopefully people don't have to change it too much.
        # (ii) For sendstreams, it's much more plausible to correctly
        #      estimate the size requirements, so we might do that sooner.
        layer_size_bytes = "100" + "0" * 9,
        # Set this to emit a `-boot` target, running which will boot
        # `systemd` inside the image.
        enable_boot_target = False,
        visibility = None):
    visibility = get_visibility(visibility, _layer_name)
    if mount_config == None:
        mount_config = {}

    # IMPORTANT: If you touch this genrule, update `image_layer_alias`.
    buck_genrule(
        name = _layer_name,
        out = "layer",
        bash = image_utils.wrap_bash_build_in_common_boilerplate(
            self_dependency = "//antlir/bzl:image_layer",
            bash = '''
            # We want subvolume names to be user-controllable. To permit
            # this, we wrap each subvolume in a temporary subdirectory.
            # This also allows us to prevent access to capability-
            # escalating programs inside the built subvolume by users
            # other than the repo owner.
            #
            # The "version" code here ensures that the wrapper directory
            # has a unique name.  We could use `mktemp`, but our variant
            # is a little more predictable (not a security concern since
            # we own the parent directory) and a lot more debuggable.
            # Usability is better since our version sorts by build time.
            #
            # `exe` vs `location` is explained in `image_package.py`.
            # `exe` won't expand in \\$( ... ), so we need `binary_path`.
            binary_path=( $(exe //antlir:subvolume-version) )
            subvolume_ver=\\$( "${{binary_path[@]}}" )
            subvolume_wrapper_dir={layer_name_mangled_quoted}":$subvolume_ver"

            # Do not touch $OUT until the very end so that if we
            # accidentally exit early with code 0, the rule still fails.
            mkdir "$TMP/out"
            {print_mount_config} |
                $(exe //antlir:layer-mount-config) {layer_target_quoted} \
                    > "$TMP/out/mountconfig.json"
            # "layer.json" points at the subvolume inside `buck-image-out`.
            layer_json="$TMP/out/layer.json"

            # IMPORTANT: This invalidates and/or deletes any existing
            # subvolume that was produced by the same target.  This is the
            # point of no return.
            #
            # This creates the wrapper directory for the subvolume, and
            # pre-initializes "$layer_json" in a special way to support a
            # form of refcounting that distinguishes between subvolumes that
            # are referenced from the Buck cache ("live"), and ones that are
            # no longer referenced ("dead").  We want to create the refcount
            # file before starting the build to guarantee that we have
            # refcount files for partially built images -- this makes
            # debugging failed builds a bit more predictable.
            refcounts_dir=\\$( readlink -f {refcounts_dir_quoted} )
            # `exe` vs `location` is explained in `image_package.py`
            $(exe //antlir:subvolume-garbage-collector) \
                --refcounts-dir "$refcounts_dir" \
                --subvolumes-dir "$subvolumes_dir" \
                --new-subvolume-wrapper-dir "$subvolume_wrapper_dir" \
                --new-subvolume-json "$layer_json"

            {make_subvol_cmd}

            mv "$TMP/out" "$OUT"  # Allow the rule to succeed.
            '''.format(
                # Buck target names permit `/`, but we want a 1-level
                # hierarchy for layer wrapper directories in
                # `buck-image-out`, so mangle `/`.
                layer_name_mangled_quoted = shell.quote(
                    _layer_name.replace("/", "=="),
                ),
                layer_target_quoted = shell.quote(
                    image_utils.current_target(_layer_name),
                ),
                refcounts_dir_quoted = paths.join(
                    "$GEN_DIR",
                    shell.quote(config.get_project_root_from_gen_dir()),
                    "buck-out/.volume-refcount-hardlinks/",
                ),
                make_subvol_cmd = _make_subvol_cmd,
                # To make layers "image-mountable", provide `mountconfig.json`.
                print_mount_config = (
                    # `mount_config` was a target path
                    "cat $(location {})".format(mount_config)
                ) if types.is_string(mount_config) else (
                    # inline `mount_config` dict
                    "echo {}".format(
                        shell.quote(struct(**mount_config).to_json()),
                    )
                ),
            ),
            volume_min_free_bytes = layer_size_bytes,
            rule_type = _rule_type,
            target_name = _layer_name,
        ),
        # Layers are only usable on the same host that built them, so
        # keep our output JSON out of the distributed Buck cache.  See
        # the docs for BuildRule::isCacheable.
        cacheable = False,
        type = _rule_type,  # For queries
        visibility = visibility,
        antlir_rule = antlir_rule,
    )
    _add_run_in_subvol_target(_layer_name, "container")
    if enable_boot_target:
        _add_run_in_subvol_target(_layer_name, "boot", extra_args = ["--boot"])

image_layer_utils = struct(
    image_layer_impl = _image_layer_impl,
)
