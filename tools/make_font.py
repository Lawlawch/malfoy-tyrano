# 重新產生字體子集：python3 make_font.py   （劇本改動、出現缺字時重跑）
# 子集 = 劇本/介面實際用字 + 常用 ASCII/標點 + Big5 全部繁體字（約 1.3 萬字，供日後新增劇情）
import glob, os, sys
from fontTools.ttLib import TTCollection
from fontTools import subset

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
SRC = "/usr/share/fonts/opentype/noto/NotoSerifCJK-%s.ttc"
OUT = os.path.join(ROOT, "others", "font")

chars = set(chr(c) for c in range(0x20, 0x7F))
chars |= set("，。、；：？！…—「」『』（）〈〉《》【】～·．‧﹏％＋－×÷＝")
# Big5 全表
for hi in range(0xA4, 0xC7):   # 0xA4-0xC6 = Big5 常用字 5401 字(\u4e00 起)；次常用字 0xC9-0xF9 另計
    for lo in list(range(0x40, 0x7F)) + list(range(0xA1, 0xFF)):
        try: chars.add(bytes([hi, lo]).decode("big5"))
        except Exception: pass
# 劇本與介面實際用字
used = set()
for pat in ("scenario/*.ks", "others/*.js", "others/*.css", "others/html/*.html"):
    for p in glob.glob(os.path.join(ROOT, pat)):
        used |= set(open(p, encoding="utf-8").read())
used = set(c for c in used if ord(c) > 0x7F and c not in "\r\n\t")
chars |= used

for w, name in (("Regular", "Regular"), ("Bold", "Bold")):
    ttc = TTCollection(SRC % w)
    f = ttc.fonts[3]                      # 3 = Noto Serif CJK TC
    cmap = f.getBestCmap()
    if w == "Regular":
        missing = sorted(c for c in used if ord(c) not in cmap and not c.isspace())
        print("劇本用字 %d 個；字體缺字 %d 個：%s" % (len(used), len(missing), "".join(missing) or "（無）"))
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["kern","vert","vrt2","locl"]
    opts.hinting = False
    opts.notdef_outline = True
    opts.name_IDs = ["*"]
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=[ord(c) for c in chars])
    sub.subset(f)
    out = os.path.join(OUT, "NotoSerifTC-%s.subset.woff2" % name)
    f.flavor = "woff2"
    f.save(out)
    print(out, os.path.getsize(out) // 1024, "KB")
