# Testing Checklist - Story Point Arena Multiplayer

Use this checklist to verify the multiplayer functionality is working correctly.

## 🔧 Prerequisites

- [ ] Node.js installed (v14 or higher): `node --version`
- [ ] Dependencies installed: `npm install`
- [ ] Port 3000 is available: `lsof -i:3000` (should show nothing)

## 🚀 Server Testing

### Start Server
- [ ] Run `npm start` or `./start-game.sh`
- [ ] See message: "Story Point Arena server running on port 3000"
- [ ] See message: "Socket.io ready for connections"
- [ ] No error messages in console

### Server Health
- [ ] Visit http://localhost:3000/health in browser
- [ ] Should see JSON: `{"status":"ok","rooms":0,"timestamp":"..."}`

## 🌐 Single Browser Testing

### Connection
- [ ] Open http://localhost:3000
- [ ] See login screen with "Network Play" and "Local Play" buttons
- [ ] Open browser console (F12) - no errors
- [ ] See console message: "Connected to server"
- [ ] See console message: "Initializing network listeners..."

### Room Creation
- [ ] Click "Network Play"
- [ ] See "Multiplayer Lobby" screen
- [ ] Connection status shows "🟢 Connected to server"
- [ ] Click "Create New Room"
- [ ] See console message: "Create room button clicked"
- [ ] See console message: "Creating room..."
- [ ] See console message: "Create room response: {success: true, roomCode: '...'}"
- [ ] Room code appears (6 characters)
- [ ] See "👑 You are the host" indicator
- [ ] "Start Battle" button is visible

### Add Players
- [ ] Enter player name (e.g., "Alice")
- [ ] Select story points (e.g., "5")
- [ ] Click "Add Player"
- [ ] Player appears in lobby list with stats
- [ ] Add second player (minimum 2 needed)
- [ ] "Start Battle" button becomes enabled

### Start Battle
- [ ] Click "Start Battle"
- [ ] Battle screen appears
- [ ] See canvas with grid
- [ ] See all knights displayed
- [ ] Controls hint shows at bottom
- [ ] First knight responds to arrow keys
- [ ] Battle timer starts counting

## 🌐 Multi-Browser Testing (Same Computer)

### Setup
- [ ] Keep first browser window open (as host)
- [ ] Note the room code from host
- [ ] Open SECOND browser window (or incognito mode)
- [ ] Go to http://localhost:3000

### Join Room
- [ ] In second browser: Click "Network Play"
- [ ] Enter room code from host
- [ ] Click "Join Room"
- [ ] Successfully joins lobby
- [ ] See "Waiting for players to join..." message initially
- [ ] NO host indicator in second browser
- [ ] NO "Start Battle" button in second browser

### Add Player (Second Browser)
- [ ] In second browser: Enter player name
- [ ] Select story points
- [ ] Click "Add Player"
- [ ] Player appears in BOTH browsers simultaneously

### Verify Sync
- [ ] In first browser: See both players listed
- [ ] In second browser: See both players listed
- [ ] Player stats match in both browsers

### Start Battle (Multi-browser)
- [ ] In first browser (host): Click "Start Battle"
- [ ] BOTH browsers switch to battle screen
- [ ] BOTH browsers show all knights
- [ ] Attacks in one browser visible in other
- [ ] Damage syncs across both browsers
- [ ] Battle log shows same events in both

## 📱 Multi-Device Testing (Same WiFi)

### Find IP Address
- [ ] Mac/Linux: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
- [ ] Windows: Run `ipconfig`
- [ ] Note your local IP (192.168.x.x or 10.0.x.x)

### Connect from Second Device
- [ ] On second device: Open browser
- [ ] Go to `http://YOUR_IP:3000` (e.g., http://192.168.1.100:3000)
- [ ] Should see game login screen
- [ ] Click "Network Play"
- [ ] Connection status: "🟢 Connected to server"

### Test Room Join
- [ ] Create room on first device
- [ ] Note room code
- [ ] On second device: Enter room code and join
- [ ] Verify player appears in both devices
- [ ] Test battle start and sync

## 🐛 Error Scenarios

### Server Not Running
- [ ] Stop server (Ctrl+C)
- [ ] Try to click "Create New Room"
- [ ] Should see alert: "Not connected to server..."
- [ ] Console shows: "Not connected to server"

### Invalid Room Code
- [ ] Try joining with fake code "XXXXXX"
- [ ] Should see alert: "Failed to join room: Room not found"

### Disconnection
- [ ] Start battle with 2 browsers
- [ ] Close one browser window
- [ ] Other browser should continue working
- [ ] Closed player's knights remain (AI controlled)

## ✅ Success Criteria

All of the following should work:
- ✅ Server starts without errors
- ✅ Multiple clients can connect
- ✅ Room creation generates unique codes
- ✅ Players can join with room codes
- ✅ Host indicator shows correctly
- ✅ Player additions sync to all clients
- ✅ Battle starts for all clients simultaneously
- ✅ Attacks and damage sync in real-time
- ✅ Battle log shows same events
- ✅ Winner screen appears for all players

## 🆘 Troubleshooting

### Button Does Nothing
- Check browser console for errors
- Verify server is running
- Hard refresh page (Cmd+Shift+R / Ctrl+Shift+F5)
- Check network tab for WebSocket connection

### Connection Failed
- Verify server is running on port 3000
- Check firewall isn't blocking connections
- Try: `curl http://localhost:3000/health`

### Room Not Found
- Verify room code is correct (case-insensitive)
- Check if host is still connected
- Try creating new room

### Players Not Syncing
- Check browser console in both browsers
- Verify both connected to same server URL
- Look for WebSocket connection errors

## 📊 Performance Testing

### Recommended
- [ ] 2-4 players: Smooth gameplay
- [ ] 5-8 players: Good performance
- [ ] 9-12 players: Acceptable performance

### Stress Test
- [ ] Open 4+ browser windows
- [ ] All join same room
- [ ] Add multiple players from each
- [ ] Start battle with 15-20 knights
- [ ] Verify smooth rendering and sync

---

**Date Tested:** _______________
**Tested By:** _______________
**Result:** ⭐ Pass / ❌ Fail
**Notes:**
