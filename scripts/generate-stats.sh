#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  printf 'Usage: %s <username> <output>\n' "$0" >&2
  exit 1
fi

username=$1
output=$2
headers=(-H 'Accept: application/vnd.github+json')
if [ -n "${GITHUB_TOKEN:-}" ]; then
  headers+=(-H "Authorization: Bearer $GITHUB_TOKEN")
fi

profile=$(curl --fail --silent --show-error "${headers[@]}" "https://api.github.com/users/$username")
repositories=$(jq -r '.public_repos' <<<"$profile")
followers=$(jq -r '.followers' <<<"$profile")

printf '%s\n' \
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="180" viewBox="0 0 720 180" role="img" aria-labelledby="title description">' \
  "  <title id=\"title\">GitHub activity snapshot for $username</title>" \
  "  <desc id=\"description\">$repositories public repositories and $followers followers</desc>" \
  '  <rect width="720" height="180" rx="16" fill="#0d1117"/>' \
  "  <text x=\"40\" y=\"62\" fill=\"#f0f6fc\" font-family=\"-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif\" font-size=\"28\" font-weight=\"700\">$username on GitHub</text>" \
  "  <text x=\"40\" y=\"116\" fill=\"#8b949e\" font-family=\"-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif\" font-size=\"22\">$repositories public repositories</text>" \
  "  <text x=\"40\" y=\"150\" fill=\"#8b949e\" font-family=\"-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif\" font-size=\"22\">$followers followers</text>" \
  '</svg>' >"$output"
