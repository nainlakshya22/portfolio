/**
 * LAKSHYA® — Interactive 3D Architectural Hero Scene
 * Champagne Gold Metallic Sphere with Studio Lighting & Orbital Motion
 */

export function initHeroScene() {
  const container = document.getElementById('hero-3d-container');
  const canvas = document.getElementById('hero-3d-canvas');
  const fallback = document.querySelector('.hero-3d-fallback');

  if (!container || !canvas) return;

  // Check for WebGL support or reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasWebGL = (() => {
    try {
      const glCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (glCanvas.getContext('webgl') || glCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  })();

  if (!hasWebGL || prefersReducedMotion || typeof THREE === 'undefined') {
    if (fallback) fallback.style.display = 'block';
    canvas.style.display = 'none';
    return;
  }

  let renderer, scene, camera, mainGroup, mainSphere, ring1, ring2, particles;
  let ambientLight, keyLight, rimLight, fillLight;

  try {
    // Scene, Camera, Renderer
    scene = new THREE.Scene();
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.2;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Group for rotation and mouse parallax
    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Central Luxury Sphere
    const sphereGeo = new THREE.SphereGeometry(1.35, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xC5A16A,
      metalness: 0.88,
      roughness: 0.22,
      wireframe: false
    });
    mainSphere = new THREE.Mesh(sphereGeo, sphereMat);
    mainGroup.add(mainSphere);

    // Thin Architectural Orbital Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.018, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x8D6840,
      metalness: 0.9,
      roughness: 0.15
    });
    ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    // Thin Orbital Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.35, 0.012, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xC5A16A,
      metalness: 0.95,
      roughness: 0.1
    });
    ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    mainGroup.add(ring2);

    // Subtle floating particles / constellation
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 45;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 7.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xC5A16A,
      transparent: true,
      opacity: 0.65
    });
    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Studio Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    keyLight = new THREE.DirectionalLight(0xFFEACC, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    rimLight = new THREE.DirectionalLight(0xC5A16A, 1.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    fillLight = new THREE.PointLight(0xFFFFFF, 1.2, 10);
    fillLight.position.set(0, 3, 2);
    scene.add(fillLight);
  } catch (err) {
    console.warn('Three.js initialization caught error:', err);
    if (fallback) fallback.style.display = 'block';
    canvas.style.display = 'none';
    return;
  }

  // Mouse / Touch Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  function onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    targetX = (x / rect.width) * 0.8;
    targetY = (y / rect.height) * 0.8;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Touch parallax
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.6;
      targetY = (y / rect.height) * 0.6;
    }
  }, { passive: true });

  // Handle Resize
  function onWindowResize() {
    const w = container.clientWidth || 480;
    const h = container.clientHeight || 480;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onWindowResize);

  // Animation Loop with Visibility Observer
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(container);

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia mouse tracking
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Gentle floating breathing motion
    mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

    // Subtle rotational drift
    mainSphere.rotation.y = elapsedTime * 0.22;
    mainSphere.rotation.x = Math.sin(elapsedTime * 0.15) * 0.1;

    ring1.rotation.z = elapsedTime * 0.35;
    ring2.rotation.y = -elapsedTime * 0.25;

    particles.rotation.y = elapsedTime * 0.05;

    // Parallax group tilt
    mainGroup.rotation.y = mouseX * 0.6;
    mainGroup.rotation.x = -mouseY * 0.6;

    renderer.render(scene, camera);
  }

  animate();

  // Reactive theme lighting adjust
  window.addEventListener('themeChanged', (e) => {
    const isDark = e.detail.theme === 'dark';
    ambientLight.intensity = isDark ? 0.45 : 0.85;
    keyLight.intensity = isDark ? 2.8 : 2.2;
    sphereMat.metalness = isDark ? 0.92 : 0.88;
  });
}
