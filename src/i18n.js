(()=>{
const RU={
  apply:'Применить ко всем',load:'Загрузить JSON',unload:'Выгрузить',save:'Сохранить',
  settings:'Настройки',minimize:'Свернуть',maximize:'Развернуть',close:'Закрыть',
  search:'Поиск команды…',emptyTitle:'Нет пака команд',emptyText:'Загрузите JSON файл пака<br>для начала работы',
  statCmds:'Команд: {n}',statVoiced:'С озвучкой: {n}',statFiles:'Файлов: {n}',
  root:'Корень',sequence:'Последовательность',fShort:'ф.',voice:'Озвучка',noSound:'Нет Sound.PlayWav',
  note:'Заметка',notePh:'Заметка к этой команде…',
  pickVoice:'Выбрать озвучку',
  loaded:'Загружено {c}',parseErr:'Ошибка парсинга JSON',unsaved:'Есть несохранённые изменения. Выгрузить пак?',unsavedT:'Несохранённые изменения',unsavedClose:'Есть несохранённые изменения. Закрыть программу?',
  aaConfirmT:'Применить ко всем?',
  pickCmdT:'Команда не выбрана',pickCmd:'Выберите команду в списке слева,<br>чтобы настроить озвучку',
  unloaded:'Пак выгружен',saved:'JSON сохранён',saveErr:'Ошибка сохранения',
  dlgOpen:'Открыть JSON пак',dlgSave:'Сохранить JSON',
  random:'Случайный',fixed:'Фиксированный',
  cancel:'Отмена',applyBtn:'Применить',
  s_gen:'Общие',s_gfx:'Графика',s_edit:'Редактор',s_about:'О программе',
  s_reset:'Сбросить всё',s_ok:'Готово',
  s_lang:'Язык',s_lang_d:'Язык интерфейса',lang_ru:'Русский',lang_en:'English',
  s_theme:'Тема',s_theme_d:'Тёмная, светлая или как в системе',th_dark:'Тёмная',th_light:'Светлая',th_auto:'Системная',
  s_zoom:'Масштаб интерфейса',s_zoom_d:'Применяется, когда отпустишь ползунок',
  s_top:'Поверх всех окон',s_top_d:'Редактор не прячется за другими окнами',
  s_autoUpdate:'Проверять обновления при запуске',s_autoUpdate_d:'Если вышла новая версия, снизу справа появится плашка',tstT:'Доступна новая версия',tstText:'Вышла версия {v}, у вас {c}. Обновить?',tstUp:'Обновить',tstHide:'Скрыть',
  s_bg:'Анимированный фон',s_bg_d:'Живой - полное качество, лёгкий - быстрее на слабых ПК',
  bgLive:'Живой',bgLite:'Лёгкий',bgOff:'Выкл',
  s_bri:'Яркость фона',s_bri_d:'Затемни или подсвети анимацию',
  s_lens:'Преломление стекла',s_lens_d:'Настоящая рефракция на краях панелей. Выключи, если тормозит',
  s_k:'Сила преломления',s_k_d:'Насколько сильно искажается фон под стеклом',
  s_calm:'Меньше анимаций',s_calm_d:'Отключает пружины и плавные появления',
  s_rand:'Озвучка по умолчанию',s_rand_d:'С каким режимом открывается выбор озвучки для нового шага',
  s_warn:'Предупреждать при выгрузке',s_warn_d:'Спрашивать, если в паке есть несохранённые изменения',
  s_first:'Открывать первую команду',s_first_d:'После загрузки пака сразу выбирается первая команда',
  s_confirmAll:'Подтверждать «Применить ко всем»',s_confirmAll_d:'Спрашивать перед заменой озвучки во всём паке',
  s_warnClose:'Предупреждать при закрытии',s_warnClose_d:'Спрашивать перед выходом, если есть несохранённые изменения',
  s_data:'Данные настроек',s_open:'Открыть папку',s_support:'Данные для отчёта об ошибке',s_copy:'Скопировать',s_copied:'Скопировано',s_copyErr:'Не удалось',s_news:'Новости и обновления',
  s_upd:'Обновления',s_upBtn:'Проверить обновления',s_upVer:'Установлена версия {v}',s_upChecking:'Проверка…',s_upLatest:'Установлена последняя версия {v}',s_upNew:'Доступна новая версия {v}',s_upErr:'Не удалось проверить, попробуйте позже',s_upDl:'Загрузка обновления {p}%',s_upInst:'Установка, программа перезапустится…',s_upInstErr:'Не удалось установить обновление',
  s_log:'Что нового',
  vdRandD:'При каждом срабатывании выбирается случайный файл из отмеченных.',vdFixD:'Всегда используется первый отмеченный файл.',filterPh:'Фильтр по имени или категории…',
  selN:'Выбрано: {f}',selNone:'Не выбрано',savedN:'Сохранено: {f}',voiceReset:'Озвучка сброшена',catAll:'Выбрать всё',catNone:'Снять',
  aaDesc:'Выберите файлы озвучки. Случайный из отмеченных будет подставлен в каждый Sound.PlayWav шаг всех команд.',aaConfirm:'Выбранные файлы ({l}) будут подставлены во все шаги Sound.PlayWav всех команд. Текущий выбор будет заменён.',aaDone:'Шагов обновлено: {n} - {l}',logLoading:'Загрузка…',logErr:'Не удалось загрузить список изменений',logEmpty:'В описании релиза нет списка изменений',logNone:'Релизов пока нет',
  upT:'Доступно обновление',upText:'Вышла новая версия {v}, у вас установлена {c}. Программа сама скачает её, установит и перезапустится. Обновить сейчас?',upOk:'Обновить',upDirty:'Несохранённые изменения будут потеряны.',upTextWeb:'Вышла новая версия {v}, у вас {c}. Автоустановка работает только в собранном exe. Открыть страницу загрузки на GitHub?',upOkWeb:'Открыть',
  resetT:'Сбросить все настройки?',resetText:'Язык, тема, графика и параметры редактора вернутся к значениям по умолчанию. Заметки к командам не удаляются.',resetOk:'Сбросить',
  s_desc:'Программа для настройки озвучки команд. Выбираешь команду и назначаешь ей голосовые фразы, которые она будет проигрывать.',
  s_tg:'Telegram канал',s_gh:'GitHub',s_src:'Проект на GitHub',s_fb:'Сообщить об ошибке',s_fbb:'Написать',s_by:'Создатель',s_author:'m0onmag',s_egg:'Сделано с любовью, сэр',
  s_backup:'Настройки',s_exp:'Сохранить',s_imp:'Загрузить',s_exOk:'Сохранено',s_imOk:'Загружено',s_imBad:'Неверный файл',
  dlgExp:'Сохранить настройки',dlgImp:'Загрузить настройки',
  impT:'Загрузить настройки из файла?',impText:'Текущие настройки будут заменены. Заметки к командам добавятся к тем, что уже есть (если у команды уже есть заметка, она будет заменена).',impOk:'Загрузить',
  perfT:'Слабый ПК',
  perfText:'Похоже, у вас слабый ПК. Чтобы программа работала плавно, мы выставили оптимальные настройки: {list}. Изменить их можно в Настройки → Графика.',
  perf_bg_off:'фон выключен',perf_bg_lite:'лёгкий фон',perf_lens:'стекло без преломления',perf_calm:'меньше анимаций',
  perfOk:'Понятно',
  perfLive:'У вас слабый ПК, поэтому живой фон может лагать. Лучше оставить «Лёгкий» или выключить фон. Включить живой фон всё равно?',
  perfLiveOk:'Всё равно включить',
  perfLens:'У вас слабый ПК, поэтому преломление стекла может заметно тормозить программу. Это самая тяжёлая настройка графики. Включить всё равно?'
};
const EN={
  apply:'Apply to all',load:'Load JSON',unload:'Unload',save:'Save',
  settings:'Settings',minimize:'Minimize',maximize:'Maximize',close:'Close',
  search:'Search commands…',emptyTitle:'No command pack',emptyText:'Load a pack JSON file<br>to get started',
  statCmds:'Commands: {n}',statVoiced:'Voiced: {n}',statFiles:'Files: {n}',
  root:'Root',sequence:'Sequence',fShort:'f.',voice:'Voice',noSound:'No Sound.PlayWav',
  note:'Note',notePh:'A note for this command…',
  pickVoice:'Choose voice',
  loaded:'Loaded {c}',parseErr:'Failed to parse JSON',unsaved:'You have unsaved changes. Unload the pack?',unsavedT:'Unsaved changes',unsavedClose:'You have unsaved changes. Close the program?',
  aaConfirmT:'Apply to all?',
  pickCmdT:'No command selected',pickCmd:'Pick a command from the list on the left<br>to edit its voice',
  unloaded:'Pack unloaded',saved:'JSON saved',saveErr:'Save failed',
  dlgOpen:'Open JSON pack',dlgSave:'Save JSON',
  random:'Random',fixed:'Fixed',
  cancel:'Cancel',applyBtn:'Apply',
  s_gen:'General',s_gfx:'Graphics',s_edit:'Editor',s_about:'About',
  s_reset:'Reset all',s_ok:'Done',
  s_lang:'Language',s_lang_d:'Interface language',lang_ru:'Русский',lang_en:'English',
  s_theme:'Theme',s_theme_d:'Dark, light or follow the system',th_dark:'Dark',th_light:'Light',th_auto:'System',
  s_zoom:'Interface scale',s_zoom_d:'Applied when you release the slider',
  s_top:'Always on top',s_top_d:'The editor stays above other windows',
  s_autoUpdate:'Check for updates on launch',s_autoUpdate_d:'A card appears in the bottom right when a new version is out',tstT:'New version available',tstText:'Version {v} is out, you have {c}. Update?',tstUp:'Update',tstHide:'Hide',
  s_bg:'Animated background',s_bg_d:'Live - full quality, Lite - faster on weak PCs',
  bgLive:'Live',bgLite:'Lite',bgOff:'Off',
  s_bri:'Background brightness',s_bri_d:'Dim or brighten the animation',
  s_lens:'Glass refraction',s_lens_d:'Real refraction on panel edges. Turn off if it lags',
  s_k:'Refraction strength',s_k_d:'How strongly the background bends under the glass',
  s_calm:'Reduce motion',s_calm_d:'Disables springs and fade-in animations',
  s_rand:'Default voice mode',s_rand_d:'Mode used when choosing voices for a new step',
  s_warn:'Warn on unload',s_warn_d:'Ask when the pack has unsaved changes',
  s_first:'Open the first command',s_first_d:'Select the first command right after loading a pack',
  s_confirmAll:'Confirm “Apply to all”',s_confirmAll_d:'Ask before replacing the voice across the whole pack',
  s_warnClose:'Warn on close',s_warnClose_d:'Ask before quitting when there are unsaved changes',
  s_data:'Settings data',s_open:'Open folder',s_support:'Info for bug reports',s_copy:'Copy',s_copied:'Copied',s_copyErr:'Failed',s_news:'News and updates',
  s_upd:'Updates',s_upBtn:'Check for updates',s_upVer:'Installed version {v}',s_upChecking:'Checking…',s_upLatest:'You have the latest version {v}',s_upNew:'New version {v} is available',s_upErr:'Check failed, try again later',s_upDl:'Downloading update {p}%',s_upInst:'Installing, the app will restart…',s_upInstErr:'Could not install the update',
  s_log:'What\'s new',
  vdRandD:'A random file from the checked ones is picked each time it runs.',vdFixD:'The first checked file is always used.',filterPh:'Filter by name or category…',
  selN:'Selected: {f}',selNone:'Nothing selected',savedN:'Saved: {f}',voiceReset:'Voice cleared',catAll:'Select all',catNone:'Clear',
  aaDesc:'Pick voice files. A random one of the checked files will be set on every Sound.PlayWav step of all commands.',aaConfirm:'The selected files ({l}) will be set on all Sound.PlayWav steps of all commands. The current selection will be replaced.',aaDone:'Steps updated: {n} - {l}',logLoading:'Loading…',logErr:'Could not load the changelog',logEmpty:'The release has no changelog',logNone:'No releases yet',
  upT:'Update available',upText:'A new version {v} is available, you have {c}. The app will download it, install it and restart. Update now?',upOk:'Update',upDirty:'Unsaved changes will be lost.',upTextWeb:'A new version {v} is available, you have {c}. Auto-install only works in the built exe. Open the download page on GitHub?',upOkWeb:'Open',
  resetT:'Reset all settings?',resetText:'Language, theme, graphics and editor options will return to their defaults. Command notes are not deleted.',resetOk:'Reset',
  s_desc:'An app for setting up voice lines for commands. Pick a command and choose the voice phrases it will play.',
  s_tg:'Telegram channel',s_gh:'GitHub',s_src:'Project on GitHub',s_fb:'Report a bug',s_fbb:'Write',s_by:'Created by',s_author:'m0onmag',s_egg:'Made with love, sir',
  s_backup:'Settings',s_exp:'Save',s_imp:'Load',s_exOk:'Saved',s_imOk:'Loaded',s_imBad:'Invalid file',
  dlgExp:'Save settings',dlgImp:'Load settings',
  impT:'Load settings from file?',impText:'Your current settings will be replaced. Command notes are added to the existing ones (a note for a command that already has one is overwritten).',impOk:'Load',
  perfT:'Weak PC',
  perfText:'Your PC looks fairly weak. To keep the app running smoothly we applied optimal settings: {list}. You can change them in Settings → Graphics.',
  perf_bg_off:'background off',perf_bg_lite:'lite background',perf_lens:'glass without refraction',perf_calm:'reduced motion',
  perfOk:'Got it',
  perfLive:'Your PC is weak, so the live background may lag. It is better to keep Lite or turn the background off. Enable the live background anyway?',
  perfLiveOk:'Enable anyway',
  perfLens:'Your PC is weak, so glass refraction may noticeably slow the app down. It is the heaviest graphics setting. Enable it anyway?'
};
const PL={
  ru:{steps:['шаг','шага','шагов'],files:['файл','файла','файлов'],cmds:['команда','команды','команд']},
  en:{steps:['step','steps'],files:['file','files'],cmds:['command','commands']}
};
const DICT={ru:RU,en:EN};
let lang='ru';
try{lang=(window.api&&api.loadSettings&&api.loadSettings().lang)||'ru'}catch{}
if(!DICT[lang])lang='ru';

window.t=(k,p)=>{
  const s=DICT[lang][k]??RU[k]??k;
  return p?s.replace(/\{(\w+)\}/g,(_,n)=>p[n]??''):s;
};
window.tp=(k,n)=>{
  const f=PL[lang][k]||PL.ru[k];
  const i=lang==='ru'?(n%10===1&&n%100!==11?0:(n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?1:2)):(n===1?0:1);
  return n+' '+f[i];
};

function paintStatic(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-html]').forEach(e=>e.innerHTML=t(e.dataset.i18nHtml));
  document.querySelectorAll('[data-i18n-title]').forEach(e=>e.title=t(e.dataset.i18nTitle));
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
}
window.setLang=l=>{
  if(!DICT[l]||l===lang)return;
  lang=l;paintStatic();window.onLang&&window.onLang();
};
if(document.readyState==='loading')addEventListener('DOMContentLoaded',paintStatic);else paintStatic();
})();
