#!/bin/bash
# tiktok-generator.sh — Generate TikTok video from setlist image
# Usage: ./tiktok-generator.sh input.jpg "Artist Name" "Discover the setlist"

set -e

INPUT_IMAGE="$1"
ARTIST="${2:-Unknown Artist}"
CTA="${3:-Discover the full setlist}"
OUTPUT="/tmp/output-tiktok-$(date +%s).mp4"

# TikTok dimensions: 1080x1920 (9:16 aspect ratio)
WIDTH=1080
HEIGHT=1920
DURATION=6  # 6-second video

# Check input
if [[ ! -f "$INPUT_IMAGE" ]]; then
  echo "Error: Image not found: $INPUT_IMAGE" >&2
  exit 1
fi

echo "Generating TikTok video..." >&2
echo "Input: $INPUT_IMAGE" >&2
echo "Artist: $ARTIST" >&2
echo "CTA: $CTA" >&2
echo "Output: $OUTPUT" >&2

# Use FFmpeg with filter_complex for text overlay + animation
ffmpeg -y \
  -loop 1 -i "$INPUT_IMAGE" \
  -c:v libx264 \
  -preset ultrafast \
  -t $DURATION \
  -vf "
    scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease,
    pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2:black,
    drawtext=
      fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:
      text='$ARTIST':
      fontsize=48:
      fontcolor=white:
      x=(w-text_w)/2:
      y=h*0.35:
      alpha='if(lt(t\,0.5)\,t/0.5\,1)',
    drawtext=
      fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:
      text='$CTA':
      fontsize=36:
      fontcolor=#FF006E:
      x=(w-text_w)/2:
      y=h*0.85:
      alpha='if(lt(t\,1)\,t\,if(lt(t\,5)\,1\,if(lt(t\,6)\,(6-t)\,0)))'
  " \
  -c:a aac \
  "$OUTPUT"

if [[ -f "$OUTPUT" ]]; then
  echo "✅ TikTok video created: $OUTPUT" >&2
  echo "Ready to upload to TikTok." >&2
  echo "$OUTPUT"
else
  echo "❌ Failed to generate video" >&2
  exit 1
fi
