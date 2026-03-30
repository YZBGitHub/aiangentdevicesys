import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Cpu, MonitorPlay, FileText, LayoutDashboard, HelpCircle, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { Outlet } from 'react-router-dom';
import { UusimaLogo, UusimaLogoFull } from './UusimaLogo';

const navItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '硬件智能体', path: '/hardware-agent', icon: Cpu },
  { name: 'AI实训室', path: '/ai-lab', icon: MonitorPlay },
  { name: '运营报告', path: '/operation-report', icon: FileText },
  { name: '运营看板', path: '/operation-dashboard', icon: LayoutDashboard },
  { name: 'FAQ', path: '/faq', icon: HelpCircle },
];

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="h-screen bg-[var(--brand-warm)] text-slate-900 flex font-sans overflow-y-auto overflow-x-hidden">
      {/* Top Navigation for Home */}
      <AnimatePresence>
        {isHome && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-stone-200 flex items-center px-8"
          >
            {/* Left: Logo */}
            <div className="flex items-center gap-3 flex-1">
              <UusimaLogoFull height={38} />
            </div>

            {/* Center: Navigation */}
            <nav className="flex items-center justify-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[var(--brand-coral)]",
                    location.pathname === item.path ? "text-[var(--brand-coral)]" : "text-slate-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right: Login */}
            <div className="flex items-center justify-end gap-4 flex-1">
              <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[var(--brand-coral)] transition-colors">
                <User className="w-4 h-4" />
                登录
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Left Sidebar for other pages */}
      <AnimatePresence>
        {!isHome && (
          <>
            {/* Floating Navigation Bar — Premium Glass Light Theme */}
            <motion.nav
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-8 top-1/2 -translate-y-1/2 h-auto max-h-[calc(100vh-4rem)] w-16 hover:w-52 bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-[2rem] z-50 flex flex-col py-6 px-2 hover:px-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] pointer-events-auto transition-all duration-500 group/nav overflow-hidden"
            >
              {/* Logo */}
              <Link to="/" className="flex items-center p-2 mb-8 rounded-2xl transition-all duration-200 group/item hover:bg-slate-100" title="返回首页">
                <UusimaLogo size={32} className="shrink-0 mx-auto group-hover/nav:mx-0 p-1 bg-white rounded-xl shadow-sm" />
                <span className="font-display font-black text-sm text-slate-800 whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover/nav:max-w-[120px] group-hover/nav:opacity-100 group-hover/nav:ml-3 transition-all duration-500">
                  UUSIMA
                </span>
              </Link>

              {/* Nav Items */}
              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar">
              {navItems.reduce((acc: any[], item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                acc.push(
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative flex items-center p-3 rounded-2xl transition-all duration-200 group/item",
                      isActive
                        ? "bg-[var(--brand-coral)] text-white shadow-lg shadow-[var(--brand-coral)]/25"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    )}
                    title={item.name}
                  >
                    <Icon className={cn("w-6 h-6 shrink-0 transition-colors mx-auto group-hover/nav:mx-0", isActive ? "text-white" : "text-slate-400 group-hover/item:text-slate-700")} />
                    <span className="font-bold text-sm whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover/nav:max-w-[120px] group-hover/nav:opacity-100 group-hover/nav:ml-3 transition-all duration-500">
                      {item.name}
                    </span>
                  </Link>
                );

                if (item.name === '运营看板') {
                  acc.push(
                    <button key="user-center" className="flex items-center p-3 rounded-2xl transition-all duration-200 group/item text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="个人中心">
                      <User className="w-6 h-6 shrink-0 transition-colors mx-auto group-hover/nav:mx-0 text-slate-400 group-hover/item:text-slate-700" />
                      <span className="font-bold text-sm whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover/nav:max-w-[120px] group-hover/nav:opacity-100 group-hover/nav:ml-3 transition-all duration-500">
                        个人中心
                      </span>
                    </button>
                  );
                }
                return acc;
              }, [])}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isHome ? "pt-20" : "pl-32"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
