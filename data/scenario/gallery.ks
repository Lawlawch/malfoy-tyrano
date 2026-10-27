;==============================================================
; gallery.ks  章節選擇／結局圖鑑／CG 圖鑑
; 三個頁面用「切換」按鈕循環：章節選擇 → 結局 → CG → 章節選擇
; 解鎖狀態存在系統變數 sf（vn_ch / vn_end / vn_cg），換存檔也不會消失。
;==============================================================

;（巨集 grow / chbtn 定義在 macros.ks）

;--------------------------------------------------------------
; 頁面：章節選擇
;--------------------------------------------------------------
*chapters
[cm]
[free layer="1" name="cfgtxt"]
[free layer="1" name="title_text"]
[free layer="1" name="title_sub"]
[iscript]
f.on_title = 1;
f.page = "chapters";
VN.toolbar(false);
tf.L = window.vnLayout();
[endscript]
@layopt layer="message0" visible=false
[bg storage="parchment.jpg" time=200]
[ptext name="cfgtxt" layer="1" text="章節選擇" x=0 y="&tf.L.page_title_y" width="&tf.L.w" align="center" size="&tf.L.page_title_size" color="0x7a1f2b" bold=true]

[chbtn n="1" ready="true"]
[chbtn n="2" ready="false"]
[chbtn n="3" ready="false"]
[chbtn n="4" ready="false"]
[chbtn n="5" ready="false"]
[chbtn n="6" ready="false"]
[chbtn n="7" ready="false"]
[chbtn n="8" ready="false"]
[chbtn n="9" ready="false"]
[chbtn n="10" ready="false"]

[glink color="vn_btn" size="&tf.L.ch_size" x="&tf.L.next_x" y="&tf.L.next_y" width="&tf.L.next_w" text="結局圖鑑 ▶" target="*endings"]
[glink color="vn_btn" size="&tf.L.ch_size" x="&tf.L.gback_x" y="&tf.L.gback_y" width="&tf.L.gback_w" text="返回標題" target="*to_title"]
[s]

*idle
[s]

;選定章節後開始（目前只有第一章；會重設隱藏數值）
*start_ch
[cm]
[free layer="1" name="cfgtxt"]
@call storage="newgame.ks"
@jump storage="&tf.ch_file"

;--------------------------------------------------------------
; 頁面：結局圖鑑
;--------------------------------------------------------------
*endings
[cm]
[free layer="1" name="cfgtxt"]
[iscript]
f.page = "endings";
tf.L = window.vnLayout();
tf.E = TG.variable.sf.vn_end || {};
tf.e_list = [
  ["y1_A", "第一年級　結局 A　並肩"],
  ["y1_B", "第一年級　結局 B　對手"],
  ["y1_C", "第一年級　結局 C　分道揚鑣"],
  ["y1_D", "第一年級　結局 D　暗影共鳴"]
];
tf.e_n = 0;
for (var q = 0; q < tf.e_list.length; q++) { if (tf.E[tf.e_list[q][0]]) tf.e_n++; }
[endscript]
[bg storage="parchment.jpg" time=200]
[ptext name="cfgtxt" layer="1" text="結局圖鑑" x=0 y="&tf.L.page_title_y" width="&tf.L.w" align="center" size="&tf.L.page_title_size" color="0x7a1f2b" bold=true]
[ptext name="cfgtxt" layer="1" text="&'已收集　' + tf.e_n + ' / ' + tf.e_list.length" x=0 y="&(tf.L.page_title_y + tf.L.page_title_size + 10)" width="&tf.L.w" align="center" size="&tf.L.list_size" color="0x8a6a1f" bold=true]

[iscript]
tf.e0 = tf.E[tf.e_list[0][0]] ? ("◆　" + tf.e_list[0][1]) : "◇　？？？？？？";
tf.e1 = tf.E[tf.e_list[1][0]] ? ("◆　" + tf.e_list[1][1]) : "◇　？？？？？？";
tf.e2 = tf.E[tf.e_list[2][0]] ? ("◆　" + tf.e_list[2][1]) : "◇　？？？？？？";
tf.e3 = tf.E[tf.e_list[3][0]] ? ("◆　" + tf.e_list[3][1]) : "◇　？？？？？？";
[endscript]
[grow r="1" text="&tf.e0"]
[grow r="2" text="&tf.e1"]
[grow r="3" text="&tf.e2"]
[grow r="4" text="&tf.e3"]

[glink color="vn_btn" size="&tf.L.ch_size" x="&tf.L.next_x" y="&tf.L.next_y" width="&tf.L.next_w" text="CG 圖鑑 ▶" target="*cgs"]
[glink color="vn_btn" size="&tf.L.ch_size" x="&tf.L.gback_x" y="&tf.L.gback_y" width="&tf.L.gback_w" text="返回標題" target="*to_title"]
[s]

;--------------------------------------------------------------
; 頁面：CG 圖鑑
;--------------------------------------------------------------
*cgs
[cm]
[free layer="1" name="cfgtxt"]
[iscript]
f.page = "cgs";
tf.L = window.vnLayout();
tf.G = TG.variable.sf.vn_cg || {};
tf.g_list = [
  ["mirror", "CG 01　厄里斯魔鏡"],
  ["forest", "CG 02　禁林中的兩個人"],
  ["stone", "CG 03　魔法石的守護"],
  ["bond", "CG 04　並肩"]
];
tf.g_n = 0;
for (var q = 0; q < tf.g_list.length; q++) { if (tf.G[tf.g_list[q][0]]) tf.g_n++; }
tf.g0 = tf.G[tf.g_list[0][0]] ? ("◆　" + tf.g_list[0][1]) : "◇　？？？？？？";
tf.g1 = tf.G[tf.g_list[1][0]] ? ("◆　" + tf.g_list[1][1]) : "◇　？？？？？？";
tf.g2 = tf.G[tf.g_list[2][0]] ? ("◆　" + tf.g_list[2][1]) : "◇　？？？？？？";
tf.g3 = tf.G[tf.g_list[3][0]] ? ("◆　" + tf.g_list[3][1]) : "◇　？？？？？？";
[endscript]
[bg storage="parchment.jpg" time=200]
[ptext name="cfgtxt" layer="1" text="CG 圖鑑" x=0 y="&tf.L.page_title_y" width="&tf.L.w" align="center" size="&tf.L.page_title_size" color="0x7a1f2b" bold=true]
[ptext name="cfgtxt" layer="1" text="&'已收集　' + tf.g_n + ' / ' + tf.g_list.length" x=0 y="&(tf.L.page_title_y + tf.L.page_title_size + 10)" width="&tf.L.w" align="center" size="&tf.L.list_size" color="0x8a6a1f" bold=true]
[grow r="1" text="&tf.g0"]
[grow r="2" text="&tf.g1"]
[grow r="3" text="&tf.g2"]
[grow r="4" text="&tf.g3"]

[glink color="vn_btn" size="&tf.L.ch_size" x="&tf.L.next_x" y="&tf.L.next_y" width="&tf.L.next_w" text="章節選擇 ▶" target="*chapters"]
[glink color="vn_btn" size="&tf.L.ch_size" x="&tf.L.gback_x" y="&tf.L.gback_y" width="&tf.L.gback_w" text="返回標題" target="*to_title"]
[s]

;--------------------------------------------------------------
*to_title
[cm]
[free layer="1" name="cfgtxt"]
@jump storage="title.ks"
