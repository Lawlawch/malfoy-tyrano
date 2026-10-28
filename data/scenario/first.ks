;==============================================================
; first.ks  最先執行的檔案（初始化）
;==============================================================

[title name="月光下的馬份：蛇與獅之間"]

[stop_keyconfig]

;Tyrano 內建的系統功能庫（存檔、設定、CG 等）
@call storage="tyrano.ks"

;預設訊息層先隱藏，由各章節自行開啟
@layopt layer="message" visible=false
[hidemenubutton]

;立繪座標由我們自己控制，所以關閉自動配置
[chara_config pos_mode="false"]

;--------------------------------------------------------------
; 系統設定（執行時覆蓋 Config.tjs，不用手動改 Config.tjs）
;--------------------------------------------------------------
[iscript]
TG.config.autoRecordLabel = "false";    // 已讀記錄改由 vn_ui.js 逐句處理，不用 Tyrano 的標籤式已讀
TG.config.alreadyReadTextColor = "default"; // 已讀文字不變色（預設會變淺藍）
[endscript]

;--------------------------------------------------------------
; 介面主題與自訂系統
;--------------------------------------------------------------
[loadcss file="./data/others/vn_theme.css"]
[loadcss file="./data/others/vn_screens.css"]
[loadjs storage="vn_ui.js"]
[loadjs storage="vn_screens.js"]

;--------------------------------------------------------------
; 版面設定函式（直向 / 橫向兩套參數都集中在這裡）
; 之後要微調版面，只需要改這一段。
;--------------------------------------------------------------
[iscript]
window.vnLayout = function () {
  var land = $.getLargeScreenWidth();
  var fsc = 1;
  try { fsc = TYRANO.kag.variable.sf.vn_font_scale || 1; } catch (e) {}
  var F = function (n) { return Math.round(n * fsc); };
  if (land) {
    // 橫向 1280 x 720
    return {
      land: true, w: 1280, h: 720,
      font: F(28), name_size: F(28), name_x: 180, name_y: 508,
      msg_left: 160, msg_top: 500, msg_w: 1000, msg_h: 200,
      m_t: 55, m_l: 50, m_r: 70, m_b: 40,
      chara_w: 320, chara_top: 30,
      slot_left: 120, slot_center: 420, slot_right: 720,
      sel_x: 360, sel_w: 560, sel_y0: 120, sel_step: 100, sel_size: 28,
      title_y: 120, title_size: 80, sub_size: 40,
      tbtn_y0: 330, tbtn_step: 64, tbtn_size: 26, tbtn_x: 440, tbtn_w: 400,
      page_title_y: 40, page_title_size: 46,
      list_y0: 130, list_step: 66, list_size: 28, list_x: 180, list_w: 920,
      cfg_label_x: 160, cfg_minus_x: 640, cfg_val_x: 740, cfg_val_w: 200, cfg_plus_x: 950, cfg_btn_w: 90,
      cfg_y0: 110, cfg_step: 78, back_x: 440, back_w: 400, back_y: 628,
      ch_cols: 2, ch_x0: 80, ch_x1: 660, ch_w: 540, ch_y0: 150, ch_step: 88, ch_size: 26,
      next_x: 200, next_y: 628, next_w: 420, gback_x: 660, gback_y: 628, gback_w: 420
    };
  } else {
    // 直向 720 x 1280
    return {
      land: false, w: 720, h: 1280,
      font: F(36), name_size: F(36), name_x: 90, name_y: 872,
      msg_left: 40, msg_top: 840, msg_w: 640, msg_h: 400,
      m_t: 80, m_l: 50, m_r: 60, m_b: 40,
      chara_w: 470, chara_top: 90,
      slot_left: 10, slot_center: 40, slot_right: 70,
      sel_x: 60, sel_w: 600, sel_y0: 260, sel_step: 150, sel_size: 36,
      title_y: 220, title_size: 76, sub_size: 40,
      tbtn_y0: 600, tbtn_step: 100, tbtn_size: 34, tbtn_x: 110, tbtn_w: 500,
      page_title_y: 90, page_title_size: 50,
      list_y0: 220, list_step: 100, list_size: 32, list_x: 50, list_w: 620,
      cfg_label_x: 40, cfg_minus_x: 330, cfg_val_x: 420, cfg_val_w: 130, cfg_plus_x: 560, cfg_btn_w: 90,
      cfg_y0: 190, cfg_step: 130, back_x: 110, back_w: 500, back_y: 1130,
      ch_cols: 1, ch_x0: 50, ch_x1: 50, ch_w: 620, ch_y0: 190, ch_step: 84, ch_size: 30,
      next_x: 110, next_y: 1040, next_w: 500, gback_x: 110, gback_y: 1140, gback_w: 500
    };
  }
};
[endscript]

;--------------------------------------------------------------
; 共用巨集
;--------------------------------------------------------------
[call storage="macros.ks"]

;--------------------------------------------------------------
; 遊戲狀態（第一次啟動時的預設值；新遊戲時會在 title.ks 重設）
;--------------------------------------------------------------
[iscript]
f.stage = [];      // 目前在場的角色（依登場順序，自動排位）
f.on_title = 1;
f.page = "";
f.debug = 1;       // 1 = 章節結尾顯示隱藏數值（正式版請改成 0）
f.bond = 0;        // 羈絆（與馬份）
f.courage = 0;     // 勇氣
f.wit = 0;         // 機智
f.shadow = 0;      // 暗影
f.chapter_title = "";
[endscript]

;先套用一次版面，再登記「螢幕比例改變時自動重新排版」
[call storage="resizecall.ks"]
[set_resizecall storage="resizecall.ks"]

@jump storage="title.ks"

[s]
