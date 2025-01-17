#!/usr/bin/env python3
# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import os
from typing import Iterable

from antlir.subvol_utils import Subvol

from .common import (
    ImageItem,
    LayerOpts,
    PhaseOrder,
    is_path_protected,
    protected_path_set,
    validate_path_field_normal_relative,
)
from .remove_paths_t import remove_paths_t


class RemovePathItem(remove_paths_t, ImageItem):
    _normalize_path = validate_path_field_normal_relative("path")

    def phase_order(self):
        return PhaseOrder.REMOVE_PATHS

    def __sort_key(self):
        # We sort in reverse order when building so the natural
        # sort order of must_exist will cause must_exist=True
        # items to be processed first, allowing conflicts to be
        # resolved naturally.
        return (self.path, self.must_exist)

    def __lt__(self, other):
        return self.__sort_key() < other.__sort_key()

    @classmethod
    def get_phase_builder(
        cls, items: Iterable["RemovePathItem"], layer_opts: LayerOpts
    ):
        # NB: We want `remove_paths` not to be able to remove additions by
        # regular (non-phase) items in the same layer -- that indicates
        # poorly designed `feature`s, which should be refactored.  At
        # present, this is only enforced implicitly, because all removes are
        # done before regular items are even validated or sorted.  Enforcing
        # it explicitly is possible by peeking at `DependencyGraph.items`,
        # but the extra complexity doesn't seem worth the faster failure.

        # NB: We could detect collisions between two `must_exist` removes
        # early, but again, it doesn't seem worth the complexity.

        def builder(subvol: Subvol):
            protected_paths = protected_path_set(subvol)
            # Reverse-lexicographic order deletes inner paths before
            # deleting the outer paths, thus minimizing conflicts between
            # `remove_paths` items.
            for item in sorted(items, reverse=True):
                if is_path_protected(item.path, protected_paths):
                    # For META_DIR, this is never reached because of
                    # make_path_normal_relative's check, but for other
                    # protected paths, this is required.
                    raise AssertionError(
                        f"Cannot remove protected {item}: {protected_paths}"
                    )
                # This ensures that there are no symlinks in item.path that
                # might take us outside of the subvolume.  Since recursive
                # `rm` does not follow symlinks, it is OK if the inode at
                # `item.path` is a symlink (or one of its sub-paths).
                path = subvol.path(item.path, no_dereference_leaf=True)
                if not os.path.lexists(path):
                    if not item.must_exist:
                        continue
                    raise AssertionError(f"Path does not exist: {item}")

                subvol.run_as_root(
                    [
                        "rm",
                        # This prevents us from making removes outside of the
                        # per-repo loopback, which is an important safeguard.
                        # It does not stop us from reaching into other subvols,
                        # but since those have random IDs in the path, this is
                        # nearly impossible to do by accident.
                        "--one-file-system",
                        "--recursive",
                        path,
                    ]
                )

        return builder
