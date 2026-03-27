#!/bin/bash

###############################################################################
# TONIGHT'S NRL GAME FETCHER
# Always-on ability to find what's playing tonight
# Usage: ./nrl-tonights-game.sh
###############################################################################

echo "[NRL] Fetching tonight's fixture..."

# Try multiple sources in priority order
# 1. footystatistics.com (most reliable)
# 2. nrl.com draw page (official source)
# 3. sportsbet.com.au (odds + fixture)

# Fetch footystatistics fixture list
FIXTURE=$(curl -s "https://www.footystatistics.com" | \
  grep -oP '(?<=today)[^}]*?' | head -1)

if [ -z "$FIXTURE" ]; then
  # Fallback: search web for "NRL tonight"
  FIXTURE=$(curl -s "https://www.google.com/search?q=NRL+tonight" | \
    grep -oP '(?<=>)[^<]*? vs [^<]*?(?=<)' | head -1)
fi

if [ -z "$FIXTURE" ]; then
  echo "❌ Could not find tonight's fixture"
  exit 1
fi

echo "✓ Tonight's game: $FIXTURE"
echo "Fetching odds..."

# Fetch from Sportsbet (will need to scrape or use API)
curl -s "https://www.sportsbet.com.au/betting/rugby-league" | \
  grep -A 5 "tonight\|today" | head -20

