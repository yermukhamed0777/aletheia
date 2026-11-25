/* Demo corpus: fictional diagnostic network "Asklepia Diagnostics". Every line is [en, ru, kk]. */
const CORPUS = (() => {
  const DOCS = [
    { id: 'form',  name: 'Formulary_2026.xlsx',            type: 'xlsx', size: 61440,   ago: 410, sheets: 3, cat: ['Medicine formulary','Формуляр лекарств','Дәрі-дәрмек формуляры'] },
    { id: 'sop',   name: 'Specimen_Handling_SOP.pdf',       type: 'pdf',  size: 1782579, ago: 520, pages: 12, cat: ['Laboratory SOP','СОП лаборатории','Зертханалық СОП'] },
    { id: 'abx',   name: 'Antimicrobial_Stewardship.pdf',   type: 'pdf',  size: 987136,  ago: 280, pages: 9,  cat: ['Clinical policy','Клиническая политика','Клиникалық саясат'] },
    { id: 'inter', name: 'Interaction_Matrix.csv',          type: 'csv',  size: 4096,    ago: 300, rows: 18, cat: ['Interaction table','Таблица взаимодействий','Өзара әрекеттесу кестесі'] },
    { id: 'cold',  name: 'Cold_Chain_Policy.docx',          type: 'docx', size: 45568,   ago: 365, cat: ['Storage policy','Политика хранения','Сақтау саясаты'] },
    { id: 'report',name: 'Critical_Results_Reporting.docx', type: 'docx', size: 51200,   ago: 250, cat: ['Reporting rule','Правило отчётности','Есеп беру ережесі'] },
    { id: 'help',  name: 'Helpdesk_FAQ.txt',                type: 'txt',  size: 7168,    ago: 90,  cat: ['Internal FAQ','Внутренний FAQ','Ішкі FAQ'] },
  ];

  // loc: {page}|{sheet,rows}|{section}|{rows}|{lines}
  const CHUNKS = [
    { id: 'form1', doc: 'form', loc: { sheet: 'Dosages 2026', rows: '2–4' }, topic: 'dosage', lines: [
      ['Metformin 500 mg tablet: one tablet twice daily with meals; maximum 2000 mg per day.','Метформин 500 мг: по одной таблетке два раза в день во время еды; максимум 2000 мг в сутки.','Метформин 500 мг: тамақтану кезінде күніне екі рет бір таблетка; ең жоғары тәуліктік дозасы 2000 мг.'],
      ['Metformin is not used when eGFR is below 30 mL/min/1.73 m².','Метформин не применяется при рСКФ ниже 30 мл/мин/1,73 м².','рСКФ 30 мл/мин/1,73 м²-ден төмен болғанда метформин қолданылмайды.'],
      ['The dose is reduced to 500 mg once daily when eGFR is 30–44.','При рСКФ 30–44 доза снижается до 500 мг один раз в день.','рСКФ 30–44 болғанда доза күніне бір рет 500 мг-ға дейін азайтылады.'] ] },

    { id: 'form2', doc: 'form', loc: { sheet: 'Dosages 2026', rows: '5–8' }, topic: 'dosage', lines: [
      ['Vancomycin: 15–20 mg/kg IV every 8–12 hours, adjusted to the trough level.','Ванкомицин: 15–20 мг/кг в/в каждые 8–12 часов с коррекцией по остаточной концентрации.','Ванкомицин: 15–20 мг/кг венаға әр 8–12 сағат сайын, қалдық концентрациясына қарай реттеледі.'],
      ['Target trough: 10–15 mg/L for uncomplicated infection; 15–20 mg/L for deep-seated infection.','Целевой остаточный уровень: 10–15 мг/л при неосложнённой инфекции; 15–20 мг/л при глубоко расположенной инфекции.','Мақсатты қалдық деңгей: асқынбаған инфекцияда 10–15 мг/л; терең орналасқан инфекцияда 15–20 мг/л.'],
      ['Renal function is rechecked at least every 48 hours during therapy.','Функция почек проверяется не реже чем каждые 48 часов во время терапии.','Емдеу кезінде бүйрек қызметі кем дегенде әр 48 сағат сайын тексеріледі.'] ] },

    { id: 'form3', doc: 'form', loc: { sheet: 'Dosages 2026', rows: '9–12' }, topic: 'dosage', lines: [
      ['Amoxicillin/clavulanate 875/125 mg: one tablet every 12 hours for 7 days.','Амоксициллин/клавуланат 875/125 мг: одна таблетка каждые 12 часов в течение 7 дней.','Амоксициллин/клавуланат 875/125 мг: 7 күн бойы әр 12 сағат сайын бір таблетка.'],
      ['Amoxicillin/clavulanate 625 mg: one tablet every 8 hours.','Амоксициллин/клавуланат 625 мг: одна таблетка каждые 8 часов.','Амоксициллин/клавуланат 625 мг: әр 8 сағат сайын бір таблетка.'] ] },

    { id: 'form4', doc: 'form', loc: { sheet: 'Renal adjustments', rows: '2–5' }, topic: 'dosage', lines: [
      ['For eGFR 30–60, reduce the direct oral anticoagulant dose according to the formulary table.','При рСКФ 30–60 дозу прямого перорального антикоагулянта снижают по таблице формуляра.','рСКФ 30–60 кезінде тікелей ауызша антикоагулянт дозасы формуляр кестесі бойынша азайтылады.'],
      ['Paracetamol requires no dose adjustment when eGFR is above 30.','Парацетамол не требует коррекции дозы при рСКФ выше 30.','рСКФ 30-дан жоғары болғанда парацетамол дозасын реттеу қажет емес.'],
      ['All doses in this formulary assume adult patients; paediatric dosing is not included.','Все дозы в формуляре рассчитаны на взрослых; педиатрические дозы не приведены.','Формулярдағы барлық дозалар ересектерге арналған; балалар дозалары кірмейді.'] ] },

    { id: 'sop1', doc: 'sop', loc: { page: 2 }, topic: 'handling', lines: [
      ['Serum for chemistry: allow to clot for 30 minutes, then centrifuge at 1600 g for 10 minutes.','Сыворотка для биохимии: дать свернуться 30 минут, затем центрифугировать при 1600 g в течение 10 минут.','Биохимия үшін сарысу: 30 минут ұйытып, содан кейін 1600 g-де 10 минут центрифугалау.'],
      ['Separate serum from the gel barrier within 2 hours of collection.','Отделить сыворотку от гелевого барьера в течение 2 часов после забора.','Үлгі алынғаннан кейін 2 сағат ішінде сарысуды гельдік тосқауылдан бөлу керек.'] ] },

    { id: 'sop2', doc: 'sop', loc: { page: 3 }, topic: 'handling', lines: [
      ['Haemolysed samples are rejected for potassium and LDH; a new sample must be requested.','Гемолизированные пробы отклоняются для калия и ЛДГ; требуется новая проба.','Гемолизделген үлгілер калий мен ЛДГ үшін қабылданбайды; жаңа үлгі сұрау керек.'],
      ['Record the rejection reason in the LIS before repeating the analysis.','Причина отказа записывается в ЛИМС до повторного анализа.','Қайта талдау алдында қабылдамау себебін ЛИМС-ке жазыңыз.'] ] },

    { id: 'sop3', doc: 'sop', loc: { page: 4 }, topic: 'handling', lines: [
      ['Whole blood for haematology is collected in K2EDTA tubes and analysed within 6 hours.','Цельная кровь для гематологии собирается в пробирки K2EDTA и анализируется в течение 6 часов.','Гематология үшін тұтас қан K2EDTA түтіктеріне алынып, 6 сағат ішінде талданады.'],
      ['Coagulation samples are collected in citrated tubes filled to the marked line.','Пробы для коагуляции собирают в цитратные пробирки, заполненные до отметки.','Коагуляция үлгілері белгіге дейін толтырылған цитрат түтіктеріне алынады.'] ] },

    { id: 'sop4', doc: 'sop', loc: { page: 5 }, topic: 'handling', lines: [
      ['Urine samples for culture are refrigerated at 2–8 °C if analysis is delayed beyond 4 hours.','Моча для посева хранится в холодильнике при 2–8 °C, если анализ откладывается более чем на 4 часа.','Посевке арналған зәр талдау 4 сағаттан артық кешіктірілсе, 2–8 °C-та тоңазытылады.'] ] },

    { id: 'abx1', doc: 'abx', loc: { page: 2 }, topic: 'policy', lines: [
      ['First-line therapy for uncomplicated community-acquired pneumonia is amoxicillin/clavulanate.','Препаратом первого выбора при неосложнённой внебольничной пневмонии является амоксициллин/клавуланат.','Асқынбаған қауымдастықтан алынған пневмонияда бірінші кезектегі препарат — амоксициллин/клавуланат.'],
      ['Antibiotic therapy is reviewed at 48–72 hours with de-escalation where possible.','Антибиотикотерапия пересматривается через 48–72 часа с деэскалацией по возможности.','Антибиотик емі 48–72 сағаттан кейін қайта қаралып, мүмкін болса деэскалацияланады.'] ] },

    { id: 'abx2', doc: 'abx', loc: { page: 3 }, topic: 'policy', lines: [
      ['Carbapenems require approval by the antimicrobial stewardship team before release.','Карбапенемы требуют одобрения группы по антимикробному управлению до выдачи.','Карбапенемдерді беру алдында антимикробтік басқару тобының рұқсаты қажет.'],
      ['Intravenous-to-oral switch is allowed once the patient is afebrile for 24 hours and tolerating oral intake.','Переход с в/в на пероральный приём разрешён после 24 часов без лихорадки и при переносимости приёма внутрь.','Вена ішінен ауызша қабылдауға ауысу 24 сағат қызбасыз және ауызша тамақтануды көтергеннен кейін рұқсат етіледі.'] ] },

    { id: 'abx3', doc: 'abx', loc: { page: 4 }, topic: 'policy', lines: [
      ['Prophylactic antibiotics are not part of routine care and are not covered by this policy.','Профилактические антибиотики не входят в рутинную помощь и не регулируются этой политикой.','Профилактикалық антибиотиктер күнделікті емге кірмейді және бұл саясатқа енбейді.'],
      ['This policy does not cover outpatient prescriptions or dental prophylaxis.','Политика не распространяется на амбулаторные назначения и стоматологическую профилактику.','Бұл саясат амбулаториялық тағайындаулар мен стоматологиялық профилактиканы қамтымайды.'] ] },

    { id: 'inter1', doc: 'inter', loc: { rows: '2–4' }, topic: 'interactions', lines: [
      ['Warfarin + clarithromycin: increased INR. Check INR within 3 days and consider a dose reduction.','Варфарин + кларитромицин: повышение МНО. Проверить МНО в течение 3 дней и рассмотреть снижение дозы.','Варфарин + кларитромицин: МНО жоғарылайды. 3 күн ішінде МНО тексеріп, дозаны азайтуды қарастыру керек.'],
      ['Warfarin + paracetamol above 2 g/day may also increase INR; monitor.','Варфарин + парацетамол более 2 г/сутки также может повысить МНО; контролировать.','Варфарин + парацетамол тәулігіне 2 г-нан артық болса, МНО жоғарылауы мүмкін; бақылау қажет.'] ] },

    { id: 'inter2', doc: 'inter', loc: { rows: '5–7' }, topic: 'interactions', lines: [
      ['Metformin + iodinated contrast: withhold metformin on the day of the scan; restart after 48 hours if renal function is stable.','Метформин + йодсодержащее контрастное вещество: отменить метформин в день исследования; возобновить через 48 часов при стабильной функции почек.','Метформин + йодты контраст: зерттеу күні метформин тоқтатылады; бүйрек қызметі тұрақты болса, 48 сағаттан кейін қайта басталады.'],
      ['This rule applies to contrast imaging only, not to all imaging.','Правило относится только к контрастной визуализации, а не ко всем исследованиям.','Бұл ереже тек контрастты зерттеулерге қатысты, барлық зерттеулерге емес.'] ] },

    { id: 'inter3', doc: 'inter', loc: { rows: '8–10' }, topic: 'interactions', lines: [
      ['Linezolid + sertraline: risk of serotonin syndrome; avoid the combination where possible.','Линезолид + сертралин: риск серотонинового синдрома; по возможности избегать сочетания.','Линезолид + сертралин: серотонин синдромы қаупі; мүмкін болса бірлестіруден аулақ болу.'],
      ['Amiodarone + digoxin: reduce the digoxin dose by 50% and monitor levels.','Амиодарон + дигоксин: снизить дозу дигоксина на 50% и контролировать уровень.','Амиодарон + дигоксин: дигоксин дозасын 50%-ға азайтып, деңгейін бақылау.'] ] },

    { id: 'cold1', doc: 'cold', loc: { section: '§1' }, topic: 'storage', lines: [
      ['mRNA vaccines are stored at −90 °C to −15 °C in a dedicated freezer.','мРНК-вакцины хранят при −90…−15 °C в отдельном морозильнике.','мРНК вакциналары арнайы тоңазытқышта −90…−15 °C-та сақталады.'],
      ['Temperature is logged twice daily; excursions above −15 °C require a quality review.','Температура записывается дважды в день; повышение выше −15 °C требует проверки качества.','Температура күніне екі рет жазылады; −15 °C-тан жоғары ауытқу сапа тексеруін талап етеді.'] ] },

    { id: 'cold2', doc: 'cold', loc: { section: '§2' }, topic: 'storage', lines: [
      ['Refrigerated reagents are kept at 2–8 °C. Do not freeze.','Охлаждаемые реагенты хранятся при 2–8 °C. Не замораживать.','Тоңазытылған реагенттер 2–8 °C-та сақталады. Мұздатпаңыз.'],
      ['A refrigerator used for reagents must not store food or specimens.','В холодильнике для реагентов нельзя хранить продукты или пробы.','Реагенттерге арналған тоңазытқышта тамақ немесе үлгілер сақталмауы керек.'] ] },

    { id: 'cold3', doc: 'cold', loc: { section: '§3' }, topic: 'storage', lines: [
      ['Frozen plasma is stored at −18 °C or below for up to 12 months.','Замороженная плазма хранится при −18 °C или ниже до 12 месяцев.','Мұздатылған плазма −18 °C немесе одан төменде 12 айға дейін сақталады.'],
      ['Thawed plasma is kept at 2–8 °C and used within 24 hours.','Размороженная плазма хранится при 2–8 °C и используется в течение 24 часов.','Ерітілген плазма 2–8 °C-та сақталып, 24 сағат ішінде пайдаланылады.'] ] },

    { id: 'report1', doc: 'report', loc: { section: '§1' }, topic: 'reporting', lines: [
      ['Critical potassium result (below 2.5 or above 6.5 mmol/L): phone the requesting clinician within 15 minutes.','Критический калий (ниже 2,5 или выше 6,5 ммоль/л): позвонить направившему врачу в течение 15 минут.','Критикалық калий (2,5-тен төмен немесе 6,5 ммоль/л-ден жоғары): 15 минут ішінде жіберген дәрігерге қоңырау шалу.'],
      ['Read the result back and record the time and the name of the person notified.','Повторить результат вслух и записать время и имя уведомлённого лица.','Нәтижені қайта оқып, уақытын және хабардар етілген адамның есімін жазыңыз.'] ] },

    { id: 'report2', doc: 'report', loc: { section: '§2' }, topic: 'reporting', lines: [
      ['Critical glucose below 2.2 mmol/L in an adult: phone immediately and document.','Критическая глюкоза ниже 2,2 ммоль/л у взрослого: позвонить немедленно и задокументировать.','Ересекте глюкоза 2,2 ммоль/л-ден төмен болса: дереу қоңырау шалып, тіркеу керек.'],
      ['If the clinician cannot be reached, escalate to the ward nurse in charge.','Если врач недоступен, обратиться к старшей медсестре отделения.','Дәрігерге жету мүмкін болмаса, бөлімшенің аға мейірбикесіне хабарласыңыз.'] ] },

    { id: 'report3', doc: 'report', loc: { section: '§3' }, topic: 'reporting', lines: [
      ['All critical values are recorded in the LIS with the notification status.','Все критические значения записываются в ЛИМС со статусом уведомления.','Барлық критикалық мәндер хабарлау мәртебесімен ЛИМС-ке енгізіледі.'],
      ['A result that is not acknowledged within 30 minutes is escalated to the laboratory manager.','Результат, не подтверждённый в течение 30 минут, передаётся заведующему лабораторией.','30 минут ішінде расталмаған нәтиже зертхана меңгерушісіне жіберіледі.'] ] },

    { id: 'help1', doc: 'help', loc: { lines: '1–6' }, topic: 'general', lines: [
      ['Helpdesk hours: Monday–Friday 08:00–17:00; Saturday 09:00–13:00.','Часы работы хелпдеска: понедельник–пятница 08:00–17:00; суббота 09:00–13:00.','Хелпдеск жұмыс уақыты: дүйсенбі–жұма 08:00–17:00; сенбі 09:00–13:00.'],
      ['Contact: lab-helpdesk@asklepia.example.','Контакт: lab-helpdesk@asklepia.example.','Байланыс: lab-helpdesk@asklepia.example.'] ] },

    { id: 'help2', doc: 'help', loc: { lines: '7–12' }, topic: 'general', lines: [
      ['The formulary is updated every 12 months; the newest approved version is authoritative.','Формуляр обновляется каждые 12 месяцев; действует последняя утверждённая версия.','Формуляр әр 12 ай сайын жаңартылады; соңғы бекітілген нұсқа басымдыққа ие.'],
      ['An older internal note lists metformin 1000 mg twice daily as the usual maximum.','В старой внутренней записи указано 1000 мг метформина дважды в день как обычный максимум.','Ескі ішкі жазбада метформиннің әдеттегі ең жоғары дозасы күніне екі рет 1000 мг деп көрсетілген.'],
      ['Where documents disagree, the current formulary overrides internal notes unless a signed amendment states otherwise.','При расхождении источников действующий формуляр имеет приоритет над внутренними записями, если нет подписанного изменения.','Құжаттар сәйкес келмесе, қол қойылған өзгерту болмаса, қолданыстағы формуляр басымдыққа ие.'] ] },
  ];

  const QA = [
    { id: 'd-metformin', topic: 'dosage', q: ['What is the maximum daily dose of metformin?','Какова максимальная суточная доза метформина?','Метформиннің ең жоғары тәуліктік дозасы қандай?'],
      direct: ['The formulary sets the maximum at 2000 mg per day, given as 500 mg twice daily with meals.','Формуляр устанавливает максимум 2000 мг в сутки: по 500 мг дважды в день во время еды.','Формуляр бойынша ең жоғары доза тәулігіне 2000 мг: тамақ кезінде 500 мг-ден күніне екі рет.'],
      details: [['An older internal note says 1000 mg twice daily; the newest approved formulary is authoritative.','В старой записи указано 1000 мг дважды в день; приоритет у последней утверждённой версии формуляра.','Ескі жазбада 1000 мг күніне екі рет делінген; соңғы бекітілген формуляр басым.'],['Metformin is not used when eGFR is below 30; at 30–44 the dose is halved.','Метформин не применяется при рСКФ ниже 30; при 30–44 доза уменьшается вдвое.','рСКФ 30-дан төмен болғанда метформин қолданылмайды; 30–44 кезінде доза екі есе азайтылады.']],
      ev: [['form1',[0,2]],['help2',[1,0]],['form1',[1]]], strength: 'strong',
      conflict: { a: ['form1',0], b: ['help2',1], rule: ['help2',0], note: ['Sources disagree on the maximum dose','Источники расходятся в максимальной дозе','Дереккөздер ең жоғары дозада сәйкес емес'] },
      follow: ['d-renal','d-infusion','p-shelf'] },

    { id: 'd-vanco', topic: 'dosage', q: ['How is vancomycin dosed and monitored?','Как дозируется и контролируется ванкомицин?','Ванкомицин қалай дозаланады және бақыланады?'],
      direct: ['15–20 mg/kg IV every 8–12 hours, with the dose adjusted to the trough level.','15–20 мг/кг в/в каждые 8–12 часов с коррекцией по остаточной концентрации.','15–20 мг/кг венаға әр 8–12 сағат сайын, қалдық концентрацияға қарай реттеледі.'],
      details: [['Target trough is 10–15 mg/L, or 15–20 mg/L for deep-seated infection.','Целевой остаточный уровень 10–15 мг/л, или 15–20 мг/л при глубокой инфекции.','Мақсатты қалдық деңгей 10–15 мг/л немесе терең инфекцияда 15–20 мг/л.'],['Renal function is rechecked at least every 48 hours.','Функция почек проверяется не реже чем каждые 48 часов.','Бүйрек қызметі кем дегенде әр 48 сағат сайын тексеріледі.']],
      ev: [['form2',[0,1,2]]], strength: 'strong', follow: ['d-renal','d-admin'] },

    { id: 'd-amoxiclav', topic: 'dosage', q: ['What is the standard amoxicillin/clavulanate dose?','Какая стандартная доза амоксициллина/клавуланата?','Амоксициллин/клавуланаттың стандарт дозасы қандай?'],
      direct: ['875/125 mg: one tablet every 12 hours for 7 days.','875/125 мг: одна таблетка каждые 12 часов в течение 7 дней.','875/125 мг: 7 күн бойы әр 12 сағат сайын бір таблетка.'],
      details: [['A 625 mg tablet is given every 8 hours.','Таблетка 625 мг принимается каждые 8 часов.','625 мг таблеткасы әр 8 сағат сайын қабылданады.']],
      ev: [['form3',[0,1]]], strength: 'strong', follow: ['abx-first','d-tablet'] },

    { id: 'abx-first', topic: 'policy', q: ['What is first-line therapy for community-acquired pneumonia?','Что является терапией первого выбора при внебольничной пневмонии?','Қауымдастықтан алынған пневмонияда бірінші кезектегі ем қандай?'],
      direct: ['Amoxicillin/clavulanate is first-line for uncomplicated community-acquired pneumonia.','Амоксициллин/клавуланат — препарат первого выбора при неосложнённой внебольничной пневмонии.','Асқынбаған қауымдастық пневмониясында бірінші кезекте амоксициллин/клавуланат.'],
      details: [['Therapy is reviewed at 48–72 hours with de-escalation where possible.','Терапия пересматривается через 48–72 часа с деэскалацией по возможности.','Ем 48–72 сағаттан кейін қайта қаралып, деэскалацияланады.']],
      ev: [['abx1',[0,1]]], strength: 'strong', follow: ['p-carb','d-amoxiclav'] },

    { id: 'd-renal', topic: 'dosage', q: ['Does metformin need a dose change when kidney function is reduced?','Нужна ли коррекция метформина при сниженной функции почек?','Бүйрек қызметі төмендегенде метформин дозасын реттеу керек пе?'],
      direct: ['Yes. At eGFR 30–44 the dose is 500 mg once daily; below 30 metformin is not used.','Да. При рСКФ 30–44 доза составляет 500 мг один раз в день; ниже 30 метформин не применяется.','Иә. рСКФ 30–44 кезінде доза күніне бір рет 500 мг; 30-дан төмен болса қолданылмайды.'],
      details: [['Paracetamol needs no adjustment when eGFR is above 30.','Парацетамол не требует коррекции при рСКФ выше 30.','рСКФ 30-дан жоғары болғанда парацетамол реттеуді қажет етпейді.']],
      ev: [['form1',[2,1]],['form4',[1]]], strength: 'strong', follow: ['d-metformin','i-contrast'] },

    { id: 'd-tablet', topic: 'dosage', q: ['Which amoxicillin/clavulanate strengths are listed?','Какие дозировки амоксициллина/клавуланата приведены?','Амоксициллин/клавуланаттың қандай дозалары көрсетілген?'],
      direct: ['Two strengths are listed: 875/125 mg every 12 hours and 625 mg every 8 hours.','Указаны две дозировки: 875/125 мг каждые 12 часов и 625 мг каждые 8 часов.','Екі доза көрсетілген: 875/125 мг әр 12 сағат сайын және 625 мг әр 8 сағат сайын.'],
      details: [], ev: [['form3',[0,1]]], strength: 'strong', follow: ['d-amoxiclav'] },

    { id: 'd-admin', topic: 'dosage', q: ['How often is renal function checked during vancomycin therapy?','Как часто проверяют функцию почек при терапии ванкомицином?','Ванкомицин емі кезінде бүйрек қызметі қанша жиі тексеріледі?'],
      direct: ['At least every 48 hours during therapy.','Не реже чем каждые 48 часов во время терапии.','Ем кезінде кем дегенде әр 48 сағат сайын.'],
      details: [['The dose is then adjusted to the trough level.','Затем доза корректируется по остаточной концентрации.','Содан кейін доза қалдық концентрацияға қарай реттеледі.']],
      ev: [['form2',[2,0]]], strength: 'strong', follow: ['d-vanco'] },

    { id: 'd-infusion', topic: 'dosage', q: ['Is a paracetamol dose adjustment needed at reduced eGFR?','Нужна ли коррекция парацетамола при сниженном рСКФ?','рСКФ төмендегенде парацетамол дозасын реттеу керек пе?'],
      direct: ['No. Paracetamol requires no dose adjustment when eGFR is above 30.','Нет. Парацетамол не требует коррекции дозы при рСКФ выше 30.','Жоқ. рСКФ 30-дан жоғары болғанда парацетамол дозасын реттеу қажет емес.'],
      details: [], ev: [['form4',[1]]], strength: 'strong', follow: ['d-renal'] },

    { id: 'p-shelf', topic: 'policy', q: ['Which source wins when two documents disagree?','Какой источник имеет приоритет при расхождении документов?','Құжаттар сәйкес келмесе, қай дереккөз басымдыққа ие?'],
      direct: ['The current approved formulary overrides internal notes unless a signed amendment says otherwise.','Действующий утверждённый формуляр имеет приоритет над внутренними записями, если нет подписанного изменения.','Қол қойылған өзгерту болмаса, қолданыстағы бекітілген формуляр басымдыққа ие.'],
      details: [['The formulary is updated every 12 months.','Формуляр обновляется каждые 12 месяцев.','Формуляр әр 12 ай сайын жаңартылады.']],
      ev: [['help2',[2,0]]], strength: 'strong', follow: ['p-expiry','d-metformin'] },

    { id: 'p-expiry', topic: 'policy', q: ['How often is the formulary updated?','Как часто обновляется формуляр?','Формуляр қанша жиі жаңартылады?'],
      direct: ['Every 12 months; the newest approved version applies.','Каждые 12 месяцев; действует последняя утверждённая версия.','Әр 12 ай сайын; соңғы бекітілген нұсқа қолданылады.'],
      details: [], ev: [['help2',[0]]], strength: 'strong', follow: ['p-shelf'] },

    { id: 'p-deviation', topic: 'storage', q: ['When does a freezer temperature excursion need a quality review?','Когда повышение температуры морозильника требует проверки качества?','Тоңазытқыш температурасының ауытқуы қашан сапа тексеруін талап етеді?'],
      direct: ['When the temperature rises above −15 °C.','Когда температура поднимается выше −15 °C.','Температура −15 °C-тан жоғары көтерілгенде.'],
      details: [['Temperature is logged twice daily.','Температура записывается дважды в день.','Температура күніне екі рет жазылады.']],
      ev: [['cold1',[1,0]]], strength: 'strong', follow: ['s-vaccine','p-shelf'] },

    { id: 'p-carb', topic: 'policy', q: ['Who approves carbapenem use?','Кто разрешает применение карбапенемов?','Карбапенемдерді қолдануға кім рұқсат береді?'],
      direct: ['The antimicrobial stewardship team must approve it before the drug is released.','Группа по антимикробному управлению должна одобрить его до выдачи препарата.','Антимикробтік басқару тобы препарат берілмей тұрып рұқсат беруі керек.'],
      details: [], ev: [['abx2',[0]]], strength: 'strong', follow: ['abx-first','p-prophylaxis'] },

    { id: 'p-report', topic: 'policy', q: ['When can therapy switch from IV to oral?','Когда терапию можно перевести с в/в на пероральную?','Емді вена ішінен ауызша қабылдауға қашан ауыстыруға болады?'],
      direct: ['Once the patient has been afebrile for 24 hours and tolerates oral intake.','После 24 часов без лихорадки и при переносимости приёма внутрь.','24 сағат қызбасыз өткенде және ауызша қабылдауды көтергенде.'],
      details: [], ev: [['abx2',[1]]], strength: 'strong', follow: ['p-carb'] },

    { id: 'p-recall', topic: 'policy', q: ['Are prophylactic antibiotics covered by the stewardship policy?','Покрывает ли политика профилактические антибиотики?','Саясат профилактикалық антибиотиктерді қамти ма?'],
      direct: ['No. They are not part of routine care and the policy does not cover them.','Нет. Они не входят в рутинную помощь и не регулируются политикой.','Жоқ. Олар күнделікті емге кірмейді және саясатқа енбейді.'],
      details: [['Outpatient prescriptions and dental prophylaxis are also outside the policy.','Амбулаторные назначения и стоматологическая профилактика также не входят в политику.','Амбулаториялық тағайындаулар мен стоматологиялық профилактика да саясатқа енбейді.']],
      ev: [['abx3',[0,1]]], strength: 'strong', follow: ['p-carb'] },

    { id: 'p-prophylaxis', topic: 'policy', q: ['Does the policy cover dental prophylaxis?','Политика распространяется на стоматологическую профилактику?','Саясат стоматологиялық профилактиканы қамти ма?'],
      direct: ['No, dental prophylaxis is explicitly outside the policy.','Нет, стоматологическая профилактика прямо исключена из политики.','Жоқ, стоматологиялық профилактика саясаттан тікелей шығарылған.'],
      details: [], ev: [['abx3',[1]]], strength: 'strong', follow: ['p-recall'] },

    { id: 'h-serum', topic: 'handling', q: ['How should serum samples be prepared for chemistry?','Как готовить сыворотку для биохимического анализа?','Биохимиялық талдау үшін сарысуды қалай дайындау керек?'],
      direct: ['Clot for 30 minutes, then centrifuge at 1600 g for 10 minutes.','Дать свернуться 30 минут, затем центрифугировать при 1600 g 10 минут.','30 минут ұйытып, содан кейін 1600 g-де 10 минут центрифугалау.'],
      details: [['Separate the serum from the gel barrier within 2 hours of collection.','Отделить сыворотку от гелевого барьера в течение 2 часов после забора.','Үлгі алынғаннан кейін 2 сағат ішінде сарысуды бөлу керек.']],
      ev: [['sop1',[0,1]]], strength: 'strong', follow: ['h-hemolysis','h-citrate'] },

    { id: 'h-hemolysis', topic: 'handling', q: ['What happens to a haemolysed sample?','Что происходит с гемолизированной пробой?','Гемолизделген үлгімен не болады?'],
      direct: ['It is rejected for potassium and LDH, and a new sample must be requested.','Она отклоняется для калия и ЛДГ; требуется новая проба.','Калий мен ЛДГ үшін үлгі қабылданбайды; жаңа үлгі сұрау керек.'],
      details: [['The rejection reason is recorded in the LIS before repeating the analysis.','Причина отказа записывается в ЛИМС до повторного анализа.','Қайта талдау алдында себебі ЛИМС-ке тіркеледі.']],
      ev: [['sop2',[0,1]]], strength: 'strong', follow: ['h-serum'] },

    { id: 'h-citrate', topic: 'handling', q: ['How are coagulation samples collected?','Как собирают пробы для коагуляции?','Коагуляция үлгілері қалай алынады?'],
      direct: ['In citrated tubes filled to the marked line.','В цитратные пробирки, заполненные до отметки.','Белгіге дейін толтырылған цитрат түтіктеріне.'],
      details: [['Haematology tubes are K2EDTA and are analysed within 6 hours.','Гематологические пробирки — K2EDTA, анализ в течение 6 часов.','Гематология түтіктері K2EDTA, 6 сағат ішінде талданады.']],
      ev: [['sop3',[1,0]]], strength: 'strong', follow: ['h-serum'] },

    { id: 'h-urine', topic: 'handling', q: ['How are urine cultures stored when analysis is delayed?','Как хранят мочу для посева при задержке анализа?','Талдау кешіккенде зәр посеві қалай сақталады?'],
      direct: ['At 2–8 °C if analysis is delayed beyond 4 hours.','При 2–8 °C, если анализ откладывается более чем на 4 часа.','4 сағаттан артық кешіктірілсе, 2–8 °C-та.'],
      details: [], ev: [['sop4',[0]]], strength: 'strong', follow: ['s-reagents'] },

    { id: 'i-warfarin', topic: 'interactions', q: ['Does clarithromycin affect warfarin?','Влияет ли кларитромицин на варфарин?','Кларитромицин варфаринге әсер ете ме?'],
      direct: ['Yes. INR may increase; check it within 3 days and consider a dose reduction.','Да. МНО может повыситься; проверить в течение 3 дней и рассмотреть снижение дозы.','Иә. МНО жоғарылауы мүмкін; 3 күн ішінде тексеріп, дозаны азайтуды қарастыру.'],
      details: [['Paracetamol above 2 g/day can also increase INR.','Парацетамол более 2 г/сутки также может повысить МНО.','Парацетамол тәулігіне 2 г-нан артық болса да МНО жоғарылауы мүмкін.']],
      ev: [['inter1',[0,1]]], strength: 'strong', follow: ['i-linezolid','i-digoxin'] },

    { id: 'i-clarithro', topic: 'interactions', q: ['Can linezolid be combined with sertraline?','Можно ли сочетать линезолид с сертралином?','Линезолидті сертралинмен бірлестіруге бола ма?'],
      direct: ['Avoid the combination where possible because of serotonin syndrome risk.','По возможности избегать сочетания из-за риска серотонинового синдрома.','Серотонин синдромы қаупі себепті мүмкін болса бірлестіруден аулақ болу керек.'],
      details: [], ev: [['inter3',[0]]], strength: 'strong', follow: ['i-warfarin'] },

    { id: 'i-renal', topic: 'interactions', q: ['What should happen to metformin before a contrast scan?','Что делать с метформином перед контрастным исследованием?','Контрастты зерттеу алдында метформинмен не істеу керек?'],
      direct: ['Withhold metformin on the day of the scan and restart after 48 hours if renal function is stable.','Отменить метформин в день исследования и возобновить через 48 часов при стабильной функции почек.','Зерттеу күні метформин тоқтатылып, бүйрек қызметі тұрақты болса 48 сағаттан кейін қайта басталады.'],
      details: [['The rule is for contrast imaging only, not all imaging.','Правило относится только к контрастной визуализации.','Ереже тек контрастты зерттеулерге қатысты.']],
      ev: [['inter2',[0,1]],['form1',[1]]], strength: 'strong', follow: ['d-renal','x-contrast'] },

    { id: 'i-contrast', topic: 'interactions', q: ['What is the metformin rule for contrast imaging?','Каково правило метформина при контрастной визуализации?','Контрастты зерттеуде метформин ережесі қандай?'],
      direct: ['Withhold on the day of the scan; restart after 48 hours if renal function is stable.','Отменить в день исследования; возобновить через 48 часов при стабильной функции почек.','Зерттеу күні тоқтату; бүйрек қызметі тұрақты болса 48 сағаттан кейін қайта бастау.'],
      details: [], ev: [['inter2',[0,1]]], strength: 'strong', follow: ['i-renal'] },

    { id: 'i-digoxin', topic: 'interactions', q: ['How does amiodarone affect digoxin?','Как амиодарон влияет на дигоксин?','Амиодарон дигоксинге қалай әсер етеді?'],
      direct: ['Reduce the digoxin dose by 50% and monitor levels.','Снизить дозу дигоксина на 50% и контролировать уровень.','Дигоксин дозасын 50%-ға азайтып, деңгейін бақылау.'],
      details: [], ev: [['inter3',[1]]], strength: 'strong', follow: ['i-warfarin'] },

    { id: 'i-linezolid', topic: 'interactions', q: ['Which combination carries a serotonin syndrome risk?','Какое сочетание несёт риск серотонинового синдрома?','Қай бірлестік серотонин синдромы қаупін тудырады?'],
      direct: ['Linezolid with sertraline.','Линезолид с сертралином.','Линезолид сертралинмен.'],
      details: [], ev: [['inter3',[0]]], strength: 'strong', follow: ['i-clarithro'] },

    { id: 's-reagents', topic: 'storage', q: ['At what temperature are reagents stored?','При какой температуре хранятся реагенты?','Реагенттер қандай температурада сақталады?'],
      direct: ['At 2–8 °C. Do not freeze.','При 2–8 °C. Не замораживать.','2–8 °C-та. Мұздатпаңыз.'],
      details: [['The reagent refrigerator must not hold food or specimens.','В холодильнике для реагентов нельзя хранить продукты или пробы.','Реагент тоңазытқышында тамақ немесе үлгілер болмауы керек.']],
      ev: [['cold2',[0,1]]], strength: 'strong', follow: ['s-vaccine','s-transport'] },

    { id: 's-vaccine', topic: 'storage', q: ['Where are mRNA vaccines stored?','Где хранятся мРНК-вакцины?','мРНК вакциналары қайда сақталады?'],
      direct: ['In a dedicated freezer at −90 °C to −15 °C.','В отдельном морозильнике при −90…−15 °C.','Арнайы тоңазытқышта −90…−15 °C-та.'],
      details: [['Temperature is logged twice daily.','Температура записывается дважды в день.','Температура күніне екі рет жазылады.']],
      ev: [['cold1',[0,1]]], strength: 'strong', follow: ['p-deviation','s-transport'] },

    { id: 's-transport', topic: 'storage', q: ['How long can thawed plasma be kept?','Сколько можно хранить размороженную плазму?','Ерітілген плазма қанша уақыт сақталуы мүмкін?'],
      direct: ['Up to 24 hours at 2–8 °C.','До 24 часов при 2–8 °C.','2–8 °C-та 24 сағатқа дейін.'],
      details: [['Frozen plasma is stored at −18 °C or below for up to 12 months.','Замороженная плазма хранится при −18 °C или ниже до 12 месяцев.','Мұздатылған плазма −18 °C немесе төменде 12 айға дейін сақталады.']],
      ev: [['cold3',[1,0]]], strength: 'strong', follow: ['s-reagents'] },

    { id: 's-cold-2-8', topic: 'storage', q: ['What is the cold-chain temperature for reagents and plasma?','Какова температура холодной цепи для реагентов и плазмы?','Реагенттер мен плазма үшін суық тізбек температурасы қандай?'],
      direct: ['Reagents and thawed plasma are kept at 2–8 °C; frozen plasma at −18 °C or below.','Реагенты и размороженная плазма хранятся при 2–8 °C; замороженная плазма — при −18 °C или ниже.','Реагенттер мен ерітілген плазма 2–8 °C-та; мұздатылған плазма −18 °C немесе төменде.'],
      details: [], ev: [['cold2',[0]],['cold3',[0,1]]], strength: 'strong', follow: ['s-transport','s-vaccine'] },

    { id: 's-receive', topic: 'storage', q: ['Can reagents be frozen to extend their life?','Можно ли замораживать реагенты для продления срока?','Реагенттерді ұзақ сақтау үшін мұздатуға бола ма?'],
      direct: ['No. Refrigerated reagents are kept at 2–8 °C and must not be frozen.','Нет. Охлаждаемые реагенты хранятся при 2–8 °C и не должны замораживаться.','Жоқ. Реагенттер 2–8 °C-та сақталады және мұздатылмауы керек.'],
      details: [], ev: [['cold2',[0]]], strength: 'strong', follow: ['s-reagents'] },

    { id: 'r-critical', topic: 'reporting', q: ['How fast must a critical potassium result be reported?','Как быстро нужно сообщить критический результат калия?','Критикалық калий нәтижесін қаншалықты тез хабарлау керек?'],
      direct: ['Within 15 minutes, by phone to the requesting clinician.','В течение 15 минут по телефону направившему врачу.','15 минут ішінде жіберген дәрігерге телефон арқылы.'],
      details: [['Read the result back and record the time and name of the person notified.','Повторите результат и запишите время и имя уведомлённого.','Нәтижені қайта оқып, уақыт пен есімді жазыңыз.']],
      ev: [['report1',[0,1]]], strength: 'strong', follow: ['r-glucose','r-log'] },

    { id: 'r-glucose', topic: 'reporting', q: ['What is the escalation if the clinician cannot be reached?','Что делать, если врач недоступен?','Дәрігерге жету мүмкін болмаса не істеу керек?'],
      direct: ['Escalate to the ward nurse in charge.','Обратиться к старшей медсестре отделения.','Бөлімшенің аға мейірбикесіне хабарласу.'],
      details: [], ev: [['report2',[1]]], strength: 'strong', follow: ['r-critical'] },

    { id: 'r-log', topic: 'reporting', q: ['How are critical values recorded?','Как регистрируются критические значения?','Критикалық мәндер қалай тіркеледі?'],
      direct: ['In the LIS, with the notification status.','В ЛИМС, со статусом уведомления.','ЛИМС-ке, хабарлау мәртебесімен.'],
      details: [['Unacknowledged results are escalated to the laboratory manager after 30 minutes.','Неподтверждённые результаты через 30 минут передаются заведующему лабораторией.','Расталмаған нәтижелер 30 минуттан кейін зертхана меңгерушісіне жіберіледі.']],
      ev: [['report3',[0,1]]], strength: 'strong', follow: ['r-critical'] },

    { id: 'g-helpdesk', topic: 'general', q: ['When is the laboratory helpdesk open?','Когда работает хелпдеск лаборатории?','Зертхана хелпдескі қашан жұмыс істейді?'],
      direct: ['Monday–Friday 08:00–17:00; Saturday 09:00–13:00.','Понедельник–пятница 08:00–17:00; суббота 09:00–13:00.','Дүйсенбі–жұма 08:00–17:00; сенбі 09:00–13:00.'],
      details: [['Contact: lab-helpdesk@asklepia.example.','Контакт: lab-helpdesk@asklepia.example.','Байланыс: lab-helpdesk@asklepia.example.']],
      ev: [['help1',[0,1]]], strength: 'strong', follow: ['p-expiry'] },

    // Intentionally unanswerable
    { id: 'x-pediatric', abstain: true, topic: 'paediatric', q: ['What is the metformin dose for children?','Какая доза метформина для детей?','Балаларға метформин дозасы қандай?'],
      why: ['The formulary states that all doses assume adult patients; paediatric dosing is not included.','В формуляре указано, что все дозы рассчитаны на взрослых; педиатрические дозы не приведены.','Формулярда барлық дозалар ересектерге арналған; балалар дозалары кірмейді.'],
      missing: ['No document gives a paediatric dose or weight-based table.','Ни в одном документе нет педиатрической дозы или таблицы по массе тела.','Ешбір құжатта балалар дозасы немесе салмаққа негізделген кесте жоқ.'], related: ['form'], ev: [['form4',[2]]] },

    { id: 'x-contrast', abstain: true, topic: 'imaging', q: ['Which iodinated contrast agent is used for CT?','Какой йодный контрастный препарат используют для КТ?','КТ үшін қандай йодты контраст препараты қолданылады?'],
      why: ['The interaction matrix mentions iodinated contrast but does not name an agent or a protocol.','В матрице взаимодействий упоминается йодный контраст, но препарат и протокол не названы.','Өзара әрекеттесу кестесінде йодты контраст аталған, бірақ препарат мен хаттама көрсетілмеген.'],
      missing: ['No imaging protocol or contrast agent list is in the corpus.','В наборе документов нет протокола визуализации или списка контрастных препаратов.','Құжаттар жиынтығында зерттеу хаттамасы немесе контраст препараттары тізімі жоқ.'], related: ['inter'], ev: [['inter2',[0]]] },

    { id: 'x-home', abstain: true, topic: 'general', q: ['Can patients perform these tests at home?','Могут ли пациенты делать эти анализы дома?','Науқастар бұл талдауларды үйде жасай ала ма?'],
      why: ['The SOP describes collection and processing inside the laboratory only.','СОП описывает только забор и обработку внутри лаборатории.','СОП тек зертхана ішіндегі алу мен өңдеуді сипаттайды.'],
      missing: ['No home-testing or point-of-care guidance is included.','Руководств по домашнему тестированию или POCT нет.','Үйде сынау немесе POCT нұсқаулықтары жоқ.'], related: ['sop'], ev: [['sop1',[0]]] },

    { id: 'x-funding', abstain: true, topic: 'finance', q: ['Who pays for the tests?','Кто оплачивает анализы?','Талдауларды кім төлейді?'],
      why: ['The corpus covers clinical and laboratory rules, not billing or reimbursement.','Набор документов содержит клинические и лабораторные правила, но не тарифы и возмещение.','Құжаттар жиынтығы клиникалық және зертханалық ережелерді қамтиды, тарифтерді емес.'],
      missing: ['No pricing, insurance or reimbursement document is available.','Нет документа по ценам, страхованию или возмещению.','Баға, сақтандыру немесе өтеу туралы құжат жоқ.'], related: ['help'], ev: [['help1',[1]]] },

    { id: 'x-vet', abstain: true, topic: 'safety', q: ['Do you analyse animal samples?','Анализируете ли вы пробы животных?','Жануарлар үлгілерін талдайсыз ба?'],
      why: ['All documents describe human diagnostic workflows; veterinary specimens are not mentioned.','Все документы описывают работу с человеческими пробами; ветеринарные пробы не упоминаются.','Барлық құжаттар адам үлгілерімен жұмысты сипаттайды; ветеринарлық үлгілер аталмайды.'],
      missing: ['No veterinary scope or safety data sheet is in the corpus.','Ветеринарная область или паспорт безопасности отсутствуют.','Ветеринарлық сала немесе қауіпсіздік парағы жиынтықта жоқ.'], related: ['sop'], ev: [['sop3',[0]]] },
  ];

  const TOPICS = [
    { id: 'dosage',    n: ['Dosage','Дозировка','Дозалау'] },
    { id: 'handling',  n: ['Sample handling','Обработка проб','Үлгілерді өңдеу'] },
    { id: 'interactions', n: ['Interactions','Взаимодействия','Өзара әрекеттесу'] },
    { id: 'storage',   n: ['Storage','Хранение','Сақтау'] },
    { id: 'policy',    n: ['Clinical policy','Клиническая политика','Клиникалық саясат'] },
    { id: 'reporting', n: ['Critical results','Критические результаты','Критикалық нәтижелер'] },
    { id: 'general',   n: ['Helpdesk','Хелпдеск','Хелпдеск'] },
    { id: 'paediatric',n: ['Paediatric dosing','Педиатрические дозы','Балалар дозалары'], expected: true },
    { id: 'imaging',   n: ['Imaging protocols','Протоколы визуализации','Зерттеу хаттамалары'], expected: true },
    { id: 'finance',   n: ['Billing','Тарифы','Тарифтер'], expected: true },
    { id: 'safety',    n: ['Safety data','Паспорт безопасности','Қауіпсіздік мәліметтері'], expected: true },
  ];
  return { DOCS, CHUNKS, QA, TOPICS };
})();
