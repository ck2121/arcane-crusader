# Arcane Crusader — Product Requirements Document

**Version:** 1.0  
**Date:** May 22, 2026  
**Status:** Draft  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Game Overview](#2-game-overview)
3. [Target Audience](#3-target-audience)
4. [Core Gameplay Loop](#4-core-gameplay-loop)
5. [Player Character](#5-player-character)
6. [Combat System](#6-combat-system)
7. [Level Design](#7-level-design)
8. [Enemy Design](#8-enemy-design)
9. [Boss Design](#9-boss-design)
10. [Progression Systems](#10-progression-systems)
11. [Power-Ups & Collectibles](#11-power-ups--collectibles)
12. [The Upgrade Shop](#12-the-upgrade-shop)
13. [User Interface & HUD](#13-user-interface--hud)
14. [Controls Reference](#14-controls-reference)
15. [Technical Requirements](#15-technical-requirements)
16. [Win / Lose Conditions](#16-win--lose-conditions)
17. [Out of Scope (v1.0)](#17-out-of-scope-v10)

---

## 1. Executive Summary

**Arcane Crusader** is a browser-based, side-scrolling action-platformer inspired by Super Mario Bros. but layered with fantasy combat, elemental magic, ranged weapons, throwable items, and a persistent upgrade system. The player controls a powerful Wizard-Knight through three escalating levels — a Burning Village, a Dark Castle, and a Dragon's Lair — defeating enemies, collecting coins and XP, and spending resources at an inter-level shop to upgrade their character before each new challenge.

The game is delivered as a single self-contained HTML file, playable in any modern desktop web browser with no installation required.

---

## 2. Game Overview

| Field | Value |
|---|---|
| **Title** | Arcane Crusader |
| **Genre** | Side-scrolling Action Platformer |
| **Platform** | Web Browser (HTML5 Canvas) |
| **Delivery Format** | Single `.html` file |
| **Number of Levels** | 3 (+ 2 inter-level shop screens) |
| **Estimated Play Time** | 20–40 minutes per full run |
| **Difficulty** | Classic (Mario-style: 3 lives, skill-gated bosses) |
| **Theme** | Fantasy / Medieval |
| **Tagline** | *Sword, staff, and sorcery — the realm depends on you.* |

---

## 3. Target Audience

- **Primary:** Casual to mid-core gamers aged 12–40 who enjoy retro platformers.
- **Secondary:** Browser game players looking for something deeper than a simple runner.
- **Tertiary:** Family members playing together, with one player coaching another.

The Classic difficulty setting ensures the game is approachable but not trivial — mastering the spell rotation and shop strategy separates good runs from great ones.

---

## 4. Core Gameplay Loop

```
START
  │
  ▼
Title Screen / Menu
  │
  ▼
Level Play (platforming + combat)
  ├── Collect coins & XP
  ├── Defeat enemies (melee / ranged / spells / bombs)
  ├── Find power-up collectibles
  └── Reach boss arena → defeat boss
  │
  ▼
Inter-Level Shop Screen
  ├── Spend coins on upgrades
  └── Review stats before next level
  │
  ▼
Next Level  ──►  (repeat)
  │
  ▼
Level 3 Boss Defeated
  │
  ▼
Victory Screen / Credits
```

**Session loop summary:** Run → Fight → Collect → Upgrade → Repeat.

---

## 5. Player Character

### 5.1 Identity

The player is a **Wizard-Knight**: a warrior who has fused heavy plate armor with arcane robes and a magical staff. Visually they are tall and imposing, dressed in deep purple robes with silver armor accents and a glowing staff on their back.

### 5.2 Feel & Movement Philosophy

The character feels **weighty and powerful** — not sluggish, but deliberate. Movement has meaningful momentum: the player must plan jumps, can't instantly stop mid-run, and attacks carry a sense of real force. This contrasts with the lighter, floatier feel of classic Mario.

### 5.3 Base Stats

| Stat | Starting Value | Notes |
|---|---|---|
| Max Health (HP) | 100 | Upgradable at shop |
| Max Mana | 60 | Used by spells; regenerates slowly |
| Lives | 3 | Lose a life when HP reaches 0 |
| Coins | 0 | Spent at shop |
| XP | 0 | Gained from kills; triggers level-ups |
| Player Level | 1 | Max level 5 |
| Move Speed | 180 px/s | Upgradable |
| Jump Velocity | −420 px/s | Standard double-jump requires upgrade |
| Gravity | 900 px/s² | Creates heavy, decisive feel |

### 5.4 Animation States

| State | Description |
|---|---|
| Idle | Standing still; staff gently pulses |
| Running | 4-frame run cycle |
| Jumping | Body rises, robe trails |
| Falling | Body descends |
| Sword Attack | Forward slash with visible swing arc |
| Magic Bolt | Staff raises; bolt fires forward |
| Casting Spell | Full cast animation with elemental particle burst |
| Throwing Bomb | Overhead arc throw |
| Hit | Brief flash and knockback |
| Death | Crumple; fade to black |

---

## 6. Combat System

The player has four distinct offensive tools, all usable at any time in any combination:

### 6.1 Melee — Sword Strike

- **Input:** `J` key (or `Z`)
- **Range:** 32 px in front of the player
- **Damage:** 15–25 (base); upgradable
- **Cooldown:** 0.4 seconds
- **Effect:** Hits all enemies within the swing arc; causes knockback
- **Visual:** Animated slash arc in front of the character

### 6.2 Ranged — Magic Bolt

- **Input:** `K` key (or `X`)
- **Damage:** 20 (base); upgradable
- **Mana Cost:** 10
- **Cooldown:** 0.6 seconds
- **Projectile Speed:** 400 px/s
- **Effect:** Travels horizontally until it hits an enemy or solid tile; pierces one enemy with upgrade
- **Visual:** Glowing blue energy orb

### 6.3 Active Spells — Elemental Magic

- **Input:** `L` key (or `C`) to cast; `1 / 2 / 3` to switch active spell
- **Three Spells:**

| # | Spell | Damage | Mana Cost | Cooldown | Effect |
|---|---|---|---|---|---|
| 1 | **Fireball Burst** | 15 × 3 projectiles | 15 | 1.2 s | Three fireballs spread in a cone |
| 2 | **Ice Lance** | 20 + slow | 20 | 1.5 s | Cone of frost; slows enemies 50% for 3 s |
| 3 | **Chain Lightning** | 25 (chains to 2 more enemies) | 25 | 2.0 s | Bolt jumps between up to 3 nearby enemies |

- All spells are available from the start; upgraded versions are purchasable in the shop.

### 6.4 Throwable — Bomb

- **Input:** `F` key
- **Damage:** 40 (AoE radius 64 px)
- **Inventory:** Starts with 0; purchased in shop (sold in packs of 3)
- **Trajectory:** Arc throw; detonates on contact with enemy or tile
- **Visual:** Lit fuse bomb with explosion particle burst on detonation

### 6.5 Combat Feel

- All successful hits trigger a brief screen flash on the enemy
- Heavy hits (sword, explosion) trigger a subtle screen shake
- Enemies display a floating damage number on hit
- Killing an enemy plays a particle burst and coin/XP pop-up

---

## 7. Level Design

### 7.1 Global Level Structure

Each level follows this flow:

```
[Start Zone] → [Combat Encounter 1] → [Platforming Section] →
[Combat Encounter 2] → [Mid-Level Chest] → [Platforming Challenge] →
[Final Combat Gauntlet] → [Boss Arena] → [Level Complete]
```

Levels scroll **left to right**. The camera follows the player with a small deadzone. Levels cannot be scrolled backward past a checkpoint.

**Tile Size:** 32 × 32 px  
**Canvas Resolution:** 800 × 480 px  
**Level Width:** ~3,200–4,000 px (100–125 tiles wide)

### 7.2 Level 1 — The Burning Village

| Property | Value |
|---|---|
| **Name** | The Burning Village |
| **Atmosphere** | Burning houses, orange/red sky, ash particles drifting |
| **Ground** | Stone cobblestone path |
| **Platforms** | Wooden crates, cart tops, low walls |
| **Color Palette** | Oranges, reds, dark browns, yellow flame |
| **Hazards** | Open fire pits (damage on contact) |

**Narrative:** The Wizard-Knight arrives at their home village to find it sacked by a bandit horde. They must fight through the streets and ruined buildings to confront the Bandit Chief.

**Enemies Present:** Goblin (patrol), Bandit Archer (ranged), Giant Rat (fast melee)

**Key Landmarks:**
- Burning inn at the start (introduces fire pit hazard)
- Collapsed bridge section requiring platform jumps
- Market stalls with coin chests
- Boss arena: village square in front of burning keep

**Collectibles:** Coins scattered on rooftops and ledges; one Health Potion mid-level; one Mana Crystal before boss arena.

---

### 7.3 Level 2 — The Dark Castle

| Property | Value |
|---|---|
| **Name** | The Dark Castle |
| **Atmosphere** | Dark stone walls, flickering torches, iron chains |
| **Ground** | Stone brick |
| **Platforms** | Iron grating, moving chain platforms, stone ledges |
| **Color Palette** | Deep greys, purples, torch orange, bone white |
| **Hazards** | Spike traps, crumbling floor tiles (fall after 1 second) |

**Narrative:** The bandits were only the beginning — the Wizard-Knight traces the evil to a dark sorcerer commanding an army of undead from within an ancient fortress.

**Enemies Present:** Skeleton Warrior (reforms once), Dark Knight (heavy, blocks), Bat (flying)

**Key Landmarks:**
- Drawbridge entrance (animated lowering on player approach)
- Torch-lit dungeon corridor with crumbling floors
- Chasm section requiring precise jumps over a moving chain platform
- Boss arena: great hall with chandelier and throne

**Collectibles:** Coins in wall alcoves and skeleton drops; Magic Scroll power-up mid-level; Speed Boots before the boss arena.

---

### 7.4 Level 3 — Dragon's Lair

| Property | Value |
|---|---|
| **Name** | Dragon's Lair |
| **Atmosphere** | Volcanic cave, rivers of lava, dragon-bone pillars |
| **Ground** | Obsidian / dark stone |
| **Platforms** | Bone platforms, rising lava platforms (timed), obsidian outcroppings |
| **Color Palette** | Deep blacks, molten oranges, glowing reds, ember whites |
| **Hazards** | Lava rivers (instant kill), fire geyser jets (timed, avoidable), falling stalactites |

**Narrative:** The sorcerer was a servant of the Ancient Dragon, asleep in the deep volcano. The Wizard-Knight must descend into the earth and slay the dragon to end the threat forever.

**Enemies Present:** Fire Sprite (fast, zigzag), Lava Slime (splits on death), Dragon Minion (flying, fireballs)

**Key Landmarks:**
- Lava river crossing with bone-platform hopping sequence
- Fire geyser gauntlet (timed gaps)
- Treasure room with large chest (coin windfall before boss)
- Boss arena: massive circular cavern with lava floor and elevated platforms

**Collectibles:** Gem clusters (worth more coins), Dragon Scale (grants +20% fire resistance for boss fight), Health Potion before boss.

---

## 8. Enemy Design

### Level 1 Enemies

| Enemy | HP | Damage | Behavior | XP Drop | Coin Drop |
|---|---|---|---|---|---|
| **Goblin** | 40 | 8 | Patrols platform; charges player if within 150 px | 10 | 5 |
| **Bandit Archer** | 50 | 12 | Stands still; fires arrow every 2.5 s at player | 15 | 8 |
| **Giant Rat** | 35 | 6 | Fast erratic movement; changes direction randomly | 8 | 3 |

### Level 2 Enemies

| Enemy | HP | Damage | Behavior | XP Drop | Coin Drop |
|---|---|---|---|---|---|
| **Skeleton Warrior** | 50 | 10 | Patrols; reassembles once 5 s after first defeat | 20 | 6 |
| **Dark Knight** | 120 | 20 | Slow patrol; charges and blocks frontal attacks; must be hit from behind or above | 40 | 15 |
| **Bat** | 30 | 8 | Flies in sine-wave pattern; swoops toward player when within 200 px | 12 | 4 |

### Level 3 Enemies

| Enemy | HP | Damage | Behavior | XP Drop | Coin Drop |
|---|---|---|---|---|---|
| **Fire Sprite** | 40 | 15 | Fast zigzag movement; leaves a brief fire trail; deals fire damage | 25 | 8 |
| **Lava Slime** | 80 / 40 | 12 | Bounces; splits into 2 smaller slimes (40 HP each) on first death | 30 | 10 |
| **Dragon Minion** | 60 | 18 | Circles an area; fires small fireballs at player every 3 s | 35 | 12 |

---

## 9. Boss Design

### 9.1 Boss 1 — The Bandit Chief

| Property | Value |
|---|---|
| **Location** | End of Level 1 — Village Square |
| **HP** | 400 |
| **XP Reward** | 150 |
| **Coin Reward** | 80 |

**Phases:**

| Phase | HP Threshold | Behavior |
|---|---|---|
| Phase 1 | 400–250 HP | Charges across arena; pauses to throw 2 axes |
| Phase 2 | 250–100 HP | Charges faster; throws 3 axes in a spread; occasionally leaps |
| Phase 3 | 100–0 HP | Enraged: continuous charge with short cooldown; calls 2 Goblin minions |

**Tell:** Chief raises arms before a charge — gives player 0.5 s to react.

---

### 9.2 Boss 2 — The Dark Sorcerer

| Property | Value |
|---|---|
| **Location** | End of Level 2 — Great Hall |
| **HP** | 500 |
| **XP Reward** | 200 |
| **Coin Reward** | 120 |

**Phases:**

| Phase | HP Threshold | Behavior |
|---|---|---|
| Phase 1 | 500–300 HP | Fires homing dark orbs; teleports to opposite side of arena every 8 s |
| Phase 2 | 300–150 HP | Adds summon mechanic — spawns 2 Skeleton Warriors; dark orbs fire faster |
| Phase 3 | 150–0 HP | Summons a shield barrier requiring 10 hits to break; fires volley of 5 orbs |

**Tell:** Sorcerer raises staff before teleporting — brief glow indicates destination side.

---

### 9.3 Boss 3 — The Ancient Dragon

| Property | Value |
|---|---|
| **Location** | End of Level 3 — Volcanic Cavern |
| **HP** | 800 |
| **XP Reward** | 300 |
| **Coin Reward** | 200 |

**Phases:**

| Phase | HP Threshold | Behavior |
|---|---|---|
| Phase 1 | 800–550 HP | Perches on opposite ledge; breathes sweeping fire column (L→R); swoops across arena |
| Phase 2 | 550–250 HP | Drops from above crushing; lava geysers activate on arena floor (random, avoidable); fires 3 fireballs in spread |
| Phase 3 | 250–0 HP | Lands in center; continuous fire breath rotating left/right; tail-swipe hits low-flying platforms; calls Dragon Minions |

**Tell:** Dragon inhales deeply (1 s animation) before breath attack — player must jump or duck.  
**Special:** If the player collected the Dragon Scale in Level 3, fire damage from this boss is reduced by 20%.

---

## 10. Progression Systems

### 10.1 XP & Player Leveling

Killing enemies awards XP. When the XP bar fills, the player levels up, gaining a permanent stat boost.

| Player Level | XP Required (total) | HP Bonus | Mana Bonus | Bonus Choice |
|---|---|---|---|---|
| 2 | 100 | +10 | +5 | +3 Sword Damage OR +3 Bolt Damage |
| 3 | 300 | +15 | +10 | +5 Sword Damage OR +5 Bolt Damage OR +10 Max Mana |
| 4 | 650 | +20 | +10 | +5 All Damage OR +15 Max HP |
| 5 | 1,150 | +25 | +15 | +10 All Damage OR +20 Max HP |

Level-up is instant mid-level. A "LEVEL UP!" burst animation plays and HP/Mana are restored to full.

### 10.2 Coins

Coins are dropped by enemies and found in chests. They persist across level transitions and are spent exclusively in the inter-level shop. Coins are not lost on death.

---

## 11. Power-Ups & Collectibles

Power-ups are placed in fixed locations within levels (not random drops). They are lost if the player walks past them.

| Power-Up | Visual | Effect | Duration |
|---|---|---|---|
| **Health Potion** | Red heart flask | Restore 30 HP | Instant |
| **Mana Crystal** | Blue glowing gem | Restore 25 Mana | Instant |
| **Gold Coin** | Spinning coin | +1 Coin | Instant |
| **Coin Chest** | Wooden chest | +30–50 Coins | Instant |
| **Speed Boots** | Glowing orange boots | Move speed +40% | 12 seconds |
| **Power Orb** | Glowing red orb | All damage +50% | 10 seconds |
| **Dragon Scale** | Iridescent green scale | Fire resistance +20% vs Dragon | Until boss dies |

Active timed power-ups are shown as icons with countdown bars in the HUD.

---

## 12. The Upgrade Shop

The shop screen appears **between each level** (after Level 1→2 and after Level 2→3). The player keeps their coins. They may purchase as many upgrades as they can afford. The shop cannot be re-entered once the next level begins.

### Shop Inventory

| Item | Cost | Effect | Max Purchases |
|---|---|---|---|
| **Max Health +25** | 50 coins | Raises max HP by 25 | 3× |
| **Max Mana +25** | 40 coins | Raises max Mana by 25 | 3× |
| **Sword Upgrade** | 60 coins | +8 sword damage | 2× |
| **Magic Bolt Upgrade** | 55 coins | +8 bolt damage + piercing | 2× |
| **Spell Upgrade** | 70 coins | All spells +10 damage | 2× |
| **Bomb Pack (×3)** | 20 coins | Add 3 bombs to inventory | Unlimited |
| **Health Potions (×3)** | 15 coins | Add 3 potions to inventory (use with `Q`) | Unlimited |
| **Extra Life** | 100 coins | +1 life | 2× |
| **Double Jump** | 90 coins | Enables a second jump in mid-air | 1× |
| **Mana Regen Upgrade** | 45 coins | Mana regenerates 2× faster | 1× |

---

## 13. User Interface & HUD

The HUD is permanently displayed at the top of the canvas and does not obstruct level gameplay.

### HUD Elements (Top Bar)

```
[ ♥♥♥ ]  HP: 85/100  |  ✦ MP: 40/60  |  ⭐ XP: 220/350 (Lv.3)  |  🪙 Coins: 47  |  Lives: ♥♥♥
                                              [ 🔥 Fire ] [ ❄ Ice ] [ ⚡ Bolt ] ← active spell
```

| Element | Description |
|---|---|
| **HP Bar** | Red bar with current/max values |
| **Mana Bar** | Blue bar with current/max values |
| **XP Bar** | Yellow bar; shows level and progress to next |
| **Coin Counter** | Gold icon + number |
| **Lives** | Heart icons (3 max visible) |
| **Spell Selector** | 3 icons; active spell highlighted with border |
| **Active Power-Up** | Icon + countdown bar shown bottom-left when active |
| **Bomb Count** | Bomb icon + number, bottom-left |

### Screens

| Screen | Description |
|---|---|
| **Title Screen** | Game logo, "Press Enter to Start", background art |
| **Pause Menu** | Overlay: Resume / Controls / Quit |
| **Shop Screen** | Full-screen shop with item grid, coin count, "Continue" button |
| **Level Complete** | Fanfare, stats summary (enemies killed, coins, XP) |
| **Game Over** | "GAME OVER" with coins and XP earned; Retry or Main Menu |
| **Victory Screen** | "YOU WIN" with full stats and credits scroll |

---

## 14. Controls Reference

| Action | Key(s) |
|---|---|
| Move Left | `A` or `←` |
| Move Right | `D` or `→` |
| Jump | `W`, `Space`, or `↑` |
| Sword Attack | `J` or `Z` |
| Magic Bolt | `K` or `X` |
| Cast Active Spell | `L` or `C` |
| Throw Bomb | `F` |
| Use Health Potion | `Q` |
| Switch Spell → | `1` / `2` / `3` |
| Pause | `Escape` |
| Interact / Confirm | `Enter` or `E` |

*All controls shown on title screen and accessible from pause menu.*

---

## 15. Technical Requirements

### Platform
- **Delivery:** Single `.html` file (no server required, no external dependencies)
- **Rendering:** HTML5 Canvas 2D API
- **Language:** Vanilla JavaScript (ES6+)
- **Canvas Size:** 800 × 480 px (fixed; centered on page)
- **Target Frame Rate:** 60 FPS

### Rendering Approach
- All sprites drawn programmatically using Canvas 2D primitives (rectangles, arcs, paths)
- Pixel-art aesthetic using a constrained color palette
- Parallax background layers (2–3 layers per level)
- Particle system for combat effects, deaths, and spell bursts

### Physics
- Gravity constant: 900 px/s²
- Terminal fall velocity: 600 px/s
- Coyote time: 8 frames (allows jumping just after leaving platform edge)
- Jump buffer: 6 frames (jump input registered slightly before landing)
- Tile-based AABB collision detection (horizontal pass then vertical pass)

### Browser Support
- Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- Keyboard input only (no gamepad, no mobile touch in v1.0)
- No audio in v1.0 (stub hooks in place for v1.1)

### Performance Targets
- < 500 active entities on screen at once
- Particle pool with max 200 simultaneous particles
- Levels stored as 2D tile arrays; only visible tiles rendered each frame

---

## 16. Win / Lose Conditions

### Winning
- Defeat the Ancient Dragon at the end of Level 3.
- The Victory Screen plays, showing full run stats.

### Losing a Life
- Player HP drops to 0 → lose 1 life → respawn at last checkpoint with 50% HP.
- Checkpoints are set at: level start, mid-level (after second encounter), and boss arena entrance.

### Game Over
- All 3 lives lost → Game Over screen.
- Player may retry from the beginning of the current level (coins and XP earned in previous levels are retained).

---

## 17. Out of Scope (v1.0)

The following features are intentionally excluded from the initial release and may be considered for future versions:

- Audio / music / sound effects
- Mobile / touch controls
- Gamepad support
- Save/load system or local storage persistence
- More than 3 levels
- Multiplayer
- Procedurally generated levels
- Achievements or leaderboards
- Cutscenes or dialogue

---

*Document prepared based on design decisions made during scoping sessions. All stats and values are design targets and subject to tuning during development.*
