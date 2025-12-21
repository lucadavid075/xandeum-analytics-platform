# Xandeum pNode Explorer 

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://xandeum-analytics-platform.vercel.app)
[![API Docs](https://img.shields.io/badge/API-Documentation-blue?style=for-the-badge)](https://web-production-b4440.up.railway.app/docs)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

The **Xandeum pNode Explorer** is a high-performance, real-time analytics dashboard designed for the Xandeum storage layer network. As Xandeum builds a scalable storage layer for Solana dApps, this explorer provides crucial visibility into the decentralized storage provider (pNode) network.

## My Submission for the Xandeum Superteam Bounty include;

### Live Website
Live: https://xandeum-analytics-platform.vercel.app

### Comprehensive API for developers

API Resources: https://web-production-b4440.up.railway.app/docs  
[github repo](https://github.com/lucadavid075/pnode-aggregation-api)       
[documentation](https://github.com/lucadavid075/pnode-aggregation-api/tree/main/docs)

### Google docs
Link to the google docs submitted on Superteam platform, contains credentials to successfuly run the api, connect to the database and use gemini on the web app.

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

## 🌐 Live Website Features

The explorer offers a sophisticated suite of tools for network participants and observers:

- **Real-Time Global Dashboard:** Instant overview of network health, including total pNode count, active host status, and aggregate network storage capacity.
- **Dynamic Network Topology:** Visualizes the relationship between parent IP Nodes and their child pNodes.
- **Context-Aware AI Assistant:** A built-in assistant powered by **Gemini 3 Flash** that understands the live state of the network and can answer complex questions about Xandeum's architecture, staking, and node performance.
- **Resource Hub:** Direct links to official documentation and network resources to assist storage providers.


## Backend API

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

## 🚀 Innovative Approach

This explorer is built with several cutting-edge architectural choices:

1. **AI-Driven Data Interpretation:** Unlike static dashboards, our AI integration processes live network metrics to provide natural language insights, making the data accessible to both developers and delegators.
2. **Resilient Data Fetching:** Implements a multi-layered CORS proxy rotation strategy to ensure the dashboard remains operational even if primary API endpoints experience high latency or regional blocks.
3. **Reactive Topology Enrichement:** The app merges data from disparate API endpoints in real-time to provide a "Single Source of Truth" for pNode performance.

## 📊 pNode Registry & Advanced Sorting

The **pNode Registry** is the heart of the explorer. It features an advanced data table that allows users to drill down into specific node performance metrics.

### Sorting Capabilities
To help users find the most reliable or performant nodes, the registry supports multi-directional sorting on the following fields:

- **CPU Usage:** Sort by real-time compute load to identify over-utilized or under-utilized hosts.
- **RAM Allocation:** Track memory usage to ensure nodes have sufficient resources for storage operations.
- **Storage Capacity:** Identify nodes providing the most significant storage contributions to the network.
- **Uptime:** Sort by session duration to find the most stable and long-running providers in the current epoch.

### Expandable Insights
Each row can be expanded to reveal:
- **Network Identity:** Full pNode account addresses and Public Keys with one-click copy functionality.
- **Software Build:** Monitor which version of `XandMinerD` each node is currently running.
- **Detailed Health Metrics:** Visual progress bars for compute load and allocated storage.

## 📸 Gallery

### Dashboard Overview
![Dashboard Overview 1](/screenshots/Dashboard.PNG)
![Dashboard Overview 2](/screenshots/Dashboard2.PNG)

### pNode Registry & Sorting
![pNode Registry and Sorting](/screenshots/Pnodes.PNG)

### AI Assistant (Gemini 3 Pro)
![AI Assistant Insights](/screenshots/AIsist.PNG)

### Comparing pnodes
![pNodes compare API](/screenshots/compare.PNG)

## 🛠️ Technology 

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

## 📦 Deployment & Local Setup

### 1. Prerequisites
### Backend Deployment (Railway - Recommended)

#### Option A: Via CLI
```bash
cd pnode-aggregation-api

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
cd xandeum-analytics-platform

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

### 2. Obtaining a Gemini API Key
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click **"Get API key"** in the sidebar.
3.  Click **"Create API key in new project"**.
4.  Copy your key. You will need to add this to your environment variables.

### 3. Local Installation

#### 1. Clone Repository
```bash
git clone https://github.com/lucadavid075/xandeum-analytics-platform.git
cd xandeum-analytics-platform
```

#### 2. Start Backend
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

#### 3. Start Frontend
```bash
npm install

# Create .env
cp .env.example .env
# Add your Gemini API key to .env

# Run
npm run dev
```

Frontend will be at: `http://localhost:3000`

#### 4. Verify Integration
```bash
# Test backend health
curl http://localhost:8000/health

# Check frontend can fetch data
# Open http://localhost:3000 in browser
# Dashboard should load within 5 seconds
```

---

### 🔧 Backend Setup (Detailed)

#### Step 1: Create MongoDB Database

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

#### Step 2: Configure Environment

Create `./.env`:
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

#### Step 3: Fix Database Duplicates (One-Time)

```bash
# Clean up any existing duplicate addresses
python fix_duplicate.py

# Clean up status collection
python fix_statusdup.py
```

#### Step 4: Start Background Worker

The background worker starts automatically when you run:
```bash
uvicorn app.main:app --reload --port 8000
```

Wait 60 seconds for first snapshot to complete, then check:
```bash
curl http://localhost:8000/health
# Should return: "status": "healthy"
```

#### Step 5: Test Endpoints

```bash
# Get all online nodes
curl http://localhost:8000/pnodes?status=online&limit=10 | jq

# Get staking recommendations
curl http://localhost:8000/recommendations?limit=5 | jq

# Get network health
curl http://localhost:8000/network/health | jq
```

---

### 4. Vercel Deployment
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Add an environment variable named `GEMINI_API_KEY` and paste your Gemini key.
3. Deploy. Vercel will automatically build the project using the modern React pipeline.

---

## 📄 License

MIT License.

---

*Built with passion for the Xandeum Community during the South Era. 2025*