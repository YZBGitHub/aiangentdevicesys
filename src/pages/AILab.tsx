import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Trash2, Edit, Settings, Video, Cpu, AlertTriangle, CheckCircle2, XCircle, Clock, Activity, FolderTree, LayoutGrid, List, ChevronRight, ChevronDown, Filter, FileText, ArrowRightLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const labs = [
  { id: 1, name: '物联网综合实训室', assetId: 7, asset: 'A栋-101', isAI: true, isOnline: true, hasLiveView: true, recentUse: '10分钟前', recentDuration: '2小时', rank: 1, warning: false, agentCount: 24, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: '嵌入式系统实验室', assetId: 8, asset: 'A栋-102', isAI: true, isOnline: true, hasLiveView: true, recentUse: '30分钟前', recentDuration: '1.5小时', rank: 4, warning: false, agentCount: 20, image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: '人工智能基础实验室', assetId: 6, asset: 'B栋-205', isAI: true, isOnline: true, hasLiveView: true, recentUse: '1小时前', recentDuration: '4小时', rank: 2, warning: false, agentCount: 30, image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: '大数据分析实训室', assetId: 12, asset: 'B栋-402', isAI: true, isOnline: true, hasLiveView: true, recentUse: '2小时前', recentDuration: '3小时', rank: 5, warning: false, agentCount: 40, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80' },
  { id: 11, name: '深度学习计算中心', assetId: 10, asset: 'A栋-305', isAI: true, isOnline: true, hasLiveView: true, recentUse: '20分钟前', recentDuration: '5小时', rank: 7, warning: false, agentCount: 35, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc91?auto=format&fit=crop&w=800&q=80' },
  { id: 13, name: '机器人实训基地', assetId: 15, asset: 'C栋-101', isAI: true, isOnline: true, hasLiveView: true, recentUse: '45分钟前', recentDuration: '4小时', rank: 11, warning: false, agentCount: 18, image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80' },
  { id: 9, name: 'AI 计算实验中心', assetId: 9, asset: 'A栋-301', isAI: true, isOnline: true, hasLiveView: false, recentUse: '1小时前', recentDuration: '6小时', rank: 6, warning: false, agentCount: 50, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: '智能制造柔性车间', assetId: 6, asset: 'B栋-205', isAI: true, isOnline: true, hasLiveView: false, recentUse: '昨天', recentDuration: '8小时', rank: 3, warning: false, agentCount: 80, image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: '工业互联网实训中心', assetId: 5, asset: 'B栋-2层', isAI: false, isOnline: false, hasLiveView: false, recentUse: '3天前', recentDuration: '1小时', rank: 15, warning: true, agentCount: 0, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80' },
];

const initialTerminals = [
  { id: 1, ip: '192.168.1.101', model: 'NL-AGENT-V1', recentTime: '2026-03-28 10:00', recentUser: 'student_01', lab: '物联网综合实训室', totalTime: '120h', bootCount: 45, isOnline: true },
  { id: 2, ip: '192.168.1.102', model: 'NL-AGENT-V1', recentTime: '2026-03-28 09:30', recentUser: 'student_02', lab: '物联网综合实训室', totalTime: '98h', bootCount: 32, isOnline: true },
  { id: 3, ip: '192.168.2.50', model: 'NL-AGENT-PRO', recentTime: '2026-03-27 14:00', recentUser: 'teacher_li', lab: '人工智能基础实验室', totalTime: '250h', bootCount: 120, isOnline: false },
  { id: 4, ip: '192.168.3.10', model: 'NL-AGENT-V2', recentTime: '2026-03-29 08:15', recentUser: 'student_03', lab: '大数据分析实训室', totalTime: '55h', bootCount: 15, isOnline: true },
  { id: 5, ip: '192.168.3.11', model: 'NL-AGENT-V2', recentTime: '2026-03-26 16:20', recentUser: 'student_04', lab: '大数据分析实训室', totalTime: '60h', bootCount: 20, isOnline: false },
];

const mockLogs = [
  { id: 1, time: '2026-03-28 10:00', type: '上线', duration: '-', text: '设备成功接入管理网络' },
  { id: 2, time: '2026-03-28 14:30', type: '下线', duration: '4小时30分', text: '设备主动断开连接' },
  { id: 3, time: '2026-03-29 08:00', type: '开机', duration: '-', text: '系统启动，完成硬件自检' },
  { id: 4, time: '2026-03-29 08:05', type: '上线', duration: '-', text: '设备成功接入管理网络' },
  { id: 5, time: '2026-03-29 11:20', type: '异常', duration: '-', text: '检测到 CPU 温度过高 (85°C)' },
];

const initialAssets = [
  { id: 1, name: 'A栋 智能教学楼', parentId: null, remarks: '主教学区' },
  { id: 2, name: '1层 基础实验区', parentId: 1, remarks: '计算机学院' },
  { id: 7, name: '101 物联网实训室', parentId: 2, remarks: '智能感知中心' },
  { id: 8, name: '102 嵌入式实验室', parentId: 2, remarks: '微机原理' },
  { id: 3, name: '3层 创新孵化区', parentId: 1, remarks: '人工智能学院' },
  { id: 9, name: '301 AI 计算中心', parentId: 3, remarks: '高性能计算' },
  { id: 10, name: '305 深度学习中心', parentId: 3, remarks: '模型训练' },
  
  { id: 4, name: 'B栋 科研实验楼', parentId: null, remarks: '科研与前沿技术' },
  { id: 5, name: '2层 工业互联区', parentId: 4, remarks: '智能制造学院' },
  { id: 6, name: '205 智能柔性车间', parentId: 5, remarks: '工业4.0示范' },
  { id: 11, name: '4层 数据科学区', parentId: 4, remarks: '大数据中心' },
  { id: 12, name: '402 大数据实训室', parentId: 11, remarks: '数据挖掘' },
  
  { id: 13, name: 'C栋 产教集聚中心', parentId: null, remarks: '校企合作' },
  { id: 14, name: '1层 机器人基地', parentId: 13, remarks: '自动化学院' },
  { id: 15, name: '101 协作机器人室', parentId: 14, remarks: '人机协作' },
];

export default function AILab() {
  const [activeTab, setActiveTab] = useState<'labs' | 'terminals' | 'assets'>('labs');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('usage');
  const [visibleCount, setVisibleCount] = useState(18);
  const [selectedLiveLab, setSelectedLiveLab] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [warningFilter, setWarningFilter] = useState<boolean>(false);

  // Terminal Management State
  const [terminalsList, setTerminalsList] = useState(initialTerminals);
  const [terminalSortBy, setTerminalSortBy] = useState<'recent' | 'total' | 'boot'>('recent');
  const [selectedTerminalTreeIds, setSelectedTerminalTreeIds] = useState<string[]>([]);
  const [terminalOnlineStatus, setTerminalOnlineStatus] = useState<'all'|'online'|'offline'>('all');
  const [terminalTimeRange, setTerminalTimeRange] = useState<'all'|'today'|'week'>('all');
  const [terminalLogModalData, setTerminalLogModalData] = useState<any>(null);
  const [changeLabModalData, setChangeLabModalData] = useState<any>(null);

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
  const [expandedAssetTableIds, setExpandedAssetTableIds] = useState<number[]>([]);

  // Initialize expandedAssetTableIds to all parents to default expand the list
  useEffect(() => {
    const parentIds = Array.from(new Set(initialAssets.map(a => a.parentId).filter(Boolean))) as number[];
    setExpandedAssetTableIds(parentIds);
  }, []);

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

  const toggleAssetTableExpanded = (id: number) => {
    setExpandedAssetTableIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAssetExpansion = (id: number) => {
    setExpandedAssetIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getDescendants = (pId: number): number[] => {
    const kids = assets.filter(x => x.parentId === pId).map(x => x.id);
    return [...kids, ...kids.flatMap(getDescendants)];
  };

  const renderAssetTree = (parentId: number | null = null, level = 0) => {
    const children = assets.filter(a => a.parentId === parentId);
    if (children.length === 0) return null;

    return (
      <div className={cn("space-y-1", level > 0 && "ml-4 border-l border-slate-100 pl-2")}>
        {children.map(asset => {
          const hasChildren = assets.some(a => a.parentId === asset.id);
          const isExpanded = expandedAssetIds.includes(asset.id);
          const isSelected = selectedAssetIds.includes(asset.id);

          const relatedIds = [asset.id, ...getDescendants(asset.id)];
          const labCount = labs.filter(lab => relatedIds.includes(lab.assetId || 0)).length;

          return (
            <div key={asset.id}>
              <div 
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors group",
                  isSelected ? "bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] font-black" : "hover:bg-slate-50 text-slate-600"
                )}
                onClick={() => toggleAssetSelection(asset.id)}
              >
                {hasChildren ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAssetExpansion(asset.id);
                    }}
                    className="p-0.5 hover:bg-slate-200 rounded"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <div className="w-4.5" />
                )}
                <input 
                  type="checkbox" 
                  checked={isSelected} 
                  onChange={() => toggleAssetSelection(asset.id)} 
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/50 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm flex-1 truncate">{asset.name}</span>
                <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">{labCount}</span>
              </div>
              {hasChildren && isExpanded && renderAssetTree(asset.id, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.name.includes(searchQuery) || lab.asset.includes(searchQuery);
    
    let matchesAssets = selectedAssetIds.length === 0;
    if (!matchesAssets) {
      const getDescendants = (pId: number): number[] => {
        const kids = assets.filter(x => x.parentId === pId).map(x => x.id);
        return [...kids, ...kids.flatMap(getDescendants)];
      };
      let allSelectedIds: number[] = [];
      selectedAssetIds.forEach(id => {
        allSelectedIds = [...allSelectedIds, id, ...getDescendants(id)];
      });
      matchesAssets = allSelectedIds.includes(lab.assetId || 0);
    }
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'online' && lab.isOnline) ||
                         (statusFilter === 'offline' && !lab.isOnline);
                         
    const matchesWarning = !warningFilter || lab.warning;

    return matchesSearch && matchesAssets && matchesStatus && matchesWarning;
  }).sort((a, b) => {
    if (sortBy === 'usage') return a.rank - b.rank;
    if (sortBy === 'duration') return parseFloat(b.recentDuration) - parseFloat(a.recentDuration);
    return 0; // Default or recent
  });

  const toggleTerminalTreeSelection = (idStr: string) => {
    setSelectedTerminalTreeIds(prev => prev.includes(idStr) ? prev.filter(i => i !== idStr) : [...prev, idStr]);
  };

  const renderMixedTreeForTerminals = (parentId: number | null = null, level = 0) => {
    const childAssets = assets.filter(a => a.parentId === parentId);
    let childLabs: any[] = [];
    if (parentId !== null) {
      childLabs = labs.filter(l => l.assetId === parentId);
    }
    if (childAssets.length === 0 && childLabs.length === 0) return null;

    const getTerminalsForAsset = (id: number): number => {
      const descendants = [id, ...getDescendants(id)];
      const relatedLabNames = labs.filter(l => descendants.includes(l.assetId || 0)).map(l => l.name);
      return terminalsList.filter(t => relatedLabNames.includes(t.lab)).length;
    };

    const getTerminalsForLab = (labName: string): number => {
      return terminalsList.filter(t => t.lab === labName).length;
    };

    return (
      <div className={cn("space-y-1", level > 0 && "ml-4 border-l border-slate-100 pl-2 mt-1")}>
        {childAssets.map(asset => {
          const isSelected = selectedTerminalTreeIds.includes(`a_${asset.id}`);
          const count = getTerminalsForAsset(asset.id);
          return (
            <div key={`a_${asset.id}`}>
              <div 
                className={cn("flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors group", isSelected ? "bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] font-bold" : "hover:bg-slate-50 text-slate-600")}
                onClick={() => toggleTerminalTreeSelection(`a_${asset.id}`)}
              >
                <input type="checkbox" checked={isSelected} onChange={() => toggleTerminalTreeSelection(`a_${asset.id}`)} className="w-3.5 h-3.5 rounded border-slate-300 text-[var(--brand-coral)] cursor-pointer" onClick={(e) => e.stopPropagation()}/>
                <FolderTree className="w-3.5 h-3.5" />
                <span className="text-sm flex-1 truncate">{asset.name}</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">{count}</span>
              </div>
              {renderMixedTreeForTerminals(asset.id, level + 1)}
            </div>
          );
        })}
        {childLabs.map(lab => {
          const isSelected = selectedTerminalTreeIds.includes(`l_${lab.id}`);
          const count = getTerminalsForLab(lab.name);
          return (
            <div key={`l_${lab.id}`} className={cn("flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ml-4 group", isSelected ? "bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] font-bold" : "hover:bg-slate-50 text-slate-500")} onClick={() => toggleTerminalTreeSelection(`l_${lab.id}`)}>
              <input type="checkbox" checked={isSelected} onChange={() => toggleTerminalTreeSelection(`l_${lab.id}`)} className="w-3.5 h-3.5 rounded border-slate-300 text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/50 cursor-pointer" onClick={(e) => e.stopPropagation()}/>
              <span className="text-sm truncate opacity-90 flex-1">{lab.name}</span>
              <span className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-400 font-medium group-hover:text-[var(--brand-coral)] group-hover:bg-[var(--brand-coral)]/5">{count}</span>
            </div>
          )
        })}
      </div>
    );
  };

  const handleChangeLabSubmit = (newLabName: string) => {
    setTerminalsList(prev => prev.map(t => t.id === changeLabModalData.id ? { ...t, lab: newLabName } : t));
    setChangeLabModalData(null);
  };

  const filteredTerminals = terminalsList.filter(term => {
    const matchesSearch = term.ip.includes(searchQuery) || term.model.includes(searchQuery) || term.lab.includes(searchQuery) || term.recentUser.includes(searchQuery);
    
    const matchesStatus = terminalOnlineStatus === 'all' || 
                          (terminalOnlineStatus === 'online' && term.isOnline) ||
                          (terminalOnlineStatus === 'offline' && !term.isOnline);
    
    const matchesTime = terminalTimeRange === 'all' || true; // Placeholder filter logic
    
    let matchesTree = true;
    if (selectedTerminalTreeIds.length > 0) {
      const termLabObj = labs.find(l => l.name === term.lab);
      if (termLabObj) {
        const isLabExplicitlySelect = selectedTerminalTreeIds.includes(`l_${termLabObj.id}`);
        const belongsToSelectedAsset = selectedTerminalTreeIds.some(idStr => {
          if (idStr.startsWith('a_')) {
            const assetId = Number(idStr.replace('a_', ''));
            const ancestorIds = [assetId, ...getDescendants(assetId)];
            return ancestorIds.includes(termLabObj.assetId || 0);
          }
          return false;
        });
        matchesTree = isLabExplicitlySelect || belongsToSelectedAsset;
      } else {
        matchesTree = false;
      }
    }

    return matchesSearch && matchesTree && matchesStatus && matchesTime;
  }).sort((a, b) => {
    if (terminalSortBy === 'boot') return b.bootCount - a.bootCount;
    if (terminalSortBy === 'total') return parseFloat(b.totalTime) - parseFloat(a.totalTime);
    return 0;
  });

  const renderAssetTableRows = (parentId: number | null = null, level = 0) => {
    // If searching, flatten tree and display linear results
    let nodesToRender = [];
    
    if (assetSearchQuery) {
      if (level > 0) return []; // Only render on root level
      nodesToRender = filteredAssets;
    } else {
      nodesToRender = assets.filter(a => a.parentId === parentId);
    }

    if (nodesToRender.length === 0) return [];

    return nodesToRender.flatMap(asset => {
      const hasChildren = !assetSearchQuery && assets.some(a => a.parentId === asset.id);
      const isExpanded = expandedAssetTableIds.includes(asset.id);
      
      const row = (
        <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
          <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
            <div style={{ width: assetSearchQuery ? 0 : level * 20 }} className="shrink-0" />
            {hasChildren ? (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleAssetTableExpanded(asset.id); }}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-90")} />
              </button>
            ) : (
              <div className="w-5" />
            )}
            <FolderTree className="w-4 h-4 text-slate-400" />
            {asset.name}
          </td>
          <td className="px-6 py-4 text-slate-600">
            {getParentName(asset.parentId)}
          </td>
          <td className="px-6 py-4 text-slate-500">{asset.remarks || '-'}</td>
          <td className="px-6 py-4 text-right">
            <button onClick={() => handleOpenAssetModal(asset)} className="text-[var(--brand-coral)] hover:text-[var(--brand-coral)]/80 font-medium mr-4 transition-colors">修改</button>
            <button onClick={() => handleDeleteAsset(asset.id)} className="text-red-600 hover:text-red-700 font-medium transition-colors">删除</button>
          </td>
        </tr>
      );

      const childrenRows = (hasChildren && isExpanded && !assetSearchQuery) ? renderAssetTableRows(asset.id, level + 1) : [];
      return [row, ...childrenRows];
    });
  };

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
                "pb-4 text-lg font-black transition-colors relative",
                activeTab === 'labs' ? "text-[var(--brand-coral)]" : "text-slate-500 hover:text-slate-900"
              )}
            >
              实训室管理
              {activeTab === 'labs' && (
                <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-coral)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('terminals')}
              className={cn(
                "pb-4 text-lg font-black transition-colors relative",
                activeTab === 'terminals' ? "text-[var(--brand-coral)]" : "text-slate-500 hover:text-slate-900"
              )}
            >
              终端管理
              {activeTab === 'terminals' && (
                <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-coral)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={cn(
                "pb-4 text-lg font-black transition-colors relative",
                activeTab === 'assets' ? "text-[var(--brand-coral)]" : "text-slate-500 hover:text-slate-900"
              )}
            >
              资产管理
              {activeTab === 'assets' && (
                <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-coral)]" />
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
                  <div className="flex gap-8 items-start h-full pt-8">
                    {/* Left Sidebar for Asset Tree - Aligned with list contents */}
                    <div className="w-72 bg-white border border-slate-200 rounded-3xl p-5 sticky top-24 shrink-0 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-12rem)] group/assets">
                      <div className="flex items-center justify-between mb-6 shrink-0">
                        <h3 className="text-sm font-black text-slate-900 border-l-4 border-[var(--brand-coral)] pl-3 uppercase tracking-wider">资产导航</h3>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-slate-400">{assets.length} 节点</span>
                           {selectedAssetIds.length > 0 && <button onClick={() => setSelectedAssetIds([])} className="text-xs text-[var(--brand-coral)] hover:underline font-bold">清空</button>}
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar-thin pr-1">
                        {renderAssetTree()}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 shrink-0">
                         <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">提示：勾选层级节点可快速筛选该区域下的所有实训室资源。</p>
                         </div>
                      </div>
                    </div>

                  {/* Right Content */}
                  <div className="flex-1 space-y-6 min-w-0">
                    {/* Sticky Filter Bar */}
                    <div className="sticky top-0 z-20 bg-[var(--brand-warm)]/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-2xl">
                      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-coral)] text-white rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--brand-coral)]/20">
                          <Plus className="w-4 h-4" /> 新增实训室
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-1" />
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                          <button 
                            onClick={() => setViewMode('grid')}
                            className={cn("p-1.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-[var(--brand-coral)]" : "text-slate-400 hover:text-slate-600")}
                          >
                            <LayoutGrid className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setViewMode('list')}
                            className={cn("p-1.5 rounded-lg transition-all", viewMode === 'list' ? "bg-white shadow-sm text-[var(--brand-coral)]" : "text-slate-400 hover:text-slate-600")}
                          >
                            <List className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-4 border-l border-slate-200 pl-4 h-8">
                           <div className="flex bg-slate-100 p-1 rounded-xl h-full">
                              <button 
                                onClick={() => setStatusFilter('all')}
                                className={cn("px-3 text-[11px] font-bold rounded-lg transition-all flex items-center", statusFilter === 'all' ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600")}
                              >
                                全部状态
                              </button>
                              <button 
                                onClick={() => setStatusFilter('online')}
                                className={cn("px-3 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5", statusFilter === 'online' ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600")}
                              >
                                <div className={cn("w-1.5 h-1.5 rounded-full bg-emerald-500", statusFilter === 'online' && "animate-pulse")} />
                                在线
                              </button>
                              <button 
                                onClick={() => setStatusFilter('offline')}
                                className={cn("px-3 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5", statusFilter === 'offline' ? "bg-white shadow-sm text-slate-600" : "text-slate-400 hover:text-slate-600")}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                离线
                              </button>
                           </div>

                           <button 
                             onClick={() => setWarningFilter(!warningFilter)}
                             className={cn(
                               "h-full px-3 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 border",
                               warningFilter 
                                ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm" 
                                : "bg-white border-slate-200 text-slate-500 hover:border-amber-200 hover:text-amber-500"
                             )}
                           >
                             <AlertTriangle className={cn("w-3.5 h-3.5", warningFilter && "animate-bounce")} />
                             长期未使用
                           </button>
                        </div>

                        <div className="flex items-center gap-2 flex-1 lg:flex-none">
                          <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="搜索名称..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30 focus:bg-white transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Activity Feed for Asset Selection */}
                    <AnimatePresence>
                      {selectedAssetIds.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="flex flex-wrap items-center gap-2 px-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">当前筛选资产:</span>
                            {selectedAssetIds.map(id => {
                              const assetName = assets.find(a => a.id === id)?.name;
                              return (
                                <span key={id} className="flex items-center gap-1 px-2 py-1 bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] rounded-full text-xs font-bold border border-[var(--brand-coral)]/20 animate-in fade-in zoom-in duration-300">
                                  {assetName}
                                  <button onClick={() => toggleAssetSelection(id)} className="hover:text-red-500"><XCircle className="w-3 h-3" /></button>
                                </span>
                              );
                            })}
                            <button onClick={() => setSelectedAssetIds([])} className="text-[10px] font-bold text-slate-400 hover:text-[var(--brand-coral)] underline underline-offset-4 transition-colors ml-1">重置所有</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grid / List View */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredLabs.slice(0, visibleCount).map(lab => (
                        <div 
                          key={lab.id} 
                          className={cn(
                            "bg-white rounded-3xl overflow-hidden border transition-all duration-500 group relative flex flex-col h-full",
                            lab.isOnline ? "border-emerald-400/50 shadow-xl shadow-emerald-100/30" : "border-slate-200 shadow-sm hover:shadow-md grayscale-[0.8] hover:grayscale-0",
                            lab.warning && !lab.isOnline && "border-amber-400 shadow-xl shadow-amber-100/50 grayscale-0"
                          )}
                        >
                          {/* Top Tag Bar */}
                          <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-center pointer-events-none">
                            {lab.isOnline ? (
                              <div className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/30">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                在线
                              </div>
                            ) : (
                                <div className="px-2.5 py-1 bg-slate-600/80 backdrop-blur-md text-white text-[10px] font-black rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                                  <XCircle className="w-3.5 h-3.5" /> 离线
                                </div>
                            )}

                            {lab.warning && (
                              <div className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/40 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5" /> 长期未使用
                              </div>
                            )}
                          </div>

                          <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                             <img src={lab.image} alt={lab.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                             
                             {/* Gradient Overlay */}
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
                             
                             {/* Stream Effect for Online */}
                             {lab.isOnline && (
                               <div className="absolute inset-0 border-[3px] border-emerald-400/30 rounded-3xl animate-pulse pointer-events-none" />
                             )}
                          </div>

                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-[var(--brand-coral)] transition-colors">{lab.name}</h3>
                              </div>
                              <div className="flex items-center gap-1.5 mb-4">
                                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/50">{lab.asset}</span>
                                <span className="text-[10px] text-slate-300">•</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{lab.agentCount} 终端设备</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className={cn(
                                  "p-2 rounded-2xl flex flex-col gap-0.5 transition-colors",
                                  lab.isOnline ? "bg-emerald-50" : "bg-slate-50"
                                )}>
                                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">最近使用</span>
                                  <span className="text-[11px] font-bold text-slate-700 truncate">{lab.recentUse}</span>
                                </div>
                                <div className={cn(
                                  "p-2 rounded-2xl flex flex-col gap-0.5 transition-colors",
                                  lab.isOnline ? "bg-emerald-50" : "bg-slate-50"
                                )}>
                                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">活跃排名</span>
                                  <span className="text-[11px] font-bold text-slate-700">NO.{lab.rank} 位</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <button 
                                disabled={!lab.hasLiveView}
                                onClick={() => setSelectedLiveLab(lab)}
                                className={cn(
                                  "flex-1 py-2.5 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center gap-2",
                                  lab.hasLiveView 
                                   ? "bg-slate-900 text-white hover:bg-[var(--brand-coral)] shadow-lg shadow-slate-200" 
                                   : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                )}
                              >
                                <Video className="w-4 h-4" /> 实时画面
                              </button>
                              <button className="p-2.5 bg-white hover:bg-slate-50 text-slate-500 rounded-2xl transition-all border border-slate-200 hover:border-[var(--brand-coral)] hover:text-[var(--brand-coral)]">
                                <Settings className="w-4 h-4" />
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
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-200 shadow-sm">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 在线
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black border border-slate-200">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> 离线
                                    </span>
                                  )}
                                  {lab.warning && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-200 animate-pulse">
                                      <AlertTriangle className="w-3.5 h-3.5" /> 长期未使用
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
                                      lab.hasLiveView ? "text-[var(--brand-coral)] hover:bg-[var(--brand-coral)]/10" : "text-slate-300 cursor-not-allowed"
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
              <div className="flex gap-6 items-start h-full pt-6">
                {/* Left Sidebar for Mixed Tree */}
                <div className="w-64 bg-white border border-slate-200 rounded-2xl p-4 sticky top-6 shrink-0 shadow-sm overflow-hidden flex flex-col max-h-[80vh]">
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <h3 className="text-sm font-bold text-slate-900 border-l-4 border-[var(--brand-coral)] pl-2">实训室资产</h3>
                    {selectedTerminalTreeIds.length > 0 && <button onClick={() => setSelectedTerminalTreeIds([])} className="text-xs text-[var(--brand-coral)] hover:text-[var(--brand-coral)]/80 font-medium">清除选择</button>}
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2">
                    {renderMixedTreeForTerminals()}
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 space-y-6 min-w-0">
                  {/* Top Filters */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Flat sorting */}
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button onClick={() => setTerminalSortBy('recent')} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-all", terminalSortBy === 'recent' ? "bg-white shadow-sm text-purple-600" : "text-slate-500 hover:text-slate-700")}>按最近上线</button>
                        <button onClick={() => setTerminalSortBy('total')} className={cn("px-3 py-1.5 text-xs font-black rounded-lg transition-all", terminalSortBy === 'total' ? "bg-white shadow-sm text-[var(--brand-coral)]" : "text-slate-500 hover:text-slate-700")}>按总时长</button>
                        <button onClick={() => setTerminalSortBy('boot')} className={cn("px-3 py-1.5 text-xs font-black rounded-lg transition-all", terminalSortBy === 'boot' ? "bg-white shadow-sm text-[var(--brand-coral)]" : "text-slate-500 hover:text-slate-700")}>按开机次数</button>
                      </div>

                      {/* Status & Time */}
                      <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                        <select value={terminalOnlineStatus} onChange={e => setTerminalOnlineStatus(e.target.value as any)} className="text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-[var(--brand-coral)]/30">
                          <option value="all">状态：不限</option>
                          <option value="online">在线</option>
                          <option value="offline">离线</option>
                        </select>
                        <select value={terminalTimeRange} onChange={e => setTerminalTimeRange(e.target.value as any)} className="text-sm border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-[var(--brand-coral)]/30">
                          <option value="all">在线时间：不限</option>
                          <option value="today">今天</option>
                          <option value="week">最近一周</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative w-full md:w-64 ml-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="搜索终端名称、实训室、资产或账号..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Terminals Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <tr>
                          <th className="px-6 py-4">状态</th>
                          <th className="px-6 py-4">终端 IP / 型号</th>
                          <th className="px-6 py-4">归属实训室</th>
                          <th className="px-6 py-4">最近记录</th>
                          <th className="px-6 py-4">开机/时长</th>
                          <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredTerminals.map(term => (
                          <tr key={term.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              {term.isOnline ? (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 w-fit bg-emerald-50 text-emerald-600 rounded text-xs font-bold border border-emerald-100"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 在线</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded w-fit text-xs font-bold border border-slate-200">离线</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-mono text-slate-900 font-bold">{term.ip}</div>
                              <div className="text-xs text-slate-500">{term.model}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-medium">{term.lab}</td>
                            <td className="px-6 py-4">
                              <div className="text-slate-900 text-sm">{term.recentTime}</div>
                              <div className="text-xs text-slate-500">{term.recentUser}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-slate-900 text-sm">{term.totalTime}</div>
                              <div className="text-xs text-slate-500">已开机 {term.bootCount} 次</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                                <button onClick={() => setTerminalLogModalData(term)} className="px-2 py-1.5 text-xs font-bold text-[var(--brand-coral)] bg-[var(--brand-coral)]/5 hover:bg-[var(--brand-coral)]/10 rounded-lg transition-colors border border-[var(--brand-coral)]/10 flex items-center gap-1"><FileText className="w-3.5 h-3.5"/> 日志</button>
                                <button onClick={() => setChangeLabModalData(term)} className="px-2 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 flex items-center gap-1"><ArrowRightLeft className="w-3.5 h-3.5"/> 迁移</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Assets Actions & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleOpenAssetModal()} className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-coral)] text-white rounded-xl text-sm font-bold hover:bg-[var(--brand-coral)]/90 transition-all shadow-lg shadow-[var(--brand-coral)]/20">
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
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30 focus:bg-white transition-all"
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
                      <tbody className="divide-y divide-slate-100 border-none">
                        {filteredAssets.length > 0 ? (
                          renderAssetTableRows()
                        ) : (
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
                      <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30" placeholder="例如：物联网综合实训室" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">关联资产</label>
                      <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30">
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

                  <div className="flex items-center gap-3 p-4 bg-[var(--brand-coral)]/5 rounded-xl border border-[var(--brand-coral)]/10">
                    <input type="checkbox" id="isAI" className="w-5 h-5 rounded border-[var(--brand-coral)]/30 text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/50" defaultChecked />
                    <label htmlFor="isAI" className="text-sm font-bold text-[var(--brand-coral)] cursor-pointer">接入硬件智能体系统 (AI 化改造)</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">实训室概况介绍</label>
                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30 h-24 resize-none" placeholder="建设背景、用途介绍等..." />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                    取消
                  </button>
                  <button className="px-6 py-2 bg-[var(--brand-coral)] text-white rounded-xl text-sm font-bold hover:bg-[var(--brand-coral)]/90 transition-all shadow-lg shadow-[var(--brand-coral)]/20">
                    保存
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Terminal Log Modal */}
        <AnimatePresence>
          {terminalLogModalData && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                 <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">设备运行追踪日志 - {terminalLogModalData.ip}</h3>
                      <p className="text-xs text-slate-500 mt-1">归属：{terminalLogModalData.lab}</p>
                    </div>
                    <button onClick={() => setTerminalLogModalData(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><XCircle className="w-5 h-5"/></button>
                 </div>
                 <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white">
                   <input type="date" className="text-sm border border-slate-200 px-3 py-1.5 rounded-lg outline-none focus:border-[var(--brand-coral)]" />
                   <span className="text-slate-400 text-sm">至</span>
                   <input type="date" className="text-sm border border-slate-200 px-3 py-1.5 rounded-lg outline-none focus:border-[var(--brand-coral)]" />
                   <button className="px-4 py-1.5 bg-[var(--brand-coral)] text-white rounded-lg text-sm font-bold shadow-lg shadow-[var(--brand-coral)]/15 hover:bg-[var(--brand-coral)]/90">查询</button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-0">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium sticky top-0">
                       <tr><th className="px-6 py-3">动作类型</th><th className="px-6 py-3">发生时间</th><th className="px-6 py-3">持续时长</th><th className="px-6 py-3">日志详情</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {mockLogs.map(log => (
                         <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                             <span className={cn("px-2 py-1 text-xs font-bold rounded", log.type === '异常' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600')}>{log.type}</span>
                           </td>
                           <td className="px-6 py-4 text-slate-600 font-mono text-xs">{log.time}</td>
                           <td className="px-6 py-4 text-slate-600">{log.duration}</td>
                           <td className="px-6 py-4 text-slate-700">{log.text}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                 <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
                   <span>共 {mockLogs.length} 条记录</span>
                   <div className="flex gap-2">
                     <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 opacity-50 cursor-not-allowed">上一页</button>
                     <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 opacity-50 cursor-not-allowed">下一页</button>
                   </div>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Change Lab Modal */}
        <AnimatePresence>
          {changeLabModalData && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                 <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-900">更改设备归属</h3>
                   <button onClick={() => setChangeLabModalData(null)}><XCircle className="w-5 h-5 text-slate-400 hover:text-slate-600"/></button>
                 </div>
                 <div className="p-6">
                   <p className="text-sm text-slate-600 mb-4">将终端 <span className="font-mono font-bold text-slate-900">{changeLabModalData.ip}</span> 跨区迁移至新的实训室：</p>
                   <select id="newLabSelect" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)]/30">
                     {labs.map(l => (
                       <option key={l.id} value={l.name}>{l.name} ({l.asset})</option>
                     ))}
                   </select>
                 </div>
                 <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                   <button onClick={() => setChangeLabModalData(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium">取消</button>
                   <button onClick={() => {
                     const val = (document.getElementById('newLabSelect') as HTMLSelectElement).value;
                     handleChangeLabSubmit(val);
                   }} className="px-4 py-2 bg-[var(--brand-coral)] text-white hover:bg-[var(--brand-coral)]/90 rounded-xl text-sm font-bold shadow-lg shadow-[var(--brand-coral)]/15">确认迁移</button>
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
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30" 
                      placeholder="例如：A栋教学楼" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">上级资产</label>
                    <select 
                      value={assetFormData.parentId}
                      onChange={(e) => setAssetFormData({...assetFormData, parentId: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30"
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/30 h-24 resize-none" 
                      placeholder="资产相关备注信息..." 
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => setIsAssetModalOpen(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                    取消
                  </button>
                  <button onClick={handleSaveAsset} className="px-6 py-2 bg-[var(--brand-coral)] text-white rounded-xl text-sm font-bold hover:bg-[var(--brand-coral)]/90 transition-all shadow-lg shadow-[var(--brand-coral)]/20">
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
