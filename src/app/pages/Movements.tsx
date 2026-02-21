import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
  CheckCircle,
  Minus,
  Sparkles,
} from 'lucide-react';
import { useWine } from '../context/WineContext';
import { toast } from 'sonner';

const inputClass = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#8B2252]/40 focus:border-[#8B2252]/30 transition-all';

export default function Movements() {
  const { wines, movements, addMovement } = useWine();
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ type: 'entrada' as 'entrada' | 'salida', wineId: 0, quantity: 1, reason: '' });

  const handleSubmit = () => {
    const wine = wines.find((w) => w.id === form.wineId);
    if (!wine || !form.reason) { toast.error('Seleccioná un vino y un motivo'); return; }
    if (form.type === 'salida' && form.quantity > wine.stock) { toast.error('Stock insuficiente'); return; }
    addMovement({
      type: form.type, wineId: wine.id, wineName: wine.name, quantity: form.quantity, reason: form.reason,
      document: `${form.type === 'entrada' ? 'FC' : 'VTA'}-${String(movements.length + 850).padStart(4, '0')}`,
      user: 'Admin',
    });
    toast.success(`${form.type === 'entrada' ? 'Entrada' : 'Salida'} registrada: ${wine.name} x${form.quantity}`);
    setForm({ type: 'entrada', wineId: 0, quantity: 1, reason: '' });
    setShowForm(false);
  };

  const entriesQty = movements.filter((m) => m.type === 'entrada').reduce((s, m) => s + m.quantity, 0);
  const exitsQty = movements.filter((m) => m.type === 'salida').reduce((s, m) => s + m.quantity, 0);
  const adjustments = movements.filter((m) => m.type === 'ajuste').length;
  const filtered = filterType === 'all' ? movements : movements.filter((m) => m.type === filterType);

  const summaryCards = [
    { icon: ArrowDownLeft, label: 'Entradas', value: `+${entriesQty}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10' },
    { icon: ArrowUpRight, label: 'Salidas', value: `-${exitsQty}`, color: 'text-[#E54D6B]', bg: 'bg-[#E54D6B]/10', border: 'border-[#E54D6B]/10' },
    { icon: ArrowUpDown, label: 'Ajustes', value: `${adjustments}`, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            <p className="text-[#C9A96E] text-xs tracking-[0.2em] uppercase" style={{ fontWeight: 600 }}>Registro</p>
          </div>
          <h2 className="text-white/90 text-2xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Movimientos</h2>
        </div>
        <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-gradient-to-r from-[#8B2252] to-[#A63366] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B2252]/20 transition-all flex items-center gap-2 self-start text-sm">
          <Plus className="w-4 h-4" /> Nuevo Movimiento
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 flex items-center gap-4`}
            >
              <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-[11px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 500 }}>{card.label}</p>
                <p className={`text-2xl ${card.color}`} style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-[#8B2252]/30 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white/85" style={{ fontWeight: 600 }}>Registrar Movimiento</h3>
                  <p className="text-white/25 text-xs mt-0.5">Ingresá los datos del movimiento de stock</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/[0.06] rounded-xl transition-all"><X className="w-4 h-4 text-white/30" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 500 }}>Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className={inputClass}>
                    <option value="entrada">Entrada (Compra)</option>
                    <option value="salida">Salida (Venta)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 500 }}>Vino</label>
                  <select value={form.wineId} onChange={(e) => setForm({ ...form, wineId: Number(e.target.value) })} className={inputClass}>
                    <option value={0}>Seleccionar...</option>
                    {wines.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.stock})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 500 }}>Cantidad</label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })} className="p-2.5 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-all"><Minus className="w-3.5 h-3.5 text-white/40" /></button>
                    <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Math.max(1, Number(e.target.value)) })} className={`${inputClass} text-center`} />
                    <button onClick={() => setForm({ ...form, quantity: form.quantity + 1 })} className="p-2.5 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-all"><Plus className="w-3.5 h-3.5 text-white/40" /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 500 }}>Motivo</label>
                  <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Compra a proveedor" className={inputClass} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all">Cancelar</button>
                <button onClick={handleSubmit} disabled={!form.wineId || !form.reason} className="px-5 py-2.5 bg-gradient-to-r from-[#8B2252] to-[#A63366] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B2252]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Registrar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'entrada', label: 'Entradas' },
          { id: 'salida', label: 'Salidas' },
          { id: 'ajuste', label: 'Ajustes' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
              filterType === f.id
                ? 'bg-[#8B2252]/20 text-white/80 border border-[#8B2252]/30'
                : 'bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/50 hover:bg-white/[0.05]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Fecha', 'Tipo', 'Vino', 'Cant.', 'Motivo', 'Doc.', 'Usuario'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] text-white/25 uppercase tracking-[0.1em]" style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((mov, idx) => (
                <motion.tr
                  key={mov.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all duration-300 group"
                >
                  <td className="px-5 py-3.5 text-sm text-white/35 whitespace-nowrap" style={{ fontVariantNumeric: 'tabular-nums' }}>{mov.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] border ${
                      mov.type === 'entrada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' :
                      mov.type === 'salida' ? 'bg-[#E54D6B]/10 text-[#E54D6B] border-[#E54D6B]/15' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/15'
                    }`} style={{ fontWeight: 500 }}>
                      {mov.type.charAt(0).toUpperCase() + mov.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/60 group-hover:text-white/80 transition-colors" style={{ fontWeight: 500 }}>{mov.wineName}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm ${mov.type === 'entrada' ? 'text-emerald-400' : mov.type === 'salida' ? 'text-[#E54D6B]' : 'text-amber-400'}`} style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {mov.type === 'entrada' ? '+' : '-'}{Math.abs(mov.quantity)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/30">{mov.reason}</td>
                  <td className="px-5 py-3.5"><span className="px-2 py-1 bg-white/[0.04] text-white/25 rounded-lg text-[11px] font-mono border border-white/[0.06]">{mov.document}</span></td>
                  <td className="px-5 py-3.5 text-sm text-white/25">{mov.user}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/[0.04] text-[11px] text-white/20">
          {filtered.length} movimientos registrados
        </div>
      </div>
    </div>
  );
}
