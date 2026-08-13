#!/bin/sh
set -eu

if [ "$#" -ne 2 ]; then
  printf 'Usage: %s <username> <output>\n' "$0" >&2
  exit 1
fi

username=$1
output=$2
if [ -n "${GITHUB_TOKEN:-}" ]; then
  profile=$(curl --fail --silent --show-error \
    -H 'Accept: application/vnd.github+json' \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    "https://api.github.com/users/$username")
else
  profile=$(curl --fail --silent --show-error \
    -H 'Accept: application/vnd.github+json' \
    "https://api.github.com/users/$username")
fi

repositories=$(printf '%s\n' "$profile" | jq -r '.public_repos')
followers=$(printf '%s\n' "$profile" | jq -r '.followers')

printf '%s\n' \
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="180" viewBox="0 0 720 180" role="img" aria-labelledby="title description">' \
  "  <title id=\"title\">GitHub activity snapshot for $username</title>" \
  "  <desc id=\"description\">$repositories public repositories and $followers followers</desc>" \
  '  <rect width="720" height="180" rx="16" fill="#0d1117"/>' \
  "  <text x=\"40\" y=\"62\" fill=\"#f0f6fc\" font-family=\"ui-monospace, SFMono-Regular, Menlo, monospace\" font-size=\"28\" font-weight=\"700\">$username on GitHub</text>" \
  "  <text x=\"40\" y=\"116\" fill=\"#8b949e\" font-family=\"ui-monospace, SFMono-Regular, Menlo, monospace\" font-size=\"22\">$repositories public repositories</text>" \
  "  <text x=\"40\" y=\"150\" fill=\"#8b949e\" font-family=\"ui-monospace, SFMono-Regular, Menlo, monospace\" font-size=\"22\">$followers followers</text>" \
  '</svg>' >"$output"
