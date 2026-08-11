#!/bin/bash
# Run QA validation for one device across all 25 views.
# Usage: ./run-device.sh <device-name-or-empty-for-viewport> <viewport-w> <viewport-h> <results-file>
set -u
DEVICE="${1:-}"
VW="${2:-}"
VH="${3:-}"
RESULTS="${4:-/dev/stdout}"
SESSION="qa"

# Configure device
if [ -n "$DEVICE" ]; then
  agent-browser --session "$SESSION" set device "$DEVICE" >/dev/null 2>&1
else
  agent-browser --session "$SESSION" set viewport "$VW" "$VH" >/dev/null 2>&1
fi
# Clear previous console/errors
agent-browser --session "$SESSION" console --clear >/dev/null 2>&1
agent-browser --session "$SESSION" errors --clear >/dev/null 2>&1

ROUTES=("" "brand" "market" "menu" "growth" "viral" "creative" "roadmap" "calculator" "menu-studio" "competitors" "content-calendar" "experiments" "style-guide" "budget" "origin-atlas" "roi" "campaign-builder" "spirit-checker" "swot" "pilot" "scorecard" "loyalty" "sources" "landing")

: > "$RESULTS"
LABEL="${DEVICE:-desktop-${VW}x${VH}}"
echo "# DEVICE=$LABEL vw=$VW vh=$VH" >> "$RESULTS"

for r in "${ROUTES[@]}"; do
  url="http://localhost:3000/#/${r}"
  agent-browser --session "$SESSION" open "$url" >/dev/null 2>&1
  agent-browser --session "$SESSION" wait 1000 >/dev/null 2>&1
  # 1) horizontal overflow on documentElement
  doc_overflow=$(agent-browser --session "$SESSION" eval "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 ? 'YES' : 'no'" 2>&1 | tail -1 | tr -d '\n')
  # 2) overflowing elements list
  overflow_els=$(agent-browser --session "$SESSION" eval "(function(){var els=document.querySelectorAll('*'); var issues=[]; var vw=document.documentElement.clientWidth; for(var i=0;i<els.length;i++){var e=els[i]; var r=e.getBoundingClientRect(); if(r.right>vw+2 && r.width>50 && e.children.length<3){issues.push({tag:e.tagName, txt:(e.textContent||'').trim().substring(0,40), right:Math.round(r.right), width:Math.round(r.width)});}} return issues.length?JSON.stringify(issues.slice(0,3)):'none';})()" 2>&1 | tail -1 | tr -d '\n')
  # 3) page errors
  errs=$(agent-browser --session "$SESSION" errors 2>&1 | tail -n +2 | head -20)
  err_count=$(echo -n "$errs" | grep -c '^' 2>/dev/null || echo 0)
  if [ -z "$errs" ]; then err_count=0; fi
  printf 'ROUTE=%s\tOVERFLOW=%s\tERR_COUNT=%s\tELS=%s\n' "$r" "$doc_overflow" "$err_count" "$overflow_els" >> "$RESULTS"
done
