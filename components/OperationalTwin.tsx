"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ──────────────────────────────────────────
// DATA
// ──────────────────────────────────────────
interface NodeData {
  id: string;
  label: string;
  type: "supplier" | "hub" | "warehouse" | "destination";
  x: number;
  z: number;
  inventory?: string;
  coverage?: string;
  demand?: string;
  risk?: string;
  inbound?: number;
  outbound?: number;
  dependencies?: number;
  status?: string;
}

const NODES: NodeData[] = [
  { id: "supplier", label: "SUPPLIER", type: "supplier", x: -3.2, z: -0.8 },
  {
    id: "hub-02",
    label: "HUB-02",
    type: "hub",
    x: -0.8,
    z: 0.2,
    inbound: 42,
    outbound: 37,
    dependencies: 6,
    status: "Stable",
  },
  {
    id: "wh-01",
    label: "WH-01",
    type: "warehouse",
    x: 1.8,
    z: -1.8,
    inventory: "12.4K",
    coverage: "8.2 days",
  },
  {
    id: "wh-04",
    label: "WH-04",
    type: "warehouse",
    x: 2.0,
    z: 0.4,
    inventory: "8.7K",
    coverage: "5.4 days",
    demand: "+14%",
    risk: "7.2%",
  },
  {
    id: "wh-07",
    label: "WH-07",
    type: "warehouse",
    x: 1.5,
    z: 2.4,
    inventory: "11.1K",
    coverage: "7.8 days",
  },
  { id: "mission", label: "MISSION", type: "destination", x: 3.6, z: 0.8 },
];

interface RouteData {
  from: string;
  to: string;
  risk?: boolean;
}

const ROUTES: RouteData[] = [
  { from: "supplier", to: "hub-02" },
  { from: "hub-02", to: "wh-01" },
  { from: "hub-02", to: "wh-04", risk: true },
  { from: "hub-02", to: "wh-07" },
  { from: "wh-01", to: "mission" },
  { from: "wh-04", to: "mission", risk: true },
  { from: "wh-07", to: "mission" },
];

const RISK_PATH = ["supplier", "hub-02", "wh-04", "mission"];

// ──────────────────────────────────────────
// THREE.JS SCENE BUILDER
// ──────────────────────────────────────────
function createScene(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  onNodeHover: (id: string | null, screenPos?: { x: number; y: number }) => void,
  onNodeClick: (id: string | null, screenPos?: { x: number; y: number }) => void,
  prefersReducedMotion: boolean
) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const dpr = Math.min(window.devicePixelRatio, 1.5);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();

  // Camera — elevated 3/4 view
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
  camera.position.set(1.5, 9.0, 11.5);
  camera.lookAt(0.3, 0, 0.4);

  // ── LIGHTING ──
  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(5, 10, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.camera.left = -8;
  keyLight.shadow.camera.right = 8;
  keyLight.shadow.camera.top = 8;
  keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.bias = -0.001;
  keyLight.shadow.radius = 3;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xf7f6f2, 0.3);
  fillLight.position.set(-3, 5, -2);
  scene.add(fillLight);

  // ── MATERIALS (shared) ──
  const matWhite = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    roughness: 0.85,
    metalness: 0.0,
  });
  const matRoof = new THREE.MeshStandardMaterial({
    color: 0xe0dfdb,
    roughness: 0.9,
    metalness: 0.0,
  });
  const matDark = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.7,
    metalness: 0.1,
  });
  const matCharcoal = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 0.6,
    metalness: 0.15,
  });
  const matGreen = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.5,
    metalness: 0.0,
    emissive: 0x22c55e,
    emissiveIntensity: 0.15,
  });
  const matGreenDim = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.7,
    metalness: 0.0,
    transparent: true,
    opacity: 0.7,
  });
  const matRisk = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.5,
    metalness: 0.0,
    emissive: 0xef4444,
    emissiveIntensity: 0.2,
  });
  const matGround = new THREE.MeshStandardMaterial({
    color: 0xeeedea,
    roughness: 1.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.35,
  });

  // ── GROUND PLANE ──
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    matGround
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  scene.add(ground);

  // Node objects for raycasting
  const nodeMap = new Map<
    string,
    { group: THREE.Group; data: NodeData; mainMesh: THREE.Mesh }
  >();

  // ── BUILD WAREHOUSE ──
  function createWarehouse(node: NodeData) {
    const group = new THREE.Group();
    group.position.set(node.x, 0, node.z);
    group.userData = { nodeId: node.id };

    // Main body
    const bodyGeo = new THREE.BoxGeometry(1.1, 0.55, 0.75);
    const body = new THREE.Mesh(bodyGeo, matWhite.clone());
    body.position.y = 0.275;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Roof (slightly wider, thin)
    const roofGeo = new THREE.BoxGeometry(1.2, 0.05, 0.85);
    const roof = new THREE.Mesh(roofGeo, matRoof);
    roof.position.y = 0.575;
    roof.castShadow = true;
    group.add(roof);

    // Loading bay (dark recess on front)
    const bayGeo = new THREE.BoxGeometry(0.35, 0.3, 0.04);
    const bay = new THREE.Mesh(bayGeo, matDark);
    bay.position.set(-0.15, 0.17, 0.376);
    group.add(bay);

    // Second bay
    const bay2 = new THREE.Mesh(bayGeo, matDark);
    bay2.position.set(0.25, 0.17, 0.376);
    group.add(bay2);

    // Small structural accent line on roof edge
    const edgeGeo = new THREE.BoxGeometry(1.2, 0.025, 0.02);
    const edge = new THREE.Mesh(edgeGeo, matCharcoal);
    edge.position.set(0, 0.565, 0.435);
    group.add(edge);

    // Inventory stacks beside warehouse
    const stackGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const stackMat = new THREE.MeshStandardMaterial({
      color: 0xd5d4d0,
      roughness: 0.9,
    });
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const stack = new THREE.Mesh(stackGeo, stackMat);
        stack.position.set(
          0.7 + i * 0.15,
          0.06 + j * 0.13,
          node.z > 0 ? -0.2 : 0.2
        );
        stack.castShadow = true;
        group.add(stack);
      }
    }

    // Risk indicator for WH-04
    if (node.risk) {
      const riskGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const riskBall = new THREE.Mesh(riskGeo, matRisk);
      riskBall.position.set(0.5, 0.72, 0);
      riskBall.userData = { isRisk: true };
      group.add(riskBall);

      // Risk ring
      const ringGeo = new THREE.RingGeometry(0.09, 0.11, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0.5, 0.72, 0);
      ring.rotation.x = -Math.PI / 2;
      ring.userData = { riskRing: true };
      group.add(ring);
    }

    // Green status dot
    const statusGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const statusDot = new THREE.Mesh(
      statusGeo,
      node.risk ? matGreenDim : matGreen
    );
    statusDot.position.set(-0.5, 0.65, 0);
    group.add(statusDot);

    scene.add(group);
    nodeMap.set(node.id, { group, data: node, mainMesh: body });
    return group;
  }

  // ── BUILD HUB ──
  function createHub(node: NodeData) {
    const group = new THREE.Group();
    group.position.set(node.x, 0, node.z);
    group.userData = { nodeId: node.id };

    // Main body — slightly taller / wider than warehouses
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.7, 1.0);
    const body = new THREE.Mesh(bodyGeo, matWhite.clone());
    body.position.y = 0.35;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Roof
    const roofGeo = new THREE.BoxGeometry(1.5, 0.06, 1.1);
    const roof = new THREE.Mesh(roofGeo, matRoof);
    roof.position.y = 0.73;
    roof.castShadow = true;
    group.add(roof);

    // Loading bays — multiple on front
    const bayGeo = new THREE.BoxGeometry(0.25, 0.35, 0.04);
    for (let i = 0; i < 3; i++) {
      const bay = new THREE.Mesh(bayGeo, matDark);
      bay.position.set(-0.4 + i * 0.35, 0.2, 0.51);
      group.add(bay);
    }

    // Accent stripe
    const stripeGeo = new THREE.BoxGeometry(1.5, 0.03, 0.02);
    const stripe = new THREE.Mesh(stripeGeo, matCharcoal);
    stripe.position.set(0, 0.71, 0.56);
    group.add(stripe);

    // Green status
    const statusGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const status = new THREE.Mesh(statusGeo, matGreen);
    status.position.set(0, 0.82, 0);
    group.add(status);

    scene.add(group);
    nodeMap.set(node.id, { group, data: node, mainMesh: body });
    return group;
  }

  // ── BUILD SUPPLIER ──
  function createSupplier(node: NodeData) {
    const group = new THREE.Group();
    group.position.set(node.x, 0, node.z);
    group.userData = { nodeId: node.id };

    // Simpler/smaller structure
    const bodyGeo = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    const body = new THREE.Mesh(bodyGeo, matCharcoal);
    body.position.y = 0.25;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Flat roof
    const roofGeo = new THREE.BoxGeometry(0.9, 0.04, 0.7);
    const roof = new THREE.Mesh(roofGeo, matDark);
    roof.position.y = 0.52;
    roof.castShadow = true;
    group.add(roof);

    // Accent
    const accentGeo = new THREE.BoxGeometry(0.04, 0.5, 0.04);
    const accent = new THREE.Mesh(
      accentGeo,
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 })
    );
    accent.position.set(-0.42, 0.25, -0.32);
    group.add(accent);

    scene.add(group);
    nodeMap.set(node.id, { group, data: node, mainMesh: body });
    return group;
  }

  // ── BUILD DESTINATION ──
  function createDestination(node: NodeData) {
    const group = new THREE.Group();
    group.position.set(node.x, 0, node.z);
    group.userData = { nodeId: node.id };

    // Small marker post
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const post = new THREE.Mesh(postGeo, matCharcoal);
    post.position.y = 0.2;
    post.castShadow = true;
    group.add(post);

    // Flag / plate
    const flagGeo = new THREE.BoxGeometry(0.35, 0.2, 0.02);
    const flag = new THREE.Mesh(
      flagGeo,
      new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.5,
        emissive: 0x22c55e,
        emissiveIntensity: 0.1,
      })
    );
    flag.position.set(0.18, 0.38, 0);
    flag.castShadow = true;
    group.add(flag);

    // Base circle
    const baseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16);
    const basePlate = new THREE.Mesh(baseGeo, matDark);
    basePlate.position.y = 0.01;
    group.add(basePlate);

    scene.add(group);
    nodeMap.set(node.id, { group, data: node, mainMesh: post });
    return group;
  }

  // ── BUILD ALL NODES ──
  for (const node of NODES) {
    if (node.type === "warehouse") createWarehouse(node);
    else if (node.type === "hub") createHub(node);
    else if (node.type === "supplier") createSupplier(node);
    else if (node.type === "destination") createDestination(node);
  }

  // ── ROUTES ──
  const routeLines: {
    line: THREE.Line;
    data: RouteData;
    defaultMat: THREE.LineBasicMaterial;
  }[] = [];
  const routeGroup = new THREE.Group();
  scene.add(routeGroup);

  for (const route of ROUTES) {
    const fromNode = NODES.find((n) => n.id === route.from)!;
    const toNode = NODES.find((n) => n.id === route.to)!;

    const points = [
      new THREE.Vector3(fromNode.x, 0.02, fromNode.z),
      new THREE.Vector3(toNode.x, 0.02, toNode.z),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: route.risk ? 0x555555 : 0xc8c3bb,
      transparent: true,
      opacity: route.risk ? 0.6 : 0.45,
    });
    const line = new THREE.Line(geometry, mat);
    routeGroup.add(line);
    routeLines.push({ line, data: route, defaultMat: mat });
  }

  // ── SHIPMENT MARKERS ──
  const shipments: {
    mesh: THREE.Mesh;
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    speed: number;
    progress: number;
    route: RouteData;
  }[] = [];

  const shipmentGeo = new THREE.BoxGeometry(0.08, 0.06, 0.06);
  const shipmentMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.5,
  });

  // Only 3 moving shipment markers to keep it subtle
  const shipmentRoutes = [
    { from: "supplier", to: "hub-02", speed: 0.12 },
    { from: "hub-02", to: "wh-04", speed: 0.1 },
    { from: "wh-01", to: "mission", speed: 0.08 },
  ];

  for (const sr of shipmentRoutes) {
    const fromNode = NODES.find((n) => n.id === sr.from)!;
    const toNode = NODES.find((n) => n.id === sr.to)!;
    const mesh = new THREE.Mesh(shipmentGeo, shipmentMat.clone());
    mesh.position.set(fromNode.x, 0.05, fromNode.z);
    mesh.castShadow = true;
    scene.add(mesh);
    shipments.push({
      mesh,
      fromPos: new THREE.Vector3(fromNode.x, 0.05, fromNode.z),
      toPos: new THREE.Vector3(toNode.x, 0.05, toNode.z),
      speed: sr.speed,
      progress: Math.random(),
      route: ROUTES.find((r) => r.from === sr.from && r.to === sr.to)!,
    });
  }

  // ── CONNECTION PULSE POINTS ──
  const pulsePoints: { mesh: THREE.Mesh; baseScale: number; phase: number }[] =
    [];
  const pulseGeo = new THREE.SphereGeometry(0.04, 8, 8);
  const pulseMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.6,
    emissive: 0x22c55e,
    emissiveIntensity: 0.3,
  });

  // Place pulses at hub and at supplier connection
  const pulsePositions = [
    { x: -0.8, z: 0.2, y: 0.82 },
    { x: -3.2, z: -0.8, y: 0.55 },
  ];
  for (let i = 0; i < pulsePositions.length; i++) {
    const p = pulsePositions[i];
    const mesh = new THREE.Mesh(pulseGeo, pulseMat.clone());
    mesh.position.set(p.x, p.y, p.z);
    scene.add(mesh);
    pulsePoints.push({ mesh, baseScale: 1, phase: i * Math.PI });
  }

  // ── RAYCASTING ──
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredNode: string | null = null;
  let selectedNode: string | null = null;
  let riskHighlighted = false;

  function getNodeScreenPos(nodeId: string): { x: number; y: number } | undefined {
    const entry = nodeMap.get(nodeId);
    if (!entry) return undefined;
    const pos = new THREE.Vector3();
    entry.group.getWorldPosition(pos);
    pos.y += 0.9;
    pos.project(camera);
    const rect = container.getBoundingClientRect();
    return {
      x: ((pos.x + 1) / 2) * rect.width,
      y: ((-pos.y + 1) / 2) * rect.height,
    };
  }

  function highlightRiskPath(active: boolean) {
    riskHighlighted = active;
    for (const rl of routeLines) {
      if (
        active &&
        RISK_PATH.includes(rl.data.from) &&
        RISK_PATH.includes(rl.data.to)
      ) {
        (rl.line.material as THREE.LineBasicMaterial).color.set(0x0a0a0a);
        (rl.line.material as THREE.LineBasicMaterial).opacity = 0.9;
      } else if (active) {
        (rl.line.material as THREE.LineBasicMaterial).opacity = 0.15;
      } else {
        (rl.line.material as THREE.LineBasicMaterial).color.set(
          rl.data.risk ? 0x555555 : 0xc8c3bb
        );
        (rl.line.material as THREE.LineBasicMaterial).opacity = rl.data.risk
          ? 0.6
          : 0.45;
      }
    }

    // Dim non-risk nodes
    for (const [id, entry] of nodeMap) {
      if (active && !RISK_PATH.includes(id)) {
        entry.mainMesh.material = (entry.mainMesh.material as THREE.MeshStandardMaterial).clone();
        (entry.mainMesh.material as THREE.MeshStandardMaterial).opacity = 0.3;
        (entry.mainMesh.material as THREE.MeshStandardMaterial).transparent = true;
      } else {
        // Restore original opacity
        (entry.mainMesh.material as THREE.MeshStandardMaterial).opacity = 1.0;
        (entry.mainMesh.material as THREE.MeshStandardMaterial).transparent = false;
      }
    }
  }

  function onPointerMove(e: PointerEvent) {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allMeshes: THREE.Object3D[] = [];
    for (const [, entry] of nodeMap) {
      entry.group.traverse((child) => {
        if (child instanceof THREE.Mesh) allMeshes.push(child);
      });
    }
    const intersects = raycaster.intersectObjects(allMeshes, false);

    let hitId: string | null = null;
    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !obj.userData?.nodeId) obj = obj.parent;
      if (obj?.userData?.nodeId) hitId = obj.userData.nodeId;
    }

    if (hitId !== hoveredNode) {
      hoveredNode = hitId;
      container.style.cursor = hitId ? "pointer" : "default";
      if (!selectedNode) {
        onNodeHover(hitId, hitId ? getNodeScreenPos(hitId) : undefined);
        // Risk hover on WH-04
        if (hitId === "wh-04") {
          highlightRiskPath(true);
        } else if (!riskHighlighted || hitId !== "wh-04") {
          highlightRiskPath(false);
        }
      }
    }
  }

  function onPointerDown(e: PointerEvent) {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allMeshes: THREE.Object3D[] = [];
    for (const [, entry] of nodeMap) {
      entry.group.traverse((child) => {
        if (child instanceof THREE.Mesh) allMeshes.push(child);
      });
    }
    const intersects = raycaster.intersectObjects(allMeshes, false);

    let hitId: string | null = null;
    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !obj.userData?.nodeId) obj = obj.parent;
      if (obj?.userData?.nodeId) hitId = obj.userData.nodeId;
    }

    if (hitId === selectedNode) {
      selectedNode = null;
      onNodeClick(null);
      highlightRiskPath(false);
    } else if (hitId) {
      selectedNode = hitId;
      onNodeClick(hitId, getNodeScreenPos(hitId));
      if (hitId === "wh-04") highlightRiskPath(true);
      else highlightRiskPath(false);
    } else {
      selectedNode = null;
      onNodeClick(null);
      highlightRiskPath(false);
    }
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);

  // ── PARALLAX ──
  let targetRotY = 0;
  let targetRotX = 0;

  function onMouseMoveParallax(e: MouseEvent) {
    if (prefersReducedMotion) return;
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetRotY = nx * 0.03;
    targetRotX = ny * 0.015;
  }

  container.addEventListener("mousemove", onMouseMoveParallax);

  // ── ANIMATION ──
  let animationId: number;
  let visible = true;
  let lastTime = performance.now();
  let elapsedTotal = 0;

  function animate() {
    animationId = requestAnimationFrame(animate);
    if (!visible) return;

    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    elapsedTotal += delta;
    const elapsed = elapsedTotal;

    if (!prefersReducedMotion) {
      // Parallax
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;

      // Shipments
      for (const s of shipments) {
        s.progress += s.speed * delta;
        if (s.progress > 1) s.progress = 0;
        s.mesh.position.lerpVectors(s.fromPos, s.toPos, s.progress);
      }

      // Pulses
      for (const p of pulsePoints) {
        const scale =
          1 + 0.3 * Math.sin(elapsed * 2 + p.phase);
        p.mesh.scale.setScalar(scale);
        (p.mesh.material as THREE.MeshStandardMaterial).opacity =
          0.4 + 0.3 * Math.sin(elapsed * 2 + p.phase);
      }

      // WH-04 risk ring pulse
      const wh04 = nodeMap.get("wh-04");
      if (wh04) {
        wh04.group.traverse((child) => {
          if (child.userData?.riskRing) {
            (child as THREE.Mesh).scale.setScalar(
              1 + 0.15 * Math.sin(elapsed * 1.5)
            );
          }
        });
      }
    }

    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) {
    animate();
  } else {
    // Static render
    renderer.render(scene, camera);
  }

  // ── VISIBILITY ──
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  function onVisibilityChange() {
    if (document.hidden) {
      visible = false;
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  // ── RESIZE ──
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (prefersReducedMotion || !visible) {
      renderer.render(scene, camera);
    }
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);

  // ── CLEANUP ──
  function dispose() {
    cancelAnimationFrame(animationId);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("mousemove", onMouseMoveParallax);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    observer.disconnect();
    resizeObserver.disconnect();

    // Dispose geometries and materials
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });

    renderer.dispose();
  }

  return { dispose, getNodeScreenPos };
}

// ──────────────────────────────────────────
// DOM OVERLAY: INFO PANEL
// ──────────────────────────────────────────
function InfoPanel({
  node,
  position,
  onClose,
}: {
  node: NodeData | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!node || !position) return null;

  // Clamp panel position within bounds
  let left = position.x + 16;
  let top = position.y - 20;

  // Ensure panel stays within visualization area
  if (panelRef.current) {
    const rect = panelRef.current.getBoundingClientRect();
    const parent = panelRef.current.parentElement?.getBoundingClientRect();
    if (parent) {
      if (left + rect.width > parent.width) left = position.x - rect.width - 16;
      if (top + rect.height > parent.height) top = parent.height - rect.height - 8;
      if (top < 0) top = 8;
      if (left < 0) left = 8;
    }
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`${node.label} information`}
      tabIndex={-1}
      style={{
        position: "absolute",
        left,
        top,
        background: "rgba(247,246,242,0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(226,221,214,0.7)",
        borderRadius: 10,
        padding: "12px 16px",
        minWidth: 160,
        maxWidth: 220,
        zIndex: 20,
        pointerEvents: "auto",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#0A0A0A",
            textTransform: "uppercase",
          }}
        >
          {node.label}
        </span>
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            color: "#6B6B6B",
            padding: "0 2px",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {node.type === "warehouse" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <InfoRow label="Inventory" value={`${node.inventory} units`} />
          <InfoRow label="Coverage" value={node.coverage!} />
          {node.demand && (
            <InfoRow label="Demand" value={node.demand} color="#22c55e" />
          )}
          {node.risk && (
            <InfoRow label="Stockout Risk" value={node.risk} color="#ef4444" />
          )}
        </div>
      )}

      {node.type === "hub" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <InfoRow label="Inbound" value={String(node.inbound)} />
          <InfoRow label="Outbound" value={String(node.outbound)} />
          <InfoRow label="Dependencies" value={`${node.dependencies} nodes`} />
          <InfoRow label="Status" value={node.status!} color="#22c55e" />
        </div>
      )}

      {node.type === "supplier" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <InfoRow label="Type" value="Primary Supplier" />
          <InfoRow label="Status" value="Active" color="#22c55e" />
        </div>
      )}

      {node.type === "destination" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <InfoRow label="Type" value="Operational Site" />
          <InfoRow label="Receives from" value="WH-01, WH-04, WH-07" />
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 11, color: "#6B6B6B" }}>{label}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: color || "#0A0A0A",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ──────────────────────────────────────────
// DOM OVERLAY: LABELS
// ──────────────────────────────────────────
function SceneLabels({
  getScreenPos,
}: {
  getScreenPos: ((id: string) => { x: number; y: number } | undefined) | null;
}) {
  const [positions, setPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const frameRef = useRef<number>(undefined);

  useEffect(() => {
    if (!getScreenPos) return;

    function update() {
      const newMap = new Map<string, { x: number; y: number }>();
      for (const node of NODES) {
        const pos = getScreenPos!(node.id);
        if (pos) newMap.set(node.id, pos);
      }
      setPositions(newMap);
      frameRef.current = requestAnimationFrame(update);
    }

    update();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [getScreenPos]);

  return (
    <>
      {NODES.map((node) => {
        const pos = positions.get(node.id);
        if (!pos) return null;
        return (
          <div
            key={node.id}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y - 8,
              transform: "translate(-50%, -100%)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: node.risk ? "#0A0A0A" : "#6B6B6B",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
              userSelect: "none",
            }}
          >
            {node.label}
          </div>
        );
      })}
    </>
  );
}

// ──────────────────────────────────────────
// DOM OVERLAY: DEMAND FORECAST
// ──────────────────────────────────────────
function DemandForecastOverlay() {
  // Compact inline SVG forecast
  const w = 140;
  const h = 56;
  const pad = 4;

  // Historical + forecast data
  const hist = [28, 32, 30, 35, 38, 40, 42];
  const forecast = [42, 46, 49, 52, 56];
  const uncLow = [42, 43, 44, 43, 40];
  const uncHigh = [42, 49, 55, 62, 72];

  const allValues = [...hist, ...forecast, ...uncLow, ...uncHigh];
  const minV = Math.min(...allValues);
  const maxV = Math.max(...allValues);
  const range = maxV - minV || 1;

  const totalPoints = hist.length + forecast.length - 1;
  const xStep = (w - pad * 2) / (totalPoints - 1);

  function toY(v: number) {
    return h - pad - ((v - minV) / range) * (h - pad * 2);
  }
  function toX(i: number) {
    return pad + i * xStep;
  }

  const histPath = hist
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`)
    .join(" ");

  const fStart = hist.length - 1;
  const forecastPath = forecast
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"}${toX(fStart + i)},${toY(v)}`
    )
    .join(" ");

  // Uncertainty area
  const uncPath =
    `M${toX(fStart)},${toY(uncHigh[0])} ` +
    uncHigh
      .map((v, i) => `L${toX(fStart + i)},${toY(v)}`)
      .join(" ") +
    " " +
    uncLow
      .slice()
      .reverse()
      .map((v, i) => `L${toX(fStart + uncLow.length - 1 - i)},${toY(v)}`)
      .join(" ") +
    " Z";

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        background: "rgba(247,246,242,0.88)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(226,221,214,0.5)",
        borderRadius: 8,
        padding: "8px 10px 6px",
        fontFamily: "'Inter', sans-serif",
        zIndex: 15,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#6B6B6B",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        DEMAND FORECAST
      </div>
      <svg width={w} height={h} style={{ display: "block" }}>
        {/* Uncertainty envelope */}
        <path d={uncPath} fill="rgba(34,197,94,0.08)" />

        {/* Historical line */}
        <path
          d={histPath}
          fill="none"
          stroke="#6B6B6B"
          strokeWidth={1.2}
        />

        {/* Forecast line */}
        <path
          d={forecastPath}
          fill="none"
          stroke="#22c55e"
          strokeWidth={1.2}
        />

        {/* Present point */}
        <circle
          cx={toX(fStart)}
          cy={toY(hist[hist.length - 1])}
          r={2.5}
          fill="#22c55e"
        />
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 3,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: "#22c55e",
          }}
        >
          +18%
        </span>
        <span
          style={{
            fontSize: 8,
            color: "#9B9B9B",
          }}
        >
          87% conf.
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// STOCKOUT RISK BADGE
// ──────────────────────────────────────────
function StockoutRiskBadge() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 6,
        padding: "5px 8px",
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontFamily: "'Inter', sans-serif",
        zIndex: 15,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#ef4444",
        }}
      />
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          color: "#dc2626",
          letterSpacing: "0.02em",
        }}
      >
        STOCKOUT RISK 7.2%
      </span>
    </div>
  );
}

// ──────────────────────────────────────────
// ILLUSTRATIVE MODEL ANNOTATION
// ──────────────────────────────────────────
function IllustrativeAnnotation() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        fontSize: 8,
        color: "#9B9B9B",
        letterSpacing: "0.06em",
        fontFamily: "'Inter', sans-serif",
        zIndex: 15,
        pointerEvents: "none",
        textTransform: "uppercase",
      }}
    >
      Illustrative model
    </div>
  );
}

// ──────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────
export default function OperationalTwin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [getScreenPos, setGetScreenPos] = useState<
    ((id: string) => { x: number; y: number } | undefined) | null
  >(null);
  const disposeRef = useRef<(() => void) | null>(null);

  const handleNodeHover = useCallback(
    (id: string | null, pos?: { x: number; y: number }) => {
      // Only show hover effect if nothing is selected
    },
    []
  );

  const handleNodeClick = useCallback(
    (id: string | null, pos?: { x: number; y: number }) => {
      setSelectedNode(id);
      setPanelPos(pos || null);
    },
    []
  );

  const handleClosePanel = useCallback(() => {
    setSelectedNode(null);
    setPanelPos(null);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Check WebGL
    const gl =
      canvasRef.current.getContext("webgl2") ||
      canvasRef.current.getContext("webgl");
    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    try {
      const result = createScene(
        canvasRef.current,
        containerRef.current,
        handleNodeHover,
        handleNodeClick,
        prefersReducedMotion
      );
      disposeRef.current = result.dispose;
      setGetScreenPos(() => result.getNodeScreenPos);
      setLoaded(true);
    } catch {
      setWebglFailed(true);
    }

    return () => {
      if (disposeRef.current) disposeRef.current();
    };
  }, [handleNodeHover, handleNodeClick]);

  const selectedNodeData = selectedNode
    ? NODES.find((n) => n.id === selectedNode) || null
    : null;

  if (webglFailed) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
          color: "#6B6B6B",
          fontSize: 13,
        }}
        role="img"
        aria-label="Operational logistics network: Supplier connects to HUB-02, which distributes to warehouses WH-01, WH-04, and WH-07, which supply the mission site. WH-04 has a 7.2% stockout risk. Demand forecast shows +18% growth with 87% confidence."
      >
        <FallbackView />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      role="img"
      aria-label="Operational logistics network: Supplier connects to HUB-02, which distributes to warehouses WH-01, WH-04, and WH-07, which supply the mission site. WH-04 has a 7.2% stockout risk. Demand forecast shows +18% growth with 87% confidence."
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Loading preview */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: "2px solid #E2DDD6",
              borderTopColor: "#0A0A0A",
              borderRadius: "50%",
              animation: "spin-slow 1s linear infinite",
            }}
          />
        </div>
      )}

      {/* DOM overlays */}
      {loaded && (
        <>
          <SceneLabels getScreenPos={getScreenPos} />
          <DemandForecastOverlay />
          <StockoutRiskBadge />
          <IllustrativeAnnotation />
          <InfoPanel
            node={selectedNodeData}
            position={panelPos}
            onClose={handleClosePanel}
          />
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────
// SVG FALLBACK
// ──────────────────────────────────────────
function FallbackView() {
  const nodes = [
    { id: "supplier", label: "SUPPLIER", x: 30, y: 100 },
    { id: "hub-02", label: "HUB-02", x: 130, y: 130 },
    { id: "wh-01", label: "WH-01", x: 240, y: 60 },
    { id: "wh-04", label: "WH-04", x: 250, y: 130, risk: true },
    { id: "wh-07", label: "WH-07", x: 230, y: 200 },
    { id: "mission", label: "MISSION", x: 340, y: 140 },
  ];
  const edges = [
    ["supplier", "hub-02"],
    ["hub-02", "wh-01"],
    ["hub-02", "wh-04"],
    ["hub-02", "wh-07"],
    ["wh-01", "mission"],
    ["wh-04", "mission"],
    ["wh-07", "mission"],
  ];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 380 260"
      style={{ opacity: 0.7 }}
    >
      {edges.map(([from, to], i) => {
        const a = nodes.find((n) => n.id === from)!;
        const b = nodes.find((n) => n.id === to)!;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#C8C3BB"
            strokeWidth={1}
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.id === "hub-02" ? 14 : 10}
            fill="white"
            stroke={n.risk ? "#ef4444" : "#C8C3BB"}
            strokeWidth={1.5}
          />
          <text
            x={n.x}
            y={n.y + 24}
            textAnchor="middle"
            fontSize={8}
            fill="#6B6B6B"
            fontWeight={600}
          >
            {n.label}
          </text>
        </g>
      ))}
      <text x={290} y={22} fontSize={7} fill="#6B6B6B" fontWeight={700}>
        DEMAND FORECAST
      </text>
      <text x={290} y={34} fontSize={9} fill="#22c55e" fontWeight={600}>
        +18% · 87% conf.
      </text>
    </svg>
  );
}
