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

> 📌 Upload `architecture.png` to your repo root and it will render below:

![Architecture Diagram](./architecture.png)

---

## 🖼️ UI Preview

> 📌 Upload `ui-preview.png` to your repo root and it will render below:

![UI Preview](./ui-preview.png)

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/Chaitanya2488/free-game-finder.git
cd free-game-finder