/* =============================================================
   vn_ui.js  自訂介面與系統
   由 first.ks 以 [loadjs storage="vn_ui.js"] 載入。
   內容：章節資料、解鎖、每句自動存檔、工具列、確認視窗、紀錄畫面、
         角色名牌、說話者高亮、選項排版與背景變暗。
   ============================================================= */
(function () {
  var TG = TYRANO.kag;
  var VN = (window.VN = window.VN || {});

  VN._autosaveBusy = false;

  /* ---------- 章節清單 ---------- */
  VN.chapters = [
    { id: "ch1_01", n: 1,  title: "長袍店的金髮少女", file: "ch1_01.ks" },
    { id: "ch1_02", n: 2,  title: "九又四分之三月台", file: "ch1_02.ks" },
    { id: "ch1_03", n: 3,  title: "分院儀式", file: "ch1_03.ks" },
    { id: "ch1_04", n: 4,  title: "地窖與禁止的走廊", file: "ch1_04.ks" },
    { id: "ch1_05", n: 5,  title: "飛行課與午夜決鬥", file: "ch1_05.ks" },
    { id: "ch1_06", n: 6,  title: "萬聖節的巨怪", file: "ch1_06.ks" },
    { id: "ch1_07", n: 7,  title: "魁地奇首戰", file: "ch1_07.ks" },
    { id: "ch1_08", n: 8,  title: "聖誕節與厄里斯魔鏡", file: "ch1_08.ks" },
    { id: "ch1_09", n: 9,  title: "挪威脊背龍與禁林", file: "ch1_09.ks" },
    { id: "ch1_10", n: 10, title: "魔法石的守護", file: "ch1_10.ks" }
  ];

  /* ---------- 說話者資料（頭像）----------
     key = [chara_new] 的角色 id，或 #後面直接寫的名字（例如第一人稱「哈利」）。
     頭像檔放在 data/others/avatar/，每個角色一張。 */
  VN.avatars = { draconia: "draconia", hagrid: "hagrid", malkin: "malkin", ron: "ron", molly: "molly", "哈利": "harry", unknown: "unknown", "？？？": "unknown" };
  VN.avatarUrl = function (key) {
    return "./data/others/avatar/" + (VN.avatars[key] || "harry") + ".png";
  };
  // 這些角色在劇本用 [meet name="角色id"] 介紹自己之前，名牌顯示「？？？」、頭像用剪影。
  // 之後新角色若第一次出現時沒有被介紹，把角色 id 加進這個清單即可。
  VN.unknownUntilMet = ["draconia", "ron", "molly"];
  VN.speaker = function () {
    var sp = TG.stat.current_speaker || "";
    if (!sp) return null;
    var c = TG.stat.charas && TG.stat.charas[sp];
    var name = c ? c.jname : sp, avatar = sp;
    if (c && VN.unknownUntilMet.indexOf(sp) >= 0 && !TG.stat.f["met_" + sp]) { name = "？？？"; avatar = "unknown"; }
    return { key: sp, name: name, avatar: avatar };
  };

  // 劇本版本：章節劇本有改動就把這個字串改掉。版本不同的存檔不會被擋下，
  // 而是走「錨點相容讀檔」（退回場景錨點或章節開頭重播）。
  VN.SAVE_VERSION = "v8.5";   // 劇本版本：章節劇本有改動就可以升（舊存檔會走「錨點相容讀檔」，不會失效）
  VN.SAVE_FORMAT = 2;          // 存檔格式：只有存檔資料結構改了才升（不同格式的存檔無法讀取）

  /* ---------- sf（系統變數）工具 ---------- */
  VN.saveSf = function () {
    try { TG.saveSystemVariable(); } catch (e) { console.warn("saveSf", e); }
  };
  VN.unlockChapter = function (id) {
    var sf = TG.variable.sf; sf.vn_ch = sf.vn_ch || {}; sf.vn_ch[id] = 1; VN.saveSf();
  };
  VN.unlockEnding = function (id) {
    var sf = TG.variable.sf; sf.vn_end = sf.vn_end || {}; sf.vn_end[id] = 1; VN.saveSf();
  };
  VN.unlockCG = function (id) {
    var sf = TG.variable.sf; sf.vn_cg = sf.vn_cg || {}; sf.vn_cg[id] = 1; VN.saveSf();
  };

  /* ---------- 自動存檔 ---------- */
  VN.clearAutosave = function () {
    try { $.removeStorageWeb(TG.config.projectID + "_tyrano_auto_save"); } catch (e) {}
    try { TG.variable.sf.system.autosave = false; } catch (e) {}
    try { delete TG.variable.sf.vn_auto_ver; delete TG.variable.sf.vn_auto_fmt; } catch (e) {}
  };
  // 把最近一句對話的快照寫成自動存檔。只在「章節開頭」與「進入選項」時呼叫。
  VN.commitAutosave = function () {
    if (!VN.track || !VN._lastAuto) return;
    try {
      TG.menu.snap = VN._lastAuto.snap;            // doSetAutoSave 會用 TG.menu.snap
      TG.menu.doSetAutoSave();
      var sf0 = TG.variable.sf;
      sf0.system.autosave = true;
      sf0.vn_auto_ver = VN.SAVE_VERSION; sf0.vn_auto_fmt = VN.SAVE_FORMAT;
      VN.saveSf();
    } catch (err) { console.warn("vn autosave failed", err); }
  };
  VN.resetLog = function () { VN.log = []; };
  VN.log = [];

  /* ---------- 小工具 ---------- */
  function ensureStopAuto() {
    try { TG.ftag.startTag("autostop", { next: "false" }); } catch (e) {}
  }
  function stopSkipAuto() {
    try { TG.setSkip(false); } catch (e) {}
    try { TG.setAuto(false); } catch (e) {}
  }
  // 讓覆蓋層吃掉所有點擊，不讓底下的遊戲畫面收到
  function swallow($el) {
    // 含 touchmove：Tyrano 會攔截觸控滑動（為了防止頁面跟著捲），擋在這裡面板才能自己捲動
    $el.on("click mousedown mouseup touchstart touchend touchmove pointerdown pointerup contextmenu wheel", function (e) { e.stopPropagation(); });
  }
  // 可靠的「點一下」：滑鼠用 click；觸控／手寫筆用 pointerup（避免 Tyrano 攔截 touchend 後 click 不觸發）
  $.fn.vntap = function (fn) {
    var last = 0;
    return this.on("pointerup click", function (e) {
      if (e.type === "pointerup") {
        var pt = e.originalEvent && e.originalEvent.pointerType;
        if (pt === "mouse") { return; }
        if (e.originalEvent && e.originalEvent.button > 0) { return; }
      }
      var now = Date.now();
      if (now - last < 700) { return; }
      last = now;
      if (e.type === "pointerup") { VN._touchTapAt = now; }      // 觸控：記下時間，供下面擋掉「補送的點擊」
      e.stopPropagation();
      fn.call(this, e);
    });
  };
  // 手機放開手指後會再補送一次 click；若這次點擊落在剛出現／剛消失的畫面上會誤觸。
  // 觸控點擊處理完的 0.5 秒內，所有 click 一律吞掉。
  if (!VN._ghostGuard) {
    VN._ghostGuard = true;
    window.addEventListener("click", function (e) {
      if (Date.now() - (VN._touchTapAt || 0) < 500) { e.stopPropagation(); e.preventDefault(); }
    }, true);
  }
  // 停用 Tyrano 內建的鍵盤操作：空白鍵（隱藏對話框）、WASD／方向鍵（虛擬游標）等，只保留 Enter＝下一句
  try {
    TG.key_mouse.map_key = { "Enter": "next", "13": "next" };
    // 滑鼠只保留：右鍵＝隱藏對話框、滾輪向下＝下一句、滾輪向上＝紀錄；手機手勢全部停用
    TG.key_mouse.map_mouse = { "right": "hidemessage", "wheel_down": "next", "wheel_up": "backlog" };
    TG.key_mouse.map_ges = {};
    TG.config.useKeyFocus = "false";
    TG.config.keyFocusWithMouseCursor = "false";
  } catch (e) { console.warn("keyconfig override", e); }
  VN.swallow = swallow;
  VN.stopSkipAuto = stopSkipAuto;
  VN.hideBoot = function () {            // 隱藏 index.html 的「載入中」畫面
    var b = document.getElementById("vn_boot");
    if (b) { b.className = "hide"; setTimeout(function () { if (b.parentNode) { b.parentNode.removeChild(b); } }, 600); }
  };

  /* ---------- 已讀記錄（逐句，取代 Tyrano 的標籤式已讀）----------
     每顯示一句對白，就用「章節＋這句文字」算出短代碼，存進 sf.vn_read[章節id]（以逗號分隔的字串）。
     判斷完全不看標籤、錨點或行號：劇本改動後，沒改過的句子仍是已讀，只有被改過的句子變回未讀。 */
  var _readSets = {}, _readDirty = 0;
  function readHash(s) {
    var h1 = 5381, h2 = 52711, i, c;
    for (i = 0; i < s.length; i++) { c = s.charCodeAt(i); h1 = ((h1 * 33) ^ c) >>> 0; h2 = ((h2 * 31) + c) >>> 0; }
    return (h1 >>> 2).toString(36) + (h2 >>> 14).toString(36);
  }
  function readSet(ch) {
    var sf = TG.variable.sf; sf.vn_read = sf.vn_read || {};
    var str = sf.vn_read[ch] || "";
    var cache = _readSets[ch];
    if (!cache || cache.str !== str) {
      var set = {}; if (str) { str.split(",").forEach(function (k) { set[k] = 1; }); }
      cache = _readSets[ch] = { set: set, str: str };
    }
    return cache;
  }
  // 回傳「這句在記錄之前是否已讀」，並把它記為已讀
  VN.readMark = function (ch, text) {
    var key = readHash(ch + "|" + String(text).replace(/\s+/g, " ").trim());
    var cache = readSet(ch);
    if (cache.set[key]) { return true; }
    cache.set[key] = 1;
    var sf = TG.variable.sf;
    sf.vn_read[ch] = cache.str ? cache.str + "," + key : key;
    cache.str = sf.vn_read[ch];
    if (++_readDirty >= 15) { _readDirty = 0; VN.saveSf(); }
    return false;
  };
  // 讀取自動存檔後直接進入選項時，對話框是空的：把存檔裡記的最後一句補回去
  VN.restoreLine = function () {
    var line = VN._restoreLine; VN._restoreLine = null;
    if (!line) return;
    try {
      var $in = $(".message0_fore .message_inner");
      if (!$in.length || $.trim($in.text())) return;
      var L = window.vnLayout();
      $in.append($('<span class="current_span"></span>').html(line).css({ fontSize: L.font + "px" }));
      VN.updatePlate(VN.speaker());
    } catch (e) { console.warn("restoreLine", e); }
  };
  VN.clearMsg = function () {            // 選了選項之後清掉對話框（選項出現時對話框保留最後一句）
    try { TG.layer.clearMessageInnerLayerAll(); } catch (e) {}
    try { TG.ftag.hideNextImg(); } catch (e) {}
  };
  VN.ensureStopAuto = ensureStopAuto;
  VN.plain = function (h) { try { return $("<div>").html(h || "").text(); } catch (e) { return h || ""; } };
  VN.nowStr = function () {
    var d = new Date(), p = function (n) { return n < 10 ? "0" + n : "" + n; };
    return d.getFullYear() + "/" + p(d.getMonth() + 1) + "/" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  };
  VN.makeMeta = function (line) {
    var f = TG.stat.f;
    return { time: VN.nowStr(), fmt: VN.SAVE_FORMAT, chapter: f.chapter_title || "", line: VN.plain(line).replace(/\s+/g, " ").slice(0, 40) };
  };
  // 有任何自製視窗開著時，擋住鍵盤，避免按 Enter／空白鍵讓底下的劇情前進
  VN.overlayOpen = function () { return $(".vn_scr, #vn_log, #vn_confirm, #vn_end").length > 0; };
  if (!VN._keyGuard) {
    VN._keyGuard = true;
    window.addEventListener("keydown", function (e) {
      if (!VN.overlayOpen()) return;
      e.stopPropagation();
      if (e.key === "Escape") {
        if ($("#vn_confirm").length) { $("#vn_confirm .vn_cf_no").click(); }
        else if ($("#vn_log").length) { $("#vn_log").remove(); }
        else if ($(".vn_scr .vn_close_btn").length) { $(".vn_scr .vn_close_btn").first().click(); }
      }
    }, true);
  }

  /* ---------- 提示（toast，供隱藏數值提示使用）---------- */
  var toastTimer = null;
  VN.toast = function (text) {
    var $t = $("#vn_toast");
    if (!$t.length) return;
    $t.text(text).addClass("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $t.removeClass("show"); }, 2600);
  };

  /* ---------- 統一風格的確認視窗（取代瀏覽器內建 confirm）----------
     VN.confirm({title, sub, ok, cancel}, onOk, onCancel) */
  VN.confirm = function (o, onOk, onCancel) {
    stopSkipAuto(); ensureStopAuto();
    $("#vn_confirm").remove();
    var $o = $(
      '<div id="vn_confirm"><div class="vn_cf_box">' +
      '<div class="vn_cf_title"></div><div class="vn_cf_sub"></div>' +
      '<div class="vn_cf_btns"><span class="vn_cf_btn vn_cf_no"></span><span class="vn_cf_btn vn_cf_yes"></span></div>' +
      "</div></div>"
    );
    $o.find(".vn_cf_title").text(o.title || "");
    if (o.sub) { $o.find(".vn_cf_sub").text(o.sub); } else { $o.find(".vn_cf_sub").hide(); }
    $o.find(".vn_cf_no").text(o.cancel || "取消");
    $o.find(".vn_cf_yes").text(o.ok || "確定");
    if (o.single) { $o.find(".vn_cf_no").hide(); }
    swallow($o);
    function close() { $o.remove(); }
    $o.find(".vn_cf_no").vntap(function () { close(); if (onCancel) onCancel(); });
    $o.find(".vn_cf_yes").vntap(function () { close(); if (onOk) onOk(); });
    $("#tyrano_base").append($o);
  };

  VN.goTitle = function () {
    if ("appJsInterface" in window) { appJsInterface.finishGame(); }
    else if (typeof TyranoPlayer == "function") { webkit.messageHandlers.backHandler.postMessage("endgame"); }
    else { location.href = "./index.html"; }
  };

  /* ---------- 角色名牌（對話框左上角，重疊在框上）---------- */
  VN.placePlate = function () {
    var L = window.vnLayout();
    $("#vn_plate").css({
      left: L.msg_left + 30,
      top: L.msg_top,
      fontSize: Math.round(L.name_size * 0.92) + "px"
    });
    $("#vn_frame").css({ left: L.msg_left, top: L.msg_top, width: L.msg_w, height: L.msg_h });
  };
  VN.updatePlate = function (info) {
    var $p = $("#vn_plate");
    if (!$p.length) return;
    var f = TG.stat.f;
    var $fr = $("#vn_frame");
    if (f.on_title == 1) { $p.removeClass("on"); $fr.removeClass("on"); return; }
    // 有說話者 → 對話框（有名牌）；沒有 → 旁白框（用 # 空名稱的行）
    $("#tyrano_base").toggleClass("vn-nar", !info);
    $fr.toggleClass("nar", !info).addClass("on");
    if (!info) { $p.removeClass("on"); VN.placePlate(); return; }
    $p.text(info.name).addClass("on");
    VN.placePlate();
  };

  /* ---------- 說話者高亮：多人在場時，沒在說話的稍微變暗 ---------- */
  VN.applyFocus = function (sp) {
    var st = TG.stat.f.stage;
    if (!$.isArray(st)) return;
    var dimOthers = st.length >= 2 && st.indexOf(sp) >= 0;
    st.forEach(function (n) {
      var $c = TG.chara.getCharaContainer(n);
      $c.css({ transition: "filter 0.25s", filter: (dimOthers && n !== sp) ? "brightness(0.55)" : "none" });
    });
  };

  /* ---------- 立繪自動排位 ----------
     names = 在場角色（依登場順序），回傳該角色的 left/top/width */
  VN.stagePos = function (names, name) {
    var L = window.vnLayout();
    var n = names.length, i = names.indexOf(name);
    if (i < 0) return null;
    var cs, k;
    if (L.land) {
      cs = [[0.5], [0.33, 0.67], [0.22, 0.5, 0.78]][Math.min(n, 3) - 1];
      k = [1, 1, 0.92][Math.min(n, 3) - 1];
    } else {
      cs = [[0.5], [0.3, 0.7], [0.2, 0.5, 0.8]][Math.min(n, 3) - 1];
      k = [1, 0.72, 0.55][Math.min(n, 3) - 1];
    }
    var w = Math.round(L.chara_w * k);
    var cx = Math.round(L.w * (cs[i] !== undefined ? cs[i] : 0.5));
    return { left: cx - Math.round(w / 2), top: L.chara_top, width: w };
  };

  /* ---------- 紀錄 ---------- */
  VN.pushLog = function (info, html) {
    if (!html) return;
    var last = VN.log[VN.log.length - 1];
    var nm = info ? info.name : "";
    if (last && last.name === nm && last.text === html) return;   // 讀檔重放同一句時不重複記
    VN.log.push({ name: nm, key: info ? (info.avatar || info.key) : "", text: html });
    if (VN.log.length > 300) VN.log.shift();
  };

  VN.openLog = function () {
    stopSkipAuto(); ensureStopAuto();
    $("#vn_log").remove();
    var $o = $(
      '<div id="vn_log" class="vn_sys"><div class="vn_sys_panel">' +
      '<div class="vn_sys_head"><span class="vn_sys_title">紀　錄</span><span class="vn_close_btn">×</span></div>' +
      '<div class="log_body"></div></div></div>'
    );
    var $body = $o.find(".log_body");
    if (!VN.log.length) { $body.append('<div class="vn_empty">（目前沒有紀錄）</div>'); }
    VN.log.forEach(function (r) {
      var $row = $('<div class="vn_log_row"></div>');
      var $av = $('<div class="vn_log_av"></div>');
      var $main = $('<div class="vn_log_main"></div>');
      if (r.name) {
        $av.append($('<img alt="">').attr("src", VN.avatarUrl(r.key)));
        $main.append($('<div class="vn_log_name"></div>').text(r.name));
      }
      $main.append($('<div class="vn_log_text"></div>').html(r.text));
      $row.append($av).append($main);
      $body.append($row);
    });
    swallow($o);
    $o.find(".vn_close_btn").vntap(function () { $o.remove(); });
    $("#tyrano_base").append($o);
    $body.scrollTop($body[0].scrollHeight);
  };
  // 滑鼠滾輪／快捷鍵原本會叫出內建回看，一律改成我們的紀錄
  TG.menu.displayLog = function () { VN.openLog(); };
  TG.menu.displaySave = function () { if (VN.openPanel) { VN.openPanel("save"); } };
  TG.menu.displayLoad = function () { if (VN.openPanel) { VN.openPanel("load"); } };

  /* ---------- 選項：變暗、依實際高度等距排版 ---------- */
  VN.choiceBegin = function () {
    stopSkipAuto();                      // 出現選項即中止略過／自動，選完也不會恢復
    VN.restoreLine();
    VN.commitAutosave();                 // 進入選項：寫入「繼續」用的自動存檔
    VN.saveSf();                         // 順便把已讀記錄存起來
    var $fl = TG.layer.getFreeLayer();
    $("#vn_dim").remove();
    var L = window.vnLayout();
    $fl.append($('<div id="vn_dim"></div>').css({ width: L.w, height: L.h }));
    $fl.show();
  };
  VN.choiceUndim = function () { $("#vn_dim").remove(); };

  VN.layoutChoices = function (retry) {
    var $b = $(".glink_button.vn_opt");
    if (!$b.length) return;
    var L = window.vnLayout();
    $("#vn_dim").css({ width: L.w, height: L.h });
    var gap = L.land ? 22 : 32;
    var top = L.land ? 80 : 150, bottom = L.land ? 640 : 960;
    var avail = bottom - top;
    var size = L.sel_size;
    var bw = Math.min(L.land ? 700 : 620, L.w - 80);            // 含內距與邊框的總寬度，左右置中
    $b.css({ boxSizing: "border-box", left: Math.round((L.w - bw) / 2), width: bw, fontSize: size + "px" });
    function total() {
      var t = gap * ($b.length - 1);
      $b.each(function () { t += $(this).outerHeight(); });
      return t;
    }
    var t = total();
    if (t <= gap * ($b.length - 1) && (retry || 0) < 10) {          // 還沒渲染好，稍後再排
      setTimeout(function () { VN.layoutChoices((retry || 0) + 1); }, 50);
      return;
    }
    var guard = 0;
    while (t > avail && size > 18 && guard < 10) {                // 太高就縮小字體
      size = Math.floor(size * 0.92);
      $b.css("font-size", size + "px");
      t = total(); guard++;
    }
    var y = top + Math.max(0, (avail - t) / 2);
    $b.each(function () {
      var $e = $(this);
      $e.css("top", y + "px");
      y += $e.outerHeight() + gap;
    });
  };
  VN.choiceEnd = function () {
    VN.layoutChoices(0);
    setTimeout(function () { VN.layoutChoices(0); }, 150);        // 字型載入後再校正一次
  };

  /* ---------- 事件掛接（只掛一次）---------- */
  if (VN._hooked) { try { TG.off("tag-text-message.vnui"); TG.off("tag-text-message.vnautosave"); TG.off("click-tag-glink.vnui"); TG.off("messagewindow-hide.vnui"); TG.off("messagewindow-show.vnui"); } catch (e) {} }
  VN._hooked = true;

  /* ---------- 文字太長時，自動縮小這一句的字級，確保不超出對話框 ---------- */
  VN.fitFont = function (html, narr) {
    try {
      var L = window.vnLayout();
      var w = L.msg_w - L.m_l - L.m_r, h = L.msg_h - L.m_t - L.m_b;
      var size = L.font, min = Math.round(L.font * 0.72);
      var $d = $('<div></div>').css({ position: "absolute", left: 0, top: 0, visibility: "hidden", width: w + "px",
        fontFamily: "'VN Serif', serif", letterSpacing: narr ? "0.07em" : "0.04em", lineHeight: narr ? 1.65 : 1.6, wordBreak: "normal" });
      $("body").append($d);
      $d.text(VN.plain(html));
      while (size > min) {
        $d.css("fontSize", size + "px");
        if ($d.get(0).getBoundingClientRect().height <= h) break;
        size -= 2;
      }
      $d.remove();
      return size;
    } catch (e) { return null; }
  };

  // 每次顯示一句對話
  TG.on("tag-text-message.vnui", function (e) {
    try {
      var f = TG.stat.f;
      var pm = (e && e.target) || {};
      var info = VN.speaker();
      VN.updatePlate(info);
      if (f.on_title == 1) return;
      var fs = VN.fitFont(pm.val, !info);
      if (fs) { TG.stat.font.size = fs; }
      if (f.vn_chapter && VN.track) {
        var was = VN.readMark(f.vn_chapter, VN.plain(pm.val));
        var only = true; try { only = !!VN.cfg().skipRead; } catch (e2) {}
        if (!was && only && TG.stat.is_skip) { try { TG.setSkip(false); } catch (e3) {} }   // 遇到未讀的句子：停止略過
      }
      VN.applyFocus(info ? info.key : "");
      VN.pushLog(info, pm.val);
    } catch (err) { console.warn("vn text hook", err); }
  });

  // 每句對話在記憶體中保留一份快照（不含縮圖，不寫入儲存空間）。這時 current_order_index 指向目前這一句。
  // 真正寫入自動存檔只有兩個時機：章節第一句（VN._autoNow）與進入選項（choiceBegin）。
  // VN.track = 在章節中
  TG.on("tag-text-message.vnautosave", function (e) {
    if (!VN.track || VN._autosaveBusy) return;
    try {
      if (TG.stat.f.on_title == 1) return;
      var sc = TG.stat.current_scenario || "";
      if (sc.indexOf("ch") !== 0) return;      // 只在章節檔內存
      VN._autosaveBusy = true;
      var title = TG.stat.f.chapter_title || "";
      var line = ((e && e.target) || {}).val || "";
      TG.menu.snapSave("<span>" + title + "</span>", function () {
        TG.menu.snap.vn_ver = VN.SAVE_VERSION; TG.menu.snap.vn_fmt = VN.SAVE_FORMAT;
        TG.menu.snap.vn_line = line;          // 自動存檔是在「這句開始」時拍的，讀取後要靠這個把最後一句補回對話框
        VN._lastAuto = { snap: TG.menu.snap, meta: VN.makeMeta(line) };
        if (VN._autoNow) { VN._autoNow = false; VN.commitAutosave(); }   // 章節第一句
        VN._autosaveBusy = false;
      }, "false");
    } catch (err) {
      VN._autosaveBusy = false;
      console.warn("vn autosave failed", err);
    }
  });

  // 對話框被隱藏（右鍵／工具列「隱藏」）時，名牌一起隱藏
  TG.on("messagewindow-hide.vnui", function () { $("#vn_plate, #vn_frame").addClass("hid"); });
  TG.on("messagewindow-show.vnui", function () { $("#vn_plate, #vn_frame").removeClass("hid"); });

  // 按下任何選項：解除變暗
  TG.on("click-tag-glink.vnui", function () { VN.choiceUndim(); });

  /* ---------- 工具列 ---------- */
  var actions = {
    log: function () { VN.openLog(); },
    auto: function () {
      if (TG.stat.is_auto) { TG.setAuto(false); }
      else {
        if (TG.layer.layer_event.isDisplayed()) { TG.layer.layer_event.click(); }
        TG.setAuto(true);
      }
    },
    skip: function () {
      if (TG.stat.is_skip) { TG.setSkip(false); }
      else {
        if (TG.layer.layer_event.isDisplayed()) { TG.layer.layer_event.click(); }
        TG.setSkip(true);
      }
    },
    hide: function () {
      if (TG.stat.is_strong_stop) { return; }                    // 選項畫面不能隱藏（與 Tyrano 原本行為一致）
      if (TG.stat.is_hide_message) { TG.layer.showMessageLayers(); }
      else { TG.ftag.startTag("hidemessage"); }
    },
    save: function () { VN.openPanel("save"); },
    load: function () { VN.openPanel("load"); },
    config: function () { VN.openPanel("config"); },
    title: function () {
      VN.confirm(
        { title: "返回標題畫面？", sub: "將從最近的自動存檔點繼續。", ok: "返回標題", cancel: "取消" },
        function () { VN.goTitle(); }
      );
    }
  };

  var labels = [
    ["auto", "自動"], ["skip", "略過"], ["log", "紀錄"], ["hide", "隱藏"],
    ["save", "存檔"], ["load", "讀檔"], ["config", "設定"], ["title", "標題"]
  ];

  function buildToolbar() {
    if ($("#vn_toolbar").length) return;
    var $bar = $('<div id="vn_toolbar"><div class="vn_strip"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i></div></div>');
    var $strip = $bar.find(".vn_strip");
    labels.forEach(function (pair, idx) {
      if (idx) { $strip.append('<s></s>'); }
      var $b = $('<button type="button" data-act="' + pair[0] + '">' + pair[1] + "</button>");
      $b.on("click touchend", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "touchend") { $b.data("touched", Date.now()); }
        else if ($b.data("touched") && Date.now() - $b.data("touched") < 500) { return; }
        try { actions[pair[0]](); } catch (err) { console.warn("toolbar", pair[0], err); }
      });
      $strip.append($b);
    });
    $("#tyrano_base").append($bar);
    $("#tyrano_base").append('<div id="vn_toast"></div>');
    $("#tyrano_base").append('<div id="vn_frame"><div class="f1"></div><div class="f2"></div><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><b></b></div>');
    $("#tyrano_base").append('<div id="vn_plate"></div>');
  }

  VN.toolbar = function (on) {
    buildToolbar();
    $("#vn_toolbar").toggleClass("on", !!on);
    if (!on) {
      VN.track = false;
      $("#vn_toast").removeClass("show");
      $("#vn_plate").removeClass("on");
      $("#vn_frame").removeClass("on");
      VN.choiceUndim();
    }
  };

  // 同步「自動／略過」按鈕狀態，並在系統畫面開啟時暫時隱藏工具列
  if (VN._timer) { clearInterval(VN._timer); }
  VN._timer = setInterval(function () {
    var $bar = $("#vn_toolbar");
    if (!$bar.length) return;
    $bar.find('[data-act="auto"]').toggleClass("active", !!TG.stat.is_auto);
    $bar.find('[data-act="skip"]').toggleClass("active", !!TG.stat.is_skip);
    $bar.find('[data-act="hide"]').toggleClass("active", !!TG.stat.is_hide_message);
    $("#vn_plate").toggleClass("hid", !!TG.stat.is_hide_message);
    $("#vn_frame").toggleClass("hid", !!TG.stat.is_hide_message || !$(".message0_fore").is(":visible"));
    var menuOpen = $(".layer_menu").is(":visible");
    $bar.toggleClass("dim", menuOpen);
  }, 250);

  // 字體載入完成後，選項與名牌重新排版（避免字體換上去後文字換行、框互相重疊）
  try {
    if (document.fonts) {
      document.fonts.load('400 24px "VN Serif"');
      document.fonts.load('700 24px "VN Serif"');
      document.fonts.addEventListener("loadingdone", function () { if (typeof window.vnLayout !== "function") return; VN.layoutChoices(0); VN.placePlate(); });
    }
  } catch (e) {}

  buildToolbar();
})();
