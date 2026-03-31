import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  CloudRain, Clock, Calendar, MonitorPlay, Cpu, Activity, 
  Video, TrendingUp, User, Sparkles, AlertTriangle, Lightbulb, X, LayoutGrid,
  Maximize, Minimize, ChevronRight, ChevronDown, Building2, Monitor, Network, Share2,
  Send, MessageSquare, Bot
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Mock Data ---

const trendData = {
  '2weeks': Array.from({length: 14}, (_, i) => ({ name: `第${i+1}天`, 时长: Math.floor(Math.random() * 50 + 20) })),
  '1month': Array.from({length: 30}, (_, i) => ({ name: `${i+1}日`, 时长: Math.floor(Math.random() * 60 + 30) })),
  '3months': Array.from({length: 12}, (_, i) => ({ name: `第${i+1}周`, 时长: Math.floor(Math.random() * 300 + 100) })),
  '6months': Array.from({length: 6}, (_, i) => ({ name: `${i+1}月`, 时长: Math.floor(Math.random() * 1200 + 500) })),
  '1year': Array.from({length: 12}, (_, i) => ({ name: `${i+1}月`, 时长: Math.floor(Math.random() * 1500 + 600) })),
};

const heatmapData = [
  { id: 1, name: '物联网综合实训室', asset: 'A栋-101', agents: 45, online: true, duration: '12h 30m' },
  { id: 2, name: 'AI基础实验室', asset: 'A栋-102', agents: 32, online: true, duration: '8h 15m' },
  { id: 3, name: '工业互联网中心', asset: 'B栋-201', agents: 60, online: true, duration: '24h 00m' },
  { id: 4, name: '大数据分析实训室', asset: 'B栋-202', agents: 40, online: false, duration: '0h 00m' },
  { id: 5, name: '云计算网络实验室', asset: 'C栋-301', agents: 55, online: true, duration: '5h 45m' },
  { id: 6, name: '网络安全实训室', asset: 'C栋-302', agents: 30, online: true, duration: '18h 20m' },
  { id: 7, name: '智慧农业大棚', asset: 'D栋-101', agents: 25, online: false, duration: '0h 00m' },
  { id: 8, name: '智能制造车间', asset: 'D栋-102', agents: 80, online: true, duration: '48h 10m' },
];

const labImages: Record<string, string> = {
  '物联网综合实训室': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  'AI基础实验室': 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80',
  '工业互联网中心': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  '大数据分析实训室': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  '云计算网络实验室': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
  '网络安全实训室': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  '智慧农业大棚': 'https://images.unsplash.com/photo-1530836369250-ef71a3a5e4bf?auto=format&fit=crop&w=800&q=80',
  '智能制造车间': 'https://images.unsplash.com/photo-1565439390118-c22456d151f4?auto=format&fit=crop&w=800&q=80',
};

// --- New Asset Tree and Devices Data ---
const assets = [
  { id: 'A', name: 'A栋教学楼', labs: [{ id: 'L1', name: '物联网综合实训室', short: '物联网' }, { id: 'L2', name: 'AI基础实验室', short: 'AI基础' }] },
  { id: 'B', name: 'B栋实训楼', labs: [{ id: 'L3', name: '工业互联网中心', short: '工业网' }, { id: 'L4', name: '大数据分析实训室', short: '大数据' }] },
  { id: 'C', name: 'C栋实验楼', labs: [{ id: 'L5', name: '云计算网络实验室', short: '云计算' }, { id: 'L6', name: '网络安全实训室', short: '网络安全' }] },
  { id: 'D', name: 'D栋创新楼', labs: [{ id: 'L7', name: '智慧农业大棚', short: '智慧农业' }, { id: 'L8', name: '智能制造车间', short: '智能制造' }] },
];

const agentNames = ['物联网中心网关', '有人DTU', '研华网关', 'Lora终端', '人工智能前端设备', '植物工厂', '大象机械臂'];
const allDevices: any[] = [];
assets.forEach(asset => {
  asset.labs.forEach(lab => {
    const count = Math.floor(Math.random() * 20) + 15; // 15-35 devices per lab
    for (let i = 1; i <= count; i++) {
      const rand = Math.random();
      const status = rand > 0.15 ? 'online' : (rand > 0.05 ? 'offline' : 'abnormal');
      const agentName = agentNames[Math.floor(Math.random() * agentNames.length)];
      allDevices.push({
        id: `${lab.id}-${i}`,
        name: `${agentName}-${String(i).padStart(2, '0')}`,
        assetId: asset.id,
        assetName: asset.name,
        labId: lab.id,
        labName: lab.name,
        status: status,
        ip: `192.168.${Math.floor(Math.random() * 20) + 1}.${Math.floor(Math.random() * 255)}`
      });
    }
  });
});

const agentRankData = [
  { name: '物联网中心网关', duration: 340 },
  { name: '人工智能前端设备', duration: 315 },
  { name: '研华网关', duration: 290 },
  { name: '有人DTU', duration: 260 },
  { name: '大象机械臂', duration: 210 },
  { name: 'Lora终端', duration: 180 },
  { name: '植物工厂', duration: 150 },
];

const labRankData = [
  { name: '智能制造车间', asset: 'D栋-102', duration: 1250 },
  { name: '工业互联网中心', asset: 'B栋-201', duration: 980 },
  { name: '物联网综合实训室', asset: 'A栋-101', duration: 850 },
  { name: 'AI基础实验室', asset: 'A栋-102', duration: 620 },
  { name: '网络安全实训室', asset: 'C栋-302', duration: 450 },
];

const userRankData = [
  { name: '张伟', class: '计科2301', duration: 120 },
  { name: '李娜', class: '软工2302', duration: 105 },
  { name: '王强', class: '物联网2301', duration: 98 },
  { name: '赵敏', class: 'AI2301', duration: 85 },
  { name: '陈杰', class: '计科2302', duration: 72 },
];

const spatialHeatmapData = [
  [0, 0, 0.6, 0.8, 0.5, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0.3, 0.3, 0, 0, 0],
  [0, 0, 0, 0.6, 0.8, 0.5, 0.5, 0.5, 0.5, 0.3, 0, 0, 0.1, 0.1, 0, 0, 0],
  [0, 0, 0.6, 0.6, 0.8, 0.6, 0.6, 0.5, 0.5, 0.3, 0.5, 0, 0, 0.1, 0.6, 0.6, 0],
  [0, 0, 0, 0.6, 0.6, 0.6, 0.8, 0.5, 0.5, 0.3, 0.5, 0.3, 0, 0, 0, 0.3, 0.3],
  [0, 0, 0.4, 0.6, 0.4, 0.4, 0.8, 0.8, 0.8, 0.3, 0.4, 0.4, 0.8, 0, 0, 0, 0],
  [0, 0, 0.4, 0.4, 2.5, 0.4, 0.4, 2.5, 2.5, 2.5, 0.8, 0.8, 0.8, 0, 0, 0, 0],
  [0, 0, 0.4, 0.4, 0.4, 0.4, 0.8, 2.5, 2.5, 0.8, 0.6, 0.6, 0.6, 0.1, 0, 0, 0],
  [0, 0, 0.1, 0.1, 0.4, 0.4, 0.8, 2.5, 2.5, 0.8, 0.3, 0.3, 0.8, 0.1, 0, 0, 0],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 1.2, 2.5, 1.2, 2.5, 2.5, 0.8, 0.8, 0.3, 0.8, 0.3, 0.3, 0.3],
  [0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 1.2, 1.2, 0.8, 0.8, 0.8, 2.5, 0.8, 0.8, 0.8, 0.6, 0.3, 0.3],
  [0, 0.1, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.2, 0.8, 0.8, 0.6, 2.5, 2.5, 0.6, 0.6, 0.3, 0.3],
  [0, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.1, 1.2, 0.5, 0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.3, 0.1],
  [0, 0, 0.1, 0.1, 0.1, 0.2, 0.3, 1.2, 0.1, 0.3, 0.3, 0.6, 0.6, 0.2, 0.2, 0.2, 0.2, 0.1],
  [0, 0, 0.1, 0.1, 0.1, 0.1, 0.5, 1.2, 0.1, 0.3, 0.3, 0.5, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0, 0, 0, 0.1, 0.1, 0.1, 0.5, 0.6, 2.5, 0.2, 0.2, 0.5, 0.5, 0.3, 0.3, 0.3, 0.3, 0.1, 0.1],
  [0, 0, 0, 0.1, 0.1, 0.1, 1.8, 0.8, 1.3, 0.5, 0.5, 0.3, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
  [0, 0, 0, 0, 0.3, 0.2, 0.4, 0.1, 0.3, 0.2, 1.2, 0.5, 0.1, 0.1, 0.1, 0.1, 0, 0, 0],
  [0, 0, 0, 0.1, 0.1, 0.1, 0.9, 0.8, 0.6, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0.1, 0.4, 0.8, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const aiSuggestions = [
  { type: 'warning', title: '热度爆满预警', desc: '智能制造车间本周使用率达 98%，建议加大设备投入或优化排课机制。' },
  { type: 'suggestion', title: '闲置资源提醒', desc: '智慧农业大棚已连续 2 天未被使用，请核实设备状态或安排实训任务。' },
  { type: 'suggestion', title: '维护建议', desc: '物联网中心网关连续高负载运行超 300 小时，建议安排例行检查。' },
];

const labUsageBarData = [
  { name: 'A栋', 使用中: 2, 未使用: 0 },
  { name: 'B栋', 使用中: 1, 未使用: 1 },
  { name: 'C栋', 使用中: 2, 未使用: 0 },
  { name: 'D栋', 使用中: 1, 未使用: 1 },
];

const deviceStatusPieData = [
  { name: '在线', value: 1062 },
  { name: '离线', value: 150 },
  { name: '异常', value: 38 },
];

const PIE_COLORS = {
  usage: ['#9333ea', '#f1f5f9'],
  status: ['#10b981', '#94a3b8', '#ef4444'],
};

// --- Network Graph Component ---
function NetworkGraph({ devices, assets }: { devices: any[], assets: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Clear previous
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.0018);
    
    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(0, 80, 200);
    
    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent to blend with UI
    container.appendChild(renderer.domElement);
    
    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.15;
    controls.maxDistance = 500;
    controls.minDistance = 30;
    
    // 5. Data structures and Geometry Layout
    const nodesData: any[] = [];
    const linksData: any[] = [];
    
    // Root Node (School)
    const rootPos = new THREE.Vector3(0, 0, 0);
    const rootOnline = devices.filter(d => d.status === 'online').length;
    nodesData.push({ id: 'root', type: 'root', pos: rootPos, name: '新大陆科技大学', color: 0xc084fc, size: 16, onlineCount: rootOnline, totalCount: devices.length });
    
    const R_ASSET = 70;
    const R_LAB = 30;
    const R_DEVICE = 12;
    
    assets.forEach((asset, i) => {
      const assetAngle = (i / assets.length) * Math.PI * 2;
      const assetY = Math.sin(assetAngle * 3) * 10; // Wavy orbit
      const assetPos = new THREE.Vector3(
        rootPos.x + Math.cos(assetAngle) * R_ASSET,
        rootPos.y + assetY,
        rootPos.z + Math.sin(assetAngle) * R_ASSET
      );
      nodesData.push({ id: asset.id, type: 'asset', pos: assetPos, name: asset.name, color: 0x9333ea, size: 10 });
      linksData.push({ source: rootPos, target: assetPos, color: 0x9333ea });
      
      asset.labs.forEach((lab: any, j: number) => {
        const labAngle = (j / asset.labs.length) * Math.PI * 2;
        const labPos = new THREE.Vector3(
          assetPos.x + Math.cos(labAngle) * R_LAB,
          assetPos.y + (Math.random() - 0.5) * 5,
          assetPos.z + Math.sin(labAngle) * R_LAB
        );
        nodesData.push({ id: lab.id, type: 'lab', pos: labPos, name: lab.name, color: 0x8b5cf6, size: 7 });
        linksData.push({ source: assetPos, target: labPos, color: 0x8b5cf6 });
        
        let labDevices = devices.filter(d => d.labId === lab.id);
        if (labDevices.length > 25) labDevices = labDevices.slice(0, 25); // Cap visual density
        
        labDevices.forEach((device, k) => {
          // Fibonacci sphere distribution for devices around lab
          const phi = Math.acos(1 - 2 * (k + 0.5) / labDevices.length);
          const theta = Math.PI * (1 + Math.sqrt(5)) * k;
          
          const devPos = new THREE.Vector3(
            labPos.x + R_DEVICE * Math.cos(theta) * Math.sin(phi),
            labPos.y + R_DEVICE * Math.sin(theta) * Math.sin(phi),
            labPos.z + R_DEVICE * Math.cos(phi)
          );
          
          let color = 0x94a3b8; // offline
          if (device.status === 'online') color = 0x10b981; // emerald
          if (device.status === 'abnormal') color = 0xef4444; // red
          
          nodesData.push({ 
            id: device.id, type: 'device', pos: devPos, name: device.name, 
            status: device.status, color, size: 3,
            assetName: device.assetName, labName: device.labName, ip: device.ip
          });
          linksData.push({ source: labPos, target: devPos, color: color });
        });
      });
    });
    
    // 6. Create Meshes
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);
    
    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);
    const meshes: THREE.Mesh[] = [];
    
    nodesData.forEach(nd => {
      const mat = new THREE.MeshStandardMaterial({ 
        color: nd.color, 
        emissive: nd.color,
        emissiveIntensity: nd.type === 'device' ? 0.6 : 0.3,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.copy(nd.pos);
      mesh.scale.setScalar(nd.size);
      mesh.userData = nd;
      
      // Randomize float phase
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.floatSpeed = 0.5 + Math.random() * 1.5;
      mesh.userData.baseY = nd.pos.y;
      
      nodeGroup.add(mesh);
      meshes.push(mesh);
      
      // Add glow to root and online/abnormal devices
      if (nd.type === 'root' || (nd.type === 'device' && nd.status !== 'offline')) {
        const glowGeo = new THREE.SphereGeometry(1.4, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({ 
          color: nd.color, 
          transparent: true, 
          opacity: nd.type === 'root' ? 0.2 : 0.4, 
          blending: THREE.AdditiveBlending 
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        mesh.add(glowMesh);
      }
      
      // Add text label for root, asset, and lab nodes
      if (nd.type !== 'device') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const label = nd.type === 'root' ? `${nd.name} (${nd.onlineCount}/${nd.totalCount})` : nd.name;
        const fontSize = nd.type === 'root' ? 48 : nd.type === 'asset' ? 40 : 32;
        canvas.width = 512;
        canvas.height = 128;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // White text with subtle shadow
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        const spriteScale = nd.type === 'root' ? 30 : nd.type === 'asset' ? 22 : 18;
        sprite.scale.set(spriteScale, spriteScale * 0.25, 1);
        sprite.position.y = nd.size + 3; // Float above the sphere
        mesh.add(sprite);
      }
    });
    
    // 7. Create Lines
    const linesMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4 });
    const lineGeo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    
    const colorObj = new THREE.Color();
    linksData.forEach(ld => {
      positions.push(ld.source.x, ld.source.y, ld.source.z);
      positions.push(ld.target.x, ld.target.y, ld.target.z);
      
      colorObj.setHex(ld.color);
      colors.push(colorObj.r, colorObj.g, colorObj.b);
      colors.push(colorObj.r, colorObj.g, colorObj.b);
    });
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const lines = new THREE.LineSegments(lineGeo, linesMat);
    scene.add(lines);
    
    // 8. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const mainLight = new THREE.PointLight(0xc084fc, 800, 800); // adjust intensity and decay
    mainLight.position.set(0, 50, 0);
    scene.add(mainLight);
    
    // 9. Base Grid
    const grid = new THREE.GridHelper(300, 20, 0x475569, 0x1e293b);
    grid.position.y = -60;
    grid.material.transparent = true;
    grid.material.opacity = 0.2;
    scene.add(grid);
    
    // 10. Interaction (Raycaster)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;
    
    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      // We only want to intersect the nodes, not lines or grid
      const intersects = raycaster.intersectObjects(meshes);
      
      if (intersects.length > 0) {
        const body = intersects[0].object as THREE.Mesh;
        if (hoveredMesh !== body) {
          if (hoveredMesh) {
            (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = hoveredMesh.userData.type === 'device' ? 0.6 : 0.3;
            hoveredMesh.scale.setScalar(hoveredMesh.userData.size);
          }
          hoveredMesh = body;
          (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0; // Highlight strongly
          hoveredMesh.scale.setScalar(hoveredMesh.userData.size * 1.3); // Pop out
          
          setHoveredNode(hoveredMesh.userData);
          container.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMesh) {
          (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = hoveredMesh.userData.type === 'device' ? 0.6 : 0.3;
          hoveredMesh.scale.setScalar(hoveredMesh.userData.size);
          hoveredMesh = null;
          setHoveredNode(null);
          container.style.cursor = '';
        }
      }
    };
    container.addEventListener('mousemove', onMouseMove);
    
    // 11. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      controls.update();
      
      // Floating animation for all nodes
      meshes.forEach((m) => {
        m.position.y = m.userData.baseY + Math.sin(time * m.userData.floatSpeed + m.userData.floatOffset) * 2;
      });
      
      renderer.render(scene, camera);
    };
    animate();
    
    // 12. Resize handler
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      sphereGeo.dispose();
      lineGeo.dispose();
      linesMat.dispose();
      if (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [devices, assets]);

  return (
    <div className="w-full h-full relative bg-slate-900 rounded-xl overflow-hidden shadow-inner flex flex-col group">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      
      {/* HUD Info */}
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <h3 className="text-white font-bold tracking-widest flex items-center gap-2 drop-shadow-md">
          <Network className="w-5 h-5 text-purple-400" /> WebGL 终端星系态势感知
        </h3>
        <p className="text-slate-400 text-[11px] mt-1 font-medium bg-slate-900/50 px-2 py-0.5 rounded backdrop-blur-sm w-fit border border-white/5">
           🖱️ 支持鼠标拖拽旋转、滚轮缩放。悬停节点查看链路详情。
        </p>
      </div>
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] text-slate-300 shadow-lg space-y-2 z-10 pointer-events-none">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></div><span className="font-medium">管理节点</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div><span className="font-medium">在线终端</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400 shadow-[0_0_8px_#94a3b8]"></div><span className="font-medium">离线终端</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div><span className="font-medium">异常告警</span></div>
      </div>
      
      {/* Dynamic Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 p-4 rounded-2xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.5)] pointer-events-none text-white min-w-[240px] z-50"
          >
            <div className="text-[10px] text-purple-300 font-bold mb-1 uppercase tracking-wider flex items-center gap-1.5 opacity-90">
              { hoveredNode.type === 'root' ? <Building2 className="w-3.5 h-3.5"/> :
                hoveredNode.type === 'asset' ? <Building2 className="w-3.5 h-3.5"/> :
                hoveredNode.type === 'lab' ? <MonitorPlay className="w-3.5 h-3.5"/> : <Cpu className="w-3.5 h-3.5"/> }
              { hoveredNode.type === 'root' ? '🏫 学校主节点' :
                hoveredNode.type === 'asset' ? '🏢 资产大楼' :
                hoveredNode.type === 'lab' ? '🔬 实训室节点' : '🖥️ 智能终端设备'
              }
            </div>
            
            <div className="text-lg font-bold mb-3 border-b border-white/10 pb-2">{hoveredNode.name}</div>
            
            {hoveredNode.type === 'root' && (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-300 gap-6"><span>总设备数:</span><span className="font-bold text-white font-mono">{hoveredNode.totalCount}</span></div>
                <div className="flex justify-between text-slate-300 gap-6"><span>在线设备:</span><span className="font-bold text-emerald-400 font-mono">{hoveredNode.onlineCount}</span></div>
              </div>
            )}
            
            {hoveredNode.type === 'device' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300 gap-6">
                  <span>归属实训室:</span><span className="font-medium text-white">{hoveredNode.labName}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300 gap-6">
                  <span>网络分配 IP:</span><span className="font-mono text-cyan-300">{hoveredNode.ip}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">实时连接状态:</span>
                  <span className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded-full",
                    hoveredNode.status === 'online' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : 
                    hoveredNode.status === 'abnormal' ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                  )}>
                    {hoveredNode.status === 'online' ? '🟢 运行正常' : hoveredNode.status === 'abnormal' ? '🔴 异常告警' : '⚫ 已离线'}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OperationDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [time, setTime] = useState(new Date());
  const [activeLabs, setActiveLabs] = useState(heatmapData.slice(0, 4).map(l => l.name));
  const [trendRange, setTrendRange] = useState<'2weeks'|'1month'|'3months'|'6months'|'1year'>('1month');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'heatmap' | 'network'>('heatmap');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'assistant', content: '您好！我是实训室智能助手。您可以问我关于实训室运营、设备状态或学生实训情况的问题。' }
  ]);

  const defaultPrompts = [
    '分析物联网实训室运营情况',
    '汇总全校所有实训室最近半年的使用情况',
    '哪位同学实训时长最长'
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessages = [...chatMessages, { role: 'user', content: text }];
    setChatMessages(newMessages);
    setChatInput('');

    // Mock AI Response
    setTimeout(() => {
      let response = "正在为您分析数据，请稍候...";
      if (text.includes('物联网')) {
        response = "物联网综合实训室目前运行状态良好。本周使用率达到 85%，主要集中在下午 2 点至 5 点。设备在线率 98%，有 1 台网关设备建议进行例行维护。";
      } else if (text.includes('半年')) {
        response = "全校实训室近半年使用情况汇总：总实训时长达 12,500 小时，同比增长 15%。其中智能制造车间和工业互联网中心热度最高。建议在下学期增加 B 栋实训楼的排课容量。";
      } else if (text.includes('最长')) {
        response = "本学期实训时长最长的同学是：计科 2301 班的 **张伟**，累计实训时长已达 **120 小时**。紧随其后的是软工 2302 班的李娜（105 小时）。";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  // Tree & Heatmap State
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['A', 'B', 'C', 'D']);
  const [selectedNode, setSelectedNode] = useState<{type: 'all'|'asset'|'lab', id: string}>({type: 'all', id: 'all'});

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-switch lab monitoring feeds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLabs(current => {
        const nextLabs = [...current];
        // Shift the first one to the end and pick the next one from heatmapData
        const lastLabName = nextLabs[nextLabs.length - 1];
        const lastIndex = heatmapData.findIndex(lab => lab.name === lastLabName);
        const nextIndex = (lastIndex + 1) % heatmapData.length;
        
        // Simple rotation: remove first, add next
        return [...nextLabs.slice(1), heatmapData[nextIndex].name];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      dashboardRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${year}年${month}月${day}日 星期${week}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour12: false });
  };

  const getHeatColor = (status: string) => {
    if (status === 'online') return 'rgba(147, 51, 234, 0.9)'; // Purple-600
    if (status === 'abnormal') return 'rgba(239, 68, 68, 0.9)'; // Red-500
    return 'rgba(243, 232, 255, 1)'; // Purple-100 (Offline)
  };

  const getHeatTextColor = (status: string) => {
    if (status === 'online' || status === 'abnormal') return '#ffffff';
    return '#a855f7'; // Purple-500
  };

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);
  };

  const displayedDevices = useMemo(() => {
    if (selectedNode.type === 'all') return allDevices;
    if (selectedNode.type === 'asset') return allDevices.filter(d => d.assetId === selectedNode.id);
    if (selectedNode.type === 'lab') return allDevices.filter(d => d.labId === selectedNode.id);
    return allDevices;
  }, [selectedNode]);

  const stats = useMemo(() => {
    const total = displayedDevices.length;
    const online = displayedDevices.filter(d => d.status === 'online').length;
    const offline = displayedDevices.filter(d => d.status === 'offline').length;
    const abnormal = displayedDevices.filter(d => d.status === 'abnormal').length;
    return { total, online, offline, abnormal };
  }, [displayedDevices]);

  return (
    <div 
      ref={dashboardRef}
      className={cn(
        "bg-white text-slate-900 font-sans overflow-y-auto overflow-x-hidden transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-[100] p-6" : "flex-1 min-h-screen p-8"
      )}
    >
      <div className="max-w-[1800px] mx-auto min-h-full flex flex-col gap-6 relative z-10">
        
        {/* --- Top Header --- */}
        <header className="flex items-center justify-between bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
          {/* Left: Weather & Time */}
          <div className="flex items-center gap-6 w-1/3">
            <div className="flex items-center gap-2 text-slate-600">
              <CloudRain className="w-5 h-5 text-blue-500" />
              <span className="font-medium">24°C 多云</span>
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">{formatDate(time)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-mono font-bold tracking-wider">{formatTime(time)}</span>
            </div>
          </div>

          {/* Center: Title */}
          <div className="w-1/3 text-center">
            <h1 className="text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#E85D3A] via-[#F5A623] to-[#4A90D9] drop-shadow-sm font-display">
              UUSIMA 智慧运营中心
            </h1>
          </div>

          {/* Right: Stats & Fullscreen */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><MonitorPlay className="w-3 h-3 text-purple-500"/> 实训室总数</span>
              <span className="text-xl font-bold text-slate-800 font-mono">42</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Cpu className="w-3 h-3 text-indigo-500"/> 智能体终端</span>
              <span className="text-xl font-bold text-slate-800 font-mono">1,250</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3 text-emerald-500"/> 当前使用中</span>
              <span className="text-xl font-bold text-emerald-600 font-mono">18</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <button 
              onClick={toggleFullscreen}
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
              title={isFullscreen ? "退出全屏" : "全屏展示"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* --- Middle Section --- */}
        <div className="flex gap-6 h-[520px] shrink-0">
          
          {/* Left: Lab Usage Analysis */}
          <div className="w-[400px] bg-white border border-purple-100 rounded-2xl p-6 flex flex-col shadow-sm relative overflow-hidden shrink-0">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-7 h-7 text-purple-600" /> 实训室使用分析
            </h2>
            <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar">
              {/* Lab Usage Ratio (Stacked Bar Chart) */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-bold text-slate-600 mb-2 self-start">实训室使用比例 (按资产)</h3>
                <div className="w-full h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={labUsageBarData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <RechartsTooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                      <Bar dataKey="使用中" stackId="a" fill="#9333ea" radius={[0, 0, 0, 0]} barSize={24} />
                      <Bar dataKey="未使用" stackId="a" fill="#f1f5f9" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Terminal Online Ratio */}
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-bold text-slate-600 mb-2 self-start">终端在线比例</h3>
                <div className="w-full h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceStatusPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceStatusPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS.status[index % PIE_COLORS.status.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Video Feed (4-Screen Grid) */}
          <div className="flex-1 bg-white border border-purple-100 rounded-2xl p-5 flex flex-col shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" /> 实时监控画面 (多路)
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                实时推流中
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 min-h-0">
              {activeLabs.map((labName, idx) => (
                <div key={idx} className="bg-slate-900 rounded-xl border border-slate-200 relative overflow-hidden group shadow-inner h-full w-full">
                  <img 
                    src={labImages[labName] || `https://picsum.photos/seed/${labName}/400/200`} 
                    alt={`Lab Feed ${idx + 1}`} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity absolute inset-0" 
                  />
                  
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[8px] font-mono rounded shadow-sm">
                      CAM-{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="px-1.5 py-0.5 bg-purple-600/80 backdrop-blur-sm text-white text-[8px] font-bold rounded shadow-sm truncate max-w-[80px]">
                      {labName}
                    </span>
                  </div>

                  {/* AI Detection Box (Randomly on some) */}
                  {idx % 2 === 0 && (
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-emerald-400/60 bg-emerald-400/5 flex items-start p-0.5 rounded-sm">
                      <span className="bg-emerald-500 text-white text-[6px] px-1 py-0.2 rounded shadow-sm">正常</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Trend Chart */}
          <div className="w-1/4 bg-white border border-purple-100 rounded-2xl p-5 flex flex-col shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" /> 平均使用趋势
              </h2>
              <select 
                value={trendRange}
                onChange={(e: any) => setTrendRange(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium shadow-sm"
              >
                <option value="2weeks">近2周</option>
                <option value="1month">近1个月</option>
                <option value="3months">近3个月</option>
                <option value="6months">近半年</option>
                <option value="1year">近1年</option>
              </select>
            </div>
            <div className="flex-1 w-full relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 tracking-widest font-medium">使用时长 (小时)</div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData[trendRange]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#9333ea', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="时长" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorDuration)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- Middle Section (Device Online Status) --- */}
        <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm flex flex-col flex-1 min-h-[500px]">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4 shrink-0">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-purple-600" /> 终端设备在线状态
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-2 rounded-sm bg-purple-600 shadow-sm relative">
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-400" />
                </div> 
                在线 ({stats.online})
              </div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-2 rounded-sm bg-purple-100 border border-purple-200 shadow-sm"></div> 离线 ({stats.offline})</div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-2 rounded-sm bg-red-500 shadow-sm"></div> 异常 ({stats.abnormal})</div>
            </div>
          </div>
          
          <div className="flex-1 flex gap-5 min-h-0 pt-2 pb-4">
            {/* 左侧：楼房热力图 */}
            <div className="w-[60%] overflow-auto flex flex-col shrink-0">
                <div className="flex-1 bg-gradient-to-b from-slate-50/80 to-white rounded-xl overflow-auto relative border border-purple-100 shadow-inner">
                  {/* 背景网格 */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
                    backgroundImage: `linear-gradient(#f3e8ff 1px, transparent 1px), linear-gradient(90deg, #f3e8ff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }}></div>
                  {/* 地面线 */}
                  <div className="absolute bottom-[52px] left-6 right-6 h-px bg-slate-300/50 pointer-events-none z-[1]"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-stone-100/90 via-stone-50/50 to-transparent pointer-events-none rounded-b-xl z-[1]"></div>

                  {/* 楼房天际线 */}
                  <div className="relative z-10 flex gap-8 items-end justify-center px-8 pb-14 pt-6 min-h-full">
                    {assets.map((asset, assetIdx) => {
                      const assetDevices = allDevices.filter(d => d.assetId === asset.id);
                      const onlineCount = assetDevices.filter(d => d.status === 'online').length;
                      const totalCount = assetDevices.length;
                      const onlineRate = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
                      const styles = [
                        { gradient: 'from-[#E85D3A] to-[#F5A623]', bc: '#E85D3A' },
                        { gradient: 'from-[#4A90D9] to-[#6366f1]', bc: '#4A90D9' },
                        { gradient: 'from-[#27AE60] to-[#10b981]', bc: '#27AE60' },
                        { gradient: 'from-[#F5A623] to-[#E85D3A]', bc: '#F5A623' },
                      ];
                      const s = styles[assetIdx % styles.length];

                      return (
                        <motion.div key={asset.id} className="flex flex-col items-center"
                          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: assetIdx * 0.12, ease: 'easeOut' }}>
                          <div className="relative group/building w-[220px]">
                            {/* 天线 */}
                            <div className="flex justify-center mb-[-1px]"><div className="w-px h-4 bg-slate-300"></div></div>
                            <div className="flex justify-center mb-[-1px]"><div className="w-6 h-1 bg-slate-300 rounded-t"></div></div>
                            {/* 屋顶 */}
                            <div className={cn("bg-gradient-to-r text-white px-4 py-3 rounded-t-xl text-center relative overflow-hidden shadow-lg", s.gradient)}>
                              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, white 10px, white 11px)` }}></div>
                              <Building2 className="w-5 h-5 mx-auto mb-1 opacity-80 relative z-10" />
                              <div className="text-sm font-black tracking-wide relative z-10">{asset.name}</div>
                              <div className="text-[10px] opacity-80 font-medium mt-0.5 relative z-10">{onlineCount}/{totalCount} 在线 · {onlineRate}%</div>
                            </div>
                            {/* 楼体（实训室楼层） */}
                            <div className="bg-white shadow-md" style={{ borderLeft: `2px solid ${s.bc}30`, borderRight: `2px solid ${s.bc}30` }}>
                              {asset.labs.map((lab, labIdx) => {
                                const labDevices = allDevices.filter(d => d.labId === lab.id);
                                const labOnline = labDevices.filter(d => d.status === 'online').length;
                                return (
                                  <div key={lab.id} className={cn("px-3 py-3 relative", labIdx > 0 && "border-t border-slate-200")}>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <div className="w-1 h-4 rounded-full" style={{ backgroundColor: `${s.bc}60` }}></div>
                                      <Monitor className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="text-[11px] font-bold text-slate-700 truncate">{lab.short}</span>
                                      <span className="text-[9px] text-slate-400 ml-auto whitespace-nowrap font-medium">{labOnline}/{labDevices.length}</span>
                                    </div>
                                    <div className="grid grid-cols-6 gap-[3px]">
                                      {labDevices.map(device => (
                                        <div key={device.id}
                                          className="aspect-square rounded-[3px] flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-[1.35] hover:z-20 relative group/cell shadow-sm"
                                          style={{ backgroundColor: getHeatColor(device.status) }}>
                                          {device.status === 'online' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />}
                                          {device.status === 'abnormal' && <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />}
                                          {/* Tooltip */}
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2.5 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover/cell:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all scale-90 group-hover/cell:scale-100 shadow-2xl border border-slate-700">
                                            <div className="font-bold text-[11px] mb-1.5 text-purple-300 border-b border-slate-700 pb-1">{device.name}</div>
                                            <div className="space-y-1 min-w-[120px]">
                                              <div className="flex justify-between gap-3"><span className="text-slate-400">实训室:</span><span className="font-medium">{device.labName}</span></div>
                                              <div className="flex justify-between gap-3"><span className="text-slate-400">IP:</span><span className="font-mono text-cyan-300">{device.ip}</span></div>
                                              <div className="flex justify-between gap-3 pt-1 border-t border-slate-700">
                                                <span className="text-slate-400">状态:</span>
                                                <span className={cn("font-bold", device.status === 'online' ? "text-emerald-400" : device.status === 'abnormal' ? "text-red-400" : "text-slate-400")}>
                                                  {device.status === 'online' ? '在线' : device.status === 'abnormal' ? '异常' : '离线'}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {/* 地基 */}
                            <div className="h-2.5 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-lg shadow-md"></div>
                            <div className="mx-4 h-2 bg-slate-900/5 rounded-[100%] blur-sm -mt-1"></div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* 图例 */}
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-xl border border-purple-100 text-[10px] text-slate-600 shadow-lg space-y-2 z-20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-md bg-purple-600 relative"><div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-400" /></div>
                      <span>在线设备</span>
                    </div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-purple-100 border border-purple-200"></div><span>离线设备</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-md bg-red-500"></div><span>异常告警</span></div>
                  </div>
                </div>
            </div>
            {/* 右侧：网状视图 */}
            <div className="flex-1 min-w-0 flex flex-col">
              <NetworkGraph devices={allDevices} assets={assets} />
            </div>
          </div>
        </div>

        {/* --- Bottom Section (Rankings) --- */}
        <div className="flex gap-6 min-h-[320px] shrink-0">
          
          {/* Left: Agent Ranking */}
          <div className="w-1/3 bg-white border border-purple-100 rounded-2xl p-6 flex flex-col shadow-sm relative overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-indigo-500" /> 硬件智能体时长排行
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="pb-3 font-medium w-12 text-center">排名</th>
                    <th className="pb-3 font-medium">智能体名称</th>
                    <th className="pb-3 font-medium text-right">时长 (h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {agentRankData.map((item, i) => (
                    <tr key={item.name} className="hover:bg-purple-50/50 transition-colors group">
                      <td className="py-4 text-center">
                        <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold", 
                          i === 0 ? "bg-amber-100 text-amber-600 shadow-sm" : 
                          i === 1 ? "bg-slate-100 text-slate-600 shadow-sm" : 
                          i === 2 ? "bg-orange-100 text-orange-600 shadow-sm" : "text-slate-400")}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-slate-700">{item.name}</td>
                      <td className="py-4 text-right font-mono font-bold text-indigo-600">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Center: Lab Ranking */}
          <div className="w-1/3 bg-white border border-purple-100 rounded-2xl p-6 flex flex-col shadow-sm relative overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <MonitorPlay className="w-6 h-6 text-purple-600" /> 实训室热度排行
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="pb-3 font-medium w-12 text-center">排名</th>
                    <th className="pb-3 font-medium">实训室名称</th>
                    <th className="pb-3 font-medium text-right">累计时长 (h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {labRankData.map((item, i) => (
                    <tr key={item.name} className="hover:bg-purple-50/50 transition-colors group">
                      <td className="py-4 text-center">
                        <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold", 
                          i === 0 ? "bg-amber-100 text-amber-600 shadow-sm" : 
                          i === 1 ? "bg-slate-100 text-slate-600 shadow-sm" : 
                          i === 2 ? "bg-orange-100 text-orange-600 shadow-sm" : "text-slate-400")}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="text-[10px] text-slate-400">{item.asset}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right font-mono font-bold text-purple-600">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: User Ranking */}
          <div className="w-1/3 bg-white border border-purple-100 rounded-2xl p-6 flex flex-col shadow-sm relative overflow-hidden">
            <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <User className="w-6 h-6 text-emerald-600" /> 实训达人排行
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="pb-3 font-medium w-12 text-center">排名</th>
                    <th className="pb-3 font-medium">姓名</th>
                    <th className="pb-3 font-medium text-right">时长 (h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {userRankData.map((item, i) => (
                    <tr key={item.name} className="hover:bg-purple-50/50 transition-colors group">
                      <td className="py-4 text-center">
                        <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold", 
                          i === 0 ? "bg-amber-100 text-amber-600 shadow-sm" : 
                          i === 1 ? "bg-slate-100 text-slate-600 shadow-sm" : 
                          i === 2 ? "bg-orange-100 text-orange-600 shadow-sm" : "text-slate-400")}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="text-[10px] text-slate-400">{item.class}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right font-mono font-bold text-emerald-600">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* --- AI Chat Interface --- */}
        <AnimatePresence>
          {isAIChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 right-10 w-[400px] h-[600px] bg-white border border-purple-100 rounded-3xl shadow-2xl z-[110] overflow-hidden flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-5 border-b border-purple-100 flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">实训室智能助手</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] opacity-80">在线为您服务</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAIChatOpen(false)} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50/50">
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                      msg.role === 'user' ? "bg-indigo-100 text-indigo-600" : "bg-purple-600 text-white"
                    )}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      msg.role === 'user' 
                        ? "bg-purple-600 text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-purple-50 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Default Prompts */}
                {chatMessages.length === 1 && (
                  <div className="pt-4 space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">您可以尝试这样问我：</p>
                    {defaultPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="w-full text-left p-3 bg-white border border-purple-100 rounded-xl text-xs text-slate-600 hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm flex items-center justify-between group"
                      >
                        {prompt}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-purple-100">
                <div className="relative">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                    placeholder="输入您的问题..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                  <button 
                    onClick={() => handleSendMessage(chatInput)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Toggle Button */}
        <button 
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className={cn(
            "fixed bottom-10 right-10 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[120] group",
            isAIChatOpen && "rotate-90"
          )}
        >
          {isAIChatOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
          {!isAIChatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
          )}
        </button>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.2);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.4);
        }
      `}</style>
    </div>
  );
}
