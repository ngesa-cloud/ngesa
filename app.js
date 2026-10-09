// ==============================================================================
// NGESA // THE IMMORTAL STRIDE — CJ (CARL JOHNSON) MINIMALIST RUNNER ENGINE
// Featuring CJ from GTA San Andreas running infinitely with Max Stamina
// ==============================================================================

(function () {
  'use strict';

  // Pacing & Speed Configurations
  const PACING_PROFILES = {
    jog:      { label: '12.0', speedKmH: 12.0, cadence: 160, stamina: '95%' },
    sprint:   { label: '21.2', speedKmH: 21.18, cadence: 188, stamina: 'MAX 100%' },
    infinite: { label: '40.0', speedKmH: 40.0, cadence: 220, stamina: 'INFINITE' }
  };

  const THEMES = {
    grove: {
      name: 'Grove Street',
      bg: 0x04060a,
      fog: 0x04060a,
      road: 0x080c14,
      ground: 0x030407,
      laser: 0x00ff66,
      ambient: 0x64748b,
      sun: 0xfffaed,
      rim: 0x22c55e
    },
    fierro: {
      name: 'San Fierro Fog',
      bg: 0x080e18,
      fog: 0x080e18,
      road: 0x0f172a,
      ground: 0x040812,
      laser: 0x38bdf8,
      ambient: 0x94a3b8,
      sun: 0xf0f9ff,
      rim: 0x0284c7
    },
    vinewood: {
      name: 'Vinewood Sunset',
      bg: 0x12080a,
      fog: 0x12080a,
      road: 0x180c10,
      ground: 0x0a0406,
      laser: 0xf97316,
      ambient: 0xfbbf24,
      sun: 0xffedd5,
      rim: 0xf43f5e
    }
  };

  const CJ_QUOTES = [
    "Ah shit, here we go again.",
    "Grove Street. Home. At least it was before I fucked everything up.",
    "All we had to do was follow the damn train, CJ!",
    "Ain't nobody gonna stop me today, homie.",
    "I'm a Grove Street OG, born and raised.",
    "Yeah, this is my hood.",
    "You picked the wrong house, fool!",
    "No human is limited &mdash; not even in Los Santos."
  ];

  // Engine State
  const state = {
    currentRunner: 'cj', // Default to CJ
    currentPace: 'sprint',
    currentTheme: 'grove',
    cameraMode: 'chase',
    audioEnabled: false,
    distanceKm: 0.0,
    startTime: Date.now(),
    stridePhase: 0.0,
    quoteIdx: 0
  };

  // Three.js Scene Setup
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(THEMES.grove.bg);
  scene.fog = new THREE.FogExp2(THEMES.grove.fog, 0.009);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Minimalist Museum Lighting
  const ambientLight = new THREE.AmbientLight(THEMES.grove.ambient, 0.65);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(THEMES.grove.sun, 1.4);
  sunLight.position.set(20, 45, 18);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0004;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(THEMES.grove.rim, 0.85);
  rimLight.position.set(-18, 20, -30);
  scene.add(rimLight);

  // ==============================================================================
  // 1. PROCEDURAL TEXTURES (CJ & KIPCHOGE)
  // ==============================================================================

  // CJ Skin
  function createCJSkinTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#422818');
    grad.addColorStop(0.5, '#382012');
    grad.addColorStop(1, '#2b170c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    return new THREE.CanvasTexture(canvas);
  }

  // CJ Head & Face (Buzzcut, Goatee, Mustache, Focused 90s San Andreas Expression)
  function createCJFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#382012';
    ctx.fillRect(0, 0, 512, 512);

    // Iconic 1992 Buzzcut Fade
    const hairGrad = ctx.createLinearGradient(0, 0, 0, 195);
    hairGrad.addColorStop(0, '#100c09');
    hairGrad.addColorStop(0.8, '#1e140d');
    hairGrad.addColorStop(1, '#382012');
    ctx.fillStyle = hairGrad;
    ctx.fillRect(0, 0, 512, 185);

    // Hairline
    ctx.fillStyle = '#140e0a';
    ctx.beginPath();
    ctx.ellipse(256, 178, 175, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.fillStyle = '#0a0705';
    ctx.beginPath();
    ctx.ellipse(190, 225, 42, 8, -0.06, 0, Math.PI * 2);
    ctx.ellipse(322, 225, 42, 8, 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.ellipse(190, 248, 22, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(322, 248, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1c1008';
    ctx.beginPath();
    ctx.arc(190, 248, 8, 0, Math.PI * 2);
    ctx.arc(322, 248, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(190, 248, 4, 0, Math.PI * 2);
    ctx.arc(322, 248, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(188, 246, 1.8, 0, Math.PI * 2);
    ctx.arc(320, 246, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = 'rgba(25, 14, 8, 0.75)';
    ctx.beginPath();
    ctx.moveTo(250, 230);
    ctx.lineTo(262, 230);
    ctx.lineTo(270, 320);
    ctx.lineTo(242, 320);
    ctx.closePath();
    ctx.fill();

    // Nostrils
    ctx.fillStyle = '#100804';
    ctx.beginPath();
    ctx.ellipse(244, 325, 6, 3, -0.2, 0, Math.PI * 2);
    ctx.ellipse(268, 325, 6, 3, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // CJ's Iconic Mustache Stubble
    ctx.fillStyle = '#160f0a';
    ctx.beginPath();
    ctx.ellipse(256, 355, 34, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lips
    ctx.fillStyle = '#442618';
    ctx.beginPath();
    ctx.ellipse(256, 375, 30, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // CJ's Chin Goatee Stubble
    ctx.fillStyle = '#160f0a';
    ctx.beginPath();
    ctx.ellipse(256, 420, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // CJ's Iconic White Ribbed Tank Top
  function createCJTankTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 512);

    // Vertical ribbed knit pattern
    ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
    for (let x = 0; x < 512; x += 5) {
      ctx.fillRect(x, 0, 2, 512);
    }

    // Fabric shadows along neckline & armholes
    ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.fillRect(0, 0, 512, 20);

    return new THREE.CanvasTexture(canvas);
  }

  // CJ's Baggy Blue Denim Jeans
  function createCJJeansTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Stonewash Denim Indigo Blue Base
    const denimGrad = ctx.createLinearGradient(0, 0, 0, 512);
    denimGrad.addColorStop(0, '#1e3a8a');
    denimGrad.addColorStop(0.3, '#2563eb');
    denimGrad.addColorStop(0.7, '#1d4ed8');
    denimGrad.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = denimGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Micro crosshatch denim twill weave
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 512; i += 4) {
      ctx.fillRect(i, 0, 1, 512);
      ctx.fillRect(0, i, 512, 1);
    }

    // Brown Leather Belt at Waistband
    ctx.fillStyle = '#5c3826';
    ctx.fillRect(0, 0, 512, 34);

    // Brass Belt Buckle
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(236, 4, 40, 26);
    ctx.fillStyle = '#5c3826';
    ctx.fillRect(242, 10, 28, 14);

    // Gold Topstitching & Rivets
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 36, 492, 2);

    return new THREE.CanvasTexture(canvas);
  }

  // CJ's Black Canvas Sneakers with White Rubber Toe Cap
  function createCJSneakerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Black Canvas Upper
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 512);

    // White Rubber Toe Cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(80, 256, 75, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Thick Rubber Midsole Foxing
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 420, 512, 85);

    // Black Foxing Stripe
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 445, 512, 8);

    // White Laces
    ctx.fillStyle = '#ffffff';
    for (let y = 140; y < 380; y += 40) {
      ctx.fillRect(180, y, 150, 8);
    }

    return new THREE.CanvasTexture(canvas);
  }

  // Ground Shadow Texture
  function createRadialShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }

  // Kipchoge Textures for Character Switching
  function createKipchogeSingletTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#8b1528'; ctx.fillRect(148, 177, 216, 26);
    ctx.fillStyle = '#090d16'; ctx.font = '900 54px monospace'; ctx.textAlign = 'center';
    ctx.fillText('1:59', 256, 265);
    ctx.font = 'bold 20px sans-serif'; ctx.fillText('ELIUD', 256, 305);
    return new THREE.CanvasTexture(canvas);
  }

  // Pre-generate Textures
  const cjSkinTex = createCJSkinTexture();
  const cjFaceTex = createCJFaceTexture();
  const cjTankTex = createCJTankTexture();
  const cjJeansTex = createCJJeansTexture();
  const cjSneakerTex = createCJSneakerTexture();
  const shadowTex = createRadialShadowTexture();
  const kipchogeSingletTex = createKipchogeSingletTexture();

  // Materials
  const cjSkinMat = new THREE.MeshPhysicalMaterial({
    color: 0x382012,
    map: cjSkinTex,
    roughness: 0.35,
    metalness: 0.04,
    clearcoat: 0.35
  });

  const cjFaceMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: cjFaceTex,
    roughness: 0.38,
    metalness: 0.02
  });

  const cjTankMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: cjTankTex,
    roughness: 0.7
  });

  const cjJeansMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: cjJeansTex,
    roughness: 0.85
  });

  const cjSneakerMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: cjSneakerTex,
    roughness: 0.45
  });

  const goldChainMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85
  });

  const kipchogeSingletMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: kipchogeSingletTex,
    roughness: 0.65
  });

  const kipchogeShortsMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.75
  });

  // ==============================================================================
  // 2. MINIMALIST INFINITE ROAD (GROVE STREET / MINIMALIST RUNWAY)
  // ==============================================================================
  const runwayWidth = 6.0;
  const runwayLength = 260;

  // Runway Surface
  const roadGeo = new THREE.PlaneGeometry(runwayWidth, runwayLength, 1, 1);
  const roadMat = new THREE.MeshStandardMaterial({
    color: THEMES.grove.road,
    roughness: 0.65,
    metalness: 0.25
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  scene.add(road);

  // Dashed Centerline
  const linesGroup = new THREE.Group();
  scene.add(linesGroup);

  const lineGeo = new THREE.PlaneGeometry(0.18, 3.5);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
  const numLines = 26;
  const lineMeshes = [];

  for (let i = 0; i < numLines; i++) {
    const l = new THREE.Mesh(lineGeo, lineMat);
    l.rotation.x = -Math.PI / 2;
    l.position.set(0, 0.015, (i - numLines / 2) * 10);
    linesGroup.add(l);
    lineMeshes.push(l);
  }

  // Thin Edge Guidelines
  const edgeGeo = new THREE.PlaneGeometry(0.04, runwayLength);
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 });
  const edgeLeft = new THREE.Mesh(edgeGeo, edgeMat);
  edgeLeft.rotation.x = -Math.PI / 2;
  edgeLeft.position.set(-runwayWidth / 2, 0.015, 0);
  scene.add(edgeLeft);

  const edgeRight = new THREE.Mesh(edgeGeo, edgeMat);
  edgeRight.rotation.x = -Math.PI / 2;
  edgeRight.position.set(runwayWidth / 2, 0.015, 0);
  scene.add(edgeRight);

  // Minimalist Green Pace / Target Laser
  const laserGeo = new THREE.PlaneGeometry(runwayWidth + 0.5, 0.28);
  const laserMat = new THREE.MeshBasicMaterial({
    color: THEMES.grove.laser,
    transparent: true,
    opacity: 0.95
  });
  const laserLine = new THREE.Mesh(laserGeo, laserMat);
  laserLine.rotation.x = -Math.PI / 2;
  laserLine.position.set(0, 0.02, 6.5);
  scene.add(laserLine);

  // Infinite Minimalist Ground Horizon
  const groundGeo = new THREE.PlaneGeometry(400, runwayLength);
  const groundMat = new THREE.MeshBasicMaterial({ color: THEMES.grove.ground });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  // ==============================================================================
  // 3. ATHLETE 3D RIG (CJ VS KIPCHOGE)
  // ==============================================================================

  function buildRunner(type) {
    const rig = new THREE.Group();
    const isCJ = (type === 'cj');

    // Materials based on character
    const upperMat = isCJ ? cjTankMat : kipchogeSingletMat;
    const lowerMat = isCJ ? cjJeansMat : kipchogeShortsMat;
    const shoeMat = isCJ ? cjSneakerMat : cjSneakerMat;
    const skinMat = isCJ ? cjSkinMat : cjSkinMat;
    const faceMat = isCJ ? cjFaceMat : cjFaceMat;

    // 1. Pelvis & Waist
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.26, 0.32, 16), lowerMat);
    pelvis.position.y = 1.95;
    rig.add(pelvis);

    const leftShortsHem = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.19, 0.26, 12), lowerMat);
    leftShortsHem.position.set(-0.16, -0.12, 0);
    pelvis.add(leftShortsHem);

    const rightShortsHem = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.19, 0.26, 12), lowerMat);
    rightShortsHem.position.set(0.16, -0.12, 0);
    pelvis.add(rightShortsHem);

    // 2. Torso (Chest & Tank Top)
    const torso = new THREE.Group();
    torso.position.y = 0.22;
    pelvis.add(torso);

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.58, 16), upperMat);
    chest.position.y = 0.36;
    chest.castShadow = true;
    torso.add(chest);

    const leftPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), upperMat);
    leftPec.scale.set(1.1, 0.7, 0.6);
    leftPec.position.set(-0.14, 0.44, 0.15);
    torso.add(leftPec);

    const rightPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), upperMat);
    rightPec.scale.set(1.1, 0.7, 0.6);
    rightPec.position.set(0.14, 0.44, 0.15);
    torso.add(rightPec);

    // 3. Neck & Gold Chain
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 12), skinMat);
    neck.position.y = 0.72;
    torso.add(neck);

    if (isCJ) {
      // CJ's Gold Curb Chain around Neck
      const chain = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 8, 20), goldChainMat);
      chain.rotation.x = Math.PI / 2.5;
      chain.position.set(0, 0.68, 0.02);
      torso.add(chain);
    }

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.24;
    neck.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), faceMat);
    head.scale.set(0.92, 1.15, 1.05);
    head.castShadow = true;
    headGroup.add(head);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 8), skinMat);
    nose.rotation.x = Math.PI / 2 + 0.25;
    nose.position.set(0, 0.02, 0.23);
    headGroup.add(nose);

    const leftEar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.03, 8), skinMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.22, 0.02, 0.0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.03, 8), skinMat);
    rightEar.rotation.z = -Math.PI / 2;
    rightEar.position.set(0.22, 0.02, 0.0);
    headGroup.add(rightEar);

    // 4. Arms & Fists
    // Left Arm
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.38, 0.54, 0.0);
    torso.add(leftShoulder);

    const leftDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), skinMat);
    leftDeltoid.scale.set(0.9, 1.1, 0.9);
    leftShoulder.add(leftDeltoid);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12), skinMat);
    leftUpperArm.position.y = -0.275;
    leftUpperArm.castShadow = true;
    leftShoulder.add(leftUpperArm);

    const leftElbow = new THREE.Group();
    leftElbow.position.set(0, -0.275, 0);
    leftUpperArm.add(leftElbow);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.5, 12), skinMat);
    leftForearm.position.y = -0.25;
    leftForearm.castShadow = true;
    leftElbow.add(leftForearm);
    leftElbow.rotation.x = -1.5;

    // CJ's Black Watch on Left Wrist
    const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3 }));
    watch.position.set(0, -0.22, 0);
    leftForearm.add(watch);

    const leftFist = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), skinMat);
    leftFist.scale.set(0.9, 1.2, 0.8);
    leftFist.position.set(0, -0.32, 0);
    leftForearm.add(leftFist);

    // Right Arm
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.38, 0.54, 0.0);
    torso.add(rightShoulder);

    const rightDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), skinMat);
    rightDeltoid.scale.set(0.9, 1.1, 0.9);
    rightShoulder.add(rightDeltoid);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12), skinMat);
    rightUpperArm.position.y = -0.275;
    rightUpperArm.castShadow = true;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.set(0, -0.275, 0);
    rightUpperArm.add(rightElbow);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.5, 12), skinMat);
    rightForearm.position.y = -0.25;
    rightForearm.castShadow = true;
    rightElbow.add(rightForearm);
    rightElbow.rotation.x = -1.5;

    const rightFist = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), skinMat);
    rightFist.scale.set(0.9, 1.2, 0.8);
    rightFist.position.set(0, -0.32, 0);
    rightForearm.add(rightFist);

    // 5. Lower Limbs (Jeans & Black Canvas Sneakers)
    function createShoeMesh() {
      const shoeGroup = new THREE.Group();
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.6), shoeMat);
      sole.position.set(0, -0.06, 0.08);
      sole.castShadow = true;
      shoeGroup.add(sole);

      const upper = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), shoeMat);
      upper.scale.set(0.85, 0.75, 1.8);
      upper.position.set(0, 0.04, 0.09);
      shoeGroup.add(upper);

      return shoeGroup;
    }

    // Left Leg
    const leftHip = new THREE.Group();
    leftHip.position.set(-0.16, -0.16, 0);
    pelvis.add(leftHip);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.82, 16), lowerMat);
    leftThigh.position.y = -0.41;
    leftThigh.castShadow = true;
    leftHip.add(leftThigh);

    const leftKnee = new THREE.Group();
    leftKnee.position.set(0, -0.41, 0);
    leftThigh.add(leftKnee);

    const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.84, 16), isCJ ? lowerMat : skinMat);
    leftCalf.position.y = -0.42;
    leftCalf.castShadow = true;
    leftKnee.add(leftCalf);

    const leftAnkle = new THREE.Group();
    leftAnkle.position.set(0, -0.42, 0);
    leftCalf.add(leftAnkle);
    leftAnkle.add(createShoeMesh());

    // Right Leg
    const rightHip = new THREE.Group();
    rightHip.position.set(0.16, -0.16, 0);
    pelvis.add(rightHip);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.82, 16), lowerMat);
    rightThigh.position.y = -0.41;
    rightThigh.castShadow = true;
    rightHip.add(rightThigh);

    const rightKnee = new THREE.Group();
    rightKnee.position.set(0, -0.41, 0);
    rightThigh.add(rightKnee);

    const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.84, 16), isCJ ? lowerMat : skinMat);
    rightCalf.position.y = -0.42;
    rightCalf.castShadow = true;
    rightKnee.add(rightCalf);

    const rightAnkle = new THREE.Group();
    rightAnkle.position.set(0, -0.42, 0);
    rightCalf.add(rightAnkle);
    rightAnkle.add(createShoeMesh());

    return {
      rig,
      pelvis,
      torso,
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

  // Active Runner Setup
  let activeRunner = buildRunner('cj');
  scene.add(activeRunner.rig);

  // Dynamic Contact Ground Shadow
  const contactShadowGeo = new THREE.PlaneGeometry(1.4, 2.2);
  const contactShadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02;
  scene.add(contactShadow);

  // ==============================================================================
  // 4. WEB AUDIO SYNTHESIZER
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
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(85, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // ==============================================================================
  // 5. ANIMATION & STRIDE LOOP
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

    // Stride Frequency
    const strideFreq = (profile.cadence / 60) * Math.PI * 2;
    state.stridePhase += strideFreq * dt;

    const phase = state.stridePhase;
    const sinPhase = Math.sin(phase);
    const cosPhase = Math.cos(phase);

    // 1. Center of Gravity Bounce & Lean
    activeRunner.pelvis.position.y = 1.95 + Math.abs(cosPhase) * 0.075;
    activeRunner.torso.rotation.x = 0.12 + Math.sin(phase * 2) * 0.015;
    activeRunner.torso.rotation.y = -sinPhase * 0.14;
    activeRunner.pelvis.rotation.y = sinPhase * 0.06;
    activeRunner.pelvis.rotation.z = Math.sin(phase) * 0.035;

    activeRunner.headGroup.rotation.y = sinPhase * 0.05;
    activeRunner.headGroup.rotation.x = -0.05;

    // 2. Leg Kinematics (High Heel Kick, Forward Drive)
    activeRunner.leftHip.rotation.x = sinPhase * 0.72;
    if (sinPhase < 0) {
      activeRunner.leftKnee.rotation.x = Math.abs(sinPhase) * 1.85;
      activeRunner.leftAnkle.rotation.x = -0.35;
    } else {
      activeRunner.leftKnee.rotation.x = Math.max(0.12, (1 - sinPhase) * 0.65);
      activeRunner.leftAnkle.rotation.x = 0.22;
    }

    activeRunner.rightHip.rotation.x = -sinPhase * 0.72;
    if (-sinPhase < 0) {
      activeRunner.rightKnee.rotation.x = Math.abs(-sinPhase) * 1.85;
      activeRunner.rightAnkle.rotation.x = -0.35;
    } else {
      activeRunner.rightKnee.rotation.x = Math.max(0.12, (1 - (-sinPhase)) * 0.65);
      activeRunner.rightAnkle.rotation.x = 0.22;
    }

    // Dynamic Ground Contact Shadow
    const shadowScale = 1 - Math.abs(cosPhase) * 0.2;
    contactShadow.scale.set(shadowScale, shadowScale * 1.4, 1);
    contactShadow.material.opacity = 0.65 - Math.abs(cosPhase) * 0.25;

    // 3. Athletic Arm Swing
    activeRunner.leftShoulder.rotation.x = -sinPhase * 0.68;
    activeRunner.leftShoulder.rotation.y = -cosPhase * 0.12;
    activeRunner.leftShoulder.rotation.z = -0.12;

    activeRunner.rightShoulder.rotation.x = sinPhase * 0.68;
    activeRunner.rightShoulder.rotation.y = cosPhase * 0.12;
    activeRunner.rightShoulder.rotation.z = 0.12;

    // 4. Audio Trigger
    if (sinPhase > 0.94 && !footstrikeTriggered) {
      playFootstrikeSound();
      footstrikeTriggered = true;
    } else if (sinPhase < 0.15 && footstrikeTriggered) {
      footstrikeTriggered = false;
    }

    // 5. Runway Scrolling
    const scrollStep = speedMps * dt * 2.5;
    lineMeshes.forEach((l) => {
      l.position.z -= scrollStep;
      if (l.position.z < -runwayLength / 2) l.position.z += runwayLength;
    });

    updateCamera(now);
    renderer.render(scene, camera);
  }

  function updateCamera(time) {
    if (state.cameraMode === 'chase') {
      camera.position.set(0, 2.7, -5.4);
      camera.lookAt(0, 1.8, 3.5);
    } else if (state.cameraMode === 'broadcast') {
      camera.position.set(0, 2.2, 8.2);
      camera.lookAt(0, 1.8, 0);
    } else if (state.cameraMode === 'profile') {
      camera.position.set(-5.0, 1.9, 0.3);
      camera.lookAt(0, 1.7, 0.2);
    } else if (state.cameraMode === 'closeup') {
      camera.position.set(0, 2.1, 2.5);
      camera.lookAt(0, 2.05, 0);
    } else if (state.cameraMode === 'cinematic') {
      const angle = (time * 0.00035);
      camera.position.set(Math.sin(angle) * 8.0, 3.0 + Math.cos(angle * 2) * 0.7, Math.cos(angle) * 8.0);
      camera.lookAt(0, 1.8, 0);
    }
  }

  // ==============================================================================
  // 6. INTERACTIVE CONTROLS
  // ==============================================================================
  window.setRunner = function (runnerId) {
    if (runnerId === state.currentRunner) return;
    state.currentRunner = runnerId;

    scene.remove(activeRunner.rig);
    activeRunner = buildRunner(runnerId);
    scene.add(activeRunner.rig);

    document.querySelectorAll('[data-runner]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-runner="${runnerId}"]`).classList.add('active');

    // Update Brand Subtitle & Quote
    const sub = document.querySelector('.brand-sub');
    if (runnerId === 'cj') {
      sub.innerHTML = 'CARL JOHNSON &bull; GROVE STREET STRIDE';
      document.getElementById('quoteText').innerHTML = '&ldquo;Ah shit, here we go again.&rdquo;';
      document.querySelector('.quote-author').innerHTML = '&mdash; Carl Johnson (CJ)';
    } else {
      sub.innerHTML = 'ELIUD KIPCHOGE &bull; INEOS 1:59 STRIDE';
      document.getElementById('quoteText').innerHTML = '&ldquo;No Human Is Limited.&rdquo;';
      document.querySelector('.quote-author').innerHTML = '&mdash; Eliud Kipchoge';
    }
  };

  window.setTheme = function (themeId) {
    const t = THEMES[themeId];
    if (!t) return;
    state.currentTheme = themeId;

    scene.background.setHex(t.bg);
    scene.fog.color.setHex(t.fog);
    roadMat.color.setHex(t.road);
    groundMat.color.setHex(t.ground);
    laserMat.color.setHex(t.laser);
    ambientLight.color.setHex(t.ambient);
    sunLight.color.setHex(t.sun);
    rimLight.color.setHex(t.rim);

    document.querySelectorAll('[data-theme]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-theme="${themeId}"]`).classList.add('active');
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

    document.getElementById('metricSpeed').innerHTML = `${p.label} <small>KM/H</small>`;
    document.getElementById('metricStamina').innerHTML = `${p.stamina}`;

    document.querySelectorAll('[data-pace]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-pace="${paceId}"]`).classList.add('active');
  };

  // Audio Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  audioBtn.addEventListener('click', () => {
    initAudio();
    state.audioEnabled = !state.audioEnabled;
    document.getElementById('audioIcon').innerText = state.audioEnabled ? '🔊' : '🔇';
    document.getElementById('audioText').innerText = state.audioEnabled ? 'AUDIO' : 'MUTE';
  });

  // Quotation Carousel
  setInterval(() => {
    state.quoteIdx = (state.quoteIdx + 1) % CJ_QUOTES.length;
    const qEl = document.getElementById('quoteText');
    qEl.style.opacity = 0;
    setTimeout(() => {
      if (state.currentRunner === 'cj') {
        qEl.innerHTML = `&ldquo;${CJ_QUOTES[state.quoteIdx]}&rdquo;`;
        document.querySelector('.quote-author').innerHTML = '&mdash; Carl Johnson (CJ)';
      }
      qEl.style.opacity = 1;
    }, 450);
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
