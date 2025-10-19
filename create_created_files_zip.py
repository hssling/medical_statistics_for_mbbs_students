#!/usr/bin/env python3
"""Utility script to bundle project assets into a distributable ZIP archive.

The previous workflow relied on storing a pre-generated ``created_files.zip`` in
version control, but that approach caused issues when opening pull requests
because the platform rejects large binary attachments.  This script provides a
repeatable way to generate the archive locally whenever it is needed without
checking the binary into git.

Usage example::

    python create_created_files_zip.py

The command above produces ``created_files.zip`` in the repository root while
skipping common development artefacts.  Use ``--help`` to see additional
configuration options.
"""
from __future__ import annotations

import argparse
import os
from pathlib import Path
from typing import Set
import zipfile

# Directories that are skipped during the archive build.  Users can extend this
# list through the command line options if their environment generates extra
# artefacts.
DEFAULT_EXCLUDED_DIRS = {
    ".git",
    "__pycache__",
    "node_modules",
    ".mypy_cache",
    ".pytest_cache",
    ".venv",
    "venv",
    "env",
}

# File names that are excluded regardless of their location.
DEFAULT_EXCLUDED_FILES = {
    ".DS_Store",
    "Thumbs.db",
}

# File extensions (case-insensitive) that are excluded regardless of location.
DEFAULT_EXCLUDED_EXTENSIONS = {
    ".apk",
    ".aab",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a ZIP archive of the repository without tracking the binary",
    )
    parser.add_argument(
        "--output",
        "-o",
        default="created_files.zip",
        help="Name of the output archive (default: %(default)s)",
    )
    parser.add_argument(
        "--include-hidden",
        action="store_true",
        help="Include hidden files and directories (those starting with a dot)",
    )
    parser.add_argument(
        "--exclude-dir",
        action="append",
        default=[],
        metavar="NAME",
        help="Additional directory name to exclude. May be provided multiple times.",
    )
    parser.add_argument(
        "--exclude-file",
        action="append",
        default=[],
        metavar="NAME",
        help="Additional file name to exclude. May be provided multiple times.",
    )
    parser.add_argument(
        "--exclude-ext",
        action="append",
        default=[],
        metavar=".EXT",
        help="Additional file extension to exclude (e.g. .log). May be provided multiple times.",
    )
    return parser.parse_args()


def should_skip_dir(dirname: str, include_hidden: bool, extra_excludes: Set[str]) -> bool:
    if not include_hidden and dirname.startswith("."):
        return True
    return dirname in DEFAULT_EXCLUDED_DIRS or dirname in extra_excludes


def should_skip_file(
    filename: str,
    include_hidden: bool,
    extra_excludes: Set[str],
    extra_extensions: Set[str],
) -> bool:
    if not include_hidden and filename.startswith("."):
        return True
    if filename in DEFAULT_EXCLUDED_FILES or filename in extra_excludes:
        return True
    suffix = Path(filename).suffix.lower()
    if suffix in DEFAULT_EXCLUDED_EXTENSIONS or suffix in extra_extensions:
        return True
    return False


def build_archive(
    output_path: Path,
    include_hidden: bool,
    exclude_dirs: Set[str],
    exclude_files: Set[str],
    exclude_extensions: Set[str],
) -> None:
    project_root = Path(__file__).resolve().parent
    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for root, dirs, files in os.walk(project_root):
            rel_root = Path(root).relative_to(project_root)

            # Mutate dirs in-place to prevent os.walk from descending into
            # excluded directories.
            dirs[:] = [
                d
                for d in dirs
                if not should_skip_dir(d, include_hidden=include_hidden, extra_excludes=exclude_dirs)
            ]

            for file_name in files:
                if should_skip_file(
                    file_name,
                    include_hidden=include_hidden,
                    extra_excludes=exclude_files,
                    extra_extensions=exclude_extensions,
                ):
                    continue
                if rel_root == Path(".") and file_name == output_path.name:
                    # Avoid adding the archive itself if it already exists.
                    continue

                file_path = Path(root, file_name)
                archive.write(file_path, arcname=file_path.relative_to(project_root))


def main() -> None:
    args = parse_args()
    output_path = Path(args.output)
    if not output_path.is_absolute():
        output_path = Path(__file__).resolve().parent / output_path

    exclude_dirs = set(args.exclude_dir)
    exclude_files = set(args.exclude_file)
    exclude_extensions = {ext.lower() for ext in args.exclude_ext}

    build_archive(
        output_path=output_path,
        include_hidden=args.include_hidden,
        exclude_dirs=exclude_dirs,
        exclude_files=exclude_files,
        exclude_extensions=exclude_extensions,
    )
    print(f"Created archive: {output_path}")


if __name__ == "__main__":
    main()
