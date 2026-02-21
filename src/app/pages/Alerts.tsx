import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  XCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Truck,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useWine } from '../context/WineContext';

export default function Alerts() {
  const { wines, lowStockWines, outOfStockWines, suppliers } = useWine();
  const navigate = useNavigate();

  const healthyWines = wines.filter((w) => w.stock > w.minStock);
  const inactiveSuppliers = suppliers.filter((s) => s.status === 'inactivo');
  const oldVintageWines = wines.filter((w) => w.vintage <= 2018);

  const summaryCards = [
    { value: outOfStockWines.length, label: 'Sin Stock', color: 'text-[#E54D6B]', bg: 'bg-[#E54D6B]/10', border: 'border-[#E54D6B]/15' },
    { value: lowStockWines.length, label: 'Stock Bajo', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
    { value: oldVintageWines.length, label: 'Cosecha Antigua', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15' },
    { value: healthyWines.length, label: 'Stock OK', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#C9A96E]" />
          <p className="text-[#C9A96E] text-xs tracking-[0.2em] uppercase" style={{ fontWeight: 600 }}>Notificaciones</p>
        </div>
        <h2 className="text-white/90 text-2xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Centro de Alertas</h2>
        <p className="text-white/25 text-sm mt-1">Control de inventario y notificaciones activas</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-2xl ${card.bg} border ${card.border} p-4 text-center`}
          >
            <p className={`text-2xl ${card.color}`} style={{ fontWeight: 700 }}>{card.value}</p>
            <p className={`text-[11px] ${card.color} opacity-60 mt-0.5`} style={{ fontWeight: 500 }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Critical */}
      {outOfStockWines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-[#E54D6B]/[0.06] border border-[#E54D6B]/15 p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-[#E54D6B]/15 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-[#E54D6B]" />
            </div>
            <div>
              <h3 className="text-[#E54D6B]/90 text-sm" style={{ fontWeight: 600 }}>Sin Stock - Reposición Urgente</h3>
              <p className="text-[#E54D6B]/40 text-[11px]">{outOfStockWines.length} productos requieren acción inmediata</p>
            </div>
          </div>
          <div className="space-y-2">
            {outOfStockWines.map((wine) => (
              <div key={wine.id} className="flex items-center justify-between p-4 bg-[#0A0A12]/60 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all">
                <div>
                  <p className="text-sm text-white/70" style={{ fontWeight: 500 }}>{wine.name}</p>
                  <p className="text-[11px] text-white/25">{wine.winery} · {wine.varietal}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-[#E54D6B]" style={{ fontWeight: 600 }}>0 unid.</p>
                    <p className="text-[10px] text-white/15">Mín: {wine.minStock}</p>
                  </div>
                  <button
                    onClick={() => navigate('/movimientos')}
                    className="px-3.5 py-2 bg-[#E54D6B]/20 text-[#E54D6B] border border-[#E54D6B]/20 rounded-xl text-[11px] hover:bg-[#E54D6B]/30 transition-all flex items-center gap-1"
                    style={{ fontWeight: 600 }}
                  >
                    Reponer <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Warning */}
      {lowStockWines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-amber-500/[0.06] border border-amber-500/15 p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-amber-400/90 text-sm" style={{ fontWeight: 600 }}>Stock Bajo - Requiere Atención</h3>
              <p className="text-amber-400/40 text-[11px]">{lowStockWines.length} productos por debajo del mínimo</p>
            </div>
          </div>
          <div className="space-y-2">
            {lowStockWines.map((wine) => (
              <div key={wine.id} className="flex items-center justify-between p-4 bg-[#0A0A12]/60 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all">
                <div>
                  <p className="text-sm text-white/70" style={{ fontWeight: 500 }}>{wine.name}</p>
                  <p className="text-[11px] text-white/25">{wine.winery} · {wine.varietal}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-amber-400" style={{ fontWeight: 600 }}>{wine.stock} unid.</p>
                    <p className="text-[10px] text-white/15">Mín: {wine.minStock}</p>
                  </div>
                  <button
                    onClick={() => navigate('/movimientos')}
                    className="px-3.5 py-2 bg-amber-500/15 text-amber-400 border border-amber-500/15 rounded-xl text-[11px] hover:bg-amber-500/25 transition-all flex items-center gap-1"
                    style={{ fontWeight: 600 }}
                  >
                    Reponer <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-blue-500/[0.04] border border-blue-500/10 p-5"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-blue-400/80 text-sm" style={{ fontWeight: 600 }}>Información General</h3>
        </div>
        <div className="space-y-2">
          {[
            { icon: Calendar, text: 'Vinos con cosecha antigua', sub: `${oldVintageWines.length} vinos cosecha 2018 o anterior`, badge: 'Info', badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/15' },
            { icon: Truck, text: 'Proveedores inactivos', sub: `${inactiveSuppliers.length} proveedor(es) sin pedidos recientes`, badge: 'Info', badgeColor: 'text-blue-400 bg-blue-500/15 border-blue-500/15' },
            { icon: Shield, text: 'Stock saludable', sub: `${healthyWines.length} vinos con stock por encima del mínimo`, badge: 'OK', badgeColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/15' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A12]/60 rounded-xl border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/[0.04] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-white/25" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>{item.text}</p>
                    <p className="text-[11px] text-white/20">{item.sub}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] border ${item.badgeColor}`} style={{ fontWeight: 500 }}>{item.badge}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Health bars */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
      >
        <h3 className="text-white/70 mb-5" style={{ fontWeight: 600 }}>Salud del Inventario</h3>
        <div className="space-y-2">
          {wines.map((wine, idx) => {
            const ratio = wine.minStock > 0 ? wine.stock / (wine.minStock * 3) : 0;
            const pct = Math.min(100, ratio * 100);
            return (
              <motion.div
                key={wine.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 + idx * 0.02 }}
                className="flex items-center gap-3 group"
              >
                <div className="w-44 truncate text-sm text-white/35 group-hover:text-white/55 transition-colors" style={{ fontWeight: 400 }}>{wine.name}</div>
                <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5 + idx * 0.03, duration: 0.7 }}
                    className={`h-full rounded-full ${
                      wine.stock === 0 ? 'bg-[#E54D6B]' : wine.stock <= wine.minStock ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="w-8 text-right text-sm text-white/35" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{wine.stock}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
