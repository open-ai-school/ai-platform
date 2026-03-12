#!/usr/bin/env bash
# Sync lesson SVG assets from content submodule → public/images/lessons/
# Also merges premium content from content-pro/ into content/programs/
# This is the ONLY way images get to public/. The submodule is the source of truth.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTENT_DIR="$PROJECT_ROOT/content"
CONTENT_PRO_DIR="$PROJECT_ROOT/content-pro"
PUBLIC_DIR="$PROJECT_ROOT/public/images/lessons"

# ── Step 1: Merge premium content into content/programs/ ──
if [ -d "$CONTENT_PRO_DIR/programs" ]; then
  echo "🔒 Merging premium content from content-pro/..."
  pro_count=0
  for program_dir in "$CONTENT_PRO_DIR"/programs/*/; do
    program_name="$(basename "$program_dir")"
    target="$CONTENT_DIR/programs/$program_name"
    if [ ! -d "$target" ]; then
      cp -r "$program_dir" "$target"
      pro_count=$((pro_count + 1))
    fi
  done
  echo "✅ Merged $pro_count premium programs into content/programs/"
else
  echo "ℹ️  No content-pro/ submodule found — skipping premium merge"
fi

# ── Step 2: Sync SVG assets ──
echo "🔄 Syncing lesson assets from content submodule..."

# Ensure content submodule exists
if [ ! -d "$CONTENT_DIR/programs" ]; then
  echo "⚠️  Content submodule not found. Running git submodule update..."
  cd "$PROJECT_ROOT"
  git submodule update --init --force
fi

# Clear existing lesson images (they're generated from submodule)
rm -rf "$PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR"

# Copy all SVGs from each program's assets/ to public/images/lessons/
count=0
for program_dir in "$CONTENT_DIR"/programs/*/; do
  assets_dir="$program_dir/assets"
  if [ -d "$assets_dir" ]; then
    for svg in "$assets_dir"/*.svg; do
      [ -f "$svg" ] || continue
      cp "$svg" "$PUBLIC_DIR/"
      count=$((count + 1))
    done
  fi
done

echo "✅ Synced $count SVG assets to public/images/lessons/"
