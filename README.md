# Xandeum pNode Explorer 

The **Xandeum pNode Explorer** is a high-performance, real-time analytics dashboard designed for the Xandeum storage layer network. As Xandeum builds a scalable storage layer for Solana dApps, this explorer provides crucial visibility into the decentralized storage provider (pNode) network.

## My Submission for the Xandeum Bounty include
### Live Website
Live Website: https://xandeum-analytics-platform.vercel.app

### Comprehensive API for developers

API Resources: https://web-production-b4440.up.railway.app/docs

## 🌐 Live Website Features

The explorer offers a sophisticated suite of tools for network participants and observers:

- **Real-Time Global Dashboard:** Instant overview of network health, including total pNode count, active host status, and aggregate network storage capacity.
- **Dynamic Network Topology:** Visualizes the relationship between parent IP Nodes and their child pNodes.
- **Context-Aware AI Assistant:** A built-in assistant powered by **Gemini 3 Flash** that understands the live state of the network and can answer complex questions about Xandeum's architecture, staking, and node performance.
- **Resource Hub:** Direct links to official documentation and network resources to assist storage providers.

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

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS (Custom Dark/Teal/Amber Theme)
- **Intelligence:** Google Gemini API (@google/genai)
- **Visualization:** Recharts & D3.js
- **Icons:** Lucide React

## 📦 Deployment & Local Setup

### 1. Prerequisites
- **Node.js** (v18.0.0+)
- **npm**

### 2. Obtaining a Gemini API Key
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Click **"Get API key"** in the sidebar.
3.  Click **"Create API key in new project"**.
4.  Copy your key. You will need to add this to your environment variables.

### 3. Local Installation
```bash
# Clone the repository
git clone https://github.com/your-username/xandeum-analytics-platform.git
cd xandeum-analytics-platform

# Install dependencies
npm install

# Run locally
npm run dev
```

### 4. Vercel Deployment
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Add an environment variable named `GEMINI_API_KEY` and paste your Gemini key.
3. Deploy. Vercel will automatically build the project using the modern React pipeline.

---

*Built with passion for the Xandeum Community during the South Era. 2025*