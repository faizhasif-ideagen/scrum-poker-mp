# Story Point Arena - Multiplayer Setup Guide

This guide will help you set up and deploy the multiplayer version of Story Point Arena.

## 🎮 Quick Start (Local Testing)

### 1. Install Dependencies

First, make sure you have Node.js installed (version 14 or higher). Then install the required packages:

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on port 3000 (or the PORT environment variable if set).

You should see:
```
🎮 Story Point Arena server running on port 3000
📡 Socket.io ready for connections
🌐 Local: http://localhost:3000
```

### 3. Play the Game

1. Open your browser and go to `http://localhost:3000`
2. Click "Network Play"
3. Click "Create New Room"
4. Share the room code with other players
5. Other players join by clicking "Network Play" → entering the room code → "Join Room"
6. Each player adds their character with name and story points
7. The host (room creator) clicks "Start Battle" when ready
8. Battle begins for all connected players!

## 🌐 Testing on Local Network (Multiple Devices)

To test with friends on the same WiFi network:

### 1. Find Your Local IP Address

**On Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
```

Look for your local IP (usually starts with 192.168.x.x or 10.0.x.x)

### 2. Start the Server

```bash
npm start
```

### 3. Connect from Other Devices

On other devices (phones, tablets, laptops) on the same network:
1. Open browser and go to `http://YOUR_IP:3000` (e.g., `http://192.168.1.100:3000`)
2. Follow the game steps above

## 🚀 Deploying to the Internet (Free Options)

### Option 1: Railway.app (Recommended)

Railway offers a free tier and is very easy to use.

1. **Sign up at [Railway.app](https://railway.app)**

2. **Install Railway CLI (optional):**
   ```bash
   npm install -g @railway/cli
   ```

3. **Deploy via GitHub:**
   - Push your code to GitHub
   - Go to Railway dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js and deploy!

4. **Deploy via CLI:**
   ```bash
   railway login
   railway init
   railway up
   ```

5. **Get your URL:**
   - Railway will provide a public URL like `https://your-app.railway.app`
   - Share this URL with players worldwide!

### Option 2: Render.com

1. **Sign up at [Render.com](https://render.com)**

2. **Create a new Web Service:**
   - Connect your GitHub repo
   - Build command: `npm install`
   - Start command: `npm start`
   - Select "Free" plan

3. **Deploy:**
   - Render will build and deploy automatically
   - You'll get a URL like `https://your-app.onrender.com`

### Option 3: Fly.io

1. **Sign up at [Fly.io](https://fly.io)**

2. **Install flyctl:**
   ```bash
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh

   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

3. **Deploy:**
   ```bash
   fly launch
   fly deploy
   ```

4. **Get your URL:**
   - Fly will provide a URL like `https://your-app.fly.dev`

### Option 4: Glitch.com (Easiest, but limited)

1. Go to [Glitch.com](https://glitch.com)
2. Click "New Project" → "Import from GitHub"
3. Enter your repository URL
4. Glitch will auto-deploy!
5. URL will be `https://your-project.glitch.me`

**Note:** Glitch has a 4000 requests/hour limit on free tier.

## 📋 Environment Variables

For production deployment, you can set these environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to `production` for production deployments

Example on Railway:
```bash
railway variables set NODE_ENV=production
```

## 🔧 Troubleshooting

### "Connection failed" Error

1. Make sure the server is running
2. Check if you're using the correct URL/IP address
3. Ensure firewall isn't blocking port 3000
4. On mobile networks, some carriers block WebSocket connections

### Players Can't Join Room

1. Verify all players are using the same server URL
2. Check that the room code is entered correctly (case-sensitive)
3. Make sure the room host hasn't started the battle yet

### Battle Doesn't Start

1. Ensure there are at least 2 players in the lobby
2. Only the host (room creator) can start the battle
3. Check browser console for error messages (F12)

### Performance Issues

1. Close unnecessary browser tabs
2. Use Chrome or Firefox for best performance
3. Reduce number of players (max 20, but 4-10 recommended)
4. Check your internet connection speed

## 🎯 Game Features

### Multiplayer Lobby System
- **Create Room**: Generate a unique 6-character room code
- **Join Room**: Enter a room code to join an existing game
- **Add Players**: Each connected player can add their character
- **Host Controls**: Only room creator can start battles

### Real-time Battle Sync
- All knight movements visible to all players
- Attack animations synchronized
- Damage and health updates instant
- Battle log shared across clients

### Network Architecture
- **Server**: Node.js + Express + Socket.io
- **Client**: Vanilla JavaScript with Socket.io client
- **Communication**: WebSocket for real-time bidirectional communication
- **Rooms**: Isolated game sessions with unique codes

## 📊 Server Monitoring

Check server health:
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "rooms": 3,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 🔒 Security Notes

- The current implementation is for casual gaming
- Room codes are simple 6-character strings
- No authentication or user accounts
- All data is temporary (not persisted)
- Consider adding rate limiting for production use

## 🎨 Customization

Want to customize the game? Key files:

- `server.js` - Backend logic and room management
- `network.js` - Client-side networking code
- `game.js` - Game logic and battle mechanics
- `index.html` - UI structure
- `styles.css` - Visual styling

## 📝 Development Mode

For development with auto-restart:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## 🌟 Tips for Best Experience

1. **Use a stable internet connection**
2. **Recommend 4-8 players** for balanced gameplay
3. **Host should have good internet** since they coordinate the battle
4. **Test locally first** before deploying publicly
5. **Share room codes** via chat, email, or QR code generators

## 🆘 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Check server logs for error messages
3. Ensure all players are using the same game version
4. Try refreshing the page and reconnecting

## 🎉 Have Fun!

Story Point Arena is now multiplayer-ready! Gather your team, create a room, and battle it out in real-time tactical combat!
