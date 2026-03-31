import { motion } from 'motion/react';
import { ArrowRight, Cpu, MonitorPlay, BarChart3, ShieldCheck, Zap, Layers, LayoutDashboard, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UusimaLogoFull } from '../components/UusimaLogo';

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[var(--brand-warm)]">
      {/* Section 1: Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[var(--brand-warm)]">
        {/* Dynamic Background Elements — UUSIMA 4-Color Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E85D3A]/25 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#4A90D9]/25 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-[#F5A623]/25 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

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
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 font-display">
              智引硬件实训，<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-coral)] to-[var(--brand-amber)]">
                慧领职业教学。
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
              className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl shadow-[#E85D3A]/5"
            >
              <div className="w-12 h-12 bg-[#E85D3A]/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[var(--brand-coral)]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">AI 触达硬件，智引实训全程</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                解决传统硬件实验看不见、摸不着、难排错的痛点。智能体具备深度交互能力，能通过语音、图像与硬件交互，协助学生排错与改错引导。
              </p>
              <p className="text-sm font-semibold text-[var(--brand-coral)]">赋硬件以灵魂，让实训更聪明</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl shadow-[#4A90D9]/5"
            >
              <div className="w-12 h-12 bg-[#4A90D9]/10 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-[var(--brand-sky)]" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">连通虚实，智构全能实训场</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                硬件智能体终端集成高清触控屏，通过 MCP 服务连接多类实训设备，实现实训套件的智慧化改造，提升跨专业普适性。
              </p>
              <p className="text-sm font-semibold text-[var(--brand-sky)]">AI 唤醒旧实训，高效赋能新工科</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 首屏与内容区的品牌分割线 */}
      <div className="divider-gradient" />

      {/* Section 2: Hardware Agent — 杂志编排风格 */}
      <section className="relative py-32 bg-white/80 bg-grid-pattern overflow-hidden">
        {/* 装饰性几何色块 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--brand-coral)]/[0.04] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--brand-amber)]/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          {/* 上部：大标题 + 副标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] rounded-full text-sm font-semibold tracking-wide mb-6 border border-[var(--brand-coral)]/20">
              核心产品
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              AI 硬件智能体：<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-coral)] to-[var(--brand-amber)]">智联实训，赋能新工科全专业升级</span>
            </h2>
            <h3 className="text-xl text-slate-500 font-medium font-display">打破虚实边界，定义智慧教学新范式</h3>
          </motion.div>

          {/* 核心区域：左侧文字内容 + 右侧沉浸式图片 */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* 左侧：正文 + 参数指标 + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 flex flex-col gap-10"
            >
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                硬件实验智能体作为连接真实工业设备与大模型智能分析的关键枢纽，深度适配物联网、人工智能、工业互联网、智慧农业等多个专业领域。
                通过集成多核高性能 CPU 与高清触控显示屏，它不仅能实时采集实验环境数据，还能依托大模型自动识别操作异常并生成优化建议，实现从“传统硬件接入”到“全过程数据驱动”的跨越式实训体验。
              </p>

              {/* 参数指标条 */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '4+', label: '专业领域', color: 'var(--brand-coral)' },
                  { value: '多核', label: '高性能 CPU', color: 'var(--brand-sky)' },
                  { value: '实时', label: '数据采集', color: 'var(--brand-jade)' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="text-center py-4 rounded-2xl border border-slate-100 shadow-sm"
                    style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 5%, transparent)` }}
                  >
                    <div className="text-2xl font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1 font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/hardware-agent"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-ink)] text-white rounded-full font-bold hover:bg-[var(--brand-coral)] transition-all duration-300 w-fit shadow-lg shadow-slate-900/10"
              >
                探索智能体
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* 右侧：沉浸式图片展示 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-7 relative"
            >
              {/* 浮动装饰圆点 */}
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full border-2 border-[var(--brand-coral)]/20 animate-float" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[var(--brand-amber)]/15 animate-float-slow" />

              <div className="aspect-[16/10] lg:aspect-[4/3] rounded-[2.5rem] bg-slate-100 overflow-hidden relative border border-slate-200/60 shadow-2xl shadow-slate-900/10 group">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80"
                  alt="Hardware Agent Device"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* 底部信息层 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pt-32 px-10 pb-10">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      { text: '多核 CPU', color: '#E85D3A' },
                      { text: '高清触控', color: '#4A90D9' },
                      { text: 'MCP 服务', color: '#27AE60' }
                    ].map((tag, i) => (
                      <span key={i} className="px-4 py-1.5 backdrop-blur-xl rounded-full text-sm font-bold border"
                        style={{
                          backgroundColor: `${tag.color}25`,
                          color: '#fff',
                          borderColor: `${tag.color}40`,
                        }}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-white text-3xl font-black tracking-tight">NewLand 核心网关智能体</h4>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Digital Twin Lab — 暗色沉浸式视觉 */}
      <section className="relative py-32 bg-[var(--brand-ink)] text-white overflow-hidden">
        {/* 背景氛围：光晕与网格 */}
        <div className="absolute inset-0 bg-grid-pattern-light opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--brand-coral)]/[0.12] blur-[140px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--brand-sky)]/[0.08] blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* 左侧：画框式图片展示 (lg:col-span-12 -> 5) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative order-2 lg:order-1"
            >
              {/* 装饰边框 */}
              <div className="absolute -inset-4 border border-white/5 rounded-[2.5rem] pointer-events-none" />
              <div className="shimmer-line absolute -top-10 left-0 w-32 h-1 rounded-full opacity-40" />

              <div className="aspect-[4/5] lg:aspect-[3/4] rounded-[2rem] bg-slate-800 overflow-hidden relative border border-white/10 shadow-2xl shadow-black/40 group">
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                  alt="Digital Twin Lab"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/40 to-transparent p-8">
                  <div className="flex items-center gap-4 text-[var(--brand-amber)] drop-shadow-md">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-amber)]/10 flex items-center justify-center border border-[var(--brand-amber)]/20 ordinal-ring">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="font-bold tracking-wider">LATEST INFRASTRUCTURE</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 右侧：解构式文字内容 (lg:col-span-12 -> 7) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 order-1 lg:order-2"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-amber)]/10 text-[var(--brand-amber)] mb-8 border border-[var(--brand-amber)]/20">
                <MonitorPlay className="w-8 h-8" />
              </div>

              <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight font-display">
                数智孪生实训室：<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-amber)] to-[var(--brand-coral)]">
                  AI 硬件智能体驱动的科研教学新基建
                </span>
              </h2>

              <p className="text-xl text-slate-300 mb-8 font-medium italic border-l-4 border-[var(--brand-coral)] pl-6 py-2">
                全时空管理、全维度监测，定义智慧实训新标准
              </p>

              <p className="text-lg text-slate-400 leading-relaxed mb-10 font-medium">
                依托“AI硬件智能体系统”，实训室改造不再是简单的设备堆砌，而是构建一个具备感知、协同、分析能力的闭环系统。通过每实训套件搭配一台智能体终端的建设方案，实现实训环境从物理空间到数字空间的深度融合。
              </p>

              {/* 核心亮点标签 */}
              <div className="flex flex-wrap gap-4 mb-10">
                {['虚实融合', '感知协同', '全时空管理'].map((item, i) => (
                  <div key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300">
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/ai-lab"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[var(--brand-coral)] text-white rounded-full font-bold transition-all duration-300 shadow-xl shadow-[var(--brand-coral)]/20 hover:scale-105 active:scale-95"
              >
                进入 AI 实训室
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Dashboards & Reports — 模块化业务矩阵 */}
      <section className="py-32 bg-[var(--brand-warm)] overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 space-y-40 relative z-10">

          {/* Dashboard Block (Text Left, Image Right) */}
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6"
            >
              <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-600/20">
                <LayoutDashboard className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">全校实训室数智化运营指挥中心</h3>
              <p className="text-xl text-blue-600 font-bold mb-10 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-blue-600/30" />
                多维感知、时时监测，构建实训教学“数字底座”
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {[
                  { title: '运营概况看板', desc: '展示全校已接入 AI 硬件智能体的实训室总数、实训套件在线率及年度累计实训人次。' },
                  { title: '实时运行地图', desc: '以学校视角时时查看各实训室的运行状态与设备利用率。' },
                  { title: '智能体分布矩阵', desc: '监测各类核心终端的部署与活跃情况。' },
                  { title: '实训动态热力图', desc: '展示不同专业学生通过语音、图像、文本与智能体交互的频率。' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 text-xs font-black border border-blue-100">
                      0{i + 1}
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/operation-dashboard"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                查看运营看板
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative"
            >
              {/* 装饰条 */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl" />
              <div className="aspect-[4/3] rounded-[3rem] bg-white overflow-hidden relative border-8 border-white/50 shadow-2xl p-0 group">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                  alt="Dashboard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-[2.5rem]" />
              </div>
            </motion.div>
          </div>

          {/* Reports Block (Image Left, Text Right) */}
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 lg:order-1 order-2 relative"
            >
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-600/5 rounded-full blur-3xl" />
              <div className="aspect-[4/3] rounded-[3rem] bg-white overflow-hidden relative border-8 border-white/50 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
                  alt="Reports"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/10 rounded-[2.5rem]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 lg:order-2 order-1"
            >
              <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-600/20">
                <FileText className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">实训室 AI 化改造成效与智慧运营报告</h3>
              <p className="text-xl text-emerald-600 font-bold mb-10 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-emerald-600/30" />
                虚实融合、降本增效，AI 硬件智能体赋能实训新范式
              </p>

              <ul className="space-y-4 mb-12">
                {[
                  { title: '基础建设显性化', desc: '硬件智能体终端管理：记录终端覆盖密度，展示设备与 AI 系统的自动化对接成果。' },
                  { title: '教学效能提升', desc: 'AI 助手应用成效：统计实验排错引导、改错建议生成及知识库问答次数。' },
                  { title: '资源运营优化', desc: '设备利用率分析：对比改造前后的设备周转率，展示智能体对实训的加速作用。' },
                  { title: '专业认证支撑', desc: '产教融合技术体系成果：列举支持的职业认证种类及实训完成质量。' }
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5 group"
                  >
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-600 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <Link
                to="/operation-report"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                生成运营报告
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Footer — 品牌沉浸式收尾 */}
      <footer className="bg-[var(--brand-ink)] text-slate-400 py-24 relative overflow-hidden border-t border-white/5">
        {/* 背景微光 */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--brand-coral)]/[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-5">
              <div className="mb-8">
                <UusimaLogoFull height={42} className="[&_span]:!text-white" />
              </div>
              <p className="text-base text-slate-400 leading-relaxed max-w-sm font-medium">
                致力于解决传统硬件实验痛点，依托大模型与硬件智能体终端，为新工科全专业提供智慧实训解决方案。
              </p>

              <div className="mt-10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--brand-coral)]/20 hover:border-[var(--brand-coral)]/30 transition-all cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[var(--brand-coral)]" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--brand-sky)]/20 hover:border-[var(--brand-sky)]/30 transition-all cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[var(--brand-sky)]" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--brand-amber)]/20 hover:border-[var(--brand-amber)]/30 transition-all cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[var(--brand-amber)]" />
                </div>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-black text-lg mb-8 tracking-tight">快速链接</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><Link to="/hardware-agent" className="hover:text-[var(--brand-coral)] transition-colors inline-flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-coral)] scale-0 group-hover:scale-100 transition-transform" />硬件智能体</Link></li>
                  <li><Link to="/ai-lab" className="hover:text-[var(--brand-coral)] transition-colors inline-flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-coral)] scale-0 group-hover:scale-100 transition-transform" />AI 实训室</Link></li>
                  <li><Link to="/operation-report" className="hover:text-[var(--brand-coral)] transition-colors inline-flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-coral)] scale-0 group-hover:scale-100 transition-transform" />运营报告</Link></li>
                  <li><Link to="/operation-dashboard" className="hover:text-[var(--brand-coral)] transition-colors inline-flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-coral)] scale-0 group-hover:scale-100 transition-transform" />运营看板</Link></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-white font-black text-lg mb-8 tracking-tight">支持与帮助</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><Link to="/faq" className="hover:text-[var(--brand-coral)] transition-colors">FAQ 常见问题</Link></li>
                  <li><a href="#" className="hover:text-[var(--brand-coral)] transition-colors">网站地图</a></li>
                  <li><a href="#" className="hover:text-[var(--brand-coral)] transition-colors">关于新大陆</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium">
              <p>© 2026 UUSIMA / 新大陆科技集团 版权所有</p>
              <span className="hidden md:block w-1 h-1 rounded-full bg-slate-700" />
              <p className="text-slate-600">Smart Training Agent System v1.0</p>
            </div>

            <div className="flex gap-8 text-sm font-bold">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
