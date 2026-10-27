;==============================================================
; title.ks  首頁
; 首頁本身是網頁元素（others/vn_screens.js 的 VN.home），這裡只負責
; 重設狀態、換背景，然後停住等待玩家按選單。
;==============================================================

[cm]
@clearstack
[hidemenubutton]
[chara_hide_all time=0]
[iscript]
f.on_title = 1;
f.page = "title";
f.stage = [];
VN.toolbar(false);
[endscript]
@layopt layer="message0" visible=false
[bg storage="title.jpg" time=300]
[iscript]
VN.home.show();
[endscript]
[s]
