# ⚡ WeatherGPT — AI-Powered Weather & Climate Decision Intelligence

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=flat&logo=google)
![Groq AI](https://img.shields.io/badge/Groq-Llama%203.3%2070B-orange?style=flat)
![Deployment](https://img.shields.io/badge/Vercel-Production%20Ready-black?style=flat&logo=vercel)

**WeatherGPT** is a next-generation conversational climate intelligence and weather decision-support platform designed for real-time risk assessment, agricultural advisories, disaster early warnings, logistics planning, and localized multi-lingual forecasting.

---

## 🚀 Key Features

- 🧠 **Multi-Model AI Intelligence**: Conversational assistant powered by Google Gemini 2.5 Flash and Groq (Llama 3.3 70B) with automatic failover synthesis.
- 📡 **Live Telemetry & Forecasts**: Real-time atmospheric data from Open-Meteo including Temperature, Humidity, UV Index, Air Quality (US AQI & PM2.5), Precipitation Probability, and Atmospheric Pressure.
- 🗺️ **Meteorological Radar & Hazard Maps**: Interactive Leaflet maps with live simulation layers for Precipitation Radar, Wind Streamlines, and Hazard Focus Zones.
- 📈 **24-Hour Predictive Charts**: Interactive Chart.js temperature and precipitation trend analytics.
- ⚠️ **Early Warning Hazard Center**: Automated real-time alerts for heavy rainfall, extreme heatwaves, high wind gusts, low highway visibility, and elevated smog/AQI.
- 🌾 **Sector Decision Support Modules**:
  - **Agriculture**: Irrigation schedule advisories, pesticide spray safety windows, crop heat-stress indices.
  - **Disaster Risk**: Local flood vulnerability indices, urban drainage capacity load, and emergency status watches.
  - **Logistics & Travel**: Highway visibility ratings, travel risk index, and transit delay projections.
  - **Aviation & Marine**: Crosswind velocity analysis and flight weather safety ratings.
- 🎙️ **Speech-to-Text Voice Input**: Ask weather and climate questions directly with natural voice recognition.
- 🌐 **Multi-Language Support**: One-click toggle between English and Hindi (Devanagari) conversational modes.
- 🔐 **Authentication & Security Suite**: Dedicated login and signup interface (`/login`).

---

## 🛠️ Project Structure

```text
├── app/
│   ├── api/
│   │   ├── gemini/
│   │   │   └── route.ts     # Resilient multi-model AI route handler (Gemini + Groq + Heuristics)
│   │   └── chat/
│   │       └── route.ts     # Route alias for /api/chat
│   ├── login/
│   │   └── page.tsx         # Dark theme Auth & Sign-up page
│   ├── globals.css          # Design system & dark luxury CSS styles
│   ├── layout.tsx           # Global HTML headers, fonts & CDNs (Leaflet, Chart.js, FontAwesome)
│   └── page.tsx             # Interactive WeatherGPT Dashboard
├── backend/
│   ├── server.js            # Standalone Express backend fallback (optional)
│   └── package.json
├── frontend/
│   ├── weather _backup.html # Standalone offline dashboard HTML
│   └── login.html           # Standalone offline login HTML
├── .env.local               # Local environment variables (GEMINI_KEY, GROQ_API_KEY)
├── .env.example             # Example environment file template
├── package.json
└── tsconfig.json
```

---

## 💻 Quick Start Guide

### 1. Run Development Server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ 1-Click Deployment to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete WeatherGPT AI project"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Framework Preset will automatically detect **Next.js**.

3. **Configure Environment Variables in Vercel**:
   Add the following variables in the Vercel dashboard under **Settings > Environment Variables**:
   - `GEMINI_KEY` = your Google Gemini API key
   - `GROQ_API_KEY` = your Groq API key

4. **Click Deploy**:
   Vercel will build and deploy your application with global edge speed and serverless AI API functions.

---

## 🎤 Presentation Tips for Tomorrow

1. **Demo Live Weather**: Show the dashboard dynamically fetching current conditions, AQI, and UV index.
2. **Search Any City**: Type cities like *Mumbai, London, Tokyo, New York, or Bangalore* to show live Open-Meteo geocoding.
3. **Show AI Conversational Assistant**:
   - Ask: *"Will it rain this evening?"*
   - Ask: *"Provide agricultural advisory for wheat and tomato crops."*
   - Toggle **हिं** (Hindi button) and ask: *"क्या कल यात्रा करना सुरक्षित है?"*
4. **Demonstrate Early Warning Center & Decision Support**: Explain how raw weather metrics convert into actionable risk levels for farmers, pilots, transport drivers, and disaster response teams.
