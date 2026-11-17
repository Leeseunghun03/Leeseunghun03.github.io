#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

if command -v bundle >/dev/null 2>&1; then
  bundler=bundle
elif command -v bundle3.0 >/dev/null 2>&1; then
  bundler=bundle3.0
else
  echo 'Bundler is required. Install Ruby and Bundler, then run bundle install.' >&2
  exit 1
fi

exec "$bundler" exec jekyll serve --host 127.0.0.1 "$@"
