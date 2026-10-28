;==============================================================
; macros.ks  共用巨集
;==============================================================

;--------------------------------------------------------------
; 角色登場（位置自動排：1 人置中、2 人左右、3 人左中右）
; [show_c name="draconia" face="normal"]
; 想讓新角色站在最左邊：加 slot="left"（其餘情況一律排在最右邊）
; 新增角色時，請同步在下面 relayout_all 與 resizecall.ks 的 relayout_all 內登記
;--------------------------------------------------------------
[macro name="show_c"]
[iscript]
if (!$.isArray(f.stage)) { f.stage = []; }
if (f.stage.indexOf(mp.name) < 0) {
  if (mp.slot == "left") { f.stage.unshift(mp.name); } else { f.stage.push(mp.name); }
}
tf.sp = VN.stagePos(f.stage, mp.name);
[endscript]
[chara_show name=%name face=%face|normal left="&tf.sp.left" top="&tf.sp.top" width="&tf.sp.width" time=%time|300]
[relayout_all except=%name time=%time|300]
[endmacro]

;--------------------------------------------------------------
; 角色退場（留下的角色自動重新排位）
;--------------------------------------------------------------
[macro name="hide_c"]
[iscript]
if (!$.isArray(f.stage)) { f.stage = []; }
tf.hi = f.stage.indexOf(mp.name);
if (tf.hi >= 0) { f.stage.splice(tf.hi, 1); }
[endscript]
[chara_hide name=%name time=%time|300]
[relayout_all time=%time|300]
[endmacro]

;--------------------------------------------------------------
; 全部角色退場
;--------------------------------------------------------------
[macro name="hide_all_c"]
[iscript]
f.stage = [];
[endscript]
[chara_hide_all time=%time|300]
[endmacro]

;--------------------------------------------------------------
; 重新排列單一角色／全部角色
;--------------------------------------------------------------
[macro name="relayout_c"]
[iscript]
tf.L = window.vnLayout();
tf.rs = ($.isArray(f.stage) && mp.name != mp.except) ? VN.stagePos(f.stage, mp.name) : null;
[endscript]
[if exp="tf.rs"]
[chara_move name=%name left="&tf.rs.left" top="&tf.rs.top" width="&tf.rs.width" time=%time|0]
[endif]
[endmacro]

[macro name="relayout_all"]
[relayout_c name="draconia" except=%except time=%time|0]
[relayout_c name="hagrid" except=%except time=%time|0]
[relayout_c name="malkin" except=%except time=%time|0]
[relayout_c name="ron" except=%except time=%time|0]
[relayout_c name="molly" except=%except time=%time|0]
[endmacro]

;--------------------------------------------------------------
; 劇情選項：一組選項請照這個格式寫
;   [choice_start]
;   [opt i="0" text="..." target="*a" exp="f.bond+=1"]
;   [opt i="1" text="..." target="*b"]
;   [choice_end]
;   [s]
; choice_start：中止略過／自動、畫面變暗。choice_end：依各選項實際高度等距排版。
;--------------------------------------------------------------
[macro name="choice_start"]
[iscript]
VN.choiceBegin();
[endscript]
[endmacro]

[macro name="opt"]
[iscript]
tf.L = window.vnLayout();
tf.oname = "opt_all,opt_" + mp.i;
tf.oexp = "VN.clearMsg();" + (mp.exp || "");
[endscript]
[glink color="vn_btn vn_opt" size="&tf.L.sel_size" x="&tf.L.sel_x" y="200" width="&tf.L.sel_w" text=%text target=%target exp="&tf.oexp" name="&tf.oname"]
[endmacro]

[macro name="choice_end"]
[iscript]
VN.choiceEnd();
[endscript]
[endmacro]

;--------------------------------------------------------------
; 角色「介紹自己」：在這之前名牌顯示「？？？」，這之後顯示真名
; [meet name="draconia"]（需先把角色 id 加進 vn_ui.js 的 VN.unknownUntilMet）
;--------------------------------------------------------------
[macro name="meet"]
[iscript]
f["met_" + mp.name] = 1;
[endscript]
[endmacro]

;--------------------------------------------------------------
; 場景錨點：劇本更新後，舊存檔會退回到這裡重播（而不是變成無法讀取）
; 寫法（標籤名稱與 id 必須一致，且 id 一旦使用就不要改名、不要重複）：
;   *a_shop
;   [anchor id="a_shop"]
; 規則：錨點放在「場景開頭」，後面要自己把背景、音樂、角色重新建立。
; 同一場景內增刪台詞不影響存檔。章節檔開頭、角色宣告之後要有一段「讀檔閘門」，見 ch1_01.ks。
;--------------------------------------------------------------
[macro name="anchor"]
[iscript]
VN.anchor(mp.id);
[endscript]
[endmacro]

;--------------------------------------------------------------
; 隱藏數值變化的小提示（目前劇本不使用，保留供特殊時刻使用）
; [hint text="提示文字"]
;--------------------------------------------------------------
[macro name="hint"]
[iscript]
VN.toast(mp.text);
[endscript]
[endmacro]

;--------------------------------------------------------------
; 解鎖：結局 / CG
; [unlock_end id="y1_A"]   [unlock_cg id="mirror"]
;--------------------------------------------------------------
[macro name="unlock_end"]
[iscript]
VN.unlockEnding(mp.id);
[endscript]
[endmacro]

[macro name="unlock_cg"]
[iscript]
VN.unlockCG(mp.id);
[endscript]
[endmacro]

;--------------------------------------------------------------
; 章節開頭：設定標題、顯示工具列、開始自動存檔
; [chapter_begin id="ch1_01" title="一年級・第一章　長袍店的金髮少女"]
;--------------------------------------------------------------
[macro name="chapter_begin"]
[iscript]
VN.chapterBegin(mp.id, mp.title);
[endscript]
[endmacro]

;--------------------------------------------------------------
; 章節結尾：[end_chapter id="ch1_01"]
; 主線：顯示「章末頁」並停住（按鈕在頁面上）。重玩：直接回到儲思盆。
;--------------------------------------------------------------
[macro name="end_chapter"]
[iscript]
tf.endmode = VN.endChapter(mp.id);
[endscript]
[if exp="tf.endmode=='main'"]
[s]
[endif]
[endmacro]

[return]
