#!/bin/bash
# tiktok-production.sh — Production-grade TikTok video generator
# Modern, minimalist aesthetic with clean typography and animation

set -e

INPUT_IMAGE="$1"
ARTIST="${2:-Unknown Artist}"
VENUE="${3:-Unknown Venue}"
SONG1="${4:-Song 1}"
SONG2="${5:-Song 2}"
SONG3="${6:-Song 3}"
OUTPUT="/tmp/tiktok-setlist-$(date +%s).mp4"

WIDTH=1080
HEIGHT=1920
DURATION=12

# Colors (modern, minimalist)
BG_COLOR="0x000000"
TEXT_COLOR="FFFFFF"
ACCENT_COLOR="FF006E"
LIGHT_GRAY="CCCCCC"

# Check input
if [[ ! -f "$INPUT_IMAGE" ]]; then
  echo "Error: Image not found: $INPUT_IMAGE" >&2
  exit 1
fi

echo "🎬 Generating production TikTok video..." >&2
echo "   Artist: $ARTIST" >&2
echo "   Venue: $VENUE" >&2
echo "   Output: $OUTPUT" >&2

# Create filter string (escaping properly)
FILTER="
scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease,
pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2:color=$BG_COLOR,
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='$ARTIST':fontsize=80:fontcolor=$TEXT_COLOR:x=(w-text_w)/2:y=h*0.24:shadowx=3:shadowy=3:shadowcolor=black:alpha='if(lt(t\,0.5)\,0\,if(lt(t\,1)\,clip((t-0.5)*2\,0\,1)\,if(lt(t\,10)\,1\,clip((11-t)*2\,0\,1))))',
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='$VENUE':fontsize=48:fontcolor=$LIGHT_GRAY:x=(w-text_w)/2:y=h*0.36:shadowx=2:shadowy=2:shadowcolor=black:alpha='if(lt(t\,1.5)\,0\,if(lt(t\,2.2)\,clip((t-1.5)*2\,0\,1)\,if(lt(t\,10)\,1\,clip((11-t)*2\,0\,1))))',
drawtext=text='━━━━━━━':fontsize=28:fontcolor=$ACCENT_COLOR:x=(w-text_w)/2:y=h*0.44:shadowx=1:shadowy=1:shadowcolor=black:alpha='if(lt(t\,2.5)\,0\,if(lt(t\,3.2)\,clip((t-2.5)*2\,0\,1)\,if(lt(t\,10)\,1\,clip((11-t)*2\,0\,1))))',
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='TOP TRACKS':fontsize=28:fontcolor=$LIGHT_GRAY:x=(w-text_w)/2:y=h*0.53:shadowx=2:shadowy=2:shadowcolor=black:alpha='if(lt(t\,3)\,0\,if(lt(t\,3.5)\,clip((t-3)*2\,0\,1)\,if(lt(t\,10)\,1\,clip((11-t)*2\,0\,1))))',
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='• $SONG1':fontsize=44:fontcolor=$TEXT_COLOR:x=(w-text_w)/2:y=h*0.61:shadowx=2:shadowy=2:shadowcolor=black:alpha='if(lt(t\,3.5)\,0\,if(lt(t\,4.2)\,clip((t-3.5)*2\,0\,1)\,if(lt(t\,10)\,1\,clip((11-t)*2\,0\,1))))',
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='• $SONG2':fontsize=44:fontcolor=$TEXT_COLOR:x=(w-text_w)/2:y=h*0.70:shadowx=2:shadowy=2:shadowcolor=black:alpha='if(lt(t\,4.5)\,0\,if(lt(t\,5.2)\,clip((t-4.5)*2\,0\,1)\,if(lt(t\,10)\,1\,clip((11-t)*2\,0\,1))))',
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='• $SONG3':fontsize=44:fontcolor=$TEXT_COLOR:x=(w-text_w)/2:y=h*0.79:shadowx=2:shadowy=2:shadowcolor=black:alpha='if(lt(t\,5.5)\,0\,if(lt(t\,6.2)\,clip((t-5.5)*2\,0\,1)\,if(lt(t\,10)\,1\,clip((11-t)*2\,0\,1))))',
drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='Visit SetlistArt.ink':fontsize=48:fontcolor=$ACCENT_COLOR:x=(w-text_w)/2:y=h*0.91:shadowx=2:shadowy=2:shadowcolor=black:alpha='if(lt(t\,9)\,0\,if(lt(t\,9.5)\,clip((t-9)*2\,0\,1)\,1))'
"

ffmpeg -y \
  -loop 1 \
  -i "$INPUT_IMAGE" \
  -c:v libx264 \
  -preset ultrafast \
  -t $DURATION \
  -vf "$FILTER" \
  -c:a aac \
  "$OUTPUT" 2>&1 | grep -E "✓|error|Error" || true

if [[ -f "$OUTPUT" ]]; then
  SIZE=$(du -h "$OUTPUT" | cut -f1)
  echo "✅ Production video created: $OUTPUT ($SIZE)" >&2
  echo "$OUTPUT"
else
  echo "❌ Failed to generate video" >&2
  exit 1
fi
