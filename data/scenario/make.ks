;==============================================================
; make.ks  讀檔（含自動存檔、設定畫面返回）之後會被呼叫的特別檔案
; 作用：讓版面符合「目前」的螢幕方向，並還原工具列狀態。
; 必須以 [return] 結尾。
;==============================================================

[call storage="resizecall.ks"]

[iscript]
if (f.on_title == 1) {
  VN.toolbar(false);
} else {
  VN.toolbar(true);
  VN.track = true;
  VN.applyFont();
  VN.restoreLine();        // 從「句子開頭」的快照讀回（自動存檔、打字中存的檔）：把這一句補回對話框
}
VN.applyCfg(false);
[endscript]

[return]
