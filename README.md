# ARW Cosmetics - E-Commerce Website

## 🚀 Quick Start

### For Windows Users
Simply **double-click `START_SERVER.bat`** and wait for the browser to open!

That's it! The script will:
- ✅ Check for Node.js
- ✅ Install dependencies automatically
- ✅ Start the API server
- ✅ Open the website in your browser

### Prerequisites
You need **Node.js** installed on your computer:
- Download from: https://nodejs.org/ (LTS version recommended)
- During installation, make sure to check "Add to PATH"

**First-time setup:** Copy `server/.env.example` to `server/.env` and set `JWT_SECRET` to a long random string (required for login/signup).

### Manual Setup (if needed)
If the .bat file doesn't work:

```bash
# 1. Open Command Prompt in the project folder
# 2. Navigate to server
cd server

# 3. Install dependencies
npm install

# 4. Start the server
node src/index.js

# 5. Open browser to http://localhost:4000/home.html
```

### What's Running?
- **Frontend**: E-commerce website at http://localhost:4000/home.html
- **API Server**: Backend API on http://localhost:4000
- **Database**: Excel-based data storage in `server/data/`

### API Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products?category=xxx` - Filter by category
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account
- `GET /api/auth/me` - Get user profile
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Place order

### File Structure
```
PROJET TECHWEB/
├── Magasin/              (Frontend - HTML/CSS/JS)
│   ├── home.html
│   ├── product.html
│   ├── panier.html
│   ├── profil.html
│   ├── CSS/
│   └── ImagesProd/       (Product images)
├── server/               (Backend - Node.js/Express)
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/       (API endpoints)
│   │   └── utils/
│   ├── data/             (Excel database)
│   └── package.json
├── START_SERVER.bat      (Click this to start!)
└── README.md
```

### Troubleshooting

**"Node.js is not installed"**
→ Install Node.js from https://nodejs.org/ and restart your computer

**"Port 4000 already in use"**
→ Close other applications using port 4000, or edit `server/.env` to use a different port

**"npm install failed"**
→ Delete the `server/node_modules` folder and try running the .bat again

**"Website won't load"**
→ Make sure the command window with the server is still open
→ Check that it says "✅ Server running on http://localhost:4000"

**"Images not showing"**
→ The server must be running to serve images
→ Check that `Magasin/ImagesProd/` folder exists

**Production**
→ Set `NODE_ENV=production` so debug endpoints (`/api/debug/*`) are not exposed.

---
**Created**: 2026
**Technology**: Node.js, Express, HTML5, CSS3, Vanilla JavaScript, Excel Database
