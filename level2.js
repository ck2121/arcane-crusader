// ═══════════════════════════════════════════════════════════════════
//  LEVEL 2 — The Dark Castle
//  Extends arcane_crusader.html via window.loadLevel(2)
//  Contains: map, moving platform, enemies (Skeleton/DarkKnight/Bat),
//            Dark Sorcerer boss (3 phases)
// ═══════════════════════════════════════════════════════════════════
'use strict';

// ── Tile constants (must match main file) ───────────────────────────
const L2_TS   = 32;
const L2_EMPTY=0, L2_GND=1, L2_PLAT=2, L2_LAVA=3, L2_SPIKE=5, L2_CRUMBLE=6;

// ── Map builder ─────────────────────────────────────────────────────
function buildLevel2() {
  const R = 15, C = 115;
  const map = Array.from({length:R}, ()=>new Array(C).fill(0));
  function fill(r1,r2,c1,c2,t){ for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) if(r>=0&&r<R&&c>=0&&c<C) map[r][c]=t; }
  function row(r,c1,c2,t){ fill(r,r,c1,c2,t); }

  // ── Ground base ──────────────────────────────────────────────────
  fill(13,14, 0, C-1, L2_GND);

  // ── Entrance corridor (cols 0-14) ────────────────────────────────
  // Stone floor level 10 — drawbridge feel
  fill(10,12, 0,14, L2_GND);

  // ── Gap 1 (cols 15-17) — small jump ──────────────────────────────
  fill(10,14, 15,17, L2_EMPTY);

  // ── Mid castle section (cols 18-42) ──────────────────────────────
  fill(10,12, 18,42, L2_GND);
  // Crumbling floor strip (col 24-32, row 10)
  row(10, 24,32, L2_CRUMBLE);
  // Ceiling with stalactite-platform (low ceiling forces duck feel)
  fill(6,7, 20,28, L2_GND);
  // Platform ledge above
  row(7, 32,38, L2_PLAT);
  // Spikes on floor
  row(12, 25,26, L2_SPIKE);
  row(12, 30,31, L2_SPIKE);

  // ── Chasm (cols 43-54) — bridged by moving platform ──────────────
  fill(10,14, 43,54, L2_EMPTY);
  // Lava at chasm bottom
  fill(13,14, 43,54, L2_LAVA);

  // ── Second castle section (cols 55-78) ───────────────────────────
  fill(10,12, 55,78, L2_GND);
  // Upper level passage
  fill(5,7, 58,75, L2_GND);
  // Connecting platform
  row(8, 60,64, L2_PLAT);
  row(8, 68,72, L2_PLAT);
  // Spikes
  row(12, 60,61, L2_SPIKE);
  row(12, 70,71, L2_SPIKE);

  // ── Gap 2 (cols 79-83) ───────────────────────────────────────────
  fill(10,14, 79,83, L2_EMPTY);
  fill(13,14, 79,83, L2_LAVA);

  // ── Ascending staircase section (cols 84-95) ─────────────────────
  fill(12,12, 84,87, L2_GND);
  fill(11,11, 87,90, L2_GND);
  fill(10,10, 90,93, L2_GND);
  fill(9,9,   93,95, L2_GND);

  // ── Boss arena — Great Hall (cols 96-114) ─────────────────────────
  fill(10,14, 96,114, L2_GND);
  // Arena side walls
  fill(0,6,  96, 96, L2_GND);
  fill(0,9, 114,114, L2_GND);
  // Chandelier platform (centre top)
  row(4, 101,109, L2_PLAT);
  // Two side platforms for dodging
  row(7, 98,101, L2_PLAT);
  row(7, 109,112, L2_PLAT);

  return { map, rows:R, cols:C, tileSize:L2_TS };
}

function getLevel2Enemies() {
  return [
    {type:'skeleton', tx:4,  ty:9},
    {type:'skeleton', tx:11, ty:9},
    {type:'bat',      tx:22, ty:5},
    {type:'bat',      tx:28, ty:5},
    {type:'skeleton', tx:20, ty:9},
    {type:'darkKnight',tx:36,ty:9},
    {type:'bat',      tx:40, ty:5},
    {type:'skeleton', tx:58, ty:9},
    {type:'bat',      tx:64, ty:4},
    {type:'darkKnight',tx:68,ty:9},
    {type:'skeleton', tx:73, ty:9},
    {type:'bat',      tx:72, ty:4},
    {type:'skeleton', tx:86, ty:11},
    {type:'darkKnight',tx:91,ty:8},
  ];
}

function getLevel2Collectibles() {
  return [
    {type:'coin', tx:2,  ty:9},  {type:'coin', tx:7,  ty:9},
    {type:'coin', tx:13, ty:9},  {type:'coin', tx:19, ty:9},
    {type:'coin', tx:33, ty:6},  {type:'coin', tx:35, ty:6},
    {type:'coin', tx:37, ty:6},
    {type:'healthPotion', tx:46, ty:9},
    {type:'coin', tx:57, ty:9},  {type:'coin', tx:63, ty:9},
    {type:'coin', tx:60, ty:7},  {type:'coin', tx:69, ty:7},
    {type:'manaCrystal', tx:76, ty:9},
    {type:'coin', tx:85, ty:11}, {type:'coin', tx:88, ty:10},
    {type:'coin', tx:91, ty:8},  {type:'coin', tx:93, ty:8},
    {type:'healthPotion', tx:110,ty:9},
    {type:'bomb',        tx:10,  ty:10},
    {type:'bomb',        tx:50,  ty:9},
    {type:'bomb',        tx:91,  ty:10},
    {type:'healthPotion',tx:26,  ty:10},
    {type:'healthPotion',tx:70,  ty:10},
    {type:'chest',       tx:8,   ty:10},
    {type:'chest',       tx:62,  ty:10},
    {type:'chest',       tx:94,  ty:9},
  ];
}

function getLevel2Checkpoints() {
  return [0, 55*L2_TS, 96*L2_TS];
}

// ── Moving platform (the chasm bridge) ──────────────────────────────
function buildLevel2MovingPlatforms() {
  return [{
    x: 43*L2_TS, y: 9*L2_TS,   // start position
    w: 64, h: 10,
    axis: 'x',
    min: 43*L2_TS, max: 52*L2_TS,
    speed: 55, dir: 1,
    dx: 0,                        // how far it moved THIS frame (set in update)
  }];
}

// ── Enemy definitions (appended to main ENEMY_DEFS) ─────────────────
const L2_ENEMY_DEFS = {
  skeleton: {
    hp:50, w:22, h:32, xp:20, coins:6, speed:50,
    color:'#c8c8c8', accentColor:'#888', dmg:10,
  },
  darkKnight: {
    hp:120, w:28, h:40, xp:40, coins:15, speed:38,
    color:'#2a2a4a', accentColor:'#5555aa', dmg:20,
  },
  bat: {
    hp:30, w:20, h:14, xp:12, coins:4, speed:80,
    color:'#441144', accentColor:'#882288', dmg:8, flying:true,
  },
};

// ── Entry point called by main game ─────────────────────────────────
window.loadLevel = function(n) {
  if (n === 2) _loadLevel2();
  else if (n === 3 && typeof _loadLevel3 === 'function') _loadLevel3();
  else { game.state = STATE_WIN; }
};

function _loadLevel2() {
  game.currentLevel = 2;
  game.level = 2;
  game.levelData = buildLevel2();
  game.enemies = [];
  game.projectiles = [];
  game.collectibles = [];
  game.movingPlatforms = buildLevel2MovingPlatforms();
  game.checkpoints = getLevel2Checkpoints();
  game.lastCheckpoint = 0;
  game.bossSpawned = false;
  game.boss = null;
  game.levelComplete = false;
  game.levelCompleteTimer = 0;
  game._showLevelComplete = false;
  game.camX = 0;
  // Merge L2 enemy defs
  Object.assign(ENEMY_DEFS, L2_ENEMY_DEFS);
  // Reset player position, full heal
  const p = game.player;
  p.x = 2*L2_TS; p.y = 8*L2_TS;
  p.vx = 0; p.vy = 0;
  p.hp = p.maxHp; p.mana = p.maxMana;
  p.invincible = 0; p.dead = false;
  p.lives = Math.max(p.lives, 1);
  // Init enemies & collectibles using main helpers
  _initL2Enemies();
  _initL2Collectibles();
  if (typeof MusicEngine !== 'undefined') MusicEngine.start(2);
  game.state = STATE_PLAY;
}

function _initL2Enemies() {
  const sc = 1 + (game.runCount || 0) * 0.5;
  for (const def of getLevel2Enemies()) {
    const d = L2_ENEMY_DEFS[def.type] || ENEMY_DEFS[def.type];
    const e = {
      type: def.type,
      x: def.tx*L2_TS, y: def.ty*L2_TS - (d.h||28),
      w: d.w, h: d.h, vx:0, vy:0,
      hp: d.hp, maxHp: d.hp, xp: d.xp, coins: d.coins,
      alive: true, onGround: false, facingRight: false,
      state:'patrol', stateTimer:0,
      patrolDir: Math.random()<0.5?1:-1, patrolTimer: rnd(1,3),
      hitFlash:0, deathTimer:0, slowTimer:0,
      color: d.color, accentColor: d.accentColor,
      dmg: d.dmg,
      // Skeleton-specific
      reformed: false, reformTimer: 0,
      // Bat-specific
      flying: !!d.flying,
      baseY: def.ty*L2_TS,
      sinePhase: Math.random()*Math.PI*2,
      // Dark Knight
      blocking: false, blockTimer: 0,
      shootTimer: rnd(2,3.5),
    };
    e.hp = Math.round(e.hp * sc); e.maxHp = e.hp;
    game.enemies.push(e);
  }
}

function _initL2Collectibles() {
  for (const def of getLevel2Collectibles()) {
    game.collectibles.push({
      type: def.type,
      x: def.tx*L2_TS + L2_TS/2 - 8,
      y: def.ty*L2_TS - 16,
      w:16, h:16, alive:true,
      bobTimer: Math.random()*Math.PI*2,
    });
  }
}

// ── Moving platform update ───────────────────────────────────────────
// Called from the main game loop patch below
function updateL2MovingPlatforms(dt) {
  if (!game.movingPlatforms) return;
  for (const mp of game.movingPlatforms) {
    const prev = mp.x;
    mp.x += mp.dir * mp.speed * dt;
    if (mp.x >= mp.max) { mp.x = mp.max; mp.dir = -1; }
    if (mp.x <= mp.min) { mp.x = mp.min; mp.dir =  1; }
    mp.dx = mp.x - prev;
    // Land on platform (one-way from above) + carry
    const p = game.player;
    if (!p.dead) {
      const prevFeet = (p.prevY !== undefined ? p.prevY : p.y) + p.h;
      const feetY = p.y + p.h;
      const overlapX = p.x + p.w > mp.x && p.x < mp.x + mp.w;
      if (p.vy >= 0 && prevFeet <= mp.y + 2 && feetY >= mp.y && overlapX) {
        p.y = mp.y - p.h; p.vy = 0; p.onGround = true;
      }
      if (p.onGround && Math.abs((p.y + p.h) - mp.y) <= 2 && overlapX) {
        p.x += mp.dx;
      }
    }
  }
}

// ── Enemy AI: Level 2 types ──────────────────────────────────────────
function updateL2EnemyAI(e, dt) {
  const p = game.player;
  if (e.type === 'skeleton')   updateSkeleton(e, dt, p);
  else if (e.type === 'darkKnight') updateDarkKnight(e, dt, p);
  else if (e.type === 'bat')   updateBat(e, dt, p);
}

function updateSkeleton(e, dt, p) {
  const speed = e.slowTimer > 0 ? 25 : 50;
  const px = p.x + p.w/2, ex = e.x + e.w/2;
  const dist = Math.abs(px - ex);
  if (e.state === 'patrol') {
    e.vx = e.patrolDir * speed;
    e.facingRight = e.patrolDir > 0;
    e.patrolTimer -= dt;
    if (e.patrolTimer <= 0) { e.patrolDir *= -1; e.patrolTimer = rnd(1.5,3); }
    if (dist < 180 && !p.dead) e.state = 'charge';
  } else {
    const dir = px > ex ? 1 : -1;
    e.vx = dir * (speed * 1.3);
    e.facingRight = dir > 0;
    if (dist > 220) e.state = 'patrol';
  }
  // Reform mechanic: when killed the first time, revive after 5s
  if (!e.alive && !e.reformed && e.reformTimer > 0) {
    e.reformTimer -= dt;
    if (e.reformTimer <= 0) {
      e.alive = true;
      e.reformed = true;
      e.hp = e.maxHp;
      e.deathTimer = 0;
      spawnBurst(e.x+e.w/2, e.y+e.h/2, 12, {color:'#c8c8c8'});
    }
  }
}

function updateDarkKnight(e, dt, p) {
  const speed = e.slowTimer > 0 ? 20 : 38;
  const px = p.x + p.w/2, ex = e.x + e.w/2;
  const dist = Math.abs(px - ex);
  // Always face player
  e.facingRight = px > ex;
  // Block when player is in front and close
  e.blocking = dist < 120;
  if (e.state === 'patrol') {
    e.vx = e.patrolDir * speed;
    e.patrolTimer -= dt;
    if (e.patrolTimer <= 0) { e.patrolDir *= -1; e.patrolTimer = rnd(2,4); }
    if (dist < 160 && !p.dead) { e.state = 'charge'; e.stateTimer = 1.5; }
  } else if (e.state === 'charge') {
    const dir = px > ex ? 1 : -1;
    e.vx = dir * (speed * 2.2);
    e.facingRight = dir > 0;
    if (e.stateTimer <= 0 || dist < 40) { e.state = 'patrol'; e.vx = 0; }
  }
}

function updateBat(e, dt, p) {
  // Flying — ignore gravity, sine-wave movement
  e.vy = 0;
  e.onGround = false;
  e.sinePhase += dt * 2.5;
  const px = p.x + p.w/2, ex = e.x + e.w/2;
  const dist = Math.abs(px - ex);
  if (dist < 200 && !p.dead) {
    // Swoop toward player
    const dir = px > ex ? 1 : -1;
    e.vx = dir * 80;
    e.vy = (p.y - e.y) * 0.8;
    e.facingRight = dir > 0;
  } else {
    e.vx = e.patrolDir * 40;
    e.y = e.baseY + Math.sin(e.sinePhase) * 30;
    e.facingRight = e.patrolDir > 0;
    e.patrolTimer -= dt;
    if (e.patrolTimer <= 0) { e.patrolDir *= -1; e.patrolTimer = rnd(1,2.5); }
  }
}

// ── Enemy draw: Level 2 types ────────────────────────────────────────
function drawL2Enemy(e, camX) {
  if (!e.alive && e.deathTimer <= 0) return;
  const alpha = e.alive ? 1 : e.deathTimer/0.5;
  ctx.globalAlpha = alpha;
  const ex = Math.round(e.x - camX), ey = Math.round(e.y);
  const flash = e.hitFlash > 0;
  if (e.type === 'skeleton')   drawSkeleton(ex, ey, e, flash);
  else if (e.type === 'darkKnight') drawDarkKnight(ex, ey, e, flash);
  else if (e.type === 'bat')   drawBat(ex, ey, e, flash);
  // HP bar
  if (e.alive && e.hp < e.maxHp) {
    ctx.fillStyle='#300'; ctx.fillRect(ex, ey-8, e.w, 4);
    ctx.fillStyle='#0f0'; ctx.fillRect(ex, ey-8, e.w*(e.hp/e.maxHp), 4);
  }
  ctx.globalAlpha = 1;
}

function drawSkeleton(ex, ey, e, flash) {
  const c = flash ? '#fff' : '#c8c8c8';
  const sx = e.facingRight ? 1 : -1;
  ctx.save();
  ctx.translate(ex+e.w/2, ey+e.h/2);
  ctx.scale(sx,1);
  const bx=-e.w/2, by=-e.h/2;
  ctx.fillStyle = c;
  // Ribcage body
  ctx.fillRect(bx+4, by+12, e.w-8, e.h-16);
  // Rib lines
  ctx.strokeStyle = flash ? '#fff' : '#888';
  ctx.lineWidth = 1;
  for (let i=0;i<3;i++) ctx.strokeRect(bx+5, by+13+i*5, e.w-10, 3);
  // Head skull
  ctx.fillStyle = c;
  ctx.fillRect(bx+4, by, e.w-8, 12);
  // Eye sockets
  ctx.fillStyle = flash ? '#fff' : '#222';
  ctx.fillRect(bx+6, by+3, 4, 4);
  ctx.fillRect(bx+e.w-10, by+3, 4, 4);
  // Sword arm
  ctx.fillStyle = '#aaa';
  ctx.fillRect(bx+e.w-2, by+10, 3, 18);
  ctx.restore();
}

function drawDarkKnight(ex, ey, e, flash) {
  const c1 = flash ? '#fff' : '#2a2a4a';
  const c2 = flash ? '#fff' : '#5555aa';
  const sx = e.facingRight ? 1 : -1;
  ctx.save();
  ctx.translate(ex+e.w/2, ey+e.h/2);
  ctx.scale(sx,1);
  const bx=-e.w/2, by=-e.h/2;
  // Body armour
  ctx.fillStyle = c1;
  ctx.fillRect(bx+2, by+14, e.w-4, e.h-14);
  // Chest plate
  ctx.fillStyle = c2;
  ctx.fillRect(bx+4, by+16, e.w-8, 14);
  // Big shoulder pads
  ctx.fillStyle = c2;
  ctx.fillRect(bx-4, by+12, 10, 10);
  ctx.fillRect(bx+e.w-6, by+12, 10, 10);
  // Helmet
  ctx.fillStyle = c1;
  ctx.fillRect(bx+4, by+2, e.w-8, 14);
  ctx.fillRect(bx+3, by, e.w-6, 6);
  // Visor slit
  ctx.fillStyle = flash ? '#fff' : '#cc4400';
  ctx.fillRect(bx+6, by+7, e.w-12, 3);
  // Shield (when blocking)
  if (e.blocking) {
    ctx.fillStyle = '#4444aa';
    ctx.fillRect(bx+e.w-4, by+10, 8, 20);
    ctx.strokeStyle = '#aaaaff'; ctx.lineWidth=1;
    ctx.strokeRect(bx+e.w-4, by+10, 8, 20);
  }
  // Sword
  ctx.fillStyle = '#ccc';
  ctx.fillRect(bx-6, by+14, 4, 22);
  ctx.restore();
}

function drawBat(ex, ey, e, flash) {
  const c = flash ? '#fff' : '#441144';
  const wing = flash ? '#fff' : '#882288';
  const flap = Math.sin(Date.now()*0.02)*0.3;
  ctx.save();
  ctx.translate(ex+e.w/2, ey+e.h/2);
  if (!e.facingRight) ctx.scale(-1,1);
  // Wings
  ctx.fillStyle = wing;
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.bezierCurveTo(-14, -6+flap*8, -18, 6+flap*4, -10, 10);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.bezierCurveTo(14, -6+flap*8, 18, 6+flap*4, 10, 10);
  ctx.fill();
  // Body
  ctx.fillStyle = c;
  ctx.beginPath(); ctx.ellipse(0, 2, 6, 7, 0, 0, Math.PI*2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#ff2200';
  ctx.fillRect(2, -1, 3, 2);
  ctx.restore();
}

// ── Dark Sorcerer Boss ───────────────────────────────────────────────
function spawnL2Boss() {
  game.boss = {
    type:'sorcerer',
    x: 100*L2_TS, y: 9*L2_TS,
    w:40, h:52,
    vx:0, vy:0,
    hp:500, maxHp:500,
    alive:true, onGround:false,
    phase:1, facingRight:false,
    hitFlash:0, deathTimer:0,
    state:'idle', stateTimer:2,
    prevY: 9*L2_TS,
    // attack timers
    orbTimer:2, teleTimer:8,
    shieldHp:0, shieldBroken:false,  // phase 3 shield
    arenaLeft:  97*L2_TS,
    arenaRight: 113*L2_TS,
  };
}

function updateL2Boss(dt) {
  const boss = game.boss;
  if (!boss || !boss.alive || boss.type !== 'sorcerer') return;
  boss.hitFlash = Math.max(0, boss.hitFlash-dt);
  boss.stateTimer -= dt;
  const p = game.player;
  const px = p.x+p.w/2, py = p.y+p.h/2;
  const bx = boss.x+boss.w/2, by = boss.y+boss.h/2;
  boss.facingRight = px > bx;

  // Phase transitions
  if (boss.hp<=150 && boss.phase<3) { boss.phase=3; boss.stateTimer=1.5; }
  else if (boss.hp<=300 && boss.phase<2) { boss.phase=2; boss.stateTimer=1; }

  // Gravity (sorcerer floats a bit — reduced gravity)
  boss.vy = Math.min(boss.vy + 400*dt, TERM_VEL);
  boss.prevY = boss.y;
  boss.y += boss.vy*dt;
  boss.onGround = false;
  resolveY(boss, game);

  // ── Teleport ──────────────────────────────────────────────────────
  boss.teleTimer -= dt;
  if (boss.teleTimer <= 0) {
    boss.teleTimer = boss.phase>=2 ? 5 : 8;
    // Flash and jump to opposite side
    spawnBurst(bx, by, 20, {color:'#440066', size:8});
    boss.x = px > bx ? boss.arenaLeft : boss.arenaRight - boss.w;
    boss.y = 9*L2_TS;
    boss.vy = 0;
    spawnBurst(boss.x+boss.w/2, boss.y+boss.h/2, 20, {color:'#8800cc', size:8});
  }

  // ── Fire orbs ─────────────────────────────────────────────────────
  boss.orbTimer -= dt;
  const orbInterval = boss.phase>=3 ? 0.6 : boss.phase>=2 ? 1.0 : 1.4;
  if (boss.orbTimer <= 0 && !p.dead) {
    boss.orbTimer = orbInterval;
    const count = boss.phase>=3 ? 5 : boss.phase>=2 ? 2 : 1;
    for (let i=0;i<count;i++) {
      const ang = count>1 ? (i/(count-1)-0.5)*0.8 : 0;
      const dir = boss.facingRight ? 1 : -1;
      game.projectiles.push({
        type:'darkOrb', x:bx, y:by,
        w:14, h:14, vx:dir*160+Math.sin(ang)*80, vy:-120+Math.cos(ang)*80,
        dmg:14, owner:'enemy', alive:true,
        // homing
        homing:true, homingStrength:60,
        targetX:px, targetY:py,
      });
    }
    // Phase 2+: summon skeletons
    if (boss.phase>=2 && boss.stateTimer<=0) {
      boss.stateTimer = 8;
      const spawnX = boss.facingRight ? boss.arenaLeft : boss.arenaRight-22;
      const sk = {
        type:'skeleton', x:spawnX, y:11*L2_TS,
        w:22,h:32,vx:0,vy:0, hp:50,maxHp:50, xp:0,coins:0,
        alive:true, onGround:false, facingRight:false,
        state:'patrol', stateTimer:0, patrolDir:1, patrolTimer:2,
        hitFlash:0, deathTimer:0, slowTimer:0, reformed:true,
        reformTimer:0, blocking:false, blockTimer:0, shootTimer:0,
        flying:false, baseY:11*L2_TS, sinePhase:0, dmg:10,
        color:'#c8c8c8', accentColor:'#888',
      };
      game.enemies.push(sk);
    }
  }

  // Phase 3: shield barrier
  if (boss.phase>=3 && !boss.shieldBroken && boss.shieldHp<=0) boss.shieldHp = 10;

  // Touch damage
  if (!p.dead && p.invincible<=0 && aabbOverlap(p.x,p.y,p.w,p.h,boss.x,boss.y,boss.w,boss.h)) {
    damagePlayer(16, true);
  }
  // Hard-clamp to arena
  boss.x = Math.max(boss.arenaLeft, Math.min(boss.arenaRight - boss.w, boss.x));
}

function hitL2Boss(boss, dmg) {
  if (!boss.alive) return;
  if (boss.phase>=3 && boss.shieldHp>0) {
    if (--boss.shieldHp <= 0) boss.shieldBroken = true;
    spawnBurst(boss.x+boss.w/2, boss.y+boss.h/2, 4, {color:'#8800cc', size:6});
    spawnDmgNum(boss.x+boss.w/2, boss.y-5, 'BLOCK', '#aa44ff');
    return;
  }
  boss.hp -= dmg;
  boss.hitFlash = 0.15;
  spawnDmgNum(boss.x+boss.w/2, boss.y-5, dmg, '#cc44ff');
  spawnBurst(boss.x+boss.w/2, boss.y+boss.h/2, 5, {color:'#8800cc', size:4});
  triggerShake(3, 0.12);
  if (boss.hp<=0) killL2Boss(boss);
}

function killL2Boss(boss) {
  if(typeof SFX!=='undefined') SFX.bossDefeat();
  boss.alive=false; boss.hp=0; boss.deathTimer=2;
  game.player.xp += 200; game.player.coins += 120;
  spawnBurst(boss.x+boss.w/2, boss.y+boss.h/2, 50, {color:'#8800cc', size:8});
  triggerShake(8, 0.5);
  setTimeout(()=>{ game.levelComplete=true; game.levelCompleteTimer=3; }, 2000);
}

function drawL2Boss(camX) {
  const boss = game.boss;
  if (!boss || boss.type!=='sorcerer') return;
  const bx=Math.round(boss.x-camX), by=Math.round(boss.y);
  const alpha = boss.alive ? 1 : Math.max(0, boss.deathTimer/2);
  ctx.globalAlpha = alpha;
  const flash = boss.hitFlash>0;
  const robe = flash ? '#fff' : '#220044';
  const accent = flash ? '#fff' : '#8800cc';

  // Robe body
  ctx.fillStyle = robe;
  ctx.fillRect(bx+4, by+18, boss.w-8, boss.h-18);
  // Robe hem (wider)
  ctx.fillRect(bx, by+boss.h-14, boss.w, 14);
  // Chest
  ctx.fillStyle = accent;
  ctx.fillRect(bx+6, by+20, boss.w-12, 14);
  // Head
  ctx.fillStyle = '#d0a080'; // pale face
  ctx.fillRect(bx+8, by+6, boss.w-16, 14);
  // Tall dark hat
  ctx.fillStyle = robe;
  ctx.fillRect(bx+10, by-10, boss.w-20, 18);
  ctx.fillRect(bx+4,  by+2,  boss.w-8,  6);
  // Eyes — glowing purple
  const eyeGlow = Math.sin(Date.now()*0.007)*0.4+0.6;
  ctx.fillStyle = `rgba(180,0,255,${eyeGlow})`;
  ctx.fillRect(bx+10, by+10, 6, 4);
  ctx.fillRect(bx+boss.w-16, by+10, 6, 4);
  // Staff
  ctx.fillStyle = '#5a3000';
  ctx.fillRect(bx+boss.w-2, by-14, 4, boss.h-4);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(bx+boss.w, by-14, 7, 0, Math.PI*2);
  ctx.fill();
  // Phase 3 shield
  if (boss.alive && boss.phase>=3 && boss.shieldHp>0) {
    ctx.strokeStyle = `rgba(136,0,204,${0.5+Math.sin(Date.now()*0.01)*0.3})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(bx+boss.w/2, by+boss.h/2, boss.w/2+12, boss.h/2+12, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle='#fff'; ctx.font='9px monospace'; ctx.textAlign='center';
    ctx.fillText(`SHIELD ${boss.shieldHp}/10`, bx+boss.w/2, by-16);
  }
  ctx.globalAlpha = 1;

  // Boss HP bar
  if (boss.alive) {
    const barW=200, barH=10, barX=W/2-100, barY=50;
    ctx.fillStyle='#110022'; ctx.fillRect(barX,barY,barW,barH);
    const ratio=Math.max(0,boss.hp/boss.maxHp);
    ctx.fillStyle=ratio>0.5?'#8800cc':ratio>0.25?'#cc44ff':'#ff00ff';
    ctx.fillRect(barX,barY,barW*ratio,barH);
    ctx.strokeStyle='#440066'; ctx.lineWidth=1; ctx.strokeRect(barX,barY,barW,barH);
    ctx.fillStyle='#fff'; ctx.font='bold 10px monospace'; ctx.textAlign='center';
    ctx.fillText(`DARK SORCERER  ${boss.hp}/${boss.maxHp}`, W/2, barY-2);
    ctx.fillStyle='#cc88ff'; ctx.fillText(`Phase ${boss.phase}`, W/2, barY+barH+10);
  }
}

// ── Dark-orb projectile homing update ───────────────────────────────
// Patch into main updateProjectiles via exported hook
window._updateExtraProjectile = function(proj, dt) {
  if (proj.type==='darkOrb' && proj.homing) {
    const p = game.player;
    const px=p.x+p.w/2, py=p.y+p.h/2;
    const dx=px-proj.x, dy=py-proj.y;
    const len=Math.hypot(dx,dy)||1;
    proj.vx += (dx/len)*proj.homingStrength*dt;
    proj.vy += (dy/len)*proj.homingStrength*dt;
  }
};

// Dark orb draw
window._drawExtraProjectile = function(proj, camX) {
  if (proj.type==='darkOrb') {
    const pulse=Math.sin(Date.now()*0.012)*0.3+0.7;
    ctx.fillStyle=`rgba(136,0,204,${pulse})`;
    ctx.beginPath();
    ctx.arc(proj.x-camX+proj.w/2, proj.y+proj.h/2, proj.w/2, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle='#ff88ff';
    ctx.beginPath();
    ctx.arc(proj.x-camX+proj.w/2, proj.y+proj.h/2, proj.w/4, 0, Math.PI*2);
    ctx.fill();
    return true; // handled
  }
  return false;
};

// ── Boss spawn trigger ───────────────────────────────────────────────
window._checkL2BossSpawn = function() {
  if (game.currentLevel===2 && !game.bossSpawned && game.player.x > 95*L2_TS) {
    game.bossSpawned = true;
    spawnL2Boss();
  }
};

// ── Drawing background for Level 2 ──────────────────────────────────
window._drawL2Background = function(camX) {
  // Dark castle gradient
  const grad=ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#060010');
  grad.addColorStop(0.5,'#0d0020');
  grad.addColorStop(1,'#1a1030');
  ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
  // Distant torch flickers
  const off=camX*0.25;
  ctx.fillStyle='#ff8800';
  for (let i=0;i<8;i++) {
    const tx=((i*180-off)%W+W)%W;
    const flicker=Math.sin(Date.now()*0.012+i*1.3)*0.4+0.6;
    ctx.globalAlpha=flicker*0.4;
    ctx.beginPath(); ctx.arc(tx, 80+i*18%60, 6, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;
};

// ── Tile rendering for Level 2 ───────────────────────────────────────
window._drawL2Tile = function(t, tx, ty, c) {
  if (t===L2_GND) {
    ctx.fillStyle='#2a2a3a'; ctx.fillRect(tx,ty,L2_TS,L2_TS);
    ctx.fillStyle='#1a1a2a';
    if (c%2===0) ctx.fillRect(tx,ty,L2_TS/2,L2_TS/2);
    else ctx.fillRect(tx+L2_TS/2,ty+L2_TS/2,L2_TS/2,L2_TS/2);
    ctx.strokeStyle='#111'; ctx.lineWidth=1; ctx.strokeRect(tx,ty,L2_TS,L2_TS);
    return true;
  }
  if (t===L2_PLAT) {
    ctx.fillStyle='#3a3a5a'; ctx.fillRect(tx,ty,L2_TS,8);
    ctx.fillStyle='#5555aa'; ctx.fillRect(tx,ty,L2_TS,3);
    return true;
  }
  if (t===L2_CRUMBLE) {
    const key=`${Math.floor(ty/L2_TS)},${Math.floor((tx+game.camX)/L2_TS)}`;
    const s = (game.crumbleState && game.crumbleState[key]) || null;
    if (s && s.crumbled) return true; // invisible when crumbled
    const crack = s ? Math.min(1, s.timer) : 0;
    ctx.fillStyle=`rgb(${42+crack*40},${42-crack*20},${58-crack*30})`;
    ctx.fillRect(tx,ty,L2_TS,L2_TS);
    if (crack>0.3) {
      ctx.strokeStyle='#111'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(tx+4,ty+8); ctx.lineTo(tx+20,ty+24); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx+18,ty+6); ctx.lineTo(tx+10,ty+26); ctx.stroke();
    }
    return true;
  }
  return false;
};

// ── Crumble system ───────────────────────────────────────────────────
window._updateCrumble = function(dt) {
  if (!game.crumbleState) game.crumbleState = {};
  const p = game.player;
  if (!p.onGround) return;
  const {map} = game.levelData;
  // Check if player stands on a crumble tile
  const feetR = Math.floor((p.y+p.h)/L2_TS);
  for (let c=Math.floor(p.x/L2_TS); c<=Math.floor((p.x+p.w-1)/L2_TS); c++) {
    const t=(map[feetR]||[])[c];
    if (t===L2_CRUMBLE) {
      const key=`${feetR},${c}`;
      if (!game.crumbleState[key]) game.crumbleState[key]={timer:0, crumbled:false, restoreTimer:0};
      const s=game.crumbleState[key];
      if (!s.crumbled) {
        s.timer+=dt;
        if (s.timer>=1) { s.crumbled=true; s.restoreTimer=3; }
      }
    }
  }
  // Restore and decay
  for (const key in game.crumbleState) {
    const s=game.crumbleState[key];
    if (s.crumbled) {
      s.restoreTimer-=dt;
      if (s.restoreTimer<=0) { delete game.crumbleState[key]; }
    }
  }
};

// Override resolveY for crumble (treat crumbled tiles as empty)
const _origGetTile = window._getTileOverride;
window._getTileOverride = function(map, r, c) {
  const key=`${r},${c}`;
  if (game.crumbleState && game.crumbleState[key] && game.crumbleState[key].crumbled) return 0;
  return null; // fall through to default
};

// ── Exposed hooks used by the main game loop ─────────────────────────
// The main HTML calls these if they exist, after each update/draw call.

console.log('[Level 2] Loaded — Dark Castle ready');
