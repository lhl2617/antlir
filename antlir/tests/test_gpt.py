#!/usr/bin/env python3
# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import os
import subprocess
import tempfile
from contextlib import contextmanager

from antlir.tests.image_package_testbase import ImagePackageTestCaseBase
from antlir.tests.layer_resource import layer_resource

from ..gpt import make_gpt
from ..unshare import Namespace, Unshare, nsenter_as_root


class GptTestCase(ImagePackageTestCaseBase):
    @contextmanager
    def _make_gpt(self):
        with tempfile.TemporaryDirectory() as td:
            out_path = os.path.join(td, "image.gpt")
            make_gpt(
                [
                    "--build-appliance",
                    layer_resource(__package__, "build-appliance"),
                    "--output-path",
                    out_path,
                    "--gpt",
                    os.environ["test-gpt-json"],
                ]
            )
            yield out_path

    def _verify_gpt_image(self, image_path):
        with Unshare([Namespace.MOUNT, Namespace.PID]) as unshare:
            res = (
                subprocess.check_output(
                    nsenter_as_root(
                        unshare,
                        "partx",
                        "-o",
                        "START,SECTORS",
                        "-g",
                        "--raw",
                        image_path,
                    )
                )
                .decode()
                .strip()
                .split("\n")
            )
            # partx offset units are in sectors
            sector_size = 512
            part_offsets = [int(o.split()[0]) * sector_size for o in res]
            part_sizes = [int(o.split()[1]) * sector_size for o in res]
            with tempfile.TemporaryDirectory() as mount_dir:
                subprocess.check_call(
                    nsenter_as_root(
                        unshare,
                        "mount",
                        "-t",
                        "vfat",
                        "-o",
                        "loop,"
                        f"offset={part_offsets[0]},"
                        f"sizelimit={part_sizes[0]}",
                        image_path,
                        mount_dir,
                    )
                )
                self._verify_vfat_mount(unshare, mount_dir, "cats")

            with tempfile.TemporaryDirectory() as mount_dir:
                subprocess.check_call(
                    nsenter_as_root(
                        unshare,
                        "mount",
                        "-t",
                        "ext3",
                        "-o",
                        f"loop,"
                        f"offset={part_offsets[1]},"
                        f"sizelimit={part_sizes[1]}",
                        image_path,
                        mount_dir,
                    )
                )
                self._verify_ext3_mount(unshare, mount_dir, "cats")

    def test_gpt_image(self):
        with self._make_gpt() as image_path:
            self._verify_gpt_image(image_path)
        self._verify_gpt_image(self._sibling_path("gpt_test"))
