(() => {
  'use strict';

  const VIDEOS = [
    {
      id: 'QFD96No33mw',
      title: "What if you're not special at all?",
      creator: 'Alastair',
      seconds: 647,
      duration: '10:47',
      topic: 'IDENTITY · MEANING',
      themes: ['identity', 'meaning'],
      description: "A small reminder that a meaningful life doesn't need to be an extraordinary one. What matters is what you choose to give your attention to.",
      question: 'If you stopped trying to be exceptional, what would you spend your life doing?',
      reflection: 'A thought on being ordinary, taste and the quiet freedom of not having to prove yourself.',
      year: '2026'
    },
    {
      id: 'D9JCwkx558o',
      title: 'PHILOSOPHY – Søren Kierkegaard',
      creator: 'The School of Life',
      seconds: 420,
      duration: '07:00',
      topic: 'EXISTENTIALISM · CHOICE',
      themes: ['existentialism', 'identity'],
      description: 'A doorway into the anxiety of freedom: every real choice opens one path and closes countless others. How do you choose without certainty?',
      question: 'Which possibility are you keeping alive by refusing to choose?',
      reflection: 'Freedom can feel like vertigo. A choice still has to be made.',
      year: '2015'
    },
    {
      id: 'Br1sGrA7XTU',
      title: 'PHILOSOPHY – Heidegger',
      creator: 'The School of Life',
      seconds: 300,
      duration: '05:00',
      topic: 'MORTALITY · AUTHENTICITY',
      themes: ['mortality', 'existentialism'],
      description: 'What changes when we stop treating time as endless? Heidegger asks what it might mean to live as though our finite time actually belongs to us.',
      question: 'What would feel different today if you remembered your time was finite?',
      reflection: 'Mortality is not only an ending; it can sharpen the present.',
      year: '2014'
    },
    {
      id: '3bQsZxDQgzU',
      title: 'PHILOSOPHY – Sartre',
      creator: 'The School of Life',
      seconds: 420,
      duration: '07:00',
      topic: 'EXISTENTIALISM · FREEDOM',
      themes: ['existentialism', 'identity'],
      description: 'We are not simply born with a finished identity. Sartre turns the uncomfortable freedom to shape ourselves into a question of responsibility.',
      question: 'Where are you treating a role, habit or expectation as though it were your whole identity?',
      reflection: 'I am also made by the choices I keep making.',
      year: '2014'
    },
    {
      id: 'jQOfbObFOCw',
      title: 'PHILOSOPHY – Albert Camus',
      creator: 'The School of Life',
      seconds: 600,
      duration: '10:00',
      topic: 'MEANING · THE ABSURD',
      themes: ['meaning', 'existentialism'],
      description: 'Camus looks directly at the gap between our hunger for meaning and an indifferent universe — then makes a surprisingly life-affirming case for living anyway.',
      question: 'What would still make life worth living without a grand explanation?',
      reflection: 'Maybe meaning is something to live, not something to discover fully formed.',
      year: '2015'
    },
    {
      id: '34sA9K8_cLM',
      title: 'The cost of becoming yourself',
      creator: 'Alastair',
      seconds: 541,
      duration: '09:01',
      topic: 'IDENTITY · BECOMING',
      themes: ['identity', 'existentialism'],
      description: 'An essay on moving without certainty, using Van Gogh’s uncertain path to think about self-doubt, persistence and starting before you feel ready.',
      question: 'What could you begin before you know exactly where it will lead?',
      reflection: 'Not knowing the destination does not make the next step meaningless.',
      year: '2026'
    },
    {
      id: 'D5iywwlhRUA',
      title: 'The fear of enjoying your life',
      creator: 'Alastair',
      seconds: 494,
      duration: '08:14',
      topic: 'MEANING · ATTENTION',
      themes: ['meaning', 'identity'],
      description: 'A short reflection on how easy it is to do everything “right” while losing touch with the life happening in front of you.',
      question: 'What are you waiting to achieve before allowing yourself to enjoy the present?',
      reflection: 'Enjoyment does not have to be the prize at the end of the work.',
      year: '2026'
    }
  ].filter(video => Number.isFinite(video.seconds) && video.seconds > 0 && video.seconds <= 25 * 60);

  // User-provided references. Only the Alastair entry has been verified and added to the rotation.
  const INSPIRATION_LINKS = [
    { id: 'ikPsDN4-uF0', label: 'YOUR REFERENCE 01', status: 'TITLE + LENGTH TO CHECK', verified: false },
    { id: 'Yb-U-v6UqY0', label: 'YOUR REFERENCE 02', status: 'TITLE + LENGTH TO CHECK', verified: false },
    { id: 'QFD96No33mw', label: "WHAT IF YOU'RE NOT SPECIAL AT ALL?", status: 'IN DAILY ROTATION · 10:47', verified: true },
    { id: 'et5F7rFOAo0', label: 'YOUR REFERENCE 04', status: 'TITLE + LENGTH TO CHECK', verified: false }
  ];

  const STORAGE = {
    saved: 'wanderspace:saved:v1',
    watched: 'wanderspace:watched:v1',
    notes: 'wanderspace:notes:v1'
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };
  const store = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const saved = new Set(load(STORAGE.saved, []));
  const watched = new Set(load(STORAGE.watched, []));
  const notes = load(STORAGE.notes, {});
  let currentVideo = null;
  let activeFilter = 'all';

  function localDayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function dayOrdinal(date = new Date()) {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function dailyPick(date = new Date()) {
    if (!VIDEOS.length) return null;
    return VIDEOS[((dayOrdinal(date) % VIDEOS.length) + VIDEOS.length) % VIDEOS.length];
  }

  function updateDate() {
    const now = new Date();
    const short = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: '2-digit' }).format(now).toUpperCase();
    const full = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(now).toUpperCase();
    $('#date-stamp').textContent = short.replace(',', ' ·');
    $('#full-date').textContent = full;
    const ordinal = dayOrdinal(now) - dayOrdinal(new Date(now.getFullYear(), 0, 1)) + 1;
    $('#day-number').textContent = `/ ${String(ordinal).padStart(3, '0')}`;
  }

  function syncActionButtons(video) {
    const isSaved = saved.has(video.id);
    const isWatched = watched.has(video.id);
    $('#save-button').setAttribute('aria-pressed', String(isSaved));
    $('#save-button').textContent = isSaved ? '♥' : '♡';
    $('#save-button').setAttribute('aria-label', isSaved ? 'Remove from saved videos' : 'Save video');
    $('#watched-button').setAttribute('aria-pressed', String(isWatched));
    $('#watched-button').textContent = isWatched ? '✓' : '○';
    $('#watched-button').setAttribute('aria-label', isWatched ? 'Mark as unwatched' : 'Mark as watched');
    $('#state-line').textContent = [isSaved ? 'SAVED TO YOUR SHELF' : '', isWatched ? 'WATCHED' : ''].filter(Boolean).join('  ·  ');
  }

  function renderToday() {
    currentVideo = dailyPick();
    if (!currentVideo) return;
    $('#video-thumb').src = `https://img.youtube.com/vi/${currentVideo.id}/hqdefault.jpg`;
    $('#video-thumb').alt = `Thumbnail for ${currentVideo.title}`;
    $('#art-index').textContent = `NO. ${String(VIDEOS.findIndex(v => v.id === currentVideo.id) + 1).padStart(2, '0')}`;
    $('#art-duration').textContent = currentVideo.duration;
    $('#video-topic').textContent = currentVideo.topic;
    $('#video-runtime').textContent = `${Math.floor(currentVideo.seconds / 60)} MIN${currentVideo.seconds % 60 ? ` ${String(currentVideo.seconds % 60).padStart(2, '0')} SEC` : ''}`;
    $('#video-title').textContent = currentVideo.title;
    $('#video-creator').textContent = currentVideo.creator;
    $('#video-description').textContent = currentVideo.description;
    $('#daily-question').textContent = currentVideo.question;
    $('#youtube-link').href = `https://www.youtube.com/watch?v=${currentVideo.id}`;
    $('#reflection-input').value = notes[localDayKey()] || '';
    $('#reflection-status').textContent = notes[localDayKey()] ? 'PRIVATE · NOTE SAVED' : 'PRIVATE · SAVED ON THIS DEVICE';
    syncActionButtons(currentVideo);
  }

  function setSaved(video, shouldSave) {
    if (shouldSave) saved.add(video.id); else saved.delete(video.id);
    store(STORAGE.saved, [...saved]);
    if (currentVideo?.id === video.id) syncActionButtons(video);
    renderLibrary();
  }

  function setWatched(video, shouldWatch) {
    if (shouldWatch) watched.add(video.id); else watched.delete(video.id);
    store(STORAGE.watched, [...watched]);
    if (currentVideo?.id === video.id) syncActionButtons(video);
    renderLibrary();
  }

  function videoCard(video) {
    const card = document.createElement('article');
    card.className = 'library-card';
    card.innerHTML = `
      <div class="library-image">
        <img loading="lazy" src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="" />
        <span>${video.duration}</span>
      </div>
      <div class="library-meta"><span>${video.topic.split(' · ')[0]}</span><span>${video.year}</span></div>
      <h3></h3>
      <p></p>
      <div class="card-bottom"><span>${video.creator}</span><b>${saved.has(video.id) ? '♥ SAVED' : watched.has(video.id) ? '✓ WATCHED' : 'UNDER 25 MIN'}</b></div>`;
    $('h3', card).textContent = video.title;
    $('p', card).textContent = video.description;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Play ${video.title}`);
    const open = () => openPlayer(video);
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
    return card;
  }

  function renderLibrary() {
    const grid = $('#library-grid');
    grid.replaceChildren();
    const filtered = VIDEOS.filter(video => activeFilter === 'all' || video.themes.includes(activeFilter));
    filtered.forEach(video => grid.append(videoCard(video)));
    $('#shelf-tally').textContent = `${String(filtered.length).padStart(2, '0')} VERIFIED PICKS`;
    $('#library-count').textContent = String(VIDEOS.length).padStart(2, '0');
  }

  function renderSeeds() {
    const root = $('#seed-links');
    root.replaceChildren();
    INSPIRATION_LINKS.forEach((seed, index) => {
      const a = document.createElement('a');
      a.className = 'seed-link';
      a.href = `https://www.youtube.com/watch?v=${seed.id}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `<span class="seed-label"></span><span class="seed-status"><span></span><b></b></span>`;
      $('.seed-label', a).textContent = seed.label;
      $('.seed-status span', a).textContent = seed.status;
      $('.seed-status b', a).textContent = seed.verified ? '✓' : '↗';
      a.setAttribute('aria-label', `${seed.label}. ${seed.status}. Opens on YouTube.`);
      root.append(a);
    });
  }

  function openPlayer(video) {
    const modal = $('#player-modal');
    $('#player-heading').textContent = video.title;
    $('#modal-youtube-link').href = `https://www.youtube.com/watch?v=${video.id}`;
    $('#player-frame-wrap').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0" title="${video.title.replaceAll('"', '&quot;')}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    $('#close-player').focus();
  }

  function closePlayer() {
    const modal = $('#player-modal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    $('#player-frame-wrap').replaceChildren();
    document.body.classList.remove('modal-open');
    $('#watch-button').focus();
  }

  function switchView(name) {
    $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
    $$('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.view === name));
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function saveNote() {
    const text = $('#reflection-input').value.trim();
    if (text) notes[localDayKey()] = text;
    else delete notes[localDayKey()];
    const ok = store(STORAGE.notes, notes);
    $('#reflection-status').textContent = ok ? (text ? 'PRIVATE · NOTE SAVED' : 'PRIVATE · EMPTY NOTE') : 'STORAGE UNAVAILABLE';
  }

  function updateCountdown() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    let seconds = Math.max(0, Math.floor((next - now) / 1000));
    const hours = Math.floor(seconds / 3600); seconds %= 3600;
    const mins = Math.floor(seconds / 60); seconds %= 60;
    $('#countdown').textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  $$('.nav-link').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
  $$('.filter-chip').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    $$('.filter-chip').forEach(chip => chip.classList.toggle('active', chip === button));
    renderLibrary();
  }));
  $('#play-button').addEventListener('click', () => openPlayer(currentVideo));
  $('#watch-button').addEventListener('click', () => openPlayer(currentVideo));
  $('#close-player').addEventListener('click', closePlayer);
  $('[data-close-player]').addEventListener('click', closePlayer);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#player-modal').classList.contains('open')) closePlayer(); });
  $('#save-button').addEventListener('click', () => setSaved(currentVideo, !saved.has(currentVideo.id)));
  $('#watched-button').addEventListener('click', () => setWatched(currentVideo, !watched.has(currentVideo.id)));
  $('#save-reflection').addEventListener('click', saveNote);
  $('#reflection-input').addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') saveNote(); });
  $('#reflection-input').addEventListener('blur', () => {
    const value = $('#reflection-input').value;
    if (value !== (notes[localDayKey()] || '')) saveNote();
  });

  updateDate();
  renderToday();
  renderLibrary();
  renderSeeds();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  window.setInterval(() => {
    const key = localDayKey();
    if (key !== document.documentElement.dataset.dayKey) {
      document.documentElement.dataset.dayKey = key;
      updateDate();
      renderToday();
    }
  }, 15000);
  document.documentElement.dataset.dayKey = localDayKey();

  // Particle-ring background adapted from the supplied AXON motion reference.
  (() => {
    const canvas = $('#particle-field');
    const THREE = window.THREE;
    if (!canvas || !THREE) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let count = window.matchMedia('(max-width: 720px)').matches ? 11500 : 30000;
    const TAU = Math.PI * 2;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
    renderer.setClearColor(0x050507, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, .1, 100);
    camera.position.set(0, 0, 6.3);
    const group = new THREE.Group();
    group.position.set(.65, -.15, -.35);
    group.rotation.set(-.18, .22, .05);
    group.scale.set(1.85, 1.85, 1.85);
    scene.add(group);

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    function gaussian() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
    }
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * TAU;
      const phi = Math.random() * TAU;
      const tube = .22 * (.8 + Math.random() * .4);
      const radius = .88 + .06 * Math.sin(theta * 3) + .03 * Math.sin(theta * 7 + .8);
      const twist = phi + theta * .74 + .15 * Math.sin(theta * 2);
      const jitter = .014 * gaussian();
      const idx = i * 3;
      positions[idx] = (radius + tube * Math.cos(twist)) * Math.cos(theta) + jitter;
      positions[idx + 1] = (radius + tube * Math.cos(twist)) * Math.sin(theta) + jitter;
      positions[idx + 2] = tube * Math.sin(twist) + .055 * Math.cos(theta * 2) + jitter * .6;
      const r = i * 4;
      randoms[r] = Math.random(); randoms[r + 1] = Math.random(); randoms[r + 2] = Math.random(); randoms[r + 3] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4));
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uEnergy: { value: 0 }, uPixelRatio: { value: 1 } },
      vertexShader: `
        attribute vec4 aRandom; uniform float uTime; uniform vec2 uMouse; uniform float uEnergy; uniform float uPixelRatio;
        varying float vTint; varying float vAlpha;
        void main() {
          vec3 p = position;
          float clock = uTime * .2 + aRandom.x * 6.2831;
          vec2 delta = p.xy * .9 - uMouse * .72;
          float influence = exp(-dot(delta, delta) * 2.8) * uEnergy;
          vec3 axis = normalize(vec3(-delta.y, delta.x, .25));
          p += axis * influence * (.15 + aRandom.y * .08);
          p += vec3(sin(p.y * 4.1 + clock), cos(p.z * 4.7 - clock * .7), sin(p.x * 3.8 + clock * .5)) * (.008 + uEnergy * .023);
          p *= 1.0 + sin(uTime * .3 + aRandom.x * 6.2831) * .008;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float distance = max(1.0, -mv.z); float sparkle = pow(aRandom.z, 75.0);
          gl_PointSize = clamp((10.5 / distance) * (.55 + aRandom.y * .9 + sparkle * 1.6) * uPixelRatio, .7, 6.0);
          vTint = pow(aRandom.z, 8.0); vAlpha = .65 + .35 * sin(uTime * 2.7 + aRandom.y * 18.0) * sparkle;
        }`,
      fragmentShader: `
        varying float vTint; varying float vAlpha;
        void main() { vec2 uv = gl_PointCoord * 2.0 - 1.0; float d = dot(uv, uv); if (d > 1.0) discard;
          float soft = smoothstep(1.0, .02, d); vec3 grey = vec3(.42,.41,.47); vec3 lavender = vec3(.68,.52,1.0);
          vec3 color = mix(grey, lavender, vTint); color += smoothstep(.48,0.0,d) * .25; gl_FragColor = vec4(color, soft * vAlpha * .8); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    group.add(points);
    const target = new THREE.Vector2();
    const smooth = new THREE.Vector2();
    let energy = 0, last = performance.now(), pointer = null, active = true;
    const reduced = reduceMotion;
    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    }
    function onPointer(event) {
      const x = event.clientX, y = event.clientY;
      if (pointer) energy = Math.min(1, energy + Math.min(.11, Math.hypot(x - pointer.x, y - pointer.y) / 100));
      pointer = { x, y };
      target.set((x / window.innerWidth) * 2 - 1, -((y / window.innerHeight) * 2 - 1));
    }
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    resize();
    function frame(now) {
      if (!active) return;
      const delta = Math.min(.05, (now - last) / 1000 || .016);
      last = now;
      if (!reduced) {
        smooth.lerp(target, .07);
        energy *= Math.pow(.035, delta);
        material.uniforms.uTime.value = now * .001;
        material.uniforms.uMouse.value.copy(smooth);
        material.uniforms.uEnergy.value = energy;
        camera.position.x += ((-smooth.x * .18) - camera.position.x) * .035;
        camera.position.y += ((smooth.y * .12) - camera.position.y) * .035;
        group.rotation.y += delta * .014;
        group.rotation.z += delta * .005;
      }
      camera.lookAt(.18, -.04, 0);
      renderer.render(scene, camera);
      if (!reduced) requestAnimationFrame(frame);
    }
    if (reduced) frame(performance.now()); else requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => { if (document.hidden) active = false; else if (!active) { active = true; last = performance.now(); requestAnimationFrame(frame); } });
  })();
})();
