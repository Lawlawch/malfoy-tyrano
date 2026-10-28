;==============================================================
; 一年級　第一章　長袍店的金髮少女
; 視角：哈利（第一人稱）
; 隱藏數值：f.bond 羈絆（0～100，起始 50，用 VN.bondAdd(n) 增減）
; 選擇旗標：f.c1_open（初次回應）/ f.c1_hagrid（對海格的態度）
;==============================================================

*start
[cm]
[clearfix]
[start_keyconfig]
@layopt layer="message0" visible=true
[chapter_begin id="ch1_01" title="一年級・第一章　長袍店的金髮少女"]

;--- 角色宣告（立繪放在 data/fgimage/chara/角色名/ 之下）------------
[chara_config ptext="chara_name_area"]

[chara_new name="draconia" storage="chara/draconia/normal.png" jname="馬份"]
[chara_face name="draconia" face="normal" storage="chara/draconia/normal.png"]
[chara_face name="draconia" face="happy" storage="chara/draconia/happy.png"]
[chara_face name="draconia" face="sad" storage="chara/draconia/sad.png"]
[chara_face name="draconia" face="angry" storage="chara/draconia/angry.png"]
[chara_face name="draconia" face="shy" storage="chara/draconia/shy.png"]

[chara_new name="hagrid" storage="chara/hagrid/normal.png" jname="海格"]
[chara_face name="hagrid" face="normal" storage="chara/hagrid/normal.png"]
[chara_face name="hagrid" face="happy" storage="chara/hagrid/happy.png"]

[chara_new name="malkin" storage="chara/malkin/normal.png" jname="摩金夫人"]
[chara_face name="malkin" face="normal" storage="chara/malkin/normal.png"]

;確保版面與目前螢幕方向一致
[call storage="resizecall.ks"]

;--- 讀檔閘門：舊版劇本的存檔會帶著 f.vn_resume_label，直接跳到該場景錨點重播 ---
[if exp="f.vn_resume_label"]
[hide_all_c time=0]
[jump target="&f.vn_resume_label"]
[endif]

;==============================================================
; 場景一　對角巷
;==============================================================
*a_alley
[anchor id="a_alley"]
[bg storage="diagon_alley.jpg" time=800]
[wait time=400]

#
對角巷的石板路上擠滿了人。斗篷、尖帽、關在籠子裡的貓頭鷹，每一樣東西都像是從故事書裡跑出來的。[p]
#
昨天之前，我還是個睡在樓梯底下櫥櫃裡的男孩。[p]
#
今天，我卻站在魔法世界的街道上，連呼吸都覺得不太真實。[p]

[show_c name="hagrid" face="normal" slot="center"]

#海格
「哈利，你得去摩金夫人那裡訂做長袍。就是前面那家店。」[p]
#海格
「我先去酒吧喝杯東西定定神。那些妖精的小推車，坐得我胃都翻過來了。」[p]
[chara_mod name="hagrid" face="happy" time=0]
#海格
「你弄完就在外頭等我，很快就回來。」[p]

#
我點點頭，看著他寬闊的背影擠過人群，像一座會走路的小山。[p]
[hide_c name="hagrid"]

;==============================================================
; 場景二　摩金夫人的長袍店
;==============================================================
*a_shop
[anchor id="a_shop"]
[bg storage="malkin_shop.jpg" time=800]
[wait time=300]

[show_c name="malkin" face="normal" slot="center"]
#摩金夫人
「霍格華茲的新生嗎，親愛的？」[p]
#摩金夫人
「來得正好，這邊還有一個位子。上來站到凳子上吧。」[p]
[hide_c name="malkin"]

#
我踩上凳子，一件別滿大頭針的黑袍被披到我肩上。[p]
#
這時我才發現，旁邊的凳子上早就站著另一個人。[p]

[show_c name="draconia" face="normal" slot="center"]
#
是個和我差不多年紀的女孩。淺金色的頭髮梳得一絲不苟，下巴微微抬著，站在凳子上的樣子，簡直像站在王座前。[p]
#馬份
「……你也是要去霍格華茲的？」[p]
#
她斜眼打量著我那件還別著大頭針的袍子。

;--- 選擇一：怎麼回應她 ----------------------------------------
[choice_start]
[opt i="0" text="「對，今年入學。妳也是嗎？」" target="*c1_a" exp="VN.bondAdd(3); f.c1_open=1"]
[opt i="1" text="「……妳是誰？」" target="*c1_b" exp="f.c1_open=2"]
[opt i="2" text="「對。妳看起來很習慣被人伺候。」" target="*c1_c" exp="f.c1_open=3"]
[choice_end]
[s]

*c1_a
#哈利
「對，今年入學。妳也是嗎？」[p]
#馬份
「那還用說。馬份家的人不去霍格華茲，還能去哪裡？」[p]
[chara_mod name="draconia" face="happy" time=0]
#馬份
「……哼。你比我想的要有禮貌一點。」[p]
@jump target="*c1_end"

*c1_b
#哈利
「……妳是誰？」[p]
[chara_mod name="draconia" face="angry" time=0]
#馬份
「你、你問我是誰？」[p]
#馬份
「哼，聽好了。你最好把這件事記清楚。」[p]
@jump target="*c1_end"

*c1_c
#哈利
「對。妳看起來很習慣被人伺候。」[p]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「什、什麼？！我只是站得端正一點而已！」[p]
#馬份
「這叫教養！你懂不懂什麼是教養？」[p]
#
旁邊的摩金夫人忍著笑，繼續替她量袖長。[p]
@jump target="*c1_end"

*c1_end
[chara_mod name="draconia" face="normal" time=0]
[meet name="draconia"]
#馬份
「我叫德拉科妮亞．馬份。純血的馬份家，你總該聽過吧？」[p]
#
我只好含糊地「嗯」了一聲。[p]
#馬份
「我已經決定要進史萊哲林了。我們家每一代都是。」[p]
#馬份
「你呢？魁地奇總該有支喜歡的球隊吧？」[p]
#哈利
「魁地奇……是什麼？」[p]

[chara_mod name="draconia" face="angry" time=0]
#馬份
「你、你連魁地奇都不知道？！」[p]
#馬份
「你該不會是在麻瓜家裡長大的吧？」[p]
#哈利
「……可以這麼說。」[p]
#
她深深吸了一口氣，像是在說服自己不要昏倒。[p]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「真是的……我只說一次，你給我聽好。」[p]
#馬份
「四顆球，七名球員。找球手抓到金探子，比賽就結束。」[p]
[chara_mod name="draconia" face="happy" time=0]
#馬份
「我以後要當史萊哲林的找球手。一年級不能帶自己的掃帚，這規定根本是愚蠢！」[p]
#
說到飛行，她的眼睛亮了起來，剛才那種高高在上的語氣，一下子淡了許多。[p]
[chara_mod name="draconia" face="normal" time=0]

;--- 窗外的海格 ------------------------------------------------
#
就在這時，她的視線越過我，落在窗外。[p]
#
海格站在街對面，一手一支冰淇淋，正笨拙地朝我揮手。[p]
#馬份
「那個高得離譜的人……是跟你一起的？」[p]
#馬份
「我聽說，他住在校園邊的小屋裡，粗魯得像野人，酒喝得比誰都多。」

;--- 選擇二：怎麼面對這句話 --------------------------------------
[choice_start]
[opt i="0" text="「他是我的朋友。把那句話收回去。」" target="*h_a" exp="f.c1_hagrid=1"]
[opt i="1" text="「妳又沒見過他，怎麼知道他是什麼樣的人？」" target="*h_b" exp="VN.bondAdd(3); f.c1_hagrid=2"]
[opt i="2" text="（握緊手心，什麼也沒說）" target="*h_c" exp="f.c1_hagrid=3"]
[choice_end]
[s]

*h_a
#哈利
「他是我的朋友。把那句話收回去。」[p]
[chara_mod name="draconia" face="angry" time=0]
#馬份
「你、你這麼凶幹嘛！我只是把大家都在說的話講出來而已！」[p]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「……哼。算了。」[p]
#馬份
「你這傢伙，倒是挺有骨氣的。」[p]
@jump target="*h_end"

*h_b
#哈利
「妳又沒見過他，怎麼知道他是什麼樣的人？」[p]
[chara_mod name="draconia" face="sad" time=0]
#馬份
「……我、我是聽父親說的。」[p]
#馬份
「沒有親眼見過，確實不能算數。」[p]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「我只是隨口說說而已！你、你不要那麼認真啦！」[p]
@jump target="*h_end"

*h_c
#
我握緊了手心，什麼也沒有說。[p]
#馬份
「……你不反駁嗎？」[p]
#
她等了一會兒，沒有等到回答。[p]
#馬份
「……真無趣。」[p]
#
她把頭轉開了。但抓著袍角的手指，好像僵了一下。[p]
@jump target="*h_end"

*h_end
[chara_mod name="draconia" face="normal" time=0]

;--- 家人 ------------------------------------------------------
#馬份
「對了，你的家人呢？也在對角巷嗎？」[p]
#哈利
「……他們已經不在了。」[p]
[chara_mod name="draconia" face="sad" time=0]
#馬份
「……」[p]
#馬份
「……抱歉。我不該問的。」[p]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「我只是隨口問問！才、才不是故意要提起你的傷心事！」[p]
#
她的耳朵尖紅了一小塊，目光卻怎麼也不肯看向我。[p]

;--- 道別 ------------------------------------------------------
#摩金夫人
「好了，這位小姐，長袍已經好了。」[p]
[chara_mod name="draconia" face="normal" time=0]
#
馬份跳下凳子，拍了拍袍角，又回頭看我。[p]
#馬份
「對了，還沒問你的名字。」[p]
#哈利
「哈利。哈利．波特。」[p]

[chara_mod name="draconia" face="shy" time=0]
#馬份
「波、波特……？」[p]
#馬份
「那個——」[p]
#
她倒抽了一口氣，又急忙把後半句硬生生吞了回去。[p]
#馬份
「……沒什麼。」[p]
#馬份
「我、我才不是對你有興趣！只是覺得，你這個名字，我會記住的。」[p]
[chara_mod name="draconia" face="normal" time=0]
#馬份
「下次在學校見面，別讓我失望，波特。」[p]

[hide_c name="draconia" time=400]
#
她踩著小碎步走出店門，銀金色的髮尾在陽光裡晃了一下，就不見了。[p]

;==============================================================
; 場景三　店外
;==============================================================
*a_outside
[anchor id="a_outside"]
[bg storage="diagon_alley.jpg" time=800]
[wait time=300]
[show_c name="hagrid" face="happy" slot="center"]
#海格
「喏，哈利，冰淇淋。剛才在店裡跟你說話的小姐是誰啊？」[p]
#哈利
「一個……有點奇怪的人。」[p]
#海格
「哈哈，霍格華茲的怪人多得是。慢慢你就習慣了。」[p]
[chara_mod name="hagrid" face="normal" time=0]
#海格
「走吧，下一站是魔杖。奧利凡德那裡，你一定會喜歡。」[p]
[hide_c name="hagrid"]

#
我舔了一口冰淇淋，跟著海格走進人群。[p]
#
那時的我還不知道，「馬份」這個姓，不會是最後一次出現在我的生活裡。[p]

;==============================================================
; 章節結束
;==============================================================
[iscript]
if (VN.debug) { console.log("[隱藏數值] 羈絆", f.bond); }   // 只在主控台，不顯示在畫面上
[endscript]

#
一年級　第一章　完。[p]

[cm]
[hide_all_c time=0]
[end_chapter id="ch1_01"]
@jump storage="title.ks"
