// ==============================================================================
// NGESA // THE IMMORTAL STRIDE — ROLLING BALL WITH A HEAD ENGINE
// Physics-driven rolling sphere body with an articulated gyro head on top
// ==============================================================================

(function () {
  'use strict';

  // Pacing & Speed Configurations
  const PACING_PROFILES = {
    jog:      { label: '12.0', speedKmH: 12.0, cadence: 160 },
    sprint:   { label: '21.2', speedKmH: 21.18, cadence: 188 },
    infinite: { label: '40.0', speedKmH: 40.0, cadence: 220 }
  };

  const THEMES = {
    grove: {
      bg: 0x04060a,
      fog: 0x04060a,
      road: 0x080c14,
      ground: 0x030407,
      laser: 0x00ff66,
      ambient: 0x64748b,
      sun: 0xfffaed,
      rim: 0x22c55e
    }
  };

  const ROLLING_QUOTES = [
    "Ah shit, here we roll again.",
    "They see me rollin', they hatin'...",
    "Grove Street on the roll, homie!",
    "All we had to do was follow the damn train, CJ!",
    "Ain't nobody gonna stop this ball today.",
    "Keep on rollin', baby!",
    "No Human Is Limited &mdash; even as a rolling ball."
  ];

  // Engine State
  const state = {
    currentHead: 'cj',
    currentBall: 'eightball',
    currentPace: 'sprint',
    cameraMode: 'broadcast', // Front (Face) View
    audioEnabled: false,
    distanceKm: 0.0,
    startTime: Date.now(),
    rollAngle: 0.0,
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
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Museum Lighting
  const ambientLight = new THREE.AmbientLight(THEMES.grove.ambient, 0.7);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(THEMES.grove.sun, 1.5);
  sunLight.position.set(20, 45, 18);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(THEMES.grove.rim, 0.9);
  rimLight.position.set(-18, 20, -30);
  scene.add(rimLight);

  // ==============================================================================
  // 1. PROCEDURAL TEXTURES
  // ==============================================================================

  // Ball Skin 1: Billiard 8-Ball with Grove Street Green Racing Stripes
  function createEightBallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Glossy Billiard Black
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, 512, 512);

    // Neon Grove Street Latitude Stripes (Makes rolling motion hypnotically visible)
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 90, 512, 28);
    ctx.fillRect(0, 394, 512, 28);

    // White Circle for the #8 (Repeated front & back for 360-degree rolling visibility)
    [128, 384].forEach(x => {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(x, 256, 75, 0, Math.PI * 2);
      ctx.fill();

      // Bold Numeral "8"
      ctx.fillStyle = '#080c14';
      ctx.font = '900 85px -apple-system, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('8', x, 256);
    });

    return new THREE.CanvasTexture(canvas);
  }

  // Ball Skin 2: Cyber Tron Grid
  function createCyberGridTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
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

  // CJ Face Texture
  function createCJFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#3e2316';
    ctx.fillRect(0, 0, 512, 512);

    // 1992 Buzzcut Fade Haircut
    const hairGrad = ctx.createLinearGradient(0, 0, 0, 195);
    hairGrad.addColorStop(0, '#0c0907');
    hairGrad.addColorStop(0.8, '#1b120c');
    hairGrad.addColorStop(1, '#3e2316');
    ctx.fillStyle = hairGrad;
    ctx.fillRect(0, 0, 512, 185);

    // Hairline
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

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(188, 246, 1.8, 0, Math.PI * 2);
    ctx.arc(320, 246, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = 'rgba(25, 14, 8, 0.75)';
    ctx.beginPath();
    ctx.moveTo(250, 230); ctx.lineTo(262, 230);
    ctx.lineTo(270, 320); ctx.lineTo(242, 320);
    ctx.closePath();
    ctx.fill();

    // Nostrils
    ctx.fillStyle = '#100804';
    ctx.beginPath();
    ctx.ellipse(244, 325, 6, 3, -0.2, 0, Math.PI * 2);
    ctx.ellipse(268, 325, 6, 3, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // CJ's Mustache Stubble
    ctx.fillStyle = '#120c08';
    ctx.beginPath();
    ctx.ellipse(256, 355, 34, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lips
    ctx.fillStyle = '#442618';
    ctx.beginPath();
    ctx.ellipse(256, 375, 30, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // CJ's Chin Goatee Stubble
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
  const cjFaceTex = createCJFaceTexture();
  const kipchogeFaceTex = createKipchogeFaceTexture();
  const shadowTex = createRadialShadowTexture();

  // Materials
  const eightBallMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: eightBallTex,
    roughness: 0.25,
    metalness: 0.3
  });

  const cyberGridMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: cyberGridTex,
    roughness: 0.3,
    metalness: 0.7
  });

  const goldChromeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.15,
    metalness: 0.95
  });

  const cjFaceMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: cjFaceTex,
    roughness: 0.4,
    metalness: 0.02
  });

  const kipchogeFaceMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: kipchogeFaceTex,
    roughness: 0.4,
    metalness: 0.02
  });

  const cjSkinMat = new THREE.MeshPhysicalMaterial({
    color: 0x3e2316,
    roughness: 0.38,
    metalness: 0.04
  });

  const goldChainMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.95
  });

  // ==============================================================================
  // 2. MINIMALIST INFINITE ROAD (RUNWAY)
  // ==============================================================================
  const runwayWidth = 6.0;
  const runwayLength = 260;

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
  collarMount.position.y = ballRadius * 2 - 0.02; // Sits right at apex of sphere
  characterRig.add(collarMount);

  // High-tech magnetic ring / collar
  const collarRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.04, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 })
  );
  collarRing.rotation.x = Math.PI / 2;
  collarMount.add(collarRing);

  // 3. The Gyro Head Mount (Stabilized, bobs & looks around)
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.28;
  collarMount.add(headGroup);

  // Head Mesh
  const headGeo = new THREE.SphereGeometry(0.3, 24, 24);
  headGeo.scale(0.92, 1.15, 1.05);
  const headMesh = new THREE.Mesh(headGeo, cjFaceMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // 3D Nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 8), cjSkinMat);
  nose.rotation.x = Math.PI / 2 + 0.25;
  nose.position.set(0, 0.02, 0.28);
  headGroup.add(nose);

  // 3D Ears
  const leftEar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.04, 8), cjSkinMat);
  leftEar.rotation.z = Math.PI / 2;
  leftEar.position.set(-0.28, 0.02, 0.0);
  headGroup.add(leftEar);

  const rightEar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.04, 8), cjSkinMat);
  rightEar.rotation.z = -Math.PI / 2;
  rightEar.position.set(0.28, 0.02, 0.0);
  headGroup.add(rightEar);

  // CJ's Gold Cuban Chain Draped around the Neck Collar
  const goldChain = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.026, 12, 32),
    goldChainMat
  );
  goldChain.rotation.x = Math.PI / 2.3;
  goldChain.position.set(0, 0.08, 0.04);
  collarMount.add(goldChain);

  // Chain Pendant
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
  // 4. WEB AUDIO SYNTHESIZER (ROLLING RUMBLE & BEAT)
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

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }

  // ==============================================================================
  // 5. ANIMATION & ROLLING PHYSICS LOOP
  // ==============================================================================
  let lastTime = performance.now();
  let soundTimer = 0;

  function animate(now) {
    requestAnimationFrame(animate);

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    const profile = PACING_PROFILES[state.currentPace];
    const speedMps = (profile.speedKmH * 1000) / 3600;

    // Advance Distance Meter
    state.distanceKm += (speedMps * dt) / 1000;
    document.getElementById('metricDistance').innerHTML = `${state.distanceKm.toFixed(3)} <small>KM</small>`;

    // Angular Velocity Physics: omega = v / R
    const deltaTheta = (speedMps * dt) / ballRadius;
    state.rollAngle += deltaTheta;

    // 1. Physically Roll the Sphere Body Forward around X-axis
    ballMesh.rotation.x -= deltaTheta;

    // Calculate RPM for Telemetry: RPM = (speedMps / (2 * pi * R)) * 60
    const rpm = Math.round((speedMps / (2 * Math.PI * ballRadius)) * 60);
    document.getElementById('metricRpm').innerHTML = `${rpm} <small>RPM</small>`;

    // 2. Gyro Head Motion (Stabilized, Bobbing & Looking Around)
    const time = now * 0.001;
    // Gentle vertical bobbing with roll velocity
    collarMount.position.y = (ballRadius * 2 - 0.02) + Math.sin(state.rollAngle * 2) * 0.035;

    // Dynamic head tilt proportional to speed
    headGroup.rotation.x = -0.06 - (speedMps / 40.0) * 0.12;
    // Subtle curious head sway looking around Grove Street
    headGroup.rotation.y = Math.sin(time * 1.5) * 0.14;
    headGroup.rotation.z = Math.cos(time * 2.0) * 0.04;

    // 3. Audio Trigger
    soundTimer += dt;
    if (soundTimer > 0.28) {
      soundTimer = 0;
      playRollSound();
    }

    // 4. Ground Shadow follows Ball
    contactShadow.position.y = 0.02;
    const shadowPulsate = 1 - Math.abs(Math.sin(state.rollAngle * 2)) * 0.08;
    contactShadow.scale.set(shadowPulsate, shadowPulsate, 1);

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
    if (state.cameraMode === 'broadcast') {
      // Front View — directly facing the rolling ball & head!
      camera.position.set(0, 2.2, 6.8);
      camera.lookAt(0, 1.4, 0);
    } else if (state.cameraMode === 'chase') {
      // Behind View
      camera.position.set(0, 2.5, -5.2);
      camera.lookAt(0, 1.4, 3.5);
    } else if (state.cameraMode === 'profile') {
      // 90-degree lateral view showing the ball spinning forward!
      camera.position.set(-4.6, 1.6, 0.2);
      camera.lookAt(0, 1.3, 0.2);
    } else if (state.cameraMode === 'closeup') {
      // Focused portrait framing the head atop the ball
      camera.position.set(0, 2.0, 2.6);
      camera.lookAt(0, 1.8, 0);
    } else if (state.cameraMode === 'cinematic') {
      // 360-degree orbital sweep
      const angle = (time * 0.00035);
      camera.position.set(Math.sin(angle) * 7.5, 2.8 + Math.cos(angle * 2) * 0.6, Math.cos(angle) * 7.5);
      camera.lookAt(0, 1.4, 0);
    }
  }

  // ==============================================================================
  // 6. INTERACTIVE CONTROLS
  // ==============================================================================
  window.setHead = function (headId) {
    state.currentHead = headId;
    if (headId === 'cj') {
      headMesh.material = cjFaceMat;
      goldChain.visible = true;
      pendant.visible = true;
      document.querySelector('.brand-sub').innerHTML = 'ROLLING BALL WITH A HEAD &bull; CJ EDITION';
      document.getElementById('quoteText').innerHTML = '&ldquo;Ah shit, here we roll again.&rdquo;';
      document.querySelector('.quote-author').innerHTML = '&mdash; Carl Johnson (CJ)';
    } else {
      headMesh.material = kipchogeFaceMat;
      goldChain.visible = false;
      pendant.visible = false;
      document.querySelector('.brand-sub').innerHTML = 'ROLLING BALL WITH A HEAD &bull; KIPCHOGE EDITION';
      document.getElementById('quoteText').innerHTML = '&ldquo;No Human Is Limited &mdash; even rolling.&rdquo;';
      document.querySelector('.quote-author').innerHTML = '&mdash; Eliud Kipchoge';
    }

    document.querySelectorAll('[data-head]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-head="${headId}"]`).classList.add('active');
  };

  window.setBallSkin = function (ballId) {
    state.currentBall = ballId;
    if (ballId === 'eightball') {
      ballMesh.material = eightBallMat;
    } else if (ballId === 'cyber') {
      ballMesh.material = cyberGridMat;
    } else if (ballId === 'gold') {
      ballMesh.material = goldChromeMat;
    }

    document.querySelectorAll('[data-ball]').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-ball="${ballId}"]`).classList.add('active');
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
    state.quoteIdx = (state.quoteIdx + 1) % ROLLING_QUOTES.length;
    const qEl = document.getElementById('quoteText');
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
