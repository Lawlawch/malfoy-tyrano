;==============================================================
; 第一年級　第二章　九又四分之三月台
; 視角：哈利（第一人稱）
; 隱藏數值：f.bond 羈絆 / f.courage 勇氣 / f.wit 機智 / f.shadow 暗影
; 選擇旗標：f.c2_molly（怎麼向衛斯理夫人開口）/ f.c2_share（對榮恩分糖果的態度）/ f.c2_hand（面對馬份伸出的手）
; 承接第一章：f.c1_hagrid（對海格的態度）影響馬份在車上的一句話
; 場景錨點：a_platform / a_train / a_visit / a_station（見 macros.ks 的 anchor 說明）
;==============================================================

*start
[cm]
[clearfix]
[start_keyconfig]
@layopt layer="message0" visible=true
[chapter_begin id="ch1_02" title="第一年級・第二章　九又四分之三月台"]

;--- 角色宣告 --------------------------------------------------
[chara_config ptext="chara_name_area"]

[chara_new name="draconia" storage="chara/draconia/normal.png" jname="馬份"]
[chara_face name="draconia" face="normal" storage="chara/draconia/normal.png"]
[chara_face name="draconia" face="happy" storage="chara/draconia/happy.png"]
[chara_face name="draconia" face="sad" storage="chara/draconia/sad.png"]
[chara_face name="draconia" face="angry" storage="chara/draconia/angry.png"]
[chara_face name="draconia" face="shy" storage="chara/draconia/shy.png"]

[chara_new name="ron" storage="chara/ron/normal.png" jname="榮恩"]
[chara_face name="ron" face="normal" storage="chara/ron/normal.png"]
[chara_face name="ron" face="happy" storage="chara/ron/happy.png"]
[chara_face name="ron" face="angry" storage="chara/ron/angry.png"]

[chara_new name="molly" storage="chara/molly/normal.png" jname="衛斯理夫人"]
[chara_face name="molly" face="normal" storage="chara/molly/normal.png"]
[chara_face name="molly" face="happy" storage="chara/molly/happy.png"]

[chara_new name="hagrid" storage="chara/hagrid/normal.png" jname="海格"]
[chara_face name="hagrid" face="normal" storage="chara/hagrid/normal.png"]
[chara_face name="hagrid" face="happy" storage="chara/hagrid/happy.png"]

;確保版面與目前螢幕方向一致
[call storage="resizecall.ks"]

;--- 讀檔閘門：舊版劇本的存檔會帶著 f.vn_resume_label，直接跳到該場景錨點重播 ---
[if exp="f.vn_resume_label"]
[hide_all_c time=0]
[jump target="&f.vn_resume_label"]
[endif]

;==============================================================
; 場景一　國王十字車站
;==============================================================
*a_platform
[anchor id="a_platform"]
[bg storage="kings_cross.jpg" time=800]
[wait time=400]

#
九月一日，上午十點四十分。[p]
#
國王十字車站的大鐘像是故意放慢了腳步，分針每挪一格，我的心跳就跟著重重敲一下。[p]
#
德思禮姨丈把我的行李車推到第九和第十月台之間，一鬆手就退開兩步，像是怕沾到什麼。[p]
#
「好了，到了。」他咧開嘴，笑得很不自然，「祝你……學期愉快。」[p]
#
他轉身就走，連頭也沒回。我看著那道背影擠進人群，竟然一點也不難過。[p]
#
我低頭看了看手裡的車票。上面印著：九又四分之三月台。[p]
#
可是，第九和第十月台中間，只有一道磚牆。[p]
#
我盯著那道牆看了很久，牆沒有變，我的手心倒是開始冒汗。[p]
#
「……麻瓜多得嚇人，對吧？」[p]
#
一個圓潤溫和的聲音，從我身後飄過來。[p]
#
回頭一看，一位胖胖的太太正推著一輛堆滿行李的車子，車上還關著一隻貓頭鷹。她身後跟著好幾個紅頭髮的男孩，和一個差點被行李車撞到的小女孩。

;--- 選擇一：怎麼向她開口 -------------------------------------
[choice_start]
[opt i="0" text="鼓起勇氣上前：「請問……你們也是要去霍格華茲嗎？」" target="*m_a" exp="f.courage+=1; f.c2_molly=1"]
[opt i="1" text="先在旁邊觀察，看他們走向哪裡再跟上去" target="*m_b" exp="f.wit+=1; f.c2_molly=2"]
[opt i="2" text="站在原地不動，也許有人會發現我" target="*m_c" exp="f.shadow+=1; f.c2_molly=3"]
[choice_end]
[s]

*m_a
#哈利
「請問……你們也是要去霍格華茲嗎？」[p]
[show_c name="molly" face="happy" slot="center"]
#
胖太太回過頭，眼睛一下子亮了起來。[p]
#
「哎呀，親愛的，你也是？別擔心，我家榮恩也是今年第一次。」[p]
@jump target="*m_end"

*m_b
#
我拉著行李車退到柱子後面，假裝在看時刻表，眼角卻一直盯著那一家人。[p]
#
他們走到第九和第十月台之間，那個高個子的男孩看了看四周，然後直直朝磚牆走過去，連一點停頓都沒有。[p]
#
下一秒，他整個人就不見了。[p]
[show_c name="molly" face="normal" slot="center"]
#
「看夠了嗎，親愛的？」胖太太忽然回過頭，笑咪咪地看著我，「看你的樣子，是第一次吧？」[p]
@jump target="*m_end"

*m_c
#
我站在原地，把行李車抓得緊緊的，心裡想著：只要不動，大概就不會出錯。[p]
[show_c name="molly" face="normal" slot="center"]
#
過了好一會兒，那位胖太太走了過來，在我面前蹲下身，輕輕拍了拍我的手背。[p]
#
「第一次來吧，親愛的？一個人站在這裡，一定嚇壞了。」[p]
@jump target="*m_end"

*m_end
[meet name="molly"]
#衛斯理夫人
「我姓衛斯理。聽好，方法很簡單，一點也不難。」[p]
#衛斯理夫人
「直直朝那道牆走過去，別停，也別怕。要是覺得緊張，就跑起來。」[p]
#哈利
「……直接撞上去？」[p]
[chara_mod name="molly" face="happy" time=0]
#衛斯理夫人
「對，就是撞上去。大家第一次都是這樣。」[p]
#
我深吸了一口氣，推著行李車退後幾步，閉上眼睛，朝那道牆衝了過去。[p]
[hide_c name="molly"]
#
沒有撞擊。只有一陣涼涼的風，像是穿過了一層薄薄的水幕。[p]
#
我睜開眼睛。[p]
#
一列深紅色的蒸汽火車停在月台上，白煙滾滾升起。車頭上寫著：霍格華茲特快車。[p]
#
月台上擠滿了人。貓頭鷹在籠子裡低鳴，貓在行李車之間穿梭，到處都是穿著長袍的孩子，和揮著手的父母。[p]
#
而在人群的另一頭，我看見了一個熟悉的身影。[p]

[show_c name="draconia" face="normal" slot="center"]
#
淺金色的頭髮，抬得高高的下巴。是長袍店裡的那個女孩。[p]
#
她身邊站著一位優雅的夫人，還有一個拄著銀頭手杖的高個子男人。男人的目光掃過人群，在我額頭的位置停了一下，沒有說話。[p]
[chara_mod name="draconia" face="shy" time=0]
#
女孩順著父親的視線轉過頭，看見了我。[p]
#
她的眼睛睜大了一點，整張臉瞬間紅了起來，慌慌張張地把頭轉開。[p]
#馬份
「我、我才沒有在看他！母親，您別亂笑！」[p]
#
她的聲音大得整個月台都聽得見。那位夫人用手帕掩住嘴，肩膀微微抖著。[p]
[chara_mod name="draconia" face="normal" time=0]
#
女孩清了清喉嚨，勉強把表情收拾回「純血貴族」的樣子，朝我這個方向瞥了一眼。[p]
#馬份
「……車上見，波特。」[p]
[hide_c name="draconia" time=400]
#
她拎著袍角，頭也不回地鑽進了車廂。[p]

;==============================================================
; 場景二　車廂裡的紅髮男孩
;==============================================================
*a_train
[anchor id="a_train"]
[bg storage="train_compartment.jpg" time=800]
[wait time=300]

#
我好不容易把行李塞進一節空車廂，剛坐下，火車就鳴了一聲長笛，緩緩動了起來。[p]
#
月台上揮手的人影越來越小，倫敦的屋頂一排排往後退，漸漸變成了綠色的田野。[p]
#
我把額頭靠在冰涼的車窗上，一個念頭慢慢浮了上來：我真的，離開德思禮家了。[p]
#
就在這時，車廂的門被人拉開了一條縫。[p]

[show_c name="ron" face="normal" slot="center"]
#榮恩
「呃，這裡有人嗎？別的車廂都滿了。」[p]
#
是一個紅頭髮的男孩，鼻頭上沾著一點灰，袍子的袖口短了一截，看上去像是穿過好幾個人。[p]
#哈利
「沒有人，你坐吧。」[p]
[chara_mod name="ron" face="happy" time=0]
[meet name="ron"]
#榮恩
「太好了。我叫榮恩．衛斯理。」[p]
#
他一屁股坐下來，手裡的小布袋裡忽然鑽出一隻灰撲撲的老鼠。[p]
#榮恩
「這是斑斑。牠……大部分時間都在睡覺，你別介意。」[p]
#
他一邊說，一邊從袋子裡掏出一份壓得扁扁的三明治，看了看，又有點不好意思地塞回去。[p]
#榮恩
「我媽總是做醃牛肉。我最討厭醃牛肉了。」[p]
#
我忍不住笑了出來。他也笑了，耳朵尖有點紅。[p]
[chara_mod name="ron" face="normal" time=0]
#榮恩
「欸……我可以問一件事嗎？」[p]
#榮恩
「你是不是……哈利．波特？」[p]
#
我愣了一下，點了點頭。[p]
#榮恩
「那你額頭上真的有……那個疤嗎？」[p]
#
我撥開瀏海。閃電形狀的疤痕露了出來。[p]
[chara_mod name="ron" face="happy" time=0]
#榮恩
「哇！哇……我哥哥們說的是真的。我竟然跟哈利．波特坐在同一節車廂！」[p]
#
他興奮得差點從座位上跳起來，連斑斑都被他嚇醒了。[p]
#
這時，車廂外傳來清脆的鈴聲，和一個親切的聲音。[p]
#
「親愛的們，要不要來點零食？」[p]
#
推著餐車的女巫拉開了門。車上堆著我見都沒見過的東西：巧克力蛙、比比多味豆、南瓜餡餅，還有一大堆我叫不出名字的糖。[p]
[chara_mod name="ron" face="normal" time=0]
#
榮恩低下頭，假裝在看窗外。他的手悄悄摸了摸口袋，什麼也沒有拿出來。[p]
#
我口袋裡的金幣，是我人生中第一次有了可以花的地方。[p]
#
「每樣都來一些。」我說。[p]
#
女巫的眼睛都瞪圓了。我抱著滿懷的糖果回到座位，在我們之間堆成了一座小山。

;--- 選擇二：對榮恩的態度 --------------------------------------
[choice_start]
[opt i="0" text="「一起吃吧，這麼多我一個人也吃不完。」" target="*s_a" exp="f.bond+=1; f.c2_share=1"]
[opt i="1" text="「我們換吧。你分我一半三明治，我分你一半糖。」" target="*s_b" exp="f.wit+=1; f.c2_share=2"]
[opt i="2" text="把糖果收在自己這一側，什麼也沒說" target="*s_c" exp="f.shadow+=1; f.c2_share=3"]
[choice_end]
[s]

*s_a
#哈利
「一起吃吧，這麼多我一個人也吃不完。」[p]
[chara_mod name="ron" face="happy" time=0]
#榮恩
「真、真的？你確定？」[p]
#榮恩
「……謝謝你。我從來沒有一次吃過這麼多糖。」[p]
#
他拿起一隻巧克力蛙，眼睛彎成兩道細線。[p]
@jump target="*s_end"

*s_b
#哈利
「我們換吧。你分我一半三明治，我分你一半糖。」[p]
[chara_mod name="ron" face="happy" time=0]
#榮恩
「……你想吃醃牛肉？」[p]
#哈利
「我想吃你媽媽做的東西。」[p]
#
榮恩愣了一下，臉一下子紅了。他把三明治撕開，遞給我最大的那一半。[p]
#榮恩
「你、你是我見過最奇怪的人。」[p]
@jump target="*s_end"

*s_c
#
我把糖果攏到自己腿邊，低頭拆開一隻巧克力蛙。[p]
#
榮恩看了一眼，沒有說話，只是把三明治塞得更深了一點。[p]
[chara_mod name="ron" face="normal" time=0]
#榮恩
「……那個，沒關係，我不餓。」[p]
#
車廂裡安靜了一小會兒，只剩下車輪規律的聲音。我咬了一口巧克力，忽然覺得，沒有想像中那麼甜。[p]
@jump target="*s_end"

*s_end
#
巧克力蛙的盒子裡附著一張畫片。我翻過來，上面是一位長著長長白鬍子的老先生，正對著我眨眼。[p]
#榮恩
「是鄧不利多！你拿到鄧不利多了！我收集了好久都沒有。」[p]
#
他沒有伸手來拿，只是盯著畫片看。[p]
#
我把畫片遞給他。[p]
#榮恩
「我、我不能拿……」[p]
#哈利
「我還會再拿到別的。」[p]
#
榮恩把畫片小心翼翼地收進口袋，像是收起一件很珍貴的東西。[p]
[hide_c name="ron" time=300]

;==============================================================
; 場景二之二　午後的車廂
;==============================================================
*a_visit
[anchor id="a_visit"]
[bg storage="train_compartment.jpg" time=800]
[wait time=300]
[show_c name="ron" face="normal" slot="center"]

#
火車已經跑了好幾個小時。窗外的田野換成了山丘，山丘又換成了灰藍色的湖。[p]
#
榮恩一邊撕著糖紙，一邊講他的五個哥哥，講得眉飛色舞。比爾是學生會主席，查理在養龍，珀西是級長，弗雷和喬治是惡作劇天才。[p]
[chara_mod name="ron" face="happy" time=0]
#榮恩
「而我就是最小的那個兒子。要是我當不好巫師，大家只會說：啊，又是衛斯理家的一個。」[p]
#哈利
「我連一個像樣的巫師都不認識，你已經比我強多了。」[p]
#
榮恩看著我，過了一會兒，嘴角慢慢翹了起來。[p]
#
走廊上傳來一個女孩急促的聲音，一遍又一遍地問：有沒有人看到一隻蟾蜍？[p]
#
腳步聲跑遠了。就在我們以為安靜下來時，車廂的門被人用力拉開。[p]
[chara_mod name="ron" face="normal" time=0]

[show_c name="draconia" face="normal" slot="right"]
#
淺金色的頭髮，高高抬起的下巴。她身後還跟著兩個高大壯碩的男孩，像是兩座一動不動的塔，把整個門口堵得滿滿的。[p]
#馬份
「……果然在這裡。整列車都在傳，說波特坐在這節車廂。」[p]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「我、我可不是特地來找你的！只是……剛好經過！」[p]
#
她很快把表情收拾好，下巴重新抬回原來的角度。[p]
[chara_mod name="draconia" face="normal" time=0]
#馬份
「我叫德拉科妮亞．馬份。這兩位是克拉伯和高爾。」[p]
#
兩個男孩像是被點名的石像，同時點了一下頭。[p]
#
榮恩在旁邊發出一聲很輕的悶笑。[p]
[chara_mod name="draconia" face="angry" time=0]
#馬份
「你笑什麼？」[p]
#榮恩
「沒、沒什麼。只是……『德拉科妮亞』這個名字，還真是……有氣勢。」[p]
#
她的視線慢慢從榮恩的紅頭髮，移到他短了一截的袖口，又移到那隻亂爬的老鼠身上。[p]
#馬份
「哼。紅頭髮，舊袍子，一整家人擠在一起，連孩子都多到養不起。」[p]
#馬份
「你是衛斯理家的吧。我父親說過，你們家的人，總是……」[p]
#
榮恩猛地站了起來。他的指節捏得發白，臉比頭髮還要紅。[p]
[if exp="f.c1_hagrid==1"]
#
她的視線從榮恩身上移開，落在我身上，聲音莫名地低了一點。[p]
#馬份
「……你上次在店裡，為了那個大個子跟我吵過。我記得。」[p]
#馬份
「所以我現在才特地——不對，我是說，我只是好心提醒你。」[p]
[elsif exp="f.c1_hagrid==3"]
#
她的視線從榮恩身上移開，落在我身上，臉上閃過一絲說不出的神情。[p]
#馬份
「你上次一句話也沒說。……我以為你是聰明人。」[p]
[else]
#
她的視線從榮恩身上移開，落在我身上，表情緩和了一點。[p]
[endif]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「你根本什麼都不懂。魔法世界裡，有好的人家，也有不值得來往的人家。」[p]
#馬份
「我、我只是看你可憐，才好心教你。你跟著我，我可以告訴你誰值得結交。」[p]
#
她伸出一隻手，下巴還是抬著，手指卻有一點點發抖。

;--- 選擇三：握不握她的手 -------------------------------------
[choice_start]
[opt i="0" text="握住她的手：「……好。」" target="*d_a" exp="f.shadow+=2; f.bond+=2; f.c2_hand=1"]
[opt i="1" text="「我分得出誰好誰壞，不用妳教。」" target="*d_b" exp="f.courage+=2; f.c2_hand=2"]
[opt i="2" text="站到榮恩身旁：「妳先向他道歉，我才考慮。」" target="*d_c" exp="f.courage+=1; f.wit+=1; f.bond+=1; f.c2_hand=3"]
[choice_end]
[s]

*d_a
#哈利
「……好。」[p]
#
我握住了她的手。她的手比我想像的更小，指尖冰涼。[p]
[chara_mod name="draconia" face="happy" time=0]
#
她的眼睛亮了一下，隨即又被她硬生生壓了下去。[p]
#馬份
「哼……算你識相。」[p]
#
榮恩站在原地，看著我，一個字也說不出來。他慢慢坐了回去，把臉轉向窗外。[p]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「你的手……好冰。算了。」[p]
#馬份
「到了學校，記得找我。我、我可不是在邀請你！」[p]
[hide_c name="draconia" time=300]
#
她帶著兩座塔離開了。車廂裡的空氣，比剛才冷了好幾度。[p]
@jump target="*d_end"

*d_b
#哈利
「我分得出誰好誰壞，不用妳教。」[p]
#
她的手停在半空，過了一秒才反應過來。[p]
[chara_mod name="draconia" face="sad" time=0]
#馬份
「你……你說什麼？」[p]
#
她的睫毛輕輕顫了一下，嘴唇抿得很緊，像是想說什麼，卻沒有說出口。[p]
[chara_mod name="draconia" face="angry" time=0]
#馬份
「好、很好！那你就等著看吧，波特。你會後悔的！」[p]
#
她用力把手收了回去，轉身撞開門。兩座塔慌忙讓路。[p]
[hide_c name="draconia" time=200]
#
門砰地一聲關上，整節車廂都在晃。[p]
#榮恩
「……哇。」[p]
#
他呆呆看著我，過了好一會兒才小聲說：「你剛剛，是不是拒絕了馬份家的人？」[p]
@jump target="*d_end"

*d_c
#
我走到榮恩身旁，站在他和她之間。[p]
#哈利
「妳先向他道歉，我才考慮。」[p]
[chara_mod name="draconia" face="angry" time=0]
#馬份
「道、道歉？我？向衛斯理家的人？」[p]
#
她的聲音拔高了一點，兩邊的耳朵尖卻紅得更厲害了。[p]
#
榮恩站在我旁邊，緊張得連呼吸都放輕了。車廂裡只剩下火車的聲音。[p]
[chara_mod name="draconia" face="sad" time=0]
#
過了很久，她咬了咬嘴唇，把視線移向窗外。[p]
#馬份
「……剛才那句話，說得太過分了。」[p]
#馬份
「這樣可以了吧！別、別以為我是向你們低頭！」[p]
#
她轉身撞開門，兩座塔慌忙讓路。門被她摔上時，我聽見她小聲嘀咕了一句：「……討厭。」[p]
[hide_c name="draconia" time=200]
#榮恩
「……她剛才是在道歉嗎？」[p]
#哈利
「大概吧。」[p]
@jump target="*d_end"

*d_end
[chara_mod name="ron" face="normal" time=0]
[if exp="f.c2_hand==1"]
#榮恩
「……哈利，我不是要怪你。只是，我真的不太喜歡她。」[p]
#哈利
「我知道。」[p]
[else]
#榮恩
「謝謝你，哈利。你不用幫我說話的。」[p]
#
他抓了抓頭髮，笑得有點不好意思。[p]
[endif]
[hide_c name="ron" time=300]
#
窗外的天色，一點一點暗了下來。[p]
#
遠處的山影壓著最後一道金色的光，火車汽笛長長地響了一聲。[p]

;==============================================================
; 場景三　活米村車站
;==============================================================
*a_station
[anchor id="a_station"]
[bg storage="hogsmeade_station.jpg" time=800]
[wait time=300]

#
火車慢慢停了下來。夜風帶著濕涼的味道，從打開的車門灌進來。[p]
#
月台上沒有幾盞燈。一個巨大的身影提著一盞搖晃的燈籠，站在人群的最前面。[p]

[show_c name="hagrid" face="happy" slot="center"]
#海格
「一年級新生！一年級的跟我來！」[p]
#海格
「哈利！你果然來了！路上還順利吧？」[p]
#哈利
「很順利。我還交了一個朋友。」[p]
[chara_mod name="hagrid" face="normal" time=0]
#海格
「好、好！那就好！」[p]
[hide_c name="hagrid" time=300]
#
我跟著人群走下一條陡斜的小路，眼前忽然豁然開朗。[p]
#
一片漆黑的大湖橫在眼前，湖對岸的山崖上，一座巨大的城堡亮著千百扇窗戶，像是整片星空落在了山上。[p]
#
旁邊有人倒抽了一口氣。我發現自己也忘了呼吸。[p]

[show_c name="draconia" face="normal" slot="center"]
#
就在這時，有人從我身邊經過。我認出了那頭淺金色的頭髮。[p]
[if exp="f.c2_hand==1"]
[chara_mod name="draconia" face="happy" time=0]
#馬份
「……波特。我們同一艘船，別拖後腿。」[p]
#
她說得很大聲，卻在經過我身旁時，偷偷把一小塊巧克力塞進了我的手裡。[p]
[elsif exp="f.c2_hand==2"]
[chara_mod name="draconia" face="angry" time=0]
#馬份
「哼。別以為我會原諒你，波特。」[p]
#
她用力把頭別開。但過了一秒，她又偷偷回頭看了我一眼，被我發現之後，更用力地把頭轉了回去。[p]
[else]
[chara_mod name="draconia" face="shy" time=0]
#馬份
「……我才沒有忘記你欠我的。你、你最好別在分院儀式上出醜。」[p]
#
她說完就走，只是走出幾步後，忽然停下來，沒有回頭，很小聲地補了一句：「……剛才，謝謝。」[p]
[endif]
[hide_c name="draconia" time=400]
#
我握緊了手，抬起頭。對岸的城堡在黑暗的湖面上投下一片搖晃的光。[p]
#
榮恩在我身旁，悄悄說了一句：「接下來，就是分院了。」[p]
#
我點點頭。心裡不知道為什麼，忽然想起那個淺金色頭髮的女孩，說她一定會進史萊哲林。[p]
#
而我，會被分到哪裡去呢？[p]

;==============================================================
; 章節結束
;==============================================================
[iscript]
if (f.debug == 1) { console.log("[隱藏數值] 羈絆", f.bond, "勇氣", f.courage, "機智", f.wit, "暗影", f.shadow); }   // 只在主控台，不顯示在畫面上
[endscript]

#
第一年級　第二章　完。（第三章製作中）[p]

[cm]
[hide_all_c time=0]
[end_chapter id="ch1_02"]
@jump storage="title.ks"
