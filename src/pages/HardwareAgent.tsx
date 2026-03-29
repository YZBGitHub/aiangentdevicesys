import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Plus, Trash2, Edit, Play, FileText, CheckCircle, XCircle, MoreVertical, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Data
const newlandAgents = [
  { id: 1, name: 'USR-TCP232-410s 串口终端助手', industry: '物联网', views: 12500, popularity: 98, updateTime: '2026-03-20', desc: '提供串口服务器的配置、调试与排错引导。', image: 'https://picsum.photos/seed/agent1/400/300' },
  { id: 2, name: 'ECU-1251 工业网关智能体', industry: '工业互联网', views: 8900, popularity: 95, updateTime: '2026-03-25', desc: '工业协议转换与数据采集的智能辅助。', image: 'https://picsum.photos/seed/agent2/400/300' },
  { id: 3, name: 'AI 视觉分拣台助手', industry: '人工智能', views: 15600, popularity: 99, updateTime: '2026-03-28', desc: '基于机器视觉的物品分拣实验全流程指导。', image: 'https://picsum.photos/seed/agent3/400/300' },
  { id: 4, name: '智慧大棚环境监测智能体', industry: '智慧农业', views: 6700, popularity: 88, updateTime: '2026-03-15', desc: '温湿度、光照等传感器数据采集与联动控制。', image: 'https://picsum.photos/seed/agent4/400/300' },
];

const myAgents = [
  { id: 101, name: '自定义 PLC 调试助手', views: 120, popularity: 45, status: 'published', desc: '针对特定型号 PLC 的梯形图编程与调试辅助。', image: 'https://picsum.photos/seed/myagent1/400/300' },
  { id: 102, name: 'Lora 节点配置向导', views: 0, popularity: 0, status: 'draft', desc: 'Lora 模块频段、速率等参数的快速配置。', image: 'https://picsum.photos/seed/myagent2/400/300' },
];

const industries = ['全部', '物联网', '工业互联网', '人工智能', '智慧农业', '其他'];
const sortOptions = ['浏览人次', '热度', '更新时间'];

export default function HardwareAgent() {
  const [activeTab, setActiveTab] = useState<'newland' | 'my'>('newland');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('全部');
  const [selectedSort, setSelectedSort] = useState('浏览人次');
  const [selectedMyAgents, setSelectedMyAgents] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">硬件智能体</h1>
            <p className="text-slate-500 mt-2">管理和使用各类硬件设备的 AI 智能体助手</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('newland')}
            className={cn(
              "pb-4 text-lg font-medium transition-colors relative",
              activeTab === 'newland' ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            NewLand 设备智能体
            {activeTab === 'newland' && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={cn(
              "pb-4 text-lg font-medium transition-colors relative",
              activeTab === 'my' ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            我的设备智能体
            {activeTab === 'my' && (
              <motion.div layoutId="active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
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
            {activeTab === 'newland' ? (
              <div className="space-y-6">
                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">行业：</span>
                      <div className="flex gap-2">
                        {industries.map(ind => (
                          <button
                            key={ind}
                            onClick={() => setSelectedIndustry(ind)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm transition-colors",
                              selectedIndustry === ind ? "bg-purple-100 text-purple-700 font-medium" : "text-slate-600 hover:bg-slate-100"
                            )}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-6 w-px bg-slate-200 hidden md:block" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">排序：</span>
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                      >
                        {sortOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索智能体名称..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {newlandAgents.map(agent => (
                    <div key={agent.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all group">
                      <div className="aspect-video relative overflow-hidden bg-slate-100">
                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-medium rounded-lg">
                          {agent.industry}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1" title={agent.name}>{agent.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">{agent.desc}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                          <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" /> {agent.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" /> 热度 {agent.popularity}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <Play className="w-4 h-4" /> 立即开启
                          </button>
                          <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors" title="使用说明">
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Actions & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
                      <Plus className="w-4 h-4" /> 新增智能体
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50" disabled={selectedMyAgents.length === 0}>
                      <CheckCircle className="w-4 h-4" /> 发布
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50" disabled={selectedMyAgents.length === 0}>
                      <XCircle className="w-4 h-4" /> 取消发布
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50" disabled={selectedMyAgents.length === 0}>
                      <Trash2 className="w-4 h-4" /> 删除
                    </button>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索智能体名称..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {myAgents.map(agent => (
                    <div key={agent.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all group relative">
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedMyAgents.includes(agent.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMyAgents([...selectedMyAgents, agent.id]);
                            } else {
                              setSelectedMyAgents(selectedMyAgents.filter(id => id !== agent.id));
                            }
                          }}
                          className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <span className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-lg backdrop-blur-md border",
                          agent.status === 'published' ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30" : "bg-slate-500/20 text-slate-700 border-slate-500/30"
                        )}>
                          {agent.status === 'published' ? '已发布' : '未发布'}
                        </span>
                      </div>
                      <div className="aspect-video relative overflow-hidden bg-slate-100">
                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1" title={agent.name}>{agent.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10">{agent.desc}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                          <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" /> {agent.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" /> 热度 {agent.popularity}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <Play className="w-4 h-4" /> 开启
                          </button>
                          <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors" title="编辑">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors" title="删除">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Add/Edit Modal */}
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
                  <h3 className="text-xl font-bold text-slate-900">新增智能体</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">名称 <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="请输入智能体名称" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">简述 <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="一句话介绍智能体" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">系统提示词 (System Prompt) <span className="text-red-500">*</span></label>
                    <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none" placeholder="设定智能体的角色、行为和约束..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">知识库</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">点击或拖拽文件上传</p>
                      <p className="text-xs text-slate-400 mt-1">支持 PDF, DOCX, TXT 格式</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">排序号</label>
                      <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
                      <input type="text" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="内部备注" />
                    </div>
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
      </div>
    </div>
  );
}
