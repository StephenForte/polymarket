# CORS Issue Solutions for Polymarket Viewer

## The Problem

You're encountering a CORS (Cross-Origin Resource Sharing) error when trying to access the Polymarket API from your local development server. This happens because:

1. Your frontend is running on `http://localhost:8000`
2. The Polymarket API is at `https://gamma-api.polymarket.com`
3. The API doesn't include CORS headers allowing requests from your local domain
4. Browsers block cross-origin requests by default for security reasons

## Solution 1: External CORS Proxy (Quick Fix)

I've updated your `script.js` to use an external CORS proxy service. This is the simplest solution:

### How it works:
- Uses `https://api.allorigins.win/raw?url=` as a proxy
- All API requests go through this proxy, which adds the necessary CORS headers
- No additional setup required

### To use:
1. Simply refresh your page or restart your development server
2. The app should now work without CORS errors

### Pros:
- ✅ No additional setup required
- ✅ Works immediately
- ✅ No backend needed

### Cons:
- ❌ Depends on external service (may be unreliable)
- ❌ Potential rate limiting
- ❌ Not suitable for production

## Solution 2: Local Node.js Proxy Server (Recommended)

For a more robust solution, I've created a local proxy server that handles CORS properly.

### Setup:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the proxy server:**
   ```bash
   npm start
   ```
   This will start the server on `http://localhost:3000`

3. **Use the proxy version of the script:**
   - Rename `script-proxy.js` to `script.js` (backup the original first)
   - Or update your HTML to reference `script-proxy.js`

### How it works:
- Express server runs on port 3000
- Serves your static files and provides API proxy endpoints
- Handles CORS headers properly
- Proxies requests to Polymarket API

### API Endpoints:
- `GET /api/markets` - Get list of markets
- `GET /api/markets/:id` - Get specific market details

### Pros:
- ✅ Reliable and fast
- ✅ Full control over the proxy
- ✅ Can add caching, rate limiting, etc.
- ✅ Suitable for production
- ✅ No external dependencies

### Cons:
- ❌ Requires Node.js setup
- ❌ Additional server to maintain

## Solution 3: Browser Extension (Development Only)

For development purposes, you can use a browser extension to disable CORS:

### Chrome:
1. Install "CORS Unblock" extension
2. Enable it for your localhost domain
3. Refresh your page

### Firefox:
1. Install "CORS Everywhere" extension
2. Enable it for your localhost domain
3. Refresh your page

### Pros:
- ✅ No code changes needed
- ✅ Works with any API

### Cons:
- ❌ Only works in development
- ❌ Requires browser extension
- ❌ Not suitable for production

## Solution 4: Server-Side Rendering (Advanced)

For production applications, consider server-side rendering where the API calls happen on the server, not in the browser.

## Testing the Solutions

### Test Solution 1 (External Proxy):
1. Make sure you're using the updated `script.js`
2. Open your browser's developer tools (F12)
3. Go to the Network tab
4. Refresh the page
5. You should see requests to `api.allorigins.win` instead of direct Polymarket API calls

### Test Solution 2 (Local Proxy):
1. Run `npm start`
2. Open `http://localhost:3000` in your browser
3. Check the Network tab - you should see requests to `localhost:3000/api/markets`
4. The server console should show proxy requests being made

## Troubleshooting

### If Solution 1 doesn't work:
- The external proxy service might be down
- Try a different proxy service
- Check browser console for errors

### If Solution 2 doesn't work:
- Make sure Node.js is installed
- Check that all dependencies are installed (`npm install`)
- Verify the server is running on port 3000
- Check server console for error messages

### Common Issues:
1. **Port already in use**: Change the port in `server.js`
2. **Module not found**: Run `npm install` again
3. **CORS still blocked**: Make sure you're accessing the app through the proxy server, not directly

## Production Considerations

For production deployment:

1. **Use Solution 2** (local proxy) as it's more reliable
2. **Add environment variables** for API URLs
3. **Implement caching** to reduce API calls
4. **Add rate limiting** to prevent abuse
5. **Use HTTPS** for security
6. **Consider using a CDN** for static assets

## Security Notes

- CORS proxies can expose your API requests to third parties
- For sensitive applications, always use your own proxy server
- Consider implementing authentication if needed
- Monitor API usage to avoid rate limits
