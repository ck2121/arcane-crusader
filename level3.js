// ═══════════════════════════════════════════════════════════════════
//  LEVEL 3 — Dragon's Lair
//  Extends arcane_crusader.html via window.loadLevel(3)
//  Contains: map, geysers, rising platforms, enemies
//            (FireSprite/LavaSlime/DragonMinion), Ancient Dragon boss
// ═══════════════════════════════════════════════════════════════════
'use strict';

const L3_TS = 32;
const L3_GND=1, L3_PLAT=2, L3_LAVA=3, L3_SPIKE=5;

// ── Map ─────────────────────────────────────────────────────────────
function buildLevel3() {
  const R=15, C=120;
  const map = Array.from({length:R},()=>new Array(C).fill(0));
  function fill(r1,r2,c1,c2,t){ for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) if(r>=0&&r<R&&c>=0&&c<C) map[r][c]=t; }
  function row(r,c1,c2,t){ fill(r,r,c1,c2,t); }

  // Lava floor everywhere except solid sections
  fill(13,14, 0,C-1, L3_LAVA);

  // ── Start ledge (cols 0-10) ──────────────────────────────────────
  fill(11,12, 0,10, L3_GND);

  // ── Bone-platform crossing 1 (cols 12-28) ────────────────────────
  row(11, 12,14, L3_PLAT);
  row(9,  17,20, L3_PLAT);
  row(11, 23,26, L3_PLAT);
  row(8,  28,30, L3_PLAT);

  // ── Obsidian island (cols 31-42) ─────────────────────────────────
  fill(11,12, 31,42, L3_GND);
  row(8,  34,38, L3_PLAT);

  // ── Geyser gauntlet (cols 43-62) ─────────────────────────────────
  // Small stone footholds with geyser columns between them
  row(11, 43,45, L3_PLAT);
  row(11, 49,51, L3_PLAT);
  row(11, 55,57, L3_PLAT);
  row(11, 61,62, L3_PLAT);

  // ── Second island (cols 63-78) ───────────────────────────────────
  fill(11,12, 63,78, L3_GND);
  row(8,  65,70, L3_PLAT);
  row(6,  72,76, L3_PLAT);

  // ── Treasure room approach (cols 79-90) ──────────────────────────
  row(11, 79,81, L3_PLAT);
  row(9,  83,86, L3_PLAT);
  row(11, 88,90, L3_PLAT);

  // ── Treasure room / final approach (cols 91-100) ─────────────────
  fill(11,12, 91,100, L3_GND);

  // ── Boss arena (cols 101-119) ────────────────────────────────────
  fill(11,12, 101,119, L3_GND);
  // Side walls
  fill(0,8, 101,101, L3_GND);
  fill(0,10, 119,119, L3_GND);
  // Arena upper platforms (for dodging breath attacks)
  row(6, 103,107, L3_PLAT);
  row(6, 113,117, L3_PLAT);
  row(4, 108,111, L3_PLAT);
  // Lava strips in arena floor (centre channels)
  row(12, 107,113, L3_LAVA);

  return { map, rows:R, cols:C, tileSize:L3_TS };
}

function getLevel3Enemies() {
  return [
    {type:'fireSprite',   tx:13, ty:10},
    {type:'fireSprite',   tx:23, ty:10},
    {type:'lavaSlime',    tx:33, ty:10, big:true},
    {type:'fireSprite',   tx:38, ty:10},
    {type:'dragonMinion', tx:44, ty:7},
    {type:'fireSprite',   tx:50, ty:10},
    {type:'lavaSlime',    tx:56, ty:10, big:true},
    {type:'dragonMinion', tx:60, ty:5},
    {type:'fireSprite',   tx:65, ty:10},
    {type:'dragonMinion', tx:70, ty:6},
    {type:'lavaSlime',    tx:74, ty:10, big:true},
    {type:'fireSprite',   tx:80, ty:10},
    {type:'dragonMinion', tx:85, ty:8},
    {type:'lavaSlime',    tx:93, ty:10, big:true},
    {type:'fireSprite',   tx:96, ty:10},
  ];
}

function getLevel3Collectibles() {
  return [
    {type:'coin', tx:2,  ty:10}, {type:'coin', tx:5,  ty:10},
    {type:'coin', tx:13, ty:10}, {type:'coin', tx:18, ty:8},
    {type:'coin', tx:24, ty:10}, {type:'coin', tx:29, ty:7},
    {type:'healthPotion', tx:35, ty:10},
    {type:'coin', tx:35, ty:7},  {type:'coin', tx:37, ty:7},
    {type:'coin', tx:44, ty:10}, {type:'coin', tx:50, ty:10},
    {type:'coin', tx:56, ty:10},
    {type:'manaCrystal',  tx:62, ty:10},
    {type:'coin', tx:65, ty:10}, {type:'coin', tx:68, ty:7},
    {type:'coin', tx:73, ty:5},  {type:'coin', tx:75, ty:5},
    {type:'healthPotion', tx:80, ty:10},
    {type:'coin', tx:84, ty:8},  {type:'coin', tx:86, ty:8},
    {type:'coin', tx:92, ty:10}, {type:'coin', tx:95, ty:10},
    {type:'coin', tx:98, ty:10}, {type:'coin', tx:99, ty:10},
    // Dragon Scale (fire resistance)
    {type:'dragonScale', tx:97, ty:10},
    {type:'bomb',        tx:8,   ty:11},
    {type:'bomb',        tx:44,  ty:11},
    {type:'bomb',        tx:89,  ty:11},
    {type:'healthPotion',tx:19,  ty:9},
    {type:'healthPotion',tx:66,  ty:8},
    {type:'healthPotion',tx:92,  ty:11},
    {type:'chest',       tx:5,   ty:11},
    {type:'chest',       tx:62,  ty:11},
    {type:'chest',       tx:84,  ty:9},
  ];
}

function getLevel3Checkpoints() {
  return [0, 63*L3_TS, 101*L3_TS];
}

// ── Rising platforms (timed, in geyser gauntlet) ─────────────────────
function buildLevel3MovingPlatforms() {
  return [
    { x:46*L3_TS, y:11*L3_TS, w:56, h:10, axis:'y',
      min:8*L3_TS, max:11*L3_TS, speed:40, dir:-1, dx:0, dy:0, phase:0 },
    { x:52*L3_TS, y:9*L3_TS, w:56, h:10, axis:'y',
      min:8*L3_TS, max:11*L3_TS, speed:40, dir:1, dx:0, dy:0, phase:1.5 },
    { x:58*L3_TS, y:11*L3_TS, w:56, h:10, axis:'y',
      min:8*L3_TS, max:11*L3_TS, speed:40, dir:-1, dx:0, dy:0, phase:3 },
  ];
}

// Geyser hazard columns
function buildLevel3Geysers() {
  return [
    { x:46*L3_TS+8, w:16, baseY:12*L3_TS, h:96, period:3.0, offset:0,   activeDur:1.2, active:false, timer:0 },
    { x:52*L3_TS+8, w:16, baseY:12*L3_TS, h:96, period:3.0, offset:1.0, activeDur:1.2, active:false, timer:1.0 },
    { x:58*L3_TS+8, w:16, baseY:12*L3_TS, h:96, period:3.0, offset:2.0, activeDur:1.2, active:false, timer:2.0 },
  ];
}

// ── Enemy defs ────────────────────────────────────────────────────────
const L3_ENEMY_DEFS = {
  fireSprite: { hp:40, w:18, h:22, xp:25, coins:8, speed:120, dmg:15,
    color:'#ff4400', accentColor:'#ff8800', flying:false },
  lavaSlime:  { hp:80, w:26, h:22, xp:30, coins:10, speed:50, dmg:12,
    color:'#cc2200', accentColor:'#ff4400', flying:false },
  dragonMinion:{ hp:60, w:28, h:24, xp:35, coins:12, speed:70, dmg:18,
    color:'#552200', accentColor:'#884400', flying:true },
};

// ── Load entry point ─────────────────────────────────────────────────
// Overwrite the loadLevel installed by level2.js to also handle 3
const _prevLoadLevel = window.loadLevel;
window.loadLevel = function(n) {
  if (n === 3) _loadLevel3();
  else if (_prevLoadLevel) _prevLoadLevel(n);
  else { game.state = STATE_WIN; }
};

function _loadLevel3() {
  game.currentLevel = 3;
  game.level = 3;
  game.levelData = buildLevel3();
  game.enemies = [];
  game.projectiles = [];
  game.collectibles = [];
  game.movingPlatforms = buildLevel3MovingPlatforms();
  game.geysers = buildLevel3Geysers();
  game.crumbleState = {};
  game.checkpoints = getLevel3Checkpoints();
  game.lastCheckpoint = 0;
  game.bossSpawned = false;
  game.boss = null;
  game.levelComplete = false;
  game.levelCompleteTimer = 0;
  game._showLevelComplete = false;
  game.camX = 0;
  Object.assign(ENEMY_DEFS, L3_ENEMY_DEFS);
  const p = game.player;
  p.x = 2*L3_TS; p.y = 9*L3_TS;
  p.vx = 0; p.vy = 0;
  p.hp = p.maxHp; p.mana = p.maxMana;
  p.invincible = 0; p.dead = false;
  p.lives = Math.max(p.lives, 1);
  _initL3Enemies();
  _initL3Collectibles();
  if (typeof MusicEngine !== 'undefined') MusicEngine.start(3);
  game.state = STATE_PLAY;
}

function _initL3Enemies() {
  const sc = 1 + (game.runCount || 0) * 0.5;
  for (const def of getLevel3Enemies()) {
    const d = L3_ENEMY_DEFS[def.type];
    if (!d) continue;
    game.enemies.push({
      type: def.type,
      x: def.tx*L3_TS, y: def.ty*L3_TS,
      w: d.w, h: d.h, vx:0, vy:0,
      hp: d.hp, maxHp: d.hp, xp: d.xp, coins: d.coins, dmg: d.dmg,
      alive:true, onGround:false, facingRight: Math.random()<0.5,
      state:'patrol', stateTimer:0,
      patrolDir: Math.random()<0.5?1:-1, patrolTimer: rnd(1,3),
      hitFlash:0, deathTimer:0, slowTimer:0,
      color: d.color, accentColor: d.accentColor,
      flying: !!d.flying,
      // slime
      big: def.big ?? false, split: false,
      // sprite zigzag
      zigzagTimer:0, zigzagDir:1,
      // dragon minion
      circleAngle: Math.random()*Math.PI*2,
      circleCenter: {x:def.tx*L3_TS, y:(def.ty-2)*L3_TS},
      shootTimer: rnd(2,3.5),
      baseY: def.ty*L3_TS,
      sinePhase: Math.random()*Math.PI*2,
    });
  }
  // Scale HP for New Game+
  const sc2 = 1 + (game.runCount||0)*0.5;
  if (sc2 > 1) game.enemies.forEach(e=>{ e.hp=Math.round(e.hp*sc2); e.maxHp=e.hp; });
}

function _initL3Collectibles() {
  for (const def of getLevel3Collectibles()) {
    game.collectibles.push({
      type: def.type,
      x: def.tx*L3_TS + L3_TS/2 - 8,
      y: def.ty*L3_TS - 16,
      w:16, h:16, alive:true,
      bobTimer: Math.random()*Math.PI*2,
    });
  }
}

// ── Moving platforms (vertical rising) ──────────────────────────────
function updateL3MovingPlatforms(dt) {
  if (!game.movingPlatforms || game.currentLevel !== 3) return;
  const p = game.player;
  for (const mp of game.movingPlatforms) {
    const prevY = mp.y;
    mp.y += mp.dir * mp.speed * dt;
    if (mp.y <= mp.min) { mp.y = mp.min; mp.dir =  1; }
    if (mp.y >= mp.max) { mp.y = mp.max; mp.dir = -1; }
    mp.dy = mp.y - prevY;
    mp.dx = 0;
    // Land on platform (one-way from above) + carry
    if (!p.dead) {
      const prevFeet = (p.prevY !== undefined ? p.prevY : p.y) + p.h;
      const feetY = p.y + p.h;
      const overlapX = p.x+p.w > mp.x && p.x < mp.x+mp.w;
      if (p.vy >= 0 && prevFeet <= mp.y + 2 && feetY >= mp.y && overlapX) {
        p.y = mp.y - p.h; p.vy = 0; p.onGround = true;
      }
      if (p.onGround && Math.abs((p.y+p.h) - mp.y) <= 2 && overlapX) {
        p.y += mp.dy;
      }
    }
  }
}

// ── Geyser hazard ───────────────────────────────────────────────────
function updateL3Geysers(dt) {
  if (!game.geysers || game.currentLevel !== 3) return;
  const p = game.player;
  for (const g of game.geysers) {
    g.timer += dt;
    const cycle = g.timer % g.period;
    g.active = cycle < g.activeDur;
    if (g.active && !p.dead && p.invincible <= 0) {
      const geyserTop = g.baseY - g.h;
      if (p.x+p.w > g.x && p.x < g.x+g.w &&
          p.y+p.h > geyserTop && p.y < g.baseY) {
        damagePlayer(12, true);
      }
    }
  }
}

function drawL3Geysers(camX) {
  if (!game.geysers || game.currentLevel !== 3) return;
  for (const g of game.geysers) {
    const gx = g.x - camX;
    if (g.active) {
      const pulse = Math.sin(Date.now()*0.015)*0.3+0.7;
      // Geyser column
      const grad = ctx.createLinearGradient(0, g.baseY-g.h, 0, g.baseY);
      grad.addColorStop(0, `rgba(255,200,0,0)`);
      grad.addColorStop(0.4, `rgba(255,120,0,${pulse})`);
      grad.addColorStop(1, `rgba(255,60,0,${pulse})`);
      ctx.fillStyle = grad;
      ctx.fillRect(gx, g.baseY-g.h, g.w, g.h);
      // Tip burst
      spawnParticle(gx+g.w/2+rnd(-8,8), g.baseY-g.h, {
        color:'#FF8800', size:rnd(3,7), life:0.2,
        vx:rnd(-40,40), vy:rnd(-80,-20), gravity:200
      });
    } else {
      // Inactive — small smoke wisps from vent
      ctx.fillStyle = 'rgba(180,60,0,0.3)';
      ctx.fillRect(gx+4, g.baseY-8, g.w-8, 8);
    }
  }
}

// ── Enemy AI: Level 3 types ──────────────────────────────────────────
function updateL3EnemyAI(e, dt) {
  if (e.type === 'fireSprite')   updateFireSprite(e, dt);
  else if (e.type === 'lavaSlime')   updateLavaSlime(e, dt);
  else if (e.type === 'dragonMinion') updateDragonMinion(e, dt);
}

function updateFireSprite(e, dt) {
  const p = game.player;
  const speed = e.slowTimer > 0 ? 60 : 120;
  e.zigzagTimer -= dt;
  if (e.zigzagTimer <= 0) {
    e.zigzagDir *= -1;
    e.zigzagTimer = rnd(0.2, 0.5);
  }
  const px = p.x + p.w/2, ex = e.x + e.w/2;
  const dist = Math.abs(px - ex);
  if (dist < 200 && !p.dead) {
    const dir = px > ex ? 1 : -1;
    e.vx = dir * speed;
    e.vy = e.zigzagDir * 60; // leaves fire trail effect
    e.facingRight = dir > 0;
  } else {
    e.vx = e.patrolDir * (speed * 0.6);
    e.facingRight = e.patrolDir > 0;
    e.patrolTimer -= dt;
    if (e.patrolTimer <= 0) { e.patrolDir *= -1; e.patrolTimer = rnd(0.8,2); }
  }
  // Ranged fireball when dist 150-350
  if (!e.shootTimer) e.shootTimer = rnd(1.5,3);
  e.shootTimer -= dt;
  if (e.shootTimer <= 0 && dist > 150 && dist < 350 && !p.dead) {
    e.shootTimer = rnd(2, 3.5);
    const dir2 = px > ex ? 1 : -1;
    game.projectiles.push({type:'fireSpit', x:e.x+e.w/2, y:e.y+e.h*0.3,
      w:8, h:8, vx:dir2*180, vy:-50, dmg:15, owner:'enemy', alive:true});
  }
  // Fire trail particles
  if (Math.random() < 0.4) {
    spawnParticle(e.x+e.w/2, e.y+e.h*0.7,
      {color:'#FF6600', size:rnd(2,5), life:0.2, vx:rnd(-20,20), vy:rnd(10,40), gravity:60});
  }
}

function updateLavaSlime(e, dt) {
  const speed = e.slowTimer > 0 ? 25 : 50;
  const p = game.player;
  const px = p.x+p.w/2, ex2 = e.x+e.w/2;
  const dist2 = Math.abs(px-ex2);
  if (dist2 < 220 && !p.dead) {
    // Chase player
    const dir = px > ex2 ? 1 : -1;
    e.vx = dir * speed * 1.8;
    e.facingRight = dir > 0;
  } else {
    e.vx = e.patrolDir * speed;
    e.facingRight = e.patrolDir > 0;
    e.patrolTimer -= dt;
    if (e.patrolTimer <= 0) { e.patrolDir *= -1; e.patrolTimer = rnd(1,2.5); }
  }
  // Bounce periodically
  e.zigzagTimer -= dt;
  if (e.zigzagTimer <= 0 && e.onGround) { e.vy = -180; e.zigzagTimer = rnd(0.8,1.4); }
  // Spit projectile at player
  if (!e.spitTimer) e.spitTimer = rnd(2,4);
  e.spitTimer -= dt;
  if (e.spitTimer <= 0 && dist2 < 380 && !p.dead) {
    e.spitTimer = rnd(2.5,4.5);
    const dx = px-(e.x+e.w/2), dy = (p.y+p.h/2)-(e.y+e.h/2);
    const len = Math.hypot(dx,dy)||1;
    game.projectiles.push({type:'lavaSpit', x:e.x+e.w/2, y:e.y,
      w:10, h:10, vx:(dx/len)*140, vy:(dy/len)*140-80, dmg:12, owner:'enemy', alive:true});
  }
}

function updateDragonMinion(e, dt) {
  // Circles an area, fires fireballs at player
  e.circleAngle += dt * 1.2;
  e.x = e.circleCenter.x + Math.cos(e.circleAngle) * 60;
  e.y = e.circleCenter.y + Math.sin(e.circleAngle) * 30;
  e.vx = 0; e.vy = 0;
  e.facingRight = Math.cos(e.circleAngle) > 0;
  const p = game.player;
  e.shootTimer -= dt;
  if (e.shootTimer <= 0 && !p.dead) {
    e.shootTimer = rnd(2.5, 4);
    const dx = p.x+p.w/2 - (e.x+e.w/2);
    const dy = p.y+p.h/2 - (e.y+e.h/2);
    const len = Math.hypot(dx,dy) || 1;
    game.projectiles.push({
      type:'minionFireball', x:e.x+e.w/2, y:e.y+e.h/2,
      w:12, h:12, vx:(dx/len)*200, vy:(dy/len)*200,
      dmg:18, owner:'enemy', alive:true,
    });
  }
}

// ── Kill / split logic for lava slime ───────────────────────────────
const _origKillEnemy = typeof killEnemy === 'function' ? killEnemy : null;
// Wrap hitEnemy to handle slime split (call from main hitEnemy)
// We add an afterKill hook instead:
window._afterKillEnemy = function(e) {
  if (e.type === 'lavaSlime' && e.big && !e.split) {
    // Spawn 2 small slimes
    for (let s = -1; s <= 1; s += 2) {
      const small = {
        type:'lavaSlime', x:e.x+(s>0?e.w:0), y:e.y,
        w:18, h:16, vx:s*60, vy:-120,
        hp:40, maxHp:40, xp:15, coins:5, dmg:10,
        alive:true, onGround:false, facingRight:s>0,
        state:'patrol', stateTimer:0,
        patrolDir:s, patrolTimer:1,
        hitFlash:0, deathTimer:0, slowTimer:0,
        color:'#cc2200', accentColor:'#ff4400',
        flying:false, big:false, split:true,
        zigzagTimer:0.5, patrolDir:s,
      };
      game.enemies.push(small);
    }
  }
};

// ── Collectible: Dragon Scale pickup ────────────────────────────────
// Hook into main collectItem
const _origCollectItem = typeof collectItem === 'function' ? collectItem : null;
window._collectExtraItem = function(c) {
  if (c.type === 'dragonScale') {
    game.player.fireResistance = true;
    c.alive = false;
    spawnBurst(c.x+8, c.y+8, 12, {color:'#44ff44', size:5});
    return true;
  }
  return false;
};

// ── Tile rendering ───────────────────────────────────────────────────
window._drawL3Tile = function(t, tx, ty, c) {
  if (t === L3_GND) {
    // Obsidian — very dark with orange veins
    ctx.fillStyle = '#111118';
    ctx.fillRect(tx, ty, L3_TS, L3_TS);
    ctx.strokeStyle = '#332200';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx, ty, L3_TS, L3_TS);
    if ((c+Math.floor(ty/L3_TS))%3===0) {
      ctx.fillStyle = 'rgba(255,80,0,0.15)';
      ctx.fillRect(tx+2, ty+L3_TS/2, L3_TS-4, 4);
    }
    return true;
  }
  if (t === L3_PLAT) {
    // Bone platform
    ctx.fillStyle = '#c8b890';
    ctx.fillRect(tx, ty, L3_TS, 8);
    ctx.fillStyle = '#a09070';
    ctx.fillRect(tx, ty+8, L3_TS, 3);
    // Bone end caps
    ctx.fillStyle = '#e0d0b0';
    ctx.fillRect(tx, ty, 6, 8);
    ctx.fillRect(tx+L3_TS-6, ty, 6, 8);
    return true;
  }
  if (t === L3_LAVA) {
    const pulse = Math.sin(Date.now()*0.005 + c*0.7)*0.25+0.75;
    ctx.fillStyle = `rgb(${Math.floor(255*pulse)},${Math.floor(60*pulse)},0)`;
    ctx.fillRect(tx, ty, L3_TS, L3_TS);
    // Bright lava surface
    ctx.fillStyle = `rgba(255,180,0,${0.4*pulse})`;
    ctx.fillRect(tx, ty, L3_TS, 5);
    return true;
  }
  return false;
};

// ── Background ───────────────────────────────────────────────────────
window._drawL3Background = function(camX) {
  // Deep volcanic cave
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#050000');
  grad.addColorStop(0.6,'#1a0500');
  grad.addColorStop(1,'#3a0800');
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

  // Distant lava glow on ceiling
  const off = camX * 0.15;
  for (let i=0;i<8;i++) {
    const gx = ((i*160-off)%W+W)%W;
    ctx.fillStyle = `rgba(255,60,0,0.12)`;
    ctx.beginPath(); ctx.ellipse(gx, H*0.6, 80, 40, 0, 0, Math.PI*2); ctx.fill();
  }
  // Stalactites
  ctx.fillStyle = '#0d0305';
  const off2 = camX*0.4;
  for (let i=0;i<16;i++) {
    const sx = ((i*97-off2)%(W+100)+W)%W-50;
    const sh = 20 + (i*43%30);
    ctx.beginPath();
    ctx.moveTo(sx, 0); ctx.lineTo(sx+16, 0); ctx.lineTo(sx+8, sh); ctx.fill();
  }
  // Ember sparks drifting upward
  const t = Date.now()*0.001;
  ctx.fillStyle = '#FF6600';
  for (let i=0;i<16;i++) {
    const ex = ((i*137+camX*0.3+t*18)%W+W)%W;
    const ey = H - ((i*53+t*30)%(H*0.85));
    ctx.globalAlpha = 0.3+Math.sin(t*2+i)*0.25;
    ctx.fillRect(ex,ey,2,2);
  }
  ctx.globalAlpha=1;
};

// ── Enemy draw ───────────────────────────────────────────────────────
function drawL3Enemy(e, camX) {
  if (!e.alive && e.deathTimer <= 0) return;
  const alpha = e.alive ? 1 : e.deathTimer/0.5;
  ctx.globalAlpha = alpha;
  const ex = Math.round(e.x-camX), ey = Math.round(e.y);
  const flash = e.hitFlash > 0;
  if (e.type==='fireSprite')    drawFireSprite(ex,ey,e,flash);
  else if (e.type==='lavaSlime')   drawLavaSlime(ex,ey,e,flash);
  else if (e.type==='dragonMinion') drawDragonMinion(ex,ey,e,flash);
  if (e.alive && e.hp < e.maxHp) {
    ctx.fillStyle='#300'; ctx.fillRect(ex,ey-8,e.w,4);
    ctx.fillStyle='#f84'; ctx.fillRect(ex,ey-8,e.w*(e.hp/e.maxHp),4);
  }
  ctx.globalAlpha=1;
}

function drawFireSprite(ex,ey,e,flash) {
  const c = flash ? '#fff' : '#ff4400';
  ctx.save(); ctx.translate(ex+e.w/2, ey+e.h/2);
  if (!e.facingRight) ctx.scale(-1,1);
  const flicker = Math.sin(Date.now()*0.02)*0.2;
  // Body flame
  ctx.fillStyle = flash ? '#fff' : '#ff6600';
  ctx.beginPath();
  ctx.ellipse(0, 2, e.w/2-2, e.h/2, 0, 0, Math.PI*2); ctx.fill();
  // Flame tips
  ctx.fillStyle = flash ? '#fff' : '#ffcc00';
  ctx.beginPath();
  ctx.moveTo(-4,-e.h/2+flicker*8);
  ctx.quadraticCurveTo(-8,-e.h/2-6+flicker*4, 0,-e.h/2-10+flicker*6);
  ctx.quadraticCurveTo(8,-e.h/2-6+flicker*4, 4,-e.h/2+flicker*8);
  ctx.fill();
  // Eyes
  ctx.fillStyle = flash ? '#fff' : '#ffff00';
  ctx.fillRect(-5,-2,4,3); ctx.fillRect(2,-2,4,3);
  ctx.restore();
}

function drawLavaSlime(ex,ey,e,flash) {
  ctx.save(); ctx.translate(ex+e.w/2, ey+e.h/2);
  const squish = e.onGround ? 1.2 : 0.85;
  ctx.scale(1, squish);
  ctx.fillStyle = flash ? '#fff' : '#cc2200';
  ctx.beginPath(); ctx.ellipse(0,0,e.w/2,e.h/2,0,0,Math.PI*2); ctx.fill();
  // Highlight
  ctx.fillStyle = flash ? '#fff' : '#ff4400';
  ctx.beginPath(); ctx.ellipse(-e.w/6,-e.h/6,e.w/4,e.h/5,0,0,Math.PI*2); ctx.fill();
  // Eyes
  ctx.fillStyle = flash ? '#fff' : '#ffcc00';
  ctx.fillRect(-6,-4,4,3); ctx.fillRect(2,-4,4,3);
  if (e.big) {
    // Small crown to show big variant
    ctx.fillStyle='#FFD700';
    ctx.fillRect(-8,-e.h/2-4,16,4);
  }
  ctx.restore();
}

function drawDragonMinion(ex,ey,e,flash) {
  const sx = e.facingRight?1:-1;
  ctx.save(); ctx.translate(ex+e.w/2,ey+e.h/2); ctx.scale(sx,1);
  const bx=-e.w/2, by=-e.h/2;
  const wing = Math.sin(Date.now()*0.018)*6;
  // Wings
  ctx.fillStyle = flash?'#fff':'#442200';
  ctx.beginPath();
  ctx.moveTo(0,0); ctx.bezierCurveTo(-16,-8+wing,-22,4+wing,-12,12); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0,0); ctx.bezierCurveTo(16,-8+wing,22,4+wing,12,12); ctx.fill();
  // Body
  ctx.fillStyle = flash?'#fff':'#664400';
  ctx.fillRect(bx+4,by+4,e.w-8,e.h-8);
  // Head
  ctx.fillStyle = flash?'#fff':'#885500';
  ctx.fillRect(bx+e.w-8,by,10,10);
  // Eye
  ctx.fillStyle='#ff4400'; ctx.fillRect(bx+e.w-4,by+2,4,3);
  ctx.restore();
}

// ── Projectile hooks ─────────────────────────────────────────────────
window._updateL3Projectile = function(proj, dt) {
  if (proj.type==='minionFireball') { proj.vy += 80*dt; }
  else if (proj.type==='fireSpit')   { proj.vy += 120*dt; }
  else if (proj.type==='lavaSpit')   { proj.vy += 100*dt; }
};

window._drawL3Projectile = function(proj, camX) {
  if (proj.type==='fireSpit') {
    ctx.fillStyle='#ff6600';
    ctx.beginPath(); ctx.arc(proj.x-camX+proj.w/2,proj.y+proj.h/2,proj.w/2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ffcc00';
    ctx.beginPath(); ctx.arc(proj.x-camX+proj.w/2-1,proj.y+proj.h/2-1,proj.w/4,0,Math.PI*2); ctx.fill();
    return;
  }
  if (proj.type==='lavaSpit') {
    ctx.fillStyle='#cc2200';
    ctx.beginPath(); ctx.arc(proj.x-camX+proj.w/2,proj.y+proj.h/2,proj.w/2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ff6600';
    ctx.beginPath(); ctx.arc(proj.x-camX+proj.w/2-1,proj.y+proj.h/2-2,2,0,Math.PI*2); ctx.fill();
    return;
  }
  if (proj.type==='minionFireball') {
    const pulse = Math.sin(Date.now()*0.015)*0.3+0.7;
    ctx.fillStyle=`rgba(255,80,0,${pulse})`;
    ctx.beginPath();
    ctx.arc(proj.x-camX+proj.w/2, proj.y+proj.h/2, proj.w/2, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle='#ffcc00';
    ctx.beginPath();
    ctx.arc(proj.x-camX+proj.w/2, proj.y+proj.h/2, proj.w/4, 0, Math.PI*2);
    ctx.fill();
    return true;
  }
  if (proj.type==='breathBeam') {
    ctx.fillStyle='rgba(255,100,0,0.85)';
    ctx.fillRect(proj.x-camX, proj.y-8, proj.w, 16);
    ctx.fillStyle='rgba(255,220,0,0.6)';
    ctx.fillRect(proj.x-camX+4, proj.y-4, proj.w-8, 8);
    return true;
  }
  return false;
};

// ── Boss spawn trigger ────────────────────────────────────────────────
window._checkL3BossSpawn = function() {
  if (game.currentLevel===3 && !game.bossSpawned && game.player.x > 100*L3_TS) {
    game.bossSpawned = true;
    spawnL3Boss();
  }
};

// ── Ancient Dragon boss ──────────────────────────────────────────────
function spawnL3Boss() {
  game.boss = {
    type:'dragon',
    x:110*L3_TS, y:9*L3_TS,
    w:80, h:60,
    vx:0, vy:0,
    hp:800, maxHp:800,
    alive:true, onGround:false,
    phase:1, facingRight:false,
    hitFlash:0, deathTimer:0,
    prevY: 9*L3_TS,
    state:'perch', stateTimer:2,
    breathTimer:0, breathActive:false, breathDir:-1,
    swoopTimer:6, swoopActive:false,
    stomping:false, stompTimer:0,
    minionSpawned:false,
    arenaLeft: 102*L3_TS, arenaRight: 118*L3_TS,
    arenaFloor: 11*L3_TS,
    inhaling: false, inhaleTimer:0,
  };
}

function updateL3Boss(dt) {
  const boss = game.boss;
  if (!boss || !boss.alive || boss.type!=='dragon') return;
  boss.hitFlash = Math.max(0, boss.hitFlash-dt);
  boss.stateTimer -= dt;
  const p = game.player;
  const px=p.x+p.w/2, py=p.y+p.h/2;
  const bx=boss.x+boss.w/2, by=boss.y+boss.h/2;
  boss.facingRight = px < bx; // dragon faces player

  // Phase transitions
  if (boss.hp<=250 && boss.phase<3) { boss.phase=3; boss.state='idle'; boss.stateTimer=1.5; }
  else if (boss.hp<=550 && boss.phase<2) { boss.phase=2; boss.state='idle'; boss.stateTimer=1; }

  // Gravity (only when not flying)
  if (!boss.swoopActive) {
    boss.vy = Math.min(boss.vy + GRAVITY*dt, TERM_VEL);
    boss.prevY = boss.y;
    boss.y += boss.vy*dt;
    boss.onGround=false;
    resolveY(boss, game);
    boss.x += boss.vx*dt;
    boss.x = clamp(boss.x, boss.arenaLeft, boss.arenaRight-boss.w);
  }

  // ── Inhale tell ─────────────────────────────────────────────────
  if (boss.inhaling) {
    boss.inhaleTimer -= dt;
    if (boss.inhaleTimer <= 0) {
      boss.inhaling = false;
      boss.breathActive = true;
      boss.breathTimer = 1.8;
    }
  }

  // ── Breath attack ───────────────────────────────────────────────
  if (boss.breathActive) {
    boss.breathTimer -= dt;
    // Spawn beam projectile continuously
    if (Math.floor(boss.breathTimer*20) % 2 === 0) {
      const dir = boss.facingRight ? 1 : -1;
      const mouthX = boss.facingRight ? boss.x+boss.w : boss.x;
      game.projectiles.push({
        type:'breathBeam', x:mouthX, y:boss.y+boss.h*0.65,
        w:220, h:24, vx:dir*0, vy:0, // stationary beam
        dmg: boss.phase>=3?22:16,
        owner:'enemy', alive:true, life:0.15,
      });
    }
    if (boss.breathTimer <= 0) {
      boss.breathActive = false;
      boss.state = 'idle';
      boss.stateTimer = boss.phase>=3 ? 1.2 : 2.0;
      boss.vx = 0;
    }
  }

  // ── Swoop ───────────────────────────────────────────────────────
  boss.swoopTimer -= dt;
  if (boss.swoopTimer <= 0 && !boss.breathActive && !boss.inhaling && boss.phase>=1) {
    boss.swoopTimer = boss.phase>=3 ? 5 : 8;
    boss.swoopActive = true;
    boss.vy = -200;
    const dir = px > bx ? 1 : -1;
    boss.vx = dir * 260;
  }
  if (boss.swoopActive) {
    boss.x += boss.vx * dt;
    boss.y += boss.vy * dt;
    boss.vy += GRAVITY*0.4*dt;
    // Check if passed through arena
    if (boss.x < boss.arenaLeft || boss.x > boss.arenaRight-boss.w || boss.y > boss.arenaFloor-boss.h) {
      boss.swoopActive = false;
      boss.x = clamp(boss.x, boss.arenaLeft, boss.arenaRight-boss.w);
      boss.y = boss.arenaFloor - boss.h;
      boss.vx = 0; boss.vy = 0;
    }
    if (!p.dead && p.invincible<=0 && aabbOverlap(p.x,p.y,p.w,p.h,boss.x,boss.y,boss.w,boss.h)) {
      damagePlayer(22, true);
    }
  }

  // ── State machine ────────────────────────────────────────────────
  if (!boss.breathActive && !boss.inhaling && boss.state === 'idle' && boss.stateTimer <= 0) {
    boss.state = 'inhale';
    boss.inhaling = true;
    boss.inhaleTimer = 1.0; // 1s tell
    boss.stateTimer = 1.0;
  }

  // Phase 2+: stomp
  if (boss.phase>=2 && boss.onGround && !boss.stomping && !boss.breathActive) {
    boss.stomping = true;
    boss.stompTimer = 3.5;
    triggerShake(8, 0.4);
    const pp=game.player;
    if (!pp.dead && pp.onGround && pp.invincible<=0) damagePlayer(20, true);
    // Activate random geyser
    if (game.geysers && game.geysers.length) {
      const g = game.geysers[Math.floor(Math.random()*game.geysers.length)];
      g.timer = 0; // force active
    }
  }
  if (boss.stomping) {
    boss.stompTimer -= dt;
    if (boss.stompTimer <= 0) boss.stomping = false;
  }

  // Phase 3: spawn Dragon Minions
  if (boss.phase>=3 && !boss.minionSpawned && boss.onGround) {
    boss.minionSpawned = true;
    for (let s=0;s<2;s++) {
      const m = {
        type:'dragonMinion', x:boss.x+(s?boss.w+10:-60), y:boss.y,
        w:28, h:24, vx:0, vy:0, hp:60, maxHp:60, xp:0, coins:0, dmg:18,
        alive:true, onGround:false, facingRight:s===0, flying:true,
        state:'patrol', stateTimer:0, patrolDir:s?1:-1, patrolTimer:2,
        hitFlash:0, deathTimer:0, slowTimer:0,
        color:'#552200', accentColor:'#884400',
        circleAngle:s*Math.PI, circleCenter:{x:boss.x+boss.w/2, y:boss.y-40},
        shootTimer:rnd(2,4), baseY:boss.y, sinePhase:0,
        zigzagTimer:0, big:false, split:false,
      };
      game.enemies.push(m);
    }
  }

  // Breath beam short-life cleanup
  for (let i=game.projectiles.length-1;i>=0;i--) {
    const proj = game.projectiles[i];
    if (proj.type==='breathBeam') {
      proj.life -= dt;
      if (proj.life<=0) { proj.alive=false; }
      // Damage player
      if (proj.alive && !p.dead && p.invincible<=0) {
        const beamX = proj.vx>=0 ? proj.x : proj.x-proj.w;
        if (p.x+p.w>beamX && p.x<beamX+proj.w && Math.abs(p.y+p.h/2-(proj.y+4))<30) {
          const dmg = proj.dmg * (p.fireResistance ? 0.8 : 1);
          damagePlayer(dmg, true);
        }
      }
    }
  }

  // Contact damage
  if (!p.dead && p.invincible<=0 && aabbOverlap(p.x,p.y,p.w,p.h,boss.x,boss.y,boss.w,boss.h)) {
    damagePlayer(20, true);
  }
}

function hitL3Boss(boss, dmg) {
  if (!boss.alive) return;
  boss.hp -= dmg;
  boss.hitFlash = 0.15;
  spawnDmgNum(boss.x+boss.w/2, boss.y-5, dmg, '#ff8844');
  spawnBurst(boss.x+boss.w/2, boss.y+boss.h/2, 6, {color:'#ff4400', size:5});
  triggerShake(4, 0.12);
  if (boss.hp<=0) killL3Boss(boss);
}

function killL3Boss(boss) {
  if(typeof SFX!=='undefined') SFX.bossDefeat();
  boss.alive=false; boss.hp=0; boss.deathTimer=3;
  game.player.xp+=300; game.player.coins+=200;
  spawnBurst(boss.x+boss.w/2, boss.y+boss.h/2, 60, {color:'#FF8800', size:10});
  spawnBurst(boss.x+boss.w/2, boss.y+boss.h/2, 30, {color:'#FFD700', size:6});
  triggerShake(10, 0.6);
  // True victory — no more shop
  setTimeout(()=>{ game.state = STATE_WIN; game.winTimer=0; }, 3000);
}

function drawL3Boss(camX) {
  const boss = game.boss;
  if (!boss || boss.type!=='dragon') return;
  const bx=Math.round(boss.x-camX), by=Math.round(boss.y);
  const alpha = boss.alive?1:Math.max(0,boss.deathTimer/3);
  ctx.globalAlpha=alpha;
  const flash=boss.hitFlash>0;
  const body   = flash?'#fff':'#3a1a00';
  const scales = flash?'#fff':'#5a2a00';
  const belly  = flash?'#fff':'#8B4000';
  const wing   = flash?'#fff':'#2a1000';

  // Wings (behind body)
  const wflap = Math.sin(Date.now()*0.006)*12;
  ctx.fillStyle=wing;
  ctx.beginPath();
  ctx.moveTo(bx+boss.w*0.3,by+20);
  ctx.bezierCurveTo(bx-40,by+wflap, bx-60,by+30+wflap, bx-20,by+boss.h);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx+boss.w*0.7,by+20);
  ctx.bezierCurveTo(bx+boss.w+40,by+wflap, bx+boss.w+60,by+30+wflap, bx+boss.w+20,by+boss.h);
  ctx.fill();

  // Body
  ctx.fillStyle=body;
  ctx.fillRect(bx+8,by+16,boss.w-16,boss.h-16);
  // Belly
  ctx.fillStyle=belly;
  ctx.fillRect(bx+16,by+26,boss.w-32,boss.h-32);
  // Scale ridges
  ctx.fillStyle=scales;
  for(let s=0;s<4;s++) ctx.fillRect(bx+14,by+20+s*8,boss.w-28,4);

  // Neck + head
  ctx.fillStyle=body;
  const hx = boss.facingRight ? bx+boss.w-10 : bx-20;
  ctx.fillRect(hx,by+4,30,22);
  // Snout
  const sx2 = boss.facingRight ? hx+22 : hx-12;
  ctx.fillStyle=scales;
  ctx.fillRect(sx2,by+8,14,12);
  // Eye
  ctx.fillStyle=flash?'#fff':'#FF4400';
  ctx.fillRect(boss.facingRight?hx+8:hx+6,by+6,8,5);
  // Nostril fire
  if (!boss.inhaling) {
    ctx.fillStyle='rgba(255,140,0,0.6)';
    ctx.fillRect(sx2+(boss.facingRight?6:2),by+14,5,3);
  } else {
    // Inhale glow
    const glow=Math.sin(Date.now()*0.02)*0.3+0.7;
    ctx.fillStyle=`rgba(255,${Math.floor(180*glow)},0,${glow})`;
    ctx.beginPath();
    ctx.arc(sx2+7, by+15, 10, 0, Math.PI*2); ctx.fill();
  }

  // Tail
  ctx.fillStyle=body;
  const tx2 = boss.facingRight ? bx-10 : bx+boss.w-10;
  ctx.fillRect(tx2,by+boss.h-14,20,10);
  ctx.fillRect(tx2+(boss.facingRight?-14:14),by+boss.h-10,14,7);

  ctx.globalAlpha=1;

  // Boss HP bar
  if (boss.alive) {
    const barW=240,barH=12,barX=W/2-120,barY=48;
    ctx.fillStyle='#1a0000'; ctx.fillRect(barX,barY,barW,barH);
    const r=Math.max(0,boss.hp/boss.maxHp);
    ctx.fillStyle=r>0.5?'#cc2200':r>0.25?'#ff6600':'#ff0000';
    ctx.fillRect(barX,barY,barW*r,barH);
    ctx.strokeStyle='#550000'; ctx.lineWidth=1; ctx.strokeRect(barX,barY,barW,barH);
    ctx.fillStyle='#fff'; ctx.font='bold 10px monospace'; ctx.textAlign='center';
    ctx.fillText(`ANCIENT DRAGON  ${boss.hp}/${boss.maxHp}`, W/2, barY-2);
    ctx.fillStyle='#ff8844';
    ctx.fillText(`Phase ${boss.phase}${boss.inhaling?' — INHALING!':''}`, W/2, barY+barH+10);
  }
}

// ── Win screen override for true victory ─────────────────────────────
window._drawVictoryScreen = function(dt) {
  game.winTimer += dt;
  ctx.fillStyle='#000008'; ctx.fillRect(0,0,W,H);
  // Stars
  for(let i=0;i<80;i++){
    ctx.globalAlpha=0.4+Math.sin(Date.now()*0.003+i)*0.3;
    ctx.fillStyle='#ffffff';
    ctx.fillRect((i*137)%W,(i*97)%220,2,2);
  }
  ctx.globalAlpha=1;
  ctx.textAlign='center';
  ctx.shadowColor='#FFD700'; ctx.shadowBlur=24;
  ctx.fillStyle='#FFD700'; ctx.font='bold 42px monospace';
  ctx.fillText('YOU WIN!', W/2, 130);
  ctx.shadowBlur=0;
  ctx.fillStyle='#FF8844'; ctx.font='20px monospace';
  ctx.fillText('The Ancient Dragon has fallen!', W/2, 178);
  ctx.fillStyle='#cc88ff'; ctx.font='14px monospace';
  ctx.fillText('Arcane Crusader — The realm is saved.', W/2, 210);
  const p = game.player;
  ctx.fillStyle='#ffffff'; ctx.font='13px monospace';
  ctx.fillText(`Coins: ${p.coins}   XP: ${p.xp}   Level: ${p.level}   Lives remaining: ${p.lives}`, W/2, 255);
  if (p.fireResistance) { ctx.fillStyle='#44ff44'; ctx.fillText('Dragon Scale bonus achieved!', W/2, 278); }
  const runs = game.runCount || 0;
  if (game.secretWin) {
    ctx.fillStyle='#FFD700'; ctx.font='bold 28px monospace';
    ctx.fillText('GOLDEN CROWN ACHIEVED!', W/2, 310);
    ctx.fillStyle='#ffffaa'; ctx.font='16px monospace';
    ctx.fillText('You are a true Arcane Crusader legend!', W/2, 345);
    if (Math.floor(game.winTimer*2)%2===0) {
      ctx.fillStyle='#ffffff'; ctx.font='bold 15px monospace';
      ctx.fillText('Press ENTER to return to title', W/2, 390);
    }
  } else if (runs < 3) {
    ctx.fillStyle='#aaffaa'; ctx.font='14px monospace';
    ctx.fillText('New Game+: Keep your upgrades, face stronger enemies!', W/2, 310);
    ctx.fillStyle='#ffff88'; ctx.font='13px monospace';
    ctx.fillText('(' + (3-runs) + ' run(s) remaining for the secret Golden Crown)', W/2, 335);
    if (Math.floor(game.winTimer*2)%2===0) {
      ctx.fillStyle='#aaffaa'; ctx.font='bold 15px monospace';
      ctx.fillText('Press ENTER to start New Game+  |  press Q to quit', W/2, 370);
    }
  } else {
    if (Math.floor(game.winTimer*2)%2===0) {
      ctx.fillStyle='#ffffff'; ctx.font='bold 15px monospace';
      ctx.fillText('Press ENTER to return to title', W/2, 330);
    }
  }
  // Firework particles
  if (Math.random()<0.06) {
    spawnBurst(rnd(100,700), rnd(60,250), 20,
      {color:['#FFD700','#ff4488','#44aaff','#88ff44'][Math.floor(Math.random()*4)],
       size:rnd(3,7), vx:rnd(-100,100), vy:rnd(-150,-50), gravity:120, life:0.8});
  }
  drawParticles(0);
};

window._handleWinConfirm = function() {
  const runs = (game.runCount || 0);
  if (game.secretWin) { game = createGame(); game.state = STATE_TITLE; return; }
  if (runs >= 3) {
    // Secret golden crown win!
    game.secretWin = true;
    game.winTimer = 0;
    game.state = STATE_WIN;
    return;
  }
  // New Game+: preserve player upgrades, restart level 1
  const oldP = game.player;
  const newRun = runs + 1;
  game = createGame();
  game.runCount = newRun;
  game.player = oldP;
  oldP.x = 2*32; oldP.y = 11*32;
  oldP.vx = 0; oldP.vy = 0;
  oldP.hp = oldP.maxHp;
  oldP.dead = false; oldP.invincible = 0;
  game.state = STATE_PLAY;
  initEnemies();
  initCollectibles();
};

console.log('[Level 3] Loaded — Dragon\'s Lair ready');
