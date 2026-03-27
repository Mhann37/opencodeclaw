#!/bin/bash
# memory-archive.sh — Weekly memory compaction (move daily notes > 7 days old to archive)

MEMORY_DIR="/var/lib/openclaw/.openclaw/workspace/memory"
ARCHIVE_DIR="$MEMORY_DIR/archive"

# Create archive structure
mkdir -p "$ARCHIVE_DIR"

# Find all daily notes older than 7 days, move to archive
echo "Archiving daily notes older than 7 days..." >&2

find "$MEMORY_DIR" -maxdepth 1 -type f -name "20[0-9][0-9]-[0-9][0-9]-[0-9][0-9].md" -mtime +7 | while read -r FILE; do
  BASENAME=$(basename "$FILE")
  DATE="${BASENAME%-*}" # Extract YYYY-MM-DD
  YEAR="${DATE%%-*}"    # Extract YYYY
  WEEK=$(date -d "$DATE" +%V)  # Calculate ISO week number
  
  WEEK_DIR="$ARCHIVE_DIR/${YEAR}-W${WEEK}"
  mkdir -p "$WEEK_DIR"
  
  mv "$FILE" "$WEEK_DIR/$BASENAME"
  echo "Archived: $BASENAME → ${YEAR}-W${WEEK}" >&2
done

echo "Memory archive complete." >&2
