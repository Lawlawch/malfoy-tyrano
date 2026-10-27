;==============================================================
; config.ks  設定畫面（由 [sleepgame] 進入，[awakegame] 返回）
; 項目：BGM 音量／效果音量／文字速度／自動速度／字體大小／未讀快進
; 每個項目用「－」「＋」按鈕調整。
;==============================================================

*start
[cm]
[clearfix]
@layopt layer="message0" visible=false
[iscript]
VN.toolbar(false);
tf.L = window.vnLayout();

// 找出最接近目前設定值的選項位置
tf.nearest = function (arr, v) {
  var best = 0, d = 1e9;
  for (var k = 0; k < arr.length; k++) {
    var dd = Math.abs(arr[k] - v);
    if (dd < d) { d = dd; best = k; }
  }
  return best;
};

tf.bgm = parseInt(TG.config.defaultBgmVolume);
tf.se = parseInt(TG.config.defaultSeVolume);
if (isNaN(tf.bgm)) tf.bgm = 100;
if (isNaN(tf.se)) tf.se = 100;

tf.chs = [50, 30, 10, 2];          // 文字顯示間隔（毫秒，越小越快）
tf.ch_names = ["慢", "普通", "快", "極快"];
tf.ch_i = tf.nearest(tf.chs, parseInt(TG.config.chSpeed));

tf.as = [2600, 1300, 700, 300];    // 自動播放等待時間（毫秒）
tf.as_names = ["慢", "普通", "快", "極快"];
tf.as_i = tf.nearest(tf.as, parseInt(TG.config.autoSpeed));

tf.fs = [0.9, 1, 1.15, 1.3];       // 字體倍率
tf.fs_names = ["小", "中", "大", "特大"];
tf.fs_i = tf.nearest(tf.fs, TG.variable.sf.vn_font_scale || 1);

tf.skip_on = (TG.config.unReadTextSkip == "true") ? 1 : 0;
[endscript]
[bg storage="parchment.jpg" time=150]

;--------------------------------------------------------------
; 一列設定的巨集（標籤文字、數值、－／＋ 按鈕）
;--------------------------------------------------------------
[macro name="cfg_row"]
[iscript]
tf.ry = tf.L.cfg_y0 + tf.L.cfg_step * parseInt(mp.r);
[endscript]
[ptext name="cfgtxt" layer="1" text=%label x="&tf.L.cfg_label_x" y="&(tf.ry + 14)" size="&tf.L.list_size" color="0x3b2a1a" bold=true]
[glink color="vn_btn" size="&tf.L.list_size" x="&tf.L.cfg_minus_x" y="&tf.ry" width="&tf.L.cfg_btn_w" text="－" target=%minus]
[ptext name="cfgtxt" layer="1" text=%value x="&tf.L.cfg_val_x" y="&(tf.ry + 14)" width="&tf.L.cfg_val_w" align="center" size="&tf.L.list_size" color="0x7a1f2b" bold=true]
[glink color="vn_btn" size="&tf.L.list_size" x="&tf.L.cfg_plus_x" y="&tf.ry" width="&tf.L.cfg_btn_w" text="＋" target=%plus]
[endmacro]

;--------------------------------------------------------------
*draw
[cm]
[free layer="1" name="cfgtxt"]
[iscript]
tf.L = window.vnLayout();
tf.txt = [
  "BGM 音量", tf.bgm + "%",
  "效果音量", tf.se + "%",
  "文字速度", tf.ch_names[tf.ch_i],
  "自動速度", tf.as_names[tf.as_i],
  "字體大小", tf.fs_names[tf.fs_i],
  "未讀快進", tf.skip_on ? "開" : "關"
];
[endscript]

[ptext name="cfgtxt" layer="1" text="設　定" x=0 y="&tf.L.page_title_y" width="&tf.L.w" align="center" size="&tf.L.page_title_size" color="0x7a1f2b" bold=true]

[cfg_row r="0" label="&tf.txt[0]" value="&tf.txt[1]" minus="*bgm_m" plus="*bgm_p"]
[cfg_row r="1" label="&tf.txt[2]" value="&tf.txt[3]" minus="*se_m" plus="*se_p"]
[cfg_row r="2" label="&tf.txt[4]" value="&tf.txt[5]" minus="*ch_m" plus="*ch_p"]
[cfg_row r="3" label="&tf.txt[6]" value="&tf.txt[7]" minus="*as_m" plus="*as_p"]
[cfg_row r="4" label="&tf.txt[8]" value="&tf.txt[9]" minus="*fs_m" plus="*fs_p"]
[cfg_row r="5" label="&tf.txt[10]" value="&tf.txt[11]" minus="*sk_t" plus="*sk_t"]

[glink color="vn_btn" size="&tf.L.sel_size" x="&tf.L.back_x" y="&tf.L.back_y" width="&tf.L.back_w" text="返　回" target="*back"]
[s]

;--------------------------------------------------------------
; 各項目的調整處理
;--------------------------------------------------------------
*bgm_m
[iscript]
tf.bgm = Math.max(0, tf.bgm - 10);
[endscript]
[bgmopt volume="&tf.bgm"]
@jump target="*draw"

*bgm_p
[iscript]
tf.bgm = Math.min(100, tf.bgm + 10);
[endscript]
[bgmopt volume="&tf.bgm"]
@jump target="*draw"

*se_m
[iscript]
tf.se = Math.max(0, tf.se - 10);
[endscript]
[seopt volume="&tf.se"]
@jump target="*draw"

*se_p
[iscript]
tf.se = Math.min(100, tf.se + 10);
[endscript]
[seopt volume="&tf.se"]
@jump target="*draw"

*ch_m
[iscript]
tf.ch_i = Math.max(0, tf.ch_i - 1);
[endscript]
[configdelay speed="&tf.chs[tf.ch_i]"]
@jump target="*draw"

*ch_p
[iscript]
tf.ch_i = Math.min(tf.chs.length - 1, tf.ch_i + 1);
[endscript]
[configdelay speed="&tf.chs[tf.ch_i]"]
@jump target="*draw"

*as_m
[iscript]
tf.as_i = Math.max(0, tf.as_i - 1);
[endscript]
[autoconfig speed="&tf.as[tf.as_i]"]
@jump target="*draw"

*as_p
[iscript]
tf.as_i = Math.min(tf.as.length - 1, tf.as_i + 1);
[endscript]
[autoconfig speed="&tf.as[tf.as_i]"]
@jump target="*draw"

*fs_m
[iscript]
tf.fs_i = Math.max(0, tf.fs_i - 1);
TG.variable.sf.vn_font_scale = tf.fs[tf.fs_i];
VN.saveSf();
[endscript]
@jump target="*draw"

*fs_p
[iscript]
tf.fs_i = Math.min(tf.fs.length - 1, tf.fs_i + 1);
TG.variable.sf.vn_font_scale = tf.fs[tf.fs_i];
VN.saveSf();
[endscript]
@jump target="*draw"

*sk_t
[iscript]
tf.skip_on = tf.skip_on ? 0 : 1;
tf.skip_str = tf.skip_on ? "true" : "false";
[endscript]
[config_record_label skip="&tf.skip_str"]
@jump target="*draw"

;--------------------------------------------------------------
; 返回（回到休眠前的畫面；版面與工具列由 make.ks 還原）
;--------------------------------------------------------------
*back
[cm]
[free layer="1" name="cfgtxt"]
[clearstack]
[awakegame]
