import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Sparkles } from 'lucide-react';
import { useWine, WineType } from '../context/WineContext';

const TYPE_COLORS: Record<WineType, string> = {
  Tinto: '#8B2252',
  Blanco: '#C9A96E',
  Rosado: '#DB2777',
  Espumante: '#38BDF8',
  Dulce: '#FB923C',
};

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1828] border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
      {label && <p className="text-white/60 text-xs mb-1.5" style={{ fontWeight: 500 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1828] border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-sm text-white/80" style={{ fontWeight: 600 }}>{payload[0].name}: {payload[0].value}</p>
    </div>
  );
};

export default function Reports() {
  const { wines, movements, formatCurrency, wineTypes } = useWine();

  const pieData = useMemo(
    () => wineTypes.map((t) => ({ name: t, value: wines.filter((w) => w.type === t).reduce((s, w) => s + w.stock, 0) })).filter((d) => d.value > 0),
    [wines, wineTypes],
  );

  const valueByType = useMemo(
    () => wineTypes.map((t) => ({
      name: t,
      valor: wines.filter((w) => w.type === t).reduce((s, w) => s + w.stock * w.salePrice, 0),
      costo: wines.filter((w) => w.type === t).reduce((s, w) => s + w.stock * w.costPrice, 0),
    })),
    [wines, wineTypes],
  );

  const topByValue = useMemo(
    () => [...wines].map((w) => ({ name: w.name.length > 16 ? w.name.slice(0, 16) + '...' : w.name, valor: w.stock * w.salePrice })).sort((a, b) => b.valor - a.valor).slice(0, 8),
    [wines],
  );

  const movementsByType = useMemo(() => {
    const e = movements.filter((m) => m.type === 'entrada').reduce((s, m) => s + m.quantity, 0);
    const x = movements.filter((m) => m.type === 'salida').reduce((s, m) => s + m.quantity, 0);
    const a = movements.filter((m) => m.type === 'ajuste').length;
    return [{ name: 'Entradas', cantidad: e }, { name: 'Salidas', cantidad: x }, { name: 'Ajustes', cantidad: a }];
  }, [movements]);

  const stockHealth = useMemo(() => {
    const out = wines.filter((w) => w.stock === 0).length;
    const low = wines.filter((w) => w.stock > 0 && w.stock <= w.minStock).length;
    const ok = wines.filter((w) => w.stock > w.minStock).length;
    return [
      { name: 'Sin Stock', value: out, color: '#E54D6B' },
      { name: 'Stock Bajo', value: low, color: '#FBBF24' },
      { name: 'Normal', value: ok, color: '#4ADE80' },
    ].filter((d) => d.value > 0);
  }, [wines]);

  const totalValue = wines.reduce((s, w) => s + w.stock * w.salePrice, 0);
  const totalCost = wines.reduce((s, w) => s + w.stock * w.costPrice, 0);
  const avgPrice = wines.length > 0 ? wines.reduce((s, w) => s + w.salePrice, 0) / wines.length : 0;
  const avgRating = wines.length > 0 ? (wines.reduce((s, w) => s + w.rating, 0) / wines.length).toFixed(1) : '0';

  const statCards = [
    { label: 'Valor Total', value: formatCurrency(totalValue), color: 'text-[#C9A96E]' },
    { label: 'Costo Total', value: formatCurrency(totalCost), color: 'text-white/60' },
    { label: 'Precio Promedio', value: formatCurrency(avgPrice), color: 'text-blue-400' },
    { label: 'Rating Promedio', value: `${avgRating}/5`, color: 'text-amber-400' },
  ];

  const axisStyle = { fill: 'rgba(255,255,255,0.2)', fontSize: 11 };
  const gridColor = 'rgba(255,255,255,0.04)';

  const renderCustomLabel = ({ name, percent, x, y, midAngle }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 120;
    const cx2 = x + radius * Math.cos(-midAngle * RADIAN) * 0.15;
    const cy2 = y + radius * Math.sin(-midAngle * RADIAN) * 0.15;
    return percent > 0.05 ? (
      <text x={cx2} y={cy2} fill="rgba(255,255,255,0.5)" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={500}>
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#C9A96E]" />
          <p className="text-[#C9A96E] text-xs tracking-[0.2em] uppercase" style={{ fontWeight: 600 }}>Análisis</p>
        </div>
        <h2 className="text-white/90 text-2xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Reportes</h2>
        <p className="text-white/25 text-sm mt-1">Estadísticas y análisis de inventario</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5"
          >
            <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>{stat.label}</p>
            <p className={`text-xl ${stat.color}`} style={{ fontWeight: 700 }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
        >
          <h3 className="text-white/70 mb-1" style={{ fontWeight: 600 }}>Distribución por Tipo</h3>
          <p className="text-[11px] text-white/20 mb-4">Botellas en stock</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={4} dataKey="value" label={renderCustomLabel} stroke="transparent">
                {pieData.map((e) => <Cell key={e.name} fill={TYPE_COLORS[e.name as WineType] || '#555'} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Health Pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
        >
          <h3 className="text-white/70 mb-1" style={{ fontWeight: 600 }}>Estado del Inventario</h3>
          <p className="text-[11px] text-white/20 mb-4">Salud de stock por producto</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stockHealth} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} stroke="transparent">
                {stockHealth.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Value by Type */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
        >
          <h3 className="text-white/70 mb-1" style={{ fontWeight: 600 }}>Valor por Tipo</h3>
          <p className="text-[11px] text-white/20 mb-4">Comparación venta vs costo</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={valueByType} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }} />
              <Bar dataKey="valor" name="Valor Venta" fill="#8B2252" radius={[6, 6, 0, 0]} />
              <Bar dataKey="costo" name="Costo" fill="#C9A96E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Wines */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
        >
          <h3 className="text-white/70 mb-1" style={{ fontWeight: 600 }}>Top Vinos por Valor</h3>
          <p className="text-[11px] text-white/20 mb-4">Valor total en stock</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topByValue} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis type="number" tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} width={120} axisLine={{ stroke: gridColor }} tickLine={false} />
              <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
              <Bar dataKey="valor" name="Valor" fill="url(#barGradient)" radius={[0, 6, 6, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8B2252" />
                  <stop offset="100%" stopColor="#C9A96E" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Movements summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6"
      >
        <h3 className="text-white/70 mb-1" style={{ fontWeight: 600 }}>Resumen de Movimientos</h3>
        <p className="text-[11px] text-white/20 mb-4">Entradas, salidas y ajustes del período</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={movementsByType} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="cantidad" name="Cantidad" radius={[6, 6, 0, 0]}>
              {movementsByType.map((_, i) => <Cell key={i} fill={['#4ADE80', '#E54D6B', '#FBBF24'][i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
