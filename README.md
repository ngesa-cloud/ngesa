# NGESA // The Immortal Stride 🏃💨

> **"No Human is Limited."** &mdash; Eliud Kipchoge

An interactive, procedural 3D WebGL marathon simulation emulating a digital clone of **Eliud Kipchoge** that runs infinitely with authentic biomechanics, CFD drafting physics, and sub-2:00:00 pacing.

[![Deploy to GitHub Pages](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml/badge.svg)](https://github.com/ngesa-cloud/ngesa/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20Simulation-10b981?style=flat&logo=safari)](https://ngesa-cloud.github.io/ngesa/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ⚡ Overview & Simulation Features

**NGESA** brings the historical Vienna INEOS 1:59 Challenge into your browser through an infinite 3D procedural simulation:

1. **Procedural Kinematic Running Engine (Three.js):**
   - High-fidelity articulated runner skeleton constructed entirely with procedural geometry and phong shading.
   - Harmonic stride kinematics: Hip flexion, knee recoil, plantar ankle strike, and shoulder/arm counter-rotation synced to a natural **188 SPM (Steps Per Minute)** cadence.
   - Dynamic vertical oscillation (CoG bounce) tuned to marathon running biomechanics.

2. **CFD Aerodynamic Drafting Formation:**
   - Accurate 7-pacemaker inverted-V aerodynamic shield based on Eindhoven University of Technology wind-tunnel / CFD studies (Bert Blocken et al.).
   - Reduces aerodynamic drag coefficient by **~85.4%** compared to solo running.
   - Visual toggleable aerodynamic slipstream vector lines and velocity wake fields.

3. **INEOS 1:59 Electric Pace Car & Laser Beam:**
   - Projected holographic green laser grid guiding the exact 2:50 min/km (21.18 km/h) world-record pacing line.

4. **Multi-Biome Environments:**
   - **Vienna Prater Hauptallee:** The iconic autumnal parkway lined with chestnut trees and tarmac.
   - **Kaptagat Highlands Trail:** High-altitude dirt training route (2,400m elevation) with acacia trees and Kenyan red clay.
   - **Cyber Void:** Futuristic dark neon grid with glowing aerodynamic force lines.

5. **Dynamic Camera Perspectives:**
   - **Lead Chase (Broadcast):** Follow from the front pace car.
   - **Side Profile:** Biomechanical stride analysis angle.
   - **Drone Flyover:** Aerial view showing the 7-man CFD arrowhead formation.
   - **First-Person POV:** Running right behind the lead pacers.

6. **Generative Web Audio Footstrike Synthesizer:**
   - Procedural footstrike audio synthesized via the Web Audio API (white noise bursts filtered through biquad lowpass resonators) synchronized with foot impact.

---

## 📊 Telemetry & HUD

* **Distance Elapsed:** Real-time distance counter incrementing infinitely.
* **Marathon Splits:** Automatic calculation of 5K, 10K, Half, and Full Marathon projected splits.
* **Biometric Heart Rate:** Dynamic heart rate monitor (168 BPM nominal).
* **Caloric Burn Rate:** High-accuracy metabolic energy expenditure calculation (~1,040 kcal/hr).
* **Quotes Carousel:** Curated philosophical reflections from Kipchoge on discipline, focus, and human limits.

---

## 🚀 Live Access & Local Quickstart

### Live Deployment
Experience the simulation directly in any modern browser:
👉 **[https://ngesa-cloud.github.io/ngesa/](https://ngesa-cloud.github.io/ngesa/)**

### Local Setup
Clone the repository and run with any static HTTP server:

```bash
# Clone repository
git clone https://github.com/ngesa-cloud/ngesa.git

# Navigate to project
cd ngesa

# Launch local server
python3 -m http.server 8080
# or
npx serve .
```

Open `http://localhost:8080` in your browser.

---

## 🛠️ Tech Stack

- **Graphics:** [Three.js](https://threejs.org/) (WebGL 3D Rendering)
- **Audio:** Web Audio API (Procedural sound synthesis)
- **Styling:** Vanilla CSS3 (Glassmorphism HUD, responsive layout)
- **Deployment:** GitHub Pages & GitHub Actions CI/CD
- **PWA:** Service Worker caching & Manifest

---

## 📜 License

Released under the [MIT License](LICENSE) by **ngesa**.
