#!/usr/bin/env python3
# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

from collections import OrderedDict
from typing import AnyStr, Dict, Generator, List, NamedTuple

from antlir.compiler.requires_provides import (
    Provider,
    ProvidesGroup,
    Requirement,
    RequireFile,
)
from antlir.fs_utils import Path
from antlir.subvol_utils import Subvol

from .common import ImageItem, LayerOpts
from .group_t import group_t


# Default GID_MIN from /etc/login.defs.
# Used to calculate next available group ID.
_GID_MIN = 1000
_GID_MAX = 60000


GROUP_FILE_PATH = Path("/etc/group")


class GroupFileLine(NamedTuple):
    name: str
    id: int
    members: List[str]

    def __str__(self):
        return ":".join((self.name, "x", str(self.id), ",".join(self.members)))


class GroupFile:
    lines: "OrderedDict[int, GroupFileLine]"
    nameToGID: Dict[str, int]

    def __init__(self, group_file: str = ""):
        """
        Parse input `f` as /etc/group file. See `man 5 group`
        """
        self.lines = OrderedDict()
        self.nameToGID = {}
        for l in group_file.split("\n"):
            l = l.strip()
            if l == "":
                continue
            fields = l.split(":")
            if len(fields) != 4:
                raise RuntimeError(f"Invalid line in group file: {l}")
            gfl = GroupFileLine(
                name=fields[0],
                id=int(fields[2]),
                members=fields[3].split(",") if fields[3] else [],
            )
            if gfl.id in self.lines:
                raise RuntimeError(f"Duplicate GID in group file: {l}")
            self.lines[gfl.id] = gfl
            if gfl.name in self.nameToGID:
                raise RuntimeError(f"Duplicate groupname in group file: {l}")
            self.nameToGID[gfl.name] = gfl.id

    def next_group_id(self) -> int:
        # Future: read /etc/login.defs and respect GID_MIN/GID_MAX?
        next_gid = _GID_MIN
        for gid in self.lines:
            if gid > _GID_MAX:
                continue
            if gid >= next_gid:
                next_gid = gid + 1
        return next_gid

    def add(self, name: str, gid: int):
        if gid in self.lines:
            line = self.lines[gid]
            raise ValueError(
                f"new group {name}/{gid} conflicts with {line.name}"
            )
        if name in self.nameToGID:
            raise ValueError(f"group {name} already exists")
        self.lines[gid] = GroupFileLine(name=name, id=gid, members=[])
        self.nameToGID[name] = gid

    def join(self, groupname: str, username: str):
        if groupname not in self.nameToGID:
            raise ValueError(f"{groupname} not found")
        gid = self.nameToGID[groupname]
        gfl = self.lines[gid]
        gfl.members.append(username)

    def provides(self) -> Generator[Provider, None, None]:
        for name in self.nameToGID:
            yield ProvidesGroup(name)

    def __str__(self):
        return "\n".join((str(gfl) for gfl in self.lines.values())) + "\n"


# These provide mocking capabilities for testing
def _read_group_file(subvol: Subvol) -> str:
    return subvol.read_path_text(GROUP_FILE_PATH)


def _write_group_file(subvol: Subvol, contents: AnyStr):
    subvol.overwrite_path_as_root(GROUP_FILE_PATH, str(contents))


class GroupItem(group_t, ImageItem):
    def requires(self) -> Generator[Requirement, None, None]:
        # The root group is *always* available, even without a
        # group db file
        if self.name != "root":
            yield RequireFile(path=GROUP_FILE_PATH)

    def provides(self) -> Generator[Provider, None, None]:
        yield ProvidesGroup(self.name)

    def build(self, subvol: Subvol, layer_opts: LayerOpts = None):
        group_file = GroupFile(_read_group_file(subvol))
        gid = self.id or group_file.next_group_id()
        group_file.add(self.name, gid)
        _write_group_file(subvol, group_file)
