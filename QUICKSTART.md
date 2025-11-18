# Quick Start Guide - Story Point Arena Multiplayer

Get your multiplayer game running in under 2 minutes!

## 🚀 Super Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
# Go to: http://localhost:3000
```

That's it! 🎉

## 🎮 How to Play Multiplayer

### Host (Player 1):
1. Click **"Network Play"**
2. Click **"Create New Room"**
3. **Share the 6-character room code** with friends
4. Add your character (name + story points)
5. Wait for others to join
6. Click **"Start Battle"** when ready

### Join (Other Players):
1. Click **"Network Play"**
2. Enter the **room code** from host
3. Click **"Join Room"**
4. Add your character (name + story points)
5. Wait for host to start

## 🌐 Play with Friends on Same WiFi

### Find Your IP Address:

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

**Windows:**
```bash
ipconfig
```

Look for: `192.168.x.x` or `10.0.x.x`

### Share This URL:
```
http://YOUR_IP:3000
```

Example: `http://192.168.1.100:3000`

## 🚀 Deploy Online (FREE)

### Railway (Easiest):
```bash
# 1. Sign up at railway.app
# 2. Install CLI
npm install -g @railway/cli

# 3. Deploy
railway login
railway init
railway up
```

### Or use Web UI:
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your repo
5. Done! Get your public URL

## 📱 Game Controls

- **Move**: Arrow Keys or WASD
- **Rotate**: Q / E
- **Block**: C
- **Attack**: SPACE

## ⚡ Pro Tips

- **4-8 players** is the sweet spot
- **Host needs stable internet** (coordinates battle)
- **Test locally first** before deploying
- **Room codes** are case-insensitive
- **Only host** can start battles

## 🆘 Troubleshooting

### Can't connect?
- Make sure server is running (`npm start`)
- Check you're using correct URL/IP
- Try refreshing page

### Room not found?
- Verify room code is correct
- Make sure you're on same server
- Host might have left

### Battle won't start?
- Need at least 2 players
- Only host can start
- Check browser console (F12)

## 📚 More Info

- Full setup guide: [MULTIPLAYER_SETUP.md](MULTIPLAYER_SETUP.md)
- General info: [README.md](README.md)

---

**Have fun battling! ⚔️**
