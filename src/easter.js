(() => {
  const logo = document.querySelector('.logo-pill');
  if (!logo || !window.api || !window.api.easterAudio) return;

  let count = 0;
  let timer = 0;
  let ctx = null;
  let buf = null;
  let src = null;
  let loading = false;

  const stop = () => {
    if (!src) return;
    const s = src;
    src = null;
    s.onended = null;
    try { s.stop(); } catch {}
    try { s.disconnect(); } catch {}
  };

  const play = async () => {
    if (loading) return;
    if (src) { stop(); return; }
    loading = true;
    try {
      if (!ctx) ctx = new AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      if (!buf) {
        const data = await window.api.easterAudio();
        if (!data) return;
        const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        buf = await ctx.decodeAudioData(ab);
      }
      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.connect(ctx.destination);
      s.onended = () => {
        if (src === s) src = null;
        try { s.disconnect(); } catch {}
      };
      s.start();
      src = s;
    } catch {
    } finally {
      loading = false;
    }
  };

  logo.addEventListener('click', () => {
    count++;
    clearTimeout(timer);
    if (count >= 3) {
      count = 0;
      play();
      return;
    }
    timer = setTimeout(() => { count = 0; }, 700);
  });
})();
