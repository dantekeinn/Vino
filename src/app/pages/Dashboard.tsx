import { motion } from 'motion/react';
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
  Star,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useWine, WineType } from '../context/WineContext';
import { NavLink } from 'react-router';

const typeConfig: Record<WineType, { gradient: string; dot: string }> = {
  Tinto: { gradient: 'from-red-500/20 to-red-900/20', dot: 'bg-red-400' },
  Blanco: { gradient: 'from-amber-400/20 to-amber-700/20', dot: 'bg-amber-400' },
  Rosado: { gradient: 'from-pink-400/20 to-pink-700/20', dot: 'bg-pink-400' },
  Espumante: { gradient: 'from-sky-400/20 to-sky-700/20', dot: 'bg-sky-400' },
  Dulce: { gradient: 'from-orange-400/20 to-orange-700/20', dot: 'bg-orange-400' },
};

const topSelling = [
  { name: 'Catena Zapata Malbec', sold: 84, revenue: 487200 },
  { name: 'Chandon Brut Nature', sold: 72, revenue: 273600 },
  { name: 'Terrazas Reserva', sold: 65, revenue: 221000 },
  { name: 'Trapiche Gran Medalla', sold: 48, revenue: 345600 },
  { name: 'Norton Torrontés', sold: 42, revenue: 117600 },
];

const medals = ['bg-gradient-to-br from-amber-300 to-amber-500', 'bg-gradient-to-br from-slate-300 to-slate-400', 'bg-gradient-to-br from-amber-600 to-amber-800'];

export default function Dashboard() {
  const {
    wines,
    movements,
    totalBottles,
    totalValue,
    totalCost,
    lowStockWines,
    outOfStockWines,
    formatCurrency,
    wineTypes,
  } = useWine();

  const margin = totalValue > 0 ? Math.round(((totalValue - totalCost) / totalValue) * 100) : 0;
  const alertCount = lowStockWines.length + outOfStockWines.length;

  const stockByType = wineTypes.map((t) => ({
    type: t,
    count: wines.filter((w) => w.type === t).reduce((s, w) => s + w.stock, 0),
    labels: wines.filter((w) => w.type === t).length,
  }));
  const maxTypeStock = Math.max(...stockByType.map((s) => s.count), 1);

  const kpis = [
    {
      icon: Package,
      label: 'Total Botellas',
      value: totalBottles.toLocaleString('es-AR'),
      sub: `${wines.length} etiquetas`,
      badge: '+24',
      gradient: 'from-[#8B2252] to-[#A63366]',
      shadow: 'shadow-[#8B2252]/15',
    },
    {
      icon: DollarSign,
      label: 'Valor de Stock',
      value: formatCurrency(totalValue),
      sub: `Costo: ${formatCurrency(totalCost)}`,
      badge: '+12%',
      gradient: 'from-emerald-500 to-emerald-700',
      shadow: 'shadow-emerald-500/15',
    },
    {
      icon: TrendingUp,
      label: 'Margen',
      value: `${margin}%`,
      sub: `Ganancia: ${formatCurrency(totalValue - totalCost)}`,
      badge: 'Saludable',
      gradient: 'from-blue-500 to-blue-700',
      shadow: 'shadow-blue-500/15',
    },
    {
      icon: AlertTriangle,
      label: 'Alertas',
      value: alertCount.toString(),
      sub: `${outOfStockWines.length} sin stock · ${lowStockWines.length} bajo`,
      badge: alertCount > 0 ? 'Atención' : 'OK',
      gradient: alertCount > 0 ? 'from-[#E54D6B] to-[#C93B55]' : 'from-emerald-500 to-emerald-700',
      shadow: alertCount > 0 ? 'shadow-[#E54D6B]/15' : 'shadow-emerald-500/15',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Greeting */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#C9A96E]" />
          <p className="text-[#C9A96E] text-xs tracking-[0.2em] uppercase" style={{ fontWeight: 600 }}>Panel de control</p>
        </div>
        <h2 className="text-white/90 text-2xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
          Bienvenido de vuelta
        </h2>
        <p className="text-white/30 text-sm mt-1">Resumen general de tu vinoteca · Hoy 20 de febrero, 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 group hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-500"
            >
              {/* Glow */}
              <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${kpi.gradient} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg ${kpi.shadow}`}>
                    <Icon className="w-[18px] h-[18px] text-white" />
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] text-white/50 backdrop-blur-sm" style={{ fontWeight: 500 }}>
                    {kpi.badge}
                  </span>
                </div>
                <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>{kpi.label}</p>
                <p className="text-2xl text-white/90 tracking-tight" style={{ fontWeight: 700 }}>{kpi.value}</p>
                <p className="text-[11px] text-white/25 mt-1">{kpi.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white/85" style={{ fontWeight: 600 }}>Stock por Tipo</h3>
              <p className="text-white/25 text-xs mt-0.5">Distribución actual del inventario</p>
            </div>
            <NavLink to="/inventario" className="text-[11px] text-[#C9A96E]/60 hover:text-[#C9A96E] transition-colors flex items-center gap-1" style={{ fontWeight: 500 }}>
              Ver todo <Eye className="w-3 h-3" />
            </NavLink>
          </div>
          <div className="space-y-4">
            {stockByType.map((item, idx) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.06 }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${typeConfig[item.type].dot}`} />
                    <span className="text-white/60" style={{ fontWeight: 500 }}>{item.type}</span>
                  </div>
                  <span className="text-white/30 text-xs">{item.count} bot. · {item.labels} etiq.</span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxTypeStock) * 100}%` }}
                    transition={{ delay: 0.5 + idx * 0.08, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`h-full bg-gradient-to-r ${typeConfig[item.type].gradient} rounded-full`}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Selling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white/85" style={{ fontWeight: 600 }}>Más Vendidos</h3>
              <p className="text-white/25 text-xs mt-0.5">Ranking del mes</p>
            </div>
            <Star className="w-4 h-4 text-[#C9A96E]/40" />
          </div>
          <div className="space-y-2.5">
            {topSelling.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 ${
                    idx < 3 ? medals[idx] + ' text-white shadow-sm' : 'bg-white/[0.06] text-white/30'
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate group-hover:text-white/90 transition-colors" style={{ fontWeight: 500 }}>{item.name}</p>
                  <p className="text-[11px] text-white/25">{item.sold} unid.</p>
                </div>
                <p className="text-sm text-[#C9A96E]/70 flex-shrink-0" style={{ fontWeight: 600 }}>{formatCurrency(item.revenue)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Movements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white/85" style={{ fontWeight: 600 }}>Actividad Reciente</h3>
            <p className="text-white/25 text-xs mt-0.5">Últimos movimientos de stock</p>
          </div>
          <NavLink to="/movimientos" className="text-[11px] text-[#C9A96E]/60 hover:text-[#C9A96E] transition-colors flex items-center gap-1" style={{ fontWeight: 500 }}>
            Ver todos <Eye className="w-3 h-3" />
          </NavLink>
        </div>
        <div className="space-y-1.5">
          {movements.slice(0, 6).map((mov, idx) => (
            <motion.div
              key={mov.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 + idx * 0.04 }}
              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/[0.03] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  mov.type === 'entrada' ? 'bg-emerald-500/10' : mov.type === 'salida' ? 'bg-[#E54D6B]/10' : 'bg-amber-500/10'
                }`}>
                  {mov.type === 'entrada' ? (
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  ) : mov.type === 'salida' ? (
                    <ArrowUpRight className="w-4 h-4 text-[#E54D6B]" />
                  ) : (
                    <ArrowUpDown className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/65 truncate group-hover:text-white/85 transition-colors" style={{ fontWeight: 500 }}>{mov.wineName}</p>
                  <p className="text-[11px] text-white/20 truncate">{mov.reason} · {mov.date}</p>
                </div>
              </div>
              <span
                className={`text-sm flex-shrink-0 ml-3 ${
                  mov.type === 'entrada' ? 'text-emerald-400/80' : mov.type === 'salida' ? 'text-[#E54D6B]/80' : 'text-amber-400/80'
                }`}
                style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
              >
                {mov.type === 'entrada' ? '+' : '-'}{Math.abs(mov.quantity)}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
