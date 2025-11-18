# Story Point Arena

A **multiplayer online** team combat game where ALL players fight simultaneously on screen in fast-paced battles. Play with friends across different devices!

![Game Type](https://img.shields.io/badge/Type-Multiplayer%20Game-blue)
![Technology](https://img.shields.io/badge/Tech-Node.js%20%7C%20Socket.io-green)
![Players](https://img.shields.io/badge/Players-2--20-orange)
![Network](https://img.shields.io/badge/Network-Real--time%20Multiplayer-red)

## Overview

Story Point Arena is a **real-time multiplayer** combat game where:
- 🌐 **Play online with friends** - Connect from different devices worldwide
- 🎮 **Lobby system** - Create or join rooms with unique codes
- ⚔️ **Real-time battles** - ALL players fight simultaneously on screen
- 👥 **Team-based combat** - Players with same story points = teammates
- 🤖 **AI opponents** - Each player controls one knight, others are AI
- 🏆 **Last team standing wins** - Coordinate with your team to victory!

## Features

### 🌐 Multiplayer Features
- **Online Multiplayer**: Play with friends from anywhere in the world
- **Room System**: Create or join games with simple 6-character room codes
- **Real-time Sync**: All actions synchronized instantly across all players
- **Lobby System**: See players join in real-time before battle starts
- **Host Controls**: Room creator manages when to start battles

### ⚔️ Battle Features
- **Team-Based Combat**: Same story points = teammates, auto-split into left vs right
- **All Players On Screen**: Every knight displayed and fighting simultaneously
- **Beautiful Knight Graphics**: Shield + helmet design with team colors and cross emblem
- **Random Stats**: Each player gets 5 unique stat bonuses affecting HP, damage, and range
- **Highly Tactical**: Very slow movement (1.25px/frame) and 2-second attack cooldown
- **Directional Attacks**: Forward-facing cone attacks - positioning matters!
- **Smart AI**: All non-player knights autonomously seek and attack enemies
- **Team Protection**: Same team cannot damage each other
- **Simple Controls**: Arrow keys for movement, space bar to attack

## How to Launch

### 🌐 Multiplayer Mode (Recommended)

**Play online with friends from different devices!**

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Server:**
   ```bash
   npm start
   ```

3. **Open in Browser:**
   - Go to `http://localhost:3000`
   - Click "Network Play"
   - Create or join a room
   - Share the room code with friends!

4. **For Online Play:**
   - See [MULTIPLAYER_SETUP.md](MULTIPLAYER_SETUP.md) for deployment options
   - Deploy to Railway, Render, Fly.io, or Glitch for free
   - Share your public URL with players worldwide!

### 🏠 Local Mode (Single Device)

**Play solo or pass-and-play on one device:**

1. Double-click `index.html` to open in your browser
2. Click "Local Play"
3. Add all players and battle!

**Or use a local server:**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## How to Play

### Setup Phase
1. **Add Players**: Enter player names and select story points (Fibonacci: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89)
2. **Team Formation**: Players with same story points automatically become teammates
3. **Review Stats**: Each player gets random stats showing their HP and damage
4. **Start Battle**: Need at least 2 players to begin

### Battle Phase
**ALL players spawn immediately and fight at once!**

**Teams:**
- Left side: Lower story point values (RED)
- Right side: Higher story point values (CYAN)
- Same team members have matching colors
- Story point badges shown below each knight

**Controls:**
- **Arrow Keys** (↑↓←→) or **WASD**: Move your knight (first one added)
- **Space Bar**: Attack nearby enemies
- **AI**: All other knights fight autonomously

**Battle Info:**
- Green/yellow/red health bars show HP remaining
- Attack range shown as circles when attacking
- Live counter shows knights alive per team
- Battle log shows all combat events
- Center line divides the battlefield

### Victory
- Eliminate all enemy team members to win
- Your team's survivors and stats displayed
- Start a new battle with different teams

## Game Mechanics

### Stats System
Each player receives 5 random stat levels (1-5):
- **Stat 1**: HP Boost - adds 3-15 HP
- **Stat 2**: Damage Boost - adds 2-10 damage
- **Stat 3**: Balanced - adds 1-5 HP and damage
- **Stat 4**: Attack Range - adds 7.5-37.5 range (makes long-range fighters!)
- **Stat 5**: Extra Damage - adds 1.5-7.5 damage

Base stats: 20 HP, 5 damage, 40 attack range

### Combat
- **Directional Attacks**: 60° forward-facing cone with sword swipe animation
- **Attack range**: 48-78 pixels (randomized per knight)
- **Attack cooldown**: ~2 seconds (120 frames)
- **Movement speed**: 1.25 pixels per frame (very slow, tactical pace)
- Knights can move freely in all directions
- Must face target to hit them - position matters!
- Team-based: Cannot attack same team
- AI re-evaluates targets every 15 frames
- Battles end when one entire team is eliminated

### Team Formation
- Story points determine team membership
- Lower half of story point values → Left team (RED)
- Upper half of story point values → Right team (CYAN)
- If all same story points, alternates players left/right
- Visual team indicators: color + story point badges

## Browser Compatibility

Works on all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## Technical Details

### Frontend
- **Pure JavaScript**: No frameworks required
- **Canvas-Based**: Smooth 60 FPS rendering at 1400×800px
- **Socket.io Client**: Real-time WebSocket communication
- **Custom Graphics**: Hand-drawn knight shields and helmets
- **Directional Combat**: Cone-based hit detection with angle calculations
- **AI System**: Autonomous knight behavior for non-controlled knights

### Backend (Multiplayer)
- **Node.js**: Server runtime environment
- **Express**: Web server framework
- **Socket.io**: WebSocket library for real-time communication
- **Room Management**: Isolated game sessions with unique codes
- **Event System**: Synchronizes attacks, damage, and game state

### Network Architecture
- **WebSocket Protocol**: Low-latency bidirectional communication
- **Event-driven**: All actions broadcast to room participants
- **Client Authority**: Damage calculated on client, synced to all
- **Stateless Rooms**: No database needed, all data in memory

## File Structure

```
Story Point Arena/
├── index.html             # Main game structure & UI
├── styles.css             # Visual styling and animations
├── game.js                # Game logic, AI, battle mechanics
├── network.js             # Client-side networking (Socket.io)
├── server.js              # Node.js backend server
├── package.json           # Node.js dependencies
├── README.md              # This file
├── MULTIPLAYER_SETUP.md   # Deployment guide
└── CLAUDE.md              # Developer documentation
```

## Troubleshooting

**Game won't load?**
- Ensure JavaScript is enabled in your browser
- Try a different browser
- Check browser console for errors (F12)

**Controls not working?**
- Click on the game canvas to focus it
- Make sure you're in battle phase
- You only control the FIRST knight added (all others are AI)
- Check that your knight is alive (not showing 💀)

**Performance issues?**
- Close other browser tabs
- Try a different browser (Chrome recommended)
- Restart your browser

## Credits

Created with vanilla JavaScript - no frameworks, no dependencies, just pure game development fun!

## License

Free to use and modify for personal and educational purposes.

---

**Ready to battle?** Just open `index.html` and let the tournament begin! ⚔️
