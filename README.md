# NGESA // The Immortal Stride &mdash; CJ (San Andreas) 🏃💨

> **"Ah shit, here we go again."** &mdash; Carl Johnson (CJ)

An ultra-minimalist, infinite 3D runner simulation featuring **Carl Johnson (CJ)** from GTA San Andreas running infinitely with MAX stamina down an endless reflective runway. Built with procedural Three.js kinematics, authentic San Andreas textures (white ribbed tank top, baggy denim jeans, black canvas sneakers, gold chain, and buzzcut fade), and real-time telemetry.

[![Deploy to GitHub Pages](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml/badge.svg)](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20Simulation-22c55e?style=flat&logo=safari)](https://ngesa-cloud.github.io/ngesa/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ⚡ Simulation Features

1. **Carl Johnson (CJ) Procedural 3D Rig:**
   - **Top:** Iconic white ribbed sleeveless athletic tank top ("wifebeater").
   - **Jeans:** Classic baggy stonewash indigo blue denim jeans with leather belt, brass buckle, and gold topstitching.
   - **Footwear:** Black canvas low-top skate sneakers with vulcanized white rubber toe bumpers.
   - **Jewelry & Accessories:** Gold curb Cuban chain around his neck and black digital watch on left wrist.
   - **Head & Face:** 1992 San Andreas buzzcut fade haircut, defined jawline, and subtle mustache/goatee stubble.
   - **Character Switcher:** Toggle freely between **CJ** and **Kipchoge** on the fly!

2. **San Andreas Minimalist Road & Void:**
   - Sleek dark reflective runway with razor-thin hairline edge guidelines and dashed centerline.
   - Luminous green Grove Street laser guideline slicing through the dark.
   - Curated Minimalist Palettes:
     - **Grove Street:** Deep obsidian black with vibrant Grove Street green laser guide (`#00ff66`).
     - **San Fierro:** Ocean mist slate blue with cool morning fill (`#38bdf8`).
     - **Vinewood:** Twilight Los Santos amber sunset gradient (`#f97316`).

3. **San Andreas Telemetry HUD:**
   - Real-time **DISTANCE** counter incrementing infinitely.
   - Dynamic **SPEED** gauge (`12.0 KM/H`, `21.2 KM/H`, `40.0 KM/H`).
   - **STAMINA: MAX 100%** & **RESPECT: + GROVE**.
   - Iconic dialogue carousel ("Ah shit, here we go again.", "Grove Street. Home.", "All we had to do was follow the damn train, CJ!").

4. **Dynamic Perspectives:**
   - **Chase:** Third-person trailing behind CJ.
   - **Front:** Head-on broadcast view.
   - **Profile:** 90-degree lateral stride analysis.
   - **Focus:** Close-up portrait view of CJ's face and upper body.
   - **Orbit:** 360-degree cinematic orbital drone.

---

## 🚀 Live Access & Local Quickstart

### Live Deployment
Experience the simulation directly in any modern browser:
👉 **[https://ngesa-cloud.github.io/ngesa/](https://ngesa-cloud.github.io/ngesa/)**

### Local Setup
```bash
# Clone repository
git clone https://github.com/ngesa-cloud/ngesa.git

# Navigate to project
cd ngesa

# Launch local server
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser.

---

## 🛠️ Tech Stack

- **Graphics:** [Three.js](https://threejs.org/) (WebGL 3D Rendering)
- **Audio:** Web Audio API (Synthesized footstrikes)
- **Styling:** Minimalist CSS3 (Glassmorphic pill HUD, typographic layout)
- **Deployment:** GitHub Pages & GitHub Actions CI/CD
- **PWA:** Service Worker caching & Web App Manifest

---

## 📜 License

Released under the [MIT License](LICENSE) by **ngesa**.
