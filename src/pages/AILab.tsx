import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Trash2, Edit, Settings, Video, Cpu, AlertTriangle, CheckCircle2, XCircle, Clock, Activity, FolderTree, LayoutGrid, List, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import AssetTree from '../components/AssetTree';

const labs = [
  { id: 1, name: '物联网综合实训室', asset: 'A栋-301', isAI: true, isOnline: true, hasLiveView: true, recentUse: '10分钟前', recentDuration: '2小时', rank: 1, warning: false, agentCount: 24, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: '人工智能基础实验室', asset: 'B栋-205', isAI: true, isOnline: true, hasLiveView: true, recentUse: '1小时前', recentDuration: '4小时', rank: 2, warning: false, agentCount: 30, image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: '工业互联网实训中心', asset: 'C栋-101', isAI: false, isOnline: false, hasLiveView: false, recentUse: '3天前', recentDuration: '1小时', rank: 15, warning: true, agentCount: 0, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: '大数据分析实训室', asset: 'B栋-202', isAI: true, isOnline: true, hasLiveView: true, recentUse: '2小时前', recentDuration: '3小时', rank: 5, warning: false, agentCount: 40, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: '网络安全实训室', asset: 'C栋-302', isAI: true, isOnline: false, hasLiveView: true, recentUse: '5小时前', recentDuration: '2.5小时', rank: 8, warning: false, agentCount: 30, image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: '智能制造车间', asset: 'D栋-102', isAI: true, isOnline: true, hasLiveView: false, recentUse: '昨天', recentDuration: '8小时', rank: 3, warning: false, agentCount: 80, image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: '嵌入式系统实验室', asset: 'A栋-405', isAI: true, isOnline: true, hasLiveView: true, recentUse: '30分钟前', recentDuration: '1.5小时', rank: 4, warning: false, agentCount: 20, image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80' },
  { id: 8, name: '机器人实训基地', asset: 'D栋-201', isAI: true, isOnline: false, hasLiveView: true, recentUse: '2天前', recentDuration: '5小时', rank: 10, warning: false, agentCount: 15, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80' },
  { id: 9, name: '云计算实训中心', asset: 'B栋-501', isAI: true, isOnline: true, hasLiveView: false, recentUse: '1小时前', recentDuration: '6小时', rank: 6, warning: false, agentCount: 50, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
  { id: 10, name: '虚拟现实实验室', asset: 'C栋-404', isAI: true, isOnline: true, hasLiveView: true, recentUse: '4小时前', recentDuration: '2小时', rank: 12, warning: false, agentCount: 12, image: 'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?auto=format&fit=crop&w=800&q=80' },
  { id: 11, name: '深度学习计算中心', asset: 'B栋-305', isAI: true, isOnline: true, hasLiveView: true, recentUse: '20分钟前', recentDuration: '5小时', rank: 7, warning: false, agentCount: 35, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc91?auto=format&fit=crop&w=800&q=80' },
  { id: 12, name: '自然语言处理实验室', asset: 'A栋-201', isAI: true, isOnline: true, hasLiveView: true, recentUse: '2小时前', recentDuration: '3.5小时', rank: 9, warning: false, agentCount: 25, image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80' },
  { id: 13, name: '无人驾驶模拟室', asset: 'D栋-301', isAI: true, isOnline: true, hasLiveView: true, recentUse: '45分钟前', recentDuration: '4小时', rank: 11, warning: false, agentCount: 18, image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80' },
  { id: 14, name: '物联网创新实验室', asset: 'A栋-303', isAI: true, isOnline: false, hasLiveView: true, recentUse: '3天前', recentDuration: '2小时', rank: 16, warning: true, agentCount: 22, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { id: 15, name: '边缘计算实训室', asset: 'B栋-401', isAI: true, isOnline: true, hasLiveView: true, recentUse: '1.5小时前', recentDuration: '3小时', rank: 13, warning: false, agentCount: 28, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
  { id: 16, name: 'AR/VR 交互实验室', asset: 'C栋-405', isAI: true, isOnline: true, hasLiveView: false, recentUse: '5小时前', recentDuration: '1.5小时', rank: 14, warning: false, agentCount: 10, image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80' },
  { id: 17, name: '区块链应用中心', asset: 'B栋-206', isAI: true, isOnline: false, hasLiveView: true, recentUse: '1周前', recentDuration: '1小时', rank: 18, warning: true, agentCount: 15, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80' },
  { id: 18, name: '智慧医疗实验室', asset: 'A栋-501', isAI: true, isOnline: true, hasLiveView: false, recentUse: '3小时前', recentDuration: '2.5小时', rank: 17, warning: false, agentCount: 20, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80' },
];

const terminals = [
  { id: 1, ip: '192.168.1.101', model: 'NL-AGENT-V1', recentTime: '2026-03-28 10:00', recentUser: 'student_01', lab: '物联网综合实训室', totalTime: '120h', bootCount: 45, isOnline: true },
  { id: 2, ip: '192.168.1.102', model: 'NL-AGENT-V1', recentTime: '2026-03-28 09:30', recentUser: 'student_02', lab: '物联网综合实训室', totalTime: '98h', bootCount: 32, isOnline: false },
  { id: 3, ip: '192.168.2.50', model: 'NL-AGENT-PRO', recentTime: '2026-03-27 14:00', recentUser: 'teacher_li', lab: '人工智能基础实验室', totalTime: '250h', bootCount: 120, isOnline: true },
];

const initialAssets = [
  { id: 1, name: 'A栋教学楼', parentId: null, remarks: '主教学楼' },
  { id: 2, name: '3层', parentId: 1, remarks: '计算机学院' },
  { id: 3, name: '301实训室', parentId: 2, remarks: '物联网综合实训室' },
  { id: 4, name: 'B栋实验楼', parentId: null, remarks: '实验大楼' },
  { id: 5, name: '2层', parentId: 4, remarks: '人工智能学院' },
  { id: 6, name: '205实验室', parentId: 5, remarks: '人工智能基础实验室' },
];

export default function AILab() {
  const [activeTab, setActiveTab] = useState<'labs' | 'terminals' | 'assets'>('labs');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('usage');
  const [visibleCount, setVisibleCount] = useState(18);
  const [selectedLiveLab, setSelectedLiveLab] = useState<any>(null);

  // Asset Management State
  const [assets, setAssets] = useState(initialAssets);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [assetFormData, setAssetFormData] = useState({ name: '', parentId: '', remarks: '' });

  // Asset Tree Search State
  const [isAssetTreeOpen, setIsAssetTreeOpen] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [expandedAssetIds, setExpandedAssetIds] = useState<number[]>([1, 4]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setVisibleCount(prev => Math.min(prev + 4, labs.length));
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleOpenAssetModal = (asset?: any) => {
    if (asset) {
      setEditingAsset(asset);
      setAssetFormData({ name: asset.name, parentId: asset.parentId ? String(asset.parentId) : '', remarks: asset.remarks });
    } else {
      setEditingAsset(null);
      setAssetFormData({ name: '', parentId: '', remarks: '' });
    }
    setIsAssetModalOpen(true);
  };

  const handleDeleteAsset = (id: number) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const handleSaveAsset = () => {
    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? { ...a, name: assetFormData.name, parentId: assetFormData.parentId ? Number(assetFormData.parentId) : null, remarks: assetFormData.remarks } : a));
    } else {
      setAssets([...assets, { id: Date.now(), name: assetFormData.name, parentId: assetFormData.parentId ? Number(assetFormData.parentId) : null, remarks: assetFormData.remarks }]);
    }
    setIsAssetModalOpen(false);
  };

  const getParentName = (parentId: number | null) => {
    if (!parentId) return '-';
    const parent = assets.find(a => a.id === parentId);
    return parent ? parent.name : '-';
  };

  const filteredAssets = assets.filter(a => a.name.includes(assetSearchQuery) || getParentName(a.parentId).includes(assetSearchQuery));

  const toggleAssetSelection = (id: number) => {
    setSelectedAssetIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAssetExpansion = (id: number) => {
    setExpandedAssetIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const labCounts = assets.reduce((acc, asset) => {
    acc[asset.id] = labs.filter(lab => lab.asset.includes(asset.name) || lab.name.includes(asset.name)).length;
    return acc;
  }, {} as Record<number, number>);

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.name.includes(searchQuery) || lab.asset.includes(searchQuery);
    const matchesAssets = selectedAssetIds.length === 0 || selectedAssetIds.some(id => {
      const asset = assets.find(a => a.id === id);
      return asset && (lab.asset.includes(asset.name) || lab.name.includes(asset.name));
    });
    return matchesSearch && matchesAssets;
  }).sort((a, b) => {
    if (sortBy === 'usage') return a.rank - b.rank;
    if (sortBy === 'duration') return parseFloat(b.recentDuration) - parseFloat(a.recentDuration);
    return 0; // Default or recent
  });

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header - Non-sticky */}
      <div className="p-8 pb-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI 实训室</h1>
              <p className="text-slate-500 mt-2">实训室资产、终端设备及运行状态全维度管理</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8">
            <button
              onClick={() => setActiveTab('labs')}
              className={cn(
                "pb-4 text-lg font-medium transition-colors relative",
                activeTab === 'labs' ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              实训室管理
              {activeTab === 'labs' && (
                <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('terminals')}
              className={cn(
                "pb-4 text-lg font-medium transition-colors relative",
                activeTab === 'terminals' ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              终端管理
              {activeTab === 'terminals' && (
                <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={cn(
                "pb-4 text-lg font-medium transition-colors relative",
                activeTab === 'assets' ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              资产管理
              {activeTab === 'assets' && (
                <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sticky Sub-header */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'labs' ? (
                <div className="flex gap-6 pt-6">
                  <div className="w-64 flex-shrink-0">
                    <AssetTree 
                      assets={assets}
                      selectedAssetIds={selectedAssetIds}
                      expandedAssetIds={expandedAssetIds}
                      onToggleSelection={toggleAssetSelection}
                      onToggleExpansion={toggleAssetExpansion}
                      showCount={true}
                      labCounts={labCounts}
                    />
                  </div>
                  <div className="flex-1 space-y-6">
                    {/* Sticky Filter Bar */}
                    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-2xl">
                      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                            <Plus className="w-4 h-4" /> 新增实训室
                          </button>
                          <div className="h-6 w-px bg-slate-200 mx-1" />
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button 
                              onClick={() => setViewMode('grid')}
                              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-purple-600" : "text-slate-400 hover:text-slate-600")}
                            >
                              <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setViewMode('list')}
                              className={cn("p-1.5 rounded-lg transition-all", viewMode === 'list' ? "bg-white shadow-sm text-purple-600" : "text-slate-400 hover:text-slate-600")}
                            >
                              <List className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                          {/* Flattened Sorting */}
                          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                            <button 
                              onClick={() => setSortBy('usage')}
                              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all", sortBy === 'usage' ? "bg-white shadow-sm text-purple-600" : "text-slate-500 hover:text-slate-700")}
                            >
                              按使用率
                            </button>
                            <button 
                              onClick={() => setSortBy('duration')}
                              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all", sortBy === 'duration' ? "bg-white shadow-sm text-purple-600" : "text-slate-500 hover:text-slate-700")}
                            >
                              按时长
                            </button>
                            <button 
                              onClick={() => setSortBy('recent')}
                              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all", sortBy === 'recent' ? "bg-white shadow-sm text-purple-600" : "text-slate-500 hover:text-slate-700")}
                            >
                              按最近
                            </button>
                          </div>

                          <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="搜索名称..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Grid / List View */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredLabs.slice(0, visibleCount).map(lab => (
                          <div 
                            key={lab.id} 
                            className={cn(
                              "bg-white rounded-2xl overflow-hidden border transition-all group relative",
                              lab.isOnline ? "border-emerald-400 shadow-lg shadow-emerald-100/50" : "border-slate-200 shadow-sm",
                              lab.isOnline && "ring-2 ring-emerald-400/20 ring-offset-0"
                            )}
                          >
                            <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                              <img src={lab.image} alt={lab.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              {lab.isOnline && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm z-10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> 在线
                                </div>
                              )}
                              {lab.warning && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full flex items-center gap-1 z-10">
                                  <AlertTriangle className="w-3 h-3" /> 长期未使用
                                </div>
                              )}
                              {/* Gradient Border Overlay for Online Labs */}
                              {lab.isOnline && (
                                <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-br from-emerald-400/20 to-transparent pointer-events-none" />
                              )}
                            </div>
                            <div className="p-3">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-xs font-bold text-slate-900 line-clamp-1" title={lab.name}>{lab.name}</h3>
                              </div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{lab.asset}</span>
                                <span className="text-[9px] text-slate-400">•</span>
                                <span className="text-[9px] text-slate-500">{lab.agentCount} 台</span>
                              </div>
                              
                              <div className="flex flex-col gap-1 text-[10px] text-slate-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                                  <span className="truncate">{lab.recentUse}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Activity className="w-2.5 h-2.5 text-slate-400" />
                                  <span className="truncate">使用率第 {lab.rank} 名</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button 
                                  disabled={!lab.hasLiveView}
                                  onClick={() => setSelectedLiveLab(lab)}
                                  className={cn(
                                    "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                                    lab.hasLiveView 
                                      ? "bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200" 
                                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  )}
                                >
                                  <Video className="w-3.5 h-3.5" /> 实时画面
                                </button>
                                <button className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors border border-slate-200">
                                  <Settings className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                              <th className="px-6 py-4">实训室名称</th>
                              <th className="px-6 py-4">资产位置</th>
                              <th className="px-6 py-4">终端数量</th>
                              <th className="px-6 py-4">最近使用</th>
                              <th className="px-6 py-4">状态</th>
                              <th className="px-6 py-4 text-right">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredLabs.slice(0, visibleCount).map(lab => (
                              <tr key={lab.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                      <img src={lab.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-slate-900">{lab.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{lab.asset}</td>
                                <td className="px-6 py-4 text-slate-600">{lab.agentCount} 台</td>
                                <td className="px-6 py-4 text-slate-500">{lab.recentUse}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    {lab.isOnline ? (
                                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500" /> 在线
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-bold border border-slate-200">
                                        离线
                                      </span>
                                    )}
                                    {lab.warning && (
                                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-100">
                                        闲置
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button 
                                      disabled={!lab.hasLiveView}
                                      onClick={() => setSelectedLiveLab(lab)}
                                      className={cn(
                                        "p-2 rounded-lg transition-all",
                                        lab.hasLiveView ? "text-purple-600 hover:bg-purple-50" : "text-slate-300 cursor-not-allowed"
                                      )}
                                    >
                                      <Video className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Infinite Scroll Indicator */}
                    {visibleCount < filteredLabs.length && (
                      <div className="py-8 flex justify-center">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Activity className="w-4 h-4 animate-spin" />
                          正在加载更多...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'terminals' ? (
              <div className="space-y-6">
                {/* Terminal Actions & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <select className="text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer">
                      <option>按最近上线时长排序</option>
                      <option>按上线总时长排序</option>
                      <option>按开机次数排序</option>
                    </select>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索终端名称、实训室、资产或账号..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Terminals Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <tr>
                          <th className="px-6 py-4">终端 IP</th>
                          <th className="px-6 py-4">型号</th>
                          <th className="px-6 py-4">归属实训室</th>
                          <th className="px-6 py-4">最近上线时间</th>
                          <th className="px-6 py-4">最近账号</th>
                          <th className="px-6 py-4">总时长</th>
                          <th className="px-6 py-4">开机次数</th>
                          <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {terminals.map(term => (
                          <tr key={term.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-slate-900">{term.ip}</td>
                            <td className="px-6 py-4 text-slate-600">{term.model}</td>
                            <td className="px-6 py-4 text-slate-900 font-medium">{term.lab}</td>
                            <td className="px-6 py-4 text-slate-500">{term.recentTime}</td>
                            <td className="px-6 py-4 text-slate-600">{term.recentUser}</td>
                            <td className="px-6 py-4 text-slate-600">{term.totalTime}</td>
                            <td className="px-6 py-4 text-slate-600">{term.bootCount}</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-purple-600 hover:text-purple-700 font-medium mr-4">日志</button>
                              <button className="text-blue-600 hover:text-blue-700 font-medium">更改归属</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Assets Actions & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleOpenAssetModal()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                      <Plus className="w-4 h-4" /> 新增资产
                    </button>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索资产名称..."
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Assets Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <tr>
                          <th className="px-6 py-4">资产名称</th>
                          <th className="px-6 py-4">上级资产</th>
                          <th className="px-6 py-4">备注</th>
                          <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                          <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                              <FolderTree className="w-4 h-4 text-slate-400" />
                              {asset.name}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {getParentName(asset.parentId)}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{asset.remarks || '-'}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleOpenAssetModal(asset)} className="text-purple-600 hover:text-purple-700 font-medium mr-4">修改</button>
                              <button onClick={() => handleDeleteAsset(asset.id)} className="text-red-600 hover:text-red-700 font-medium">删除</button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                              没有找到匹配的资产
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Add Lab Modal */}
        <AnimatePresence>
          {selectedLiveLab && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col aspect-video border border-slate-700"
              >
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-lg font-bold text-white">{selectedLiveLab.name} - 实时监控</h3>
                  </div>
                  <button onClick={() => setSelectedLiveLab(null)} className="text-slate-400 hover:text-white transition-colors">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 relative bg-black flex items-center justify-center">
                  <img 
                    src={selectedLiveLab.image} 
                    alt="Live Stream" 
                    className="w-full h-full object-cover opacity-60 blur-sm absolute inset-0" 
                  />
                  <div className="relative z-10 text-center">
                    <Video className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white font-medium">正在连接实时视频流...</p>
                    <p className="text-slate-500 text-sm mt-2">加密通道: AES-256 | 帧率: 30fps</p>
                  </div>
                  
                  {/* Overlay Controls */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs rounded-full border border-white/10">REC 00:45:12</span>
                      <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-xs rounded-full border border-emerald-500/30">1080P HD</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"><Settings className="w-4 h-4" /></button>
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"><Activity className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">新增实训室</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">实训室名称 <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="例如：物联网综合实训室" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">关联资产</label>
                      <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">选择关联资产</option>
                        {assets.map(asset => (
                          <option key={asset.id} value={asset.id}>{asset.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">实训室图片</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className="text-sm text-slate-600 font-medium">点击或拖拽上传图片</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <input type="checkbox" id="isAI" className="w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    <label htmlFor="isAI" className="text-sm font-medium text-purple-900 cursor-pointer">接入硬件智能体系统 (AI 化改造)</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">实训室概况介绍</label>
                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none" placeholder="建设背景、用途介绍等..." />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                    取消
                  </button>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                    保存
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add/Edit Asset Modal */}
        <AnimatePresence>
          {isAssetModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{editingAsset ? '修改资产' : '新增资产'}</h3>
                  <button onClick={() => setIsAssetModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">资产名称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={assetFormData.name}
                      onChange={(e) => setAssetFormData({...assetFormData, name: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="例如：A栋教学楼" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">上级资产</label>
                    <select 
                      value={assetFormData.parentId}
                      onChange={(e) => setAssetFormData({...assetFormData, parentId: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">无 (作为顶级资产)</option>
                      {assets.filter(a => a.id !== editingAsset?.id).map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
                    <textarea 
                      value={assetFormData.remarks}
                      onChange={(e) => setAssetFormData({...assetFormData, remarks: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none" 
                      placeholder="资产相关备注信息..." 
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => setIsAssetModalOpen(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                    取消
                  </button>
                  <button onClick={handleSaveAsset} className="px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                    保存
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}
