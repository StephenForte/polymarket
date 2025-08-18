#!/bin/bash

# Polymarket Viewer Startup Script

echo "🚀 Starting Polymarket Viewer..."
echo "📁 Application directory: $(pwd)"
echo "🌐 Server will be available at: http://localhost:8000"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found, starting server..."
    echo "📖 Open your browser and go to: http://localhost:8000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python found, starting server..."
    echo "📖 Open your browser and go to: http://localhost:8000"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
else
    echo "❌ Python not found. Please install Python 3 to run this application."
    echo "💡 You can also use any other HTTP server like:"
    echo "   - npx http-server"
    echo "   - php -S localhost:8000"
    echo "   - live-server"
    exit 1
fi
