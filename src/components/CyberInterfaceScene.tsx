import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Eye, RotateCw, Zap, Sliders, ChevronDown, ChevronUp, Layers, Box } from 'lucide-react';

interface CyberInterfaceSceneProps {
  className?: string;
}

export const CyberInterfaceScene: React.FC<CyberInterfaceSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [explodedFactor, setExplodedFactor] = useState(0.0);
  const [laserIntensity, setLaserIntensity] = useState(1.4);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [activePreset, setActivePreset] = useState<'isometric' | 'front' | 'top'>('isometric');

  // Mutable refs for Three.js animation loop access
  const paramsRef = useRef({
    speed: 1.0,
    exploded: 0.0,
    laserIntensity: 1.4,
    wireframe: false,
    targetCamPos: new THREE.Vector3(2.8, 1.8, 3.8),
    targetCamLook: new THREE.Vector3(0, 0, 0),
    isInteracting: false,
    mousePos: new THREE.Vector2(0, 0),
    targetMousePos: new THREE.Vector2(0, 0)
  });

  // Keep paramsRef in sync with React state
  useEffect(() => {
    paramsRef.current.speed = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    paramsRef.current.exploded = explodedFactor;
  }, [explodedFactor]);

  useEffect(() => {
    paramsRef.current.laserIntensity = laserIntensity;
  }, [laserIntensity]);

  useEffect(() => {
    paramsRef.current.wireframe = wireframeMode;
  }, [wireframeMode]);

  const setCameraPreset = (preset: 'isometric' | 'front' | 'top') => {
    setActivePreset(preset);
    if (preset === 'isometric') {
      paramsRef.current.targetCamPos.set(2.8, 1.8, 3.8);
    } else if (preset === 'front') {
      paramsRef.current.targetCamPos.set(0, 0.2, 4.4);
    } else if (preset === 'top') {
      paramsRef.current.targetCamPos.set(0.01, 4.8, 0.01);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene & Renderer Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.07);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.copy(paramsRef.current.targetCamPos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Setup
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff3e6, 2.8);
    keyLight.position.set(4, 5, 3);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0x405060, 0x080808, 1.2);
    scene.add(hemiLight);

    // Laser Crimson Interior Point Light
    const laserCoreLight = new THREE.PointLight(0xd41514, 4.5, 8);
    laserCoreLight.position.set(0, 0, 0);
    scene.add(laserCoreLight);

    // Laser Rim Accent
    const crimsonRim = new THREE.DirectionalLight(0xd41514, 2.0);
    crimsonRim.position.set(-3, -2, -3);
    scene.add(crimsonRim);

    // 5. Procedural Normal / Bump Texture via 2D Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 2;
    for (let i = 0; i < 256; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }
    const cyberGridTexture = new THREE.CanvasTexture(canvas);
    cyberGridTexture.wrapS = THREE.RepeatWrapping;
    cyberGridTexture.wrapT = THREE.RepeatWrapping;
    cyberGridTexture.repeat.set(4, 4);
    cyberGridTexture.colorSpace = THREE.SRGBColorSpace;
    cyberGridTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 6. Composite 3–12 Part Procedural Cybernetic Model
    const cyberSubjectGroup = new THREE.Group();
    cyberSubjectGroup.position.set(0, 0.1, 0);
    scene.add(cyberSubjectGroup);

    // Part 1: Central Quantum Core (Laser Crimson & Obsidian Core)
    const coreGeo = new THREE.IcosahedronGeometry(0.72, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      emissive: 0xd41514,
      emissiveIntensity: 0.6,
      roughness: 0.18,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      bumpMap: cyberGridTexture,
      bumpScale: 0.03
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = !isSoftwareGl;
    cyberSubjectGroup.add(coreMesh);

    // Part 2: Inner Chrome Gimbal Ring
    const innerRingGeo = new THREE.TorusGeometry(1.05, 0.045, 24, 72);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xcdcbca,
      metalness: 0.96,
      roughness: 0.12,
      envMapIntensity: 1.5
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, chromeMat);
    cyberSubjectGroup.add(innerRingMesh);

    // Part 3: Intermediate Slotted Gimbal Ring with Radial Brackets
    const midRingGeo = new THREE.TorusGeometry(1.35, 0.05, 24, 72);
    const darkChromeMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.2
    });
    const midRingMesh = new THREE.Mesh(midRingGeo, darkChromeMat);
    midRingMesh.rotation.x = Math.PI / 4;
    cyberSubjectGroup.add(midRingMesh);

    // Part 4: Outer Emitter Ring with Laser Nodes
    const outerRingGeo = new THREE.TorusGeometry(1.68, 0.035, 24, 80);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.92,
      roughness: 0.25
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.y = Math.PI / 3;
    cyberSubjectGroup.add(outerRingMesh);

    // Part 5: Laser Node Emitter Beads on Outer Ring (Composite detailing)
    const nodeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.15, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xd41514,
      emissive: 0xd41514,
      emissiveIntensity: 1.2,
      metalness: 0.5,
      roughness: 0.3
    });
    const nodeGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 1.68, Math.sin(angle) * 1.68, 0);
      node.rotation.z = angle + Math.PI / 2;
      nodeGroup.add(node);
    }
    outerRingMesh.add(nodeGroup);

    // Part 6: Floating Holographic Orbit Data Shards (InstancedMesh)
    const shardCount = 28;
    const shardGeo = new THREE.OctahedronGeometry(0.08, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xd41514,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.15
    });
    const shardMesh = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
    shardMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    shardMesh.computeBoundingSphere();
    shardMesh.frustumCulled = false;
    cyberSubjectGroup.add(shardMesh);

    // Pre-calculate shard orbit offsets
    const shardOrbitRadius: number[] = [];
    const shardOrbitSpeed: number[] = [];
    const shardOrbitHeight: number[] = [];
    const shardOrbitInitialAngle: number[] = [];
    for (let i = 0; i < shardCount; i++) {
      shardOrbitRadius.push(2.1 + (i % 5) * 0.25);
      shardOrbitSpeed.push(0.4 + (i % 3) * 0.3);
      shardOrbitHeight.push((Math.sin(i * 1.7) * 0.8));
      shardOrbitInitialAngle.push((i / shardCount) * Math.PI * 2);
    }

    // Part 7: Ground Contact Shadow (Soft radial grounding plane)
    const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const gradient = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.65;
    scene.add(shadowPlane);

    // Pre-allocated reusable math objects to avoid GC allocation
    const _vec3 = new THREE.Vector3();
    const _dummyMat = new THREE.Matrix4();
    const _dummyQuat = new THREE.Quaternion();
    const _dummyScale = new THREE.Vector3(1, 1, 1);
    const clock = new THREE.Clock();

    // Mouse / Touch Parallax Handlers
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      paramsRef.current.targetMousePos.set(
        Math.max(-1, Math.min(1, x)),
        Math.max(-1, Math.min(1, y))
      );
    };

    container.addEventListener('pointermove', handlePointerMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop with Exponential Damping
    let frameId = 0;
    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const params = paramsRef.current;

      // Smooth mouse damping
      params.mousePos.x = THREE.MathUtils.damp(params.mousePos.x, params.targetMousePos.x, 3.5, delta);
      params.mousePos.y = THREE.MathUtils.damp(params.mousePos.y, params.targetMousePos.y, 3.5, delta);

      // Smooth camera position damping to active target preset + mouse parallax
      const camTarget = _vec3.copy(params.targetCamPos);
      camTarget.x += params.mousePos.x * 0.6;
      camTarget.y += params.mousePos.y * 0.4;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, camTarget.x, 3.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camTarget.y, 3.0, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camTarget.z, 3.0, delta);
      camera.lookAt(params.targetCamLook);

      // Core rotation & multi-axis gimbal kinematic articulation
      const spd = params.speed;
      coreMesh.rotation.y += 0.4 * delta * spd;
      coreMesh.rotation.x += 0.2 * delta * spd;

      innerRingMesh.rotation.z += 0.8 * delta * spd;
      innerRingMesh.rotation.x += 0.3 * delta * spd;

      midRingMesh.rotation.y -= 0.6 * delta * spd;
      midRingMesh.rotation.z += 0.2 * delta * spd;

      outerRingMesh.rotation.x += 0.5 * delta * spd;
      outerRingMesh.rotation.y += 0.3 * delta * spd;

      // Exploded View kinematics (smoothly scales and separates rings outward)
      const expl = params.exploded;
      innerRingMesh.scale.setScalar(1.0 + expl * 0.4);
      midRingMesh.scale.setScalar(1.0 + expl * 0.7);
      outerRingMesh.scale.setScalar(1.0 + expl * 1.1);

      // Laser intensity modulation
      const pulse = 1.0 + Math.sin(elapsed * 2.5) * 0.15;
      laserCoreLight.intensity = params.laserIntensity * 3.5 * pulse;
      coreMat.emissiveIntensity = 0.5 * params.laserIntensity * pulse;

      // Wireframe toggle
      coreMat.wireframe = params.wireframe;
      chromeMat.wireframe = params.wireframe;
      darkChromeMat.wireframe = params.wireframe;
      outerRingMat.wireframe = params.wireframe;

      // Update Floating Shard Swarm matrices
      for (let i = 0; i < shardCount; i++) {
        const rad = shardOrbitRadius[i] * (1.0 + expl * 0.5);
        const theta = shardOrbitInitialAngle[i] + elapsed * shardOrbitSpeed[i] * spd * 0.5;
        const shX = Math.cos(theta) * rad;
        const shZ = Math.sin(theta) * rad;
        const shY = shardOrbitHeight[i] + Math.sin(elapsed * 1.8 + i) * 0.2;

        _vec3.set(shX, shY, shZ);
        _dummyQuat.setFromAxisAngle(_vec3.clone().normalize(), elapsed + i);
        _dummyMat.compose(_vec3, _dummyQuat, _dummyScale);
        shardMesh.setMatrixAt(i, _dummyMat);
      }
      shardMesh.instanceMatrix.needsUpdate = true;

      // Gentle floating bob for the whole subject
      cyberSubjectGroup.position.y = 0.1 + Math.sin(elapsed * 1.2) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerRingGeo.dispose();
      chromeMat.dispose();
      midRingGeo.dispose();
      darkChromeMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      cyberGridTexture.dispose();
      shadowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-[460px] sm:h-[540px] lg:h-[620px] overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Cybernetic HUD Overlay Badges (Top Left & Top Right) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col gap-1.5 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#262626] bg-[#0c0c0c]/85 text-[11px] font-mono uppercase tracking-wider text-[#CDCBCA]">
          <span className="w-2 h-2 rounded-full bg-[#D41514]"></span>
          <span>CYBERNETIC_CORE // V3.8</span>
        </div>
        <div className="text-[10px] font-mono text-[#8E8D8C] hidden sm:block">
          PBR RENDERING • STUDIO ROOM REFLECTIONS
        </div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none hidden md:flex flex-col items-end gap-1 font-mono text-[11px]">
        <span className="text-[#8E8D8C]">ORIENTATION</span>
        <span className="text-[#CDCBCA] uppercase font-semibold">[{activePreset}]</span>
        <span className="text-[10px] text-[#555555]">60 FPS LOSSLESS</span>
      </div>

      {/* Unified Bottom Control Dock (Strictly following threejs skill - Collapsible, <= 15% viewport, zero side clutter) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[820px] z-20 transition-all duration-300">
        {/* Toggle Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-t-md bg-[#121212] border-t border-x border-[#282828] text-[#CDCBCA] hover:text-[#D41514] transition-colors"
          >
            {isControlsOpen ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Interact 3D Core</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Dock Panel */}
        {isControlsOpen && (
          <div className="bg-[#121212] border border-[#282828] rounded-xl rounded-t-none p-3 sm:p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Camera View Presets */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <span className="text-[10px] font-mono text-[#8E8D8C] uppercase tracking-wider mr-1 hidden sm:inline">
                View:
              </span>
              <button
                onClick={() => setCameraPreset('isometric')}
                className={`flex-1 md:flex-initial px-2.5 py-1 text-[11px] font-mono rounded border transition-colors ${
                  activePreset === 'isometric'
                    ? 'border-[#D41514] bg-[#D41514]/15 text-white font-semibold'
                    : 'border-[#262626] bg-[#181818] text-[#8E8D8C] hover:text-[#CDCBCA]'
                }`}
              >
                Iso
              </button>
              <button
                onClick={() => setCameraPreset('front')}
                className={`flex-1 md:flex-initial px-2.5 py-1 text-[11px] font-mono rounded border transition-colors ${
                  activePreset === 'front'
                    ? 'border-[#D41514] bg-[#D41514]/15 text-white font-semibold'
                    : 'border-[#262626] bg-[#181818] text-[#8E8D8C] hover:text-[#CDCBCA]'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setCameraPreset('top')}
                className={`flex-1 md:flex-initial px-2.5 py-1 text-[11px] font-mono rounded border transition-colors ${
                  activePreset === 'top'
                    ? 'border-[#D41514] bg-[#D41514]/15 text-white font-semibold'
                    : 'border-[#262626] bg-[#181818] text-[#8E8D8C] hover:text-[#CDCBCA]'
                }`}
              >
                Top
              </button>
            </div>

            {/* Exploded View Slider */}
            <div className="flex items-center gap-2 w-full md:w-48">
              <Layers className="w-3.5 h-3.5 text-[#8E8D8C] shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-mono text-[#8E8D8C] mb-1">
                  <span>Exploded</span>
                  <span>{Math.round(explodedFactor * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explodedFactor}
                  onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                  className="w-full accent-[#D41514] cursor-pointer h-1.5 bg-[#262626] rounded-lg"
                />
              </div>
            </div>

            {/* Core Speed & Laser Sliders */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-[#8E8D8C]" />
                <button
                  onClick={() => setRotationSpeed(rotationSpeed === 0 ? 1.0 : rotationSpeed === 1.0 ? 2.0 : 0)}
                  className="px-2 py-1 text-[11px] font-mono rounded border border-[#262626] bg-[#181818] text-[#CDCBCA] hover:border-[#D41514]"
                >
                  {rotationSpeed === 0 ? 'Paused' : rotationSpeed === 1.0 ? '1.0x' : '2.0x'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#D41514]" />
                <button
                  onClick={() => setLaserIntensity(laserIntensity > 1.0 ? 0.4 : 1.8)}
                  className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                    laserIntensity > 1.0
                      ? 'border-[#D41514] bg-[#D41514]/20 text-[#CDCBCA]'
                      : 'border-[#262626] bg-[#181818] text-[#8E8D8C]'
                  }`}
                >
                  Laser {laserIntensity > 1.0 ? 'Boost' : 'Dim'}
                </button>
              </div>

              {/* Wireframe Mode */}
              <button
                onClick={() => setWireframeMode(!wireframeMode)}
                className={`p-1.5 rounded border transition-colors ${
                  wireframeMode
                    ? 'border-[#D41514] bg-[#D41514]/20 text-white'
                    : 'border-[#262626] bg-[#181818] text-[#8E8D8C] hover:text-[#CDCBCA]'
                }`}
                title="Toggle Wireframe HUD"
              >
                <Box className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
