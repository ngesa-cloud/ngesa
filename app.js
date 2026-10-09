// ==============================================================================
// NGESA // THE IMMORTAL STRIDE — SOLO KIPCHOGE MINIMALIST RUNNER ENGINE
// Pure Minimalist Visuals, Single Solo Runner & Anatomical Kinematics
// ==============================================================================

(function () {
  'use strict';

  // Simulation Parameters & Pacing Profiles
  const PACING_PROFILES = {
    sub2:       { label: '2:50', speedKmH: 21.18, cadence: 188, heartRate: 168 },
    berlin:     { label: '2:52', speedKmH: 20.93, cadence: 184, heartRate: 165 },
    hypersonic: { label: '1:30', speedKmH: 40.00, cadence: 220, heartRate: 195 }
  };

  const THEMES = {
    vienna: {
      name: 'Obsidian Void',
      bg: 0x04060a,
      fog: 0x04060a,
      road: 0x080c14,
      ground: 0x030407,
      laser: 0x00ff66,
      ambient: 0x64748b,
      sun: 0xfffaed,
      rim: 0x38bdf8
    },
    cyber: {
      name: 'Monochrome Studio',
      bg: 0x0c0e14,
      fog: 0x0c0e14,
      road: 0x141822,
      ground: 0x080a0f,
      laser: 0xffffff,
      ambient: 0x94a3b8,
      sun: 0xffffff,
      rim: 0xe2e8f0
    },
    kaptagat: {
      name: 'Nordic Dawn',
      bg: 0x080c18,
      fog: 0x080c18,
      road: 0x0f172a,
      ground: 0x050811,
      laser: 0x38bdf8,
      ambient: 0x7dd3fc,
      sun: 0xfef08a,
      rim: 0x818cf8
    }
  };

  const KIPCHOGE_QUOTES = [
    "No Human Is Limited.",
    "Only the disciplined ones in life are free.",
    "Athletics is not so much about the legs. It's about the heart and mind.",
    "To win is not important. To be successful is not even important. How you plan and prepare is crucial.",
    "If you want to break a barrier, you have to be consistent in training.",
    "The best time to plant a tree was 25 years ago. The second-best time is today.",
    "I want to show the world that when you focus on your goal, nothing is impossible."
  ];

  // Engine State
  const state = {
    currentPace: 'sub2',
    currentTheme: 'vienna',
    cameraMode: 'chase',
    audioEnabled: false,
    distanceKm: 0.0,
    startTime: Date.now(),
    stridePhase: 0.0,
    quoteIdx: 0
  };

  // Three.js Scene Setup (Pure Minimalist Void)
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(THEMES.vienna.bg);
  scene.fog = new THREE.FogExp2(THEMES.vienna.fog, 0.009);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Minimalist Museum / Gallery Lighting
  const ambientLight = new THREE.AmbientLight(THEMES.vienna.ambient, 0.65);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(THEMES.vienna.sun, 1.4);
  sunLight.position.set(20, 45, 18);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0004;
  scene.add(sunLight);

  // Crisp Rim Backlight (Outlines runner silhouette against the void)
  const rimLight = new THREE.DirectionalLight(THEMES.vienna.rim, 0.85);
  rimLight.position.set(-18, 20, -30);
  scene.add(rimLight);

  // ==============================================================================
  // 1. PROCEDURAL CANVAS TEXTURE GENERATORS
  // ==============================================================================

  function createSkinTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#422919');
    grad.addColorStop(0.5, '#382214');
    grad.addColorStop(1, '#2d1a0e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle dermal stippling
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#382214';
    ctx.fillRect(0, 0, 512, 512);

    // Buzzcut scalp fade
    const scalpGrad = ctx.createLinearGradient(0, 0, 0, 190);
    scalpGrad.addColorStop(0, '#18120e');
    scalpGrad.addColorStop(0.85, '#261b14');
    scalpGrad.addColorStop(1, '#382214');
    ctx.fillStyle = scalpGrad;
    ctx.fillRect(0, 0, 512, 180);

    // Eyebrows
    ctx.fillStyle = '#110c08';
    ctx.beginPath();
    ctx.ellipse(190, 225, 45, 8, -0.08, 0, Math.PI * 2);
    ctx.ellipse(322, 225, 45, 8, 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Eyes - Sclera, Iris, Pupil, Glint
    ctx.fillStyle = '#eaeaea';
    ctx.beginPath();
    ctx.ellipse(190, 248, 24, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(322, 248, 24, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1c1008';
    ctx.beginPath();
    ctx.arc(190, 248, 9, 0, Math.PI * 2);
    ctx.arc(322, 248, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(190, 248, 4.5, 0, Math.PI * 2);
    ctx.arc(322, 248, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(188, 246, 2, 0, Math.PI * 2);
    ctx.arc(320, 246, 2, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Nose
    ctx.fillStyle = 'rgba(25, 15, 9, 0.7)';
    ctx.beginPath();
    ctx.moveTo(250, 230);
    ctx.lineTo(262, 230);
    ctx.lineTo(272, 325);
    ctx.lineTo(240, 325);
    ctx.closePath();
    ctx.fill();

    // Lips
    ctx.fillStyle = '#442618';
    ctx.beginPath();
    ctx.ellipse(256, 375, 32, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1c0f08';
    ctx.beginPath();
    ctx.ellipse(256, 375, 22, 3, 0, 0, Math.PI * 2);
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

    // Micro-perforated mesh texture
    ctx.fillStyle = 'rgba(215, 220, 230, 0.35)';
    for (let x = 0; x < 512; x += 6) {
      for (let y = 0; y < 512; y += 6) {
        ctx.fillRect(x + ((y % 12 === 0) ? 3 : 0), y, 2, 2);
      }
    }

    // INEOS Split Chevron Emblem
    ctx.fillStyle = '#8b1528';
    ctx.beginPath();
    ctx.moveTo(235, 90); ctx.lineTo(252, 110); ctx.lineTo(245, 118); ctx.lineTo(228, 98); ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#002244';
    ctx.beginPath();
    ctx.moveTo(277, 90); ctx.lineTo(260, 110); ctx.lineTo(267, 118); ctx.lineTo(284, 98); ctx.closePath();
    ctx.fill();

    // Wordmark
    ctx.fillStyle = '#001b3a';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INEOS', 256, 142);

    // Race Bib #1:59 ELIUD
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillRect(146, 175, 220, 160);
    ctx.strokeRect(146, 175, 220, 160);

    ctx.fillStyle = '#8b1528';
    ctx.fillRect(148, 177, 216, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px -apple-system, sans-serif';
    ctx.fillText('INEOS 1:59 CHALLENGE', 256, 195);

    ctx.fillStyle = '#090d16';
    ctx.font = '900 56px monospace';
    ctx.fillText('1:59', 256, 265);

    ctx.fillStyle = '#002244';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('ELIUD', 256, 305);

    return new THREE.CanvasTexture(canvas);
  }

  function createShortsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 512, 512);

    // Nike Swoosh on Left Hem
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

    // Nike AtomKnit Upper: Neon Volt to Orange
    const upperGrad = ctx.createLinearGradient(0, 0, 512, 0);
    upperGrad.addColorStop(0, '#a3e635');
    upperGrad.addColorStop(0.6, '#f97316');
    upperGrad.addColorStop(1, '#ef4444');
    ctx.fillStyle = upperGrad;
    ctx.fillRect(0, 0, 512, 280);

    // Oversized Nike Swoosh
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(60, 110);
    ctx.bezierCurveTo(180, 90, 360, 140, 450, 230);
    ctx.bezierCurveTo(340, 210, 180, 180, 60, 110);
    ctx.fill();

    // Nike ZoomX Foam Midsole
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 280, 512, 170);

    // Carbon Flyplate
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 350, 512, 12);

    // Air Zoom Pods Glow
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(70, 380, 120, 55);

    // Outsole Rubber
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 450, 512, 62);

    return new THREE.CanvasTexture(canvas);
  }

  function createWatchTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(128, 128, 124, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#020617';
    ctx.beginPath(); ctx.arc(128, 128, 100, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#00ff66';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PACE', 128, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px monospace';
    ctx.fillText('2:50', 128, 124);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('♥ 168', 128, 170);

    return new THREE.CanvasTexture(canvas);
  }

  function createRadialShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }

  // Pre-generate Textures
  const skinTexture = createSkinTexture();
  const faceTexture = createFaceTexture();
  const singletTexture = createSingletTexture();
  const shortsTexture = createShortsTexture();
  const shoeTexture = createShoeTexture();
  const watchTexture = createWatchTexture();
  const shadowTexture = createRadialShadowTexture();

  // PBR Materials
  const skinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x3c2415,
    map: skinTexture,
    roughness: 0.32,
    metalness: 0.04,
    clearcoat: 0.45,
    clearcoatRoughness: 0.22
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

  // ==============================================================================
  // 2. MINIMALIST INFINITE RUNWAY (CLEAN REFLECTIVE STRIP & LASER LINE)
  // ==============================================================================
  const runwayWidth = 6.0;
  const runwayLength = 260;

  // Runway Surface
  const roadGeo = new THREE.PlaneGeometry(runwayWidth, runwayLength, 1, 1);
  const roadMat = new THREE.MeshStandardMaterial({
    color: THEMES.vienna.road,
    roughness: 0.65,
    metalness: 0.25
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  scene.add(road);

  // Minimalist Endless Dashed Centerline
  const linesGroup = new THREE.Group();
  scene.add(linesGroup);

  const lineGeo = new THREE.PlaneGeometry(0.18, 3.5);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  const numLines = 26;
  const lineMeshes = [];

  for (let i = 0; i < numLines; i++) {
    const l = new THREE.Mesh(lineGeo, lineMat);
    l.rotation.x = -Math.PI / 2;
    l.position.set(0, 0.015, (i - numLines / 2) * 10);
    linesGroup.add(l);
    lineMeshes.push(l);
  }

  // Minimalist Razor-Thin Edge Guidelines (Left & Right Runway Edges)
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

  // Iconic INEOS 1:59 Green Laser Pacing Line
  const laserGeo = new THREE.PlaneGeometry(runwayWidth + 0.5, 0.28);
  const laserMat = new THREE.MeshBasicMaterial({
    color: THEMES.vienna.laser,
    transparent: true,
    opacity: 0.95
  });
  const laserLine = new THREE.Mesh(laserGeo, laserMat);
  laserLine.rotation.x = -Math.PI / 2;
  laserLine.position.set(0, 0.02, 6.5);
  scene.add(laserLine);

  // Infinite Minimalist Ground Horizon
  const groundGeo = new THREE.PlaneGeometry(400, runwayLength);
  const groundMat = new THREE.MeshBasicMaterial({ color: THEMES.vienna.ground });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  // ==============================================================================
  // 3. SOLO KIPCHOGE ATHLETE RIG (ONLY ONE HERO RUNNER)
  // ==============================================================================

  function createSoloKipchoge() {
    const rig = new THREE.Group();

    // 1. Pelvis & Glutes
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.32, 16), shortsMaterial);
    pelvis.position.y = 1.95;
    rig.add(pelvis);

    const leftShortsHem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.26, 12), shortsMaterial);
    leftShortsHem.position.set(-0.16, -0.12, 0);
    pelvis.add(leftShortsHem);

    const rightShortsHem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.26, 12), shortsMaterial);
    rightShortsHem.position.set(0.16, -0.12, 0);
    pelvis.add(rightShortsHem);

    // 2. Torso (Pectorals, Ribcage, Clavicles)
    const torso = new THREE.Group();
    torso.position.y = 0.22;
    pelvis.add(torso);

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.27, 0.58, 16), singletMaterial);
    chest.position.y = 0.36;
    chest.castShadow = true;
    torso.add(chest);

    const leftPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), singletMaterial);
    leftPec.scale.set(1.1, 0.7, 0.6);
    leftPec.position.set(-0.14, 0.44, 0.15);
    torso.add(leftPec);

    const rightPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), singletMaterial);
    rightPec.scale.set(1.1, 0.7, 0.6);
    rightPec.position.set(0.14, 0.44, 0.15);
    torso.add(rightPec);

    const clavicle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.52, 8), skinMaterial);
    clavicle.rotation.z = Math.PI / 2;
    clavicle.position.set(0, 0.62, 0.04);
    torso.add(clavicle);

    // 3. Neck & Sculpted Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 12), skinMaterial);
    neck.position.y = 0.72;
    torso.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.24;
    neck.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), faceMaterial);
    head.scale.set(0.92, 1.15, 1.05);
    head.castShadow = true;
    headGroup.add(head);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 8), skinMaterial);
    nose.rotation.x = Math.PI / 2 + 0.25;
    nose.position.set(0, 0.02, 0.23);
    headGroup.add(nose);

    const leftEar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.03, 8), skinMaterial);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.22, 0.02, 0.0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.03, 8), skinMaterial);
    rightEar.rotation.z = -Math.PI / 2;
    rightEar.position.set(0.22, 0.02, 0.0);
    headGroup.add(rightEar);

    // 4. Arms & Fists
    // Left Arm Rig
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.38, 0.54, 0.0);
    torso.add(leftShoulder);

    const leftDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), skinMaterial);
    leftDeltoid.scale.set(0.9, 1.1, 0.9);
    leftShoulder.add(leftDeltoid);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12), skinMaterial);
    leftUpperArm.position.y = -0.275;
    leftUpperArm.castShadow = true;
    leftShoulder.add(leftUpperArm);

    const leftElbow = new THREE.Group();
    leftElbow.position.set(0, -0.275, 0);
    leftUpperArm.add(leftElbow);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.5, 12), skinMaterial);
    leftForearm.position.y = -0.25;
    leftForearm.castShadow = true;
    leftElbow.add(leftForearm);
    leftElbow.rotation.x = -1.5;

    // GPS Smartwatch
    const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), watchMaterial);
    watch.rotation.z = Math.PI / 2;
    watch.position.set(0, -0.22, 0.04);
    leftForearm.add(watch);

    const leftFist = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), skinMaterial);
    leftFist.scale.set(0.9, 1.2, 0.8);
    leftFist.position.set(0, -0.32, 0);
    leftForearm.add(leftFist);

    // Right Arm Rig
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.38, 0.54, 0.0);
    torso.add(rightShoulder);

    const rightDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), skinMaterial);
    rightDeltoid.scale.set(0.9, 1.1, 0.9);
    rightShoulder.add(rightDeltoid);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.55, 12), skinMaterial);
    rightUpperArm.position.y = -0.275;
    rightUpperArm.castShadow = true;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.set(0, -0.275, 0);
    rightUpperArm.add(rightElbow);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.065, 0.5, 12), skinMaterial);
    rightForearm.position.y = -0.25;
    rightForearm.castShadow = true;
    rightElbow.add(rightForearm);
    rightElbow.rotation.x = -1.5;

    const rightFist = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), skinMaterial);
    rightFist.scale.set(0.9, 1.2, 0.8);
    rightFist.position.set(0, -0.32, 0);
    rightForearm.add(rightFist);

    // 5. Lower Limbs & Nike Alphafly NEXT%
    function createShoeMesh() {
      const shoeGroup = new THREE.Group();
      const midsole = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.62), shoeMaterial);
      midsole.position.set(0, -0.06, 0.08);
      midsole.castShadow = true;
      shoeGroup.add(midsole);

      const heelFin = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 4), shoeMaterial);
      heelFin.rotation.x = Math.PI / 2 + 0.3;
      heelFin.position.set(0, -0.05, -0.28);
      shoeGroup.add(heelFin);

      const upper = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), shoeMaterial);
      upper.scale.set(0.85, 0.75, 1.8);
      upper.position.set(0, 0.04, 0.09);
      shoeGroup.add(upper);

      const airPod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.22, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ff88 })
      );
      airPod.rotation.z = Math.PI / 2;
      airPod.position.set(0, -0.09, 0.18);
      shoeGroup.add(airPod);

      return shoeGroup;
    }

    // Left Leg
    const leftHip = new THREE.Group();
    leftHip.position.set(-0.16, -0.16, 0);
    pelvis.add(leftHip);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.115, 0.82, 16), skinMaterial);
    leftThigh.position.y = -0.41;
    leftThigh.castShadow = true;
    leftHip.add(leftThigh);

    const leftTeardrop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), skinMaterial);
    leftTeardrop.position.set(0.05, -0.32, 0.05);
    leftThigh.add(leftTeardrop);

    const leftKnee = new THREE.Group();
    leftKnee.position.set(0, -0.41, 0);
    leftThigh.add(leftKnee);

    const leftPatella = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMaterial);
    leftPatella.position.set(0, 0, 0.075);
    leftKnee.add(leftPatella);

    const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.075, 0.84, 16), skinMaterial);
    leftCalf.position.y = -0.42;
    leftCalf.castShadow = true;
    leftKnee.add(leftCalf);

    const leftCalfMuscle = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), skinMaterial);
    leftCalfMuscle.scale.set(0.9, 1.4, 0.9);
    leftCalfMuscle.position.set(0, 0.12, -0.05);
    leftCalf.add(leftCalfMuscle);

    const leftAnkle = new THREE.Group();
    leftAnkle.position.set(0, -0.42, 0);
    leftCalf.add(leftAnkle);
    leftAnkle.add(createShoeMesh());

    // Right Leg
    const rightHip = new THREE.Group();
    rightHip.position.set(0.16, -0.16, 0);
    pelvis.add(rightHip);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.115, 0.82, 16), skinMaterial);
    rightThigh.position.y = -0.41;
    rightThigh.castShadow = true;
    rightHip.add(rightThigh);

    const rightTeardrop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), skinMaterial);
    rightTeardrop.position.set(-0.05, -0.32, 0.05);
    rightThigh.add(rightTeardrop);

    const rightKnee = new THREE.Group();
    rightKnee.position.set(0, -0.41, 0);
    rightThigh.add(rightKnee);

    const rightPatella = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMaterial);
    rightPatella.position.set(0, 0, 0.075);
    rightKnee.add(rightPatella);

    const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.075, 0.84, 16), skinMaterial);
    rightCalf.position.y = -0.42;
    rightCalf.castShadow = true;
    rightKnee.add(rightCalf);

    const rightCalfMuscle = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), skinMaterial);
    rightCalfMuscle.scale.set(0.9, 1.4, 0.9);
    rightCalfMuscle.position.set(0, 0.12, -0.05);
    rightCalf.add(rightCalfMuscle);

    const rightAnkle = new THREE.Group();
    rightAnkle.position.set(0, -0.42, 0);
    rightCalf.add(rightAnkle);
    rightAnkle.add(createShoeMesh());

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

  // Create Solo Kipchoge Rig
  const kipchoge = createSoloKipchoge();
  scene.add(kipchoge.rig);

  // Dynamic Minimalist Ground Contact Shadow
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
  // 4. WEB AUDIO SYNTHESIZER (SYNTHESIZED FOOTSTRIKES)
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // ==============================================================================
  // 5. BIOMECHANICAL STRIDE ENGINE & SIMULATION LOOP
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

    const phase = state.stridePhase;
    const sinPhase = Math.sin(phase);
    const cosPhase = Math.cos(phase);

    // 1. Center of Gravity (CoG) Bounce & Forward Lean
    kipchoge.pelvis.position.y = 1.95 + Math.abs(cosPhase) * 0.075;
    kipchoge.torso.rotation.x = 0.12 + Math.sin(phase * 2) * 0.015;
    kipchoge.torso.rotation.y = -sinPhase * 0.14;
    kipchoge.pelvis.rotation.y = sinPhase * 0.06;
    kipchoge.pelvis.rotation.z = Math.sin(phase) * 0.035;

    kipchoge.headGroup.rotation.y = sinPhase * 0.05;
    kipchoge.headGroup.rotation.x = -0.05;

    // 2. Leg Kinematics (Hip Extension, High Heel Kick, Forefoot Plant)
    kipchoge.leftHip.rotation.x = sinPhase * 0.72;
    if (sinPhase < 0) {
      kipchoge.leftKnee.rotation.x = Math.abs(sinPhase) * 1.85;
      kipchoge.leftAnkle.rotation.x = -0.35;
    } else {
      kipchoge.leftKnee.rotation.x = Math.max(0.12, (1 - sinPhase) * 0.65);
      kipchoge.leftAnkle.rotation.x = 0.22;
    }

    kipchoge.rightHip.rotation.x = -sinPhase * 0.72;
    if (-sinPhase < 0) {
      kipchoge.rightKnee.rotation.x = Math.abs(-sinPhase) * 1.85;
      kipchoge.rightAnkle.rotation.x = -0.35;
    } else {
      kipchoge.rightKnee.rotation.x = Math.max(0.12, (1 - (-sinPhase)) * 0.65);
      kipchoge.rightAnkle.rotation.x = 0.22;
    }

    // Dynamic Ground Contact Shadow
    const shadowScale = 1 - Math.abs(cosPhase) * 0.2;
    contactShadow.scale.set(shadowScale, shadowScale * 1.4, 1);
    contactShadow.material.opacity = 0.65 - Math.abs(cosPhase) * 0.25;

    // 3. Arm Swing
    kipchoge.leftShoulder.rotation.x = -sinPhase * 0.68;
    kipchoge.leftShoulder.rotation.y = -cosPhase * 0.12;
    kipchoge.leftShoulder.rotation.z = -0.12;

    kipchoge.rightShoulder.rotation.x = sinPhase * 0.68;
    kipchoge.rightShoulder.rotation.y = cosPhase * 0.12;
    kipchoge.rightShoulder.rotation.z = 0.12;

    // 4. Audio Trigger
    if (sinPhase > 0.94 && !footstrikeTriggered) {
      playFootstrikeSound();
      footstrikeTriggered = true;
    } else if (sinPhase < 0.15 && footstrikeTriggered) {
      footstrikeTriggered = false;
    }

    // 5. Minimalist Runway Scrolling
    const scrollStep = speedMps * dt * 2.5;
    lineMeshes.forEach((l) => {
      l.position.z -= scrollStep;
      if (l.position.z < -runwayLength / 2) l.position.z += runwayLength;
    });

    // 6. Camera Update
    updateCamera(now);

    renderer.render(scene, camera);
  }

  function updateCamera(time) {
    if (state.cameraMode === 'chase') {
      // Intimate, sleek third-person view tracking Kipchoge
      camera.position.set(0, 2.7, -5.4);
      camera.lookAt(0, 1.8, 3.5);
    } else if (state.cameraMode === 'broadcast') {
      // Frontal head-on tracking
      camera.position.set(0, 2.2, 8.2);
      camera.lookAt(0, 1.8, 0);
    } else if (state.cameraMode === 'profile') {
      // Pure 90-degree lateral stride silhouette
      camera.position.set(-5.0, 1.9, 0.3);
      camera.lookAt(0, 1.7, 0.2);
    } else if (state.cameraMode === 'closeup') {
      // Focused portrait framing upper body & face
      camera.position.set(0, 2.1, 2.5);
      camera.lookAt(0, 2.05, 0);
    } else if (state.cameraMode === 'cinematic') {
      // Smooth 360-degree orbital sweep
      const angle = (time * 0.00035);
      camera.position.set(Math.sin(angle) * 8.0, 3.0 + Math.cos(angle * 2) * 0.7, Math.cos(angle) * 8.0);
      camera.lookAt(0, 1.8, 0);
    }
  }

  // ==============================================================================
  // 6. MINIMALIST INTERACTIVE CONTROLS
  // ==============================================================================
  window.setBiome = function (themeId) {
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

    document.querySelectorAll('[data-biome]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-biome="${themeId}"]`).classList.add('active');
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

    document.getElementById('metricPace').innerHTML = `${p.label} <small>/KM</small>`;
    document.getElementById('metricCadence').innerHTML = `${p.cadence} <small>SPM</small>`;
    document.getElementById('metricHeartRate').innerHTML = `${p.heartRate} <small>BPM</small>`;

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

  // Quotation Carousel (Every 12 seconds)
  setInterval(() => {
    state.quoteIdx = (state.quoteIdx + 1) % KIPCHOGE_QUOTES.length;
    const qEl = document.getElementById('quoteText');
    qEl.style.opacity = 0;
    setTimeout(() => {
      qEl.innerHTML = `&ldquo;${KIPCHOGE_QUOTES[state.quoteIdx]}&rdquo;`;
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
