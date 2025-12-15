# 🎮 Free Game Finder

[![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)](https://angular.io/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Proxy-orange?logo=cloudflare)](https://developers.cloudflare.com/workers/)
[![Firebase Hosting](https://img.shields.io/badge/Hosting-Firebase-yellow?logo=firebase)](https://firebase.google.com/)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-blue?logo=netlify)](https://www.netlify.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An Angular frontend application that displays free-to-play games using data from the [FreeToGame API](https://www.freetogame.com/).  
Requests are proxied through a **Cloudflare Worker** to bypass CORS restrictions.  
Deployed on **Firebase Hosting**, with optional support for **Vercel** or **Netlify**.

🔗 **Live App**: [free-game-finder-app.web.app](https://free-game-finder-app.web.app)

---

## ✨ Features

- Angular frontend with routing, services, and reusable components
- GameService fetches game list and details via a Worker proxy
- Cloudflare Worker handles:
  - `/api/games` → list of games
  - `/api/game?id=123` → details for a specific game
- Worker adds CORS headers to support browser requests
- Responsive UI with genre filtering, sorting, and search
- Easy deployment on Firebase, Vercel, or Netlify

---

## 🧩 Architecture Overview

<!-- > 📌 Upload `architecture.png` to your repo root and it will render below: -->

![Architecture Diagram](./architecture.jpg)

---

## 🖼️ UI Preview

<!-- > 📌 Upload `ui-preview.png` to your repo root and it will render below: -->

![UI Preview](./ui-preview.png)

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/Chaitanya2488/free-game-finder.git
cd free-game-finder 
```
### 2. Install dependencies
```bash
npm install
```
### 3. Run locally
```bash
ng serve
```
### 4. Deploy Worker
Use Cloudflare Wrangler to deploy your proxy:

```bash
wrangler deploy
```
## 🌐 Cloudflare Worker Proxy Code
``` javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    let targetUrl = null;

    if (url.pathname === "/api/games") {
      targetUrl = "https://www.freetogame.com/api/games";
    }

    if (url.pathname === "/api/game") {
      const id = url.searchParams.get("id");
      targetUrl = `https://www.freetogame.com/api/game?id=${id}`;
    }

    if (targetUrl) {
      const response = await fetch(targetUrl);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders
      });
    }

    return new Response("NOT FOUND", { status: 404, headers: corsHeaders });
  }
}
```
## 📁 Folder Structure
``` Code
src/
├── app/
│   ├── components/      # UI components
│   ├── services/        # GameService and other services
│   └── routing/         # Angular routing modules
├── assets/              # Static assets
├── environments/        # Environment configs
└── index.html           # Entry point
```
## 🚀 Deployment Options
✅ Live App: free-game-finder-app.web.app

🟡 Alternative Hosting: Vercel or Netlify

🔸 Proxy Layer: Cloudflare Worker handles API requests and CORS

## 📄 License
MIT © Chaitanya Siripurapu

## 🙌 Author

Chaitanya Siripurapu
GitHub: https://github.com/Chaitanya2488
