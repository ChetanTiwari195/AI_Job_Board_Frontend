# Frontend - AI Job Board

This folder contains the frontend applications for the project.

## 1. Dashboard (Web App)
The dashboard is a React application built with Vite. It connects to the backend API to display scraped jobs.

### Setup
```bash
cd dashboard
npm install
```

### Running the Dashboard
```bash
npm run dev
```
The app will typically be available at `http://localhost:5173`. Make sure the backend server is running simultaneously so the dashboard can fetch data.

## 2. Extension
If you are developing the browser extension:
1. Navigate to the `extension` folder.
2. Load it unpacked in Chrome (`chrome://extensions/` -> "Load unpacked").
