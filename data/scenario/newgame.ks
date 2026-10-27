;==============================================================
; newgame.ks  新遊戲時重設狀態（以 [call] 呼叫）
;==============================================================

[iscript]
f.on_title = 0;
f.page = "";
f.stage = [];
f.bond = 0;
f.courage = 0;
f.wit = 0;
f.shadow = 0;
f.chapter_title = "";
VN.clearAutosave();
VN.resetLog();
[endscript]

[return]
