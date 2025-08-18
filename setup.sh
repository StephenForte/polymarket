#!/bin/bash

echo "🚀 Polymarket Viewer CORS Solutions Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎯 Choose your CORS solution:"
echo "1. External CORS Proxy (Quick & Easy)"
echo "2. Local Node.js Proxy Server (Recommended)"
echo "3. Test both solutions"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Setting up External CORS Proxy solution..."
        echo "✅ Your script.js has been updated to use external CORS proxy"
        echo ""
        echo "🚀 To run:"
        echo "   python3 -m http.server 8000"
        echo "   Then open: http://localhost:8000"
        echo ""
        echo "📝 Note: This solution depends on external services and may have rate limits."
        ;;
    2)
        echo ""
        echo "🔧 Setting up Local Node.js Proxy Server solution..."
        echo ""
        echo "🚀 To run:"
        echo "   npm start"
        echo "   Then open: http://localhost:3000"
        echo ""
        echo "📝 Note: This is the recommended solution for production use."
        ;;
    3)
        echo ""
        echo "🧪 Testing both solutions..."
        echo ""
        echo "1️⃣ Testing External CORS Proxy:"
        echo "   - Open a new terminal and run: python3 -m http.server 8000"
        echo "   - Open: http://localhost:8000"
        echo ""
        echo "2️⃣ Testing Local Proxy Server:"
        echo "   - Open another terminal and run: npm start"
        echo "   - Open: http://localhost:3000"
        echo ""
        echo "📝 Compare the Network tab in browser dev tools to see the difference."
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For more information, see: CORS_SOLUTIONS.md"
echo ""
echo "🎉 Setup complete!"
