# NGESA // The Immortal Stride &mdash; Rolling Ball With A Head 🎱🗣️

> **"Ah shit, here we roll again."** &mdash; Carl Johnson (CJ)

A minimalist, infinite 3D simulation of an immortal **rolling ball with a head perched on top**, rolling endlessly down an infinite reflective runway. Features true continuous angular rolling physics ($\omega = v / R$), gyro-stabilized head orientation, customizable ball skins (Grove Street 8-Ball, Cyber Grid, Gold Chrome), and head switching (CJ & Kipchoge).

[![Deploy to GitHub Pages](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml/badge.svg)](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20Simulation-22c55e?style=flat&logo=safari)](https://ngesa-cloud.github.io/ngesa/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ⚡ Simulation Features

1. **Continuous Angular Rolling Physics:**
   - Sphere body ($R = 0.85\text{m}$) rolls smoothly forward along the runway with true rotational velocity: $\Delta \theta = \frac{v \cdot \Delta t}{R}$.
   - Live telemetry monitors **ROTATION RPM** ($~375\text{ RPM}$ at $21.2\text{ km/h}$).

2. **Gyro-Stabilized Articulated Head:**
   - Perched atop the rolling sphere on a high-tech magnetic neck collar.
   - Bobs subtly with roll harmonics, tilts aerodynamically into speed, and sways organically as it looks down the endless road.
   - **CJ Head:** 1992 San Andreas buzzcut fade, dark eyes, goatee, and metallic gold Cuban chain with pendant draped around the collar!
   - **Kipchoge Head:** Focused world-record marathon runner likeness.

3. **Curated Ball Skins:**
   - **Grove Street 8-Ball:** Glossy billiard black with white #8 insignia and neon green racing latitude stripes.
   - **Cyber Grid:** Glowing green Tron digital matrix grid.
   - **Gold Chrome:** Mirror-reflective metallic sphere.

4. **Minimalist Typographic HUD:**
   - Real-time **DISTANCE** counter incrementing infinitely.
   - **SPEED** gauge (`12.0 KM/H` Roll, `21.2 KM/H` Fast, `40.0 KM/H` Turbo).
   - **ROTATION RPM** calculation.
   - Dialogue carousel featuring classic CJ lines.

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

- **Graphics:** [Three.js](https://threejs.org/) (WebGL 3D Physics & Shaders)
- **Audio:** Web Audio API (Synthesized rolling rumble)
- **Styling:** Minimalist CSS3 (Glassmorphic pill HUD, typographic layout)
- **Deployment:** GitHub Pages & GitHub Actions CI/CD
- **PWA:** Service Worker caching & Web App Manifest

---

## 📜 License

Released under the [MIT License](LICENSE) by **ngesa**.
