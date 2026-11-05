/* Kemet: game rules. No DOM in this file, so it can be simulated headlessly. */
(function (root) {
  'use strict';

  const YEAR = 120; // seconds per year at normal speed
  const SEASONS = [
    { id: 'akhet', name: 'Akhet', gloss: 'the flood', farm: 0.25 },
    { id: 'peret', name: 'Peret', gloss: 'the growing', farm: 1 },
    { id: 'shemu', name: 'Shemu', gloss: 'the harvest', farm: 2.2 },
  ];

  const RES = {
    grain: { name: 'Grain' }, brick: { name: 'Mud brick' }, stone: { name: 'Limestone' },
    wisdom: { name: 'Wisdom' }, favor: { name: 'Favor' },
    gold: { name: 'Gold' }, cedar: { name: 'Cedar' }, incense: { name: 'Incense' },
  };

  const JOBS = {
    farmer: { name: 'Farmers', makes: 'grain', rate: 0.6, note: 'Work the black earth. Output follows the seasons and the flood.' },
    brickmaker: { name: 'Brickmakers', makes: 'brick', rate: 0.3, note: 'Shape Nile mud into bricks.' },
    quarryman: { name: 'Quarrymen', makes: 'stone', rate: 0.16, note: 'Cut limestone from the desert cliffs.' },
    scribe: { name: 'Scribes', makes: 'wisdom', rate: 0.14, note: 'Record, count and study.' },
    priest: { name: 'Priests', makes: 'favor', rate: 0.07, note: 'Tend the temples. Each one also steadies Ma\'at.' },
    builder: { name: 'Builders', makes: 'progress', rate: 0.14, note: 'Raise the monument. They work far faster during the flood, when farmers join them.' },
  };

  const BUILDINGS = {
    hut: { name: 'Mud-brick house', cost: { brick: 12 }, grow: 1.2, note: '+3 room for people' },
    granary: { name: 'Granary', cost: { brick: 20 }, grow: 1.28, note: '+500 grain storage' },
    shaduf: { name: 'Shaduf', cost: { brick: 25, grain: 100 }, grow: 1.32, note: '+8% farming, and softens low floods' },
    workshop: { name: 'Workshop', cost: { brick: 60, stone: 30 }, grow: 1.35, note: '+12% brick and limestone', needs: 'chisels' },
    houseOfLife: { name: 'House of Life', cost: { brick: 40, stone: 20 }, once: true, note: 'A school for scribes' },
    temple: { name: 'Temple', cost: { brick: 150, stone: 90 }, grow: 1.45, note: 'Room for 4 priests, and raises Ma\'at', needs: 'rites' },
    quay: { name: 'Royal quay', cost: { brick: 220, stone: 120 }, once: true, note: 'Launches voyages abroad', needs: 'barges' },
    fleet: { name: 'Cedar fleet', cost: { cedar: 40, brick: 300 }, grow: 2, max: 3, note: '+1 voyage at a time', needs: 'barges', needsBuilt: 'quay' },
    barque: { name: 'Solar barque', cost: { cedar: 80, gold: 40 }, once: true, note: '+1 blessing at a time', needs: 'rites', needsBuilt: 'quay' },
  };

  const TECHS = {
    canals: { name: 'Irrigation canals', cost: 12, note: '+30% farming' },
    moulds: { name: 'Brick moulds', cost: 15, note: '+40% brick' },
    chisels: { name: 'Copper chisels', cost: 22, note: '+40% limestone, unlocks workshops' },
    calendar: { name: 'Calendar', cost: 28, note: 'Foretells the next flood, and adds 500 grain storage' },
    rites: { name: 'Temple rites', cost: 40, note: 'Unlocks temples, priests and blessings', req: 'calendar' },
    geometry: { name: 'Geometry', cost: 55, note: 'Unlocks monuments and builders', req: 'chisels' },
    plough: { name: 'Ox plough', cost: 70, note: '+35% farming', req: 'canals' },
    barges: { name: 'River barges', cost: 90, note: 'Unlocks the royal quay and voyages', req: 'geometry' },
    medicine: { name: 'Medicine', cost: 120, note: 'People eat 20% less' },
    dikes: { name: 'Dikes', cost: 140, note: 'Great floods no longer destroy houses', req: 'canals' },
    ramps: { name: 'Sledges and ramps', cost: 220, note: '+50% building speed', req: 'geometry' },
    astronomy: { name: 'Astronomy', cost: 320, note: 'Floods average 10% better', req: 'calendar' },
    papyrusRolls: { name: 'Papyrus archives', cost: 420, note: '+50% wisdom' },
    navigation: { name: 'Star navigation', cost: 520, note: 'Voyages return 30% sooner and fail half as often', req: 'barges' },
    embalming: { name: 'Embalming', cost: 700, note: '+25% Ka from every burial', req: 'rites' },
    bronze: { name: 'Bronze tools', cost: 1200, note: '+50% limestone and brick', req: 'chisels' },
    deadBook: { name: 'Book of the Dead', cost: 2000, note: 'The heart passes at Ma\'at 35 instead of 50', req: 'embalming' },
  };

  const GODS = {
    hapi: { name: 'Hapi', cost: 18, note: 'God of the flood. Flood quality +30%.' },
    thoth: { name: 'Thoth', cost: 22, note: 'God of writing. Wisdom doubled.' },
    ptah: { name: 'Ptah', cost: 30, note: 'God of craftsmen. Brick, limestone and building +50%.' },
    hathor: { name: 'Hathor', cost: 26, note: 'Goddess of joy. People eat 40% less, and Ma\'at rises.' },
    ra: { name: 'Ra', cost: 60, note: 'The sun. All output +25%.' },
  };

  const VOYAGES = {
    nubia: { name: 'Nubia', gives: 'gold', amount: 14, time: 180, cost: { grain: 800, brick: 80 }, note: 'South past the cataracts, for gold.' },
    byblos: { name: 'Byblos', gives: 'cedar', amount: 22, time: 220, cost: { grain: 1000, stone: 60 }, note: 'North by sea, for cedar.' },
    punt: { name: 'Punt', gives: 'incense', amount: 18, time: 300, cost: { grain: 1500, brick: 120 }, note: 'The far Red Sea coast, for incense.' },
  };

  const MONUMENTS = [
    { id: 'mastaba', name: 'Mastaba', size: 160, ka: 6, cost: {}, note: 'A flat brick-faced bench over a burial shaft.' },
    { id: 'step', name: 'Step Pyramid', size: 900, ka: 16, cost: {}, note: 'Six mastabas stacked toward the sky.' },
    { id: 'bent', name: 'Bent Pyramid', size: 3200, ka: 42, cost: { cedar: 40 }, note: 'The angle changes halfway up. Nobody will mention it.' },
    { id: 'red', name: 'Red Pyramid', size: 14000, ka: 100, cost: { cedar: 80, gold: 60 }, note: 'The first true smooth-sided pyramid.' },
    { id: 'great', name: 'Great Pyramid', size: 70000, ka: 260, cost: { gold: 220, incense: 140, cedar: 120 }, note: 'The tallest thing people will build for nearly four thousand years.' },
  ];

  const PERKS = {
    labour: { name: 'Eternal labour', base: 3, grow: 1.7, max: 12, note: '+25% all output' },
    seed: { name: 'Royal seed grain', base: 2, grow: 1.8, max: 6, note: 'Start each dynasty with more grain and bricks' },
    heirs: { name: 'Many heirs', base: 3, grow: 1.8, max: 6, note: 'Start with 3 more people, with homes for them' },
    memory: { name: 'Scribal memory', base: 5, grow: 2, max: 5, note: 'Keep the 4 cheapest techs per level' },
    hapiFavor: { name: 'Favored of Hapi', base: 6, grow: 2, max: 3, note: 'Bad floods are 15% milder per level' },
    swiftSun: { name: 'Swift sun', base: 8, grow: 2.2, max: 3, note: 'Years pass 15% faster per level' },
    ankh: { name: 'Ankh of balance', base: 6, grow: 2, max: 3, note: 'Ma\'at settles 8 points higher per level' },
    vizier: { name: 'Vizier', base: 10, max: 1, note: 'Adds an automatic setting: invite people and build houses' },
    highPriest: { name: 'High priest', base: 18, max: 1, note: 'Adds an automatic setting: renew your blessings' },
    treasurer: { name: 'Treasurer', base: 24, max: 1, note: 'Adds an automatic setting: resend your last voyage' },
  };

  const EVENTS = [
    { id: 'locusts', title: 'Locusts on the wind', text: 'A dark cloud is moving up the valley. Smoke fires might turn it, at the cost of stored grain.',
      when: (S) => S.res.grain > 60,
      options: [
        { label: 'Burn smoke fires', hint: 'Lose 20% of your grain', run: (S) => { S.res.grain *= 0.8; return 'The swarm turned east over the desert.'; } },
        { label: 'Let them pass', hint: 'This year\'s crop falls 40%', run: (S) => { S.fx.locust = 1; return 'The locusts settled on the fields for three days.'; } },
      ] },
    { id: 'strike', title: 'The workers lay down their tools', text: 'Their rations are late. They are sitting in the temple forecourt and will not move.',
      when: (S) => S.jobs.builder + S.jobs.quarryman >= 4,
      options: [
        { label: 'Pay the rations', hint: 'Lose 25% of your grain, Ma\'at +6', run: (S) => { S.res.grain *= 0.75; addMaat(S, 6); return 'Rations were paid in full and work resumed.'; } },
        { label: 'Refuse', hint: 'Ma\'at −10, limestone halved this year', run: (S) => { addMaat(S, -10); S.fx.strike = 1; return 'The strike dragged on through the season.'; } },
      ] },
    { id: 'apis', title: 'The Apis bull is found', text: 'Priests have found a black calf with a white mark on its brow. The people expect a feast.',
      when: (S) => S.unl.maat,
      options: [
        { label: 'Hold the feast', hint: 'Lose 30% of your grain, Ma\'at +12', run: (S) => { S.res.grain *= 0.7; addMaat(S, 12); return 'The whole district ate well for a week.'; } },
        { label: 'A modest offering', hint: 'Ma\'at +2', run: (S) => { addMaat(S, 2); return 'The bull was stabled quietly at Memphis.'; } },
      ] },
    { id: 'traders', title: 'Traders from the south', text: 'A caravan offers finished limestone blocks in exchange for grain.',
      when: (S) => S.unl.quarry && S.res.grain > 200,
      options: [
        { label: 'Trade', hint: '30% of your grain buys limestone', run: (S) => { const g = S.res.grain * 0.3; S.res.grain -= g; addRes(S, 'stone', g * 0.12); return 'The blocks were stacked by the quay road.'; } },
        { label: 'Send them on', hint: 'Nothing changes', run: () => 'The caravan moved on to Thebes.' },
      ] },
    { id: 'robbers', title: 'Tomb robbers caught', text: 'Three men were found in an old burial with a bag of gilded amulets.',
      when: (S) => S.unl.maat && S.year > 6,
      options: [
        { label: 'Punish them', hint: 'Ma\'at +7', run: (S) => { addMaat(S, 7); return 'The law was upheld before the whole town.'; } },
        { label: 'Put them to work', hint: 'Gain a person, Ma\'at −5', run: (S) => { S.jobs.idle += 1; addMaat(S, -5); return 'The men were sent to the quarry gang.'; } },
      ] },
    { id: 'omen', title: 'Sirius rises early', text: 'The priests ask for a gift to Hapi before the river turns.',
      when: (S) => S.unl.maat && S.res.grain > 100,
      options: [
        { label: 'Give the gift', hint: 'Lose 15% of your grain, a better next flood', run: (S) => { S.res.grain *= 0.85; S.nextFlood = Math.min(1.3, S.nextFlood + 0.25); return 'Offerings were cast into the river at dawn.'; } },
        { label: 'Decline', hint: 'Nothing changes', run: () => 'The priests went home unhappy.' },
      ] },
    { id: 'scribe', title: 'A clever young scribe', text: 'A farmer\'s son has been teaching himself the signs on broken pottery.',
      when: (S) => S.built.houseOfLife > 0,
      options: [
        { label: 'Sponsor him', hint: 'Lose 10% of your grain, gain wisdom', run: (S) => { S.res.grain *= 0.9; addRes(S, 'wisdom', 12 + S.jobs.scribe * 3); return 'He copied the old texts in a fine, quick hand.'; } },
        { label: 'Send him back to the fields', hint: 'Nothing changes', run: () => 'His broken pots were swept away.' },
      ] },
  ];

  function freshRun(meta) {
    const p = meta.perks;
    const S = {
      meta, dynasty: meta.dynasty, year: 1, yearT: 0, runTime: 0,
      res: { grain: 0, brick: 0, stone: 0, wisdom: 0, favor: 0, gold: 0, cedar: 0, incense: 0 },
      lifetime: { grain: 0, brick: 0, stone: 0 },
      jobs: { idle: 0, farmer: 0, brickmaker: 0, quarryman: 0, scribe: 0, priest: 0, builder: 0 },
      built: {}, techs: {}, unl: {}, maat: 50, flood: 1, nextFlood: 1, floodSeen: 0,
      bless: {}, voyages: [], lastVoyage: null, mon: { tier: 0, progress: 0, started: false, done: 0 },
      fx: {}, event: null, eventCd: 0, hungry: false, hungerT: 0, famineDays: 0, log: [], auto: {},
    };
    for (const id in BUILDINGS) S.built[id] = 0;
    const seed = p.seed || 0;
    S.res.grain = seed ? 200 * Math.pow(3, seed - 1) : 0;
    S.res.brick = seed ? 40 * Math.pow(3, seed - 1) : 0;
    const heirs = (p.heirs || 0) * 3;
    S.jobs.farmer = heirs; S.bonusCap = heirs;
    const keep = (p.memory || 0) * 4;
    Object.keys(TECHS).sort((a, b) => TECHS[a].cost - TECHS[b].cost).slice(0, keep).forEach((t) => { S.techs[t] = 1; });
    S.res.grain += heirs * 30;
    if (meta.dynasty > 1) { S.unl.recruit = true; }
    return S;
  }

  function newGame() {
    return freshRun({ v: 1, dynasty: 1, ka: 0, kaTotal: 0, perks: {}, seen: {}, won: false, wonAt: 0, playTime: 0, best: -1, clicks: 0 });
  }

  const pop = (S) => Object.values(S.jobs).reduce((a, b) => a + b, 0);
  const has = (S, t) => !!S.techs[t];
  const perk = (S, id) => S.meta.perks[id] || 0;
  const yearLen = (S) => YEAR * (1 - 0.15 * perk(S, 'swiftSun'));
  const seasonIndex = (S) => Math.min(2, Math.floor(S.yearT / yearLen(S) * 3));
  const season = (S) => SEASONS[seasonIndex(S)];
  const log = (S, msg, kind) => { S.log.unshift({ y: S.year, msg, kind: kind || '' }); if (S.log.length > 60) S.log.length = 60; };

  function grainCap(S) { return 250 + 500 * S.built.granary + (has(S, 'calendar') ? 500 : 0) + 250 * perk(S, 'seed'); }
  function popCap(S) { return 6 + 3 * S.built.hut + (S.bonusCap || 0); }
  function priestCap(S) { return 4 * S.built.temple; }
  function blessSlots(S) { return 1 + S.built.barque; }
  function voyageSlots(S) { return 1 + S.built.fleet; }

  function addRes(S, r, n) {
    S.res[r] += n;
    if (r === 'grain' && S.res.grain > grainCap(S)) S.res.grain = grainCap(S);
    if (S.lifetime[r] !== undefined && n > 0) S.lifetime[r] += n;
  }
  function addMaat(S, n) { S.maat = Math.max(0, Math.min(100, S.maat + n)); }

  function mods(S) {
    const b = S.bless;
    const maatM = S.unl.maat ? 0.7 + S.maat / 100 * 0.6 : 1;
    const g = maatM * (1 + 0.15 * S.mon.done) * (1 + 0.25 * perk(S, 'labour')) * (b.ra ? 1.25 : 1);
    const ptah = b.ptah ? 1.5 : 1;
    const shop = 1 + 0.12 * S.built.workshop;
    return {
      global: g, maatM,
      farm: (1 + 0.08 * S.built.shaduf) * (has(S, 'canals') ? 1.3 : 1) * (has(S, 'plough') ? 1.35 : 1),
      brick: shop * ptah * (has(S, 'moulds') ? 1.4 : 1) * (has(S, 'bronze') ? 1.5 : 1),
      stone: shop * ptah * (has(S, 'chisels') ? 1.4 : 1) * (has(S, 'bronze') ? 1.5 : 1) * (S.fx.strike ? 0.5 : 1),
      wisdom: (b.thoth ? 2 : 1) * (has(S, 'papyrusRolls') ? 1.5 : 1),
      favor: 1 + 0.1 * S.built.temple,
      build: ptah * (has(S, 'ramps') ? 1.5 : 1) * (seasonIndex(S) === 0 ? 2.5 : 1),
      eat: 0.12 * (has(S, 'medicine') ? 0.8 : 1) * (b.hathor ? 0.6 : 1),
    };
  }

  function floodEffect(S) {
    let q = S.flood + (S.bless.hapi ? 0.3 : 0);
    if (q < 1) {
      const soft = Math.min(0.6, 0.1 * S.built.shaduf) + 0.15 * perk(S, 'hapiFavor');
      q = 1 - (1 - q) * Math.max(0, 1 - soft);
    }
    return q;
  }

  function seasonFarmMult(S) {
    if (!S.unl.seasons) return 1;
    const i = seasonIndex(S);
    return SEASONS[i].farm * (i === 0 ? 1 : floodEffect(S)) * (S.fx.locust ? 0.6 : 1);
  }

  function rates(S) {
    const m = mods(S), j = S.jobs;
    const out = {
      grain: j.farmer * JOBS.farmer.rate * m.farm * seasonFarmMult(S) * m.global,
      brick: j.brickmaker * JOBS.brickmaker.rate * m.brick * m.global,
      stone: j.quarryman * JOBS.quarryman.rate * m.stone * m.global,
      wisdom: j.scribe * JOBS.scribe.rate * m.wisdom * m.global,
      favor: j.priest * JOBS.priest.rate * m.favor * m.global,
      progress: j.builder * JOBS.builder.rate * m.build * m.global,
    };
    out.eaten = S.unl.eat ? pop(S) * m.eat : 0;
    return out;
  }

  function maatTarget(S) {
    let t = 42 + Math.min(36, S.jobs.priest * 4) + S.built.temple * 2 + perk(S, 'ankh') * 8;
    if (S.bless.hathor) t += 12;
    if (S.fx.locust) t -= 8;
    if (S.hungry) t = 0;
    return Math.min(100, t);
  }

  function rollFlood(S, rng) {
    const r = (rng() + rng() + rng()) / 3;
    let q = 0.55 + r * 0.95 + (has(S, 'astronomy') ? 0.1 : 0);
    return Math.max(0.5, Math.min(1.5, q));
  }

  function floodName(q) {
    if (q < 0.8) return 'Low Nile';
    if (q < 0.95) return 'Thin flood';
    if (q <= 1.2) return 'Good flood';
    if (q <= 1.32) return 'Rich flood';
    return 'Great flood';
  }

  function startYear(S, rng, offline) {
    S.year += 1;
    S.fx = {};
    S.flood = S.nextFlood;
    S.nextFlood = rollFlood(S, rng);
    S.floodSeen += 1;
    if (!offline) log(S, `${floodName(S.flood)}: the river stands at ${Math.round(S.flood * 100)}% of its usual height.`, S.flood < 0.8 ? 'bad' : '');
    if (S.flood > 1.32 && !has(S, 'dikes') && S.built.hut > 0) {
      S.built.hut -= 1;
      if (!offline) log(S, 'The water reached the village. One house collapsed.', 'bad');
    }
    if (!offline && S.unl.maat && !S.event && rng() < 0.55) {
      const pool = EVENTS.filter((e) => e.when(S) && e.id !== S.lastEvent);
      if (pool.length) { const e = pool[Math.floor(rng() * pool.length)]; S.event = { id: e.id, t: 60 }; S.lastEvent = e.id; }
    }
  }

  function unlock(S, key, msg) {
    if (S.unl[key]) return;
    S.unl[key] = true;
    S.newest = key;
    if (!S.meta.seen[key]) { S.meta.seen[key] = 1; if (msg) log(S, msg, 'new'); S.fresh = key; }
  }

  function checkUnlocks(S) {
    const L = S.lifetime, n = pop(S);
    if (L.grain >= 8) unlock(S, 'recruit', 'A neighbor offers to work your field for a share of the grain.');
    if (L.grain >= 40 || S.meta.dynasty > 1) unlock(S, 'seasons', 'The star Sirius rises before dawn, and the Nile begins to swell. From now on the year turns through three seasons. Harvest is rich, and the flood yields little.');
    if (n >= 5 || S.meta.dynasty > 1) unlock(S, 'eat', 'Your workers now eat from the grain store. Each mouth costs a little grain, all year round.');
    if (L.grain >= 200 || S.meta.dynasty > 1) unlock(S, 'jobs', 'Nile mud can be shaped into bricks. You can now choose what each person does.');
    if (S.built.hut >= 2) unlock(S, 'quarry', 'There is good limestone in the desert cliffs. You can now send quarrymen.');
    if (L.stone >= 8) unlock(S, 'hol', 'Records are outgrowing memory. A House of Life would train scribes.');
    if (S.built.houseOfLife) unlock(S, 'scribes', 'The House of Life is open. Scribes earn wisdom, which you spend on new knowledge.');
    if (S.unl.scribes && (S.year >= 3 || n >= 14)) unlock(S, 'maat', 'Ma\'at, the balance of the world, now shapes your realm. High Ma\'at lifts all output. Famine and unrest wear it down.');
    if (has(S, 'rites')) unlock(S, 'rites', 'You may now raise temples to the gods.');
    if (S.built.temple) unlock(S, 'gods', 'Priests have entered the first temple. Their favor can buy a god\'s blessing for a year.');
    if (has(S, 'geometry')) unlock(S, 'monument', 'Your scribes can now plan a tomb worthy of a king. Every pharaoh must be buried in something.');
    if (S.built.quay) unlock(S, 'voyages', 'The royal quay is finished. Ships can now sail for goods Egypt lacks.');
    if (S.mon.done >= 1) unlock(S, 'afterlife', 'A tomb stands ready. When you choose, the pharaoh may be entombed and his heart weighed, beginning a new dynasty stronger than the last.');
  }

  function step(S, dt, rng, offline) {
    S.runTime += dt; S.meta.playTime += dt;
    if (S.unl.seasons) {
      S.yearT += dt;
      if (S.yearT >= yearLen(S)) { S.yearT -= yearLen(S); startYear(S, rng, offline); }
    }
    const r = rates(S);
    addRes(S, 'brick', r.brick * dt);
    addRes(S, 'stone', r.stone * dt);
    addRes(S, 'wisdom', r.wisdom * dt);
    addRes(S, 'favor', r.favor * dt);

    // food
    addRes(S, 'grain', r.grain * dt);
    const need = r.eaten * dt;
    if (S.res.grain >= need) {
      S.res.grain -= need;
      if (S.hungry) { S.hungry = false; if (!offline) log(S, 'Grain is reaching the villages again.'); }
    } else {
      S.res.grain = 0;
      if (!offline) {
        if (!S.hungry) { S.hungry = true; S.hungerT = 0; log(S, 'The grain store is empty. People are going hungry.', 'bad'); }
        S.famineDays += dt; S.hungerT += dt;
        if (S.hungerT > 8) {
          S.hungerT = 0;
          const order = ['idle', 'builder', 'priest', 'scribe', 'quarryman', 'brickmaker', 'farmer'];
          const j = order.find((k) => S.jobs[k] > 0 && (k !== 'farmer' || S.jobs.farmer > 1));
          if (j) { S.jobs[j] -= 1; log(S, 'A family has left to find food upriver.', 'bad'); }
        }
      }
    }

    // ma'at
    if (S.unl.maat) {
      const t = maatTarget(S);
      S.maat += (t - S.maat) * Math.min(1, dt * (S.hungry ? 0.03 : 0.012));
    }

    // monument
    if (S.mon.started && S.mon.tier < MONUMENTS.length) {
      const M = MONUMENTS[S.mon.tier];
      const adv = Math.min(r.progress * dt, S.res.stone, M.size - S.mon.progress);
      if (adv > 0) { S.res.stone -= adv; S.mon.progress += adv; }
      if (S.mon.progress >= M.size - 1e-6) {
        S.mon.done += 1; S.mon.tier += 1; S.mon.progress = 0; S.mon.started = false;
        S.meta.best = Math.max(S.meta.best, S.mon.tier - 1);
        log(S, `The ${M.name} is complete. All output rises by 15% for the rest of this dynasty.`, 'new');
        if (M.id === 'great' && !S.meta.won) { S.meta.won = true; S.meta.wonAt = S.meta.playTime; S.justWon = true; }
      }
    }

    // blessings
    for (const g in S.bless) { S.bless[g] -= dt; if (S.bless[g] <= 0) delete S.bless[g]; }

    // voyages
    for (const v of S.voyages) v.left -= dt;
    for (const v of S.voyages.filter((x) => x.left <= 0)) {
      const D = VOYAGES[v.id];
      if (v.lost) log(S, `The ships for ${D.name} never came back.`, 'bad');
      else {
        const amt = Math.round(D.amount * (1 + 0.1 * S.mon.done) * (0.85 + rng() * 0.3));
        addRes(S, D.gives, amt);
        log(S, `Ships came home from ${D.name} with ${amt} ${RES[D.gives].name.toLowerCase()}.`);
      }
    }
    S.voyages = S.voyages.filter((x) => x.left > 0);

    // events time out into their last option
    if (S.event) { S.event.t -= dt; if (S.event.t <= 0) answer(S, EVENTS.find((e) => e.id === S.event.id).options.length - 1); }

    // automation
    if (S.auto.vizier && perk(S, 'vizier')) {
      if (pop(S) < popCap(S) && S.res.grain >= recruitCost(S) * 1.5) recruit(S);
      if (S.unl.jobs && S.res.brick >= buildCost(S, 'hut').brick * 2 && pop(S) >= popCap(S)) build(S, 'hut');
    }
    if (S.auto.highPriest && perk(S, 'highPriest') && S.unl.gods) {
      for (const g of S.autoGods || []) if (!S.bless[g] && canBless(S, g)) bless(S, g);
    }
    if (S.auto.treasurer && perk(S, 'treasurer') && S.lastVoyage && canVoyage(S, S.lastVoyage)) sendVoyage(S, S.lastVoyage);

    checkUnlocks(S);
  }

  /* actions ---------------------------------------------------------- */
  function clickPower(S) { return Math.max(1, 1 + S.jobs.farmer * 0.1 + (has(S, 'canals') ? 1 : 0)) * (1 + 0.25 * perk(S, 'labour')); }
  function reap(S) { const n = clickPower(S); addRes(S, 'grain', n); S.meta.clicks += 1; checkUnlocks(S); return n; }

  function recruitCost(S) { return Math.ceil(8 * Math.pow(1.095, pop(S) - (S.bonusCap || 0))); }
  function canRecruit(S) { return pop(S) < popCap(S) && S.res.grain >= recruitCost(S); }
  function recruit(S) {
    if (!canRecruit(S)) return false;
    S.res.grain -= recruitCost(S);
    if (S.unl.jobs) S.jobs.idle += 1; else S.jobs.farmer += 1;
    checkUnlocks(S);
    return true;
  }

  function jobOpen(S, id) {
    if (id === 'farmer') return true;
    if (id === 'brickmaker') return !!S.unl.jobs;
    if (id === 'quarryman') return !!S.unl.quarry;
    if (id === 'scribe') return !!S.built.houseOfLife;
    if (id === 'priest') return S.built.temple > 0;
    if (id === 'builder') return has(S, 'geometry');
    return false;
  }
  function assign(S, id, d) {
    if (d > 0) {
      const n = Math.min(d, S.jobs.idle);
      if (n <= 0 || !jobOpen(S, id)) return false;
      const room = id === 'priest' ? priestCap(S) - S.jobs.priest : n;
      const k = Math.min(n, room);
      if (k <= 0) return false;
      S.jobs.idle -= k; S.jobs[id] += k;
    } else {
      const k = Math.min(-d, S.jobs[id]);
      if (k <= 0) return false;
      S.jobs[id] -= k; S.jobs.idle += k;
    }
    return true;
  }

  function scaled(base, grow, n) { const o = {}; for (const r in base) o[r] = Math.ceil(base[r] * Math.pow(grow || 1, n)); return o; }
  function buildCost(S, id) { const B = BUILDINGS[id]; return scaled(B.cost, B.grow, S.built[id]); }
  function canPay(S, cost) { return Object.keys(cost).every((r) => S.res[r] >= cost[r]); }
  function pay(S, cost) { for (const r in cost) S.res[r] -= cost[r]; }
  function buildVisible(S, id) {
    const B = BUILDINGS[id];
    if (id === 'hut' || id === 'granary' || id === 'shaduf') return !!S.unl.jobs;
    if (id === 'houseOfLife') return !!S.unl.hol;
    if (B.needs && !has(S, B.needs)) return false;
    if (B.needsBuilt && !S.built[B.needsBuilt]) return false;
    return true;
  }
  function buildMaxed(S, id) { const B = BUILDINGS[id]; return (B.once && S.built[id] >= 1) || (B.max && S.built[id] >= B.max); }
  function build(S, id) {
    if (!buildVisible(S, id) || buildMaxed(S, id)) return false;
    const c = buildCost(S, id);
    if (!canPay(S, c)) return false;
    pay(S, c); S.built[id] += 1; checkUnlocks(S);
    return true;
  }

  function techVisible(S, id) { const T = TECHS[id]; return !S.techs[id] && (!T.req || S.techs[T.req]); }
  function research(S, id) {
    if (!techVisible(S, id) || S.res.wisdom < TECHS[id].cost) return false;
    S.res.wisdom -= TECHS[id].cost; S.techs[id] = 1; checkUnlocks(S);
    return true;
  }

  function canBless(S, g) { return !S.bless[g] && Object.keys(S.bless).length < blessSlots(S) && S.res.favor >= GODS[g].cost; }
  function bless(S, g) {
    if (!canBless(S, g)) return false;
    S.res.favor -= GODS[g].cost; S.bless[g] = yearLen(S);
    S.autoGods = [...new Set([...(S.autoGods || []), g])].slice(-blessSlots(S));
    return true;
  }
  function burnIncense(S) {
    if (S.res.incense < 5) return false;
    S.res.incense -= 5; addMaat(S, 8);
    return true;
  }

  function canVoyage(S, id) { return S.built.quay > 0 && S.voyages.length < voyageSlots(S) && canPay(S, VOYAGES[id].cost); }
  function sendVoyage(S, id, rng) {
    if (!canVoyage(S, id)) return false;
    const D = VOYAGES[id];
    pay(S, D.cost);
    const fail = (0.18 - S.maat / 1000) * (has(S, 'navigation') ? 0.5 : 1);
    const time = D.time * (has(S, 'navigation') ? 0.7 : 1);
    S.voyages.push({ id, left: time, total: time, lost: (rng || Math.random)() < fail });
    S.lastVoyage = id;
    return true;
  }

  function monumentCost(S) { const M = MONUMENTS[S.mon.tier]; return M ? M.cost : {}; }
  function startMonument(S) {
    if (S.mon.started || S.mon.tier >= MONUMENTS.length) return false;
    const c = monumentCost(S);
    if (!canPay(S, c)) return false;
    pay(S, c); S.mon.started = true;
    return true;
  }

  function heartThreshold(S) { return has(S, 'deadBook') ? 35 : 50; }
  function kaPreview(S) {
    let base = 0;
    for (let i = 0; i < S.mon.done; i++) base += MONUMENTS[i].ka;
    if (S.mon.started && S.mon.tier < MONUMENTS.length) base += MONUMENTS[S.mon.tier].ka * (S.mon.progress / MONUMENTS[S.mon.tier].size) * 0.5;
    const pass = S.maat >= heartThreshold(S);
    const mult = (pass ? 1 : 0.5) * (has(S, 'embalming') ? 1.25 : 1);
    return { base, pass, gain: Math.floor(base * mult), threshold: heartThreshold(S) };
  }
  function entomb(S) {
    if (!S.unl.afterlife) return null;
    const k = kaPreview(S);
    const meta = S.meta;
    meta.ka += k.gain; meta.kaTotal += k.gain; meta.dynasty += 1;
    const next = freshRun(meta);
    next.auto = S.auto; next.autoGods = S.autoGods; next.log = S.log.slice(0, 12);
    log(next, `The ${ordinal(meta.dynasty)} dynasty begins.`, 'new');
    return { state: next, result: k, maat: S.maat };
  }
  function perkCost(S, id) { const P = PERKS[id]; return Math.ceil(P.base * Math.pow(P.grow || 1, perk(S, id))); }
  function buyPerk(S, id) {
    const P = PERKS[id];
    if (perk(S, id) >= P.max || S.meta.ka < perkCost(S, id)) return false;
    S.meta.ka -= perkCost(S, id);
    S.meta.perks[id] = perk(S, id) + 1;
    return true;
  }
  function ordinal(n) { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

  function answer(S, i) {
    if (!S.event) return false;
    const e = EVENTS.find((x) => x.id === S.event.id);
    const msg = e.options[i].run(S);
    S.event = null;
    log(S, msg);
    return true;
  }

  function offline(S, seconds, rng) {
    const secs = Math.min(seconds, 8 * 3600), dt = 2;
    const before = { ...S.res };
    const y0 = S.year;
    for (let t = 0; t < secs; t += dt) step(S, dt, rng, true);
    const gained = {};
    for (const r in S.res) { const d = S.res[r] - before[r]; if (d >= 1) gained[r] = d; }
    return { secs, gained, years: S.year - y0 };
  }

  function serialize(S) { return JSON.stringify(S); }
  function deserialize(str) {
    const S = JSON.parse(str);
    if (!S || !S.meta || !S.res || !S.jobs) throw new Error('This is not a Kemet save.');
    return S;
  }

  const api = {
    YEAR, SEASONS, RES, JOBS, BUILDINGS, TECHS, GODS, VOYAGES, MONUMENTS, PERKS, EVENTS,
    newGame, step, pop, has, perk, mods, rates, season, seasonIndex, yearLen, grainCap, popCap, priestCap,
    blessSlots, voyageSlots, floodEffect, floodName, maatTarget, reap, clickPower, recruit, recruitCost, canRecruit,
    jobOpen, assign, buildCost, canPay, buildVisible, buildMaxed, build, techVisible, research, canBless, bless,
    burnIncense, canVoyage, sendVoyage, monumentCost, startMonument, kaPreview, entomb, perkCost, buyPerk, answer,
    offline, serialize, deserialize, ordinal, heartThreshold,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Kemet = api;
})(this);
