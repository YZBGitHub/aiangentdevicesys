import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Cpu, MonitorPlay, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';

const faqCategories = [
  { id: 'agent', name: '关于硬件智能体终端', icon: Cpu },
  { id: 'lab', name: '关于实训室 AI 化', icon: MonitorPlay },
  { id: 'dashboard', name: '关于实训室运营看板', icon: LayoutDashboard },
];

const faqs = {
  agent: [
    { q: '什么是硬件智能体终端？', a: '硬件智能体终端是连接真实工业设备与大模型智能分析的关键枢纽。它集成了多核高性能 CPU 与高清触控显示屏，能实时采集实验环境数据，并依托大模型自动识别操作异常，生成优化建议。' },
    { q: '如何新增自定义的设备智能体？', a: '在“硬件智能体”页面，切换到“我的设备智能体”标签，点击“新增智能体”按钮。您需要填写智能体名称、简述、系统提示词，并可选择上传相关的知识库文件（如设备手册、实验指导书等）。' },
    { q: '智能体终端支持哪些设备的接入？', a: '目前支持通过 MCP 服务对接多种设备，包括但不限于：USR-TCP232-410s 串口终端、ECU-1251 工业网关、Lora 节点、各类 PLC 及传感器件。' },
  ],
  lab: [
    { q: '实训室 AI 化改造的意义是什么？', a: '实训室 AI 化改造旨在解决传统硬件实验“看不见、摸不着、难排错”的痛点。通过每套实训设备搭配一台智能体终端，实现实训环境从物理空间到数字空间的深度融合，提升设备使用率和教学质量。' },
    { q: '如何将现有的实训室接入系统？', a: '在“AI 实训室”管理页面，点击“新增实训室”，填写基本信息并勾选“接入硬件智能体系统”。随后在“终端管理”中，将配置好的智能体终端分配至该实训室即可。' },
  ],
  dashboard: [
    { q: '运营看板的数据是实时更新的吗？', a: '是的。运营看板通过智能体终端实时采集数据，包括设备在线状态、学生交互频次、实训室使用时长等，为您提供全维度的实时监测。' },
    { q: '如何处理“长期未使用预警”？', a: '当系统检测到某实训室或设备长期处于闲置状态时，会发出预警。建议您核实设备是否故障，或根据教学计划重新安排实训任务，以提高资源利用率。' },
  ]
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('agent');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">常见问题解答 (FAQ)</h1>
          <p className="text-lg text-slate-500">在这里寻找关于新大陆硬件智能体系统的使用帮助</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-2">
            {faqCategories.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOpenFaqIndex(0);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                    isActive ? "bg-purple-600 text-white shadow-md shadow-purple-600/20" : "bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-slate-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="flex-1 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {faqs[activeCategory as keyof typeof faqs].map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                      >
                        <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
