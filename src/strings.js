/* Interface strings: key -> [English, Русский, Қазақша]. Aletheia clinical evidence desk. */
const TEXT = {
  "app.name": [
    "Aletheia",
    "Aletheia",
    "Aletheia"
  ],
  "tagline": [
    "Verified answers from your protocols.",
    "Проверенные ответы из ваших протоколов.",
    "Протоколдарыңыздан тексерілген жауаптар."
  ],
  "lang.label": [
    "Interface language",
    "Язык интерфейса",
    "Интерфейс тілі"
  ],
  "you": [
    "You",
    "Вы",
    "Сіз"
  ],
  "all": [
    "All",
    "Все",
    "Барлығы"
  ],
  "close": [
    "Close",
    "Закрыть",
    "Жабу"
  ],
  "cancel": [
    "Cancel",
    "Отмена",
    "Бас тарту"
  ],
  "save": [
    "Save",
    "Сохранить",
    "Сақтау"
  ],
  "skip": [
    "Skip",
    "Пропустить",
    "Өткізу"
  ],
  "next": [
    "Next",
    "Далее",
    "Келесі"
  ],
  "prev": [
    "Previous",
    "Назад",
    "Алдыңғы"
  ],
  "chunks": [
    "passages",
    "отрывков",
    "үзінді"
  ],
  "nav.main": [
    "Main navigation",
    "Основная навигация",
    "Негізгі навигация"
  ],
  "nav.menu": [
    "Menu",
    "Меню",
    "Мәзір"
  ],
  "nav.site": [
    "Website",
    "Сайт",
    "Сайт"
  ],
  "nav.dash": [
    "Overview",
    "Обзор",
    "Шолу"
  ],
  "nav.assistant": [
    "Evidence desk",
    "Стол доказательств",
    "Дәлелдер үстелі"
  ],
  "nav.docs": [
    "Sources",
    "Источники",
    "Дереккөздер"
  ],
  "nav.analytics": [
    "Insights",
    "Аналитика",
    "Талдау"
  ],
  "nav.gaps": [
    "Open questions",
    "Без ответа",
    "Жауапсыз сұрақтар"
  ],
  "nav.settings": [
    "Configuration",
    "Настройки",
    "Баптаулар"
  ],
  "mode.short": [
    "Guided retrieval demo",
    "Демо поиска с подтверждением",
    "Дәлелдеумен іздеу демосы"
  ],
  "mode.long": [
    "No LLM is connected. Answers are assembled from the demo protocols by a local retriever and pre-verified answers.",
    "LLM не подключён. Ответы собираются из демо-протоколов локальным поиском и заранее проверенными ответами.",
    "LLM қосылмаған. Жауаптар демо-хаттамалардан жергілікті іздеумен және алдын ала тексерілген жауаптармен құрастырылады."
  ],
  "mode.live.short": [
    "Live retrieval, no LLM",
    "Живой поиск, без LLM",
    "Тікелей іздеу, LLM жоқ"
  ],
  "mode.live.long": [
    "No LLM is connected. Every answer is a verbatim line from your sources, found by a local retriever with its citation; if nothing is found, the desk says so.",
    "LLM не подключён. Каждый ответ — дословная строка из ваших источников, найденная локальным поиском со ссылкой; если ничего не найдено, система говорит об этом.",
    "LLM қосылмаған. Әр жауап — жергілікті іздеумен табылған, дәйексөзі бар дереккөздегі сөзбе-сөз жол; ештеңе табылмаса, жүйе солай дейді."
  ],
  "an.empty": [
    "No questions yet. Statistics appear only from real use.",
    "Вопросов пока нет. Статистика появляется только из реального использования.",
    "Әзірге сұрақ жоқ. Статистика тек нақты қолданудан пайда болады."
  ],
  "an.cov.off": [
    "Coverage is shown only for the built-in demo sources.",
    "Покрытие показывается только для встроенных демо-источников.",
    "Қамту тек кіріктірілген демо-дереккөздер үшін көрсетіледі."
  ],
  "qs.btn": [
    "Quick find…",
    "Быстрый поиск…",
    "Жылдам іздеу…"
  ],
  "qs.ph": [
    "Search questions, sources, sections…",
    "Вопросы, источники, разделы…",
    "Сұрақтар, дереккөздер, бөлімдер…"
  ],
  "qs.ask": [
    "Ask",
    "Спросить",
    "Сұрау"
  ],
  "qs.ask.sub": [
    "Ask this question",
    "Задать этот вопрос",
    "Осы сұрақты қою"
  ],
  "qs.questions": [
    "Questions",
    "Вопросы",
    "Сұрақтар"
  ],
  "qs.docs": [
    "Sources",
    "Источники",
    "Дереккөздер"
  ],
  "qs.pages": [
    "Pages",
    "Страницы",
    "Беттер"
  ],
  "qs.none": [
    "Nothing found",
    "Ничего не найдено",
    "Ештеңе табылмады"
  ],
  "rel.now": [
    "just now",
    "только что",
    "қазір ғана"
  ],
  "rel.m": [
    "{0} min ago",
    "{0} мин назад",
    "{0} мин бұрын"
  ],
  "rel.h": [
    "{0} h ago",
    "{0} ч назад",
    "{0} сағ бұрын"
  ],
  "rel.d": [
    "{0} d ago",
    "{0} дн назад",
    "{0} күн бұрын"
  ],
  "loc.page": [
    "p. {0}",
    "стр. {0}",
    "{0}-бет"
  ],
  "loc.sheet": [
    "Sheet \"{0}\", rows {1}",
    "Лист «{0}», строки {1}",
    "«{0}» парағы, {1} жолдар"
  ],
  "loc.section": [
    "Section {0}",
    "Раздел {0}",
    "{0} бөлім"
  ],
  "loc.rows": [
    "Rows {0}",
    "Строки {0}",
    "{0} жолдар"
  ],
  "loc.lines": [
    "Lines {0}",
    "Строки {0}",
    "{0} жолдар"
  ],
  "loc.para": [
    "Paragraphs {0}",
    "Абзацы {0}",
    "{0} абзацтар"
  ],
  "lp.an.title": [
    "What every answer contains",
    "Что есть в каждом ответе",
    "Әр жауапта не бар"
  ],
  "lp.an.1": [
    "Short answer",
    "Короткий ответ",
    "Қысқа жауап"
  ],
  "lp.an.1d": [
    "One or two lines taken from your protocols, never written from memory.",
    "Одна-две строки из ваших протоколов, а не из памяти.",
    "Протоколдарыңыздан алынған бір-екі жол, ойдан шығарылмаған."
  ],
  "lp.an.2": [
    "File and location",
    "Файл и расположение",
    "Файл және орны"
  ],
  "lp.an.2d": [
    "The file name and the exact place: page, sheet and rows, or section. The found text is highlighted.",
    "Имя файла и точное место: страница, лист и строки или раздел. Найденный текст выделен.",
    "Файл атауы және нақты орны: бет, парақ, жолдар немесе бөлім. Табылған мәтін ерекшеленеді."
  ],
  "lp.an.3": [
    "“I can’t verify this”",
    "«Не могу подтвердить»",
    "«Мұны растай алмаймын»"
  ],
  "lp.an.3d": [
    "If the protocols do not confirm the answer, the desk refuses instead of guessing.",
    "Если протоколы не подтверждают ответ, система отказывается, а не угадывает.",
    "Хаттамалар жауапты растамаса, жүйе болжамай, бас тартады."
  ],
  "lp.cr.eyebrow": [
    "Four checkpoints",
    "Четыре контрольные точки",
    "Төрт бақылау нүктесі"
  ],
  "lp.cr.h": [
    "How the desk meets each criterion",
    "Как стол доказательств отвечает каждому критерию",
    "Дәлелдер үстелі әр өлшемге қалай жауап береді"
  ],
  "lp.cr.1": [
    "Accurate answer with a source",
    "Точный ответ с источником",
    "Дереккөзі бар нақты жауап"
  ],
  "lp.cr.1d": [
    "Each answer names the file and exact place; the matched fragment is highlighted so it can be checked in seconds.",
    "У каждого ответа указаны файл и точное место; найденный фрагмент выделен для быстрой проверки.",
    "Әр жауапта файл мен нақты орын көрсетіліп, табылған үзінді ерекшеленеді."
  ],
  "lp.cr.2": [
    "Honest “I can’t verify”",
    "Честное «не могу подтвердить»",
    "Адал «растай алмаймын»"
  ],
  "lp.cr.2d": [
    "Without confirmation in the protocols there is no answer. The strictness threshold can be changed in Configuration.",
    "Без подтверждения в протоколах ответа нет. Порог строгости меняется в настройках.",
    "Хаттамада растау болмаса, жауап жоқ. Қатаңдық шегін баптауда өзгертуге болады."
  ],
  "lp.cr.3": [
    "Convenient search and chat",
    "Удобный поиск и чат",
    "Ыңғайлы іздеу және чат"
  ],
  "lp.cr.3d": [
    "Plain-language questions, quick search on Ctrl+K, suggestions from your files, and three interface languages.",
    "Вопросы обычным языком, быстрый поиск Ctrl+K, подсказки из файлов и три языка интерфейса.",
    "Қарапайым тілмен сұрақ, Ctrl+K жылдам іздеу, файлдардан ұсыныстар және үш тіл."
  ],
  "lp.cr.4": [
    "Three-minute walkthrough",
    "Трёхминутный обзор",
    "Үш минуттық шолу"
  ],
  "lp.cr.4d": [
    "A guided tour with a 3:00 timer: open a source, ask a question, show an honest refusal.",
    "Экскурсия с таймером 3:00: открыть источник, задать вопрос, показать честный отказ.",
    "3:00 таймерлі экскурсия: дереккөзді ашу, сұрақ қою, адал бас тартуды көрсету."
  ],
  "lp.idk.ph": [
    "A question the protocols do not answer",
    "Вопрос, на который протоколы не отвечают",
    "Хаттамалар жауабы жоқ сұрақ"
  ],
  "lp.try": [
    "Open the demo",
    "Открыть демо",
    "Демоны ашу"
  ],
  "lp.explore": [
    "Explore Aletheia",
    "Изучить Aletheia",
    "Aletheia-ны зерттеу"
  ],
  "lp.nosignup": [
    "No sign-up. By default, your sources stay in your browser.",
    "Без регистрации. По умолчанию источники остаются в браузере.",
    "Тіркеусіз. Әдепкі бойынша дереккөздеріңіз браузерде қалады."
  ],
  "lp.h1a": [
    "Answers from your protocols",
    "Ответы из ваших протоколов",
    "Протоколдарыңыздан жауаптар"
  ],
  "lp.h1b": [
    "with the evidence attached",
    "вместе с доказательствами",
    "дәлелдерімен бірге"
  ],
  "lp.lead": [
    "Ask in plain words. Get a short answer with a link to the file and section. If the protocols have no answer, the desk says so.",
    "Задайте вопрос обычными словами. Получите короткий ответ со ссылкой на файл и раздел. Если протоколы не отвечают, система так и скажет.",
    "Сұрағыңызды қарапайым сөзбен қойыңыз. Файл мен бөлімге сілтемесі бар қысқа жауап алыңыз. Хаттамада жауап болмаса, жүйе солай дейді."
  ],
  "lp.nav.how": [
    "How it works",
    "Как это работает",
    "Қалай жұмыс істейді"
  ],
  "lp.nav.idk": [
    "“I can’t verify”",
    "«Не могу подтвердить»",
    "«Растай алмаймын»"
  ],
  "lp.nav.sec": [
    "Privacy",
    "Приватность",
    "Құпиялылық"
  ],
  "lp.how.eyebrow": [
    "How it works",
    "Как это работает",
    "Қалай жұмыс істейді"
  ],
  "lp.how.h": [
    "From scattered files to a cited answer",
    "От разрозненных файлов к ответу со ссылкой",
    "Шашыраңқы файлдардан дәйексөзі бар жауапқа дейін"
  ],
  "lp.how.sub": [
    "Every answer is built only from passages retrieved from your sources, and every passage stays attached to the answer.",
    "Каждый ответ строится только из отрывков, найденных в ваших источниках, и каждый отрывок остаётся при ответе.",
    "Әр жауап тек дереккөздеріңізден табылған үзінділерден құрастырылады және әр үзінді жауапқа тіркеулі қалады."
  ],
  "pipe.docs": [
    "Sources",
    "Источники",
    "Дереккөздер"
  ],
  "pipe.docs.d": [
    "PDF, DOCX, XLSX, CSV and TXT sources are uploaded and validated.",
    "Источники PDF, DOCX, XLSX, CSV и TXT загружаются и проверяются.",
    "PDF, DOCX, XLSX, CSV және TXT дереккөздері жүктеліп, тексеріледі."
  ],
  "pipe.proc": [
    "Extraction",
    "Извлечение",
    "Алу"
  ],
  "pipe.proc.d": [
    "Text is extracted and split into passages that keep their page, sheet or row.",
    "Текст извлекается и делится на отрывки с сохранением страницы, листа или строки.",
    "Мәтін алынып, беті, парағы немесе жолы сақталатын үзінділерге бөлінеді."
  ],
  "pipe.ret": [
    "Retrieval",
    "Поиск",
    "Іздеу"
  ],
  "pipe.ret.d": [
    "Question terms are matched against every passage and ranked.",
    "Термины вопроса сопоставляются с каждым отрывком и ранжируются.",
    "Сұрақ терминдері әр үзіндімен салыстырылып, сараланады."
  ],
  "pipe.ev": [
    "Evidence check",
    "Проверка доказательств",
    "Дәлелдерді тексеру"
  ],
  "pipe.ev.d": [
    "If the evidence is too weak, the desk stops and says so.",
    "Если доказательств недостаточно, система останавливается и говорит об этом.",
    "Дәлел жеткіліксіз болса, жүйе тоқтап, солай айтады."
  ],
  "pipe.ans": [
    "Answer + source",
    "Ответ + источник",
    "Жауап + дереккөз"
  ],
  "pipe.ans.d": [
    "A short answer with the highlighted passage, ready to verify.",
    "Короткий ответ с выделенным отрывком — можно сразу проверить.",
    "Ерекшеленген үзіндісі бар қысқа жауап — бірден тексеруге болады."
  ],
  "lp.feat.eyebrow": [
    "What makes it different",
    "Чем это отличается",
    "Артықшылығы неде"
  ],
  "lp.feat.h": [
    "Built to be checked, not just believed",
    "Создано, чтобы проверять, а не верить на слово",
    "Сенуге емес, тексеруге арналған"
  ],
  "feat.ev": [
    "Evidence-first answers",
    "Ответы на основе доказательств",
    "Дәлелге негізделген жауаптар"
  ],
  "feat.ev.d": [
    "Each answer carries numbered citations. Click one to open the exact passage, highlighted, with its file and location.",
    "У каждого ответа есть нумерованные ссылки. Нажмите — откроется точный выделенный отрывок с файлом и местом.",
    "Әр жауапта нөмірленген дәйексөздер бар. Басқанда файлы мен орны көрсетілген нақты үзінді ашылады."
  ],
  "feat.abst": [
    "Honest abstention",
    "Честный отказ",
    "Адал бас тарту"
  ],
  "feat.abst.d": [
    "A relevance threshold decides whether the evidence is enough. Below it, the desk refuses to guess and points to related sources.",
    "Порог релевантности решает, достаточно ли доказательств. Ниже порога система не гадает и указывает близкие источники.",
    "Релеванттылық шегі дәлелдің жеткіліктілігін анықтайды. Төмен болса, жүйе болжамай, жақын дереккөздерді көрсетеді."
  ],
  "feat.gap": [
    "Open-question tracking",
    "Учёт открытых вопросов",
    "Ашық сұрақтарды есепке алу"
  ],
  "feat.gap.d": [
    "Questions that could not be answered are collected, grouped by topic and counted, so you know which source to add next.",
    "Вопросы без ответа собираются, группируются по темам и считаются — видно, какой источник добавить следующим.",
    "Жауапсыз сұрақтар жиналып, тақырып бойынша топталып саналады — келесі қай дереккөзді қосу керегі көрінеді."
  ],
  "feat.cmp": [
    "Source comparison",
    "Сравнение источников",
    "Дереккөздерді салыстыру"
  ],
  "feat.cmp.d": [
    "When two sources disagree — an old internal note and the current formulary — both are shown side by side with the rule that decides.",
    "Когда источники расходятся — старая внутренняя запись и действующий формуляр — оба показаны рядом с решающим правилом.",
    "Екі дереккөз сәйкес келмесе — ескі ішкі жазба мен қолданыстағы формуляр — екеуі қатар, шешуші ережемен көрсетіледі."
  ],
  "feat.lang": [
    "English, Russian and Kazakh",
    "English, русский и қазақша",
    "English, орысша және қазақша"
  ],
  "feat.lang.d": [
    "The whole interface and demo answers switch language instantly. Questions can be asked in any of the three.",
    "Весь интерфейс и демо-ответы мгновенно переключаются. Вопросы можно задавать на любом из трёх языков.",
    "Бүкіл интерфейс пен демо-жауаптар бірден ауысады. Сұрақты үш тілдің кез келгенінде қоюға болады."
  ],
  "feat.up": [
    "Your own sources",
    "Ваши собственные источники",
    "Өз дереккөздеріңіз"
  ],
  "feat.up.d": [
    "Drop in TXT, CSV, DOCX or XLSX and they are parsed in your browser and become searchable at once. PDF works when it contains real text.",
    "Перетащите TXT, CSV, DOCX или XLSX — они разбираются в браузере и сразу становятся доступными. PDF работает при наличии текста.",
    "TXT, CSV, DOCX немесе XLSX тастаңыз — олар браузерде өңделіп, бірден іздеуге қолжетімді болады. PDF мәтін болса жұмыс істейді."
  ],
  "lp.idk.eyebrow": [
    "The “I can’t verify” principle",
    "Принцип «не могу подтвердить»",
    "«Растай алмаймын» принципі"
  ],
  "lp.idk.h": [
    "A wrong dose costs more than no answer",
    "Неверная доза дороже, чем отсутствие ответа",
    "Қате доза жауап болмағаннан қымбат"
  ],
  "lp.idk.sub": [
    "A wrong dose or interaction reaches a patient. So when the protocols do not contain the answer, this desk says exactly that.",
    "Неверная доза или взаимодействие доходит до пациента. Поэтому если в протоколах нет ответа, система так и говорит.",
    "Қате доза немесе өзара әрекеттесу науқасқа жетеді. Сондықтан хаттамада жауап болмаса, жүйе солай айтады."
  ],
  "lp.idk.1": [
    "It never invents doses, interactions, storage temperatures or locations.",
    "Никогда не выдумывает дозы, взаимодействия, температуры хранения или расположения.",
    "Дозаларды, өзара әрекеттесуді, сақтау температурасын немесе орнын ойлап таппайды."
  ],
  "lp.idk.2": [
    "It names what is missing and which sources come closest.",
    "Называет, чего не хватает, и какие источники ближе всего.",
    "Ненің жетіспейтінін және қай дереккөздер жақынырақ екенін атайды."
  ],
  "lp.idk.3": [
    "Every refusal is logged as an open question you can close.",
    "Каждый отказ записывается как открытый вопрос, который можно закрыть.",
    "Әр бас тарту жабуға болатын ашық сұрақ ретінде тіркеледі."
  ],
  "lp.idk.try": [
    "See it in the demo",
    "Посмотреть в демо",
    "Демода көру"
  ],
  "lp.ben.eyebrow": [
    "Who it helps",
    "Кому помогает",
    "Кімге көмектеседі"
  ],
  "lp.ben.h": [
    "Fewer interruptions, faster replies, fewer mistakes",
    "Меньше отвлечений, быстрее ответы, меньше ошибок",
    "Аз үзіліс, жылдам жауап, аз қате"
  ],
  "ben.emp": [
    "For laboratory staff",
    "Для сотрудников лаборатории",
    "Зертхана қызметкерлеріне"
  ],
  "ben.emp.d": [
    "One search instead of seven files. The answer and the proof arrive together, so no colleague needs to be interrupted.",
    "Один поиск вместо семи файлов. Ответ и доказательство приходят вместе — не нужно отвлекать коллегу.",
    "Жеті файлдың орнына бір іздеу. Жауап пен дәлел бірге келеді — әріптесті мазалаудың қажеті жоқ."
  ],
  "ben.biz": [
    "For the network",
    "Для сети клиник",
    "Клиникалар желісіне"
  ],
  "ben.biz.d": [
    "Staff get consistent answers. Knowledge stays in approved documents instead of in people’s heads.",
    "Сотрудники получают единые ответы. Знания остаются в утверждённых документах, а не в головах.",
    "Қызметкерлер бірізді жауап алады. Білім адамдардың басында емес, бекітілген құжаттарда қалады."
  ],
  "ben.new": [
    "For new hires",
    "Для новичков",
    "Жаңа қызметкерлерге"
  ],
  "ben.new.d": [
    "Questions about dosage, handling and reporting are answered from approved sources from the first day.",
    "Вопросы о дозировке, обработке проб и отчётности закрываются утверждёнными источниками с первого дня.",
    "Дозалау, үлгі өңдеу және есеп беру сұрақтарына бірінші күннен бекітілген дереккөздер жауап береді."
  ],
  "lp.sec.eyebrow": [
    "Security and privacy",
    "Безопасность и приватность",
    "Қауіпсіздік және құпиялылық"
  ],
  "lp.sec.h": [
    "What actually happens to your data",
    "Что на самом деле происходит с вашими данными",
    "Деректеріңізбен шын мәнінде не болады"
  ],
  "lp.sec.sub": [
    "Only what is implemented in this build is listed here.",
    "Здесь перечислено только то, что реально реализовано в этой сборке.",
    "Мұнда тек осы жинақта нақты жүзеге асырылғаны көрсетілген."
  ],
  "sec.local": [
    "Runs in your browser",
    "Работает в браузере",
    "Браузеріңізде жұмыс істейді"
  ],
  "sec.local.d": [
    "By default the demo sends no questions, sources or feedback to any server and loads no analytics. A backend you configure yourself can receive questions; optional models load from a CDN.",
    "По умолчанию демо не отправляет вопросы, источники и отзывы на сервер и не загружает аналитику. Настроенный вами сервер может получать вопросы; дополнительные модели загружаются из CDN.",
    "Әдепкі бойынша демо сұрақтарды, дереккөздерді және пікірлерді серверге жібермейді, аналитиканы да жүктемейді. Өзіңіз реттеген сервер сұрақтарды алуы мүмкін; қосымша үлгілер CDN-нен жүктеледі."
  ],
  "sec.upl": [
    "Uploads stay on your device",
    "Загрузки остаются на устройстве",
    "Жүктелгендер құрылғыңызда қалады"
  ],
  "sec.upl.d": [
    "Files are parsed locally. Extracted text is kept in this browser until you delete it in Configuration.",
    "Файлы разбираются локально. Извлечённый текст хранится в браузере, пока вы не удалите его в настройках.",
    "Файлдар жергілікті өңделеді. Алынған мәтін баптауда жойғанша браузерде сақталады."
  ],
  "sec.key": [
    "No keys in the frontend",
    "Никаких ключей во фронтенде",
    "Фронтендте кілт жоқ"
  ],
  "sec.key.d": [
    "A real LLM and vector store are meant to run behind your own server endpoint. The page stores only that URL.",
    "Настоящие LLM и векторное хранилище должны работать за вашим сервером. Страница хранит только URL.",
    "Нақты LLM мен векторлық қойма серверіңіздің артында жұмыс істеуі керек. Бет тек URL сақтайды."
  ],
  "sec.notyet": [
    "Not included in this demo",
    "Не входит в демо",
    "Демоға кірмейді"
  ],
  "sec.notyet.d": [
    "Accounts, access control, encryption at rest and audit logs are not implemented here and are not claimed.",
    "Учётные записи, контроль доступа, шифрование и журналы аудита здесь не реализованы и не заявляются.",
    "Тіркелгілер, қол жеткізуді басқару, шифрлеу және аудит журналдары жүзеге асырылмаған."
  ],
  "lp.cta.h": [
    "Ask your first question in ten seconds.",
    "Задайте первый вопрос за десять секунд.",
    "Алғашқы сұрағыңызды он секундта қойыңыз."
  ],
  "lp.cta.sub": [
    "Upload your sources or open the demo. No sign-up needed.",
    "Загрузите источники или откройте демо. Регистрация не нужна.",
    "Дереккөздерді жүктеңіз немесе демоны ашыңыз. Тіркелу қажет емес."
  ],
  "lp.foot": [
    "The fictional network “Asklepia Diagnostics” and all its sources are invented.",
    "Вымышленная сеть «Asklepia Diagnostics» и все её источники выдуманы.",
    "Ойдан шығарылған «Asklepia Diagnostics» желісі және барлық дереккөздері ойдан шығарылған."
  ],
  "dash.eyebrow": [
    "Evidence desk",
    "Стол доказательств",
    "Дәлелдер үстелі"
  ],
  "dash.h1a": [
    "Ask a question. Get an answer.",
    "Задайте вопрос. Получите ответ.",
    "Сұрақ қойыңыз. Жауап алыңыз."
  ],
  "dash.h1b": [
    "See exactly where it came from.",
    "Увидьте, откуда он взят.",
    "Оның қайдан екенін нақты көріңіз."
  ],
  "dash.sub": [
    "Answers come only from your sources. When they do not contain the answer, you are told so.",
    "Ответы берутся только из ваших источников. Если ответа там нет, система говорит об этом.",
    "Жауаптар тек дереккөздеріңізден алынады. Жауап болмаса, жүйе солай айтады."
  ],
  "dash.suggested": [
    "Try",
    "Попробуйте",
    "Көріңіз"
  ],
  "dash.recent": [
    "Recent questions",
    "Последние вопросы",
    "Соңғы сұрақтар"
  ],
  "dash.activity": [
    "Recent activity",
    "Последние действия",
    "Соңғы әрекеттер"
  ],
  "dash.status": [
    "Source status",
    "Состояние источников",
    "Дереккөздер күйі"
  ],
  "dash.ready": [
    "Index ready",
    "Индекс готов",
    "Индекс дайын"
  ],
  "dash.library": [
    "Source library",
    "Библиотека источников",
    "Дереккөздер кітапханасы"
  ],
  "dash.all": [
    "All sources",
    "Все источники",
    "Барлық дереккөздер"
  ],
  "dash.gaps": [
    "{0} open questions",
    "{0} открытых вопросов",
    "{0} ашық сұрақ"
  ],
  "act.ans": [
    "Answered: {0}",
    "Отвечено: {0}",
    "Жауап берілді: {0}"
  ],
  "act.abst": [
    "Could not verify: {0}",
    "Не удалось подтвердить: {0}",
    "Растау мүмкін болмады: {0}"
  ],
  "act.upl": [
    "Added {0}",
    "Добавлен {0}",
    "Қосылды: {0}"
  ],
  "stat.docs": [
    "Sources",
    "Источники",
    "Дереккөздер"
  ],
  "stat.proc": [
    "Indexed",
    "Проиндексировано",
    "Индекстелді"
  ],
  "stat.chunks": [
    "Searchable passages",
    "Поисковые отрывки",
    "Ізделетін үзінділер"
  ],
  "stat.searches": [
    "Searches (14 d)",
    "Поиски (14 дн.)",
    "Іздеулер (14 күн)"
  ],
  "stat.rate": [
    "Answered",
    "Отвечено",
    "Жауап берілді"
  ],
  "ask.ph": [
    "Ask about dosage, interactions, storage, reporting…",
    "Спросите о дозировке, взаимодействиях, хранении, отчётности…",
    "Дозалау, өзара әрекеттесу, сақтау, есеп беру туралы сұраңыз…"
  ],
  "ask.btn": [
    "Ask",
    "Спросить",
    "Сұрау"
  ],
  "ask.label": [
    "Your question",
    "Ваш вопрос",
    "Сұрағыңыз"
  ],
  "asst.sub": [
    "Ask in your own words. Every answer comes with its source.",
    "Спросите своими словами. Каждый ответ accompanies its source.",
    "Өз сөзіңізбен сұраңыз. Әр жауаппен дереккөзі келеді."
  ],
  "asst.sub2": [
    "Click a numbered citation to inspect the exact passage.",
    "Нажмите на номер ссылки, чтобы увидеть точный отрывок.",
    "Нақты үзіндіні көру үшін дәйексөз нөмірін басыңыз."
  ],
  "asst.try": [
    "Questions you can ask the demo sources",
    "Вопросы к демо-источникам",
    "Демо-дереккөздерге қойылатын сұрақтар"
  ],
  "asst.mix": [
    "includes questions the sources cannot answer",
    "включая вопросы, на которые источников нет",
    "дереккөздер жауабы жоқ сұрақтарды қоса"
  ],
  "asst.unans": [
    "Not covered",
    "Не покрыто",
    "Қамтылмаған"
  ],
  "asst.new": [
    "New conversation",
    "Новый диалог",
    "Жаңа әңгіме"
  ],
  "step.search": [
    "Searching {0} sources · {1} passages",
    "Поиск по {0} источникам · {1} отрывкам",
    "{0} дереккөз · {1} үзінді ізделуде"
  ],
  "step.rank": [
    "Ranking passages by relevance",
    "Ранжирование отрывков по релевантности",
    "Үзінділер релеванттылық бойынша саралануда"
  ],
  "step.check": [
    "Checking that the evidence is sufficient",
    "Проверка достаточности доказательств",
    "Дәлелдердің жеткіліктілігі тексерілуде"
  ],
  "step.compose": [
    "Composing answer from evidence only",
    "Составление ответа только из доказательств",
    "Жауап тек дәлелдерден құрастырылуда"
  ],
  "ans.partial": [
    "Partial match.",
    "Частичное совпадение.",
    "Ішінара сәйкестік."
  ],
  "ans.partial.d": [
    "No single passage covers every part of your question. The closest lines are shown; please check them in the source.",
    "Ни один отрывок не покрывает весь вопрос. Показаны ближайшие строки — проверьте их в источнике.",
    "Бірде-бір үзінді сұрақтың барлық бөлігін қамтымайды. Ең жақын жолдар көрсетілді — дереккөзден тексеріңіз."
  ],
  "ans.source": [
    "Source",
    "Источник",
    "Дереккөз"
  ],
  "sug.about": [
    "What do the protocols say about “{0}”?",
    "Что говорят протоколы о «{0}»?",
    "Хаттамалар «{0}» туралы не дейді?"
  ],
  "crit.title": [
    "Guided walkthrough",
    "Экскурсия",
    "Экскурсия"
  ],
  "crit.sub": [
    "one click per checkpoint",
    "по одному клику на контрольную точку",
    "әр бақылау нүктесіне бір рет басу"
  ],
  "crit.1": [
    "Accurate answer with a source file",
    "Точный ответ с файлом-источником",
    "Дереккөз файлы бар нақты жауап"
  ],
  "crit.1.d": [
    "Short answer, highlighted passage, file and location",
    "Короткий ответ, выделенный отрывок, файл и место",
    "Қысқа жауап, ерекшеленген үзінді, файл және орын"
  ],
  "crit.2": [
    "Honest “I can’t verify”",
    "Честное «не могу подтвердить»",
    "Адал «растай алмаймын»"
  ],
  "crit.2.d": [
    "A question the sources cannot answer",
    "Вопрос, на который источники не отвечают",
    "Дереккөздер жауабы жоқ сұрақ"
  ],
  "crit.3": [
    "Convenient search / chat",
    "Удобный поиск / чат",
    "Ыңғайлы іздеу / чат"
  ],
  "crit.3.d": [
    "Quick search (Ctrl/Cmd + K), suggestions, follow-ups",
    "Быстрый поиск (Ctrl/Cmd + K), подсказки, продолжения",
    "Жылдам іздеу (Ctrl/Cmd + K), ұсыныстар, жалғасы"
  ],
  "crit.4": [
    "Three-minute live demo",
    "Трёхминутная живая демонстрация",
    "Үш минуттық тірі демо"
  ],
  "crit.4.d": [
    "Guided script with a countdown",
    "Сценарий с обратным отсчётом",
    "Кері санауы бар сценарий"
  ],
  "crit.idk.q": [
    "What is the weather in Paris today?",
    "Какая погода сегодня в Париже?",
    "Парижде бүгін ауа райы қандай?"
  ],
  "set.usedemo": [
    "Use demo sources",
    "Использовать демо-источники",
    "Демо-дереккөздерді қолдану"
  ],
  "set.usedemo.d": [
    "Turn off to search only the sources you upload, for example an internal dataset.",
    "Отключите, чтобы искать только по загруженным вами источникам, например внутреннему набору.",
    "Тек өз дереккөздеріңізден іздеу үшін өшіріңіз, мысалы ішкі жиыннан."
  ],
  "set.usedemo.on": [
    "Demo sources are included in search.",
    "Демо-источники участвуют в поиске.",
    "Демо-дереккөздер іздеуге кіреді."
  ],
  "set.usedemo.off": [
    "Searching only your uploaded sources. Upload your dataset in Sources.",
    "Поиск только по вашим источникам. Загрузите набор в разделе «Источники».",
    "Тек жүктелген дереккөздер ізделуде. Жиынды «Дереккөздер» бөлімінде жүктеңіз."
  ],
  "toast.demo.on": [
    "Demo sources on",
    "Демо-источники включены",
    "Демо-дереккөздер қосылды"
  ],
  "toast.demo.off": [
    "Searching only your uploads",
    "Поиск только по вашим загрузкам",
    "Тек жүктелгендер ізделуде"
  ],
  "tour.clock": [
    "Time left of 3 minutes",
    "Осталось времени из 3 минут",
    "3 минуттан қалған уақыт"
  ],
  "ans.label": [
    "Answer",
    "Ответ",
    "Жауап"
  ],
  "ans.verified": [
    "Verified in {0} source(s)",
    "Подтверждено в {0} источнике(ах)",
    "{0} дереккөзде расталды"
  ],
  "prov.curated": [
    "Pre-verified demo answer",
    "Заранее проверенный демо-ответ",
    "Алдын ала тексерілген демо-жауап"
  ],
  "prov.extractive": [
    "Extractive answer · live retrieval",
    "Извлечённый ответ · живой поиск",
    "Алынған жауап · тікелей іздеу"
  ],
  "prov.remote": [
    "From your backend",
    "С вашего сервера",
    "Серверіңізден"
  ],
  "ev.title": [
    "Evidence",
    "Доказательства",
    "Дәлелдер"
  ],
  "ev.strong": [
    "Strong evidence",
    "Сильные доказательства",
    "Күшті дәлелдер"
  ],
  "ev.moderate": [
    "Moderate evidence",
    "Умеренные доказательства",
    "Орташа дәлелдер"
  ],
  "ev.limited": [
    "Limited evidence",
    "Ограниченные доказательства",
    "Шектеулі дәлелдер"
  ],
  "ev.hint": [
    "Evidence strength reflects how well retrieved passages cover the question and how many agree. It is not a probability of being correct.",
    "Сила доказательств показывает, насколько отрывки покрывают вопрос и сколько из них согласны. Это не вероятность правильности.",
    "Дәлел күші үзінділердің сұрақты қаншалықты қамтитынын және келісетіндер санын көрсетеді. Бұл дұрыстық ықтималдығы емес."
  ],
  "abst.badge": [
    "Cannot verify",
    "Нельзя подтвердить",
    "Растау мүмкін емес"
  ],
  "abst.title": [
    "I couldn’t verify this information in the available sources.",
    "Я не смог подтвердить эти сведения в доступных источниках.",
    "Қолжетімді дереккөздерде бұл мәліметті растай алмадым."
  ],
  "abst.generic": [
    "No passage in the corpus covers this question well enough to answer it.",
    "Ни один отрывок в наборе документов не покрывает вопрос достаточно полно.",
    "Жиындағы бірде-бір үзінді сұрақты жауап берерлік деңгейде қамтымайды."
  ],
  "abst.terms": [
    "These terms do not appear in the best-matching passages: {0}.",
    "Эти термины отсутствуют в наиболее подходящих отрывках: {0}.",
    "Бұл терминдер ең жақын үзінділерде кездеспейді: {0}."
  ],
  "abst.missing": [
    "The sources do not contain the information needed to answer.",
    "В источниках нет информации, необходимой для ответа.",
    "Дереккөздерде жауап үшін қажетті мәлімет жоқ."
  ],
  "abst.rule": [
    "I do not guess or use general knowledge in place of your sources.",
    "Я не гадаю и не подменяю ваши источники общими знаниями.",
    "Мен болжамаймын және дереккөздерді жалпы біліммен алмастырмаймын."
  ],
  "abst.related": [
    "Closest sources that may help",
    "Ближайшие источники, которые могут помочь",
    "Көмектесуі мүмкін ең жақын дереккөздер"
  ],
  "abst.logged": [
    "This question was added to",
    "Этот вопрос добавлен в",
    "Бұл сұрақ қосылды:"
  ],
  "abst.add": [
    "Add a source",
    "Добавить источник",
    "Дереккөз қосу"
  ],
  "abst.try": [
    "Ask something covered",
    "Задайте вопрос по теме",
    "Қамтылған тақырыпта сұраңыз"
  ],
  "follow.title": [
    "Ask a follow-up",
    "Задайте уточняющий вопрос",
    "Нақтылайтын сұрақ қойыңыз"
  ],
  "act.copy": [
    "Copy answer",
    "Копировать ответ",
    "Жауапты көшіру"
  ],
  "act.cite": [
    "Copy citations",
    "Копировать ссылки",
    "Дәйексөздерді көшіру"
  ],
  "act.share": [
    "Share",
    "Поделиться",
    "Бөлісу"
  ],
  "fb.up": [
    "Helpful",
    "Полезно",
    "Пайдалы"
  ],
  "fb.down": [
    "Not helpful",
    "Не полезно",
    "Пайдасыз"
  ],
  "fb.report": [
    "Report incorrect",
    "Сообщить об ошибке",
    "Қате туралы хабарлау"
  ],
  "how.title": [
    "How this was verified",
    "Как это было подтверждено",
    "Бұл қалай расталды"
  ],
  "how.mode": [
    "Method",
    "Метод",
    "Әдіс"
  ],
  "how.curated": [
    "Pre-verified demo answer, citations checked against passages",
    "Заранее проверенный демо-ответ, ссылки сверены с отрывками",
    "Алдын ала тексерілген демо-жауап, дәйексөздер үзінділермен салыстырылған"
  ],
  "how.live": [
    "Keyword retrieval (BM25) with evidence-coverage check",
    "Поиск по ключевым словам (BM25) с проверкой покрытия доказательствами",
    "BM25 кілт сөз іздеуі, дәлел қамтуын тексерумен"
  ],
  "how.scanned": [
    "Scanned",
    "Просканировано",
    "Қаралды"
  ],
  "how.cover": [
    "Evidence coverage",
    "Покрытие доказательствами",
    "Дәлелдермен қамту"
  ],
  "how.time": [
    "Retrieval time",
    "Время поиска",
    "Іздеу уақыты"
  ],
  "cmp.rule": [
    "the newer, authoritative source is used",
    "используется более новый авторитетный источник",
    "жаңа және басым дереккөз қолданылады"
  ],
  "cmp.used": [
    "Used in the answer",
    "Использовано в ответе",
    "Жауапта қолданылды"
  ],
  "cmp.older": [
    "Conflicting older source",
    "Противоречащий старый источник",
    "Қайшы ескі дереккөз"
  ],
  "cmp.why": [
    "Rule applied, from",
    "Применено правило из",
    "Қолданылған ереже:"
  ],
  "src.title": [
    "Source",
    "Источник",
    "Дереккөз"
  ],
  "src.open": [
    "Open source {0}",
    "Открыть источник {0}",
    "{0} дереккөзін ашу"
  ],
  "src.of": [
    "Source {0} of {1}",
    "Источник {0} из {1}",
    "{1} ішіндегі {0}-дереккөз"
  ],
  "src.passage": [
    "Matched passage",
    "Найденный отрывок",
    "Табылған үзінді"
  ],
  "src.hl": [
    "Highlighted text is the part used for the answer. Dimmed text is neighbouring context.",
    "Выделенный текст использован в ответе. Бледный текст — соседний контекст.",
    "Ерекшеленген мәтін жауапта қолданылды. Бәсең мәтін — жанындағы контекст."
  ],
  "src.meta": [
    "File metadata",
    "Метаданные файла",
    "Файл метадеректері"
  ],
  "src.loc": [
    "Location",
    "Расположение",
    "Орны"
  ],
  "src.chunk": [
    "Passage",
    "Отрывок",
    "Үзінді"
  ],
  "src.all": [
    "All sources for this answer",
    "Все источники для этого ответа",
    "Бұл жауаптың барлық дереккөздері"
  ],
  "src.copy": [
    "Copy citation",
    "Копировать ссылку",
    "Дәйексөзді көшіру"
  ],
  "src.opendoc": [
    "Source details",
    "Сведения об источнике",
    "Дереккөз мәліметтері"
  ],
  "lib.sub": [
    "Upload, inspect and manage the sources behind every answer.",
    "Загружайте, просматривайте и управляйте источниками ответов.",
    "Жауаптардың дереккөздерін жүктеңіз, қараңыз және басқарыңыз."
  ],
  "lib.upload": [
    "Upload sources",
    "Загрузить источники",
    "Дереккөз жүктеу"
  ],
  "lib.drop": [
    "Drop files here or click to browse",
    "Перетащите файлы сюда или нажмите для выбора",
    "Файлдарды мұнда тастаңыз немесе таңдау үшін басыңыз"
  ],
  "lib.formats": [
    "PDF (text-based), DOCX, XLSX, CSV, TXT · up to 30 MiB · parsed in your browser",
    "PDF (с текстом), DOCX, XLSX, CSV, TXT · до 30 МиБ · обработка в браузере",
    "PDF (мәтінді), DOCX, XLSX, CSV, TXT · 30 МиБ дейін · браузерде өңделеді"
  ],
  "lib.sample": [
    "Add sample source",
    "Добавить пример источника",
    "Үлгі дереккөз қосу"
  ],
  "lib.sample.d": [
    "Adds a short TXT about paediatric dosing, processed like any upload, so you can close an open question in the demo.",
    "Добавляет короткий TXT о педиатрических дозах; обрабатывается как обычная загрузка, чтобы закрыть открытый вопрос в демо.",
    "Педиатриялық дозалау туралы қысқа TXT қосады; демодағы ашық сұрақты жабу үшін қалыпты жүкте сияқты өңделеді."
  ],
  "lib.search": [
    "Search sources…",
    "Поиск по источникам…",
    "Дереккөздерде іздеу…"
  ],
  "lib.name": [
    "Name",
    "Название",
    "Атауы"
  ],
  "lib.type": [
    "Type",
    "Тип",
    "Түрі"
  ],
  "lib.date": [
    "Added",
    "Добавлен",
    "Қосылды"
  ],
  "lib.status": [
    "Status",
    "Статус",
    "Күйі"
  ],
  "lib.size": [
    "Size",
    "Размер",
    "Көлемі"
  ],
  "lib.empty": [
    "No sources match",
    "Источники не найдены",
    "Дереккөз табылмады"
  ],
  "lib.empty.sub": [
    "Change the filters or upload a file.",
    "Измените фильтры или загрузите файл.",
    "Сүзгілерді өзгертіңіз немесе файл жүктеңіз."
  ],
  "lib.demo": [
    "Demo",
    "Демо",
    "Демо"
  ],
  "lib.uploaded": [
    "Uploaded source",
    "Загруженный источник",
    "Жүктелген дереккөз"
  ],
  "lib.view": [
    "View details",
    "Просмотр сведений",
    "Мәліметтерді қарау"
  ],
  "lib.retry": [
    "Retry processing",
    "Повторить обработку",
    "Өңдеуді қайталау"
  ],
  "lib.remove": [
    "Remove",
    "Удалить",
    "Жою"
  ],
  "st.processed": [
    "Indexed",
    "Проиндексировано",
    "Индекстелді"
  ],
  "st.processing": [
    "Processing",
    "Обработка",
    "Өңделуде"
  ],
  "st.failed": [
    "Failed",
    "Ошибка",
    "Қате"
  ],
  "stage.validate": [
    "Validating file",
    "Проверка файла",
    "Файл тексерілуде"
  ],
  "stage.extract": [
    "Extracting text",
    "Извлечение текста",
    "Мәтін алынуда"
  ],
  "stage.chunk": [
    "Splitting into passages",
    "Разделение на отрывки",
    "Үзінділерге бөлуде"
  ],
  "stage.index": [
    "Building index",
    "Построение индекса",
    "Индекс құрылуда"
  ],
  "stage.done": [
    "Done",
    "Готово",
    "Дайын"
  ],
  "err.unsupported": [
    "This file type is not supported. Use PDF, DOCX, XLSX, CSV, TXT or an image.",
    "Этот тип файла не поддерживается. Используйте PDF, DOCX, XLSX, CSV, TXT или изображение.",
    "Бұл файл түрі қолдау таппайды. PDF, DOCX, XLSX, CSV, TXT немесе сурет пайдаланыңыз."
  ],
  "err.empty": [
    "The file is empty.",
    "Файл пуст.",
    "Файл бос."
  ],
  "err.toobig": [
    "The file is larger than 30 MiB.",
    "Файл больше 30 МиБ.",
    "Файл 30 МиБ-дан үлкен."
  ],
  "set.scripted": [
    "Scripted demo answers",
    "Заранее заданные демо-ответы",
    "Алдын ала жазылған демо-жауаптар"
  ],
  "set.scripted.d": [
    "Off by default. When on, questions about the fictional demo network get pre-written answers. Answers about your own sources are always retrieved, never scripted.",
    "По умолчанию выключено. При включении вопросы о вымышленной демо-сети получают заготовленные ответы. Ответы по вашим источникам всегда ищутся.",
    "Әдепкі бойынша өшірулі. Қосылғанда ойдан шығарылған демо-желі туралы сұрақтарға дайын жауаптар беріледі. Өз дереккөздеріңіз әрқашан ізделіп жауап беріледі."
  ],
  "toast.scripted.on": [
    "Scripted demo answers are on",
    "Демо-ответы включены",
    "Демо-жауаптар қосылды"
  ],
  "toast.scripted.off": [
    "Scripted demo answers are off, all answers are retrieved",
    "Демо-ответы выключены, все ответы ищутся",
    "Демо-жауаптар өшірілді, барлық жауаптар іздеу арқылы"
  ],
  "set.ai": [
    "Enhanced mode: local AI",
    "Расширенный режим: локальный ИИ",
    "Кеңейтілген режим: жергілікті ЖИ"
  ],
  "set.ai.d": [
    "Semantic search by meaning and OCR for scanned PDFs and photos. Runs in your browser, no API key. Downloads about 100 MB once (needs internet). If it fails, standard search keeps working.",
    "Семантический поиск по смыслу и OCR для сканов и фото. Работает в браузере, без ключа. Однократная загрузка около 100 МБ (нужен интернет). При сбое обычный поиск продолжает работать.",
    "Мағына бойынша семантикалық іздеу және сканерлер мен фото үшін OCR. Браузерде жұмыс істейді, кілт қажет емес. Бір рет шамамен 100 МБ жүктеледі (интернет керек). Қате болса, қалыпты іздеу жұмыс істей береді."
  ],
  "set.semthr": [
    "Semantic threshold",
    "Семантический порог",
    "Семантикалық шег"
  ],
  "set.semthr.d": [
    "Minimum similarity to accept a match by meaning. Higher is stricter and refuses more often.",
    "Минимальная близость для принятия смыслового совпадения. Выше — строже и чаще отказы.",
    "Мағыналық сәйкестікті қабылдаудың ең төменгі ұқсастығы. Жоғарырақ болса, қатаңырақ және жиірек бас тартады."
  ],
  "ai.off": [
    "Off",
    "Выключено",
    "Өшірулі"
  ],
  "ai.loading": [
    "Downloading model {0}%",
    "Загрузка модели {0}%",
    "Модель жүктелуде {0}%"
  ],
  "ai.ready": [
    "Ready",
    "Готово",
    "Дайын"
  ],
  "ai.indexing": [
    "Indexing…",
    "Индексация…",
    "Индекстелуде…"
  ],
  "ai.error": [
    "Unavailable (offline or blocked)",
    "Недоступно (нет сети или блокировка)",
    "Қолжетімсіз (желі жоқ немесе бұғатталған)"
  ],
  "toast.ai.loading": [
    "Loading local AI model…",
    "Загрузка локальной модели…",
    "Жергілікті ЖИ моделі жүктелуде…"
  ],
  "toast.ai.on": [
    "Enhanced mode is on",
    "Расширенный режим включён",
    "Кеңейтілген режим қосылды"
  ],
  "toast.ai.off": [
    "Enhanced mode is off",
    "Расширенный режим выключен",
    "Кеңейтілген режим өшірілді"
  ],
  "toast.ai.fail": [
    "Could not load the model (offline or blocked). Standard search is still active.",
    "Не удалось загрузить модель (нет сети или блокировка). Обычный поиск работает.",
    "Модельді жүктеу мүмкін болмады. Қалыпты іздеу жұмыс істеуде."
  ],
  "ans.sem": [
    "Found by meaning, not by exact words.",
    "Найдено по смыслу, а не по точным словам.",
    "Мағына бойынша табылды, дәл сөздермен емес."
  ],
  "ans.sem.d": [
    "Semantic similarity {0}. Please check the passage in the source before relying on it.",
    "Семантическая близость {0}. Проверьте отрывок в источнике.",
    "Семантикалық ұқсастық {0}. Үзіндіні дереккөзде тексеріңіз."
  ],
  "abst.sem": [
    "Closest passage by meaning: {0} similarity (needed {1}).",
    "Ближайший по смыслу отрывок: близость {0} (нужно {1}).",
    "Мағына бойынша ең жақын үзінді: ұқсастық {0} (қажет {1})."
  ],
  "stage.ocr": [
    "Recognizing text (OCR)",
    "Распознавание текста (OCR)",
    "Мәтін тану (OCR)"
  ],
  "err.needocr": [
    "Images need OCR. Turn on Enhanced mode in Configuration, then press retry.",
    "Для изображений нужен OCR. Включите расширенный режим в настройках и нажмите «повторить».",
    "Суреттер үшін OCR керек. Баптауда кеңейтілген режимді қосып, қайталаңыз."
  ],
  "err.ocrfail": [
    "OCR failed (offline, blocked, or the scan is too poor).",
    "OCR не удался (нет сети, блокировка или плохое качество скана).",
    "OCR орындалмады (желі, бұғаттау немесе сапасыз сканерлеу)."
  ],
  "err.ocrempty": [
    "OCR found no readable text in this file.",
    "OCR не нашёл читаемого текста в файле.",
    "OCR бұл файлда оқылатын мәтін таппады."
  ],
  "err.parse": [
    "The file could not be read. It may be corrupted or password-protected.",
    "Файл не прочитан. Возможно, он повреждён или защищён паролем.",
    "Файл оқылмады. Зақымдалған немесе құпия сөзбен қорғалған болуы мүмкін."
  ],
  "err.pdftext": [
    "No readable text found in this PDF (scanned image or unsupported font encoding). Turn on Enhanced mode to read scans with OCR, then press retry.",
    "В PDF нет читаемого текста (скан или неподдерживаемая кодировка шрифта). Включите расширенный режим для OCR и нажмите «повторить».",
    "PDF-те оқылатын мәтін жоқ (скан немесе қолдаусыз қарпі). OCR үшін кеңейтілген режимді қосып, қайталаңыз."
  ],
  "err.nochunks": [
    "No text could be extracted from this file.",
    "Из файла не удалось извлечь текст.",
    "Файлдан мәтін алынбады."
  ],
  "err.interrupted": [
    "Processing was interrupted. Upload the file again.",
    "Обработка прервана. Загрузите файл снова.",
    "Өңдеу үзілді. Файлды қайта жүктеңіз."
  ],
  "err.remote": [
    "The backend request failed",
    "Запрос к серверу не удался",
    "Серверге сұрау орындалмады"
  ],
  "doc.title": [
    "Source",
    "Источник",
    "Дереккөз"
  ],
  "doc.notproc": [
    "Not indexed",
    "Не проиндексировано",
    "Индекстелмеген"
  ],
  "doc.summary": [
    "Extracted summary",
    "Извлечённая сводка",
    "Алынған қысқаша мазмұн"
  ],
  "doc.summary.note": [
    "The first extracted passage, shown as-is. No text is generated.",
    "Первый извлечённый отрывок без изменений. Текст не генерируется.",
    "Алынған бірінші үзінді өзгеріссіз көрсетілген. Мәтін жасалмайды."
  ],
  "doc.entities": [
    "Key entities found in the text",
    "Ключевые сущности в тексте",
    "Мәтіндегі негізгі объектілер"
  ],
  "doc.products": [
    "Medicine names",
    "Названия препаратов",
    "Препарат атаулары"
  ],
  "doc.amounts": [
    "Doses and amounts",
    "Дозы и quantities",
    "Дозалар мен мөлшерлер"
  ],
  "doc.percents": [
    "Percentages",
    "Проценты",
    "Пайыздар"
  ],
  "doc.terms": [
    "Frequent terms",
    "Частые термины",
    "Жиі кездесетін терминдер"
  ],
  "doc.extracted": [
    "Extracted passages",
    "Извлечённые отрывки",
    "Алынған үзінділер"
  ],
  "doc.nochunks": [
    "No extracted content is available.",
    "Извлечённого содержимого нет.",
    "Алынған мазмұн жоқ."
  ],
  "meta.pages": [
    "Pages",
    "Страницы",
    "Беттер"
  ],
  "meta.sheets": [
    "Sheets",
    "Листы",
    "Парақтар"
  ],
  "meta.rows": [
    "Rows",
    "Строки",
    "Жолдар"
  ],
  "meta.chars": [
    "Extracted characters",
    "Извлечённые символы",
    "Алынған таңбалар"
  ],
  "rm.title": [
    "Remove “{0}”?",
    "Удалить «{0}»?",
    "«{0}»-ді жою керек пе?"
  ],
  "rm.body": [
    "Its passages will be removed from the index. Answers can no longer cite it.",
    "Его отрывки будут удалены из индекса. Ответы не смогут на него ссылаться.",
    "Оның үзінділері индекстен алынады. Жауаптар оған сілтеме жасай алмайды."
  ],
  "rm.demo": [
    "It is part of the demo set. Questions that depended on it will fall back to live retrieval or an honest “cannot verify”. You can restore it in Configuration.",
    "Это часть демо-набора. Вопросы, зависевшие от него, перейдут к живому поиску или честному «нельзя подтвердить». Восстановить можно в настройках.",
    "Бұл демо-жиынның бөлігі. Оған тәуелді сұрақтар тікелей іздеуге немесе адал «растау мүмкін емес» күйіне өтеді. Баптауда қалпына келтіруге болады."
  ],
  "an.sub": [
    "How the evidence desk is being used, and where it falls short.",
    "Как используется стол доказательств и где он даёт сбой.",
    "Дәлелдер үстелі қалай қолданылатыны және қайда жетіспейтіні."
  ],
  "an.gapsopen": [
    "Open questions",
    "Открытые вопросы",
    "Ашық сұрақтар"
  ],
  "an.usage": [
    "Searches per day",
    "Поиски в день",
    "Күндік іздеулер"
  ],
  "an.chart": [
    "Stacked bar chart of answered and unanswered searches over the last 14 days",
    "Столбчатая диаграмма отвеченных и неотвеченных поисков за 14 дней",
    "Соңғы 14 күндегі жауап берілген және берілмеген іздеулер диаграммасы"
  ],
  "an.answered": [
    "Answered",
    "Отвечено",
    "Жауап берілді"
  ],
  "an.abstained": [
    "Could not verify",
    "Не удалось подтвердить",
    "Растау мүмкін болмады"
  ],
  "an.success": [
    "Search success",
    "Успешность поиска",
    "Іздеу тиімділігі"
  ],
  "an.ans.rate": [
    "Answered with evidence",
    "Отвечено с доказательствами",
    "Дәлелдермен жауап берілді"
  ],
  "an.abst.rate": [
    "Honest “cannot verify”",
    "Честное «нельзя подтвердить»",
    "Адал «растау мүмкін емес»"
  ],
  "an.helpful": [
    "Rated helpful (this browser)",
    "Полезно (этот браузер)",
    "Пайдалы деп бағаланды (бұл браузер)"
  ],
  "an.median": [
    "Median retrieval time (live)",
    "Медиана времени поиска",
    "Іздеу уақытының медианасы"
  ],
  "an.note": [
    "“Cannot verify” is a correct outcome when sources lack the answer; it is not counted as a failure.",
    "«Нельзя подтвердить» — корректный исход, когда в источниках нет ответа, а не ошибка.",
    "Дереккөздерде жауап болмаса, «растау мүмкін емес» — дұрыс нәтиже, қате емес."
  ],
  "an.top": [
    "Most frequently asked",
    "Чаще всего спрашивают",
    "Ең жиі сұралатындар"
  ],
  "an.coverage": [
    "Coverage by topic",
    "Покрытие по темам",
    "Тақырыптар бойынша қамту"
  ],
  "an.cov.note": [
    "Coverage counts indexed passages per topic. Topics marked Missing are ones staff ask about that no source covers.",
    "Покрытие учитывает проиндексированные отрывки по темам. Помеченные «Отсутствует» темы спрашивают, но ни один источник не покрывает.",
    "Қамту әр тақырыптағы индекстелген үзінділерді санайды. «Жоқ» деп белгіленген тақырыптар сұралады, бірақ дереккөз жоқ."
  ],
  "cov.strong": [
    "Strong",
    "Сильное",
    "Күшті"
  ],
  "cov.partial": [
    "Partial",
    "Частичное",
    "Ішінара"
  ],
  "cov.missing": [
    "Missing",
    "Отсутствует",
    "Жоқ"
  ],
  "an.recent": [
    "Recent searches",
    "Последние поиски",
    "Соңғы іздеулер"
  ],
  "gap.other": [
    "Uncategorised",
    "Без категории",
    "Санатталмаған"
  ],
  "gap.sub": [
    "Questions the desk refused to answer because the sources did not contain enough evidence.",
    "Вопросы, на которые система не ответила из-за отсутствия доказательств в источниках.",
    "Дереккөздерде дәлел жеткіліксіз болғандықтан жауап берілмеген сұрақтар."
  ],
  "gap.clusters": [
    "Recurring questions by topic",
    "Повторяющиеся вопросы по темам",
    "Тақырып бойынша қайталанатын сұрақтар"
  ],
  "gap.clusters.note": [
    "Counts are how many times people asked. Add a source on the most frequent topic first.",
    "Счётчик показывает, сколько раз спрашивали. Сначала добавьте источник по самой частой теме.",
    "Санақ сұрақтар санын көрсетеді. Алдымен ең жиі тақырып бойынша дереккөз қосыңыз."
  ],
  "gap.tab.open": [
    "Open",
    "Открытые",
    "Ашық"
  ],
  "gap.tab.resolved": [
    "Resolved",
    "Закрытые",
    "Жабылған"
  ],
  "gap.tab.all": [
    "All",
    "Все",
    "Барлығы"
  ],
  "gap.q": [
    "Question",
    "Вопрос",
    "Сұрақ"
  ],
  "gap.reason": [
    "Why it could not be answered",
    "Почему не удалось ответить",
    "Неге жауап берілмеді"
  ],
  "gap.docs": [
    "Related sources",
    "Близкие источники",
    "Қатысты дереккөздер"
  ],
  "gap.date": [
    "Last asked",
    "Последний раз",
    "Соңғы сұралуы"
  ],
  "gap.open": [
    "Open",
    "Открыт",
    "Ашық"
  ],
  "gap.resolved": [
    "Resolved",
    "Закрыт",
    "Жабылды"
  ],
  "gap.resolve": [
    "Mark resolved",
    "Отметить закрытым",
    "Жабылды деп белгілеу"
  ],
  "gap.reopen": [
    "Reopen",
    "Открыть снова",
    "Қайта ашу"
  ],
  "gap.rerun": [
    "Ask again",
    "Спросить снова",
    "Қайта сұрау"
  ],
  "gap.times": [
    "Asked {0}×",
    "Спросили {0} раз",
    "{0} рет сұралды"
  ],
  "gap.hint": [
    "After adding a source with the missing information, use “Ask again”, then mark the question resolved.",
    "После добавления источника с недостающей информацией нажмите «Спросить снова» и закройте вопрос.",
    "Жетіспейтін мәліметі бар дереккөзді қосқан соң «Қайта сұрау», содан кейін сұрақты жабыңыз."
  ],
  "gap.empty": [
    "No open questions",
    "Открытых вопросов нет",
    "Ашық сұрақ жоқ"
  ],
  "gap.empty.sub": [
    "Questions that cannot be answered will appear here.",
    "Вопросы без ответа появятся здесь.",
    "Жауабы жоқ сұрақтар мұнда пайда болады."
  ],
  "set.sub": [
    "Language, appearance and evidence behaviour.",
    "Язык, внешний вид и работа с доказательствами.",
    "Тіл, сыртқы түр және дәлелдермен жұмыс."
  ],
  "set.lang": [
    "Language",
    "Язык",
    "Тіл"
  ],
  "set.lang.t": [
    "Interface language",
    "Язык интерфейса",
    "Интерфейс тілі"
  ],
  "set.lang.d": [
    "Applies to the whole interface, demo sources and demo answers. Remembered on this device.",
    "Относится ко всему интерфейсу, демо-источникам и ответам. Запоминается на устройстве.",
    "Бүкіл интерфейске, демо-дереккөздерге және жауаптарға қолданылады. Құрылғыда сақталады."
  ],
  "set.appear": [
    "Appearance",
    "Внешний вид",
    "Сыртқы түр"
  ],
  "set.theme": [
    "Theme",
    "Тема",
    "Тақырып"
  ],
  "theme.light": [
    "Light",
    "Светлая",
    "Ашық"
  ],
  "theme.dark": [
    "Dark",
    "Тёмная",
    "Күңгірт"
  ],
  "theme.system": [
    "System",
    "Системная",
    "Жүйелік"
  ],
  "set.kb": [
    "Retrieval",
    "Поиск",
    "Іздеу"
  ],
  "set.thr": [
    "Evidence threshold",
    "Порог доказательств",
    "Дәлелдер шегі"
  ],
  "set.thr.d": [
    "Minimum share of the question that retrieved passages must cover. Higher means the desk refuses more often. Applies to live retrieval.",
    "Минимальная доля вопроса, которую должны покрыть найденные отрывки. Выше — чаще отказы. Относится к живому поиску.",
    "Табылған үзінділер сұрақтың қанша бөлігін қамтуы керек. Жоғары болса, жиірек бас тартады. Тікелей іздеуге қолданылады."
  ],
  "set.max": [
    "Sources per answer",
    "Источников на ответ",
    "Жауаптағы дереккөздер"
  ],
  "set.max.d": [
    "Maximum passages shown as evidence for live retrieval.",
    "Максимум отрывков, показываемых как доказательство.",
    "Тікелей іздеуде дәлел ретінде көрсетілетін үзінділер саны."
  ],
  "set.details": [
    "Show “How this was verified”",
    "Показывать «Как это подтверждено»",
    "«Бұл қалай расталды»-ды көрсету"
  ],
  "set.details.d": [
    "Adds retrieval statistics under each answer.",
    "Добавляет статистику поиска под каждым ответом.",
    "Әр жауаптың астына іздеу статистикасын қосады."
  ],
  "set.demo": [
    "Demo mode",
    "Демо-режим",
    "Демо-режим"
  ],
  "set.demo.t": [
    "Demo sources",
    "Демо-источники",
    "Демо-дереккөздер"
  ],
  "set.demo.d": [
    "Restore any demo sources you removed.",
    "Восстановить удалённые демо-источники.",
    "Жойылған демо-дереккөздерді қалпына келтіру."
  ],
  "set.restore": [
    "Restore demo sources",
    "Восстановить демо-источники",
    "Демо-дереккөздерді қалпына келтіру"
  ],
  "set.tour": [
    "Guided demo",
    "Экскурсия",
    "Экскурсия"
  ],
  "set.tour.d": [
    "A three-minute scripted walkthrough for presentations.",
    "Трёхминутный сценарий для демонстраций.",
    "Ұсыныс үшін үш минуттық сценарий."
  ],
  "set.ob": [
    "Welcome tour",
    "Вводная экскурсия",
    "Таныстыру экскурсиясы"
  ],
  "set.ob.btn": [
    "Replay",
    "Повторить",
    "Қайталау"
  ],
  "set.backend": [
    "Real backend (optional)",
    "Настоящий сервер (необязательно)",
    "Нақты сервер (міндетті емес)"
  ],
  "set.be.on": [
    "Connected",
    "Подключено",
    "Қосылды"
  ],
  "set.be.off": [
    "Not configured",
    "Не настроено",
    "Бапталмаған"
  ],
  "set.endpoint": [
    "Ask endpoint URL",
    "URL сервера вопросов",
    "Сұрау серверінің URL-і"
  ],
  "set.endpoint.d": [
    "If set, questions are POSTed to your server (see README for the JSON contract) instead of the local retriever. Never enter an API key here.",
    "Если задано, вопросы отправляются на ваш сервер (контракт JSON в README) вместо локального поиска. Никогда не вводите здесь API-ключ.",
    "Егер көрсетілсе, сұрақтар жергілікті іздеудің орнына серверіңізге жіберіледі (JSON келісімі README-де). Мұнда API кілтін енгізбеңіз."
  ],
  "set.general": [
    "General",
    "Общее",
    "Жалпы"
  ],
  "set.clear": [
    "Reset local data",
    "Сбросить локальные данные",
    "Жергілікті деректерді қалпына келтіру"
  ],
  "set.clear.d": [
    "Deletes uploads, history, feedback and settings stored in this browser.",
    "Удаляет загрузки, историю, отзывы и настройки в этом браузере.",
    "Бұл браузердегі жүктелгендерді, тарихты, пікірлер мен баптауларды жояды."
  ],
  "set.clear.btn": [
    "Reset",
    "Сбросить",
    "Қалпына келтіру"
  ],
  "set.about": [
    "About this build",
    "Об этой сборке",
    "Бұл жинақ туралы"
  ],
  "set.about.d": [
    "Static web app with no install step. BM25 retrieval with an evidence-coverage threshold; optional CDN models and a configured backend can make network calls.",
    "Статическое приложение без шага установки. Поиск BM25 с порогом покрытия доказательствами; дополнительные модели из CDN и настроенный сервер могут обращаться к сети.",
    "Орнату қадамы жоқ статикалық қолданба. BM25 іздеу, дәлелдермен қамту шегі бар; қосымша CDN үлгілері мен реттелген сервер желіге сұрау жіберуі мүмкін."
  ],
  "reset.title": [
    "Reset all local data?",
    "Сбросить все локальные данные?",
    "Барлық жергілікті деректерді қалпына келтіру керек пе?"
  ],
  "reset.body": [
    "Uploaded sources, history, feedback and settings will be deleted from this browser.",
    "Загруженные источники, история, отзывы и настройки будут удалены из браузера.",
    "Жүктелген дереккөздер, тарих, пікірлер мен баптаулар браузерден жойылады."
  ],
  "ob.0.t": [
    "Ask in plain language",
    "Спросите обычным языком",
    "Қарапайым тілмен сұраңыз"
  ],
  "ob.0.d": [
    "“What is the maximum metformin dose?” “How are serum samples handled?” Ask the way you would ask a colleague.",
    "«Какова максимальная доза метформина?» «Как обрабатывают сыворотку?» Спросите, как у коллеги.",
    "«Метформиннің ең жоғары дозасы қандай?» «Сарысуды қалай өңдейді?» Әріптестен сұрағандай сұраңыз."
  ],
  "ob.1.t": [
    "Check where it came from",
    "Проверьте источник",
    "Дереккөзін тексеріңіз"
  ],
  "ob.1.d": [
    "Every answer has numbered citations. Click one to see the exact highlighted passage, file and location.",
    "У каждого ответа есть нумерованные ссылки. Нажмите, чтобы увидеть выделенный отрывок, файл и место.",
    "Әр жауапта нөмірленген дәйексөздер бар. Басып, ерекшеленген үзіндіні, файл мен орынды көріңіз."
  ],
  "ob.2.t": [
    "Trust the “I can’t verify”",
    "Доверяйте «не могу подтвердить»",
    "«Растай алмаймын»-ға сеніңіз"
  ],
  "ob.2.d": [
    "If the sources do not contain the answer, the desk says so and logs an open question instead of guessing.",
    "Если в источниках нет ответа, система говорит об этом и заводит открытый вопрос, а не гадает.",
    "Дереккөздерде жауап болмаса, жүйе солай айтып, ашық сұрақ тіркейді, болжам жасамайды."
  ],
  "ob.start": [
    "Start",
    "Начать",
    "Бастау"
  ],
  "tour.start": [
    "Guided demo",
    "Экскурсия",
    "Экскурсия"
  ],
  "tour.label": [
    "Guided demo",
    "Экскурсия",
    "Экскурсия"
  ],
  "tour.step": [
    "Step {0} of {1}",
    "Шаг {0} из {1}",
    "{1}-қадамның {0}-і"
  ],
  "tour.skip": [
    "End tour",
    "Завершить экскурсию",
    "Экскурсияны аяқтау"
  ],
  "tour.done": [
    "Finish",
    "Завершить",
    "Аяқтау"
  ],
  "tour.0.t": [
    "The problem",
    "Проблема",
    "Мәселе"
  ],
  "tour.0.d": [
    "Dosages, interactions and reporting rules are spread across files and people’s heads. Next, a real question about a fictional diagnostic network.",
    "Дозы, взаимодействия и правила отчётности разбросаны по файлам и головам. Далее — реальный вопрос о вымышленной сети лабораторий.",
    "Дозалар, өзара әрекеттесу және есеп беру ережелері файлдарда және адамдардың басында шашыраңқы. Келесі — ойдан шығарылған зертханалық желі туралы нақты сұрақ."
  ],
  "tour.1.t": [
    "Answer in seconds",
    "Ответ за секунды",
    "Секундтар ішінде жауап"
  ],
  "tour.1.d": [
    "A direct answer, numbered citations and evidence cards. Notice the conflict panel: an old note versus the current formulary.",
    "Прямой ответ, ссылки и карточки доказательств. Обратите внимание на панель конфликта: старая запись против формуляра.",
    "Тікелей жауап, нөмірленген дәйексөздер мен дәлел карталары. Қайшылық панеліне назар аударыңыз: ескі жазба мен қолданыстағы формуляр."
  ],
  "tour.2.t": [
    "Click the citation",
    "Нажмите на ссылку",
    "Дәйексөзді басыңыз"
  ],
  "tour.2.d": [
    "The source panel shows the exact highlighted passage, file metadata and location. Nothing is invented.",
    "Панель источника показывает точный выделенный отрывок, метаданные и местоположение. Ничего не выдумано.",
    "Дереккөз панелі нақты ерекшеленген үзіндіні, метадеректер мен орынды көрсетеді. Ештеңе ойдан шығарылмаған."
  ],
  "tour.3.t": [
    "Several sources agree",
    "Несколько источников согласны",
    "Бірнеше дереккөз келіседі"
  ],
  "tour.3.d": [
    "A sample-handling question draws on the SOP and the cold-chain policy together.",
    "Вопрос об обработке проб опирается на СОП и политику хранения одновременно.",
    "Үлгі өңдеу сұрағы СОП пен сақтау саясатына бір уақытта сүйенеді."
  ],
  "tour.4.t": [
    "The honest “I can’t verify”",
    "Честное «не могу подтвердить»",
    "Адал «растай алмаймын»"
  ],
  "tour.4.d": [
    "Paediatric dosing is not in the documents. The desk refuses to guess and points to the closest source.",
    "Педиатрических доз в документах нет. Система не гадает и указывает ближайший источник.",
    "Балалар дозалары құжаттарда жоқ. Жүйе болжамай, ең жақын дереккөзді көрсетеді."
  ],
  "tour.5.t": [
    "Open-question tracking",
    "Учёт открытых вопросов",
    "Ашық сұрақтарды есепке алу"
  ],
  "tour.5.d": [
    "Refused questions are collected here, grouped by topic and counted. Add a source, ask again, then close the question.",
    "Отказы собираются здесь, группируются и считаются. Добавьте источник, спросите снова и закройте вопрос.",
    "Бас тартулар мұнда жиналып, топталып саналады. Дереккөз қосып, қайта сұрап, сұрақты жабыңыз."
  ],
  "tour.6.t": [
    "Coverage and insights",
    "Покрытие и аналитика",
    "Қамту және талдау"
  ],
  "tour.6.d": [
    "See which topics are well covered and which are missing. That is your roadmap for the next source. Try your own questions now.",
    "Видно, какие темы покрыты хорошо, а какие отсутствуют. Это план следующего источника. Попробуйте свои вопросы.",
    "Қай тақырыптар жақсы қамтылғанын және қайсысы жоқ екенін көріңіз. Бұл келесі дереккөз жоспары. Өз сұрақтарыңызды қойыңыз."
  ],
  "toast.copyfail": [
    "Copying is blocked in this view. Select the text and copy it manually.",
    "Копирование заблокировано в этом окне. Выделите текст и скопируйте вручную.",
    "Бұл көріністе көшіру бұғатталған. Мәтінді таңдап, қолмен көшіріңіз."
  ],
  "toast.copied": [
    "Answer copied",
    "Ответ скопирован",
    "Жауап көшірілді"
  ],
  "toast.citecopied": [
    "Citations copied",
    "Ссылки скопированы",
    "Дәйексөздер көшірілді"
  ],
  "toast.shared": [
    "Structured answer copied to clipboard",
    "Структурированный ответ скопирован в буфер",
    "Құрылымдық жауап буферге көшірілді"
  ],
  "toast.thanks": [
    "Thanks, feedback saved on this device",
    "Спасибо, отзыв сохранён на этом устройстве",
    "Рақмет, пікір осы құрылғыда сақталды"
  ],
  "toast.reported": [
    "Reported as incorrect and saved on this device",
    "Помечено как неверное и сохранено на этом устройстве",
    "Қате деп белгіленіп, осы құрылғыда сақталды"
  ],
  "toast.lang": [
    "Language: {0}",
    "Тіл: {0}",
    "Тіл: {0}"
  ],
  "toast.processed": [
    "{0} indexed. Passages: {1}",
    "{0} проиндексирован. Отрывков: {1}",
    "{0} индекстелді. Үзінділер: {1}"
  ],
  "toast.failed": [
    "{0} could not be indexed",
    "{0} не удалось проиндексировать",
    "{0} индекстеу мүмкін болмады"
  ],
  "toast.storage": [
    "Browser storage is full; this upload will not persist after reload.",
    "Память браузера заполнена; загрузка не сохранится после перезагрузки.",
    "Браузер жады толды; жүктеу қайта жүктеуден кейін сақталмайды."
  ],
  "toast.removed": [
    "{0} removed",
    "{0} удалён",
    "{0} жойылды"
  ],
  "toast.restored": [
    "Demo sources restored",
    "Демо-источники восстановлены",
    "Демо-дереккөздер қалпына келтірілді"
  ],
  "toast.reupload": [
    "The original file is no longer in memory. Upload it again.",
    "Исходный файл больше не в памяти. Загрузите его снова.",
    "Түпнұсқа файл енді жадыда жоқ. Қайта жүктеңіз."
  ],
  "toast.resolved": [
    "Question marked resolved",
    "Вопрос закрыт",
    "Сұрақ жабылды"
  ],
  "toast.reopened": [
    "Question reopened",
    "Вопрос открыт снова",
    "Сұрақ қайта ашылды"
  ],
  "toast.reset": [
    "Local data reset",
    "Локальные данные сброшены",
    "Жергілікті деректер қалпына келтірілді"
  ],
  "toast.badurl": [
    "Use an HTTPS URL; http:// is allowed only for localhost or 127.0.0.1",
    "Используйте HTTPS-адрес; http:// разрешён только для localhost или 127.0.0.1",
    "HTTPS URL пайдаланыңыз; http:// тек localhost немесе 127.0.0.1 үшін рұқсат етілген"
  ],
  "toast.ep.on": [
    "Backend endpoint saved",
    "Адрес сервера сохранён",
    "Сервер адресі сақталды"
  ],
  "toast.ep.off": [
    "Using the local retriever",
    "Используется локальный поиск",
    "Жергілікті іздеу қолданылуда"
  ],
  "st.ocr": [
    "OCR",
    "OCR",
    "OCR"
  ],
  "unit.ms": [
    "ms",
    "мс",
    "мс"
  ],
  "qs.key": [
    "K",
    "K",
    "K"
  ],
  "qs.esc": [
    "Esc",
    "Esc",
    "Esc"
  ],
  "tour.timeup": [
    "Time is up — continue when ready",
    "Время вышло — продолжите, когда будете готовы",
    "Уақыт бітті — дайын болғанда жалғастырыңыз"
  ],
  "err.storage": [
    "Not saved: browser storage is full. Remove a document or clear the data.",
    "Не сохранено: хранилище браузера заполнено. Удалите документ или очистите данные.",
    "Сақталмады: браузер жадысы толды. Құжатты өшіріңіз немесе деректерді тазалаңыз."
  ]
};
