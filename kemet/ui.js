/* Kemet: everything the player sees. Rules live in logic.js. */
(function () {
  'use strict';
  const K = window.Kemet;
  const SAVE_KEY = 'kemet.save.v1';
  const $ = (id) => document.getElementById(id);
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let S;
  let tab = 'village';
  const seenTabs = new Set(['village']);
  let pressing = false;

  /* formatting ------------------------------------------------------- */
  function fmt(n) {
    if (!isFinite(n)) return '0';
    const a = Math.abs(n);
    if (a < 10) return (Math.floor(n * 10) / 10).toString();
    if (a < 1000) return Math.floor(n).toString();
    const u = ['k', 'M', 'B', 'T'];
    let i = -1, v = a;
    while (v >= 1000 && i < u.length - 1) { v /= 1000; i++; }
    return (n < 0 ? '-' : '') + (v < 100 ? v.toFixed(1) : Math.floor(v)) + u[i];
  }
  const clock = (s) => { s = Math.ceil(s); return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function costHTML(cost) {
    return Object.keys(cost).map((r) => {
      const short = S.res[r] < cost[r];
      return `<span class="${short ? 'miss' : ''}">${fmt(cost[r])} ${K.RES[r].name.toLowerCase()}</span>`;
    }).join(', ');
  }

  /* only touch the DOM when content really changed, and never mid-press */
  function put(el, html) {
    if (pressing || el._html === html) return;
    const act = document.activeElement && el.contains(document.activeElement) ? document.activeElement.dataset.act : null;
    el.innerHTML = html;
    el._html = html;
    if (act) { const b = el.querySelector(`[data-act="${act}"]`); if (b) b.focus(); }
  }

  /* scene ------------------------------------------------------------ */
  const HUTS = [[52, 160], [96, 156], [140, 162], [186, 155], [232, 161], [278, 156], [74, 142], [120, 138], [166, 144], [212, 139], [258, 143], [304, 140]];
  const PALMS = [[22, 168], [334, 166], [378, 170], [596, 170]];
  const MON = [
    { x: 420, base: 168, shape: '<polygon points="-42,0 -34,-24 34,-24 42,0" fill="#d9b071"/><polygon points="8,0 8,-24 34,-24 42,0" fill="#b98d50"/>', h: 26, w: 90 },
    { x: 530, base: 168, shape: '<rect x="-58" y="-12" width="116" height="12" fill="#e3bd80"/><rect x="-47" y="-24" width="94" height="12" fill="#d9b071"/><rect x="-36" y="-36" width="72" height="12" fill="#e3bd80"/><rect x="-25" y="-48" width="50" height="12" fill="#d9b071"/><rect x="-14" y="-60" width="28" height="12" fill="#e3bd80"/><polygon points="0,0 58,0 58,-12 47,-12 47,-24 36,-24 36,-36 25,-36 25,-48 14,-48 14,-60 0,-60" fill="#000" opacity=".16"/>', h: 62, w: 120 },
    { x: 680, base: 168, shape: '<polygon points="-72,0 -42,-52 0,-82 42,-52 72,0" fill="#e3bd80"/><polygon points="0,0 0,-82 42,-52 72,0" fill="#b98d50"/>', h: 84, w: 150 },
    { x: 850, base: 168, shape: '<polygon points="-86,0 0,-74 86,0" fill="#c8664a"/><polygon points="0,0 0,-74 86,0" fill="#9c4733"/>', h: 76, w: 176 },
    { x: 1060, base: 168, shape: '<polygon points="-112,0 0,-132 112,0" fill="#eccb8f"/><polygon points="0,0 0,-132 112,0" fill="#c09556"/><polygon points="-12,-118 0,-132 12,-118" fill="#efbd33"/>', h: 134, w: 228 },
  ];

  function buildScene() {
    const huts = HUTS.map((h, i) => `<g id="hut${i}" transform="translate(${h[0]} ${h[1]})" visibility="hidden"><rect x="-13" y="-16" width="26" height="16" fill="#c79a62"/><rect x="-16" y="-19" width="32" height="4" fill="#8f6a3e"/><rect x="-3" y="-10" width="6" height="10" fill="#0a1630"/></g>`).join('');
    const palms = PALMS.map((p) => `<g transform="translate(${p[0]} ${p[1]})"><path d="M0 0 Q3 -22 0 -42" stroke="#6b4a2a" stroke-width="4" fill="none"/><path d="M0 -42 Q-18 -50 -26 -34 M0 -42 Q18 -50 26 -34 M0 -42 Q-12 -58 -24 -52 M0 -42 Q12 -58 24 -52" stroke="#2a7d5f" stroke-width="5" fill="none" stroke-linecap="round"/></g>`).join('');
    const mons = MON.map((m, i) => `<clipPath id="mc${i}"><rect id="mr${i}" x="${-m.w / 2}" y="0" width="${m.w}" height="0"/></clipPath><g transform="translate(${m.x} ${m.base})"><g clip-path="url(#mc${i})">${m.shape}</g></g>`).join('');
    const folk = Array.from({ length: 14 }, (_, i) => {
      const x = 70 + (i * 83) % 1040, y = 192 + (i * 13) % 30;
      return `<g id="folk${i}" transform="translate(${x} ${y})" visibility="hidden"><circle cy="-13" r="2.6" fill="#0a1630"/><rect x="-2.2" y="-10.5" width="4.4" height="6" fill="#8a4b2d"/><rect x="-2.6" y="-5" width="5.2" height="5" fill="#f3ead6"/></g>`;
    }).join('');
    $('scene').innerHTML = `<svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice">
      <defs>
        <pattern id="ripple" width="36" height="16" patternUnits="userSpaceOnUse"><path d="M0 11 L6 5 L12 11 L18 5 L24 11 L30 5 L36 11" fill="none" stroke="#bfe3f5" stroke-width="2.2"/></pattern>
        <pattern id="furrow" width="26" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 H26" stroke="#000" stroke-opacity=".16" stroke-width="2"/></pattern>
      </defs>
      <rect id="sky" width="1200" height="170" fill="#8fc3dc"/>
      <circle id="sun" r="24" cx="300" cy="50" fill="#efbd33"/>
      <path d="M0 150 Q200 118 420 142 T820 136 T1200 146 V180 H0Z" fill="#d6a764"/>
      <path d="M0 162 Q300 146 600 160 T1200 156 V180 H0Z" fill="#c4914f"/>
      <g id="monuments">${mons}</g>
      <g id="temple" visibility="hidden" transform="translate(330 168)"><polygon points="-40,0 -33,-46 -6,-46 -6,0" fill="#efe0bd"/><polygon points="40,0 33,-46 6,-46 6,0" fill="#d9c394"/><rect x="-6" y="-30" width="12" height="30" fill="#2348a0"/><rect x="-6" y="-36" width="12" height="6" fill="#c8402a"/></g>
      <g id="obelisk" visibility="hidden" transform="translate(385 168)"><polygon points="-5,0 -3,-58 0,-64 3,-58 5,0" fill="#c8664a"/></g>
      <g id="granary" visibility="hidden" transform="translate(20 166)"><path d="M-12 0 V-16 Q0 -32 12 -16 V0Z" fill="#d9b071"/></g>
      ${huts}${palms}
      <rect id="field" y="166" width="1200" height="70" fill="#3a2a1c"/>
      <rect y="166" width="1200" height="70" fill="url(#furrow)"/>
      <g id="folk">${folk}</g>
      <rect id="floodwater" y="236" width="1200" height="0" fill="#2c6fb5"/>
      <rect id="floodripple" y="236" width="1200" height="0" fill="url(#ripple)"/>
      <rect y="236" width="1200" height="64" fill="#1e58a0"/>
      <rect id="river" x="-36" y="236" width="1272" height="64" fill="url(#ripple)"/>
      <g id="barge" visibility="hidden"><path d="M-44 -12 Q0 8 44 -12 Q40 6 26 8 H-26 Q-40 6 -44 -12Z" fill="#7a4b24"/><path d="M0 -8 V-46" stroke="#3a2a1c" stroke-width="3"/><path d="M-24 -44 H24 V-16 H-24Z" fill="#f3ead6"/></g>
    </svg>`;
  }

  const SKY = { akhet: '#7fb6dd', peret: '#a5d4dd', shemu: '#f0cf8c' };
  const FIELD = { akhet: '#33261a', peret: '#3f9a58', shemu: '#d9ae37' };

  function drawScene(t) {
    const set = (id, attr, v) => { const e = $(id); if (e) e.setAttribute(attr, v); };
    const on = S.unl.seasons;
    const name = on ? K.season(S).id : 'shemu';
    const p = on ? S.yearT / K.yearLen(S) : 0.8;
    set('sky', 'fill', SKY[name]); set('field', 'fill', FIELD[name]);
    set('sun', 'cx', 60 + p * 1080);
    set('sun', 'cy', 118 - Math.sin(p * Math.PI) * 88);
    let level = 0;
    if (on && K.seasonIndex(S) === 0) { const q = p * 3; level = Math.sin(q * Math.PI) * Math.min(1, S.flood * 0.8); }
    const h = Math.max(0, level * 66);
    ['floodwater', 'floodripple'].forEach((id) => { set(id, 'y', 236 - h); set(id, 'height', h); });
    if (!calm) set('river', 'x', -36 + (t / 90 % 36));

    for (let i = 0; i < HUTS.length; i++) set('hut' + i, 'visibility', i < Math.min(HUTS.length, S.built.hut) ? 'visible' : 'hidden');
    const out = Math.round(Math.min(14, S.jobs.farmer)) * (level > 0.15 ? 0 : 1);
    for (let i = 0; i < 14; i++) set('folk' + i, 'visibility', i < out ? 'visible' : 'hidden');
    set('temple', 'visibility', S.built.temple ? 'visible' : 'hidden');
    set('obelisk', 'visibility', S.built.temple > 1 ? 'visible' : 'hidden');
    set('granary', 'visibility', S.built.granary ? 'visible' : 'hidden');
    MON.forEach((m, i) => {
      let f = 0;
      if (i < S.mon.tier) f = 1;
      else if (i === S.mon.tier && K.MONUMENTS[i]) f = S.mon.progress / K.MONUMENTS[i].size;
      set('mr' + i, 'y', -m.h * f); set('mr' + i, 'height', m.h * f);
    });
    const v = S.voyages[0];
    set('barge', 'visibility', v ? 'visible' : 'hidden');
    if (v) { const q = 1 - v.left / v.total; set('barge', 'transform', `translate(${60 + 1080 * (q < 0.5 ? q * 2 : 2 - q * 2)} 276)`); }
  }

  /* panels ----------------------------------------------------------- */
  function drawStores() {
    const r = K.rates(S);
    const rows = [];
    const row = (key, name, inner) => rows.push(`<li data-r="${key}"><span>${name}</span>${inner}</li>`);
    const cap = K.grainCap(S);
    const gNet = r.grain - r.eaten;
    const showCap = S.unl.seasons;
    row('grain', 'Grain', `<span class="amt">${fmt(S.res.grain)}${showCap ? `<span class="small"> / ${fmt(cap)}</span>` : ''}</span>
      ${r.grain || r.eaten ? `<span class="rate ${gNet < 0 ? 'neg' : ''}">${gNet >= 0 ? '+' : ''}${fmt(gNet)} a second</span>` : ''}
      ${showCap ? `<span class="cap-bar ${S.res.grain >= cap ? 'full' : ''}"><i style="width:${Math.min(100, S.res.grain / cap * 100)}%"></i></span>` : ''}`);
    if (S.unl.recruit && K.pop(S)) row('people', 'People', `<span class="amt">${K.pop(S)}<span class="small"> / ${K.popCap(S)}</span></span>`);
    const simple = (id, key) => { if (S.res[id] > 0 || r[key || id] > 0) row(id, K.RES[id].name, `<span class="amt">${fmt(S.res[id])}</span>${r[id] ? `<span class="rate">+${fmt(r[id])} a second</span>` : ''}`); };
    ['brick', 'stone', 'wisdom', 'favor', 'gold', 'cedar', 'incense'].forEach((x) => simple(x));
    let html = `<ul class="stores">${rows.join('')}</ul>`;
    if (S.unl.maat) {
      const m = K.mods(S);
      html += `<div class="maat"><div class="maat-head"><b>Ma'at</b><span>${Math.round(S.maat)}</span></div>
        <div class="maat-track"><i style="left:${S.maat}%"></i></div>
        <small>All output ×${m.maatM.toFixed(2)}. Settling toward ${Math.round(K.maatTarget(S))}.</small></div>`;
    }
    if (S.hungry) html += '<p class="warn" style="margin-top:12px">People are starving. Move workers to farming now.</p>';
    put($('stores'), html);
  }

  function drawSeasons() {
    const el = $('seasons');
    el.hidden = !S.unl.seasons;
    if (el.hidden) return;
    const i = K.seasonIndex(S);
    const segs = K.SEASONS.map((s, n) => `<div class="season-seg ${s.id} ${n === i ? 'on' : ''}"><b>${s.name}</b> <span>${s.gloss}</span></div>`).join('');
    let info = `Year ${S.year}. ${K.floodName(S.flood)} (${Math.round(S.flood * 100)}%).`;
    if (K.has(S, 'calendar')) info += ` Next: ${K.floodName(S.nextFlood)}.`;
    put(el, `<div class="season-track">${segs}<div class="season-pin" id="pin"></div></div><div class="flood-info">${info}</div>`);
    const pin = $('pin');
    if (pin) pin.style.left = (S.yearT / K.yearLen(S) * 100) + '%';
  }

  function tabsList() {
    const list = [['village', 'Village']];
    if (S.unl.scribes) list.push(['scribes', 'House of Life']);
    if (S.unl.gods) list.push(['gods', 'Temples']);
    if (S.unl.voyages) list.push(['voyages', 'Voyages']);
    if (S.unl.monument) list.push(['monument', 'Monument']);
    if (S.unl.afterlife || S.meta.dynasty > 1) list.push(['afterlife', 'Afterlife']);
    return list;
  }

  function drawTabs() {
    const list = tabsList();
    if (!list.some((t) => t[0] === tab)) tab = 'village';
    seenTabs.add(tab);
    const known = S.meta.tabsSeen || (S.meta.tabsSeen = {});
    known[tab] = 1;
    put($('tabs'), list.length < 2 ? '' : list.map(([id, label]) =>
      `<button class="tab ${!known[id] ? 'fresh' : ''}" role="tab" aria-selected="${id === tab}" data-act="tab:${id}">${label}</button>`).join(''));
  }

  function villageHTML() {
    let h = '';
    if (S.unl.recruit) {
      const label = S.unl.jobs ? 'Invite a family' : 'Hire a farmer';
      const full = K.pop(S) >= K.popCap(S);
      h += `<div class="row"><div><span class="t">${label}</span>
        <div class="c">${full ? `<span class="miss">No room. ${S.unl.jobs ? 'Build more houses.' : 'Keep working toward bricks.'}</span>` : `${costHTML({ grain: K.recruitCost(S) })}`}</div></div>
        <button class="btn" data-act="recruit" ${K.canRecruit(S) ? '' : 'disabled'}>${S.unl.jobs ? 'Invite' : 'Hire'}</button></div>`;
    }
    if (S.unl.jobs) {
      h += `<h3>Work</h3><p class="small">${S.jobs.idle ? `${S.jobs.idle} ${S.jobs.idle === 1 ? 'person needs' : 'people need'} a job.` : 'Everyone has a job.'}</p>`;
      const r = K.rates(S), m = K.mods(S);
      for (const id in K.JOBS) {
        if (!K.jobOpen(S, id)) continue;
        const J = K.JOBS[id];
        const full = id === 'priest' && S.jobs.priest >= K.priestCap(S);
        const each = id === 'farmer' ? J.rate * m.farm * m.global : id === 'builder' ? J.rate * m.build * m.global : J.rate * (m[J.makes] || 1) * m.global;
        const unit = J.makes === 'progress' ? 'of the monument' : K.RES[J.makes].name.toLowerCase();
        h += `<div class="row"><div><span class="t">${J.name}</span><span class="n">${S.jobs[id]}</span>${id === 'priest' ? `<span class="small"> of ${K.priestCap(S)}</span>` : ''}
          <div class="d">${J.note} Each makes ${fmt(each)} ${unit} a second${id === 'farmer' ? ' before the season' : ''}.</div></div>
          <div class="stepper"><button class="btn" aria-label="Remove one from ${J.name}" data-act="job:${id}:-1" ${S.jobs[id] ? '' : 'disabled'}>−</button>
          <button class="btn" aria-label="Add one to ${J.name}" data-act="job:${id}:1" ${S.jobs.idle && !full ? '' : 'disabled'}>+</button></div></div>`;
      }
      void r;
      const blds = Object.keys(K.BUILDINGS).filter((b) => K.buildVisible(S, b) && !K.buildMaxed(S, b));
      if (blds.length) {
        h += '<h3>Build</h3>';
        for (const id of blds) {
          const B = K.BUILDINGS[id], c = K.buildCost(S, id);
          h += `<div class="row"><div><span class="t">${B.name}</span>${S.built[id] ? `<span class="n">${S.built[id]}</span>` : ''}
            <div class="d">${B.note}</div><div class="c">${costHTML(c)}</div></div>
            <button class="btn" data-act="build:${id}" ${K.canPay(S, c) ? '' : 'disabled'}>Build</button></div>`;
        }
      }
    }
    return h;
  }

  function scribesHTML() {
    const list = Object.keys(K.TECHS).filter((t) => K.techVisible(S, t));
    const done = Object.keys(K.TECHS).filter((t) => K.has(S, t)).map((t) => K.TECHS[t].name);
    let h = '<h3>Study</h3><p class="small">Scribes earn wisdom over time. Spend it here.</p>';
    if (!list.length) h += '<p>Everything there is to know has been written down.</p>';
    for (const id of list) {
      const T = K.TECHS[id];
      h += `<div class="row"><div><span class="t">${T.name}</span><div class="d">${T.note}</div><div class="c">${costHTML({ wisdom: T.cost })}</div></div>
        <button class="btn" data-act="tech:${id}" ${S.res.wisdom >= T.cost ? '' : 'disabled'}>Study</button></div>`;
    }
    if (done.length) h += `<h3>Known</h3><p class="small">${done.join(', ')}.</p>`;
    return h;
  }

  function godsHTML() {
    let h = `<h3>Blessings</h3><p class="small">A blessing lasts one year. You may hold ${K.blessSlots(S)} at a time.</p>`;
    for (const id in K.GODS) {
      const G = K.GODS[id], left = S.bless[id];
      h += `<div class="row"><div><span class="t">${G.name}</span><div class="d">${G.note}</div>
        <div class="c">${left ? `Blessing you for ${clock(left)}` : costHTML({ favor: G.cost })}</div></div>
        <button class="btn ${left ? 'on' : ''}" data-act="bless:${id}" ${K.canBless(S, id) ? '' : 'disabled'}>${left ? 'Active' : 'Pray'}</button></div>`;
    }
    if (S.res.incense > 0 || S.unl.voyages) {
      h += `<h3>Offerings</h3><div class="row"><div><span class="t">Burn incense</span><div class="d">Ma'at rises by 8 at once.</div><div class="c">${costHTML({ incense: 5 })}</div></div>
        <button class="btn" data-act="incense" ${S.res.incense >= 5 ? '' : 'disabled'}>Burn</button></div>`;
    }
    return h;
  }

  function voyagesHTML() {
    let h = `<h3>Send ships</h3><p class="small">${S.voyages.length} of ${K.voyageSlots(S)} voyages at sea. Higher Ma'at means fewer ships lost.</p>`;
    for (const id in K.VOYAGES) {
      const D = K.VOYAGES[id];
      h += `<div class="row"><div><span class="t">${D.name}</span><div class="d">${D.note} About ${Math.round(D.amount * (1 + 0.1 * S.mon.done))} ${K.RES[D.gives].name.toLowerCase()} in ${clock(D.time * (K.has(S, 'navigation') ? 0.7 : 1))}.</div>
        <div class="c">${costHTML(D.cost)}</div></div>
        <button class="btn" data-act="voyage:${id}" ${K.canVoyage(S, id) ? '' : 'disabled'}>Sail</button></div>`;
    }
    if (S.voyages.length) {
      h += '<h3>At sea</h3>';
      for (const v of S.voyages) {
        h += `<p>${K.VOYAGES[v.id].name}, home in ${clock(v.left)}</p><div class="bar"><i style="width:${(1 - v.left / v.total) * 100}%"></i></div>`;
      }
    }
    return h;
  }

  function monumentHTML() {
    const M = K.MONUMENTS[S.mon.tier];
    let h = '';
    if (!M) return '<h3>All five monuments stand</h3><p>There is nothing left to build in this dynasty. The Afterlife tab can begin another.</p>';
    const r = K.rates(S);
    h += `<div class="mon-head"><h3>${M.name}</h3><span>${S.mon.tier + 1} of ${K.MONUMENTS.length}</span></div><p class="small">${M.note}</p>`;
    if (S.mon.started) {
      const frac = S.mon.progress / M.size;
      h += `<div class="bar tall green"><i style="width:${frac * 100}%"></i></div>
        <p>${fmt(S.mon.progress)} of ${fmt(M.size)} blocks laid. Each block uses 1 limestone.</p>
        <p class="small">Builders are laying ${fmt(r.progress)} blocks a second${K.seasonIndex(S) === 0 ? ', at their fast flood-season pace' : '. That rises sharply during the flood'}.</p>`;
      if (r.progress === 0) h += '<p class="warn">No one is building. Assign builders in the Village tab.</p>';
      else if (S.res.stone < 1) h += '<p class="warn">The site is out of limestone.</p>';
    } else {
      const c = K.monumentCost(S);
      h += `<p>${fmt(M.size)} blocks of limestone.${Object.keys(c).length ? ` Commissioning it costs ${costHTML(c)}.` : ''}</p>
        <button class="btn big-go" data-act="monument" ${K.canPay(S, c) ? '' : 'disabled'}>Begin the ${M.name}</button>`;
    }
    return h;
  }

  function afterlifeHTML() {
    let h = '';
    if (S.unl.afterlife) {
      const k = K.kaPreview(S);
      h += `<h3>Entomb the pharaoh</h3><p>This ends the dynasty. Your people, buildings and goods are lost, and your Ka stays.</p>
        <p style="margin-top:6px">Burial now would earn <b>${fmt(k.gain)} Ka</b>. ${k.pass ? `His heart is lighter than the feather of Ma'at.` : `<span class="miss">His heart would fail the weighing, because Ma'at is below ${k.threshold}. That halves the Ka.</span>`}</p>
        <button class="btn big-go" data-act="entomb">Entomb the pharaoh</button>`;
    } else {
      h += '<h3>Entomb the pharaoh</h3><p>Finish a monument in this dynasty to hold a burial.</p>';
    }
    h += `<h3>Ka: ${fmt(S.meta.ka)}</h3><p class="small">Ka survives every dynasty.</p>`;
    for (const id in K.PERKS) {
      const P = K.PERKS[id], n = K.perk(S, id), maxed = n >= P.max, c = K.perkCost(S, id);
      h += `<div class="row"><div><span class="t">${P.name}</span>${n ? `<span class="n">${n}</span>` : ''}<div class="d">${P.note}</div>
        <div class="c">${maxed ? 'Complete' : `<span class="${S.meta.ka < c ? 'miss' : ''}">${c} Ka</span>`}</div></div>
        <button class="btn" data-act="perk:${id}" ${!maxed && S.meta.ka >= c ? '' : 'disabled'}>Gain</button></div>`;
    }
    const autos = [['vizier', 'Vizier invites people and builds houses'], ['highPriest', 'High priest renews your blessings'], ['treasurer', 'Treasurer resends your last voyage']].filter((a) => K.perk(S, a[0]));
    if (autos.length) {
      h += '<h3>Automatic settings</h3>';
      for (const [id, label] of autos) h += `<div class="row"><span>${label}</span><button class="btn ${S.auto[id] ? 'on' : ''}" data-act="auto:${id}">${S.auto[id] ? 'On' : 'Off'}</button></div>`;
    }
    return h;
  }

  const PANELS = { village: villageHTML, scribes: scribesHTML, gods: godsHTML, voyages: voyagesHTML, monument: monumentHTML, afterlife: afterlifeHTML };

  function drawEvent() {
    if (!S.event) return put($('event'), '');
    const e = K.EVENTS.find((x) => x.id === S.event.id);
    put($('event'), `<div class="event"><h3>${e.title}</h3><p>${e.text}</p><div class="opts">${e.options.map((o, i) =>
      `<button data-act="answer:${i}">${o.label}<small>${o.hint}</small></button>`).join('')}</div>
      <p class="tleft">If you say nothing, the last choice happens in ${clock(S.event.t)}.</p></div>`);
  }

  function drawLog() {
    put($('log'), S.log.slice(0, 40).map((l) => `<li class="${l.kind}"><span class="y">Year ${l.y}</span>${esc(l.msg)}</li>`).join(''));
  }

  function draw() {
    if (S.unl.recruit && document.body.classList.contains('opening')) {
      document.body.classList.remove('opening');
      $('mid').hidden = false; $('right').hidden = false; $('intro').hidden = true;
    }
    if (!S.unl.recruit) { document.body.classList.add('opening'); $('mid').hidden = true; $('right').hidden = true; $('intro').hidden = false; }
    $('dynasty-line').textContent = `${K.ordinal(S.meta.dynasty)} dynasty`;
    drawStores(); drawSeasons(); drawEvent();
    if (S.unl.recruit) { drawTabs(); put($('panel'), PANELS[tab]()); drawLog(); }
    if (S.justWon) { S.justWon = false; showEnding(); }
  }

  /* burial and ending ------------------------------------------------ */
  function scalesSVG(heavy) {
    return `<svg viewBox="0 0 400 230" role="img" aria-label="A heart and a feather on a balance scale">
      <rect x="196" y="60" width="8" height="150" fill="#efbd33"/><rect x="150" y="208" width="100" height="10" fill="#efbd33"/>
      <g class="beam" id="beam"><rect x="60" y="56" width="280" height="8" fill="#efbd33"/>
        <path d="M70 62 L44 130 H96Z M330 62 L304 130 H356Z" fill="none" stroke="#f3ead6" stroke-width="1.5"/>
        <path d="M70 126 c-16 -18 -22 -28 -12 -34 c6 -3 11 1 12 5 c1 -4 6 -8 12 -5 c10 6 4 16 -12 34Z" fill="${heavy ? '#e0694a' : '#c8402a'}"/>
        <path d="M330 126 Q344 104 330 84 Q318 104 330 126Z" fill="#f3ead6"/><path d="M330 126 V84" stroke="#10244a"/>
      </g></svg>`;
  }

  function entombNow() {
    const out = K.entomb(S);
    if (!out) return;
    const heavy = !out.result.pass;
    const d = $('weigh');
    d.innerHTML = `<h2>The weighing of the heart</h2>${scalesSVG(heavy)}
      <p class="big">${heavy ? 'The heart is heavy' : 'The heart is light'}</p>
      <p>${heavy ? `Ma'at stood at only ${Math.round(out.maat)}. Half the Ka was lost.` : `Ma'at stood at ${Math.round(out.maat)}. The pharaoh walks on to the Field of Reeds.`}</p>
      <p>You gained <b>${fmt(out.result.gain)} Ka</b>.</p>
      <button class="btn" data-weigh="go">Begin the ${K.ordinal(out.state.meta.dynasty)} dynasty</button>`;
    d.showModal();
    requestAnimationFrame(() => requestAnimationFrame(() => { $('beam').style.transform = `rotate(${heavy ? -9 : 9}deg)`; }));
    S = out.state;
    tab = 'afterlife';
    save();
  }

  function showEnding() {
    const d = $('weigh');
    const hours = S.meta.wonAt / 3600;
    d.innerHTML = `<h2>The Great Pyramid stands</h2>
      <p class="big">The horizon of Khufu</p>
      <p>You began with one plot of black earth. It took ${S.meta.dynasty} ${S.meta.dynasty === 1 ? 'dynasty' : 'dynasties'} and ${hours >= 1 ? hours.toFixed(1) + ' hours' : Math.ceil(S.meta.wonAt / 60) + (S.meta.wonAt <= 60 ? ' minute' : ' minutes')} of play.</p>
      <p>The game keeps running if you want to raise it again faster.</p>
      <button class="btn" data-weigh="go">Return to the valley</button>`;
    d.showModal();
  }

  /* saving ------------------------------------------------------------ */
  function save() {
    S.savedAt = Date.now();
    try { localStorage.setItem(SAVE_KEY, K.serialize(S)); } catch (e) { /* private window: play on without saves */ }
  }
  function load() {
    let raw = null;
    try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { /* no storage available */ }
    if (!raw) { S = K.newGame(); return; }
    try { S = K.deserialize(raw); } catch (e) { S = K.newGame(); return; }
    const away = (Date.now() - (S.savedAt || Date.now())) / 1000;
    if (away > 60 && S.unl.recruit) {
      const r = K.offline(S, away, Math.random);
      const list = Object.keys(r.gained).map((k) => `${fmt(r.gained[k])} ${K.RES[k].name.toLowerCase()}`).join(', ');
      S.log.unshift({ y: S.year, msg: `While you were away, ${r.years} ${r.years === 1 ? 'year' : 'years'} passed${list ? `. Your people gathered ${list}` : ''}.`, kind: 'new' });
    }
  }

  /* input ------------------------------------------------------------- */
  function act(a) {
    const [k, x, y] = a.split(':');
    if (k === 'tab') tab = x;
    else if (k === 'recruit') K.recruit(S);
    else if (k === 'job') K.assign(S, x, +y);
    else if (k === 'build') K.build(S, x);
    else if (k === 'tech') K.research(S, x);
    else if (k === 'bless') K.bless(S, x);
    else if (k === 'incense') K.burnIncense(S);
    else if (k === 'voyage') K.sendVoyage(S, x);
    else if (k === 'monument') K.startMonument(S);
    else if (k === 'entomb') entombNow();
    else if (k === 'perk') K.buyPerk(S, x);
    else if (k === 'auto') S.auto[x] = !S.auto[x];
    else if (k === 'answer') K.answer(S, +x);
    pressing = false;
    draw();
  }

  document.addEventListener('pointerdown', (e) => { if (e.target.closest('[data-act]')) pressing = true; });
  ['pointerup', 'pointercancel'].forEach((n) => document.addEventListener(n, () => setTimeout(() => { pressing = false; }, 0)));
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b && !b.disabled) act(b.dataset.act);
    if (e.target.closest('[data-weigh]')) { $('weigh').close(); draw(); }
  });

  $('reap').addEventListener('click', (e) => {
    const n = K.reap(S);
    if (!calm) {
      const f = document.createElement('span');
      f.className = 'float'; f.textContent = '+' + fmt(n);
      f.style.marginLeft = (e.offsetX ? e.offsetX - e.currentTarget.offsetWidth / 2 : 0) + 'px';
      e.currentTarget.parentNode.appendChild(f);
      setTimeout(() => f.remove(), 800);
    }
    draw();
  });

  let resetArmed = false;
  $('menu-btn').addEventListener('click', () => { $('menu-msg').textContent = ''; $('save-code').value = ''; resetArmed = false; document.querySelector('[data-menu="reset"]').textContent = 'Erase my game'; $('menu').showModal(); });
  $('menu').addEventListener('click', (e) => {
    const m = e.target.dataset && e.target.dataset.menu;
    if (!m) return;
    const msg = $('menu-msg');
    if (m === 'close') $('menu').close();
    if (m === 'export') { save(); $('save-code').value = btoa(unescape(encodeURIComponent(K.serialize(S)))); $('save-code').select(); msg.textContent = 'Copy this code somewhere safe.'; }
    if (m === 'import') {
      try { S = K.deserialize(decodeURIComponent(escape(atob($('save-code').value.trim())))); save(); tab = 'village'; msg.textContent = 'Save loaded.'; draw(); }
      catch (err) { msg.textContent = 'That code could not be read. Paste the whole code and try again.'; }
    }
    if (m === 'reset') {
      if (!resetArmed) { resetArmed = true; e.target.textContent = 'Erase everything for good'; msg.textContent = 'All dynasties and Ka will be lost. Press again to confirm.'; return; }
      S = K.newGame(); tab = 'village'; save(); $('menu').close(); draw();
    }
  });

  /* main loop --------------------------------------------------------- */
  let last = performance.now(), acc = 0, lastDraw = 0;
  function frame(t) {
    const dt = Math.min(1, (t - last) / 1000); last = t; acc += dt;
    while (acc >= 0.1) { K.step(S, 0.1, Math.random); acc -= 0.1; }
    if (t - lastDraw > 200) { draw(); lastDraw = t; }
    drawScene(t);
    requestAnimationFrame(frame);
  }
  // Hidden tabs throttle rAF, so catch up when the player returns.
  let hiddenAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenAt = Date.now(); save(); }
    else if (hiddenAt) {
      const away = (Date.now() - hiddenAt) / 1000; hiddenAt = 0;
      if (away > 3 && S.unl.recruit) K.offline(S, away, Math.random);
      last = performance.now();
    }
  });
  window.addEventListener('beforeunload', save);
  setInterval(save, 8000);

  load();
  buildScene();
  draw();
  requestAnimationFrame(frame);
  window.__kemet = { get S() { return S; }, set S(v) { S = v; }, draw, save };
})();
