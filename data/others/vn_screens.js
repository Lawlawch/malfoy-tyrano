/* =============================================================
   vn_screens.js  自製畫面：首頁、讀檔／存檔、儲思盆、圖鑑、設定、章節完結
   依賴 vn_ui.js（VN 物件）。由 first.ks 以 [loadjs storage="vn_screens.js"] 載入。
   所有畫面都是網頁元素（HTML/CSS），橫直向由 vn_screens.css 的媒體查詢自動切換。
   ============================================================= */
(function () {
  var TG = TYRANO.kag;
  var VN = (window.VN = window.VN || {});

  /* ---------- 資料：章節、CG、結局 ---------- */
  // ready = 這一章已經做好（可以進入）。做好新章節時，把 ready 改成 true。
  VN.chapters.forEach(function (c) { c.ready = (c.id === "ch1_01" || c.id === "ch1_02"); });
  // 年級列表（儲思盆上方可左右切換）。二～四年級的章節尚未製作，會顯示為鎖定空格。
  VN.years = [
    { name: "一年級", ids: VN.chapters.map(function (c) { return c.id; }) },
    { name: "二年級", ids: [] },
    { name: "三年級", ids: [] },
    { name: "四年級", ids: [] }
  ];
  VN.numCN = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  VN.chapterById = function (id) {
    for (var i = 0; i < VN.chapters.length; i++) { if (VN.chapters[i].id === id) return VN.chapters[i]; }
    return null;
  };
  // 圖鑑清單（名稱為佔位，正式 CG 完成後改這裡；圖檔放 others/cg/<id>.jpg，沒有圖時顯示佔位底圖）
  VN.cgs = {
    normal: [
      { id: "cg_malkin",  name: "長袍店的相遇" },
      { id: "cg_platform", name: "九又四分之三月台" },
      { id: "cg_hat",     name: "分院帽之下" },
      { id: "cg_duel",    name: "午夜的月光" },
      { id: "cg_mirror",  name: "厄里斯魔鏡" },
      { id: "cg_xmas",    name: "聖誕夜的禮物" },
      { id: "cg_forest",  name: "禁林深處" },
      { id: "cg_stone",   name: "魔法石的守護" }
    ],
    ending: [
      { id: "y1_A", name: "結局：並肩的光" },
      { id: "y1_B", name: "結局：各自的路" },
      { id: "y1_C", name: "結局：陰影之下" },
      { id: "y1_D", name: "結局：被遺忘的約定" }
    ]
  };
  // 舊巨集 [unlock_cg id="mirror"] 相容：自動補上 cg_ 前綴
  var _unlockCG = VN.unlockCG;
  VN.unlockCG = function (id) {
    if (!/^cg_/.test(id) && !/^y\d/.test(id)) { id = "cg_" + id; }
    _unlockCG(id);
  };

  /* ---------- IndexedDB（存檔用，容量遠大於 localStorage）---------- */
  var DB = (function () {
    var pid = (TG.config && TG.config.projectID) || "vn";
    var h = null, opening = false, failed = false, queue = [], LS = "vn_" + pid + "_";
    function open(cb) {
      if (h) { return cb(h); }
      if (failed) { return cb(null); }
      queue.push(cb);
      if (opening) { return; }
      opening = true;
      function done(x) {
        opening = false; if (!x) { failed = true; } h = x;
        var q = queue; queue = []; q.forEach(function (c) { c(x); });
      }
      try {
        var rq = indexedDB.open("vn_" + pid, 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore("meta"); rq.result.createObjectStore("snap"); };
        rq.onsuccess = function () { done(rq.result); };
        rq.onerror = function () { done(null); };
        rq.onblocked = function () { done(null); };
      } catch (e) { done(null); }
    }
    function put(store, key, val, cb) {
      open(function (d) {
        if (!d) {
          try { localStorage.setItem(LS + store + "_" + key, JSON.stringify(val)); if (cb) { cb(true); } }
          catch (e) { if (cb) { cb(false); } }
          return;
        }
        try {
          var tx = d.transaction(store, "readwrite");
          tx.objectStore(store).put(val, key);
          tx.oncomplete = function () { if (cb) { cb(true); } };
          tx.onerror = function () { if (cb) { cb(false); } };
        } catch (e) { if (cb) { cb(false); } }
      });
    }
    function get(store, key, cb) {
      open(function (d) {
        if (!d) { var v = null; try { v = JSON.parse(localStorage.getItem(LS + store + "_" + key)); } catch (e) {} cb(v); return; }
        try {
          var rq = d.transaction(store).objectStore(store).get(key);
          rq.onsuccess = function () { cb(rq.result || null); };
          rq.onerror = function () { cb(null); };
        } catch (e) { cb(null); }
      });
    }
    function all(store, cb) {
      open(function (d) {
        var out = {};
        if (!d) {
          var pre = LS + store + "_";
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k.indexOf(pre) === 0) { try { out[k.slice(pre.length)] = JSON.parse(localStorage.getItem(k)); } catch (e) {} }
          }
          cb(out); return;
        }
        try {
          var rq = d.transaction(store).objectStore(store).openCursor();
          rq.onsuccess = function () { var c = rq.result; if (c) { out[c.key] = c.value; c["continue"](); } else { cb(out); } };
          rq.onerror = function () { cb(out); };
        } catch (e) { cb(out); }
      });
    }
    function del(store, key, cb) {
      open(function (d) {
        if (!d) { try { localStorage.removeItem(LS + store + "_" + key); } catch (e) {} if (cb) { cb(true); } return; }
        try {
          var tx = d.transaction(store, "readwrite");
          tx.objectStore(store)["delete"](key);
          tx.oncomplete = function () { if (cb) { cb(true); } };
          tx.onerror = function () { if (cb) { cb(false); } };
        } catch (e) { if (cb) { cb(false); } }
      });
    }
    return { put: put, get: get, all: all, del: del };
  })();
  VN.db = DB;

  function saveSlot(id, snap, meta, cb) {
    var copy;
    snap.vn_ver = VN.SAVE_VERSION; meta.ver = VN.SAVE_VERSION; snap.vn_fmt = VN.SAVE_FORMAT; meta.fmt = VN.SAVE_FORMAT;
    try { copy = JSON.parse(JSON.stringify(snap)); } catch (e) { if (cb) { cb(false); } return; }
    DB.put("snap", id, copy, function (ok) {
      if (!ok) { if (cb) { cb(false); } return; }
      DB.put("meta", id, meta, function (ok2) { if (cb) { cb(ok2); } });
    });
  }

  /* ---------- 設定值 ---------- */
  var TEXT_SPEED = [60, 35, 15, 3];
  var AUTO_SPEED = [2600, 1300, 700, 300];
  var FONT_SCALE = [0.9, 1, 1.2];
  var CFG_DEF = { text: 1, auto: 1, font: 1, skipRead: 1, bgm: 80, voice: 100, se: 80 };

  VN.cfg = function () {
    var sf = TG.variable.sf;
    sf.vn_cfg = sf.vn_cfg || {};
    for (var k in CFG_DEF) { if (sf.vn_cfg[k] === undefined) { sf.vn_cfg[k] = CFG_DEF[k]; } }   // 同一個物件，就地補預設值
    return sf.vn_cfg;
  };
  VN.applyFont = function () {
    try {
      var L = window.vnLayout();
      TG.stat.default_font.size = L.font;
      TG.stat.font = $.extend(true, {}, TG.stat.default_font);
      try { TG.setMessageCurrentSpan(); } catch (e) {}
      $(".message_inner").find("span").css("font-size", L.font + "px");
    } catch (e) { console.warn("applyFont", e); }
  };
  // live = true 時，音量立刻套用到正在播放的聲音
  VN.applyCfg = function (live) {
    var c = VN.cfg(), sf = TG.variable.sf;
    TG.stat.ch_speed = "";
    TG.config.chSpeed = TEXT_SPEED[c.text];
    TG.config.autoSpeed = AUTO_SPEED[c.auto];
    TG.config.unReadTextSkip = "true";   // Tyrano 自己的標籤式已讀不用了；「只略過已讀」改由 vn_ui.js 的逐句記錄處理（c.skipRead）
    TG.config.defaultBgmVolume = c.bgm;
    TG.config.defaultSeVolume = c.se;
    if (!(c.font >= 0 && c.font < FONT_SCALE.length)) { c.font = FONT_SCALE.length - 1; }   // 舊設定的「特大」改為「大」
    sf.vn_font_scale = FONT_SCALE[c.font];
    VN.voiceVolume = c.voice;               // 之後語音巨集用這個值（0–100）
    if (live) {
      try { TG.ftag.startTag("bgmopt", { volume: String(c.bgm), next: "false" }); } catch (e) {}
      try { TG.ftag.startTag("seopt", { volume: String(c.se), next: "false" }); } catch (e) {}
    }
  };

  /* ---------- 小工具 ---------- */
  function esc(t) { return $("<div>").text(t == null ? "" : t).html(); }
  VN.closePanels = function () { $(".vn_scr").remove(); $("#vn_cgview").remove(); };
  VN.jumpTo = function (storage, target) {
    VN.closePanels(); VN.home.hide(); $("#vn_end").remove(); $("#vn_confirm").remove();
    try { TG.cancelStrongStop(); } catch (e) {}
    var pm = { storage: storage };
    if (target) { pm.target = target; }
    TG.ftag.startTag("jump", pm);
  };
  VN.msg = function ($root, text) {
    var $m = $root.find(".vn_scr_msg");
    $m.text(text).addClass("show");
    clearTimeout($m.data("t"));
    $m.data("t", setTimeout(function () { $m.removeClass("show"); }, 2200));
  };

  // 通用視窗外框：回傳各區塊
  function shell(title) {
    var $r = $(
      '<div class="vn_scr vn_sys"><div class="vn_sys_panel">' +
      '<div class="vn_sys_head"><span class="vn_sys_title"></span><span class="vn_close_btn">×</span></div>' +
      '<div class="vn_tabs"></div><div class="vn_scr_body"></div>' +
      '<div class="vn_scr_foot"><span class="vn_scr_msg"></span></div>' +
      "</div></div>"
    );
    $r.find(".vn_sys_title").text(title);
    VN.swallow($r);
    $r.find(".vn_close_btn").vntap(function () { $r.remove(); $("#vn_cgview").remove(); });
    $("#tyrano_base").append($r);
    return { $r: $r, $tabs: $r.find(".vn_tabs"), $body: $r.find(".vn_scr_body"), $foot: $r.find(".vn_scr_foot") };
  }
  function tabs(S, list, active, onPick) {
    S.$tabs.empty();
    list.forEach(function (t, i) {
      var $t = $('<span class="vn_tab"></span>').text(t).toggleClass("on", i === active);
      $t.vntap(function () { onPick(i); });
      S.$tabs.append($t);
    });
  }

  VN.openPanel = function (name) {
    VN.stopSkipAuto(); VN.ensureStopAuto();
    VN.closePanels();
    var fn = PANELS[name];
    if (fn) { fn(); }
  };

  /* =============================================================
     存檔／讀檔
     ============================================================= */
  // 章節標題只顯示「一年級．第一章」
  function shortChapter(t) {
    return String(t || "").split(/[\s\u3000]/)[0].replace(/^第([一二三四五六七])年級/, "$1年級").replace(/・/g, "．");
  }
  function slotHtml(label, meta) {
    if (!meta) { return '<div class="no">' + esc(label) + '</div><div class="vn_slot_empty">— 空 —</div>'; }
    var old = "";
    if (meta.fmt !== VN.SAVE_FORMAT) { old = '<div class="old">舊格式的存檔，無法讀取</div>'; }
    else if (meta.ver !== VN.SAVE_VERSION) { old = '<div class="old">劇本已更新，將從段落開頭讀取</div>'; }
    return '<div class="thumb"' + ((meta.th > meta.tw) ? ' data-p="1"' : "") + '></div><div class="info">' +
      '<div class="hd"><span class="no">' + esc(label) + '</span><span class="tm">' + esc(meta.time) + "</span></div>" +
      '<div class="ch">' + esc(shortChapter(meta.chapter)) + "</div>" + old +
      '<div class="ln">' + esc(meta.line) + '</div><div class="act"></div></div>';
  }
  // 手動存檔的縮圖：只拍背景、角色、對話框，不含工具列、選項、面板
  // 縮圖：不截整個網頁，直接把「目前背景圖＋在場立繪」畫到畫布上（各瀏覽器行為一致，速度快）
  function captureThumb(cb) {
    try {
      var el = document.getElementById("tyrano_base");
      var W = el.offsetWidth, H = el.offsetHeight, rb = el.getBoundingClientRect(), k = rb.width / W || 1;
      var sc = 384 / Math.max(W, H);
      var cv = document.createElement("canvas"); cv.width = Math.round(W * sc); cv.height = Math.round(H * sc);
      var ctx = cv.getContext("2d"); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cv.width, cv.height);
      var jobs = [];
      var bgEl = document.querySelector("#tyrano_base .layer.base_fore");
      var m = bgEl && /url\(["']?([^"')]+)["']?\)/.exec(getComputedStyle(bgEl).backgroundImage || "");
      if (m) { jobs.push({ src: m[1], x: 0, y: 0, w: W, h: H, a: 1 }); }
      $("#tyrano_base .tyrano_chara").each(function () {
        var c = this, img = $(c).find("img.chara_img").get(0); if (!img || !img.getAttribute("src")) return;
        var cs = getComputedStyle(c); if (cs.display === "none" || cs.visibility === "hidden") return;
        var r = img.getBoundingClientRect(); if (!r.width) return;
        jobs.push({ src: img.currentSrc || img.src, x: (r.left - rb.left) / k, y: (r.top - rb.top) / k, w: r.width / k, h: r.height / k, a: parseFloat(cs.opacity) });
      });
      var done = 0, imgs = [];
      var finish = function () {
        jobs.forEach(function (jb, i) { var im = imgs[i]; if (!im) return; ctx.globalAlpha = isNaN(jb.a) ? 1 : jb.a; ctx.drawImage(im, jb.x * sc, jb.y * sc, jb.w * sc, jb.h * sc); });
        ctx.globalAlpha = 1;
        try { cb({ url: cv.toDataURL("image/jpeg", 0.7), w: cv.width, h: cv.height }); } catch (e) { cb(null); }
      };
      if (!jobs.length) { finish(); return; }
      jobs.forEach(function (jb, i) {
        var im = new Image();
        im.onload = function () { imgs[i] = im; if (++done === jobs.length) finish(); };
        im.onerror = function () { if (++done === jobs.length) finish(); };
        im.src = jb.src;
      });
    } catch (e) { cb(null); }
  }


  function openSaveLoad(mode) {            // mode = "save" | "load"
    var S = shell(mode === "save" ? "存檔" : "讀檔");
    var tabNames = ["1", "2", "3"];
    var cur = 0;

    function render() {
      tabs(S, tabNames, cur, function (i) { cur = i; render(); });
      S.$body.empty().append('<div class="vn_slots"></div>');
      var $g = S.$body.find(".vn_slots");
      DB.all("meta", function (metas) {
        var page = cur;
        var items = [];
        for (var j = 0; j < 6; j++) {
          var n = page * 6 + j + 1;
          items.push({ id: "m" + n, meta: metas["m" + n] || null, label: "No." + (n < 10 ? "0" + n : n) });
        }
        items.forEach(function (it) {
          var $s = $('<div class="vn_slot"></div>').html(slotHtml(it.label, it.meta)).toggleClass("empty", !it.meta);
          if (it.meta && it.meta.thumb) { $s.find(".thumb").css("background-image", "url(" + it.meta.thumb + ")"); }
          $s.vntap(function () {
            if (mode === "load") {
              if (it.meta) { VN.loadSlot(it.id); }
            } else {
              if (it.meta) {
                VN.confirm({ title: "覆蓋這個存檔？", sub: "原有的存檔內容將被取代，無法復原。", ok: "覆蓋", cancel: "取消" },
                  function () { doSave(it.id, it.label); });
              } else { doSave(it.id, it.label); }
            }
          });
          if (it.meta) {                                  // 刪除鈕（右下角）
            var $del = $('<span class="del">刪除</span>');
            $del.on("pointerup click mousedown touchstart touchend", function (e) { e.stopPropagation(); });
            $del.vntap(function () {
              VN.confirm({ title: "刪除這個存檔？", sub: "刪除後無法復原。", ok: "刪除", cancel: "取消" }, function () {
                DB.del("snap", it.id, function () { DB.del("meta", it.id, function () { VN.msg(S.$r, "已刪除 " + it.label); render(); }); });
              });
            });
            $s.find(".act").append($del);
          }
          $g.append($s);
        });
      });
    }
    function doSave(id, label) {
      var f = TG.stat.f;
      var line = (VN.log.length ? VN.log[VN.log.length - 1].text : "");
      captureThumb(function (th) {
        TG.menu.snapSave("<span>" + (f.chapter_title || "") + "</span>", function () {
          var snap = TG.menu.snap;
          var meta = $.extend(VN.makeMeta(line), { kind: "m", auto_next: "no" });
          if (th) { meta.thumb = th.url; meta.tw = th.w; meta.th = th.h; }
          if (snap.stat && snap.stat.load_auto_next === true) { meta.auto_next = "yes"; snap.stat.load_auto_next = false; }
          saveSlot(id, snap, meta, function (ok) {
            VN.msg(S.$r, ok ? "已存入 " + label : "存檔失敗（瀏覽器容量不足？）");
            render();
          });
        }, "false");
      });
    }
    render();
  }

  VN.loadSlot = function (id) {
    DB.get("snap", id, function (snap) {
      if (!snap) { return; }
      DB.get("meta", id, function (meta) {
        VN.loadSnap(snap, (meta && meta.auto_next) || "no");
      });
    });
  };

  // 讀取一份存檔快照：格式不同 → 無法讀取；劇本版本不同 → 錨點相容讀檔；完全相同 → 原樣讀取
  VN.loadSnap = function (snap, autoNext) {
    if (snap.vn_fmt !== VN.SAVE_FORMAT) {
      VN.confirm({ title: "無法讀取這個存檔", sub: "這是舊格式的存檔，無法在目前的版本讀取。", ok: "知道了", single: true });
      return;
    }
    if (snap.vn_ver === VN.SAVE_VERSION) {
      VN._restoreLine = snap.vn_line || null;
      VN.closePanels(); VN.home.hide(); $("#vn_end").remove(); $("#vn_log").remove();
      try { TG.cancelStrongStop(); } catch (e) {}
      TG.menu.loadGameData($.extend(true, {}, snap), { auto_next: autoNext });
      return;
    }
    VN.confirm({ title: "劇本已更新", sub: "將從該段落開頭繼續。", ok: "繼續", cancel: "取消" },
      function () { VN.compatLoad(snap); });
  };

  // 相容讀檔：還原錨點（或章節開頭）當時的隱藏數值，從那裡重播
  VN.compatLoad = function (snap) {
    var of = (snap.stat && snap.stat.f) || {};
    var c = VN.chapterById(of.vn_chapter);
    function fail() { VN.confirm({ title: "無法讀取這個存檔", sub: "找不到這個存檔所屬的章節。", ok: "知道了", single: true }); }
    if (!c || !c.ready) { fail(); return; }
    function go(anchorOk) {
      var vals = anchorOk ? of.vn_anchor_f : of.vn_chstart;
      if (!vals) { vals = of.vn_chstart; anchorOk = false; }
      if (!vals) { fail(); return; }
      var f = TG.stat.f, sf = TG.variable.sf;
      var old = VN.snapshotF();
      for (var k in old) { delete f[k]; }
      f.bond = 0; f.courage = 0; f.wit = 0; f.shadow = 0;
      $.extend(f, JSON.parse(JSON.stringify(vals)));
      f.vn_resume_label = anchorOk ? "*" + of.vn_anchor : "";
      f.on_title = 0; f.page = ""; f.stage = []; f.chapter_title = "";
      VN.resetLog();
      VN._restoreLine = null;
      VN._compat = true;                       // chapterBegin 讀到這個旗標：用存檔裡的章節起點數值，不覆寫儲思盆快照
      VN._compatChstart = of.vn_chstart || null;
      VN.jumpTo(c.file);
    }
    var anchor = of.vn_anchor;
    if (!anchor) { go(false); return; }
    $.ajax({ url: "./data/scenario/" + c.file + "?t=" + Date.now(), dataType: "text", cache: false })
      .done(function (txt) {
        var re = new RegExp("^\\*" + anchor.replace(/[^\w]/g, "") + "\\s*$", "m");
        go(re.test(txt));
      })
      .fail(function () { go(false); });
  };

  /* =============================================================
     儲思盆（章節選擇）
     ============================================================= */
  function openChapters() {
    var S = shell("儲思盆");
    var sf = TG.variable.sf; sf.vn_ch = sf.vn_ch || {};
    sf.vn_ch.ch1_01 = 1;                    // 第一章一律可進入
    var yi = 0;
    function render() {
      var y = VN.years[yi];
      S.$tabs.empty();
      var multi = VN.years.length > 1;
      var $head = $('<div class="vn_year"></div>');
      $head.append($('<span class="vn_year_arrow">‹</span>').toggleClass("off", !multi).vntap(function () { if (multi) { yi = (yi + VN.years.length - 1) % VN.years.length; render(); } }));
      $head.append($('<span class="vn_year_name"></span>').text(y.name));
      $head.append($('<span class="vn_year_arrow">›</span>').toggleClass("off", !multi).vntap(function () { if (multi) { yi = (yi + 1) % VN.years.length; render(); } }));
      S.$tabs.append($head);
      S.$body.empty();
      var $list = $('<div class="vn_ch_list"></div>');
      var slots = y.ids.slice();
      while (slots.length < 10) { slots.push(null); }              // 尚未製作的章節：鎖定空格
      slots.forEach(function (id) {
        var c = id ? VN.chapterById(id) : null;
        var open = !!(c && sf.vn_ch[id] && c.ready);
        var $row = $('<div class="vn_ch_row"></div>');
        if (open) {
          $row.append($('<span class="no"></span>').text("第" + VN.numCN[c.n] + "章"));
          $row.append($('<span class="nm"></span>').text(c.title));
          if (sf.vn_done && sf.vn_done[id]) { $row.append('<span class="done">已讀</span>'); }
          $row.vntap(function () {
            var note = (sf.vn_head !== undefined && c.n > sf.vn_head && !!sf.vn_start[id]);   // 要用舊時間線留下的快照
            var auto = VN.hasAutosave();
            if (note || auto) {
              var sub = (note ? "此章將沿用先前的進度。" : "") + (note && auto ? "\n" : "") + (auto ? "目前的自動存檔會被取代。手動存檔不受影響。" : "");
              VN.confirm({ title: "從這一章開始？", sub: sub, ok: "開始", cancel: "取消" }, function () { VN.startChapter(id); });
            } else { VN.startChapter(id); }
          });
        } else {
          $row.addClass("locked").append('<span class="lock"></span>');       // 未解鎖：不顯示名稱
        }
        $list.append($row);
      });
      S.$body.append($list);
    }
    render();
  }

  /* =============================================================
     圖鑑
     ============================================================= */
  function openGallery() {
    var S = shell("圖鑑");
    var sf = TG.variable.sf; sf.vn_cg = sf.vn_cg || {}; sf.vn_end = sf.vn_end || {};
    var cat = 0, page = 0;
    var cats = [{ name: "一般 CG", list: VN.cgs.normal, flag: "vn_cg" }, { name: "結局 CG", list: VN.cgs.ending, flag: "vn_end" }];
    function render() {
      tabs(S, cats.map(function (c) { return c.name; }), cat, function (i) { cat = i; page = 0; render(); });
      var C = cats[cat], pages = Math.max(1, Math.ceil(C.list.length / 6));
      if (page >= pages) { page = pages - 1; }
      S.$body.empty();
      var $grid = $('<div class="vn_cg_grid"></div>');
      C.list.slice(page * 6, page * 6 + 6).forEach(function (it, ix) {
        var no = page * 6 + ix + 1;
        var got = !!(sf[C.flag] && sf[C.flag][it.id]);
        var $it = $('<div class="vn_cg_item"></div>').toggleClass("locked", !got);
        var $th = $('<div class="thumb"></div>');
        if (got) {
          var $ph = $('<span class="ph"></span>').text(it.name);         // 沒有圖檔時顯示的佔位字
          $th.append($ph);
          tryImg(it.id, function (url) { $th.css("background-image", "url(" + url + ")"); $ph.hide(); });
        } else { $th.append('<span class="q">？</span>'); }
        $it.append($th).append($('<div class="nm"></div>').text("#" + no + " " + (got ? it.name : "？？？")));
        if (got) { $it.vntap(function () { viewCG(it, no); }); }
        $grid.append($it);
      });
      S.$body.append($grid);
      var $p = $('<div class="vn_pager"></div>');
      $p.append($('<span class="vn_pg_btn">‹</span>').toggleClass("off", page === 0).vntap(function () { if (page > 0) { page--; render(); } }));
      $p.append($('<span class="vn_pg_no"></span>').text((page + 1) + " / " + pages));
      $p.append($('<span class="vn_pg_btn">›</span>').toggleClass("off", page >= pages - 1).vntap(function () { if (page < pages - 1) { page++; render(); } }));
      S.$body.append($p);
      if (TG.stat.f.debug == 1) {
        var $d = $('<div class="vn_debug">測試用：<span data-d="1">全部解鎖</span>　<span data-d="0">全部重置</span></div>');
        $d.find("span").vntap(function () { VN.debugUnlockAll($(this).data("d") === 1); render(); });
        S.$body.append($d);
      }
    }
    render();
  }
  function tryImg(id, ok) {
    var url = "./data/others/cg/" + id + ".jpg", im = new Image();
    im.onload = function () { ok(url); };
    im.src = url;
  }
  function viewCG(it, no) {
    $("#vn_cgview").remove();
    var $v = $('<div id="vn_cgview"><div class="img"></div><div class="cap"></div></div>');
    var $ph = $('<span></span>').text(it.name);
    $v.find(".img").append($ph);
    tryImg(it.id, function (url) { $v.find(".img").css("background-image", "url(" + url + ")"); $ph.hide(); });
    $v.find(".cap").text("#" + no + " " + it.name);
    VN.swallow($v);
    $v.vntap(function () { $v.remove(); });
    $("#tyrano_base").append($v);
  }
  VN.debugUnlockAll = function (on) {
    var sf = TG.variable.sf; sf.vn_cg = {}; sf.vn_end = {};
    if (on !== false) {
      VN.cgs.normal.forEach(function (c) { sf.vn_cg[c.id] = 1; });
      VN.cgs.ending.forEach(function (c) { sf.vn_end[c.id] = 1; });
    }
    VN.saveSf();
  };

  /* =============================================================
     設定
     ============================================================= */
  function openConfig() {
    var S = shell("設定");
    var c = VN.cfg();
    var cat = 0, T = null;
    function persist() { VN.saveSf(); }
    function seg(label, key, names, onChange) {
      var $row = $('<div class="vn_cfg_row"><span class="lb"></span><span class="ctl vn_seg"></span></div>');
      $row.find(".lb").text(label);
      names.forEach(function (nm, i) {
        var $o = $("<span></span>").text(nm).toggleClass("on", c[key] === i);
        $o.vntap(function () {
          c[key] = i; $row.find(".vn_seg span").removeClass("on"); $o.addClass("on");
          VN.applyCfg(false); if (onChange) { onChange(); } persist();
        });
        $row.find(".vn_seg").append($o);
      });
      T.append($row);
    }
    function slider(label, key) {
      var $row = $('<div class="vn_cfg_row"><span class="lb"></span><span class="ctl"><input type="range" min="0" max="100" step="5"><span class="val"></span></span></div>');
      $row.find(".lb").text(label);
      var $in = $row.find("input").val(c[key]);
      $row.find(".val").text(c[key]);
      $in.on("input", function () { c[key] = parseInt($in.val(), 10); $row.find(".val").text(c[key]); VN.applyCfg(true); });
      $in.on("change", persist);
      T.append($row);
    }
    function render() {
      S.$body.empty();
      var $w = $('<div class="vn_cfg_wrap"><div class="vn_cfg_nav"></div><div class="vn_cfg_main"></div></div>');
      ["文字", "音效"].forEach(function (nm, i) {
        $w.find(".vn_cfg_nav").append($('<div class="vn_cfg_navitem"></div>').text(nm).toggleClass("on", i === cat).vntap(function () { cat = i; render(); }));
      });
      S.$body.append($w);
      T = $w.find(".vn_cfg_main");
      if (cat === 0) {
        seg("文字顯示速度", "text", ["慢", "普通", "快", "極快"]);
        seg("自動播放速度", "auto", ["慢", "普通", "快", "極快"]);
        seg("字體大小", "font", ["小", "中", "大"], function () { if (TG.stat.f.on_title != 1) { VN.applyFont(); } });
        var $r = $('<div class="vn_cfg_row"><span class="lb">只略過已讀的句子</span><span class="ctl vn_seg"></span></div>');
        [["開", 1], ["關", 0]].forEach(function (p) {
          var $o = $("<span></span>").text(p[0]).toggleClass("on", c.skipRead === p[1]);
          $o.vntap(function () { c.skipRead = p[1]; $r.find(".vn_seg span").removeClass("on"); $o.addClass("on"); VN.applyCfg(false); persist(); });
          $r.find(".vn_seg").append($o);
        });
        T.append($r);
        T.append('<div class="vn_cfg_note">關閉時，「略過」連尚未讀過的句子也會跳過。</div>');
      } else {
        slider("背景音樂", "bgm");
        slider("語音", "voice");
        slider("效果音", "se");
      }
    }
    render();
  }

  var PANELS = {
    save: function () { openSaveLoad("save"); },
    load: function () { openSaveLoad("load"); },
    chapters: openChapters,
    gallery: openGallery,
    config: openConfig
  };

  /* =============================================================
     開始章節／章節流程
     ============================================================= */
  VN.snapshotF = function () {
    var f = TG.stat.f, o = {}, skip = ["on_title", "page", "chapter_title", "debug", "vn_chapter", "vn_anchor", "vn_resume_label"];
    for (var k in f) {
      if (skip.indexOf(k) >= 0) { continue; }
      var t = typeof f[k];
      if (t === "number" || t === "string" || t === "boolean") { o[k] = f[k]; }
    }
    return o;
  };

  // fresh = true：新遊戲（從第一章、隱藏數值歸零）
  VN.startChapter = function (id, opt) {
    opt = opt || {};
    var c = VN.chapterById(id);
    if (!c || !c.ready) { VN.toast("這一章還在製作中"); return; }
    var sf = TG.variable.sf, f = TG.stat.f;
    sf.vn_done = sf.vn_done || {}; sf.vn_start = sf.vn_start || {};
    // 從儲思盆選章節一律當成主線：還原「最近一次抵達這一章」時的隱藏數值，並取代目前的自動存檔
    var old = VN.snapshotF();
    for (var k in old) { delete f[k]; }
    f.bond = 0; f.courage = 0; f.wit = 0; f.shadow = 0;            // 隱藏數值（永不顯示）
    if (!opt.fresh && sf.vn_start[id]) { $.extend(f, JSON.parse(JSON.stringify(sf.vn_start[id]))); }
    f.on_title = 0; f.page = ""; f.stage = []; f.chapter_title = "";
    VN.clearAutosave();
    VN._compat = false;
    f.vn_resume_label = "";
    VN.resetLog();
    VN.coverOn();
    VN.jumpTo(c.file);
  };
  VN.newGame = function () { VN.startChapter("ch1_01", { fresh: true }); };
  VN.hasAutosave = function () {
    try { var sf = TG.variable.sf; return !!(sf.system && sf.system.autosave === true && sf.vn_auto_fmt === VN.SAVE_FORMAT); }
    catch (e) { return false; }
  };
  VN.doContinue = function () {
    var data = null;
    try { data = JSON.parse($.getStorage(TG.config.projectID + "_tyrano_auto_save", TG.config.configSave)); } catch (e) {}
    if (!data) { return; }
    VN.loadSnap(data, "yes");
  };

  // 章節腳本開頭呼叫（[chapter_begin id=... title=...]）
  VN.chapterBegin = function (id, title) {
    var f = TG.stat.f, sf = TG.variable.sf;
    f.on_title = 0;
    f.chapter_title = title;
    f.vn_chapter = id;
    VN.hideBoot();
    VN.stopSkipAuto();                                // 進入新章節：停止略過／自動
    VN.toolbar(true);
    VN.track = true;
    VN._autoNow = true;                               // 章節第一句寫入自動存檔
    sf.vn_ch = sf.vn_ch || {}; sf.vn_start = sf.vn_start || {};
    if (VN._compat) {
      // 相容讀檔：沿用存檔裡記的章節起點數值，不覆寫儲思盆的快照
      f.vn_chstart = VN._compatChstart || VN.snapshotF();
      VN._compat = false; VN._compatChstart = null;
    } else {
      f.vn_chstart = VN.snapshotF();                  // 存檔自帶一份：劇本更新後找不到錨點時，退回章節開頭用
      sf.vn_ch[id] = 1;
      sf.vn_start[id] = VN.snapshotF();               // 記下抵達這一章時的狀態（儲思盆選章節用，每次抵達都更新）
      sf.vn_head = VN.chapterById(id).n;              // 目前這條時間線走到第幾章
      VN.saveSf();
    }
  };

  // 場景錨點（劇本裡 *a_xxx 標籤之後呼叫 [anchor id="a_xxx"]）：記下目前位置與當時的隱藏數值
  VN.anchor = function (id) {
    var f = TG.stat.f;
    f.vn_anchor = id;
    f.vn_anchor_f = VN.snapshotF();
    f.vn_resume_label = "";
  };

  // 章節腳本結尾呼叫（[end_chapter id=...]）。回傳 "main"（顯示章末頁並停住）
  VN.endChapter = function (id) {
    var f = TG.stat.f, sf = TG.variable.sf;
    VN.stopSkipAuto(); VN.track = false; VN.toolbar(false);
    sf.vn_done = sf.vn_done || {}; sf.vn_ch = sf.vn_ch || {}; sf.vn_start = sf.vn_start || {};
    sf.vn_done[id] = 1; sf.vn_ch[id] = 1;
    var idx = VN.chapters.indexOf(VN.chapterById(id)), next = VN.chapters[idx + 1];
    // 不論下一章做好了沒有，都記下「通關時的數值」與解鎖；之後章節上線，儲思盆就能直接進入
    if (next) { sf.vn_ch[next.id] = 1; sf.vn_start[next.id] = VN.snapshotF(); sf.vn_head = next.n; }
    VN.saveSf();                                      // 自動存檔保留：「繼續」回到最後一個選項
    VN.showEnd(idx);
    return "main";
  };

  /* ---------- 章節完結畫面：羊皮紙書頁翻到章末 ---------- */
  VN.showEnd = function (idx) {
    var c = VN.chapters[idx], next = VN.chapters[idx + 1];
    var canNext = !!(next && next.ready);
    $("#vn_end").remove();
    var $e = $(
      '<div id="vn_end"><div class="vn_book"><div class="vn_page">' +
      '<div class="small"></div><div class="big"></div>' +
      '<div class="rule"><i></i></div><div class="phrase"></div>' +
      '<div class="btns"><span class="vn_end_btn" data-a="next">下一章</span>' +
      '<span class="vn_end_btn" data-a="pensieve">儲思盆</span>' +
      '<span class="vn_end_btn" data-a="home">回首頁</span></div>' +
      '<div class="corner"></div></div></div></div>'
    );
    $e.find(".small").text("一年級・第" + VN.numCN[c.n] + "章");
    $e.find(".big").text(c.title);
    $e.find(".phrase").text(c.phrase || "這段記憶已被儲思盆收藏。");
    if (!canNext) { $e.find('[data-a="next"]').addClass("off"); }
    VN.swallow($e);
    $e.find(".vn_end_btn").vntap(function () {
      var a = $(this).data("a");
      if (a === "next") { if (canNext) { VN.startChapter(next.id); } }
      else if (a === "pensieve") { VN.pendingPanel = "chapters"; VN.jumpTo("title.ks"); }
      else { VN.jumpTo("title.ks"); }
    });
    $("#tyrano_base").append($e);
  };

  /* =============================================================
     首頁
     ============================================================= */
  VN.home = {
    show: function () {
      this.hide();
      VN.toolbar(false);
      var hasAuto = VN.hasAutosave();
      var items = [];
      if (hasAuto) { items.push(["continue", "繼續"]); }
      items.push(["new", "新遊戲"], ["load", "讀檔"], ["chapters", "儲思盆"], ["gallery", "圖鑑"], ["config", "設定"]);
      var $h = $(
        '<div id="vn_home"><div class="bg"><div class="stars"></div><div class="moon"></div><svg viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="vnh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1022"/><stop offset="1" stop-color="#05060d"/></linearGradient></defs><path fill="url(#vnh)" d="M0 600V470l60-20 40 30 70-60 50 40 90-30V600zM560 600V420h30v-50h20v-60l15-35 15 35v60h20v50h35v-90h24l16-40 16 40h24v90h30V330l18-70 18 70v90h44v60h60V400h22l14-60 14 60h22v-40h40v240zM1120 600V380l25-30v-60l20-50 20 50v60l25 30v220zM1260 600V450l50-30 50 30v-70l20-40 20 40v70l40-20 40 40 70-30V600z"/><path fill="#05060d" d="M0 600V540l180-30 200 40 220-20 240 30 260-40 300 30 200-20V600z"/><g fill="#f3c26b" opacity=".85"><rect x="612" y="395" width="5" height="9"/><rect x="760" y="330" width="5" height="9"/><rect x="842" y="380" width="5" height="9"/><rect x="1150" y="330" width="5" height="9"/><rect x="1146" y="420" width="5" height="9"/><rect x="1328" y="400" width="5" height="9"/><rect x="940" y="410" width="5" height="9"/></g></svg></div><div class="veil"></div>' +
        '<div class="frame"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i></div>' +
        '<div class="col"><div class="ttl"><div class="t1">鉑金色的馬份</div><div class="orn"><span></span><i></i><span></span></div><div class="t2">蛇與獅之歌</div></div>' +
        '<div class="menu"></div></div></div>'
      );
      items.forEach(function (it) {
        var $a = $('<div class="item"></div>').text(it[1]).attr("data-a", it[0]);
        $a.vntap(function () { VN.homeAction(it[0]); });
        $h.find(".menu").append($a);
      });
      $("#tyrano_base").append($h);
      VN.hideBoot();
      VN.applyCfg(false);
      if (VN.pendingPanel) { var p = VN.pendingPanel; VN.pendingPanel = null; VN.openPanel(p); }
    },
    hide: function () { $("#vn_home").remove(); }
  };
  VN.homeAction = function (a) {
    if (a === "continue") { VN.doContinue(); }
    else if (a === "new") {
      if (VN.hasAutosave()) {
        VN.confirm({ title: "開始新遊戲？", sub: "目前的自動存檔會被取代。手動存檔不受影響。", ok: "開始", cancel: "取消" }, function () { VN.newGame(); });
      } else { VN.newGame(); }
    } else { VN.openPanel(a); }
  };

  VN.applyCfg(false);
})();
