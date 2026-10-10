// ==============================================================================
// NGESA // GITHUB 100k+ STARS HIGHWAY ENGINE
// An immortal 3D journey through every GitHub repository with over 100,000 stars
// Physics-driven rolling sphere body with an articulated gyro head on top
// ==============================================================================

(function () {
  'use strict';

  // Repositories fallback in case repos-data.js wasn't loaded
  const REPOS = window.REPOS_100K || [];
  const TOTAL_REPOS = REPOS.length || 60;
  const GATE_SPACING = 55.0; // Distance in meters between repo archways

  // Language Colors
  const LANG_COLORS = {
    'JavaScript':       '#f7df1e',
    'TypeScript':       '#3178c6',
    'Python':           '#3572a5',
    'Rust':             '#dea584',
    'Go':               '#00add8',
    'C':                '#555555',
    'C++':              '#f34b7d',
    'Dart':             '#00b4ab',
    'Shell':            '#89e051',
    'HTML':             '#e34c26',
    'Markdown':         '#a855f7',
    'MDX':              '#fcb32c',
    'Jupyter Notebook': '#da5b0b',
    'Batchfile':        '#c1f12e',
    'General':          '#22c55e'
  };

  // Pacing Profiles
  const PACING_PROFILES = {
    jog:    { label: '15.0', speedKmH: 15.0, cadence: 160 },
    sprint: { label: '30.0', speedKmH: 30.0, cadence: 190 },
    turbo:  { label: '60.0', speedKmH: 60.0, cadence: 240 },
    warp:   { label: '150.0', speedKmH: 150.0, cadence: 340 }
  };

  const THEMES = {
    grove: {
      bg: 0x03060a,
      fog: 0x03060a,
      road: 0x070b14,
      ground: 0x020306,
      laser: 0x00ff66,
      ambient: 0x64748b,
      sun: 0xfffaed,
      rim: 0x22c55e
    }
  };

  const ROLLING_QUOTES = [
    "Ah shit, here we roll again.",
    "Cruising through the greatest open-source repos on Earth.",
    "Over 14 Million GitHub stars along this highway, homie!",
    "All we had to do was follow the damn train, CJ!",
    "Ain't nobody gonna stop this rolling stride today.",
    "Every legend in code is honored right here on the road.",
    "No Human Is Limited &mdash; even rolling down the GitHub Highway."
  ];

  // Engine State
  const state = {
    currentHead: 'cj',
    currentBall: 'eightball',
    currentPace: 'sprint',
    cameraMode: 'chase', // Ahead view by default to see upcoming archways
    audioEnabled: false,
    distanceM: 0.0,
    startTime: Date.now(),
    rollAngle: 0.0,
    quoteIdx: 0,
    milestonesCrossed: new Array(TOTAL_REPOS).fill(false),
    currentRepoIdx: 0,
    reposVisitedCount: 0,
    starsAccumulated: 0
  };

  // Three.js Scene Setup
  const container = document.getElementById('canvas-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(THEMES.grove.bg);
  scene.fog = new THREE.FogExp2(THEMES.grove.fog, 0.0075);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(THEMES.grove.ambient, 0.75);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(THEMES.grove.sun, 1.6);
  sunLight.position.set(20, 45, 18);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(THEMES.grove.rim, 0.95);
  rimLight.position.set(-18, 20, -30);
  scene.add(rimLight);

  // ==============================================================================
  // 1. PROCEDURAL TEXTURES
  // ==============================================================================

  // Ball Skin 1: Billiard 8-Ball
  function createEightBallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 90, 512, 28);
    ctx.fillRect(0, 394, 512, 28);

    [128, 384].forEach(x => {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(x, 256, 75, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#080c14';
      ctx.font = '900 85px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('8', x, 256);
    });
    return new THREE.CanvasTexture(canvas);
  }

  // Ball Skin 2: Cyber Tron Grid
  function createCyberGridTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 6;
    for (let i = 0; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, 512);
      ctx.moveTo(0, i); ctx.lineTo(512, i);
      ctx.stroke();
    }
    ctx.fillStyle = '#38bdf8';
    for (let x = 64; x < 512; x += 128) {
      for (let y = 64; y < 512; y += 128) {
        ctx.fillRect(x - 8, y - 8, 16, 16);
      }
    }
    return new THREE.CanvasTexture(canvas);
  }

  // Ball Skin 3: GitHub Octocat & Branch Ball
  function createOctocatTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, 512, 512);

    // Git branch curves
    ctx.strokeStyle = '#238636';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.bezierCurveTo(150, 256, 150, 150, 300, 150);
    ctx.lineTo(512, 150);
    ctx.stroke();

    ctx.strokeStyle = '#388bfd';
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.stroke();

    // Commit nodes
    [100, 256, 400].forEach((x, idx) => {
      ctx.fillStyle = idx === 1 ? '#facc15' : '#2ea043';
      ctx.beginPath();
      ctx.arc(x, 256, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.stroke();
    });

    // Star badge
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('★ 100K+', 256, 380);

    return new THREE.CanvasTexture(canvas);
  }

  // CJ Face Texture
  function createCJFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#3e2316';
    ctx.fillRect(0, 0, 512, 512);

    // Fade Haircut
    const hairGrad = ctx.createLinearGradient(0, 0, 0, 195);
    hairGrad.addColorStop(0, '#0c0907');
    hairGrad.addColorStop(0.8, '#1b120c');
    hairGrad.addColorStop(1, '#3e2316');
    ctx.fillStyle = hairGrad;
    ctx.fillRect(0, 0, 512, 185);

    ctx.fillStyle = '#100b08';
    ctx.beginPath();
    ctx.ellipse(256, 178, 175, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.fillStyle = '#080503';
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

    // Nose
    ctx.fillStyle = 'rgba(25, 14, 8, 0.75)';
    ctx.beginPath();
    ctx.moveTo(250, 230); ctx.lineTo(262, 230);
    ctx.lineTo(270, 320); ctx.lineTo(242, 320);
    ctx.closePath();
    ctx.fill();

    // Mustache & Goatee
    ctx.fillStyle = '#120c08';
    ctx.beginPath();
    ctx.ellipse(256, 355, 34, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#442618';
    ctx.beginPath();
    ctx.ellipse(256, 375, 30, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#120c08';
    ctx.beginPath();
    ctx.ellipse(256, 420, 24, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // Kipchoge Face Texture
  function createKipchogeFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#382214'; ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#1c1008';
    ctx.beginPath(); ctx.ellipse(190, 248, 22, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(322, 248, 22, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#442618';
    ctx.beginPath(); ctx.ellipse(256, 375, 30, 9, 0, 0, Math.PI * 2); ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  // Ground Shadow Texture
  function createRadialShadowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }

  // Pre-generate Textures
  const eightBallTex = createEightBallTexture();
  const cyberGridTex = createCyberGridTexture();
  const octocatTex = createOctocatTexture();
  const cjFaceTex = createCJFaceTexture();
  const kipchogeFaceTex = createKipchogeFaceTexture();
  const shadowTex = createRadialShadowTexture();

  // Materials
  const eightBallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: eightBallTex, roughness: 0.25, metalness: 0.3 });
  const cyberGridMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: cyberGridTex, roughness: 0.3, metalness: 0.7 });
  const octocatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: octocatTex, roughness: 0.3, metalness: 0.5 });
  const goldChromeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95 });
  const cjFaceMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: cjFaceTex, roughness: 0.4, metalness: 0.02 });
  const kipchogeFaceMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: kipchogeFaceTex, roughness: 0.4, metalness: 0.02 });
  const cjSkinMat = new THREE.MeshPhysicalMaterial({ color: 0x3e2316, roughness: 0.38, metalness: 0.04 });
  const goldChainMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.95 });

  // ==============================================================================
  // 2. MINIMALIST INFINITE HIGHWAY
  // ==============================================================================
  const runwayWidth = 6.4;
  const runwayLength = 280;

  const roadGeo = new THREE.PlaneGeometry(runwayWidth, runwayLength, 1, 1);
  const roadMat = new THREE.MeshStandardMaterial({ color: THEMES.grove.road, roughness: 0.65, metalness: 0.25 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  scene.add(road);

  // Dashed Centerline
  const linesGroup = new THREE.Group();
  scene.add(linesGroup);

  const lineGeo = new THREE.PlaneGeometry(0.18, 4.0);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
  const numLines = 28;
  const lineMeshes = [];

  for (let i = 0; i < numLines; i++) {
    const l = new THREE.Mesh(lineGeo, lineMat);
    l.rotation.x = -Math.PI / 2;
    l.position.set(0, 0.015, (i - numLines / 2) * 10);
    linesGroup.add(l);
    lineMeshes.push(l);
  }

  // Edge Guidelines with Glowing Neon Curbs
  const edgeGeo = new THREE.PlaneGeometry(0.06, runwayLength);
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.7 });
  const edgeLeft = new THREE.Mesh(edgeGeo, edgeMat);
  edgeLeft.rotation.x = -Math.PI / 2;
  edgeLeft.position.set(-runwayWidth / 2, 0.015, 0);
  scene.add(edgeLeft);

  const edgeRight = new THREE.Mesh(edgeGeo, edgeMat);
  edgeRight.rotation.x = -Math.PI / 2;
  edgeRight.position.set(runwayWidth / 2, 0.015, 0);
  scene.add(edgeRight);

  // Minimalist Ground Horizon
  const groundGeo = new THREE.PlaneGeometry(500, runwayLength);
  const groundMat = new THREE.MeshBasicMaterial({ color: THEMES.grove.ground });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  // ==============================================================================
  // 3. ROLLING BALL WITH A HEAD RIG
  // ==============================================================================
  const ballRadius = 0.85;

  const characterRig = new THREE.Group();
  scene.add(characterRig);

  // 1. The Rolling Ball Sphere
  const ballGeo = new THREE.SphereGeometry(ballRadius, 32, 32);
  const ballMesh = new THREE.Mesh(ballGeo, eightBallMat);
  ballMesh.position.y = ballRadius;
  ballMesh.castShadow = true;
  characterRig.add(ballMesh);

  // 2. Gyro Magnetic Neck Collar atop the Rolling Ball
  const collarMount = new THREE.Group();
  collarMount.position.y = ballRadius * 2 - 0.02;
  characterRig.add(collarMount);

  const collarRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.04, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 })
  );
  collarRing.rotation.x = Math.PI / 2;
  collarMount.add(collarRing);

  // 3. The Gyro Head Mount
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.28;
  collarMount.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.3, 24, 24);
  headGeo.scale(0.92, 1.15, 1.05);
  const headMesh = new THREE.Mesh(headGeo, cjFaceMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // 3D Nose & Ears
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 8), cjSkinMat);
  nose.rotation.x = Math.PI / 2 + 0.25;
  nose.position.set(0, 0.02, 0.28);
  headGroup.add(nose);

  const leftEar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.04, 8), cjSkinMat);
  leftEar.rotation.z = Math.PI / 2;
  leftEar.position.set(-0.28, 0.02, 0.0);
  headGroup.add(leftEar);

  const rightEar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.04, 8), cjSkinMat);
  rightEar.rotation.z = -Math.PI / 2;
  rightEar.position.set(0.28, 0.02, 0.0);
  headGroup.add(rightEar);

  // Gold Cuban Chain
  const goldChain = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.026, 12, 32), goldChainMat);
  goldChain.rotation.x = Math.PI / 2.3;
  goldChain.position.set(0, 0.08, 0.04);
  collarMount.add(goldChain);

  const pendant = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.02), goldChainMat);
  pendant.position.set(0, -0.06, 0.24);
  collarMount.add(pendant);

  // Dynamic Contact Ground Shadow
  const contactShadowGeo = new THREE.PlaneGeometry(1.9, 1.9);
  const contactShadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.7,
    depthWrite: false
  });
  const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02;
  scene.add(contactShadow);

  // ==============================================================================
  // 4. PROCEDURAL HOLOGRAPHIC GATEWAY ARCHWAYS FOR 100K+ REPOSITORIES
  // ==============================================================================
  const repoBillboardCache = new Map();

  function getRepoBillboardTexture(repo, index) {
    if (repoBillboardCache.has(index)) {
      return repoBillboardCache.get(index);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 380;
    const ctx = canvas.getContext('2d');

    const langColor = LANG_COLORS[repo.language] || '#22c55e';

    // Dark Glass Container Background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, 1024, 380);

    // Glowing Hologram Border
    ctx.strokeStyle = langColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 1008, 364);

    // Inner subtle glow border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 988, 344);

    // Header: Milestone Number & Lang Tag
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`MILESTONE #${index + 1} OF ${TOTAL_REPOS}`, 36, 60);

    // Language Pill
    ctx.fillStyle = langColor;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(800, 32, 180, 40, 8) : ctx.fillRect(800, 32, 180, 40);
    ctx.fill();
    ctx.fillStyle = '#05080f';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(repo.language.toUpperCase(), 890, 58);

    // Gold Star Count
    ctx.textAlign = 'left';
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 36px monospace';
    const starsFormatted = repo.stars.toLocaleString();
    ctx.fillText(`★ ${starsFormatted} STARS`, 36, 115);

    // Repository Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px -apple-system, sans-serif';
    let title = repo.full_name;
    if (title.length > 28) title = title.substring(0, 26) + '...';
    ctx.fillText(title, 36, 185);

    // Description snippet
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px -apple-system, sans-serif';
    let desc = repo.desc || 'Legendary GitHub Repository';
    if (desc.length > 68) desc = desc.substring(0, 65) + '...';
    ctx.fillText(desc, 36, 245);

    // Bottom Decorative Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(36, 290, 952, 4);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`github.com/${repo.full_name}`, 36, 335);

    const texture = new THREE.CanvasTexture(canvas);
    repoBillboardCache.set(index, texture);
    return texture;
  }

  // Active Archway Pool in Three.js Scene
  const ARCH_POOL_SIZE = 6;
  const archPool = [];

  const archPylonGeo = new THREE.CylinderGeometry(0.16, 0.22, 5.2, 16);
  const archPylonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const archCrossbeamGeo = new THREE.BoxGeometry(7.6, 0.32, 0.32);
  const archCrossbeamMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.7 });
  const billboardGeo = new THREE.PlaneGeometry(5.4, 2.0);
  const goldenStarGeo = new THREE.OctahedronGeometry(0.42, 0);
  const laserCurtainGeo = new THREE.PlaneGeometry(runwayWidth, 2.8);

  for (let k = 0; k < ARCH_POOL_SIZE; k++) {
    const archGroup = new THREE.Group();

    // Left & Right Pylons
    const leftPylon = new THREE.Mesh(archPylonGeo, archPylonMat);
    leftPylon.position.set(-runwayWidth / 2 - 0.2, 2.6, 0);
    archGroup.add(leftPylon);

    const rightPylon = new THREE.Mesh(archPylonGeo, archPylonMat);
    rightPylon.position.set(runwayWidth / 2 + 0.2, 2.6, 0);
    archGroup.add(rightPylon);

    // Overhead Crossbeam Truss
    const crossbeam = new THREE.Mesh(archCrossbeamGeo, archCrossbeamMat);
    crossbeam.position.set(0, 4.8, 0);
    archGroup.add(crossbeam);

    // Billboard Mesh (Double-sided for 360 degree visibility)
    const billboardMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98
    });
    const billboard = new THREE.Mesh(billboardGeo, billboardMat);
    billboard.position.set(0, 3.4, 0);
    archGroup.add(billboard);

    // Floating 3D Golden Star atop Arch
    const goldStar = new THREE.Mesh(goldenStarGeo, goldChromeMat);
    goldStar.position.set(0, 5.4, 0);
    archGroup.add(goldStar);

    // Neon Laser Ribbon Barrier
    const curtainMat = new THREE.MeshBasicMaterial({
      color: 0x00ff66,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const curtain = new THREE.Mesh(laserCurtainGeo, curtainMat);
    curtain.position.set(0, 1.4, 0);
    archGroup.add(curtain);

    archGroup.visible = false;
    scene.add(archGroup);

    archPool.push({
      group: archGroup,
      billboard: billboard,
      billboardMat: billboardMat,
      goldStar: goldStar,
      curtain: curtain,
      curtainMat: curtainMat,
      currentRepoIndex: -1
    });
  }

  // ==============================================================================
  // 5. WEB AUDIO SYNTHESIZER
  // ==============================================================================
  let audioCtx = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }

  function playRollSound() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  // Celebratory Milestone Chime (Ascending arpeggio chord)
  function playMilestoneChime() {
    if (!state.audioEnabled || !audioCtx) return;
    try {
      const freqs = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.25, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.5);
      });
    } catch (e) {}
  }

  // ==============================================================================
  // 6. ANIMATION & ROLLING PHYSICS LOOP
  // ==============================================================================
  let lastTime = performance.now();
  let soundTimer = 0;

  function animate(now) {
    requestAnimationFrame(animate);

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    const profile = PACING_PROFILES[state.currentPace];
    const speedMps = (profile.speedKmH * 1000) / 3600;

    // Advance World Distance
    state.distanceM += speedMps * dt;
    const distKm = state.distanceM / 1000.0;
    document.getElementById('metricDistance').innerHTML = `${distKm.toFixed(3)} <small>KM</small>`;

    // Angular Velocity Physics: omega = v / R
    const deltaTheta = (speedMps * dt) / ballRadius;
    state.rollAngle += deltaTheta;

    // 1. Physically Roll the Sphere Body Forward
    ballMesh.rotation.x -= deltaTheta;

    // Telemetry RPM
    const rpm = Math.round((speedMps / (2 * Math.PI * ballRadius)) * 60);
    document.getElementById('metricRpm').innerHTML = `${rpm} <small>RPM</small>`;

    // 2. Gyro Head Motion (Stabilized, Bobbing & Looking Ahead)
    const time = now * 0.001;
    collarMount.position.y = (ballRadius * 2 - 0.02) + Math.sin(state.rollAngle * 2) * 0.035;
    headGroup.rotation.x = -0.06 - (speedMps / 60.0) * 0.1;
    headGroup.rotation.y = Math.sin(time * 1.5) * 0.12;
    headGroup.rotation.z = Math.cos(time * 2.0) * 0.03;

    // 3. Audio Trigger for Rolling Rumble
    soundTimer += dt;
    if (soundTimer > 0.28) {
      soundTimer = 0;
      playRollSound();
    }

    // 4. Ground Shadow follows Ball
    const shadowPulsate = 1 - Math.abs(Math.sin(state.rollAngle * 2)) * 0.08;
    contactShadow.scale.set(shadowPulsate, shadowPulsate, 1);

    // 5. Runway Scrolling (Dashed Centerlines)
    const scrollStep = speedMps * dt;
    lineMeshes.forEach((l) => {
      l.position.z -= scrollStep;
      if (l.position.z < -runwayLength / 2) l.position.z += runwayLength;
    });

    // 6. Update 3D Milestone Archways Pool
    updateArchways(time);

    // 7. Update HUD Telemetry & Current Repo Card
    updateTelemetryAndCard();

    // 8. Update Camera & Render
    updateCamera(now);
    renderer.render(scene, camera);
  }

  function updateArchways(time) {
    if (TOTAL_REPOS === 0) return;

    // Current milestone index player is approaching
    const currentBaseMilestone = Math.floor(state.distanceM / GATE_SPACING);

    // Assign active arches in the pool to upcoming / nearby milestones
    for (let k = 0; k < ARCH_POOL_SIZE; k++) {
      const arch = archPool[k];
      const targetMilestoneIdx = currentBaseMilestone - 1 + k;

      if (targetMilestoneIdx >= 0 && targetMilestoneIdx < TOTAL_REPOS) {
        const repo = REPOS[targetMilestoneIdx];
        const milestoneWorldDist = (targetMilestoneIdx + 1) * GATE_SPACING;
        const relativeZ = milestoneWorldDist - state.distanceM;

        // Position arch relative to rolling ball (ball is at z = 0)
        arch.group.position.set(0, 0, relativeZ);
        arch.group.visible = (relativeZ > -40 && relativeZ < 220);

        // Update Billboard texture if milestone assigned has changed
        if (arch.currentRepoIndex !== targetMilestoneIdx) {
          arch.currentRepoIndex = targetMilestoneIdx;
          arch.billboardMat.map = getRepoBillboardTexture(repo, targetMilestoneIdx);
          arch.billboardMat.needsUpdate = true;
        }

        // Spin golden 3D star
        arch.goldStar.rotation.y = time * 1.8;
        arch.goldStar.rotation.x = Math.sin(time * 2.5) * 0.15;

        // Milestone Crossing Detection
        if (state.distanceM >= milestoneWorldDist && !state.milestonesCrossed[targetMilestoneIdx]) {
          state.milestonesCrossed[targetMilestoneIdx] = true;
          triggerMilestoneCrossed(repo, targetMilestoneIdx);
        }

      } else {
        arch.group.visible = false;
      }
    }
  }

  function triggerMilestoneCrossed(repo, index) {
    playMilestoneChime();

    // Show toast notification
    const toast = document.getElementById('milestoneToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastTitle && toastMsg) {
      toastTitle.innerText = `MILESTONE #${index + 1} CROSSED!`;
      toastMsg.innerText = `${repo.full_name} (★ ${repo.stars.toLocaleString()})`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3800);
    }
  }

  function updateTelemetryAndCard() {
    if (TOTAL_REPOS === 0) return;

    // Calculate Repos Visited & Stars Accumulated
    let visitedCount = 0;
    let accumulatedStars = 0;
    for (let i = 0; i < TOTAL_REPOS; i++) {
      if (state.milestonesCrossed[i]) {
        visitedCount++;
        accumulatedStars += REPOS[i].stars;
      }
    }

    state.reposVisitedCount = visitedCount;
    state.starsAccumulated = accumulatedStars;

    // Update Topbar Telemetry
    document.getElementById('metricRepos').innerHTML = `${visitedCount} <small>/ ${TOTAL_REPOS}</small>`;
    const starsM = (accumulatedStars / 1000000).toFixed(1);
    document.getElementById('metricStars').innerHTML = `${starsM}M <small>★</small>`;

    // Determine current active/approaching repo
    const upcomingIdx = Math.min(Math.max(0, Math.floor(state.distanceM / GATE_SPACING)), TOTAL_REPOS - 1);
    state.currentRepoIdx = upcomingIdx;
    const currentRepo = REPOS[upcomingIdx];

    const milestoneDist = (upcomingIdx + 1) * GATE_SPACING;
    const distToGate = milestoneDist - state.distanceM;

    // Update Repo Card
    const rankEl = document.getElementById('repoRank');
    const starsEl = document.getElementById('repoStars');
    const langEl = document.getElementById('repoLang');
    const titleEl = document.getElementById('repoTitle');
    const descEl = document.getElementById('repoDesc');
    const linkBtn = document.getElementById('repoLinkBtn');
    const distNotice = document.getElementById('repoDistNotice');

    if (rankEl) rankEl.innerText = `MILESTONE #${upcomingIdx + 1} OF ${TOTAL_REPOS}`;
    if (starsEl) starsEl.innerText = `★ ${currentRepo.stars.toLocaleString()}`;
    if (langEl) {
      langEl.innerText = currentRepo.language.toUpperCase();
      langEl.style.color = LANG_COLORS[currentRepo.language] || '#38bdf8';
    }
    if (titleEl) titleEl.innerText = currentRepo.full_name;
    if (descEl) descEl.innerText = currentRepo.desc || 'No description available.';
    if (linkBtn) linkBtn.href = currentRepo.url;

    if (distNotice) {
      if (distToGate > 0) {
        distNotice.innerText = `APPROACHING IN ${Math.round(distToGate)}M`;
        distNotice.style.color = '#64748b';
      } else {
        distNotice.innerText = `PASSED ✓`;
        distNotice.style.color = '#22c55e';
      }
    }
  }

  function updateCamera(time) {
    if (state.cameraMode === 'chase') {
      // Chase View — Behind the ball, looking forward at oncoming archways!
      camera.position.set(0, 2.3, -5.4);
      camera.lookAt(0, 1.8, 18.0);
    } else if (state.cameraMode === 'broadcast') {
      // Front View — Facing CJ's head
      camera.position.set(0, 2.2, 6.8);
      camera.lookAt(0, 1.4, 0);
    } else if (state.cameraMode === 'profile') {
      // Lateral 90-degree view showing the rolling ball
      camera.position.set(-5.0, 1.8, 0.4);
      camera.lookAt(0, 1.3, 0.4);
    } else if (state.cameraMode === 'closeup') {
      // Focused portrait framing head
      camera.position.set(0, 2.0, 2.8);
      camera.lookAt(0, 1.8, 0);
    } else if (state.cameraMode === 'cinematic') {
      // 360-degree orbital sweep
      const angle = (time * 0.00035);
      camera.position.set(Math.sin(angle) * 7.5, 2.8 + Math.cos(angle * 2) * 0.6, Math.cos(angle) * 7.5);
      camera.lookAt(0, 1.4, 0);
    }
  }

  // ==============================================================================
  // 7. INTERACTIVE CONTROLS & RADAR
  // ==============================================================================

  window.jumpMilestone = function (delta) {
    const nextIdx = Math.min(Math.max(0, state.currentRepoIdx + delta), TOTAL_REPOS - 1);
    warpToMilestone(nextIdx);
  };

  window.warpToMilestone = function (idx) {
    if (idx < 0 || idx >= TOTAL_REPOS) return;
    state.currentRepoIdx = idx;
    // Position ball 15 meters before the gate for a satisfying approach and pass!
    state.distanceM = Math.max(0, (idx + 1) * GATE_SPACING - 15.0);

    // Mark previous milestones as crossed
    for (let i = 0; i < idx; i++) {
      state.milestonesCrossed[i] = true;
    }
    state.milestonesCrossed[idx] = false;

    updateTelemetryAndCard();
    closeRepoModal();

    const repo = REPOS[idx];
    const toast = document.getElementById('milestoneToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastTitle && toastMsg) {
      toastTitle.innerText = `WARPING TO MILESTONE #${idx + 1}`;
      toastMsg.innerText = `${repo.full_name} (★ ${repo.stars.toLocaleString()})`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
  };

  window.setHead = function (headId) {
    state.currentHead = headId;
    if (headId === 'cj') {
      headMesh.material = cjFaceMat;
      goldChain.visible = true;
      pendant.visible = true;
      document.querySelector('.brand-sub').innerHTML = 'GITHUB 100K+ STARS HIGHWAY &bull; CJ EDITION';
      document.getElementById('quoteText').innerHTML = '&ldquo;Ah shit, here we roll again.&rdquo;';
      document.querySelector('.quote-author').innerHTML = '&mdash; Carl Johnson (CJ)';
    } else {
      headMesh.material = kipchogeFaceMat;
      goldChain.visible = false;
      pendant.visible = false;
      document.querySelector('.brand-sub').innerHTML = 'GITHUB 100K+ STARS HIGHWAY &bull; KIPCHOGE EDITION';
      document.getElementById('quoteText').innerHTML = '&ldquo;No Human Is Limited &mdash; even rolling down the GitHub Highway.&rdquo;';
      document.querySelector('.quote-author').innerHTML = '&mdash; Eliud Kipchoge';
    }

    document.querySelectorAll('[data-head]').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`[data-head="${headId}"]`);
    if (btn) btn.classList.add('active');
  };

  window.setBallSkin = function (ballId) {
    state.currentBall = ballId;
    if (ballId === 'eightball') {
      ballMesh.material = eightBallMat;
    } else if (ballId === 'cyber') {
      ballMesh.material = cyberGridMat;
    } else if (ballId === 'gold') {
      ballMesh.material = goldChromeMat;
    } else if (ballId === 'octocat') {
      ballMesh.material = octocatMat;
    }

    document.querySelectorAll('[data-ball]').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`[data-ball="${ballId}"]`);
    if (btn) btn.classList.add('active');
  };

  window.setCameraMode = function (modeId) {
    state.cameraMode = modeId;
    document.querySelectorAll('[data-cam]').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`[data-cam="${modeId}"]`);
    if (btn) btn.classList.add('active');
  };

  window.setPacingMode = function (paceId) {
    const p = PACING_PROFILES[paceId];
    if (!p) return;
    state.currentPace = paceId;

    document.getElementById('metricSpeed').innerHTML = `${p.label} <small>KM/H</small>`;

    document.querySelectorAll('[data-pace]').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`[data-pace="${paceId}"]`);
    if (btn) btn.classList.add('active');
  };

  // Audio Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      initAudio();
      state.audioEnabled = !state.audioEnabled;
      document.getElementById('audioIcon').innerText = state.audioEnabled ? '🔊' : '🔇';
      document.getElementById('audioText').innerText = state.audioEnabled ? 'AUDIO' : 'MUTE';
    });
  }

  // 60 Repos Radar Modal
  window.openRepoModal = function () {
    const backdrop = document.getElementById('repoModalBackdrop');
    if (!backdrop) return;
    backdrop.classList.add('open');
    populateModalRepos(REPOS);
    const searchInput = document.getElementById('repoSearchInput');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
  };

  window.closeRepoModal = function (e) {
    if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close-btn')) return;
    const backdrop = document.getElementById('repoModalBackdrop');
    if (backdrop) backdrop.classList.remove('open');
  };

  function populateModalRepos(reposToDisplay) {
    const grid = document.getElementById('modalRepoGrid');
    if (!grid) return;
    grid.innerHTML = '';

    reposToDisplay.forEach((repo) => {
      const originalIdx = REPOS.indexOf(repo);
      const isCurrent = (originalIdx === state.currentRepoIdx);
      const isPassed = state.milestonesCrossed[originalIdx];

      const item = document.createElement('div');
      item.className = `repo-grid-item ${isCurrent ? 'active' : ''}`;
      item.onclick = () => warpToMilestone(originalIdx);

      const langColor = LANG_COLORS[repo.language] || '#22c55e';

      item.innerHTML = `
        <div class="grid-item-top">
          <span class="grid-rank">#${originalIdx + 1} ${isPassed ? '✓' : ''}</span>
          <span class="grid-stars">★ ${(repo.stars / 1000).toFixed(0)}k</span>
        </div>
        <div class="grid-name">${repo.full_name}</div>
        <div class="grid-desc">${repo.desc || 'GitHub Top Repository'}</div>
        <div class="grid-item-bottom">
          <span class="grid-lang" style="color: ${langColor}">${repo.language}</span>
          <span class="grid-warp">WARP &rarr;</span>
        </div>
      `;
      grid.appendChild(item);
    });
  }

  window.filterReposList = function () {
    const query = (document.getElementById('repoSearchInput').value || '').toLowerCase().trim();
    if (!query) {
      populateModalRepos(REPOS);
      return;
    }
    const filtered = REPOS.filter(r =>
      r.full_name.toLowerCase().includes(query) ||
      (r.desc && r.desc.toLowerCase().includes(query)) ||
      r.language.toLowerCase().includes(query)
    );
    populateModalRepos(filtered);
  };

  // Keyboard Shortcuts: Left/Right arrows for jumping milestones
  window.addEventListener('keydown', (e) => {
    if (e.target && e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
      jumpMilestone(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
      jumpMilestone(-1);
    } else if (e.key === 'Escape') {
      closeRepoModal();
    }
  });

  // Quotation Carousel
  setInterval(() => {
    state.quoteIdx = (state.quoteIdx + 1) % ROLLING_QUOTES.length;
    const qEl = document.getElementById('quoteText');
    if (!qEl) return;
    qEl.style.opacity = 0;
    setTimeout(() => {
      if (state.currentHead === 'cj') {
        qEl.innerHTML = `&ldquo;${ROLLING_QUOTES[state.quoteIdx]}&rdquo;`;
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
