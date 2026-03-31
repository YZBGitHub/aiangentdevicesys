import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Trash2, Download, Eye, Settings, FileText, CheckCircle2, XCircle, LayoutGrid, List, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../lib/utils';

const availableLabs = [
  '物联网综合实训室',
  '人工智能基础实验室',
  '工业互联网实训中心',
  '大数据分析实训室',
  '云计算网络实验室'
];

const systemReports = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `2026年${(i % 12) + 1}月${['全校实训室AI化运营月报', '实训室使用周报', '专项分析报告'][i % 3]}`,
  time: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String(((i * 3) % 28) + 1).padStart(2, '0')} 10:00`,
  lab: i % 4 === 0 ? '全部' : availableLabs[i % availableLabs.length],
  type: i % 3 === 0 ? '周报' : '月报'
}));

const myReports = Array.from({ length: 100 }, (_, i) => ({
  id: 100 + i,
  name: `${availableLabs[i % availableLabs.length]}${['春季学期分析', '设备利用率报告', '效能评估'][i % 3]}`,
  time: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String(((i * 2) % 28) + 1).padStart(2, '0')} 14:30`,
  lab: availableLabs[i % availableLabs.length],
  status: i % 5 === 0 ? '生成中' : '已生成'
}));

export default function OperationReport() {
  const [activeTab, setActiveTab] = useState<'system' | 'my'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New states
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [generateRange, setGenerateRange] = useState('all');
  const [isLabSelectModalOpen, setIsLabSelectModalOpen] = useState(false);
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [viewingReport, setViewingReport] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination states
  const [systemVisibleCount, setSystemVisibleCount] = useState(20);
  const [myVisibleCount, setMyVisibleCount] = useState(20);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (activeTab === 'system') {
            setSystemVisibleCount(prev => Math.min(prev + 20, 100));
          } else if (activeTab === 'my') {
            setMyVisibleCount(prev => Math.min(prev + 20, 100));
          }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, activeTab]);

  // My Reports specific states
  const [myViewMode, setMyViewMode] = useState<'grid' | 'list'>('grid');
  const [myStartDate, setMyStartDate] = useState('');
  const [myEndDate, setMyEndDate] = useState('');
  const [selectedMyReports, setSelectedMyReports] = useState<number[]>([]);

  const filterByDate = (dateStr: string, start: string, end: string) => {
    if (!start && !end) return true;
    const date = new Date(dateStr.split(' ')[0]);
    if (start && new Date(start) > date) return false;
    if (end && new Date(end) < date) return false;
    return true;
  };

  // Derived data for System Reports
  const filteredSystemReports = systemReports.filter(r => 
    (r.name.includes(searchQuery) || r.lab.includes(searchQuery)) &&
    filterByDate(r.time, startDate, endDate)
  );
  const currentSystemReports = filteredSystemReports.slice(0, systemVisibleCount);

  // Derived data for My Reports
  const filteredMyReports = myReports.filter(r => 
    (r.name.includes(searchQuery) || r.lab.includes(searchQuery)) &&
    filterByDate(r.time, myStartDate, myEndDate)
  );
  const currentMyReports = filteredMyReports.slice(0, myVisibleCount);

  const handleDownload = (reportName: string) => {
    // Simulate Word document download
    const element = document.createElement("a");
    const file = new Blob([`模拟的 Word 报告内容：\n\n报告名称：${reportName}\n生成时间：2026-03-28\n\n（此处为模拟导出的 Word 文档内容）`], {type: 'application/msword'});
    element.href = URL.createObjectURL(file);
    element.download = `${reportName}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleLabSelection = (lab: string) => {
    if (selectedLabs.includes(lab)) {
      setSelectedLabs(selectedLabs.filter(l => l !== lab));
    } else {
      setSelectedLabs([...selectedLabs, lab]);
    }
  };

  const toggleMyReportSelection = (id: number) => {
    if (selectedMyReports.includes(id)) {
      setSelectedMyReports(selectedMyReports.filter(rId => rId !== id));
    } else {
      setSelectedMyReports([...selectedMyReports, id]);
    }
  };

  const toggleAllMyReports = () => {
    if (selectedMyReports.length === currentMyReports.length) {
      setSelectedMyReports([]);
    } else {
      setSelectedMyReports(currentMyReports.map(r => r.id));
    }
  };

  const handleBatchDownload = () => {
    if (selectedMyReports.length === 0) return;
    const selectedNames = myReports.filter(r => selectedMyReports.includes(r.id)).map(r => r.name);
    // In a real app, this would generate a zip or multiple files
    alert(`模拟批量导出以下报告：\n${selectedNames.join('\n')}`);
  };

  const handleBatchDelete = () => {
    if (selectedMyReports.length === 0) return;
    // Note: window.confirm is not ideal in iframe, but using it for simulation
    alert(`模拟删除选中的 ${selectedMyReports.length} 份报告成功`);
    setSelectedMyReports([]);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">运营报告</h1>
            <p className="text-slate-500 mt-2">实训室 AI 化改造成效与智慧运营数据分析</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 mb-8 sticky top-24 z-30 bg-white/80 backdrop-blur-md -mx-8 px-8">
          <button
            onClick={() => setActiveTab('system')}
            className={cn(
              "pb-4 text-lg font-bold transition-all relative",
              activeTab === 'system' ? "text-[var(--brand-coral)] scale-105" : "text-slate-500 hover:text-slate-900"
            )}
          >
            系统报告
            {activeTab === 'system' && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-coral)] shadow-[0_0_8px_rgba(232,93,58,0.5)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={cn(
              "pb-4 text-lg font-bold transition-all relative",
              activeTab === 'my' ? "text-[var(--brand-coral)] scale-105" : "text-slate-500 hover:text-slate-900"
            )}
          >
            我的报告
            {activeTab === 'my' && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-coral)] shadow-[0_0_8px_rgba(232,93,58,0.5)]" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'system' ? (
              <div className="space-y-6">
                {/* System Report Settings Banner */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-coral)]/[0.03] rounded-full blur-3xl -mr-10 -mt-10 opacity-60 pointer-events-none group-hover:bg-[var(--brand-coral)]/[0.06] transition-colors duration-700"></div>
                  
                  {/* Right side controls (Button + Current Config) */}
                  <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-20">
                    <button 
                      onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                      <Settings className={cn("w-4 h-4 transition-transform duration-500", isSettingsExpanded ? "rotate-90 text-[var(--brand-coral)]" : "text-slate-400")} />
                      配置
                    </button>
                    <div className="bg-slate-50/80 backdrop-blur-sm border-r-4 border-[var(--brand-coral)] p-3 rounded-l-xl text-right shadow-sm">
                      <div className="font-black text-slate-900 text-sm">当前配置：月度报告</div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">下次生成日期：2026.04.01</div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                    {/* Left: Description Block */}
                    <div className="flex-1 max-w-2xl pr-48">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-1 bg-[var(--brand-coral)] rounded-full"></div>
                        <span className="text-xs font-black text-[var(--brand-coral)] tracking-[0.2em] uppercase">Automation Center</span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                        运营报告自动化中心
                      </h2>
                      <p className="text-slate-500 mb-6 text-sm leading-relaxed font-medium">
                        利用 AI 引擎自动汇聚多端数据，生成符合学术出版标准的专业分析报告。
                      </p>
                    </div>

                    {/* Right: Expanded Settings */}
                    <AnimatePresence>
                      {isSettingsExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, lg: { height: 'auto', width: 0, opacity: 0 } }}
                          animate={{ opacity: 1, height: 'auto', lg: { width: '50%', opacity: 1 } }}
                          exit={{ opacity: 0, height: 0, lg: { width: 0, opacity: 0 } }}
                          className="w-full lg:w-1/2 overflow-hidden"
                        >
                          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 h-full">
                            {/* Settings Content */}
                            <div className="flex items-center justify-between mb-6 pr-24">
                               <h3 className="font-black text-slate-900 tracking-tight">生成设置</h3>
                               <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" checked={autoGenerate} onChange={() => setAutoGenerate(!autoGenerate)} />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--brand-coral)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-coral)]"></div>
                                  <span className="ml-3 text-sm font-bold text-slate-700">{autoGenerate ? '已开启自动生成' : '已关闭自动生成'}</span>
                                </label>
                            </div>
                            
                            <div className={cn("space-y-6 transition-opacity", !autoGenerate && "opacity-50 pointer-events-none")}>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">生成周期</label>
                                <div className="flex gap-3">
                                  {['周报', '月报'].map(cycle => (
                                    <button key={cycle} className={cn(
                                      "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                                      cycle === '月报' ? "bg-[var(--brand-coral)]/[0.08] border-[var(--brand-coral)]/20 text-[var(--brand-coral)] shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    )}>
                                      {cycle}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">核心指标</label>
                                <div className="space-y-3">
                                  {['资产稼动率分析', '能效趋势模型', '预测性维护建议'].map((metric, i) => (
                                    <label key={metric} className="flex items-center gap-3 cursor-pointer group">
                                      <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 rounded border-slate-300 text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/30" />
                                      <span className="text-sm text-slate-700 group-hover:text-[var(--brand-coral)] transition-colors">{metric}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">生成范围</label>
                                <div className="flex gap-2">
                                  <select 
                                    value={generateRange}
                                    onChange={(e) => {
                                      setGenerateRange(e.target.value);
                                      if (e.target.value === 'specific') {
                                        setIsLabSelectModalOpen(true);
                                      }
                                    }}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20 focus:border-[var(--brand-coral)]/50"
                                  >
                                    <option value="all">全部实训室</option>
                                    <option value="specific">指定范围...</option>
                                  </select>
                                  {generateRange === 'specific' && (
                                    <button 
                                      onClick={() => setIsLabSelectModalOpen(true)}
                                      className="px-4 py-2.5 bg-[var(--brand-coral)]/[0.05] text-[var(--brand-coral)] rounded-xl text-sm font-bold hover:bg-[var(--brand-coral)]/[0.1] whitespace-nowrap transition-all border border-[var(--brand-coral)]/10"
                                    >
                                      已选 {selectedLabs.length} 项
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="pt-4 flex justify-end">
                                <button className="px-8 py-2.5 bg-[var(--brand-coral)] text-white rounded-xl text-sm font-black hover:bg-[var(--brand-coral)]/90 transition-all shadow-lg shadow-[var(--brand-coral)]/20 active:scale-95">
                                  保存配置
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* List Controls */}
                <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm py-4 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100 mb-6 -mx-8 px-8">
                  <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl shrink-0">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-[var(--brand-coral)] shadow-sm" : "text-slate-500 hover:text-slate-700")}
                      title="块状展示"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-[var(--brand-coral)] shadow-sm" : "text-slate-500 hover:text-slate-700")}
                      title="列表展示"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto flex-1 justify-end">
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--brand-coral)] transition-colors" />
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="pl-6 pr-2 py-1.5 bg-transparent border-b border-slate-200 text-sm font-bold focus:outline-none focus:border-[var(--brand-coral)] transition-all text-slate-600 focus:text-slate-900" />
                      </div>
                      <span className="text-slate-400 text-sm font-bold">至</span>
                      <div className="relative group">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--brand-coral)] transition-colors" />
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="pl-6 pr-2 py-1.5 bg-transparent border-b border-slate-200 text-sm font-bold focus:outline-none focus:border-[var(--brand-coral)] transition-all text-slate-600 focus:text-slate-900" />
                      </div>
                    </div>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="搜索报告名称、实训室..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-transparent border-b border-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-colors text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Table / Grid */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {currentSystemReports.map(report => (
                      <div key={report.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col h-full overflow-hidden group">
                        {/* Cover Image (Vertical Rectangle) */}
                        <div className="aspect-[1/1.414] w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                          {/* Simulated Cover Design */}
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200"></div>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-coral)]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--brand-amber)]/5 rounded-full blur-xl -ml-8 -mb-8"></div>
                          
                          <div className="absolute inset-0 p-6 flex flex-col">
                            <div className="flex justify-between items-start mb-auto">
                              <div className="w-8 h-1 bg-[var(--brand-coral)] rounded-full"></div>
                              <span className="px-2 py-1 bg-white/80 backdrop-blur-sm text-slate-600 rounded text-[10px] font-black tracking-wider shadow-sm border border-slate-200/50">
                                {report.type}
                              </span>
                            </div>
                            
                            <div className="mt-auto">
                              <h4 className="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-3 group-hover:text-[var(--brand-coral)] transition-all">
                                {report.name}
                              </h4>
                              <div className="w-12 h-1 bg-[var(--brand-coral)]/20 mb-3 rounded-full"></div>
                              <p className="text-[11px] text-[var(--brand-coral)]/60 font-black uppercase tracking-widest">
                                {report.time.split(' ')[0]}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Body / Actions */}
                        <div className="p-4 flex flex-col flex-1 bg-white">
                          <div className="space-y-1.5 mb-4 flex-1">
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
                              <span className="truncate" title={report.lab}>{report.lab}</span>
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
                              <span>{report.time}</span>
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <button onClick={() => setViewingReport(report)} className="text-xs font-black text-[var(--brand-coral)] hover:text-white flex items-center gap-1 bg-[var(--brand-coral)]/[0.08] hover:bg-[var(--brand-coral)] px-3 py-1.5 rounded-lg transition-all active:scale-95">
                              <Eye className="w-3.5 h-3.5" /> 预览
                            </button>
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDownload(report.name)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="导出Word">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <tr>
                          <th className="px-6 py-4">报告名称</th>
                          <th className="px-6 py-4">生成时间</th>
                          <th className="px-6 py-4">实训室范围</th>
                          <th className="px-6 py-4">类型</th>
                          <th className="px-6 py-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentSystemReports.map(report => (
                          <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[var(--brand-coral)] group-hover:scale-110 transition-transform" /> {report.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{report.time}</td>
                            <td className="px-6 py-4 text-slate-600">{report.lab}</td>
                            <td className="px-6 py-4 text-slate-600">
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{report.type}</span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-3 text-slate-400">
                              <button onClick={() => setViewingReport(report)} className="hover:text-[var(--brand-coral)] transition-colors" title="预览"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => handleDownload(report.name)} className="hover:text-blue-600 transition-colors" title="导出Word"><Download className="w-4 h-4" /></button>
                              <button className="hover:text-red-600 transition-colors" title="删除"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Infinite scroll target */}
                <div ref={observerTarget} className="h-10 flex items-center justify-center">
                  {systemVisibleCount < filteredSystemReports.length && (
                    <span className="text-sm text-slate-400">加载更多...</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Actions & Search */}
                <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-sm py-4 flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100 mb-6 -mx-8 px-8">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsModalOpen(true)} className="group flex items-center gap-2 px-6 py-2.5 bg-[var(--brand-coral)] text-white rounded-xl text-sm font-black hover:bg-[var(--brand-coral)]/90 transition-all shadow-lg shadow-[var(--brand-coral)]/10 active:scale-95">
                      <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" /> 新增报告
                    </button>
                    <button onClick={handleBatchDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                      <Download className="w-4 h-4" /> 批量导出 {selectedMyReports.length > 0 && `(${selectedMyReports.length})`}
                    </button>
                    <button onClick={handleBatchDelete} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" /> 批量删除 {selectedMyReports.length > 0 && `(${selectedMyReports.length})`}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto flex-1 justify-end">
                    <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl shrink-0">
                      <button 
                        onClick={() => setMyViewMode('grid')}
                        className={cn("p-2 rounded-lg transition-all", myViewMode === 'grid' ? "bg-white text-[var(--brand-coral)] shadow-sm" : "text-slate-500 hover:text-slate-700")}
                        title="块状展示"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setMyViewMode('list')}
                        className={cn("p-2 rounded-lg transition-all", myViewMode === 'list' ? "bg-white text-[var(--brand-coral)] shadow-sm" : "text-slate-500 hover:text-slate-700")}
                        title="列表展示"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--brand-coral)] transition-colors" />
                        <input type="date" value={myStartDate} onChange={e => setMyStartDate(e.target.value)} className="pl-6 pr-2 py-1.5 bg-transparent border-b border-slate-200 text-sm font-bold focus:outline-none focus:border-[var(--brand-coral)] transition-all text-slate-600 focus:text-slate-900" />
                      </div>
                      <span className="text-slate-400 text-sm font-bold">至</span>
                      <div className="relative group">
                        <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--brand-coral)] transition-colors" />
                        <input type="date" value={myEndDate} onChange={e => setMyEndDate(e.target.value)} className="pl-6 pr-2 py-1.5 bg-transparent border-b border-slate-200 text-sm font-bold focus:outline-none focus:border-[var(--brand-coral)] transition-all text-slate-600 focus:text-slate-900" />
                      </div>
                    </div>
                    <div className="relative w-full md:w-64 group">
                      <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--brand-coral)] transition-colors" />
                      <input
                        type="text"
                        placeholder="搜索报告名称、实训室..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-transparent border-b border-slate-200 text-sm font-bold focus:outline-none focus:border-[var(--brand-coral)] transition-all text-slate-600 focus:text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                {myViewMode === 'grid' ? (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {currentMyReports.map(report => (
                        <div key={report.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col h-full overflow-hidden group relative">
                          <div className="absolute top-4 left-4 z-20">
                            <input 
                              type="checkbox" 
                              checked={selectedMyReports.includes(report.id)}
                              onChange={() => toggleMyReportSelection(report.id)}
                              className="w-5 h-5 rounded-lg border-white/20 bg-black/20 backdrop-blur-md text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/30 transition-all cursor-pointer" 
                            />
                          </div>
                          {/* Cover Image (Vertical Rectangle) */}
                          <div className="aspect-[1/1.414] w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                            {/* Simulated Cover Design */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-100"></div>
                            
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                            
                            <div className="absolute inset-0 p-6 flex flex-col">
                              <div className="flex justify-end items-start mb-auto">
                                <span className={cn("px-2.5 py-1 backdrop-blur-sm rounded-lg text-[10px] font-bold shadow-sm", report.status === '已生成' ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white")}>
                                  {report.status}
                                </span>
                              </div>
                              
                              <div className="mt-auto">
                                <h4 className="text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-3 group-hover:text-[var(--brand-coral)] transition-all">
                                  {report.name}
                                </h4>
                                <div className="w-12 h-1 bg-[var(--brand-coral)]/20 mb-3 rounded-full"></div>
                                <p className="text-[11px] text-slate-600 font-medium uppercase tracking-wider">
                                  {report.time.split(' ')[0]}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Card Body / Actions */}
                          <div className="p-4 flex flex-col flex-1 bg-white">
                            <div className="space-y-1.5 mb-4 flex-1">
                              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
                                <span className="truncate" title={report.lab}>{report.lab}</span>
                              </p>
                              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
                                <span>{report.time}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <button onClick={() => setViewingReport(report)} className="text-xs font-black text-[var(--brand-coral)] hover:text-white flex items-center gap-1 bg-[var(--brand-coral)]/[0.08] hover:bg-[var(--brand-coral)] px-3 py-1.5 rounded-lg transition-all active:scale-95">
                              <Eye className="w-3.5 h-3.5" /> 预览
                            </button>
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDownload(report.name)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="导出Word">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Infinite scroll target */}
                    <div ref={observerTarget} className="h-10 flex items-center justify-center">
                      {myVisibleCount < filteredMyReports.length && (
                        <span className="text-sm text-slate-400">加载更多...</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                          <tr>
                            <th className="px-6 py-4 w-12">
                              <input 
                                type="checkbox" 
                                checked={selectedMyReports.length === currentMyReports.length && currentMyReports.length > 0}
                                onChange={toggleAllMyReports}
                                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" 
                              />
                            </th>
                            <th className="px-6 py-4">报告名称</th>
                            <th className="px-6 py-4">生成时间</th>
                            <th className="px-6 py-4">实训室范围</th>
                            <th className="px-6 py-4">状态</th>
                            <th className="px-6 py-4 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentMyReports.map(report => (
                            <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <input 
                                  type="checkbox" 
                                  checked={selectedMyReports.includes(report.id)}
                                  onChange={() => toggleMyReportSelection(report.id)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" 
                                />
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-500" /> {report.name}
                              </td>
                              <td className="px-6 py-4 text-slate-500">{report.time}</td>
                              <td className="px-6 py-4 text-slate-600">{report.lab}</td>
                              <td className="px-6 py-4 text-slate-600">
                                <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 w-max", report.status === '已生成' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
                                  <CheckCircle2 className="w-3 h-3" /> {report.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-3 text-slate-400">
                                <button onClick={() => setViewingReport(report)} className="hover:text-[var(--brand-coral)] transition-colors" title="预览"><Eye className="w-4 h-4" /></button>
                                <button onClick={() => handleDownload(report.name)} className="hover:text-blue-600 transition-colors" title="导出"><Download className="w-4 h-4" /></button>
                                <button className="hover:text-red-600 transition-colors" title="删除"><Trash2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Infinite scroll target */}
                    <div ref={observerTarget} className="h-10 flex items-center justify-center">
                      {myVisibleCount < filteredMyReports.length && (
                        <span className="text-sm text-slate-400">加载更多...</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Add Report Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">生成自定义报告</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">模板设置</label>
                    <div className="flex gap-4">
                      <label className="flex-1 flex items-center gap-3 p-4 border border-[var(--brand-coral)] bg-[var(--brand-coral)]/[0.03] rounded-2xl cursor-pointer transition-all hover:bg-[var(--brand-coral)]/[0.05]">
                        <input type="radio" name="template" defaultChecked className="text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/30" />
                        <span className="text-sm font-bold text-slate-900">系统默认模板</span>
                      </label>
                      <label className="flex-1 flex items-center gap-3 p-4 border border-slate-200 bg-white rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                        <input type="radio" name="template" className="text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/30" />
                        <span className="text-sm font-bold text-slate-700">自定义上传模板</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">实训室范围</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20 focus:border-[var(--brand-coral)]/50 transition-all">
                      <option>选择实训室...</option>
                      <option>物联网综合实训室</option>
                      <option>人工智能基础实验室</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">数据指标设置 (多选)</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['使用率', '上线率', '使用时长', '使用趋势', '智能体交互频次', '排错引导统计'].map(metric => (
                        <label key={metric} className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all group">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/30" />
                          <span className="text-sm text-slate-700 font-bold group-hover:text-[var(--brand-coral)] transition-colors">{metric}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">AI 生成提示词设置</label>
                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--brand-coral)]/10 focus:border-[var(--brand-coral)] h-28 resize-none transition-all" placeholder="例如：重点分析设备利用率低的原因，并给出改进建议..." />
                  </div>
                </div>
                  <button onClick={() => setIsModalOpen(false)} className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all">
                    取消
                  </button>
                  <button className="px-8 py-2.5 bg-[var(--brand-coral)] text-white rounded-2xl text-sm font-black hover:bg-[var(--brand-coral)]/90 transition-all shadow-lg shadow-[var(--brand-coral)]/20 flex items-center gap-2 active:scale-95">
                    <FileText className="w-4 h-4" /> 开始生成
                  </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Lab Selection Modal */}
        <AnimatePresence>
          {isLabSelectModalOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">选择指定实训室</h3>
                  <button onClick={() => setIsLabSelectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-2">
                    {availableLabs.map(lab => (
                      <label key={lab} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 group">
                        <input 
                          type="checkbox" 
                          checked={selectedLabs.includes(lab)}
                          onChange={() => toggleLabSelection(lab)}
                          className="w-4 h-4 rounded border-slate-300 text-[var(--brand-coral)] focus:ring-[var(--brand-coral)]/30" 
                        />
                        <span className="text-sm text-slate-700 font-bold group-hover:text-[var(--brand-coral)] transition-colors">{lab}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => setIsLabSelectModalOpen(false)} className="px-8 py-2 bg-[var(--brand-coral)] text-white rounded-xl text-sm font-black hover:bg-[var(--brand-coral)]/90 transition-all shadow-lg shadow-[var(--brand-coral)]/20 active:scale-95">
                    确定 ({selectedLabs.length})
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View Report Modal (Word Style) */}
        <AnimatePresence>
          {viewingReport && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Toolbar */}
                <div className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{viewingReport.name}.docx</h3>
                      <p className="text-xs text-slate-500">只读模式 - {viewingReport.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleDownload(viewingReport.name)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                      <Download className="w-4 h-4" /> 下载
                    </button>
                    <button onClick={() => setViewingReport(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                {/* Document Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100">
                  {/* A4 Paper */}
                  <div className="bg-white w-full max-w-[794px] min-h-[1123px] shadow-md p-12 sm:p-16 text-slate-800 font-serif">
                    <h1 className="text-3xl font-bold text-center mb-12">{viewingReport.name}</h1>
                    
                    <div className="space-y-8 text-justify leading-relaxed">
                      <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">一、 总体概况</h2>
                        <p className="mb-4 indent-8">
                          本报告周期内（{viewingReport.time.split(' ')[0]}），{viewingReport.lab} 的整体运行情况良好。硬件智能体系统持续稳定运行，为实训教学提供了有力的 AI 辅助支持。
                        </p>
                        <p className="indent-8">
                          期间共计产生实训记录 1,245 条，累计实训时长达到 3,420 小时。设备平均在线率保持在 98.5% 以上，未发生重大硬件故障。
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">二、 AI 智能体交互分析</h2>
                        <p className="mb-4 indent-8">
                          学生与硬件智能体的交互频次显著提升。本周期内，智能体共响应语音及文本提问 8,560 次，主动排错引导 1,203 次。
                        </p>
                        
                        <div className="my-8">
                          <h4 className="text-center font-bold text-slate-700 mb-4">图 1：近七日智能体交互趋势</h4>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={[
                                { name: '周一', 交互次数: 1200 },
                                { name: '周二', 交互次数: 1350 },
                                { name: '周三', 交互次数: 1100 },
                                { name: '周四', 交互次数: 1420 },
                                { name: '周五', 交互次数: 1580 },
                                { name: '周六', 交互次数: 890 },
                                { name: '周日', 交互次数: 1020 },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="交互次数" stroke="var(--brand-coral)" strokeWidth={4} dot={{r: 5, fill: 'var(--brand-coral)', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 7, strokeWidth: 0}} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="my-6 p-4 bg-slate-50 border border-slate-200 text-sm">
                          <p className="font-bold mb-2">核心交互数据：</p>
                          <ul className="list-disc list-inside space-y-1 ml-4 text-slate-700">
                            <li>代码排错请求：4,230 次 (占比 49.4%)</li>
                            <li>硬件接线指导：2,150 次 (占比 25.1%)</li>
                            <li>理论知识问答：1,580 次 (占比 18.5%)</li>
                            <li>其他交互：600 次 (占比 7.0%)</li>
                          </ul>
                        </div>

                        <div className="my-8">
                          <h4 className="text-center font-bold text-slate-700 mb-4">图 2：交互类型占比</h4>
                          <div className="h-64 w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: '代码排错', value: 4230 },
                                    { name: '硬件接线', value: 2150 },
                                    { name: '理论问答', value: 1580 },
                                    { name: '其他', value: 600 },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  {
                                    [
                                      { name: '代码排错', value: 4230 },
                                      { name: '硬件接线', value: 2150 },
                                      { name: '理论问答', value: 1580 },
                                      { name: '其他', value: 600 },
                                    ].map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={['var(--brand-coral)', 'var(--brand-sky)', 'var(--brand-jade)', 'var(--brand-amber)'][index % 4]} />
                                    ))
                                  }
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">三、 效能评估与建议</h2>
                        <p className="mb-4 indent-8">
                          通过引入 AI 硬件智能体，实训室的设备利用率较上季度提升了 15%，教师的重复性答疑工作量减少了约 40%。学生在遇到硬件报错时的平均解决时间从 15 分钟缩短至 4 分钟。
                        </p>
                        <p className="indent-8 font-bold text-slate-900 mt-6">
                          改进建议：
                        </p>
                        <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                          <li>部分老旧终端（如 B栋-205 的 3 台设备）响应延迟较高，建议下月进行硬件升级。</li>
                          <li>学生对“传感器高级应用”模块的提问较为集中，建议教师在理论课中加强该部分的讲解。</li>
                        </ol>
                      </section>
                      
                      <div className="pt-20 text-right text-slate-500 text-sm">
                        <p>报告生成系统：AI 硬件智能体管理系统</p>
                        <p>生成时间：{viewingReport.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
