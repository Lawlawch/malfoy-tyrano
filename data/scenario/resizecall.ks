;==============================================================
; resizecall.ks  橫直向切換時自動被呼叫的版面腳本
; 注意：這個檔案只改「畫面」，不可以動劇情進度與遊戲數值。
; 最後必須 [return]。
;==============================================================

[iscript]
tf.L = window.vnLayout();
tf.chara_name_str = $(".chara_name_area").text();
[endscript]

;解像度（橫向 1280x720 / 直向 720x1280）
[body scWidth="&tf.L.w" scHeight="&tf.L.h"]

;角色名稱欄（酒紅色）
[free layer="message0" name="chara_name_area"]
[ptext name="chara_name_area" text="&tf.chara_name_str" layer="message0" color="0x7a1f2b" size="&tf.L.name_size" bold=true x="&tf.L.name_x" y="&tf.L.name_y"]

;對話框（外觀由 vn_theme.css 的羊皮紙樣式決定）
[position layer="message0" left="&tf.L.msg_left" top="&tf.L.msg_top" width="&tf.L.msg_w" height="&tf.L.msg_h" page=fore visible=true opacity=235 border_size=3 border_color="0x8a6a1f" radius=16]
[position layer="message0" page=fore margint="&tf.L.m_t" marginl="&tf.L.m_l" marginr="&tf.L.m_r" marginb="&tf.L.m_b"]

;標題畫面等非遊戲場景時不顯示對話框
[if exp="f.on_title==1"]
[layopt layer="message0" visible=false]
[endif]

;在場的立繪重新定位（有新角色就在這裡加一行）
[relayout_all]

[if exp="f.on_title!=1"]
;劇情選項按鈕：依實際高度重新等距排版
[iscript]
VN.layoutChoices(0);
[endscript]
[endif]
[iscript]
VN.placePlate();
[endscript]

;字體：大小、顏色（深墨色，配合羊皮紙對話框）、字型
[iscript]
$(".message_inner").find("span").css("font-size", tf.L.font + "px");
[endscript]
[deffont size="&tf.L.font" color="0x3b2a1a"]
[resetfont]

[wait time=200]

[return]
