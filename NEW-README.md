# Xandeum Analytics Platform 🛰️

> **The Complete pNode Explorer & Analytics Suite**  
> Real-time monitoring, AI-powered insights, and comprehensive analytics for the Xandeum decentralized storage network.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://xandeum-analytics-platform.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Documentation-blue?style=for-the-badge)](https://web-production-b4440.up.railway.app/docs)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The **Xandeum Analytics Platform** is a full-stack solution for monitoring and analyzing the Xandeum decentralized storage network. It consists of:

1. **Backend API** (Python/FastAPI) - Real-time node aggregation, scoring, and historical analytics
2. **Frontend Dashboard** (React/TypeScript) - Interactive visualization with AI-powered insights
3. **AI Assistant** (Google Gemini) - Context-aware network intelligence

### What Problem Does This Solve?

Xandeum is building a scalable storage layer for Solana dApps. However, the network consists of:
- **IP Nodes** (Discovery/Gossip Hubs)
- **pNodes** (Storage Providers)

This platform provides:
- ✅ **Unified View**: Aggregates data from 9+ distributed IP nodes
- ✅ **Performance Scoring**: Ranks pNodes by reliability, capacity, and trust
- ✅ **Staking Recommendations**: Helps delegators choose top-performing nodes
- ✅ **Network Health Monitoring**: Real-time topology and health metrics
- ✅ **Historical Analytics**: 30-day trend analysis for capacity planning

---

## 🏗️ Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Dashboard   │  │  pNode List  │  │  AI Assistant      │   │
│  │  (Recharts)  │  │  (D3.js)     │  │  (Gemini 3 Flash)  │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└────────────────────────────┬──────────────────────────────────┘
                             │ HTTPS (REST)
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    Backend API (FastAPI)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Scoring     │  │  Historical  │  │  Alerts      │       │
│  │  Engine      │  │  Analytics   │  │  System      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                 │
│  ┌───────────────────────────────────────────────────┐        │
│  │        Background Worker (60s refresh)             │        │
│  │  - Polls 9 IP Nodes via RPC                        │        │
│  │  - Deduplicates pNodes by address                  │        │
│  │  - Calculates performance scores                   │        │
│  │  - Saves snapshots to MongoDB                      │        │
│  └───────────────────────────────────────────────────┘        │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      MongoDB Atlas                             │
│  Collections:                                                  │
│  - pnodes_snapshot      (Current state)                       │
│  - pnodes_registry      (Persistent node data)                │
│  - pnodes_snapshots     (30-day history)                      │
│  - pnodes_status        (Online/Offline tracking)             │
└────────────────────────────┬──────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────┐
│              Xandeum Network (9 IP Nodes)                      │
│  - 173.212.203.145:6000                                        │
│  - 173.212.220.65:6000                                         │
│  - 161.97.97.41:6000                                           │
│  - ... (6 more nodes)                                          │
│                                                                 │
│  RPC Methods:                                                  │
│  - get-version                                                 │
│  - get-stats                                                   │
│  - get-pods                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Background Worker** (Backend)
   - Polls IP nodes every 60 seconds
   - Fetches: `get-version`, `get-stats`, `get-pods`
   - Deduplicates pNodes by `address` (IP:port)
   - Calculates scores: Trust (0-100), Capacity (0-100), Stake Confidence
   - Saves snapshot to MongoDB

2. **API Endpoints** (Backend)
   - Serve latest snapshot (fast reads, no RPC calls)
   - Endpoints: `/pnodes`, `/recommendations`, `/network/health`, etc.
   - Response time: <500ms

3. **Frontend Dashboard** (React)
   - Fetches data from API every 5 minutes
   - Uses proxy rotation for CORS handling (corsproxy.io → allorigins.win)
   - Visualizes with D3.js (network graph) and Recharts (charts)
   - AI Assistant queries Gemini API with live network context

---

## ✨ Features

### Backend API

| Feature | Description | Endpoint |
|---------|-------------|----------|
| **Unified pNode Data** | Single source of truth with scoring | `GET /pnodes` |
| **Staking Recommendations** | Top nodes for delegation | `GET /recommendations` |
| **Network Health** | Real-time health metrics | `GET /network/health` |
| **Network Topology** | Graph data for visualization | `GET /network/topology` |
| **Historical Analytics** | 30-day trend analysis | `GET /network/history` |
| **Alert System** | Node-specific and network-wide alerts | `GET /alerts` |
| **Node Comparison** | Side-by-side evaluation | `GET /pnodes/compare` |
| **Operator Analytics** | Decentralization metrics | `GET /operators` |
| **Gossip Consistency** | Flapping detection | `GET /network/consistency` |

### Frontend Dashboard

| Feature | Description |
|---------|-------------|
| **Real-Time Dashboard** | Live network overview with milestone progress |
| **Network Topology Graph** | D3.js force-directed visualization |
| **pNode Registry** | Sortable, paginated table with expandable details |
| **IP Node Health** | Detailed metrics per host (CPU, RAM, storage) |
| **AI Assistant** | Gemini-powered chatbot with network context |
| **Dark Mode** | Teal/Amber/Purple theme for extended use |
| **Responsive Design** | Mobile-friendly (with caveats) |

### Scoring System

```
Trust Score (0-100)
├── Uptime (40 pts)        → 30+ days = full points
├── Gossip Presence (30)   → Seen by 3+ IP nodes
├── Version Compliance (20) → Latest version
└── Consistency (10)       → Stable gossip presence

Capacity Score (0-100)
├── Storage Committed (30) → Normalized to 100GB
├── Usage Balance (40)     → Optimal 20-80%
└── Growth Trend (30)      → Historical data required

Stake Confidence (Composite)
└── 60% Trust + 40% Capacity → Low/Medium/High Risk
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: MongoDB Atlas (M0 Free Tier)
- **Caching**: Joblib (RPC response caching)
- **Background Tasks**: AsyncIO + threading
- **HTTP Client**: httpx (async)
- **Deployment**: Railway

### Frontend
- **Framework**: React 19 + TypeScript
- **Routing**: React Router v7
- **Visualization**: D3.js, Recharts
- **Styling**: Tailwind CSS (via CDN)
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel

---

## 📦 Prerequisites

### Backend Requirements
```bash
- Python 3.11+
- MongoDB Atlas account (free tier works)
- pip
```

### Frontend Requirements
```bash
- Node.js 18.0+
- npm
- Google Gemini API Key (free tier available)
```

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/lucadavid075/xandeum-analytics-platform.git
cd xandeum-analytics-platform
```

### 2. Start Backend
```bash
git clone https://github.com/lucadavid075/pnode-aggregation-api.git
cd pnode-aggregation-api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env
cp .env.example .env
# Add your MongoDB URI to .env

# Run
uvicorn app.main:app --reload --port 8000
```

Backend will be at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### 3. Start Frontend
```bash
cd frontend
npm install

# Create .env
cp .env.example .env
# Add your Gemini API key to .env

# Run
npm run dev
```

Frontend will be at: `http://localhost:3000`

### 4. Verify Integration
```bash
# Test backend health
curl http://localhost:8000/health

# Check frontend can fetch data
# Open http://localhost:3000 in browser
# Dashboard should load within 5 seconds
```

---

## 🔧 Backend Setup (Detailed)

### Step 1: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user:
   ```
   Username: xandeum-api
   Password: [generate strong password]
   Role: readWrite
   ```
4. Whitelist IPs: `0.0.0.0/0` (all IPs)
5. Get connection string:
   ```
   mongodb+srv://xandeum-api:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Configure Environment

Create `backend/.env`:
```bash
# Required
MONGO_URI=mongodb+srv://...
MONGO_DB=xandeum-monitor

# Optional
CACHE_TTL=60  # Refresh interval in seconds
IP_NODES=173.212.203.145,173.212.220.65,161.97.97.41,192.190.136.36,192.190.136.37,192.190.136.38,192.190.136.28,192.190.136.29,207.244.255.1

# For local dev (optional)
PORT=8000
```

### Step 3: Fix Database Duplicates (One-Time)

```bash
# Clean up any existing duplicate addresses
python fix_duplicate.py

# Clean up status collection
python fix_statusdup.py
```

### Step 4: Start Background Worker

The background worker starts automatically when you run:
```bash
uvicorn app.main:app --reload --port 8000
```

Wait 60 seconds for first snapshot to complete, then check:
```bash
curl http://localhost:8000/health
# Should return: "status": "healthy"
```

### Step 5: Test Endpoints

```bash
# Get all online nodes
curl http://localhost:8000/pnodes?status=online&limit=10 | jq

# Get staking recommendations
curl http://localhost:8000/recommendations?limit=5 | jq

# Get network health
curl http://localhost:8000/network/health | jq
```

---

## 🎨 Frontend Setup (Detailed)

### Step 1: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google Account
3. Click **"Get API key"** → **"Create API key in new project"**
4. Copy the key (starts with `AIza...`)
5. ⚠️ **Important**: Enable billing for best experience (avoid rate limits)

### Step 2: Configure Environment

Create `frontend/.env`:
```bash
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Update API URL (if needed)

Edit `frontend/services/nodeService.ts`:
```typescript
const BASE_URL = 'http://localhost:8000';  // For local backend
// const BASE_URL = 'https://web-production-b4440.up.railway.app';  // For production
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in browser.

### Step 5: Test AI Assistant

1. Click **"AI Assistant"** button in sidebar
2. If prompted, select your API key
3. Ask: "What is the current network status?"
4. AI should respond with live data (node counts, milestone info)

---

## 🌐 Deployment

### Backend Deployment (Railway - Recommended)

#### Option A: Via CLI
```bash
cd backend

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set MONGO_URI="mongodb+srv://..."
railway variables set MONGO_DB="xandeum-monitor"
railway variables set CACHE_TTL=60

# Deploy
railway up

# Get URL
railway domain
```

#### Option B: Via GitHub Integration
1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. Click **"New Project"** → **"Deploy from GitHub"**
4. Select repository
5. Add environment variables in Railway dashboard
6. Deploy automatically triggers

**Cost**: Free trial then $5-20/month

---

### Backend Deployment (Heroku Alternative)

```bash
cd backend

# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# OR: curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create xandeum-pnode-analytics

# Set config
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set MONGO_DB="xandeum-monitor"
heroku config:set CACHE_TTL=60

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

**Cost**: Free tier deprecated, now $7-25/month

---

### Frontend Deployment (Vercel - Recommended)

#### Option A: Via GitHub Integration (Easiest)
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click **"Add New Project"** → **"Import Git Repository"**
4. Select your repository
5. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
6. Add environment variable:
   ```
   GEMINI_API_KEY=AIzaSy...
   ```
7. Click **"Deploy"**

Vercel auto-deploys on every push to `main`.

#### Option B: Via CLI
```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Set environment variable
vercel env add GEMINI_API_KEY
```

**Cost**: Free (Hobby plan)

---

### Frontend Deployment (Netlify Alternative)

```bash
cd frontend

# Build
npm run build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist

# OR: Drag & drop `dist` folder on netlify.com
```

In Netlify dashboard:
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variable: `GEMINI_API_KEY`

**Cost**: Free

---

## 📖 API Documentation

### Base URL
```
Production: https://web-production-b4440.up.railway.app
Local: http://localhost:8000
```

### Core Endpoints

#### 1. Health Check
```bash
GET /health

Response:
{
  "status": "healthy",
  "snapshot_age_seconds": 45,
  "total_pnodes": 117,
  "total_ip_nodes": 9
}
```

#### 2. Get All pNodes
```bash
GET /pnodes?status=online&limit=100&sort_by=score&sort_order=desc

Query Parameters:
- status: online | offline | all (default: online)
- limit: 1-1000 (default: 100)
- skip: pagination offset (default: 0)
- sort_by: last_seen | uptime | score | storage_used
- sort_order: asc | desc (default: desc)

Response:
{
  "summary": {
    "total_pnodes": 117,
    "online_pnodes": 98,
    "offline_pnodes": 19
  },
  "network_stats": {
    "total_storage_committed": 12247563264,
    "avg_uptime_hours": 720.5,
    "version_distribution": { "0.8.0": 93, "0.7.0": 5 }
  },
  "pnodes": [
    {
      "address": "109.199.96.218:9001",
      "pubkey": "0x1234...",
      "is_online": true,
      "version": "0.8.0",
      "uptime": 2592000,
      "storage_committed": 107374182400,
      "storage_usage_percent": 24.25,
      "peer_count": 4,
      "scores": {
        "trust": { "score": 85.5, "breakdown": {...} },
        "capacity": { "score": 75.0, "breakdown": {...} },
        "stake_confidence": {
          "composite_score": 81.3,
          "rating": "low_risk",
          "color": "#10b981"
        }
      },
      "score": 81.3,
      "tier": "low_risk"
    }
  ]
}
```

#### 3. Staking Recommendations
```bash
GET /recommendations?limit=5&min_uptime_days=7

Response:
{
  "recommendations": [
    {
      "address": "109.199.96.218:9001",
      "score": 85.6,
      "tier": "low_risk",
      "uptime_days": 45.2,
      "version": "0.8.0",
      "storage_usage_percent": 35.5,
      "peer_count": 4
    }
  ],
  "total_evaluated": 98
}
```

#### 4. Network Health
```bash
GET /network/health

Response:
{
  "health": {
    "health_score": 85.5,
    "status": "healthy",
    "factors": {
      "availability": 29.0,
      "version_consistency": 22.5,
      "node_quality": 20.8,
      "connectivity": 18.0
    }
  },
  "alerts": [
    {
      "severity": "medium",
      "type": "version_fragmentation",
      "message": "Network running 2 different versions"
    }
  ]
}
```

#### 5. Network Topology (for graphs)
```bash
GET /network/topology

Response:
{
  "nodes": [
    {
      "id": "192.168.1.1",
      "type": "ip_node",
      "group": "ip",
      "properties": {
        "active_streams": 5,
        "cpu_percent": 2.5
      }
    },
    {
      "id": "109.199.96.218:9001",
      "type": "pnode",
      "group": "public",
      "properties": {
        "version": "0.8.0",
        "storage_committed": 107374182400
      }
    }
  ],
  "edges": [
    {
      "source": "192.168.1.1",
      "target": "109.199.96.218:9001",
      "type": "gossip_connection"
    }
  ],
  "stats": {
    "total_nodes": 107,
    "total_connections": 294
  }
}
```

#### 6. Node Comparison
```bash
GET /pnodes/compare?addresses=node1:9001,node2:9001

Response:
{
  "comparison": [...],
  "winners": {
    "overall_score": { "address": "node1:9001", "score": 85.6 },
    "trust_score": { "address": "node1:9001", "score": 88.0 },
    "best_uptime": { "address": "node2:9001", "uptime_days": 60.3 }
  },
  "recommendation": {
    "recommended_node": "node1:9001",
    "reason": "Highest overall score (85.6/100)"
  }
}
```

#### 7. Network History
```bash
GET /network/history?hours=24

Response:
{
  "history": [
    {
      "timestamp": 1735833600,
      "total_pnodes": 95,
      "avg_cpu_percent": 2.3,
      "total_storage_committed": 11744051200
    }
  ],
  "summary": {
    "node_growth": {
      "start_count": 95,
      "end_count": 98,
      "growth": 3,
      "growth_percent": 3.16
    }
  }
}
```

**Full API Documentation**: Visit `/docs` endpoint (Swagger UI)

---

## 🔐 Security Best Practices

### Backend
1. **MongoDB Security**
   ```bash
   # Use connection string with SSL
   MONGO_URI=mongodb+srv://...?retryWrites=true&w=majority&ssl=true
   
   # Rotate passwords quarterly
   # Use MongoDB Atlas IP whitelist
   ```

2. **Rate Limiting** (Optional)
   ```python
   # Add to app/main.py
   from slowapi import Limiter
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   
   @app.get("/pnodes")
   @limiter.limit("100/minute")
   async def get_pnodes(...):
       ...
   ```

3. **HTTPS Only**
   ```python
   # Add to app/main.py
   from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
   
   if os.getenv("ENV") == "production":
       app.add_middleware(HTTPSRedirectMiddleware)
   ```

### Frontend
1. **API Key Protection** ⚠️ **CRITICAL**
   
   **Current Issue**: API key is exposed in client-side bundle.
   
   **Solution**: Create proxy endpoint
   ```typescript
   // Backend: app/main.py
   @app.post("/api/ai")
   async def ai_proxy(request: Request):
       body = await request.json()
       # Forward to Gemini with server-side key
       return gemini_response
   
   // Frontend: services/aiService.ts
   const response = await fetch('/api/ai', {
       method: 'POST',
       body: JSON.stringify({ message: userInput })
   });
   ```

2. **Environment Variables**
   ```bash
   # Never commit .env files
   echo ".env" >> .gitignore
   echo ".env.local" >> .gitignore
   
   # Use Vercel environment variables UI
   # Enable "Encrypt" option
   ```

3. **CSP Headers**
   ```html
   <!-- Add to index.html -->
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' https://cdn.tailwindcss.com;
                  connect-src 'self' https://web-production-b4440.up.railway.app">
   ```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run comprehensive test suite
python tests/test_comprehensive.py

# Expected output:
# ✅ All Tests: 35/35 passed
# Pass Rate: 100%
```

### Frontend Tests
```bash
cd frontend

# Install test dependencies
npm install --save-dev @testing-library/react vitest

# Run tests (when implemented)
npm run test
```

### Manual Testing Checklist
- [ ] Backend health check returns "healthy"
- [ ] `/pnodes` returns data within 500ms
- [ ] Frontend dashboard loads within 3 seconds
- [ ] Network graph renders correctly
- [ ] AI Assistant responds to queries
- [ ] Mobile view is usable
- [ ] All links work
- [ ] No console errors

---

## 🐛 Troubleshooting

### Backend Issues

#### "Snapshot not available"
```bash
# Wait 60 seconds after starting server
# Check logs:
uvicorn app.main:app --reload --log-level debug

# Verify IP nodes are accessible:
curl -X POST http://173.212.203.145:6000/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"get-version","id":1}'
```

#### "MongoDB connection failed"
```bash
# Test connection string
python -c "from pymongo import MongoClient; client = MongoClient('YOUR_URI'); client.admin.command('ping'); print('✅ Connected')"

# Check:
# - Password has no special chars (or URL encode them)
# - IP whitelist includes 0.0.0.0/0
# - Network allows outbound MongoDB connections
```

#### Slow response times
```bash
# Check MongoDB indexes
# In MongoDB Compass:
db.pnodes_registry.getIndexes()

# Should have:
# - address_1 (unique)
# - pubkey_1
# - last_seen_-1

# If missing, run:
python -c "from app.db import setup_indexes; setup_indexes()"
```

### Frontend Issues

#### "Cannot connect to API"
```typescript
// Check CORS configuration in backend
// app/main.py should have:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  // Or specific domains
    allow_methods=["*"],
    allow_headers=["*"]
)
```

#### AI Assistant not working
```bash
# Verify API key:
echo $GEMINI_API_KEY

# Test manually:
curl https://generativelanguage.googleapis.com/v1beta/models \
  -H "x-goog-api-key: YOUR_KEY"

# Should return list of models
```

#### Network graph not rendering
```typescript
// Check browser console for errors
// Common issue: D3.js not loaded
// Verify in index.html:
<script type="importmap">
{
  "imports": {
    "d3": "https://aistudiocdn.com/d3@^7.9.0"
  }
}
</script>
```

---

## 📈 Performance Optimization

### Backend
```python
# 1. Enable caching (already implemented via Joblib)
# 2. Add Redis for distributed caching (optional)
# 3. Use connection pooling for MongoDB
from pymongo import MongoClient
client = MongoClient(MONGO_URI, maxPoolSize=50)

# 4. Optimize queries with projections
pnodes_registry.find({}, {"_id": 0, "address": 1, "score": 1})
```

### Frontend
```typescript
// 1. Code splitting
const AiInsights = lazy(() => import('./components/AiInsights'));

// 2. Memoize expensive computations (already done)
const enrichedPNodes = useMemo(() => {...}, [data]);

// 3. Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

// 4. Optimize bundle size
// Run: npm run build -- --analyze
```

---

## 🤝 Contributing

### Development Workflow
```bash
# 1. Fork repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/xandeum-analytics-platform.git

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Make changes and test locally
npm run dev  # Frontend
uvicorn app.main:app --reload  # Backend

# 5. Commit with meaningful message
git commit -m "feat: add node comparison matrix"

# 6. Push to your fork
git push origin feature/amazing-feature

# 7. Open Pull Request on GitHub
```

### Commit Message Convention
```
feat: new feature
fix: bug fix
docs: documentation update
style: code formatting
refactor: code restructuring
test: add tests
chore: maintenance
```

### Code Style
- **Backend**: PEP 8 (use `black` formatter)
- **Frontend**: ESLint + Prettier
- **Line length**: 120 characters max
- **Comments**: Explain "why", not "what"

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Xandeum Team** - For building the decentralized storage layer
- **Community Contributors** - For testing and feedback
- **Open Source Projects**:
  - FastAPI (API framework)
  - React (UI library)
  - D3.js (visualizations)
  - MongoDB (database)
  - Google Gemini (AI)

---

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/lucadavid075/xandeum-analytics-platform/wiki)
- **Issues**: [GitHub Issues](https://github.com/lucadavid075/xandeum-analytics-platform/issues)
- **Discord**: [Xandeum Community](https://discord.gg/uqRSmmM5m)
- **Twitter**: [@Xandeum](https://twitter.com/Xandeum)

---

*Built with passion for the Xandeum Community during the South Era. 2025*