# Polymarket Viewer 🚀

A modern, responsive web application for exploring Polymarket's most active prediction markets. Built with vanilla JavaScript, Bootstrap, and featuring multiple CORS solutions for seamless API integration.

![Polymarket Viewer](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-14+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **Real-time Market Data**: Fetches live data from Polymarket API
- **Advanced Filtering**: Search, category, status, and volume filters
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Multiple CORS Solutions**: Both external proxy and local server options
- **Interactive UI**: Modern Bootstrap-based interface with smooth animations
- **Market Details**: Click any market to view detailed information
- **Pagination**: Navigate through large datasets efficiently
- **Statistics Dashboard**: Real-time market statistics and analytics

## 🚀 Quick Start

### Option 1: External CORS Proxy (Quick & Easy)

```bash
# Clone the repository
git clone https://github.com/yourusername/polymarket-viewer.git
cd polymarket-viewer

# Start the development server
python3 -m http.server 8000

# Open in your browser
open http://localhost:8000
```

### Option 2: Local Proxy Server (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/polymarket-viewer.git
cd polymarket-viewer

# Install dependencies
npm install

# Start the proxy server
npm start

# Open in your browser
open http://localhost:3000
```

### Option 3: Interactive Setup

```bash
# Clone and run the setup script
git clone https://github.com/yourusername/polymarket-viewer.git
cd polymarket-viewer
./setup.sh
```

## 📁 Project Structure

```
polymarket-viewer/
├── index.html              # Main application page
├── index-proxy.html        # Proxy server version
├── script.js               # Main JavaScript (external proxy)
├── script-proxy.js         # JavaScript for local proxy
├── styles.css              # Custom CSS styles
├── server.js               # Express proxy server
├── package.json            # Node.js dependencies
├── setup.sh                # Interactive setup script
├── CORS_SOLUTIONS.md       # CORS solutions documentation
├── SOLUTION_SUMMARY.md     # Implementation summary
└── README.md               # This file
```

## 🔧 CORS Solutions

This project includes **two working solutions** for the CORS issue when accessing the Polymarket API:

### 1. External CORS Proxy
- Uses `https://api.allorigins.win/raw?url=` as a proxy
- No additional setup required
- Works immediately
- Suitable for development and testing

### 2. Local Node.js Proxy Server
- Custom Express server that handles CORS properly
- Full control over the proxy
- Production-ready with error handling
- Can add caching, rate limiting, and authentication

For detailed information, see [CORS_SOLUTIONS.md](CORS_SOLUTIONS.md).

## 🛠️ Development

### Prerequisites
- Node.js 14+ (for local proxy server)
- Python 3 (for static server)
- Modern web browser

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/polymarket-viewer.git
   cd polymarket-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   # For external proxy version
   python3 -m http.server 8000
   
   # For local proxy version
   npm start
   ```

4. **Open in browser**
   - External proxy: `http://localhost:8000`
   - Local proxy: `http://localhost:3000`

## 📊 API Endpoints

### Local Proxy Server Endpoints
- `GET /api/markets` - Get list of markets
- `GET /api/markets/:id` - Get specific market details

### Query Parameters
- `closed=false` - Show only active markets
- `limit=100` - Limit number of results
- `category=string` - Filter by category
- `search=string` - Search in titles and descriptions

## 🎨 Customization

### Styling
Modify `styles.css` to customize the appearance:
- Color schemes
- Card layouts
- Typography
- Animations

### Functionality
Extend `script.js` or `script-proxy.js` to add features:
- Additional filters
- Data visualization
- Export functionality
- Real-time updates

## 🚀 Deployment

### Static Hosting (External Proxy)
1. Upload files to your hosting provider
2. Ensure `script.js` uses the external proxy
3. No server-side requirements

### Server Deployment (Local Proxy)
1. Deploy `server.js` to your server
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`
4. Configure environment variables as needed

### Environment Variables
```bash
PORT=3000                    # Server port
NODE_ENV=production          # Environment
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Polymarket](https://polymarket.com/) for providing the API
- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [Font Awesome](https://fontawesome.com/) for icons
- [Express.js](https://expressjs.com/) for the proxy server

## 📞 Support

If you encounter any issues:

1. Check the [CORS_SOLUTIONS.md](CORS_SOLUTIONS.md) documentation
2. Review the [SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md) for implementation details
3. Open an issue on GitHub
4. Check the browser console for error messages

## 🔄 Changelog

### v1.0.0
- Initial release
- Multiple CORS solutions implemented
- Responsive design
- Advanced filtering capabilities
- Real-time market data integration

---

**Made with ❤️ for the Polymarket community**
