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

// --- Helper: Create Text Sprite ---
function createTextSprite(text: string, color: string = '#ffffff', fontSize: number = 32) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 128;
  
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Text Shadow for readability
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(spriteMaterial);
  return sprite;
}

// --- Campus Scene Component (3D Topology) ---
function CampusScene3D({ devices, assets }: { devices: any[], assets: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredInfo, setHoveredInfo] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // 1. Scene & Camera Setup (Daytime)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9); // Light slate/blue background
    scene.fog = new THREE.Fog(0xf1f5f9, 50, 1000);
    
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(200, 250, 400);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.maxDistance = 1500;
    controls.minDistance = 20;
    
    // 3. Lighting (Sunlight style)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(150, 300, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -300;
    sunLight.shadow.camera.right = 300;
    sunLight.shadow.camera.top = 300;
    sunLight.shadow.camera.bottom = -300;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    scene.add(hemiLight);

    // 4. Ground (Green/Gray Plaza)
    const groundGeo = new THREE.CircleGeometry(300, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    const grid = new THREE.GridHelper(600, 60, 0xcbd5e1, 0xe2e8f0);
    grid.position.y = 0.5;
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    scene.add(grid);

    // 5. Buildings & Floors
    const buildingMeshes: THREE.Mesh[] = [];
    const radius = 220; // 扩大建筑环绕半径
    
    assets.forEach((asset, idx) => {
      const angle = (idx / assets.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(x, 0, z);
      scene.add(buildingGroup);
      
      // Building Name Label on Roof
      const bLabel = createTextSprite(asset.name, '#334155', 48);
      bLabel.scale.set(80, 20, 1);
      
      // Floor details (增大面积与层高)
      const floorHeight = 25;
      const floorSize = 80;
      const wallThickness = 2;
      
      asset.labs.forEach((lab: any, fIdx: number) => {
        const labDevices = devices.filter(d => d.labId === lab.id);
        const hasOnline = labDevices.some(d => d.status === 'online');
        
        // "Training Building" Style: Glass Box with Metal Frame
        const floorY = fIdx * floorHeight + floorHeight / 2;
        
        // Inner Glass (增强透明度以透视内部)
        const glassGeo = new THREE.BoxGeometry(floorSize - 2, floorHeight - 1, floorSize - 2);
        const glassMat = new THREE.MeshPhysicalMaterial({ 
          color: hasOnline ? 0x0ea5e9 : 0x94a3b8,
          emissive: hasOnline ? 0x0284c7 : 0x000000,
          emissiveIntensity: hasOnline ? 0.3 : 0, // 降低玻璃自身发光，突出内部设备
          transparent: true,
          opacity: 0.25, // 高度透明
          roughness: 0.1,
          metalness: 0.1,
          transmission: 0.9,
          ior: 1.5
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.y = floorY;
        glassMesh.castShadow = true;
        glassMesh.receiveShadow = true;
        
        // Device Nodes Inside the Lab
        if (labDevices.length > 0) {
          const deviceGroup = new THREE.Group();
          deviceGroup.position.y = floorY - floorHeight / 2 + 1; // 放置在楼层地板之上
          
          const maxCols = Math.ceil(Math.sqrt(labDevices.length));
          const padding = 6;
          const startX = -((maxCols - 1) * padding) / 2;
          const startZ = -((maxCols - 1) * padding) / 2;
          
          const deviceGeo = new THREE.BoxGeometry(2.5, 3, 2.5);
          
          labDevices.forEach((device, dIdx) => {
            const row = Math.floor(dIdx / maxCols);
            const col = dIdx % maxCols;
            
            let dColor = 0x94a3b8; // offline
            let dEmissive = 0x000000;
            if (device.status === 'online') { dColor = 0x10b981; dEmissive = 0x10b981; }
            if (device.status === 'abnormal') { dColor = 0xef4444; dEmissive = 0xef4444; }
            
            const deviceMat = new THREE.MeshStandardMaterial({
              color: dColor,
              emissive: dEmissive,
              emissiveIntensity: device.status !== 'offline' ? 2.0 : 0
            });
            const deviceMesh = new THREE.Mesh(deviceGeo, deviceMat);
            deviceMesh.position.set(startX + col * padding, 1.5, startZ + row * padding);
            deviceGroup.add(deviceMesh);
          });
          buildingGroup.add(deviceGroup);
        }
        
        // Metal/Concrete Frame
        const frameGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(floorSize, floorHeight, floorSize));
        const frameMat = new THREE.LineBasicMaterial({ color: 0x475569, linewidth: 2 });
        const frame = new THREE.LineSegments(frameGeo, frameMat);
        frame.position.y = floorY;
        
        // Add floor plates
        const plateGeo = new THREE.BoxGeometry(floorSize + 1, 1, floorSize + 1);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
        const plateTop = new THREE.Mesh(plateGeo, plateMat);
        plateTop.position.y = floorY + floorHeight / 2;
        const plateBottom = new THREE.Mesh(plateGeo, plateMat);
        plateBottom.position.y = floorY - floorHeight / 2;

        glassMesh.userData = { 
          type: 'lab', 
          name: lab.name, 
          assetName: asset.name, 
          status: hasOnline ? '使用中' : '空闲',
          deviceCount: labDevices.length,
          onlineCount: labDevices.filter(d => d.status === 'online').length
        };
        
        buildingGroup.add(glassMesh);
        buildingGroup.add(frame);
        buildingGroup.add(plateTop);
        buildingGroup.add(plateBottom);
        buildingMeshes.push(glassMesh); // Only raycast to glass for interaction

        // Lab Name Label with Extension Line
        const labelXOffset = (x > 0 ? 1 : -1) * (floorSize / 2 + 30);
        const labelZOffset = (z > 0 ? 1 : -1) * (floorSize / 2 + 30);
        
        const linePos = [
          0, floorY, 0,
          labelXOffset * 0.8, floorY, labelZOffset * 0.8
        ];
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(lineGeo, lineMat);
        buildingGroup.add(line);
        
        const labLabel = createTextSprite(lab.short || lab.name, '#475569', 32);
        labLabel.position.set(labelXOffset * 0.8, floorY, labelZOffset * 0.8);
        labLabel.scale.set(60, 15, 1);
        buildingGroup.add(labLabel);
      });
      
      // Building Roof Label Position
      bLabel.position.y = asset.labs.length * floorHeight + 30;
      buildingGroup.add(bLabel);
    });

    // 6. Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);
      
      if (intersects.length > 0) {
        setHoveredInfo(intersects[0].object.userData);
        container.style.cursor = 'pointer';
      } else {
        setHoveredInfo(null);
        container.style.cursor = '';
      }
    };
    
    container.addEventListener('mousemove', onMouseMove);
    
    // 7. Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [devices, assets]);

  return (
    <div className="w-full h-full relative bg-slate-100 rounded-xl overflow-hidden shadow-inner group border border-slate-200">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      
      {/* HUD Info */}
      <div className="absolute top-4 left-4 pointer-events-none z-10">
        <h3 className="text-slate-800 font-bold tracking-wide flex items-center gap-2 drop-shadow-sm">
          <Building2 className="w-5 h-5 text-indigo-600" /> 校园实训资产数字孪生
        </h3>
        <p className="text-slate-500 text-[10px] mt-1 font-medium bg-white/60 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-200 shadow-sm">
          🌤️ 白天模式。楼层高亮表示实训中。支持全视角旋转与缩放交互。
        </p>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredInfo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl border border-slate-200 p-4 rounded-xl shadow-2xl pointer-events-none text-slate-800 min-w-[220px] z-50"
          >
            <div className="text-[10px] text-indigo-600 font-bold mb-1 uppercase tracking-wider">{hoveredInfo.assetName}</div>
            <div className="text-lg font-bold mb-2 border-b border-slate-100 pb-2">{hoveredInfo.name}</div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between"><span>实训状态:</span><span className={cn("font-bold", hoveredInfo.status === '使用中' ? "text-emerald-600" : "text-slate-400")}>{hoveredInfo.status}</span></div>
              <div className="flex justify-between"><span>终端总数:</span><span className="font-mono font-bold">{hoveredInfo.deviceCount}</span></div>
              <div className="flex justify-between"><span>在线运行:</span><span className="font-mono text-emerald-500 font-bold">{hoveredInfo.onlineCount}</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-[10px] text-slate-600 shadow-lg space-y-2 z-10 pointer-events-none">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-sky-500 shadow-[0_0_8px_#0ea5e9]"></div><span className="font-bold">实训开启中</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-300"></div><span className="font-bold">资源闲置中</span></div>
      </div>
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
                  <div className="relative z-10 flex gap-8 items-stretch justify-center px-8 pb-14 pt-6 min-h-full">
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
                        <motion.div key={asset.id} className="flex flex-col items-center h-full"
                          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: assetIdx * 0.12, ease: 'easeOut' }}>
                          <div className="relative group/building w-[220px] flex flex-col h-full">
                            {/* 天线 */}
                            <div className="flex justify-center mb-[-1px] shrink-0"><div className="w-px h-4 bg-slate-300"></div></div>
                            <div className="flex justify-center mb-[-1px] shrink-0"><div className="w-6 h-1 bg-slate-300 rounded-t"></div></div>
                            {/* 屋顶 */}
                            <div className={cn("bg-gradient-to-r text-white px-4 py-3 rounded-t-xl text-center relative overflow-hidden shadow-lg shrink-0", s.gradient)}>
                              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, white 10px, white 11px)` }}></div>
                              <Building2 className="w-5 h-5 mx-auto mb-1 opacity-80 relative z-10" />
                              <div className="text-sm font-black tracking-wide relative z-10">{asset.name}</div>
                              <div className="text-[10px] opacity-80 font-medium mt-0.5 relative z-10">{onlineCount}/{totalCount} 在线 · {onlineRate}%</div>
                            </div>
                            {/* 楼体（实训室楼层） */}
                            <div className="bg-white shadow-md flex-1" style={{ borderLeft: `2px solid ${s.bc}30`, borderRight: `2px solid ${s.bc}30` }}>
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
                            <div className="h-2.5 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-lg shadow-md shrink-0"></div>
                            <div className="mx-4 h-2 bg-slate-900/5 rounded-[100%] blur-sm -mt-1 shrink-0"></div>
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
              <CampusScene3D devices={allDevices} assets={assets} />
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
