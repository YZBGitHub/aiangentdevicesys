import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Cpu, MonitorPlay, FileText, LayoutDashboard, HelpCircle, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { Outlet } from 'react-router-dom';

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
    <div className="h-screen bg-white text-slate-900 flex font-sans overflow-y-auto overflow-x-hidden">
      {/* Top Navigation for Home */}
      <AnimatePresence>
        {isHome && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-purple-100 flex items-center px-8"
          >
            {/* Left: Logo */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">
                AI
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500">
                新大陆硬件智能体系统
              </span>
            </div>

            {/* Center: Navigation */}
            <nav className="flex items-center justify-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-purple-600",
                    location.pathname === item.path ? "text-purple-600" : "text-slate-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right: Login */}
            <div className="flex items-center justify-end gap-4 flex-1">
              <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
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
            {/* Floating Navigation Bar */}
            <motion.nav
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-8 top-1/2 -translate-y-1/2 h-auto max-h-[calc(100vh-4rem)] w-16 hover:w-48 bg-white/90 backdrop-blur-md border border-purple-100 rounded-3xl z-50 flex flex-col py-6 px-2 hover:px-4 shadow-xl shadow-purple-500/10 pointer-events-auto transition-all duration-300 group/nav overflow-hidden"
            >
              {/* Logo */}
              <Link to="/" className="flex items-center p-2 mb-6 rounded-2xl transition-all duration-200 group/item hover:bg-purple-50" title="返回首页">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/30 mx-auto group-hover/nav:mx-0">
                  AI
                </div>
                <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-500 whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover/nav:max-w-[120px] group-hover/nav:opacity-100 group-hover/nav:ml-3 transition-all duration-300">
                  新大陆AI
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
                        ? "bg-purple-100 text-purple-700"
                        : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                    )}
                    title={item.name}
                  >
                    <Icon className={cn("w-6 h-6 shrink-0 transition-colors mx-auto group-hover/nav:mx-0", isActive ? "text-purple-600" : "text-slate-400 group-hover/item:text-purple-600")} />
                    <span className="font-medium text-sm whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover/nav:max-w-[120px] group-hover/nav:opacity-100 group-hover/nav:ml-3 transition-all duration-300">
                      {item.name}
                    </span>
                  </Link>
                );

                if (item.name === '运营看板') {
                  acc.push(
                    <button key="user-center" className="flex items-center p-3 rounded-2xl transition-all duration-200 group/item text-slate-600 hover:bg-purple-50 hover:text-purple-700" title="个人中心">
                      <User className="w-6 h-6 shrink-0 transition-colors mx-auto group-hover/nav:mx-0 text-slate-400 group-hover/item:text-purple-600" />
                      <span className="font-medium text-sm whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover/nav:max-w-[120px] group-hover/nav:opacity-100 group-hover/nav:ml-3 transition-all duration-300">
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
