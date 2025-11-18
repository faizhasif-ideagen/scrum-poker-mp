# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Story Point Knights Team Battle is a browser-based team combat game where ALL players fight simultaneously on screen. Players with the same story point values (Fibonacci sequence) form teams that battle left vs right. Each player has randomly generated stats, and team coordination with fast-paced movement determines victory.

## Development Commands

### Running
```bash
# Open index.html directly in a web browser
# No build step or dependencies required - pure HTML/CSS/JavaScript
```

## Architecture

### High-Level Structure

Single-page application with vanilla JavaScript, no frameworks or build tools. All game logic runs client-side in the browser.

### Key Files

- `index.html` - Main application structure with 3 screen states (Setup, Battle, Winner)
- `styles.css` - Complete styling including animations, responsive layout, and visual effects
- `game.js` - All game logic including state management, team system, AI behavior, battle mechanics, and rendering

### Core Concepts

**Game State Management**: The game uses a finite state machine with three states:
- SETUP: Player registration with story points selection
- BATTLE: Real-time team combat on HTML5 canvas with ALL players displayed
- WINNER: Winning team display

**Team System**:
- Supports 2-20 players total
- Players grouped by story point values into teams
- Teams divided into Left (lower story points) vs Right (higher story points)
- Same story point number = same team (cannot attack each other)
- All players spawn and fight simultaneously on screen

**Player Stats System**:
- Base stats: 20 HP, 5 damage, 80 attack range
- 5 random stat levels (1-5) applied to each player at creation:
  - Stat 0: HP bonus (level × 3)
  - Stat 1: Damage bonus (level × 2)
  - Stat 2: Combined HP and damage (level × 1 each)
  - Stat 3: Attack Range (level × 15) - affects how far they can attack
  - Stat 4: Extra damage (level × 1.5)
- Stats are randomly generated and permanent for each player
- Attack range varies from 95 to 155 pixels based on stat level

**Battle Mechanics**:
- Canvas-based rendering at 1400×800px with grid background and center dividing line
- ALL knights displayed on screen simultaneously
- Knights rendered as shield + helmet with cross emblem (team colored)
- First knight (index 0) is player-controlled with arrow keys + WASD and space to attack
- All other knights are AI-controlled with autonomous combat behavior
- AI seeks closest enemy, moves toward them, and attacks when in range
- Very slow, tactical movement: 1.25 pixels per frame
- **Directional Attacks**: Knights attack in a forward-facing 60° cone
  - Must face target to hit them (tracked by movement direction)
  - Attack range varies per player (80-155 pixels based on stats)
  - Visual: Semi-transparent cone shows attack arc when attacking
  - Hit detection: Checks both distance AND angle to target
- Attack cooldown: 120 frames (~2 seconds at 60fps)
- Team-based: Same team members cannot damage each other
- Battle ends when all members of one team are defeated

### Data Flow

1. Setup → Players added with name + story points → Stats generated → Player list updates
2. Battle Start → Teams created by story point grouping → Teams split left/right
3. Knight Spawning → ALL players spawned simultaneously (left team on left, right team on right)
4. Game Loop → Player controls first knight, AI controls all others → Attack checks include team validation
5. Battle End → Winning team determined → Team stats and survivors displayed

### State Management

Global `game` object manages all state:
- `players[]`: Array of all Player instances with stats
- `teams{}`: Object with `left` and `right` arrays containing team players
- `battleKnights[]`: ALL Knight instances displayed and active simultaneously
- `keys{}`: Keyboard input tracking for player-controlled knight
- Canvas animation loop using requestAnimationFrame

## Classes

**Game**: Main controller managing screens, team creation, battle coordination, and AI updates for all knights

**Player**: Stores name, story points, and generated stats with calculated maxHp and damage

**Knight**: Battle entity with position, HP, team affiliation, movement (player OR AI), attack logic, and rendering. Includes AI behavior methods for autonomous combat.

## Configuration

No configuration files needed. Game settings are hardcoded:
- Max players: 20
- Canvas size: 1400×800
- Knight size: 35 pixels
- Base HP: 20
- Base damage: 5
- Base attack range: 80 pixels (varies 95-155 with stats)
- Movement speed: 1.25 pixels/frame (very slow, tactical pace)
- Attack cone angle: 60 degrees (±30° from facing direction)
- Attack cooldown: 120 frames (~2 seconds)
- AI think interval: 15 frames (how often AI re-evaluates targets)

## Dependencies

None - pure vanilla JavaScript with no external libraries or frameworks.

## Additional Notes

- Story points (Fibonacci numbers) determine team membership - players with same number are teammates
- Teams are auto-balanced by splitting story point groups between left and right
- Player only controls first knight (index 0), all others have autonomous AI
- AI behavior: finds closest enemy, pursues them, attacks when in range
- Team-based attack validation prevents friendly fire
- All knights move and attack simultaneously creating chaotic, fast-paced battles
- Knights display story point badge below name for team identification
- Game is fully self-contained in three files with no network requests or external assets
