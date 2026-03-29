import { motion } from 'motion/react';
import { ArrowRight, Cpu, MonitorPlay, BarChart3, ShieldCheck, Zap, Layers, LayoutDashboard, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* Section 1: Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          
          {/* Hardware Device Image - Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-1/4 right-[5%] w-[600px] h-[600px] pointer-events-none"
          >
            <img 
              src="https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=800&q=80" 
              alt="Hardware Device" 
              className="w-full h-full object-cover mix-blend-luminosity opacity-60"
              referrerPolicy="no-referrer"
              style={{ maskImage: 'radial-gradient(circle, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 20%, transparent 70%)' }}
            />
          </motion.div>

          {/* Hardware Device Image - Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute bottom-1/4 left-[5%] w-[500px] h-[500px] pointer-events-none"
          >
            <img 
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" 
              alt="Circuit Board" 
              className="w-full h-full object-cover mix-blend-luminosity opacity-50"
              referrerPolicy="no-referrer"
              style={{ maskImage: 'radial-gradient(circle, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 20%, transparent 70%)' }}
            />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
              智引硬件实训，<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                慧改实训中心
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 font-medium">
              AI 硬件智能体，定义智慧实训新标准
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mt-16 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl shadow-purple-900/5"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI 触达硬件，智引实训全程</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                解决传统硬件实验看不见、摸不着、难排错的痛点。智能体具备深度交互能力，能通过语音、图像与硬件交互，协助学生排错与改错引导。
              </p>
              <p className="text-sm font-semibold text-purple-600">赋硬件以灵魂，让实训更聪明</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl shadow-indigo-900/5"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">一屏连通虚实，智构全能实训场</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                硬件智能体终端集成高清触控屏，通过 MCP 服务连接多类实训设备，实现实训套件的智慧化改造，提升跨专业普适性。
              </p>
              <p className="text-sm font-semibold text-indigo-600">AI 唤醒旧实训，高效赋能新工科</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Hardware Agent */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                AI 硬件智能体：<br />
                <span className="text-purple-600">智联实训，赋能新工科全专业升级</span>
              </h2>
              <h3 className="text-xl text-slate-500 mb-8 font-medium">打破虚实边界，定义智慧教学新范式</h3>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                硬件实验智能体作为连接真实工业设备与大模型智能分析的关键枢纽，深度适配物联网、人工智能、工业互联网、智慧农业等多个专业领域。
                通过集成多核高性能 CPU 与高清触控显示屏，它不仅能实时采集实验环境数据，还能依托大模型自动识别操作异常并生成优化建议，实现从“传统硬件接入”到“全过程数据驱动”的跨越式实训体验。
              </p>
              <Link
                to="/hardware-agent"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-purple-600 transition-colors"
              >
                探索智能体 <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
              }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-slate-100 overflow-hidden relative border border-slate-200 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80"
                  alt="Hardware Agent Device"
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <div className="flex gap-4 mb-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-200 backdrop-blur-md rounded-full text-sm font-medium border border-purple-500/30">
                      多核 CPU
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-200 backdrop-blur-md rounded-full text-sm font-medium border border-blue-500/30">
                      高清触控
                    </span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 backdrop-blur-md rounded-full text-sm font-medium border border-emerald-500/30">
                      MCP 服务
                    </span>
                  </div>
                  <h4 className="text-white text-2xl font-bold">NewLand 核心网关智能体</h4>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Digital Twin Lab */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-900/20 blur-[100px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl bg-slate-800 overflow-hidden relative border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                  alt="Digital Twin Lab"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 to-transparent" />
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 mb-8 border border-purple-500/30">
                <MonitorPlay className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold mb-6">数智孪生实训室：<br/>AI 硬件智能体驱动的科研教学新基建</h2>
              <p className="text-xl text-slate-300 mb-8">全时空管理、全维度监测，定义智慧实训新标准</p>
              <p className="text-lg text-slate-400 leading-relaxed mb-10">
                依托“AI硬件智能体系统”，实训室改造不再是简单的设备堆砌，而是构建一个具备感知、协同、分析能力的闭环系统。通过每实训套件搭配一台智能体终端的建设方案，实现实训环境从物理空间到数字空间的深度融合。
              </p>
              <Link
                to="/ai-lab"
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/30"
              >
                进入 AI 实训室 <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Dashboards & Reports */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          
          {/* Dashboard Block (Text Left, Image Right) */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">全校实训室数智化运营指挥中心</h3>
              <p className="text-xl text-blue-600 font-medium mb-8">多维感知、时时监测，构建实训教学“数字底座”</p>
              
              <ul className="space-y-6 mb-10">
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">运营概况看板</h4>
                    <p className="text-slate-500 text-sm mt-1">展示全校已接入 AI 硬件智能体的实训室总数、实训套件在线率及年度累计实训人次。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">实时运行地图</h4>
                    <p className="text-slate-500 text-sm mt-1">以学校视角时时查看各实训室的运行状态与设备利用率。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">智能体分布矩阵</h4>
                    <p className="text-slate-500 text-sm mt-1">监测各类核心终端的部署与活跃情况。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">实训动态热力图</h4>
                    <p className="text-slate-500 text-sm mt-1">展示不同专业学生通过语音、图像、文本与智能体交互的频率。</p>
                  </div>
                </li>
              </ul>
              <Link
                to="/operation-dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                查看运营看板 <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl bg-white overflow-hidden relative border border-slate-200 shadow-2xl p-2">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                  alt="Dashboard"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>

          {/* Reports Block (Image Left, Text Right) */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
              className="relative lg:order-1 order-2"
            >
              <div className="aspect-[4/3] rounded-3xl bg-white overflow-hidden relative border border-slate-200 shadow-2xl p-2">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
                  alt="Reports"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
              }}
              className="lg:order-2 order-1"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">实训室 AI 化改造成效与智慧运营报告</h3>
              <p className="text-xl text-emerald-600 font-medium mb-8">虚实融合、降本增效，AI 硬件智能体赋能实训新范式</p>
              
              <ul className="space-y-6 mb-10">
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">1. 基础建设显性化：硬件智能体终端管理</h4>
                    <p className="text-slate-500 text-sm mt-1">记录终端覆盖密度，展示设备与 AI 系统的自动化对接成果。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">2. 教学效能提升：AI 助手应用成效</h4>
                    <p className="text-slate-500 text-sm mt-1">统计实验排错引导、改错建议生成及知识库问答次数，记录 MCP 服务调用过程。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">3. 资源运营优化：设备利用率分析</h4>
                    <p className="text-slate-500 text-sm mt-1">对比改造前后的设备周转率，展示智能体回答优化对实训进度的加速作用。</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">4. 专业认证支撑：产教融合技术体系成果</h4>
                    <p className="text-slate-500 text-sm mt-1">列举支持的职业认证种类及相关实训章节的完成质量。</p>
                  </div>
                </li>
              </ul>
              <Link
                to="/operation-report"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
              >
                生成运营报告 <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <span className="text-xl font-bold text-white">
                新大陆硬件智能体系统
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              致力于解决传统硬件实验痛点，依托大模型与硬件智能体终端，为新工科全专业提供智慧实训解决方案。
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">快速链接</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/hardware-agent" className="hover:text-purple-400 transition-colors">硬件智能体</Link></li>
              <li><Link to="/ai-lab" className="hover:text-purple-400 transition-colors">AI实训室</Link></li>
              <li><Link to="/operation-report" className="hover:text-purple-400 transition-colors">运营报告</Link></li>
              <li><Link to="/operation-dashboard" className="hover:text-purple-400 transition-colors">运营看板</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">支持与帮助</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="hover:text-purple-400 transition-colors">FAQ 常见问题</Link></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">网站地图</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">关于新大陆</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>Â© 2026 新大陆科技集团 版权所有</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
