import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
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

const questionWords = [
  { text: '传感器偏差', size: 42, color: '#9333ea' },
  { text: 'PLC通讯中断', size: 38, color: '#ef4444' },
  { text: '网关上云', size: 35, color: '#3b82f6' },
  { text: 'Lora协议', size: 30, color: '#10b981' },
  { text: '固件更新', size: 28, color: '#f59e0b' },
  { text: '寄存器地址', size: 26, color: '#6366f1' },
  { text: '机械臂路径', size: 32, color: '#ec4899' },
  { text: '视觉识别失败', size: 24, color: '#8b5cf6' },
  { text: 'Modbus响应', size: 22, color: '#14b8a6' },
  { text: 'MQTT连接', size: 34, color: '#2563eb' },
  { text: '电压不稳定', size: 27, color: '#d946ef' },
  { text: '边缘计算', size: 31, color: '#0ea5e9' },
  { text: '串口无数据', size: 25, color: '#f43f5e' },
  { text: '智能体协作', size: 29, color: '#84cc16' },
  { text: '环境监测', size: 20, color: '#64748b' },
  { text: '急停触发', size: 36, color: '#ef4444' }
];

const fifteenDaysData = Array.from({length: 15}, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (14 - i));
  return {
    name: `${d.getMonth()+1}/${d.getDate()}`,
    labUsage: Math.floor(Math.random() * 100 + 50),
    agentOnline: Math.floor(Math.random() * 1000 + 300)
  };
});

const heatmapData = [
  { id: 1, name: '物联网综合实训室', asset: 'A栋-101', agents: 45, online: true, duration: '12h 30m' },
  { id: 2, name: 'AI基础实验室', asset: 'A栋-102', agents: 32, online: true, duration: '8h 15m' },
  { id: 3, name: '嵌入式系统实训室', asset: 'A栋-103', agents: 38, online: true, duration: '6h 20m' },
  { id: 4, name: '移动通信实训室', asset: 'A栋-104', agents: 28, online: false, duration: '0h 00m' },
  { id: 5, name: '工业互联网中心', asset: 'B栋-201', agents: 60, online: true, duration: '24h 00m' },
  { id: 6, name: '大数据分析实训室', asset: 'B栋-202', agents: 40, online: true, duration: '10h 00m' },
  { id: 7, name: '数字孪生仿真实验室', asset: 'B栋-203', agents: 44, online: true, duration: '14h 10m' },
  { id: 8, name: '边缘智能网关室', asset: 'B栋-204', agents: 36, online: false, duration: '0h 00m' },
  { id: 9, name: '云计算网络实验室', asset: 'C栋-301', agents: 55, online: true, duration: '5h 45m' },
  { id: 10, name: '网络安全实训室', asset: 'C栋-302', agents: 30, online: true, duration: '18h 20m' },
  { id: 11, name: '区块链技术实验室', asset: 'C栋-303', agents: 26, online: false, duration: '0h 00m' },
  { id: 12, name: '工业物联网协议实验室', asset: 'C栋-304', agents: 42, online: true, duration: '9h 30m' },
  { id: 13, name: '智慧农业大棚', asset: 'D栋-401', agents: 25, online: true, duration: '4h 00m' },
  { id: 14, name: '智能制造车间', asset: 'D栋-402', agents: 80, online: true, duration: '48h 10m' },
  { id: 15, name: 'AR/VR 交互实训室', asset: 'D栋-403', agents: 22, online: false, duration: '0h 00m' },
  { id: 16, name: '协作机器人实训室', asset: 'D栋-404', agents: 48, online: true, duration: '16h 45m' },
];

const labImages: Record<string, string> = {
  '物联网综合实训室': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  'AI基础实验室': 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80',
  '嵌入式系统实训室': 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80',
  '移动通信实训室': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  '工业互联网中心': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  '大数据分析实训室': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  '数字孪生仿真实验室': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  '边缘智能网关室': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  '云计算网络实验室': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
  '网络安全实训室': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  '区块链技术实验室': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
  '工业物联网协议实验室': 'https://images.unsplash.com/photo-1558346490-a72e3ae2fd6a?auto=format&fit=crop&w=800&q=80',
  '智慧农业大棚': 'https://images.unsplash.com/photo-1530836369250-ef71a3a5e4bf?auto=format&fit=crop&w=800&q=80',
  '智能制造车间': 'https://images.unsplash.com/photo-1565439390118-c22456d151f4?auto=format&fit=crop&w=800&q=80',
  'AR/VR 交互实训室': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80',
  '协作机器人实训室': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
};

// --- New Asset Tree and Devices Data ---
const assets = [
  {
    id: 'A',
    name: 'A栋教学楼',
    shortAddr: '主校区东侧',
    labs: [
      { id: 'L1', name: '物联网综合实训室', short: '物联网', room: 'A-101' },
      { id: 'L2', name: 'AI基础实验室', short: 'AI基础', room: 'A-102' },
      { id: 'L3', name: '嵌入式系统实训室', short: '嵌入式', room: 'A-103' },
      { id: 'L4', name: '移动通信实训室', short: '移动通信', room: 'A-104' },
    ],
  },
  {
    id: 'B',
    name: 'B栋实训楼',
    shortAddr: '主校区南侧',
    labs: [
      { id: 'L5', name: '工业互联网中心', short: '工业互联', room: 'B-201' },
      { id: 'L6', name: '大数据分析实训室', short: '大数据', room: 'B-202' },
      { id: 'L7', name: '数字孪生仿真实验室', short: '数字孪生', room: 'B-203' },
      { id: 'L8', name: '边缘智能网关室', short: '边缘网关', room: 'B-204' },
    ],
  },
  {
    id: 'C',
    name: 'C栋实验楼',
    shortAddr: '主校区西侧',
    labs: [
      { id: 'L9', name: '云计算网络实验室', short: '云计算', room: 'C-301' },
      { id: 'L10', name: '网络安全实训室', short: '网络安全', room: 'C-302' },
      { id: 'L11', name: '区块链技术实验室', short: '区块链', room: 'C-303' },
      { id: 'L12', name: '工业物联网协议实验室', short: 'IoT协议', room: 'C-304' },
    ],
  },
  {
    id: 'D',
    name: 'D栋创新楼',
    shortAddr: '主校区北侧',
    labs: [
      { id: 'L13', name: '智慧农业大棚', short: '智慧农业', room: 'D-401' },
      { id: 'L14', name: '智能制造车间', short: '智能制造', room: 'D-402' },
      { id: 'L15', name: 'AR/VR 交互实训室', short: 'AR/VR', room: 'D-403' },
      { id: 'L16', name: '协作机器人实训室', short: '协作机器人', room: 'D-404' },
    ],
  },
];

/** 实训室当前无一台设备在线 = 未排课/未开启，设备全部离线或异常 */
const LABS_ZERO_ONLINE = new Set<string>(['L4', 'L8', 'L11', 'L15']);

const agentNames = [
  '物联网中心网关',
  '有人DTU',
  '研华网关',
  'Lora终端',
  '人工智能前端设备',
  '植物工厂',
  '大象机械臂',
  'PLC 控制单元',
  '机器视觉相机',
  '边缘 AI 盒子',
  '温湿度传感器阵列',
  'AGV 调度终端',
];

const allDevices: any[] = [];
assets.forEach(asset => {
  asset.labs.forEach(lab => {
    const count = Math.floor(Math.random() * 14) + 18; // 18–31 台/室
    const forceNoOnline = LABS_ZERO_ONLINE.has(lab.id);
    for (let i = 1; i <= count; i++) {
      const rand = Math.random();
      let status: 'online' | 'offline' | 'abnormal';
      if (forceNoOnline) {
        status = rand > 0.12 ? 'offline' : 'abnormal';
      } else {
        status = rand > 0.18 ? 'online' : rand > 0.06 ? 'offline' : 'abnormal';
      }
      const agentName = agentNames[Math.floor(Math.random() * agentNames.length)];
      const labNum = parseInt(lab.id.replace(/^L/, ''), 10) || 0;
      const subnet = 10 + (labNum % 18);
      allDevices.push({
        id: `${lab.id}-${i}`,
        name: `${agentName}-${String(i).padStart(2, '0')}`,
        assetId: asset.id,
        assetName: asset.name,
        labId: lab.id,
        labName: lab.name,
        status,
        ip: `192.168.${subnet}.${Math.floor(Math.random() * 250) + 2}`,
      });
    }
  });
});



function countLabsWithAnyOnline(assetId: string) {
  const a = assets.find(x => x.id === assetId);
  if (!a) return { active: 0, total: 0 };
  const active = a.labs.filter(lab =>
    allDevices.some(d => d.labId === lab.id && d.status === 'online')
  ).length;
  return { active, total: a.labs.length };
}

const labUsageBarData = (['A', 'B', 'C', 'D'] as const).map(id => {
  const { active, total } = countLabsWithAnyOnline(id);
  const nameMap = { A: 'A栋', B: 'B栋', C: 'C栋', D: 'D栋' };
  return { name: nameMap[id], 使用中: active, 未使用: total - active };
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
  { name: '智能制造车间', asset: 'D栋-402', duration: 1250 },
  { name: '工业互联网中心', asset: 'B栋-201', duration: 980 },
  { name: '物联网综合实训室', asset: 'A栋-101', duration: 850 },
  { name: '协作机器人实训室', asset: 'D栋-404', duration: 720 },
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
  { type: 'suggestion', title: '闲置资源提醒', desc: '移动通信、区块链等实训室当前无设备在线，请核实排课或上电情况。' },
  { type: 'suggestion', title: '维护建议', desc: '物联网中心网关连续高负载运行超 300 小时，建议安排例行检查。' },
];



// --- Helper: Auto-updating number component for telemetry ---
function AutoUpdatingNumber({ initialValue, stepSize = 3, interval = 3000 }: { initialValue: number, stepSize?: number, interval?: number }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Add a random offset so components don't update exactly at the same ms
    const timer = setInterval(() => {
      setValue(prev => prev + Math.floor(Math.random() * stepSize) + 1);
    }, interval + Math.random() * 500);
    return () => clearInterval(timer);
  }, [stepSize, interval]);

  return <>{value.toLocaleString()}</>;
}

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

// --- Helper: Create a simple procedural tree ---
function createTree(x: number, z: number, scale: number = 1): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.8 * scale, 1.2 * scale, 8 * scale, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B5E3C, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 4 * scale;
  trunk.castShadow = true;
  group.add(trunk);

  // Foliage layers (3 cones stacked)
  const foliageColors = [0x2d6a4f, 0x40916c, 0x52b788];
  const layerData = [
    { r: 9 * scale, h: 12 * scale, y: 10 * scale },
    { r: 7 * scale, h: 10 * scale, y: 16 * scale },
    { r: 5 * scale, h: 8 * scale,  y: 21 * scale },
  ];
  layerData.forEach((l, i) => {
    const coneGeo = new THREE.ConeGeometry(l.r, l.h, 8);
    const coneMat = new THREE.MeshStandardMaterial({ color: foliageColors[i], roughness: 0.8 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = l.y;
    cone.castShadow = true;
    group.add(cone);
  });

  return group;
}

// --- Helper: Create a grass patch ---
function createGrassPatch(cx: number, cz: number, radius: number): THREE.Mesh {
  const geo = new THREE.CircleGeometry(radius, 32);
  const mat = new THREE.MeshStandardMaterial({ color: 0x6abf69, roughness: 0.95 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(cx, 0.15, cz);
  mesh.receiveShadow = true;
  return mesh;
}

// --- Helper: Create a road/path strip ---
function createPath(x1: number, z1: number, x2: number, z2: number, width: number = 8): THREE.Mesh {
  const dx = x2 - x1, dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const geo = new THREE.PlaneGeometry(width, len);
  const mat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.95 });
  const mesh = new THREE.Mesh(geo, mat);
  // Rotate flat then orient along direction
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = angle;
  mesh.position.set((x1 + x2) / 2, 0.2, (z1 + z2) / 2);
  mesh.receiveShadow = true;
  return mesh;
}

// --- Campus Scene Component (3D Topology) ---
function CampusScene3D({ devices, assets }: { devices: any[], assets: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredInfo, setHoveredInfo] = useState<any>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // 1. Scene & Camera Setup (Daytime)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdbeafe); // Sky blue
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.0012);
    
    const w0 = Math.max(1, container.clientWidth);
    const h0 = Math.max(1, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(50, w0 / h0, 0.1, 2000);
    camera.position.set(200, 260, 420);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w0, h0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    // canvas 样式：撑满容器，接收所有鼠标/触摸事件
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.outline = 'none';
    container.appendChild(renderer.domElement);

    // 2. Controls — 绑定到 canvas，旋转、平移、缩放全部开启
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.maxDistance = 900;
    controls.minDistance = 30;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 30, 0);
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.update();
    
    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff4e0, 0.6);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xfff8e7, 1.4);
    sunLight.position.set(200, 350, 150);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -400;
    sunLight.shadow.camera.right = 400;
    sunLight.shadow.camera.top = 400;
    sunLight.shadow.camera.bottom = -400;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // 天空半球光：天蓝色 + 草绿色地面反射
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x4a7c59, 0.7);
    scene.add(hemiLight);

    // 4. Ground — 大草坪底色
    const groundGeo = new THREE.CircleGeometry(500, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x7ec850, roughness: 1.0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 中央广场（硬化地面）
    const plazaGeo = new THREE.CircleGeometry(90, 32);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.1;
    plaza.receiveShadow = true;
    scene.add(plaza);

    // 道路（十字形）
    scene.add(createPath(0, -400, 0, 400, 14));
    scene.add(createPath(-400, 0, 400, 0, 14));

    // 草坪色块（建筑周围绿化带）
    const grassPositions = [
      [0, 0, 120], [0, 0, -120], [120, 0, 0], [-120, 0, 0],
      [80, 0, 80], [-80, 0, 80], [80, 0, -80], [-80, 0, -80],
    ];
    grassPositions.forEach(([cx, , cz]) => {
      scene.add(createGrassPatch(cx, cz, 35));
    });

    // 树木 — 沿广场边缘和道路两侧种植
    const treeRing = [
      [100, 0], [-100, 0], [0, 100], [0, -100],
      [70, 70], [-70, 70], [70, -70], [-70, -70],
      [130, 40], [-130, 40], [130, -40], [-130, -40],
      [40, 130], [-40, 130], [40, -130], [-40, -130],
      [160, 0], [-160, 0], [0, 160], [0, -160],
      [200, 80], [-200, 80], [200, -80], [-200, -80],
      [80, 200], [-80, 200], [80, -200], [-80, -200],
    ];
    treeRing.forEach(([tx, tz]) => {
      const s = 0.7 + Math.random() * 0.6;
      scene.add(createTree(tx, tz, s));
    });

    // 轻量网格（仅广场区域）
    const grid = new THREE.GridHelper(180, 18, 0xcbd5e1, 0xdde3ea);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.25;
    grid.position.y = 0.3;
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
        const onlineCount = labDevices.filter(d => d.status === 'online').length;
        const labActive = onlineCount > 0;
        
        // "Training Building" Style: Glass Box with Metal Frame
        const floorY = fIdx * floorHeight + floorHeight / 2;
        
        // Inner Glass — 开启中透亮泛光；未开启（0 在线）整体压暗、关灯质感
        const glassGeo = new THREE.BoxGeometry(floorSize - 2, floorHeight - 1, floorSize - 2);
        const glassMat = new THREE.MeshPhysicalMaterial({ 
          color: labActive ? 0x0ea5e9 : 0x1e293b,
          emissive: labActive ? 0x38bdf8 : 0x020617,
          emissiveIntensity: labActive ? 0.32 : 0.03,
          transparent: true,
          opacity: labActive ? 0.26 : 0.82,
          roughness: labActive ? 0.1 : 0.88,
          metalness: labActive ? 0.1 : 0.42,
          transmission: labActive ? 0.88 : 0.06,
          ior: 1.48,
          clearcoat: labActive ? 0.22 : 0,
          clearcoatRoughness: 0.35,
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.y = floorY;
        glassMesh.castShadow = true;
        glassMesh.receiveShadow = true;

        // 室内“顶灯”平面：开启时暖亮，未开启时仅微弱环境反光
        const ceilingGeo = new THREE.PlaneGeometry(floorSize - 10, floorSize - 10);
        const ceilingMat = new THREE.MeshStandardMaterial({
          color: labActive ? 0xfffbeb : 0x0f172a,
          emissive: labActive ? 0xfde68a : 0x020617,
          emissiveIntensity: labActive ? 1.1 : 0.06,
          roughness: labActive ? 0.35 : 0.92,
          metalness: labActive ? 0 : 0.25,
          side: THREE.DoubleSide,
        });
        const ceilingLight = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceilingLight.rotation.x = -Math.PI / 2;
        ceilingLight.position.set(0, floorY + floorHeight / 2 - 1.15, 0);
        buildingGroup.add(ceilingLight);
        
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
        const frameMat = new THREE.LineBasicMaterial({
          color: labActive ? 0x475569 : 0x334155,
          transparent: true,
          opacity: labActive ? 1 : 0.5,
        });
        const frame = new THREE.LineSegments(frameGeo, frameMat);
        frame.position.y = floorY;
        
        // Add floor plates
        const plateGeo = new THREE.BoxGeometry(floorSize + 1, 1, floorSize + 1);
        const plateMat = new THREE.MeshStandardMaterial({
          color: labActive ? 0x64748b : 0x334155,
          roughness: labActive ? 0.65 : 0.92,
          metalness: labActive ? 0.12 : 0.38,
        });
        const plateTop = new THREE.Mesh(plateGeo, plateMat);
        plateTop.position.y = floorY + floorHeight / 2;
        const plateBottom = new THREE.Mesh(plateGeo, plateMat);
        plateBottom.position.y = floorY - floorHeight / 2;

        glassMesh.userData = { 
          type: 'lab', 
          name: lab.name, 
          assetName: asset.name, 
          status: labActive ? '实训开启中' : '未开启（0 在线）',
          deviceCount: labDevices.length,
          onlineCount,
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
        const lineMat = new THREE.LineBasicMaterial({
          color: labActive ? 0x94a3b8 : 0x475569,
          transparent: true,
          opacity: labActive ? 0.5 : 0.22,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        buildingGroup.add(line);
        
        const labLabel = createTextSprite(
          lab.short || lab.name,
          labActive ? '#475569' : '#64748b',
          32
        );
        labLabel.position.set(labelXOffset * 0.8, floorY, labelZOffset * 0.8);
        labLabel.scale.set(60, 15, 1);
        if (!labActive) {
          const sm = labLabel.material as THREE.SpriteMaterial;
          sm.transparent = true;
          sm.opacity = 0.55;
        }
        buildingGroup.add(labLabel);
      });
      
      // Building Roof Label Position
      bLabel.position.y = asset.labs.length * floorHeight + 30;
      buildingGroup.add(bLabel);
    });

    // 6. Interaction — 绑定到 canvas 而不是 container
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
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredInfo(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };
    
    // 绑定到 canvas，使用 passive 避免阻止 OrbitControls
    renderer.domElement.addEventListener('mousemove', onMouseMove, { passive: true });
    
    // 7. Animation
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    const syncSize = () => {
      const w = Math.max(1, Math.floor(container.clientWidth));
      const h = Math.max(1, Math.floor(container.clientHeight));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      controls.dispose();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
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
    <div
      className="w-full h-full relative rounded-xl border border-slate-200 shadow-inner bg-slate-100"
      style={{ minHeight: 0, overflow: 'hidden', isolation: 'isolate' }}
    >
      {/* Three.js canvas 容器 */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute', inset: 0,
          zIndex: 0,
        }}
      />

      {/* HUD Info — pointer-events-none 覆盖层 */}
      <div className="absolute top-4 left-4 pointer-events-none" style={{ zIndex: 10 }}>
        <h3 className="text-slate-800 font-bold tracking-wide flex items-center gap-2 drop-shadow-sm">
          <Building2 className="w-5 h-5 text-indigo-600" /> 校园实训资产数字孪生
        </h3>
        <p className="text-slate-500 text-[10px] mt-1 font-medium bg-white/60 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-200 shadow-sm">
          🌤️ 左键旋转 · 右键平移 · 滚轮缩放
        </p>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl border border-slate-200 p-4 rounded-xl shadow-2xl text-slate-800 min-w-[220px]"
            style={{ zIndex: 10, pointerEvents: 'none' }}
          >
            <div className="text-[10px] text-indigo-600 font-bold mb-1 uppercase tracking-wider">{hoveredInfo.assetName}</div>
            <div className="text-lg font-bold mb-2 border-b border-slate-100 pb-2">{hoveredInfo.name}</div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between"><span>实训状态:</span><span className={cn("font-bold", hoveredInfo.status === '实训开启中' ? "text-emerald-600" : "text-slate-500")}>{hoveredInfo.status}</span></div>
              <div className="flex justify-between"><span>终端总数:</span><span className="font-mono font-bold">{hoveredInfo.deviceCount}</span></div>
              <div className="flex justify-between"><span>在线运行:</span><span className="font-mono text-emerald-500 font-bold">{hoveredInfo.onlineCount}</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div
        className="absolute bottom-4 right-4 bg-white/70 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-[10px] text-slate-600 shadow-lg space-y-2"
        style={{ zIndex: 10, pointerEvents: 'none' }}
      >
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-sky-500 shadow-[0_0_8px_#0ea5e9]"></div><span className="font-bold">实训开启中（≥1 在线）</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-800 border border-slate-600 shadow-inner"></div><span className="font-bold">未开启（0 在线·关灯）</span></div>
      </div>
    </div>
  );
}

function QuestionWordCloud() {
  return (
    <div className="w-full h-full flex flex-wrap items-center justify-center gap-3 p-4 select-none">
      {questionWords.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.2, zIndex: 20 }}
          style={{ 
            fontSize: `${word.size / 2 + 10}px`,
            color: word.color,
            cursor: 'default',
            fontWeight: word.size > 30 ? '800' : '500'
          }}
          className="px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors drop-shadow-sm"
        >
          {word.text}
        </motion.span>
      ))}
    </div>
  );
}

export default function OperationDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 左侧平面图/右侧 3D 模块的“局部全屏”
  const leftModuleRef = useRef<HTMLDivElement>(null);
  const rightModuleRef = useRef<HTMLDivElement>(null);
  const [subFullscreen, setSubFullscreen] = useState<'left' | 'right' | null>(null);
  
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

  // Ranking Tab State
  const [activeRankTab, setActiveRankTab] = useState<'agent' | 'lab' | 'user'>('agent');
  useEffect(() => {
    const tabs: ('agent' | 'lab' | 'user')[] = ['agent', 'lab', 'user'];
    const timer = setInterval(() => {
      setActiveRankTab(current => {
        const nextIdx = (tabs.indexOf(current) + 1) % tabs.length;
        return tabs[nextIdx];
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

      const el = document.fullscreenElement;
      if (el && el === leftModuleRef.current) setSubFullscreen('left');
      else if (el && el === rightModuleRef.current) setSubFullscreen('right');
      else setSubFullscreen(null);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();
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

  const toggleSubFullscreen = (target: 'left' | 'right') => {
    const el = target === 'left' ? leftModuleRef.current : rightModuleRef.current;
    if (!el) return;

    // 已在全屏：点击同一模块则退出；否则先退出再切换到目标模块
    if (document.fullscreenElement) {
      if (document.fullscreenElement === el) {
        document.exitFullscreen();
        return;
      }
      document.exitFullscreen();
      setTimeout(() => {
        if (!document.fullscreenElement) {
          el.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable sub fullscreen: ${err.message}`);
          });
        }
      }, 60);
      return;
    }

    el.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable sub fullscreen: ${err.message}`);
    });
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
          
          {/* Left: Core Metrics — Precision Signal Panel */}
          <div className="w-[400px] bg-white border border-slate-200/80 rounded-2xl flex flex-col shadow-sm overflow-hidden shrink-0">

            {/* ── Dark control header ── */}
            <div className="bg-slate-950 px-5 py-3 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                <span className="w-[3px] h-3.5 rounded-full bg-[var(--brand-coral)] inline-block" />
                核心运营指标
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>

            {/* ── Hero metric ── */}
            <div className="relative px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
              {/* Left coral accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--brand-coral)]" />

              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-2.5">
                硬件智能体 · 回答累计
              </p>

              <div className="flex items-end gap-3">
                <span className="text-[50px] font-black tracking-tight font-mono text-slate-900 leading-none tabular-nums">
                  <AutoUpdatingNumber initialValue={145230} stepSize={3} interval={3000} />
                </span>
                <div className="mb-1.5 flex flex-col gap-1">
                  <span className="text-sm font-bold text-slate-400 leading-none">次</span>
                  <span className="text-[10px] font-black text-emerald-500 whitespace-nowrap leading-none">
                    ↑ 23.4% 较上月
                  </span>
                </div>
              </div>

              {/* Mini bar sparkline */}
              <div className="mt-3 flex items-end gap-[2px] h-4">
                {[28, 42, 33, 55, 48, 70, 62, 78, 68, 88, 82, 92, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[1px]"
                    style={{
                      height: `${Math.round(h * 0.16)}px`,
                      backgroundColor: i === 13 ? 'var(--brand-coral)' : `rgba(232,93,58,${0.15 + i * 0.05})`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Secondary metrics ── */}
            <div className="flex-1 flex flex-col divide-y divide-slate-50 px-4 py-1">
              {[
                { label: '实训室累计使用时长', init: 12450,  step: 1, ivl: 10000, unit: 'h',  pct: 72, color: 'var(--brand-coral)', Icon: Clock       },
                { label: '终端设备累计在线',   init: 89200,  step: 2, ivl: 8000,  unit: 'h',  pct: 85, color: '#4A90D9',           Icon: MonitorPlay  },
                { label: '系统登录次数',       init: 34510,  step: 2, ivl: 5000,  unit: '次', pct: 58, color: '#8b5cf6',           Icon: User         },
                { label: '串口指令执行次数',   init: 542880, step: 5, ivl: 800,   unit: '次', pct: 95, color: '#10b981',           Icon: Cpu          },
              ].map((m, i) => {
                const MetricIcon = m.Icon;
                return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * i + 0.25, duration: 0.35, ease: 'easeOut' }}
                  className="flex items-center gap-3 py-3 group cursor-default"
                >
                  {/* Icon */}
                  <MetricIcon className="w-3.5 h-3.5 text-slate-300 shrink-0 group-hover:text-slate-500 transition-colors" />

                  {/* Label + Number */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 truncate leading-none mb-1.5">
                      {m.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[19px] font-black font-mono tabular-nums leading-none text-slate-800">
                        <AutoUpdatingNumber initialValue={m.init} stepSize={m.step} interval={m.ivl} />
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{m.unit}</span>
                    </div>
                  </div>

                  {/* Progress column */}
                  <div className="w-12 shrink-0 flex flex-col items-end gap-1">
                    <span className="text-[9px] font-black font-mono leading-none" style={{ color: m.color }}>
                      {m.pct}%
                    </span>
                    <div className="w-full h-[3px] bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: m.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{ delay: 0.15 * i + 0.55, duration: 0.9, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
                );
              })}
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

          {/* Right: Trend Charts */}
          <div className="w-[400px] bg-white border border-purple-100 rounded-2xl p-6 flex flex-col shadow-sm relative overflow-hidden shrink-0">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 shrink-0">
              <TrendingUp className="w-6 h-6 text-indigo-500" /> 近15天趋势分析
            </h2>
            <div className="flex-1 flex flex-col gap-6 min-h-0">
              
              {/* Top Chart: Line Chart (Lab Usage) */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 实训室使用时长
                </h3>
                <div className="flex-1 relative w-full pt-2">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 tracking-widest font-medium z-10">时长 (h)</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fifteenDaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="labUsage" name="使用时长" stroke="#f59e0b" strokeWidth={3} dot={{r:3, fill:'#ffffff', stroke:'#f59e0b', strokeWidth:2}} activeDot={{r:5, fill:'#f59e0b', stroke:'#fff'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-slate-100 shrink-0"></div>

              {/* Bottom Chart: Area Chart (Terminal Online) */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 终端在线时长
                </h3>
                <div className="flex-1 relative w-full pt-2">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 tracking-widest font-medium z-10">时长 (h)</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fifteenDaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTerminal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="agentOnline" name="在线时长" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTerminal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- Middle Section (Device Online Status) --- */}
        <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm flex flex-col h-[520px] shrink-0">
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
            <div
              ref={leftModuleRef}
              className={cn(
                "w-1/2 min-h-0 flex flex-col shrink-0 min-w-0 relative",
                subFullscreen === 'left' && "w-full h-full"
              )}
            >
              <button
                onClick={() => toggleSubFullscreen('left')}
                className="absolute top-3 right-3 z-30 p-2 text-slate-600 bg-white/70 backdrop-blur-md hover:bg-white rounded-xl border border-slate-200 transition-colors"
                title={subFullscreen === 'left' ? "退出左侧全屏" : "左侧全屏"}
              >
                {subFullscreen === 'left' ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>

                <div className="flex-1 bg-gradient-to-b from-slate-50/80 to-white rounded-xl overflow-x-auto overflow-y-auto relative border border-purple-100 shadow-inner scroll-smooth">
                  {/* 背景网格 */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
                    backgroundImage: `linear-gradient(#f3e8ff 1px, transparent 1px), linear-gradient(90deg, #f3e8ff 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }}></div>
                  {/* 地面线 — 提高位置，避免遮挡楼体底部 */}
                  <div className="absolute bottom-[72px] left-4 right-4 h-px bg-slate-300/50 pointer-events-none z-[1]"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[72px] bg-gradient-to-t from-stone-100/85 via-stone-50/35 to-transparent pointer-events-none rounded-b-xl z-[1]"></div>

                  {/* 楼房天际线：非全屏左对齐横向滚动，全屏居中 */}
                  <div className={cn(
                    "relative z-10 flex flex-nowrap gap-5 items-start pl-4 pr-6 pt-6 pb-24 min-h-full min-w-min",
                    subFullscreen === 'left' ? "justify-center" : "justify-start"
                  )}>
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
                        <motion.div key={asset.id} className="flex flex-col items-center shrink-0 w-[200px]"
                          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: assetIdx * 0.12, ease: 'easeOut' }}>
                          <div className="relative group/building w-full flex flex-col">
                            {/* 天线 */}
                            <div className="flex justify-center mb-[-1px] shrink-0"><div className="w-px h-4 bg-slate-300"></div></div>
                            <div className="flex justify-center mb-[-1px] shrink-0"><div className="w-6 h-1 bg-slate-300 rounded-t"></div></div>
                            {/* 屋顶 */}
                            <div className={cn("bg-gradient-to-r text-white px-3 py-2.5 rounded-t-xl text-center relative overflow-hidden shadow-lg shrink-0", s.gradient)}>
                              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, white 10px, white 11px)` }}></div>
                              <Building2 className="w-5 h-5 mx-auto mb-1 opacity-80 relative z-10" />
                              <div className="text-xs font-black tracking-wide relative z-10 leading-tight">{asset.name}</div>
                              <div className="text-[9px] opacity-70 font-medium relative z-10 mt-0.5">{(asset as { shortAddr: string }).shortAddr}</div>
                              <div className="text-[10px] opacity-80 font-medium mt-1 relative z-10">{onlineCount}/{totalCount} 在线 · {onlineRate}%</div>
                            </div>
                            {/* 楼体（实训室楼层） */}
                            <div className="bg-white shadow-md flex-1" style={{ borderLeft: `2px solid ${s.bc}30`, borderRight: `2px solid ${s.bc}30` }}>
                              {asset.labs.map((lab, labIdx) => {
                                const labDevices = allDevices.filter(d => d.labId === lab.id);
                                const labOnline = labDevices.filter(d => d.status === 'online').length;
                                const labOpen = labOnline > 0;
                                return (
                                  <div
                                    key={lab.id}
                                    className={cn(
                                      "px-2.5 py-2.5 relative transition-colors",
                                      labIdx > 0 && "border-t border-slate-200",
                                      !labOpen && "bg-slate-100/90 border-l-2 border-l-slate-400/60"
                                    )}
                                  >
                                    <div className="flex items-center gap-1 mb-1.5 min-w-0">
                                      <div className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: labOpen ? `${s.bc}70` : '#94a3b8' }}></div>
                                      <Monitor className={cn("w-3 h-3 shrink-0", labOpen ? "text-slate-400" : "text-slate-500")} />
                                      <div className="min-w-0 flex-1">
                                        <span className={cn("text-[10px] font-bold truncate block", labOpen ? "text-slate-700" : "text-slate-500")}>{lab.short}</span>
                                        {'room' in lab && (lab as { room?: string }).room && (
                                          <span className="text-[8px] text-slate-400 font-mono">{(lab as { room?: string }).room}</span>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                                        {!labOpen && (
                                          <span className="text-[8px] font-bold text-slate-600 bg-slate-300/70 px-1 py-0.5 rounded">未开启</span>
                                        )}
                                        <span className={cn("text-[9px] whitespace-nowrap font-medium tabular-nums", labOpen ? "text-slate-500" : "text-slate-400")}>
                                          {labOnline}/{labDevices.length}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-[2px]">
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
            {/* 右侧：3D 场景 */}
            <div
              ref={rightModuleRef}
              className={cn(
                "flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden rounded-xl relative",
                subFullscreen === 'right' && "w-full h-full"
              )}
            >
              <button
                onClick={() => toggleSubFullscreen('right')}
                className="absolute top-3 right-3 z-30 p-2 text-slate-600 bg-white/70 backdrop-blur-md hover:bg-white rounded-xl border border-slate-200 transition-colors"
                title={subFullscreen === 'right' ? "退出右侧全屏" : "右侧全屏"}
              >
                {subFullscreen === 'right' ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>

              <CampusScene3D devices={allDevices} assets={assets} />
            </div>
          </div>
        </div>

        {/* --- Bottom Section (Moved Modules + Rankings) --- */}
        <div className="flex gap-6 h-[400px] shrink-0">
          {/* Left: Lab Usage Analysis */}
          <div className="flex-1 min-w-0 bg-white border border-purple-100 rounded-2xl p-6 flex flex-col shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-7 h-7 text-purple-600" /> 实训室使用分析
            </h2>
            <div className="flex-1 flex flex-col min-h-0">
              {/* Lab Usage Ratio (Stacked Bar Chart) */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-slate-600 mb-4 self-start flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                   活跃实训室占比 (按资产)
                </h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={labUsageBarData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <RechartsTooltip 
                        cursor={{fill: 'rgba(147, 51, 234, 0.05)'}}
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '20px' }} />
                      <Bar dataKey="使用中" stackId="a" fill="#9333ea" radius={[0, 0, 0, 0]} barSize={28} />
                      <Bar dataKey="未使用" stackId="a" fill="#f1f5f9" radius={[6, 6, 0, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Center: AI Question Word Cloud */}
          <div className="flex-1 min-w-0 bg-white border border-purple-100 rounded-2xl p-5 flex flex-col shadow-sm relative overflow-hidden">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" /> 硬件智能体问答热词
            </h2>
            <p className="text-[10px] text-slate-400 mb-4 font-medium">
              基于设备实时反馈与学生问答数据生成的实时云图
            </p>
            <div className="flex-1 w-full bg-slate-50/50 rounded-xl border border-slate-100/50 overflow-hidden">
              <QuestionWordCloud />
            </div>
          </div>
          <div className="flex-1 min-w-0 bg-white border border-purple-100 rounded-2xl p-5 flex flex-col shadow-sm relative overflow-hidden">
            {/* Header with Title and Simple Tabs */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> 运营贡献榜
              </h2>
              <div className="flex gap-4">
                {[
                  { id: 'agent', label: '智能体' },
                  { id: 'lab', label: '实训室' },
                  { id: 'user', label: '实训达人' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRankTab(tab.id as 'agent' | 'lab' | 'user')}
                    className={cn(
                      "text-[12px] font-bold transition-all relative py-1",
                      activeRankTab === tab.id 
                        ? "text-indigo-600" 
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {tab.label}
                    {activeRankTab === tab.id && (
                      <motion.div 
                        layoutId="rankTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <tr>
                    <th className="pb-3 pt-1 font-medium w-12 text-center">排名</th>
                    <th className="pb-3 pt-1 font-medium">名称</th>
                    <th className="pb-3 pt-1 font-medium text-right">累计时长 (h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(activeRankTab === 'agent' ? agentRankData : activeRankTab === 'lab' ? labRankData : userRankData).map((item, i) => (
                    <tr key={item.name} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3.5 text-center">
                        <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold", 
                          i === 0 ? "bg-amber-100 text-amber-600 shadow-sm" : 
                          i === 1 ? "bg-slate-100 text-slate-600 shadow-sm" : 
                          i === 2 ? "bg-orange-100 text-orange-600 shadow-sm" : "text-slate-400 bg-transparent")}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex flex-col justify-center min-w-0">
                          <span className="font-bold text-slate-700 text-[13px] truncate">{item.name}</span>
                          {/* Subtitle based on tab */}
                          {activeRankTab === 'lab' && <span className="text-[10px] text-slate-400 truncate">{(item as any).asset}</span>}
                          {activeRankTab === 'user' && <span className="text-[10px] text-slate-400 truncate">{(item as any).class}</span>}
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-indigo-600 text-[13px]">{item.duration}</td>
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
