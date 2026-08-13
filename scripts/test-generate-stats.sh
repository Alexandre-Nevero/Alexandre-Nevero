#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
username=${1:-Alexandre-Nevero}
output=$(mktemp)
trap 'rm -f "$output"' EXIT

profile=$(curl --fail --silent --show-error "https://api.github.com/users/$username")
repositories=$(jq -r '.public_repos' <<<"$profile")
followers=$(jq -r '.followers' <<<"$profile")

posix_shell=${POSIX_SHELL:-sh}
if command -v dash >/dev/null 2>&1; then
  posix_shell=dash
fi
"$posix_shell" "$root/scripts/generate-stats.sh" "$username" "$output"

grep -Fq '<svg xmlns="http://www.w3.org/2000/svg"' "$output"
grep -Fq "$username" "$output"
grep -Fq "$repositories public repositories" "$output"
grep -Fq "$followers followers" "$output"

printf 'PASS: %s, %s public repositories, %s followers\n' "$username" "$repositories" "$followers"
