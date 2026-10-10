# NGESA // GitHub 100k+ Stars Highway 🎱🌟

> **"Ah shit, here we roll again."** &mdash; Carl Johnson (CJ)

A minimalist, infinite 3D cyber-highway simulation that rolls through **every GitHub repository with over 100,000 stars**. Features CJ's head perched atop a physics-driven rolling 8-ball gliding down an endless road, passing through glowing 3D holographic gateway arches representing open-source legends with over 14.3 Million combined stars.

[![Deploy to GitHub Pages](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml/badge.svg)](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20Simulation-22c55e?style=flat&logo=safari)](https://ngesa-cloud.github.io/ngesa/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ⚡ Simulation Features

1. **GitHub 100k+ Stars Highway:**
   - Sequential 3D holographic gateway arches placed every 55 meters along the endless highway.
   - Sourced from live GitHub API data: 60 verified repositories with >100,000 stars (from `build-your-own-x`, `awesome`, and `freeCodeCamp` to `linux`, `react`, `vscode`, and `tensorflow`).
   - Overhead double-sided billboards display milestone rank, star count (`★ 552.2K`), repository name, language badge with custom neon hue, and description.
   - Rotating golden 3D polyhedral stars and laser ribbon curtains atop each archway.

2. **Milestone Passing & Audio Synthesizer:**
   - Web Audio synthesizer triggers celebratory 4-note ascending arpeggio chimes (`D5`, `F#5`, `A5`, `D6`) upon passing under each gateway.
   - Instant milestone toast notifications and live HUD accumulation of total repos visited and stars crossed.
   - Clickable HUD links to jump directly to any repository on GitHub.

3. **Radar Modal & Milestone Fast Travel:**
   - Interactive 60-repo searchable radar drawer with real-time filtering by name or programming language.
   - 1-click **WARP** teleportation to instantly position the ball right before any chosen repository gate.
   - Keyboard shortcuts: `Left` / `Right` arrows and `P` / `N` to quickly jump between milestones.

4. **Continuous Angular Rolling Physics:**
   - Sphere body ($R = 0.85\text{m}$) rolls smoothly forward along the runway with true rotational velocity: $\Delta \theta = \frac{v \cdot \Delta t}{R}$.
   - Live telemetry monitors **ROTATION RPM** ($~560\text{ RPM}$ at $30\text{ km/h}$).

5. **Gyro-Stabilized Articulated Head:**
   - Perched atop the rolling sphere on a magnetic neck collar.
   - Bobs with roll harmonics, tilts aerodynamically into speed, and looks ahead down the open-source highway.
   - **CJ Head:** 1992 San Andreas buzzcut fade, goatee, and metallic gold Cuban chain with pendant draped around the collar.
   - **Kipchoge Head:** World-record marathon runner likeness.

6. **Curated Ball Skins:**
   - **Grove Street 8-Ball:** Glossy billiard black with white #8 insignia and neon green racing stripes.
   - **Octocat Sphere:** Dark charcoal shell with Git commit nodes and green branch lines.
   - **Cyber Grid:** Glowing green Tron digital matrix grid.
   - **Gold Chrome:** Mirror-reflective metallic sphere.

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

- **Graphics:** [Three.js](https://threejs.org/) (WebGL 3D Physics & Procedural Canvas Billboards)
- **Data:** GitHub REST API (60 verified repos >100,000 stars)
- **Audio:** Web Audio API (Synthesized rolling rumble & milestone arpeggio chimes)
- **Styling:** Minimalist Cyber-HUD CSS3 (Glassmorphism, responsive modal radar)
- **Deployment:** GitHub Pages & GitHub Actions CI/CD

---

## 📜 License

Released under the [MIT License](LICENSE) by **ngesa**.
