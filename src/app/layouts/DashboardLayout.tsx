import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wine,
  BarChart3,
  Package,
  ArrowUpDown,
  Truck,
  AlertTriangle,
  FileBarChart,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Settings,
  LogOut,
} from 'lucide-react';
import { useWine } from '../context/WineContext';

const navItems = [
  { to: '/', icon: BarChart3, label: 'Dashboard', description: 'Vista general' },
  { to: '/inventario', icon: Package, label: 'Inventario', description: 'Catálogo de vinos' },
  { to: '/movimientos', icon: ArrowUpDown, label: 'Movimientos', description: 'Entradas y salidas' },
  { to: '/proveedores', icon: Truck, label: 'Proveedores', description: 'Distribuidores' },
  { to: '/alertas', icon: AlertTriangle, label: 'Alertas', description: 'Notificaciones' },
  { to: '/reportes', icon: FileBarChart, label: 'Reportes', description: 'Análisis' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lowStockWines, outOfStockWines } = useWine();
  const alertCount = lowStockWines.length + outOfStockWines.length;
  const location = useLocation();

  const currentPage = navItems.find(
    (item) => item.to === location.pathname || (item.to !== '/' && location.pathname.startsWith(item.to)),
  ) || navItems[0];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A12] font-['Inter',sans-serif]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[272px] bg-[#0E0C18]/95 backdrop-blur-xl flex flex-col border-r border-white/[0.04] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8B2252] via-[#A63366] to-[#C9A96E] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#8B2252]/20">
              <Wine className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-white/95 tracking-tight truncate" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1.25rem' }}>
                VinoStock
              </h1>
              <p className="text-white/30 text-[11px] tracking-widest uppercase mt-0.5">Gestión Premium</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] tracking-[0.15em] uppercase text-white/20" style={{ fontWeight: 600 }}>
            Navegación
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B2252]/15 to-transparent text-white'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#8B2252] to-[#C9A96E] rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'bg-[#8B2252]/20' : 'bg-transparent group-hover:bg-white/[0.04]'
                    }`}>
                      <Icon className="w-[16px] h-[16px]" />
                    </div>
                    <span className="truncate" style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                    {item.to === '/alertas' && alertCount > 0 && (
                      <span className="ml-auto w-5 h-5 flex items-center justify-center bg-[#E54D6B] text-white text-[10px] rounded-full shadow-lg shadow-[#E54D6B]/30" style={{ fontWeight: 700 }}>
                        {alertCount}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="ml-auto w-3.5 h-3.5 text-white/30" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4">
          <div className="mx-2 mb-3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B2252] to-[#C9A96E] flex items-center justify-center text-white text-[11px] flex-shrink-0 shadow-lg shadow-[#8B2252]/10" style={{ fontWeight: 600 }}>
              AM
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/80 text-sm truncate" style={{ fontWeight: 500 }}>Administrador</p>
              <p className="text-white/25 text-[11px] truncate">admin@vinostock.com</p>
            </div>
            <Settings className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-[#0A0A12]/80 backdrop-blur-xl border-b border-white/[0.04] px-4 lg:px-8 py-4 flex items-center gap-4 flex-shrink-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white/80 hover:bg-white/[0.06] rounded-xl transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h2 className="text-white/90 text-lg" style={{ fontWeight: 600 }}>{currentPage.label}</h2>
            <p className="text-white/25 text-xs mt-0.5">{currentPage.description}</p>
          </div>

          <div className="flex-1 max-w-sm ml-auto relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#8B2252]/40 focus:border-[#8B2252]/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-1">
            <NavLink
              to="/alertas"
              className="relative p-2.5 text-white/30 hover:text-white/70 hover:bg-white/[0.04] rounded-xl transition-all"
            >
              <Bell className="w-[18px] h-[18px]" />
              {alertCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E54D6B] rounded-full ring-2 ring-[#0A0A12]" />
              )}
            </NavLink>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B2252] to-[#C9A96E] flex items-center justify-center text-white text-[10px] lg:hidden" style={{ fontWeight: 700 }}>
              AM
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
