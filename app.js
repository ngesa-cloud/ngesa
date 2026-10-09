// ==============================================================================
// NGESA // THE IMMORTAL STRIDE — KIPCHOGE MARATHON SIMULATION ENGINE
// Ultra-Realistic Procedural Anatomical Athlete Rig, PBR Shaders & CFD Aerodynamics
// ==============================================================================

(function () {
  'use strict';

  // Simulation Parameters & Pacing Profiles
  const PACING_PROFILES = {
    sub2:       { label: '2:50 /KM', speedKmH: 21.18, cadence: 188, heartRate: 168, dragReduction: -85.4 },
    berlin:     { label: '2:52 /KM', speedKmH: 20.93, cadence: 184, heartRate: 165, dragReduction: -78.2 },
    hypersonic: { label: '1:30 /KM', speedKmH: 40.00, cadence: 220, heartRate: 195, dragReduction: -94.0 }
  };

  const BIOMES = {
    vienna: {
      name: 'Vienna Prater',
      fogColor: 0x0f172a,
      groundColor: 0x1e293b,
      roadColor: 0x111827,
      treeColor: 0x15803d,
      skyColor: 0x0284c7
    },
    kaptagat: {
      name: 'Kaptagat High Altitude Trail',
      fogColor: 0x451a03,
      groundColor: 0x7c2d12,
      roadColor: 0x9a3412,
      treeColor: 0x166534,
      skyColor: 0xf97316
    },
    cyber: {
      name: 'Cyber Void',
      fogColor: 0x05050f,
      groundColor: 0x030712,
      roadColor: 0x090d16,
      treeColor: 0x38bdf8,
      skyColor: 0xa855f7
    }
  };

  const KIPCHOGE_QUOTES = [
    "No Human Is Limited.",
    "Only the disciplined ones in life are free.",
    "Athletics is not so much about the legs. It's about the heart and mind.",
    "To win is not important. To be successful is not even important. How you plan and prepare is crucial.",
    "If you want to break a barrier, you have to be consistent in training.",
    "The best time to plant a tree was 25 years ago. The second-best time is today.",
    "I want to show the world that when you focus on your goal, when you work hard, nothing is impossible."
  ];

  // Engine State
  const state = {
    currentPace: 'sub2',
    currentBiome: 'vienna',
    cameraMode: 'chase',
    isDraftingActive: true,
    audioEnabled: false,
    distanceKm: 0.0,
    startTime: Date.now(),
    stridePhase: 0.0,
    quoteIdx: 0
  };

  // Three.js Scene Setup
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BIOMES.vienna.fogColor);
  scene.fog = new THREE.FogExp2(BIOMES.vienna.fogColor, 0.007);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Studio-Grade Athletic Lighting
  const ambientLight = new THREE.AmbientLight(0xbae6fd, 0.55); // Sky blue ambient fill
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4); // Morning golden sunlight
  sunLight.position.set(25, 60, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Rim / Silhouette Backlight (Accentuates runner musculature)
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
  rimLight.position.set(-20, 25, -35);
  scene.add(rimLight);

  // Laser Pace Car Green Glow Spotlight
  const laserCarGlow = new THREE.PointLight(0x00ff66, 1.8, 25);
  laserCarGlow.position.set(0, 1.5, 8.5);
  scene.add(laserCarGlow);

  // ==============================================================================
  // 1. DYNAMIC PROCEDURAL CANVAS TEXTURE GENERATORS
  // ==============================================================================

  function createSkinTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich Kenyan athletic skin tone base
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#422919');
    grad.addColorStop(0.5, '#382214');
    grad.addColorStop(1, '#2d1a0e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle muscle occlusion & dermal shading
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let y = 30; y < 512; y += 45) {
      ctx.beginPath();
      ctx.ellipse(256, y, 200, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Micro-pore stippling & glistening sweat sheen
    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 1.5;
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  function createFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base athletic skin tone
    ctx.fillStyle = '#382214';
    ctx.fillRect(0, 0, 512, 512);

    // Shaved head / buzzcut scalp fade
    const scalpGrad = ctx.createLinearGradient(0, 0, 0, 190);
    scalpGrad.addColorStop(0, '#1a1410');
    scalpGrad.addColorStop(0.8, '#251b14');
    scalpGrad.addColorStop(1, '#382214');
    ctx.fillStyle = scalpGrad;
    ctx.fillRect(0, 0, 512, 180);

    // Soft hairline curve
    ctx.fillStyle = '#221812';
    ctx.beginPath();
    ctx.ellipse(256, 175, 180, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows (Determined marathon focus)
    ctx.fillStyle = '#110c08';
    ctx.beginPath();
    ctx.ellipse(190, 225, 45, 8, -0.08, 0, Math.PI * 2);
    ctx.ellipse(322, 225, 45, 8, 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Eyes - Sclera (White)
    ctx.fillStyle = '#eaeaea';
    ctx.beginPath();
    ctx.ellipse(190, 248, 24, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(322, 248, 24, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark Espresso Irises
    ctx.fillStyle = '#1c1008';
    ctx.beginPath();
    ctx.arc(190, 248, 9, 0, Math.PI * 2);
    ctx.arc(322, 248, 9, 0, Math.PI * 2);
    ctx.fill();

    // Pupils & Specular Glint (Alert focused gaze)
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(190, 248, 4.5, 0, Math.PI * 2);
    ctx.arc(322, 248, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(188, 246, 2, 0, Math.PI * 2);
    ctx.arc(320, 246, 2, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Nose Bridge & Nostril Shadows
    const noseGrad = ctx.createLinearGradient(256, 230, 256, 330);
    noseGrad.addColorStop(0, 'rgba(70, 44, 28, 0.4)');
    noseGrad.addColorStop(1, 'rgba(25, 15, 9, 0.8)');
    ctx.fillStyle = noseGrad;
    ctx.beginPath();
    ctx.moveTo(250, 230);
    ctx.lineTo(262, 230);
    ctx.lineTo(272, 325);
    ctx.lineTo(240, 325);
    ctx.closePath();
    ctx.fill();

    // Nostrils
    ctx.fillStyle = '#140b06';
    ctx.beginPath();
    ctx.ellipse(242, 332, 7, 4, -0.2, 0, Math.PI * 2);
    ctx.ellipse(270, 332, 7, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Cheekbones & Temple Contours
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.ellipse(150, 290, 35, 18, 0.4, 0, Math.PI * 2);
    ctx.ellipse(362, 290, 35, 18, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Lips (Rhythmic distance-running respiration)
    ctx.fillStyle = '#442618';
    ctx.beginPath();
    ctx.ellipse(256, 375, 32, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c0f08'; // parted oral shadow
    ctx.beginPath();
    ctx.ellipse(256, 375, 22, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chin & Jawline Contour
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(256, 420, 45, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  function createSingletTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Clean white technical mesh fabric
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Micro-perforated breathable mesh texture
    ctx.fillStyle = 'rgba(215, 220, 230, 0.4)';
    for (let x = 0; x < 512; x += 6) {
      for (let y = 0; y < 512; y += 6) {
        ctx.fillRect(x + ((y % 12 === 0) ? 3 : 0), y, 2, 2);
      }
    }

    // INEOS Split Chevron Emblem on Upper Chest
    // Left chevron burgundy red
    ctx.fillStyle = '#8b1528';
    ctx.beginPath();
    ctx.moveTo(235, 90);
    ctx.lineTo(252, 110);
    ctx.lineTo(245, 118);
    ctx.lineTo(228, 98);
    ctx.closePath();
    ctx.fill();

    // Right chevron navy blue
    ctx.fillStyle = '#002244';
    ctx.beginPath();
    ctx.moveTo(277, 90);
    ctx.lineTo(260, 110);
    ctx.lineTo(267, 118);
    ctx.lineTo(284, 98);
    ctx.closePath();
    ctx.fill();

    // "INEOS" Wordmark
    ctx.fillStyle = '#001b3a';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INEOS', 256, 142);

    // Authentic Race Bib Card (#1:59 ELIUD)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillRect(146, 175, 220, 160);
    ctx.strokeRect(146, 175, 220, 160);

    // Bib Header
    ctx.fillStyle = '#8b1528';
    ctx.fillRect(148, 177, 216, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText('INEOS 1:59 CHALLENGE', 256, 195);

    // Bib Number "1:59"
    ctx.fillStyle = '#090d16';
    ctx.font = '900 56px -apple-system, monospace';
    ctx.fillText('1:59', 256, 265);

    // Athlete Name "ELIUD"
    ctx.fillStyle = '#002244';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('ELIUD', 256, 305);

    // Kenya Flag Stripe along bottom of bib
    const kw = 216 / 3;
    ctx.fillStyle = '#000000'; ctx.fillRect(148, 323, kw, 10);
    ctx.fillStyle = '#bb1e1e'; ctx.fillRect(148 + kw, 323, kw, 10);
    ctx.fillStyle = '#008a00'; ctx.fillRect(148 + kw * 2, 323, kw, 10);

    // Silver safety pin accents on corners
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(156, 185, 4, 0, Math.PI * 2);
    ctx.arc(356, 185, 4, 0, Math.PI * 2);
    ctx.arc(156, 325, 4, 0, Math.PI * 2);
    ctx.arc(356, 325, 4, 0, Math.PI * 2);
    ctx.fill();

    // Lower Hem Motto: "NO HUMAN IS LIMITED"
    ctx.fillStyle = 'rgba(0, 34, 68, 0.45)';
    ctx.font = 'bold 14px -apple-system, sans-serif';
    ctx.fillText('NO HUMAN IS LIMITED', 256, 470);

    return new THREE.CanvasTexture(canvas);
  }

  function createShortsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Deep matte black technical fabric
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle fabric ripstop weave
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = 0; x < 512; x += 8) {
      ctx.fillRect(x, 0, 1, 512);
      ctx.fillRect(0, x, 512, 1);
    }

    // Elastic waistband line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(0, 0, 512, 28);

    // Iconic Nike Swoosh on Left Hem
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(110, 420);
    ctx.bezierCurveTo(140, 410, 180, 425, 195, 445);
    ctx.bezierCurveTo(170, 440, 130, 435, 110, 420);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  function createShoeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Nike AtomKnit Upper: Vibrant Neon Volt Green to Atomic Orange
    const upperGrad = ctx.createLinearGradient(0, 0, 512, 0);
    upperGrad.addColorStop(0, '#a3e635'); // Neon Volt
    upperGrad.addColorStop(0.6, '#f97316'); // Bright Orange
    upperGrad.addColorStop(1, '#ef4444'); // Crimson Red
    ctx.fillStyle = upperGrad;
    ctx.fillRect(0, 0, 512, 280);

    // Huge Oversized Black Nike Swoosh across the upper
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(60, 110);
    ctx.bezierCurveTo(180, 90, 360, 140, 450, 230);
    ctx.bezierCurveTo(340, 210, 180, 180, 60, 110);
    ctx.fill();

    // Nike ZoomX High-Stack Curved Foam Midsole (39.5mm stack)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 280, 512, 170);

    // Carbon-Fiber Flyplate ribbon slicing through midsole
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 350, 512, 12);
    // Carbon weave pattern
    ctx.fillStyle = '#38bdf8';
    for (let c = 0; c < 512; c += 16) {
      ctx.fillRect(c, 352, 6, 8);
    }

    // Dual Nike Air Zoom Pods in Forefoot (Glowing Green / Cyan)
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(70, 380, 120, 55);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(80, 385, 100, 12);

    // Outsole Rubber Waffle Tread
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 450, 512, 62);

    return new THREE.CanvasTexture(canvas);
  }

  function createWatchTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Garmin Forerunner / Coros Titanium Bezel
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();

    // Digital Screen Face
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(128, 128, 100, 0, Math.PI * 2);
    ctx.fill();

    // Telemetry Display
    ctx.fillStyle = '#00ff66';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PACE', 128, 68);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 46px monospace';
    ctx.fillText('2:50', 128, 120);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('♥ 168', 128, 165);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('SPLIT 1:59:40', 128, 202);

    return new THREE.CanvasTexture(canvas);
  }

  function createKenyaWristbandTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Kenyan Flag Silicone Bracelet (Black, Red with White borders, Green)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 256, 18);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 18, 256, 28);
    ctx.fillStyle = '#bb1e1e';
    ctx.fillRect(0, 21, 256, 22);

    ctx.fillStyle = '#008a00';
    ctx.fillRect(0, 46, 256, 18);

    return new THREE.CanvasTexture(canvas);
  }

  function createRadialShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }

  function createPacerSingletTexture(idNum) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // INEOS Sleek Black Technical Singlet
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 512);

    // Red & Blue INEOS Accent Shoulder Stripes
    ctx.fillStyle = '#8b1528';
    ctx.fillRect(70, 0, 25, 180);
    ctx.fillStyle = '#002244';
    ctx.fillRect(417, 0, 25, 180);

    // INEOS Logo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INEOS 1:59', 256, 120);

    // Pacer Bib
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(166, 180, 180, 130);
    ctx.strokeStyle = '#8b1528';
    ctx.lineWidth = 4;
    ctx.strokeRect(166, 180, 180, 130);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText('PACEMAKER', 256, 215);

    ctx.fillStyle = '#8b1528';
    ctx.font = '900 62px -apple-system, monospace';
    ctx.fillText(`P${idNum}`, 256, 285);

    return new THREE.CanvasTexture(canvas);
  }

  // Pre-generate Textures
  const skinTexture = createSkinTexture();
  const faceTexture = createFaceTexture();
  const singletTexture = createSingletTexture();
  const shortsTexture = createShortsTexture();
  const shoeTexture = createShoeTexture();
  const watchTexture = createWatchTexture();
  const wristbandTexture = createKenyaWristbandTexture();
  const shadowTexture = createRadialShadowTexture();

  // High-Grade PBR Materials
  // Skin with realistic perspiration clearcoat & subsurface scattering warmth
  const skinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x3c2415,
    map: skinTexture,
    roughness: 0.32,
    metalness: 0.04,
    clearcoat: 0.45,
    clearcoatRoughness: 0.22,
    reflectivity: 0.5
  });

  const faceMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: faceTexture,
    roughness: 0.35,
    metalness: 0.02,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25
  });

  const singletMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: singletTexture,
    roughness: 0.65,
    metalness: 0.05
  });

  const shortsMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: shortsTexture,
    roughness: 0.75,
    metalness: 0.05
  });

  const shoeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: shoeTexture,
    roughness: 0.35,
    metalness: 0.15
  });

  const watchMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: watchTexture,
    roughness: 0.25,
    metalness: 0.8
  });

  const wristbandMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: wristbandTexture,
    roughness: 0.4
  });

  // ==============================================================================
  // 2. PROCEDURAL INFINITE RUNNING ROAD & ENVIRONMENT
  // ==============================================================================
  const roadWidth = 14;
  const roadLength = 300;

  // Road Surface (Tarmac)
  const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 1);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  scene.add(road);

  // Road Markings (Scrolling center lines)
  const linesGroup = new THREE.Group();
  scene.add(linesGroup);

  const lineGeo = new THREE.PlaneGeometry(0.35, 4);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const numLines = 30;
  const lineMeshes = [];

  for (let i = 0; i < numLines; i++) {
    const l = new THREE.Mesh(lineGeo, lineMat);
    l.rotation.x = -Math.PI / 2;
    l.position.set(0, 0.02, (i - numLines / 2) * 10);
    linesGroup.add(l);
    lineMeshes.push(l);
  }

  // INEOS 1:59 Green Laser Pacing Line Projector
  const laserGeo = new THREE.PlaneGeometry(roadWidth - 2, 0.45);
  const laserMat = new THREE.MeshBasicMaterial({
    color: 0x00ff66,
    transparent: true,
    opacity: 0.95
  });
  const laserLine = new THREE.Mesh(laserGeo, laserMat);
  laserLine.rotation.x = -Math.PI / 2;
  laserLine.position.set(0, 0.05, 8.5); // Projected 8.5m in front of Kipchoge
  scene.add(laserLine);

  // Holographic Laser Pacing Grid (Projected from the pace car)
  const laserGridGroup = new THREE.Group();
  scene.add(laserGridGroup);
  for (let g = 0; g < 6; g++) {
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth - 4, 0.08), laserMat);
    gl.rotation.x = -Math.PI / 2;
    gl.position.set(0, 0.05, 6.0 + g * 1.0);
    laserGridGroup.add(gl);
  }

  // Terrain Side Planes
  const groundGeo = new THREE.PlaneGeometry(350, roadLength);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });
  const groundLeft = new THREE.Mesh(groundGeo, groundMat);
  groundLeft.rotation.x = -Math.PI / 2;
  groundLeft.position.set(-180, -0.05, 0);
  groundLeft.receiveShadow = true;
  scene.add(groundLeft);

  const groundRight = new THREE.Mesh(groundGeo, groundMat);
  groundRight.rotation.x = -Math.PI / 2;
  groundRight.position.set(180, -0.05, 0);
  groundRight.receiveShadow = true;
  scene.add(groundRight);

  // Autumn Chestnut Trees (Vienna Prater Scenery)
  const sceneryGroup = new THREE.Group();
  scene.add(sceneryGroup);

  const treeGeo = new THREE.ConeGeometry(2.6, 7.5, 8);
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const trunkGeo = new THREE.CylinderGeometry(0.35, 0.5, 2.8, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3f2e18, roughness: 0.9 });

  const sceneryItems = [];
  const numTrees = 50;

  for (let i = 0; i < numTrees; i++) {
    const item = new THREE.Group();
    const foliage = new THREE.Mesh(treeGeo, treeMat);
    foliage.position.y = 4.8;
    foliage.castShadow = true;
    item.add(foliage);

    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.4;
    item.add(trunk);

    const side = (i % 2 === 0) ? 1 : -1;
    const x = side * (10 + Math.random() * 25);
    const z = (Math.random() - 0.5) * roadLength;
    item.position.set(x, 0, z);

    sceneryGroup.add(item);
    sceneryItems.push(item);
  }

  // ==============================================================================
  // 3. ANATOMICALLY SCULPTED ATHLETE RIG FACTORY (KIPCHOGE & PACERS)
  // ==============================================================================

  function createAthleteRig(isKipchoge, pacerId) {
    const rig = new THREE.Group();

    // Select materials
    const currentSingletMat = isKipchoge
      ? singletMaterial
      : new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: createPacerSingletTexture(pacerId),
          roughness: 0.65
        });

    const currentSkinMat = isKipchoge
      ? skinMaterial
      : new THREE.MeshPhysicalMaterial({
          color: 0x482d1c,
          map: skinTexture,
          roughness: 0.35,
          metalness: 0.04
        });

    // 1. Pelvic Girdle & Glutes (Athletic core)
    const pelvis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.25, 0.32, 16),
      shortsMaterial
    );
    pelvis.position.y = 1.95;
    rig.add(pelvis);

    // Running Split Shorts Leg Hems (left and right)
    const leftShortsHem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.26, 12), shortsMaterial);
    leftShortsHem.position.set(-0.16, -0.12, 0);
    pelvis.add(leftShortsHem);

    const rightShortsHem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.26, 12), shortsMaterial);
    rightShortsHem.position.set(0.16, -0.12, 0);
    pelvis.add(rightShortsHem);

    // 2. Torso (Athletic Ribcage, Pectorals, Latissimus Dorsi, Abdomen)
    const torso = new THREE.Group();
    torso.position.y = 0.22;
    pelvis.add(torso);

    // Chest & Ribcage compound mesh
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.27, 0.58, 16), currentSingletMat);
    chest.position.y = 0.36;
    chest.castShadow = true;
    torso.add(chest);

    // Sculpted Pectoral Muscles
    const leftPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), currentSingletMat);
    leftPec.scale.set(1.1, 0.7, 0.6);
    leftPec.position.set(-0.14, 0.44, 0.15);
    torso.add(leftPec);

    const rightPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), currentSingletMat);
    rightPec.scale.set(1.1, 0.7, 0.6);
    rightPec.position.set(0.14, 0.44, 0.15);
    torso.add(rightPec);

    // Trapezius / Clavicle Collarbone Ridge
    const clavicle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.52, 8), currentSkinMat);
    clavicle.rotation.z = Math.PI / 2;
    clavicle.position.set(0, 0.62, 0.04);
    torso.add(clavicle);

    // 3. Neck & Sculpted Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 12), currentSkinMat);
    neck.position.y = 0.72;
    torso.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.24;
    neck.add(headGroup);

    // Cranium with realistic facial texture
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), isKipchoge ? faceMaterial : currentSkinMat);
    head.scale.set(0.92, 1.15, 1.05);
    head.castShadow = true;
    headGroup.add(head);

    // 3D Sculpted Nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 8), currentSkinMat);
    nose.rotation.x = Math.PI / 2 + 0.25;
    nose.position.set(0, 0.02, 0.23);
    headGroup.add(nose);

    // 3D Sculpted Ears
    const leftEar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.03, 8), currentSkinMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.22, 0.02, 0.0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.03, 8), currentSkinMat);
    rightEar.rotation.z = -Math.PI / 2;
    rightEar.position.set(0.22, 0.02, 0.0);
    headGroup.add(rightEar);

    // 4. Arms & Fists (Shoulder, Deltoid, Bicep, Forearm, Hand)
    // Left Arm Rig
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.38, 0.54, 0.0);
    torso.add(leftShoulder);

    // Deltoid Shoulder Muscle Cap
    const leftDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), currentSkinMat);
    leftDeltoid.scale.set(0.9, 1.1, 0.9);
    leftShoulder.add(leftDeltoid);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12), currentSkinMat);
    leftUpperArm.position.y = -0.275;
    leftUpperArm.castShadow = true;
    leftShoulder.add(leftUpperArm);

    const leftElbow = new THREE.Group();
    leftElbow.position.set(0, -0.275, 0);
    leftUpperArm.add(leftElbow);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.5, 12), currentSkinMat);
    leftForearm.position.y = -0.25;
    leftForearm.castShadow = true;
    leftElbow.add(leftForearm);
    leftElbow.rotation.x = -1.5; // Compact 90-degree bent runner elbow

    // Left Wrist GPS Running Watch (Garmin / Coros)
    if (isKipchoge) {
      const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), watchMaterial);
      watch.rotation.z = Math.PI / 2;
      watch.position.set(0, -0.22, 0.04);
      leftForearm.add(watch);
    }

    // Left Hand (Clenched Marathon Runner Fist)
    const leftFist = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), currentSkinMat);
    leftFist.scale.set(0.9, 1.2, 0.8);
    leftFist.position.set(0, -0.32, 0);
    leftForearm.add(leftFist);

    // Right Arm Rig
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.38, 0.54, 0.0);
    torso.add(rightShoulder);

    const rightDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), currentSkinMat);
    rightDeltoid.scale.set(0.9, 1.1, 0.9);
    rightShoulder.add(rightDeltoid);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12), currentSkinMat);
    rightUpperArm.position.y = -0.275;
    rightUpperArm.castShadow = true;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.set(0, -0.275, 0);
    rightUpperArm.add(rightElbow);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.5, 12), currentSkinMat);
    rightForearm.position.y = -0.25;
    rightForearm.castShadow = true;
    rightElbow.add(rightForearm);
    rightElbow.rotation.x = -1.5;

    // Right Wrist Silicone Kenya Flag Bracelet
    if (isKipchoge) {
      const wristband = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 16), wristbandMaterial);
      wristband.position.set(0, -0.22, 0);
      rightForearm.add(wristband);
    }

    const rightFist = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), currentSkinMat);
    rightFist.scale.set(0.9, 1.2, 0.8);
    rightFist.position.set(0, -0.32, 0);
    rightForearm.add(rightFist);

    // 5. Lower Limbs (Quadriceps, Patella Kneecap, High Calf, Nike Alphafly NEXT%)
    function createShoeMesh() {
      const shoeGroup = new THREE.Group();

      // Nike ZoomX High-Stack Curved Foam Midsole
      const midsole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.62), shoeMaterial);
      midsole.position.set(0, -0.06, 0.08);
      midsole.castShadow = true;
      shoeGroup.add(midsole);

      // Aerodynamic Tapered Heel Fin (The iconic Alphafly wedge)
      const heelFin = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 4), shoeMaterial);
      heelFin.rotation.x = Math.PI / 2 + 0.3;
      heelFin.position.set(0, -0.05, -0.28);
      shoeGroup.add(heelFin);

      // Curved AtomKnit Racing Upper
      const upper = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), shoeMaterial);
      upper.scale.set(0.85, 0.75, 1.8);
      upper.position.set(0, 0.04, 0.09);
      shoeGroup.add(upper);

      // Dual Forefoot Air Zoom Pods Glow Accent
      const airPod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.22, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ff88 })
      );
      airPod.rotation.z = Math.PI / 2;
      airPod.position.set(0, -0.09, 0.18);
      shoeGroup.add(airPod);

      return shoeGroup;
    }

    // Left Leg Rig
    const leftHip = new THREE.Group();
    leftHip.position.set(-0.16, -0.16, 0);
    pelvis.add(leftHip);

    // Sculpted Thigh (Vastus Lateralis, Rectus Femoris, Hamstrings)
    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.115, 0.82, 16), currentSkinMat);
    leftThigh.position.y = -0.41;
    leftThigh.castShadow = true;
    leftHip.add(leftThigh);

    // Vastus Medialis (Teardrop muscle bulge above the knee)
    const leftTeardrop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), currentSkinMat);
    leftTeardrop.position.set(0.05, -0.32, 0.05);
    leftThigh.add(leftTeardrop);

    const leftKnee = new THREE.Group();
    leftKnee.position.set(0, -0.41, 0);
    leftThigh.add(leftKnee);

    // Patella (Kneecap bone)
    const leftPatella = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), currentSkinMat);
    leftPatella.position.set(0, 0, 0.075);
    leftKnee.add(leftPatella);

    // Sculpted Calf (High-insertion Kalenjin Gastrocnemius & slender Achilles tendon)
    const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.075, 0.84, 16), currentSkinMat);
    leftCalf.position.y = -0.42;
    leftCalf.castShadow = true;
    leftKnee.add(leftCalf);

    const leftCalfMuscle = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), currentSkinMat);
    leftCalfMuscle.scale.set(0.9, 1.4, 0.9);
    leftCalfMuscle.position.set(0, 0.12, -0.05);
    leftCalf.add(leftCalfMuscle);

    // Ankle & Shoe
    const leftAnkle = new THREE.Group();
    leftAnkle.position.set(0, -0.42, 0);
    leftCalf.add(leftAnkle);

    const leftShoe = createShoeMesh();
    leftAnkle.add(leftShoe);

    // Right Leg Rig
    const rightHip = new THREE.Group();
    rightHip.position.set(0.16, -0.16, 0);
    pelvis.add(rightHip);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.115, 0.82, 16), currentSkinMat);
    rightThigh.position.y = -0.41;
    rightThigh.castShadow = true;
    rightHip.add(rightThigh);

    const rightTeardrop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), currentSkinMat);
    rightTeardrop.position.set(-0.05, -0.32, 0.05);
    rightThigh.add(rightTeardrop);

    const rightKnee = new THREE.Group();
    rightKnee.position.set(0, -0.41, 0);
    rightThigh.add(rightKnee);

    const rightPatella = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), currentSkinMat);
    rightPatella.position.set(0, 0, 0.075);
    rightKnee.add(rightPatella);

    const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.075, 0.84, 16), currentSkinMat);
    rightCalf.position.y = -0.42;
    rightCalf.castShadow = true;
    rightKnee.add(rightCalf);

    const rightCalfMuscle = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), currentSkinMat);
    rightCalfMuscle.scale.set(0.9, 1.4, 0.9);
    rightCalfMuscle.position.set(0, 0.12, -0.05);
    rightCalf.add(rightCalfMuscle);

    const rightAnkle = new THREE.Group();
    rightAnkle.position.set(0, -0.42, 0);
    rightCalf.add(rightAnkle);

    const rightShoe = createShoeMesh();
    rightAnkle.add(rightShoe);

    return {
      rig,
      pelvis,
      torso,
      chest,
      headGroup,
      leftShoulder,
      leftElbow,
      rightShoulder,
      rightElbow,
      leftHip,
      leftKnee,
      leftAnkle,
      rightHip,
      rightKnee,
      rightAnkle
    };
  }

  // Create Eliud Kipchoge Rig
  const kipchoge = createAthleteRig(true, 0);
  scene.add(kipchoge.rig);

  // Dynamic Contact Ground Shadow Projector (Grounded realism)
  const contactShadowGeo = new THREE.PlaneGeometry(1.4, 2.2);
  const contactShadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02;
  scene.add(contactShadow);

  // ==============================================================================
  // 4. CFD 7-MAN PACING FORMATION (INVERTED ARROW SHIELD)
  // ==============================================================================
  const pacerGroup = new THREE.Group();
  scene.add(pacerGroup);

  const pacerPositions = [
    { x: 0, z: 5.2, id: 1 },       // Lead Point
    { x: -1.8, z: 3.6, id: 2 },    // Left Flank 1
    { x: 1.8, z: 3.6, id: 3 },     // Right Flank 1
    { x: -3.4, z: 2.0, id: 4 },    // Left Wing 2
    { x: 3.4, z: 2.0, id: 5 },     // Right Wing 2
    { x: -1.5, z: -3.2, id: 6 },   // Rear Left Wake Guard
    { x: 1.5, z: -3.2, id: 7 }     // Rear Right Wake Guard
  ];

  const pacers = [];
  pacerPositions.forEach((pos) => {
    const pacerObj = createAthleteRig(false, pos.id);
    pacerObj.rig.position.set(pos.x, 0, pos.z);
    pacerGroup.add(pacerObj.rig);
    pacers.push(pacerObj);
  });

  // Aerodynamic Slipstream Velocity Vectors (CFD Airflow)
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 220;
  const pPos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 12;
    pPos[i + 1] = 0.2 + Math.random() * 3.2;
    pPos[i + 2] = (Math.random() - 0.5) * 22;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  const particlesMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.15,
    transparent: true,
    opacity: 0.55
  });
  const streamParticles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(streamParticles);

  // ==============================================================================
  // 5. WEB AUDIO SYNTHESIZER (CADENCE METRONOME & SYNTHESIZED FOOTSTRIKES)
  // ==============================================================================
  let audioCtx = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }

  function playFootstrikeSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      // Sub-bass thud (Alphafly carbon plate bounce)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);

      // Micro noise burst (Tarmac shoe friction)
      const bufferSize = audioCtx.sampleRate * 0.04;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, audioCtx.currentTime);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  // ==============================================================================
  // 6. BIOMECHANICAL STRIDE ENGINE & SIMULATION LOOP (188 SPM KINEMATICS)
  // ==============================================================================
  let lastTime = performance.now();
  let footstrikeTriggered = false;

  function animate(now) {
    requestAnimationFrame(animate);

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    const profile = PACING_PROFILES[state.currentPace];
    const speedMps = (profile.speedKmH * 1000) / 3600;

    // Advance Distance Meter
    state.distanceKm += (speedMps * dt) / 1000;
    document.getElementById('metricDistance').innerHTML = `${state.distanceKm.toFixed(3)} <small>KM</small>`;

    // Continuous Stride Frequency
    const strideFreq = (profile.cadence / 60) * Math.PI * 2;
    state.stridePhase += strideFreq * dt;

    // Harmonized Trigonometric Phases
    const phase = state.stridePhase;
    const sinPhase = Math.sin(phase);
    const cosPhase = Math.cos(phase);

    // 1. Center of Gravity (CoG) Vertical Oscillation & Forward Lean
    kipchoge.pelvis.position.y = 1.95 + Math.abs(cosPhase) * 0.075;
    kipchoge.torso.rotation.x = 0.12 + Math.sin(phase * 2) * 0.015; // Rhythmic respiration lean
    kipchoge.torso.rotation.y = -sinPhase * 0.14; // Thoracic counter-rotation (shoulders vs hips)
    kipchoge.pelvis.rotation.y = sinPhase * 0.06; // Pelvic yaw
    kipchoge.pelvis.rotation.z = Math.sin(phase) * 0.035; // Pelvic lateral tilt

    // Head stabilization (focused calm gaze fixed on laser line)
    kipchoge.headGroup.rotation.y = sinPhase * 0.05;
    kipchoge.headGroup.rotation.x = -0.05;

    // 2. High-Fidelity Leg Kinematics (Hip Extension, High Heel Kick, Forefoot Plant)
    // Left Leg
    kipchoge.leftHip.rotation.x = sinPhase * 0.72;
    // Elite high heel kick on backswing (sinPhase < 0), unfolded on forward drive
    if (sinPhase < 0) {
      kipchoge.leftKnee.rotation.x = Math.abs(sinPhase) * 1.85; // Heel tucks high toward glute
      kipchoge.leftAnkle.rotation.x = -0.35; // Plantarflexion at toe-off
    } else {
      kipchoge.leftKnee.rotation.x = Math.max(0.12, (1 - sinPhase) * 0.65); // Forward knee drive
      kipchoge.leftAnkle.rotation.x = 0.22; // Ankle dorsiflexion preparing for forefoot impact
    }

    // Right Leg (Anti-phase)
    kipchoge.rightHip.rotation.x = -sinPhase * 0.72;
    if (-sinPhase < 0) {
      kipchoge.rightKnee.rotation.x = Math.abs(-sinPhase) * 1.85;
      kipchoge.rightAnkle.rotation.x = -0.35;
    } else {
      kipchoge.rightKnee.rotation.x = Math.max(0.12, (1 - (-sinPhase)) * 0.65);
      kipchoge.rightAnkle.rotation.x = 0.22;
    }

    // Dynamic Ground Contact Shadow
    contactShadow.position.y = 0.02;
    const shadowScale = 1 - Math.abs(cosPhase) * 0.2;
    contactShadow.scale.set(shadowScale, shadowScale * 1.4, 1);
    contactShadow.material.opacity = 0.65 - Math.abs(cosPhase) * 0.25;

    // 3. Compact Athletic Arm Swing
    kipchoge.leftShoulder.rotation.x = -sinPhase * 0.68;
    kipchoge.leftShoulder.rotation.y = -cosPhase * 0.12;
    kipchoge.leftShoulder.rotation.z = -0.12;

    kipchoge.rightShoulder.rotation.x = sinPhase * 0.68;
    kipchoge.rightShoulder.rotation.y = cosPhase * 0.12;
    kipchoge.rightShoulder.rotation.z = 0.12;

    // 4. Footstrike Audio Synthesis Trigger
    if (sinPhase > 0.94 && !footstrikeTriggered) {
      playFootstrikeSound();
      footstrikeTriggered = true;
    } else if (sinPhase < 0.15 && footstrikeTriggered) {
      footstrikeTriggered = false;
    }

    // 5. Synchronized CFD Pacers Movement
    if (state.isDraftingActive) {
      pacers.forEach((pacer, idx) => {
        const pPhase = phase + idx * 0.45;
        const pSin = Math.sin(pPhase);
        const pCos = Math.cos(pPhase);

        pacer.pelvis.position.y = 1.95 + Math.abs(pCos) * 0.07;
        pacer.torso.rotation.x = 0.12;
        pacer.torso.rotation.y = -pSin * 0.12;

        pacer.leftHip.rotation.x = pSin * 0.7;
        pacer.leftKnee.rotation.x = pSin < 0 ? Math.abs(pSin) * 1.8 : 0.25;

        pacer.rightHip.rotation.x = -pSin * 0.7;
        pacer.rightKnee.rotation.x = -pSin < 0 ? Math.abs(-pSin) * 1.8 : 0.25;

        pacer.leftShoulder.rotation.x = -pSin * 0.65;
        pacer.rightShoulder.rotation.x = pSin * 0.65;
      });
    }

    // 6. Infinite Road & Scenery Scrolling
    const scrollStep = speedMps * dt * 2.5;
    lineMeshes.forEach((l) => {
      l.position.z -= scrollStep;
      if (l.position.z < -roadLength / 2) l.position.z += roadLength;
    });

    sceneryItems.forEach((item) => {
      item.position.z -= scrollStep;
      if (item.position.z < -roadLength / 2) item.position.z += roadLength;
    });

    // 7. CFD Aerodynamic Airflow Stream Update
    const posAttr = particlesGeo.attributes.position;
    for (let i = 2; i < particleCount * 3; i += 3) {
      posAttr.array[i] -= scrollStep * 1.6;
      if (posAttr.array[i] < -14) posAttr.array[i] += 28;
    }
    posAttr.needsUpdate = true;

    // 8. Dynamic Camera Perspective Controls
    updateCamera(now);

    renderer.render(scene, camera);
  }

  function updateCamera(time) {
    if (state.cameraMode === 'chase') {
      // Third-person broadcast tracking behind Kipchoge
      camera.position.set(0, 2.8, -5.8);
      camera.lookAt(0, 1.8, 3.5);
    } else if (state.cameraMode === 'broadcast') {
      // Front-facing lead pace car tracking Kipchoge head-on
      camera.position.set(0, 2.3, 8.8);
      camera.lookAt(0, 1.8, 0);
    } else if (state.cameraMode === 'profile') {
      // Lateral 90-degree sagittal biomechanical analysis view
      camera.position.set(-5.2, 1.9, 0.4);
      camera.lookAt(0, 1.7, 0.2);
    } else if (state.cameraMode === 'closeup') {
      // Intimate close-up portrait focus on Kipchoge's face and upper body
      camera.position.set(0, 2.1, 2.7);
      camera.lookAt(0, 2.05, 0);
    } else if (state.cameraMode === 'cinematic') {
      // Sweeping 360-degree orbital drone
      const angle = (time * 0.00035);
      camera.position.set(Math.sin(angle) * 8.5, 3.2 + Math.cos(angle * 2) * 0.8, Math.cos(angle) * 8.5);
      camera.lookAt(0, 1.8, 0);
    }
  }

  // ==============================================================================
  // 7. INTERACTIVE UI HANDLERS & EXPOSURE
  // ==============================================================================
  window.setBiome = function (biomeId) {
    const b = BIOMES[biomeId];
    if (!b) return;
    state.currentBiome = biomeId;

    scene.background.setHex(b.fogColor);
    scene.fog.color.setHex(b.fogColor);
    roadMat.color.setHex(b.roadColor);
    groundLeft.material.color.setHex(b.groundColor);
    groundRight.material.color.setHex(b.groundColor);
    treeMat.color.setHex(b.treeColor);

    document.querySelectorAll('[data-biome]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-biome="${biomeId}"]`).classList.add('active');
  };

  window.setCameraMode = function (modeId) {
    state.cameraMode = modeId;
    document.querySelectorAll('[data-cam]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-cam="${modeId}"]`).classList.add('active');
  };

  window.setPacingMode = function (paceId) {
    const p = PACING_PROFILES[paceId];
    if (!p) return;
    state.currentPace = paceId;

    document.getElementById('metricPace').innerHTML = `${p.label}`;
    document.getElementById('metricCadence').innerHTML = `${p.cadence} <small>SPM</small>`;
    document.getElementById('metricHeartRate').innerHTML = `${p.heartRate} <small>BPM</small>`;
    document.getElementById('metricDrag').innerHTML = `${p.dragReduction.toFixed(1)}%`;

    document.querySelectorAll('[data-pace]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-pace="${paceId}"]`).classList.add('active');
  };

  window.toggleDrafting = function () {
    state.isDraftingActive = !state.isDraftingActive;
    pacerGroup.visible = state.isDraftingActive;
    streamParticles.visible = state.isDraftingActive;

    const btn = document.getElementById('draftingBtn');
    btn.classList.toggle('active', state.isDraftingActive);
    document.getElementById('metricDrag').innerHTML = state.isDraftingActive
      ? `${PACING_PROFILES[state.currentPace].dragReduction.toFixed(1)}%`
      : '0.0%';
  };

  // Audio Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  audioBtn.addEventListener('click', () => {
    initAudio();
    state.audioEnabled = !state.audioEnabled;
    document.getElementById('audioIcon').innerText = state.audioEnabled ? '🔊' : '🔇';
    document.getElementById('audioText').innerText = state.audioEnabled ? 'Sound: On' : 'Sound: Off';
  });

  // Quotation Carousel (Every 12 seconds)
  setInterval(() => {
    state.quoteIdx = (state.quoteIdx + 1) % KIPCHOGE_QUOTES.length;
    const qEl = document.getElementById('quoteText');
    qEl.style.opacity = 0;
    setTimeout(() => {
      qEl.innerHTML = `&ldquo;${KIPCHOGE_QUOTES[state.quoteIdx]}&rdquo;`;
      qEl.style.opacity = 1;
    }, 400);
  }, 12000);

  // Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Boot Engine
  animate(performance.now());
})();
