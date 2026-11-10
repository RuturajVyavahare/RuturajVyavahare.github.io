/* ==========================================================================
   RV / SILICON INTERFACE — 3D SEMICONDUCTOR VISUALIZATION (THREE.JS)
   ========================================================================== */

import * as THREE from 'three';

export function initHero3D() {
  const container = document.getElementById('hero-canvas-container');
  if (!container) return;

  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Check WebGL availability
  let isWebGLAvailable = false;
  try {
    const canvas = document.createElement('canvas');
    isWebGLAvailable = !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    isWebGLAvailable = false;
  }

  if (!isWebGLAvailable) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x222226, 2.5);
  scene.add(ambientLight);

  const orangeLight = new THREE.PointLight(0xFF4B1F, 4, 15);
  orangeLight.position.set(3, 2, 4);
  scene.add(orangeLight);

  const cyanLight = new THREE.PointLight(0x00D9FF, 3.5, 15);
  cyanLight.position.set(-3, -2, 4);
  scene.add(cyanLight);

  // Silicon Substrate Carrier
  const chipGroup = new THREE.Group();
  scene.add(chipGroup);

  // Base Package (Black Matte Silicon)
  const baseGeo = new THREE.BoxGeometry(4.2, 4.2, 0.2);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x111114,
    metalness: 0.85,
    roughness: 0.35
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  chipGroup.add(baseMesh);

  // Silicon Die Core (Center Glow)
  const dieGeo = new THREE.BoxGeometry(2.4, 2.4, 0.25);
  const dieMat = new THREE.MeshStandardMaterial({
    color: 0x1C1512,
    emissive: 0xFF4B1F,
    emissiveIntensity: 0.18,
    metalness: 0.95,
    roughness: 0.2
  });
  const dieMesh = new THREE.Mesh(dieGeo, dieMat);
  dieMesh.position.z = 0.05;
  chipGroup.add(dieMesh);

  // Die Wireframe Border (Semiconductor Orange)
  const edgesGeo = new THREE.EdgesGeometry(dieGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xFF4B1F, transparent: true, opacity: 0.85 });
  const dieEdges = new THREE.LineSegments(edgesGeo, edgesMat);
  dieEdges.position.z = 0.05;
  chipGroup.add(dieEdges);

  // Exterior Pins (Artix-7 FPGA BGA / QFP representation)
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xC4C4C8, metalness: 0.9, roughness: 0.1 });
  const pinCountPerSide = 12;
  const pinLength = 0.35;
  const pinGeo = new THREE.BoxGeometry(0.08, pinLength, 0.05);

  for (let i = 0; i < pinCountPerSide; i++) {
    const offset = -1.8 + (i * (3.6 / (pinCountPerSide - 1)));
    
    // Top Pins
    const pinTop = new THREE.Mesh(pinGeo, pinMat);
    pinTop.position.set(offset, 2.25, 0);
    chipGroup.add(pinTop);

    // Bottom Pins
    const pinBot = new THREE.Mesh(pinGeo, pinMat);
    pinBot.position.set(offset, -2.25, 0);
    chipGroup.add(pinBot);

    // Left Pins (Rotated)
    const pinLeft = new THREE.Mesh(pinGeo, pinMat);
    pinLeft.rotation.z = Math.PI / 2;
    pinLeft.position.set(-2.25, offset, 0);
    chipGroup.add(pinLeft);

    // Right Pins (Rotated)
    const pinRight = new THREE.Mesh(pinGeo, pinMat);
    pinRight.rotation.z = Math.PI / 2;
    pinRight.position.set(2.25, offset, 0);
    chipGroup.add(pinRight);
  }

  // Floating Circuit Pulses / Particles
  const particleCount = 45;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 8;
    particlePositions[i + 1] = (Math.random() - 0.5) * 8;
    particlePositions[i + 2] = (Math.random() - 0.5) * 3;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00D9FF,
    size: 0.04,
    transparent: true,
    opacity: 0.75
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0.2;
  let targetRotationY = -0.3;

  function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouseX * 0.45;
    targetRotationX = -mouseY * 0.35 + 0.2;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Animation Loop
  let animationFrameId;
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    chipGroup.rotation.y += (targetRotationY - chipGroup.rotation.y) * 0.05;
    chipGroup.rotation.x += (targetRotationX - chipGroup.rotation.x) * 0.05;
    chipGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.03;

    // Slow ambient oscillation of lights
    orangeLight.position.x = 3 + Math.sin(Date.now() * 0.0015) * 0.8;
    cyanLight.position.y = -2 + Math.cos(Date.now() * 0.0015) * 0.8;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  function onResize() {
    const newWidth = container.clientWidth || window.innerWidth;
    const newHeight = container.clientHeight || window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  window.addEventListener('resize', onResize);
}

