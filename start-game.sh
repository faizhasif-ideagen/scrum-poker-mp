#!/bin/bash

# Story Point Arena - Startup Script

echo "🎮 Starting Story Point Arena Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Server is already running on port 3000"
    echo ""
    echo "To stop it, run: lsof -ti:3000 | xargs kill"
    echo ""
else
    # Start the server
    echo "🚀 Starting server on http://localhost:3000"
    echo ""
    node server.js &

    # Wait for server to start
    sleep 2

    echo "✅ Server started successfully!"
    echo ""
fi

echo "📖 How to play:"
echo "   1. Open your browser to: http://localhost:3000"
echo "   2. Click 'Network Play'"
echo "   3. Click 'Create New Room'"
echo "   4. Share the room code with friends!"
echo ""
echo "🌐 To play from other devices on your network:"
echo "   Find your IP: ifconfig | grep 'inet '"
echo "   Share: http://YOUR_IP:3000"
echo ""
echo "🛑 To stop the server: lsof -ti:3000 | xargs kill"
echo ""
