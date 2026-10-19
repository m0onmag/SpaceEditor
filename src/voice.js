(() => {
  const F = {
    start:    'SpaceEditor запущен, сэр',
    loaded:   'Пак команд загружен, сэр',
    readFail: 'Не удалось прочитать файл, сэр',
    badJson:  'Файл повреждён, сэр',
    badFormat:'Неверный формат пака, сэр',
    emptyPack:'В паке нет команд, сэр',
    allVoiced:'Все команды озвучены, сэр',
    saved:    'Пак сохранён, сэр',
    saveFail: 'Не удалось сохранить файл, сэр',
    applyAll: 'Озвучка применена ко всем командам, сэр',
    unsaved:  'Есть несохранённые изменения, сэр. Продолжить',
    bye:      'Завершаю работу SpaceEditor, сэр',
    reset:    'Настройки сброшены, сэр',
    newVer:   'Доступна новая версия, сэр',
    latest:   'У вас последняя версия, сэр',
    updFail:  'Не удалось проверить обновления, сэр',
    installed:'Обновление установлено, перезапускаю, сэр',
    instFail: 'Не удалось установить обновление, сэр',
    badSettings:'Неверный файл настроек, сэр',
    egg:      'Сделано с любовью, сэр',
    lite:     'Включён облегчённый режим, сэр',
    weakPc:   'У вас слабый ПК, эта настройка может вызвать лаги, сэр',
    eqFail:   'Не удалось захватить звук, эквалайзер недоступен, сэр',
    setSaved: 'Настройки сохранены, сэр',
    setLoaded:'Настройки загружены, сэр',
    updDl:    'Загружаю обновление, сэр',
    noVoice:  'Файл озвучки не найден, сэр',
    unload:   'Пак выгружен, сэр',
    voiceSet: 'Озвучка назначена, сэр',
    voiceReset:'Озвучка сброшена, сэр',
    recFound: 'Найден несохранённый пак, сэр. Восстановить',
    recDone:  'Пак восстановлен, сэр',
    draftDel: 'Черновик удалён, сэр'
  };

  const FE = {
    start:    'SpaceEditor is running, sir',
    loaded:   'Command pack loaded, sir',
    readFail: 'Could not read the file, sir',
    badJson:  'The file is corrupted, sir',
    badFormat:'Invalid pack format, sir',
    emptyPack:'The pack has no commands, sir',
    allVoiced:'All commands are voiced, sir',
    saved:    'Pack saved, sir',
    saveFail: 'Could not save the file, sir',
    applyAll: 'Voice applied to all commands, sir',
    unsaved:  'There are unsaved changes, sir. Continue',
    bye:      'Shutting down SpaceEditor, sir',
    reset:    'Settings reset, sir',
    newVer:   'A new version is available, sir',
    latest:   'You have the latest version, sir',
    updFail:  'Could not check for updates, sir',
    installed:'Update installed, restarting, sir',
    instFail: 'Could not install the update, sir',
    badSettings:'Invalid settings file, sir',
    egg:      'Made with love, sir',
    lite:     'Lite mode enabled, sir',
    weakPc:   'Your PC is weak, this setting may cause lag, sir',
    eqFail:   'Could not capture audio, equalizer unavailable, sir',
    setSaved: 'Settings saved, sir',
    setLoaded:'Settings loaded, sir',
    updDl:    'Downloading the update, sir',
    noVoice:  'Voice file not found, sir',
    unload:   'Pack unloaded, sir',
    voiceSet: 'Voice assigned, sir',
    voiceReset:'Voice cleared, sir',
    recFound: 'Unsaved pack found, sir. Restore',
    recDone:  'Pack restored, sir',
    draftDel: 'Draft deleted, sir'
  };

  const OPT = new Set(['recFound', 'recDone', 'draftDel']);
  const cache = new Map();
  let ctx = null, gain = null, cur = null, token = 0;
  const vol = () => (window.VS && typeof VS.vol === 'number') ? VS.vol : 1;
  const EN_BOOST = 2.8;
  const plain = n => n.replace(/,\s*(сэр|sir)(?=\.|$)/i, '');
  const lvl = () => vol() * (window.VS && VS.lang === 'en' ? EN_BOOST : 1);
  window.voiceGain = () => { if (gain) gain.gain.value = lvl(); };

  async function load(name) {
    if (cache.has(name)) return cache.get(name);
    const data = await api.voiceGet(name + '.wav');
    if (!data) return null;
    const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    const buf = await ctx.decodeAudioData(ab);
    cache.set(name, buf);
    return buf;
  }

  window.say = async (key) => {
    if (window.VS && VS.voice === false) return;
    const en = !!(window.VS && VS.lang === 'en');
    const name = (en ? FE : F)[key];
    if (!name || !window.api || !api.voiceGet) return;
    const my = ++token;
    try {
      ctx = ctx || new AudioContext();
      if (!gain) {
        gain = ctx.createGain();
        const lim = ctx.createDynamicsCompressor();
        lim.threshold.value = -2;
        lim.knee.value = 0;
        lim.ratio.value = 20;
        lim.attack.value = .003;
        lim.release.value = .1;
        gain.connect(lim);
        lim.connect(ctx.destination);
      }
      gain.gain.value = lvl();
      if (ctx.state === 'suspended') await ctx.resume();
      const dir = en ? 'english/' : 'russian/';
      let buf = null;
      if (window.VS && VS.sir === false) {
        const p = plain(name);
        if (p !== name) buf = await load(dir + p).catch(() => null);
      }
      if (!buf) buf = await load(dir + name).catch(() => null);
      if (!buf) { if (key !== 'noVoice' && !OPT.has(key) && my === token) say('noVoice'); return; }
      if (my !== token) return;
      if (cur) { try { cur.stop(); } catch {} }
      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.connect(gain);
      s.onended = () => { if (cur === s) cur = null; try { s.disconnect(); } catch {} };
      s.start();
      cur = s;
      return new Promise(r => s.addEventListener('ended', r));
    } catch {}
  };

  window.started = new Promise(r => addEventListener('DOMContentLoaded', r, { once: true }))
    .then(() => new Promise(r => setTimeout(r, 300)))
    .then(() => say('start'));
})();
