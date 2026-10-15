#!/usr/bin/env bash
# Publie une nouvelle version du site : met à jour le numéro de version partout
# (index.html : meta site-version + ?v= des fichiers CSS/JS, et version.json).
# Les visiteurs reçoivent alors automatiquement la nouvelle version, sans vider leur cache.
#
# Usage : ./scripts/bump-version.sh          → version datée automatique (ex. 20261016-1532)
#         ./scripts/bump-version.sh 20261020-1
set -euo pipefail
cd "$(dirname "$0")/.."

new="${1:-$(date +%Y%m%d-%H%M)}"
old="$(sed -n 's/.*name="site-version" content="\([^"]*\)".*/\1/p' index.html)"
[ -n "$old" ] || { echo "Version actuelle introuvable dans index.html" >&2; exit 1; }

sed -i.bak -e "s/content=\"$old\"/content=\"$new\"/" -e "s/?v=$old/?v=$new/g" index.html && rm -f index.html.bak
printf '{ "version": "%s" }\n' "$new" > version.json

echo "Version : $old → $new"
