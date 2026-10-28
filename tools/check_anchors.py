# 檢查章節劇本的錨點：每個 [anchor id="x"] 前一行必須是 *x，且 id 不重複
import re, sys, glob, os
root = os.path.join(os.path.dirname(__file__), "..", "data", "scenario")
bad = 0
for p in sorted(glob.glob(os.path.join(root, "ch*.ks"))):
    lines = open(p, encoding="utf-8").read().split("\n")
    seen = set()
    for i, ln in enumerate(lines):
        m = re.match(r'\[anchor id="(\w+)"\]', ln.strip())
        if not m: continue
        a = m.group(1)
        if a in seen: print(p, i + 1, "重複的錨點", a); bad += 1
        seen.add(a)
        if i == 0 or lines[i - 1].strip() != "*" + a:
            print(p, i + 1, "錨點前一行必須是 *" + a); bad += 1
    print(os.path.basename(p), "錨點", len(seen), "個")
print("有問題" if bad else "全部正確"); sys.exit(1 if bad else 0)
