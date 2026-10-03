const { app, BrowserWindow, ipcMain, dialog, shell, clipboard, desktopCapturer, net, session, nativeTheme } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { fileURLToPath } = require('url');
const { spawn, execFile } = require('child_process');
const { Readable, Transform } = require('stream');
const { pipeline } = require('stream/promises');

let win;

app.setName('SpaceEditor');
app.setAppUserModelId('ru.moonmag.spaceeditor');
app.commandLine.appendSwitch('disable-logging');
app.setPath('userData', path.join(app.getPath('appData'), 'SpaceEditor'));
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
app.on('second-instance', () => {
  if (!win || win.isDestroyed()) return;
  if (win.isMinimized()) win.restore();
  win.focus();
});
let forceClose = false, ackT;
let pending = null, installing = false;

const SETTINGS_DIR = path.join(app.getPath('appData'), 'SpaceEditor');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'settings.json');
const NOTES_FILE = path.join(SETTINGS_DIR, 'notes.json');
const INDEX_FILE = path.join(__dirname, 'index.html');

const MAX_JSON_BYTES = 50 * 1024 * 1024;
const MAX_SETTINGS_BYTES = 5 * 1024 * 1024;
const MAX_UPDATE_BYTES = 500 * 1024 * 1024;

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

function writeAtomic(file, data) {
  const tmp = file + '.tmp';
  try {
    fs.writeFileSync(tmp, data, 'utf-8');
    fs.renameSync(tmp, file);
  } catch (err) {
    try { fs.unlinkSync(tmp); } catch {}
    throw err;
  }
}

const isIndex = (u) => {
  try {
    if (typeof u !== 'string' || !u.startsWith('file:')) return false;
    return path.resolve(fileURLToPath(u)).toLowerCase() === path.resolve(INDEX_FILE).toLowerCase();
  } catch { return false; }
};
function trusted(e) {
  return isIndex(e && e.senderFrame && e.senderFrame.url);
}
const onTrusted = (ch, fn, sync) => ipcMain.on(ch, (e, ...a) => {
  if (!trusted(e)) { if (sync) e.returnValue = null; return; }
  fn(e, ...a);
});
const handleTrusted = (ch, fn) => ipcMain.handle(ch, (e, ...a) => {
  if (!trusted(e)) throw new Error('untrusted sender');
  return fn(e, ...a);
});

const ENUMS = { lang: ['ru', 'en'], theme: ['dark', 'light', 'auto'], bg: ['live', 'lite', 'off'], rand: ['r', 'f'] };
const NUMS = { k: [.4, 1.6], bri: [.3, 1.5], zoom: [.8, 1.4] };
const BOOLS = ['lens', 'calm', 'first', 'warn', 'warnClose', 'confirmAll', 'top', 'perfDone', 'autoUpdate'];

function sanitizeSettings(src) {
  const o = {};
  if (!isObj(src)) return o;
  for (const k of Object.keys(ENUMS)) if (ENUMS[k].includes(src[k])) o[k] = src[k];
  for (const k of Object.keys(NUMS)) {
    if (typeof src[k] === 'number' && isFinite(src[k])) o[k] = Math.min(NUMS[k][1], Math.max(NUMS[k][0], src[k]));
  }
  for (const k of BOOLS) if (typeof src[k] === 'boolean') o[k] = src[k];
  return o;
}

function sanitizeNotes(src) {
  const out = {};
  if (!isObj(src)) return out;
  let n = 0, total = 0;
  for (const [k, v] of Object.entries(src)) {
    if (k === '__proto__' || typeof v !== 'string' || !v.trim()) continue;
    if (k.length > 1000 || v.length > 20000) continue;
    total += k.length + v.length;
    if (++n > 5000 || total > 4e6) break;
    out[k] = v;
  }
  return out;
}

function readJsonSafe(file, maxBytes) {
  const st = fs.statSync(file);
  if (!st.isFile() || st.size > maxBytes) throw new Error('bad file');
  return JSON.parse(fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, ''));
}

function readSettings() {
  try { return sanitizeSettings(readJsonSafe(SETTINGS_FILE, MAX_SETTINGS_BYTES)); }
  catch { return {}; }
}

function writeSettings(obj) {
  try {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
    writeAtomic(SETTINGS_FILE, JSON.stringify(sanitizeSettings(obj), null, 2));
    return true;
  } catch { return false; }
}

function readNotes() {
  try { return sanitizeNotes(readJsonSafe(NOTES_FILE, MAX_SETTINGS_BYTES)); }
  catch { return {}; }
}

onTrusted('settings-get', (e) => { e.returnValue = readSettings(); }, true);
onTrusted('settings-set', (e, obj) => {
  if (isObj(obj)) writeSettings(obj);
});

onTrusted('notes-get', (e) => { e.returnValue = readNotes(); }, true);
onTrusted('notes-set', (e, obj) => {
  if (!isObj(obj)) return;
  try {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
    writeAtomic(NOTES_FILE, JSON.stringify(sanitizeNotes(obj), null, 2));
  } catch {}
});

handleTrusted('export-settings', async (e, title) => {
  const { filePath } = await dialog.showSaveDialog(win, {
    title: String(title || 'SpaceEditor').slice(0, 200),
    defaultPath: 'spaceeditor-settings.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (!filePath) return { ok: false, canceled: true };
  try {
    const out = { app: 'SpaceEditor', version: app.getVersion(), settings: readSettings(), notes: readNotes() };
    writeAtomic(filePath, JSON.stringify(out, null, 2));
    return { ok: true };
  } catch { return { ok: false }; }
});
handleTrusted('import-settings', async (e, title) => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    title: String(title || 'SpaceEditor').slice(0, 200),
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (!filePaths.length) return { ok: false, canceled: true };
  try {
    const d = readJsonSafe(filePaths[0], MAX_SETTINGS_BYTES);
    if (!isObj(d) || d.app !== 'SpaceEditor' || !isObj(d.settings)) return { ok: false };
    return { ok: true, settings: sanitizeSettings(d.settings), notes: sanitizeNotes(d.notes) };
  } catch { return { ok: false }; }
});

handleTrusted('copy-text', (e, txt) => {
  try { clipboard.writeText(String(txt).slice(0, 10000)); return true; }
  catch { return false; }
});

const AUDIO_MAX_BYTES = 50 * 1024 * 1024;
handleTrusted('easter-audio', () => {
  try {
    const root = path.join(__dirname, '..', 'assets');
    const name = fs.readdirSync(root).find((f) => /\.mp3$/i.test(f));
    if (!name) return null;
    const file = path.join(root, name);
    const st = fs.statSync(file);
    if (!st.isFile() || st.size > AUDIO_MAX_BYTES) return null;
    return fs.readFileSync(file);
  } catch { return null; }
});

handleTrusted('eq-source', async () => {
  try {
    const s = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 0, height: 0 } });
    return s[0] ? s[0].id : null;
  } catch { return null; }
});

const REPO = 'm0onmag/spaceeditor';
const RELEASE_PREFIX = 'https://github.com/' + REPO + '/releases/download/';
const DIGEST_RE = /^sha256:[0-9a-f]{64}$/i;
const SAFE_VER = /^[0-9A-Za-z][0-9A-Za-z.\-+]{0,31}$/;

const LINKS = {
  telegram: 'https://t.me/spacestudiomc',
  github: 'https://github.com/' + REPO,
  releases: 'https://github.com/' + REPO + '/releases/latest',
  bug: 'https://t.me/m0onmag'
};

const parseVer = (s) => String(s || '').trim().replace(/^v/i, '').split(/[-+]/)[0].split('.').map((n) => parseInt(n, 10) || 0);
const isNewer = (a, b) => {
  const x = parseVer(a), y = parseVer(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return d > 0;
  }
  return false;
};

handleTrusted('check-update', async () => {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 10000);
  const current = app.getVersion();
  try {
    const r = await net.fetch('https://api.github.com/repos/' + REPO + '/releases/latest', {
      headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'SpaceEditor' },
      signal: ctl.signal
    });
    if (r.status === 404) return { ok: true, current, latest: current, update: false };
    if (!r.ok) return { ok: false };
    const j = await r.json();
    const latest = String(j.tag_name || '').trim().replace(/^v/i, '');
    if (!latest || !SAFE_VER.test(latest)) return { ok: false };
    const update = isNewer(latest, current);
    const asset = (j.assets || []).find((a) => /\.exe$/i.test(a.name || '') && String(a.browser_download_url || '').toLowerCase().startsWith(RELEASE_PREFIX.toLowerCase()));
    const digest = String((asset && asset.digest) || '');
    pending = update && asset && DIGEST_RE.test(digest)
      ? { url: asset.browser_download_url, size: asset.size | 0, digest }
      : null;
    return { ok: true, current, latest, update, canInstall: !!(pending && process.env.PORTABLE_EXECUTABLE_FILE) };
  } catch { return { ok: false }; }
  finally { clearTimeout(timer); }
});

const psSig = (file) => new Promise((resolve) => {
  const ps = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  const script = "$s = Get-AuthenticodeSignature -LiteralPath $env:SE_FILE; if ($s.Status -eq 'Valid') { $s.SignerCertificate.Subject } else { '' }";
  execFile(ps, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script], {
    env: { ...process.env, SE_FILE: file },
    windowsHide: true,
    timeout: 30000
  }, (err, out) => resolve(err ? '' : String(out).trim()));
});

handleTrusted('install-update', async () => {
  const dst = process.env.PORTABLE_EXECUTABLE_FILE || '';
  if (!pending || !dst || installing || /["\r\n]/.test(dst)) return { ok: false };
  installing = true;
  const tmp = dst + '.new';
  const send = (p) => { try { win.webContents.send('update-progress', p); } catch {} };
  try {
    const r = await net.fetch(pending.url, { headers: { 'User-Agent': 'SpaceEditor' } });
    if (!r.ok || !r.body) throw new Error('http');
    const fu = new URL(r.url || pending.url);
    if (fu.protocol !== 'https:' || !/(^|\.)(github\.com|githubusercontent\.com)$/i.test(fu.hostname)) throw new Error('proto');
    const total = pending.size || Number(r.headers.get('content-length')) || 0;
    if (!total || total > MAX_UPDATE_BYTES) throw new Error('size');
    const hash = crypto.createHash('sha256');
    let got = 0, last = -1;
    const meter = new Transform({
      transform(chunk, enc, cb) {
        got += chunk.length;
        if (got > total) return cb(new Error('size'));
        hash.update(chunk);
        const p = Math.min(99, Math.floor(got / total * 100));
        if (p !== last) { last = p; send(p); }
        cb(null, chunk);
      }
    });
    await pipeline(Readable.fromWeb(r.body), meter, fs.createWriteStream(tmp));
    if (got !== total) throw new Error('size');
    if (hash.digest('hex') !== pending.digest.slice(7).toLowerCase()) throw new Error('hash');
    const fd = fs.openSync(tmp, 'r');
    const head = Buffer.alloc(2);
    fs.readSync(fd, head, 0, 2, 0);
    fs.closeSync(fd);
    if (head.toString() !== 'MZ') throw new Error('format');
    const curSig = await psSig(dst);
    if (curSig && (await psSig(tmp)) !== curSig) throw new Error('sig');
    const vbs = path.join(os.tmpdir(), 'spaceeditor-update-' + crypto.randomBytes(8).toString('hex') + '.vbs');
    const script = [
      'Set fso = CreateObject("Scripting.FileSystemObject")',
      'src = "' + tmp + '"',
      'dst = "' + dst + '"',
      'bak = dst & ".old"',
      'ok = False',
      'For i = 1 To 60',
      '  On Error Resume Next',
      '  Err.Clear',
      '  If fso.FileExists(bak) Then fso.DeleteFile bak, True',
      '  Err.Clear',
      '  fso.MoveFile dst, bak',
      '  If Err.Number = 0 Then',
      '    Err.Clear',
      '    fso.MoveFile src, dst',
      '    If Err.Number = 0 Then',
      '      ok = True',
      '    Else',
      '      Err.Clear',
      '      fso.MoveFile bak, dst',
      '    End If',
      '  End If',
      '  Err.Clear',
      '  On Error GoTo 0',
      '  If ok Then Exit For',
      '  WScript.Sleep 1000',
      'Next',
      'If ok Then',
      '  On Error Resume Next',
      '  fso.DeleteFile bak, True',
      '  On Error GoTo 0',
      '  CreateObject("WScript.Shell").Run Chr(34) & dst & Chr(34), 1, False',
      'Else',
      '  On Error Resume Next',
      '  fso.DeleteFile src, True',
      '  On Error GoTo 0',
      'End If',
      'On Error Resume Next',
      'fso.DeleteFile WScript.ScriptFullName, True',
      ''
    ].join('\r\n');
    fs.writeFileSync(vbs, Buffer.concat([Buffer.from([0xFF, 0xFE]), Buffer.from(script, 'utf16le')]), { flag: 'wx' });
    spawn(path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'wscript.exe'), ['//B', '//Nologo', vbs], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
    send(100);
    setTimeout(() => { forceClose = true; app.quit(); }, 400);
    return { ok: true };
  } catch (err) {
    try { fs.unlinkSync(tmp); } catch {}
    installing = false;
    return { ok: false };
  }
});

handleTrusted('get-changelog', async () => {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 10000);
  try {
    const cur = app.getVersion();
    const short = cur.replace(/\.0$/, '');
    const tags = [...new Set(['v' + cur, 'v' + short, cur, short])];
    let r = null;
    for (const tag of tags) {
      r = await net.fetch('https://api.github.com/repos/' + REPO + '/releases/tags/' + encodeURIComponent(tag), {
        headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'SpaceEditor' },
        signal: ctl.signal
      });
      if (r.status !== 404) break;
    }
    if (r.status === 404) return { ok: true, empty: true };
    if (!r.ok) return { ok: false };
    const j = await r.json();
    const version = String(j.tag_name || '').trim().replace(/^v/i, '');
    if (isNewer(version, cur) || isNewer(cur, version)) return { ok: true, empty: true };
    return {
      ok: true,
      version: SAFE_VER.test(version) ? version : '',
      date: String(j.published_at || '').slice(0, 40),
      body: String(j.body || '').slice(0, 20000)
    };
  } catch { return { ok: false }; }
  finally { clearTimeout(timer); }
});

onTrusted('app-version', (e) => { e.returnValue = app.getVersion(); }, true);

onTrusted('open-data-dir', () => {
  try { fs.mkdirSync(SETTINGS_DIR, { recursive: true }); } catch {}
  shell.openPath(SETTINGS_DIR);
});
onTrusted('open-link', (e, name) => {
  if (typeof name === 'string' && Object.prototype.hasOwnProperty.call(LINKS, name)) shell.openExternal(LINKS[name]);
});

app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  contents.on('will-navigate', (e) => e.preventDefault());
  contents.on('will-redirect', (e) => e.preventDefault());
  contents.on('will-attach-webview', (e) => e.preventDefault());
});


app.whenReady().then(() => {
  if (!gotLock) return;
  const ses = session.defaultSession;
  const mediaPerms = ['media', 'display-capture'];
  ses.setPermissionRequestHandler((wc, permission, cb, details) => {
    cb(mediaPerms.includes(permission) && isIndex(details && details.requestingUrl));
  });
  ses.setPermissionCheckHandler((wc, permission, origin, details) => {
    return mediaPerms.includes(permission) && isIndex(details && details.requestingUrl);
  });
  ses.setDisplayMediaRequestHandler((request, cb) => {
    const url = request && request.frame ? request.frame.url : '';
    if (!isIndex(url)) return cb({});
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 0, height: 0 } })
      .then((s) => (s[0] ? cb({ video: s[0], audio: 'loopback' }) : cb({})))
      .catch(() => cb({}));
  }, { useSystemPicker: false });

  const cfg = readSettings();
  const light = cfg.theme === 'light' || (cfg.theme === 'auto' && !nativeTheme.shouldUseDarkColors);
  const calm = !!cfg.calm;
  const splash = new BrowserWindow({
    width: 480,
    height: 300,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    show: false,
    center: true,
    backgroundColor: light ? '#f2f2f5' : '#000',
    icon: path.join(__dirname, '..', 'assets', 'spaceeditor.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      spellcheck: false,
      devTools: false
    }
  });
  let splashAt = 0;
  splash.once('ready-to-show', () => { splashAt = Date.now(); splash.show(); });
  splash.loadFile(path.join(__dirname, 'splash.html'), {
    query: { theme: light ? 'light' : 'dark', lang: cfg.lang === 'en' ? 'en' : 'ru', calm: calm ? '1' : '0' }
  });

  win = new BrowserWindow({
    show: false,
    width: 1200,
    height: 760,
    minWidth: 860,
    minHeight: 580,
    frame: false,
    backgroundColor: '#000',
    icon: path.join(__dirname, '..', 'assets', 'spaceeditor.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      spellcheck: false,
      devTools: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile(INDEX_FILE);

  let revealed = false;
  const reveal = () => {
    if (revealed || !win || win.isDestroyed()) return;
    revealed = true;
    clearTimeout(failT);
    win.show();
    if (splash.isDestroyed()) return;
    if (calm) { splash.destroy(); return; }
    let o = 1;
    const iv = setInterval(() => {
      o -= .12;
      if (o <= 0 || splash.isDestroyed()) {
        clearInterval(iv);
        if (!splash.isDestroyed()) splash.destroy();
        return;
      }
      try { splash.setOpacity(o); } catch {}
    }, 20);
  };
  const failT = setTimeout(reveal, 15000);
  win.once('ready-to-show', () => {
    const wait = splashAt ? Math.max(0, 1100 - (Date.now() - splashAt)) : 0;
    setTimeout(reveal, wait);
  });

  win.on('close', (e) => {
    if (forceClose) return;
    e.preventDefault();
    win.webContents.send('close-request');
    clearTimeout(ackT);
    ackT = setTimeout(() => { forceClose = true; if (!win.isDestroyed()) win.close(); }, 1500);
  });
});

app.on('window-all-closed', () => app.quit());

handleTrusted('open-json', async (e, title) => {
  const { filePaths } = await dialog.showOpenDialog(win, {
    title: String(title || 'Открыть JSON пак').slice(0, 200),
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (!filePaths.length) return null;
  try {
    const st = fs.statSync(filePaths[0]);
    if (!st.isFile() || st.size > MAX_JSON_BYTES) return null;
    const data = fs.readFileSync(filePaths[0], 'utf-8').replace(/^\uFEFF/, '');
    return { path: filePaths[0], data };
  } catch { return null; }
});

handleTrusted('save-json', async (e, content, title) => {
  if (typeof content !== 'string' || Buffer.byteLength(content, 'utf-8') > MAX_JSON_BYTES) return false;
  const { filePath } = await dialog.showSaveDialog(win, {
    title: String(title || 'Сохранить JSON').slice(0, 200),
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (!filePath) return false;
  try {
    writeAtomic(filePath, content);
    return true;
  } catch { return false; }
});

onTrusted('win-minimize', () => win && win.minimize());
onTrusted('win-maximize', () => win && (win.isMaximized() ? win.unmaximize() : win.maximize()));
onTrusted('win-close', () => win && win.close());
onTrusted('close-ack', () => clearTimeout(ackT));
onTrusted('win-force-close', () => { forceClose = true; win && win.close(); });
onTrusted('win-ontop', (e, v) => win && win.setAlwaysOnTop(!!v));
