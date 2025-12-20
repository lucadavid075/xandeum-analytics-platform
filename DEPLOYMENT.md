# Xandeum pNode Explorer 🛰️

## 📦 Deployment Guide

Follow these steps to get the Xandeum pNode Explorer running in your environment.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 2. 🔑 Obtaining a Gemini API Key
To power the AI Assistant, you need an API key from Google:
1.  Visit [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google Account.
3.  Click on the **"Get API key"** button in the left sidebar.
4.  Select **"Create API key in new project"** (or choose an existing project).
5.  **Copy the API key** generated. You will need this for the environment configuration.
    *Note: For the best experience with this dashboard, ensure your project has billing enabled to access Gemini 3 Pro models without strict free-tier rate limits.*

### 3. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/your-username/xandeum-pnode-explorer.git
cd xandeum-pnode-explorer
```

### 4. Install Dependencies
Install all required packages:
```bash
npm install
```

### 5. Configure Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API Key:
```env
API_KEY=your_gemini_api_key_here
```

### 6. Local Testing
Launch the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000` (or the port specified in your console).

### 7. Production Deployment

#### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository.
4. In **Environment Variables**, add `API_KEY` with your Gemini key.
5. Click **Deploy**. Vercel will automatically detect the build settings for React.

#### Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Select **"Import from Git"**.
3. Choose your repository.
4. Set the build command to `npm run build` and the publish directory to `dist`.
5. Add `API_KEY` to the **Site Configuration > Environment Variables** section.
6. Click **Deploy Site**.

---

*Built with passion for the Xandeum Community.*