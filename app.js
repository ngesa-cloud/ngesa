// ==============================================================================
// NGESA // THE IMMORTAL STRIDE — KIPCHOGE MARATHON SIMULATION ENGINE
// Engineered with Three.js Procedural Stride Kinematics & CFD Aerodynamics
// ==============================================================================

(function () {
  'use strict';

  // Simulation Parameters
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
      roadColor: 0x0f172a,
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

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffedd5, 1.3);
  sunLight.position.set(40, 100, 30);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  scene.add(sunLight);

  // ==============================================================================
  // 1. PROCEDURAL INFINITE RUNNING ROAD & ENVIRONMENT
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
  const laserGeo = new THREE.PlaneGeometry(roadWidth - 2, 0.4);
  const laserMat = new THREE.MeshBasicMaterial({
    color: 0x00ff66,
    transparent: true,
    opacity: 0.85
  });
  const laserLine = new THREE.Mesh(laserGeo, laserMat);
  laserLine.rotation.x = -Math.PI / 2;
  laserLine.position.set(0, 0.05, 7.5); // 7.5m in front of Kipchoge
  scene.add(laserLine);

  // Laser Grid Projection Lines
  const laserGridGroup = new THREE.Group();
  scene.add(laserGridGroup);
  for (let g = 0; g < 5; g++) {
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth - 4, 0.08), laserMat);
    gl.rotation.x = -Math.PI / 2;
    gl.position.set(0, 0.05, 5.5 + g * 1.0);
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

  // Trees / Scenery Props System
  const sceneryGroup = new THREE.Group();
  scene.add(sceneryGroup);

  const treeGeo = new THREE.ConeGeometry(2.5, 7, 7);
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const trunkGeo = new THREE.CylinderGeometry(0.4, 0.5, 2.5, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3f2e18 });

  const sceneryItems = [];
  const numTrees = 50;

  for (let i = 0; i < numTrees; i++) {
    const item = new THREE.Group();
    const foliage = new THREE.Mesh(treeGeo, treeMat);
    foliage.position.y = 4.5;
    foliage.castShadow = true;
    item.add(foliage);

    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.25;
    item.add(trunk);

    const side = (i % 2 === 0) ? 1 : -1;
    const x = side * (10 + Math.random() * 25);
    const z = (Math.random() - 0.5) * roadLength;
    item.position.set(x, 0, z);

    sceneryGroup.add(item);
    sceneryItems.push(item);
  }

  // ==============================================================================
  // 2. PROCEDURAL 3D KIPCHOGE ATHLETE RIG
  // ==============================================================================
  const runnerRig = new THREE.Group();
  scene.add(runnerRig);

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.7 }); // Deep athletic skin tone
  const singletMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }); // INEOS White Singlet
  const shortsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 }); // Black Racing Shorts
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.2 }); // Nike Alphafly Hot Orange/Red

  // Pelvis / Hips
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.5), shortsMat);
  pelvis.position.y = 1.95;
  runnerRig.add(pelvis);

  // Torso / Chest (slight forward athletic lean)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.95, 0.5), singletMat);
  torso.position.y = 0.65;
  torso.castShadow = true;
  pelvis.add(torso);

  // Kenya / INEOS Racing Bib
  const bib = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  bib.position.set(0, 0, 0.26);
  torso.add(bib);

  // Head & Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.25, 8), skinMat);
  neck.position.y = 0.58;
  torso.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), skinMat);
  head.position.y = 0.35;
  neck.add(head);

  // Left Leg (Femur, Tibia, Foot)
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.25, -0.2, 0);
  pelvis.add(leftHip);

  const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.85, 12), skinMat);
  leftThigh.position.y = -0.425;
  leftThigh.castShadow = true;
  leftHip.add(leftThigh);

  const leftKnee = new THREE.Group();
  leftKnee.position.set(0, -0.425, 0);
  leftThigh.add(leftKnee);

  const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.85, 12), skinMat);
  leftCalf.position.y = -0.425;
  leftCalf.castShadow = true;
  leftKnee.add(leftCalf);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.6), shoeMat);
  leftFoot.position.set(0, -0.45, 0.12);
  leftFoot.castShadow = true;
  leftCalf.add(leftFoot);

  // Right Leg
  const rightHip = new THREE.Group();
  rightHip.position.set(0.25, -0.2, 0);
  pelvis.add(rightHip);

  const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.85, 12), skinMat);
  rightThigh.position.y = -0.425;
  rightThigh.castShadow = true;
  rightHip.add(rightThigh);

  const rightKnee = new THREE.Group();
  rightKnee.position.set(0, -0.425, 0);
  rightThigh.add(rightKnee);

  const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.85, 12), skinMat);
  rightCalf.position.y = -0.425;
  rightCalf.castShadow = true;
  rightKnee.add(rightCalf);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.6), shoeMat);
  rightFoot.position.set(0, -0.45, 0.12);
  rightFoot.castShadow = true;
  rightCalf.add(rightFoot);

  // Left Arm (Shoulder, Bicep, Forearm)
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.48, 0.38, 0);
  torso.add(leftShoulder);

  const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.65, 8), skinMat);
  leftUpperArm.position.y = -0.325;
  leftShoulder.add(leftUpperArm);

  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.325, 0);
  leftUpperArm.add(leftElbow);

  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.6, 8), skinMat);
  leftForearm.position.y = -0.3;
  leftElbow.add(leftForearm);
  leftElbow.rotation.x = -1.4; // Running 90-degree bent elbow

  // Right Arm
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.48, 0.38, 0);
  torso.add(rightShoulder);

  const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.65, 8), skinMat);
  rightUpperArm.position.y = -0.325;
  rightShoulder.add(rightUpperArm);

  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.325, 0);
  rightUpperArm.add(rightElbow);

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.6, 8), skinMat);
  rightForearm.position.y = -0.3;
  rightElbow.add(rightForearm);
  rightElbow.rotation.x = -1.4;

  // ==============================================================================
  // 3. CFD 7-MAN PACING FORMATION (INVERTED ARROW SHIELD)
  // ==============================================================================
  const pacerGroup = new THREE.Group();
  scene.add(pacerGroup);

  const pacerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const pacerPositions = [
    { x: 0, z: 4.5 },       // Lead Point
    { x: -1.6, z: 3.2 },    // Left Wing 1
    { x: 1.6, z: 3.2 },     // Right Wing 1
    { x: -3.2, z: 1.8 },    // Left Wing 2
    { x: 3.2, z: 1.8 },     // Right Wing 2
    { x: -1.4, z: -2.8 },   // Rear Left Guard
    { x: 1.4, z: -2.8 }     // Rear Right Guard
  ];

  const pacers = [];
  pacerPositions.forEach((pos) => {
    const p = new THREE.Group();
    p.position.set(pos.x, 1.9, pos.z);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.7, 12), pacerMat);
    body.castShadow = true;
    p.add(body);

    const headP = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), skinMat);
    headP.position.y = 1.1;
    p.add(headP);

    pacerGroup.add(p);
    pacers.push(p);
  });

  // Aerodynamic Airflow Particle Stream (CFD Visualization)
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 200;
  const pPos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 12;
    pPos[i + 1] = Math.random() * 3.5;
    pPos[i + 2] = (Math.random() - 0.5) * 20;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  const particlesMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.12,
    transparent: true,
    opacity: 0.45
  });
  const streamParticles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(streamParticles);

  // ==============================================================================
  // 4. WEB AUDIO SYNTHESIZER (CADENCE METRONOME & FOOTSTRIKES)
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
      osc.frequency.setValueAtTime(80, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // ==============================================================================
  // 5. SIMULATION FRAME LOOP (60 FPS STRIDE KINEMATICS)
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

    // Stride Frequency (Radians per second based on Cadence)
    const strideFreq = (profile.cadence / 60) * Math.PI * 2;
    state.stridePhase += strideFreq * dt;

    // Stride Trigonometrics
    const phase = state.stridePhase;
    const sinPhase = Math.sin(phase);
    const cosPhase = Math.cos(phase);

    // Vertical Hip Bounce & Forward Lean
    pelvis.position.y = 1.95 + Math.abs(cosPhase) * 0.08;
    torso.rotation.x = 0.12 + Math.sin(phase * 2) * 0.02; // rhythmic breathing lean

    // Leg Angles (Hip Swing & Knee Drive)
    leftHip.rotation.x = sinPhase * 0.75;
    rightHip.rotation.x = -sinPhase * 0.75;

    leftKnee.rotation.x = (sinPhase > 0 ? sinPhase * 1.3 : 0.2);
    rightKnee.rotation.x = (-sinPhase > 0 ? -sinPhase * 1.3 : 0.2);

    // Footstrike Audio Trigger
    if (sinPhase > 0.95 && !footstrikeTriggered) {
      playFootstrikeSound();
      footstrikeTriggered = true;
    } else if (sinPhase < 0.2 && footstrikeTriggered) {
      footstrikeTriggered = false;
    }

    // Arm Counter-Swing
    leftShoulder.rotation.x = -sinPhase * 0.75;
    rightShoulder.rotation.x = sinPhase * 0.75;

    // Torso Counter-Rotation (Shoulders rotate opposite to hips)
    torso.rotation.y = -sinPhase * 0.1;

    // Pacers Subtle Stride Sync
    if (state.isDraftingActive) {
      pacers.forEach((p, idx) => {
        p.position.y = 1.9 + Math.abs(Math.cos(phase + idx)) * 0.06;
      });
    }

    // Road Markings & Environment Infinite Scrolling
    const scrollStep = speedMps * dt * 2.5;
    lineMeshes.forEach((l) => {
      l.position.z -= scrollStep;
      if (l.position.z < -roadLength / 2) l.position.z += roadLength;
    });

    sceneryItems.forEach((item) => {
      item.position.z -= scrollStep;
      if (item.position.z < -roadLength / 2) item.position.z += roadLength;
    });

    // CFD Stream Particles
    const posAttr = particlesGeo.attributes.position;
    for (let i = 2; i < particleCount * 3; i += 3) {
      posAttr.array[i] -= scrollStep * 1.8;
      if (posAttr.array[i] < -12) posAttr.array[i] += 24;
    }
    posAttr.needsUpdate = true;

    // Camera Perspective Controllers
    updateCamera(now);

    renderer.render(scene, camera);
  }

  function updateCamera(time) {
    if (state.cameraMode === 'chase') {
      // Third-person trailing behind Kipchoge
      camera.position.set(0, 3.2, -6.5);
      camera.lookAt(0, 1.8, 4.0);
    } else if (state.cameraMode === 'broadcast') {
      // Front-facing lead pace vehicle tracking Kipchoge head-on
      camera.position.set(0, 2.6, 9.5);
      camera.lookAt(0, 1.8, 0);
    } else if (state.cameraMode === 'cinematic') {
      // Orbital Drone sweeping around
      const angle = (time * 0.0003);
      camera.position.set(Math.sin(angle) * 9, 3.8 + Math.cos(angle * 2) * 1.2, Math.cos(angle) * 9);
      camera.lookAt(0, 1.8, 0);
    }
  }

  // ==============================================================================
  // 6. INTERACTIVE CONTROLS (GLOBAL EXPOSURE)
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
