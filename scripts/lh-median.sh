#!/usr/bin/env bash
# Mediana de N rodadas do Lighthouse mobile (o resultado oscila muito numa máquina ocupada).
# Uso: scripts/lh-median.sh <url> [rodadas=3] [pasta-de-saída]
set -euo pipefail
url="$1"; runs="${2:-3}"; out="${3:-$(mktemp -d)}"
mkdir -p "$out"
for i in $(seq 1 "$runs"); do
  npx -y lighthouse@12.8.2 "$url" --quiet --output=json --output-path="$out/run$i.json" \
    --chrome-flags="--headless=new" --only-categories=performance >/dev/null 2>&1
done
python3 - "$out" "$runs" <<'PY'
import json, statistics, sys
out, runs = sys.argv[1], int(sys.argv[2])
rows = []
for i in range(1, runs + 1):
    r = json.load(open(f"{out}/run{i}.json")); a = r["audits"]
    rows.append((r["categories"]["performance"]["score"] * 100, a["total-blocking-time"]["numericValue"], a["largest-contentful-paint"]["numericValue"]))
for name, idx in [("score", 0), ("TBT ms", 1), ("LCP ms", 2)]:
    vals = [row[idx] for row in rows]
    print(f"{name}: mediana {statistics.median(vals):.0f}  (rodadas: {', '.join(f'{v:.0f}' for v in vals)})")
PY
