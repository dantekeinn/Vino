import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  Trash2,
  Star,
  X,
  Grape,
  MapPin,
  Thermometer,
  CheckCircle,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useWine, WineType } from '../context/WineContext';
import { toast } from 'sonner';

const typeColors: Record<WineType, string> = {
  Tinto: 'bg-red-500/15 text-red-300 border-red-500/20',
  Blanco: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  Rosado: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  Espumante: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  Dulce: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
};

const typeGradients: Record<WineType, string> = {
  Tinto: 'from-red-800 via-red-900 to-[#1a0a0e]',
  Blanco: 'from-amber-700 via-amber-900 to-[#1a150a]',
  Rosado: 'from-pink-700 via-pink-900 to-[#1a0a14]',
  Espumante: 'from-sky-700 via-sky-900 to-[#0a141a]',
  Dulce: 'from-orange-700 via-orange-900 to-[#1a100a]',
};

const emptyForm = {
  name: '', winery: '', type: 'Tinto' as WineType, varietal: '', vintage: 2024,
  region: 'Mendoza', country: 'Argentina', stock: 0, minStock: 6, costPrice: 0,
  salePrice: 0, location: '', rating: 4.0, temperature: '16-18°C', barcode: '',
};

const inputClass = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#8B2252]/40 focus:border-[#8B2252]/30 transition-all';
const labelClass = 'block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider';

export default function Inventory() {
  const { wines, addWine, deleteWine, formatCurrency, wineTypes, regions } = useWine();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedWine, setSelectedWine] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    let result = wines.filter((w) => {
      const s = search.toLowerCase();
      const matchSearch = w.name.toLowerCase().includes(s) || w.winery.toLowerCase().includes(s) || w.varietal.toLowerCase().includes(s);
      const matchType = filterType === 'all' || w.type === filterType;
      const matchRegion = filterRegion === 'all' || w.region === filterRegion;
      return matchSearch && matchType && matchRegion;
    });
    result.sort((a, b) => {
      let vA: any, vB: any;
      switch (sortBy) {
        case 'name': vA = a.name; vB = b.name; break;
        case 'stock': vA = a.stock; vB = b.stock; break;
        case 'price': vA = a.salePrice; vB = b.salePrice; break;
        case 'rating': vA = a.rating; vB = b.rating; break;
        case 'vintage': vA = a.vintage; vB = b.vintage; break;
        default: vA = a.name; vB = b.name;
      }
      return sortDir === 'asc' ? (vA > vB ? 1 : -1) : (vA < vB ? 1 : -1);
    });
    return result;
  }, [wines, search, filterType, filterRegion, sortBy, sortDir]);

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortDir('asc'); }
  };

  const handleAddWine = () => {
    if (!form.name || !form.winery || !form.salePrice) {
      toast.error('Completá nombre, bodega y precio de venta');
      return;
    }
    addWine({ ...form, lastEntry: new Date().toISOString().split('T')[0] });
    setForm(emptyForm);
    setShowAddForm(false);
    toast.success(`${form.name} agregado al inventario`);
  };

  const handleDelete = (id: number, name: string) => {
    deleteWine(id);
    toast.success(`${name} eliminado`);
  };

  const detail = selectedWine !== null ? wines.find((w) => w.id === selectedWine) : null;

  const SortIcon = ({ field }: { field: string }) =>
    sortBy === field ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            <p className="text-[#C9A96E] text-xs tracking-[0.2em] uppercase" style={{ fontWeight: 600 }}>Catálogo</p>
          </div>
          <h2 className="text-white/90 text-2xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            Inventario
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#8B2252] to-[#A63366] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B2252]/20 transition-all flex items-center gap-2 self-start text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Vino
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Buscar por nombre, bodega o varietal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} !pl-10`}
          />
        </div>
        <div className="flex gap-3">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={`${inputClass} min-w-[140px]`}>
            <option value="all">Todos los tipos</option>
            {wineTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className={`${inputClass} min-w-[150px]`}>
            <option value="all">Todas las regiones</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-[#8B2252]/30 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white/85" style={{ fontWeight: 600 }}>Agregar Nuevo Vino</h3>
                  <p className="text-white/25 text-xs mt-0.5">Completá los datos del producto</p>
                </div>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/[0.06] rounded-xl transition-all">
                  <X className="w-4 h-4 text-white/30" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Nombre *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Catena Zapata Malbec" /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Bodega *</label><input value={form.winery} onChange={(e) => setForm({ ...form, winery: e.target.value })} className={inputClass} placeholder="Bodega Catena Zapata" /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Tipo</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as WineType })} className={inputClass}>{wineTypes.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Varietal</label><input value={form.varietal} onChange={(e) => setForm({ ...form, varietal: e.target.value })} className={inputClass} placeholder="Malbec" /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Cosecha</label><input type="number" value={form.vintage} onChange={(e) => setForm({ ...form, vintage: Number(e.target.value) })} className={inputClass} /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Región</label><input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Precio Costo</label><input type="number" value={form.costPrice || ''} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} className={inputClass} placeholder="0" /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Precio Venta *</label><input type="number" value={form.salePrice || ''} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })} className={inputClass} placeholder="0" /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Stock Inicial</label><input type="number" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className={inputClass} placeholder="0" /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Stock Mínimo</label><input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} className={inputClass} /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Ubicación</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="A1-01" /></div>
                <div><label className={labelClass} style={{ fontWeight: 500 }}>Temp. Servicio</label><input value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} className={inputClass} /></div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-all">Cancelar</button>
                <button onClick={handleAddWine} className="px-5 py-2.5 bg-gradient-to-r from-[#8B2252] to-[#A63366] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B2252]/20 transition-all text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Guardar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[
                  { key: 'name', label: 'Vino' },
                  { key: 'type', label: 'Tipo' },
                  { key: 'vintage', label: 'Cosecha' },
                  { key: 'stock', label: 'Stock' },
                  { key: 'price', label: 'Precio' },
                  { key: 'rating', label: 'Rating' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-5 py-3.5 text-left text-[10px] text-white/25 uppercase tracking-[0.1em] cursor-pointer hover:text-white/50 transition-colors select-none"
                    style={{ fontWeight: 600 }}
                  >
                    <div className="flex items-center gap-1">{col.label} <SortIcon field={col.key} /></div>
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left text-[10px] text-white/25 uppercase tracking-[0.1em]" style={{ fontWeight: 600 }}>Ubicación</th>
                <th className="px-5 py-3.5 text-left text-[10px] text-white/25 uppercase tracking-[0.1em]" style={{ fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wine, idx) => {
                const isLow = wine.stock <= wine.minStock && wine.stock > 0;
                const isOut = wine.stock === 0;
                return (
                  <motion.tr
                    key={wine.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all duration-300 group"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors" style={{ fontWeight: 500 }}>{wine.name}</p>
                      <p className="text-[11px] text-white/25">{wine.winery} · {wine.varietal}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] border ${typeColors[wine.type]}`} style={{ fontWeight: 500 }}>{wine.type}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/40" style={{ fontVariantNumeric: 'tabular-nums' }}>{wine.vintage}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isOut ? 'text-[#E54D6B]' : isLow ? 'text-amber-400' : 'text-emerald-400'}`} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{wine.stock}</span>
                        {isOut && <span className="px-1.5 py-0.5 bg-[#E54D6B]/15 text-[#E54D6B] border border-[#E54D6B]/20 rounded text-[9px]" style={{ fontWeight: 700 }}>SIN STOCK</span>}
                        {isLow && <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded text-[9px]" style={{ fontWeight: 700 }}>BAJO</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-white/50" style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(wine.salePrice)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#C9A96E] fill-[#C9A96E]" />
                        <span className="text-sm text-white/50" style={{ fontWeight: 500 }}>{wine.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 bg-white/[0.04] text-white/30 rounded-lg text-[11px] font-mono border border-white/[0.06]">{wine.location}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedWine(wine.id)} className="p-2 hover:bg-white/[0.06] rounded-lg transition-all" title="Detalle">
                          <Eye className="w-3.5 h-3.5 text-white/30 hover:text-white/60" />
                        </button>
                        <button onClick={() => handleDelete(wine.id, wine.name)} className="p-2 hover:bg-[#E54D6B]/10 rounded-lg transition-all" title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5 text-white/20 hover:text-[#E54D6B]" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/[0.04] text-[11px] text-white/20 flex items-center justify-between">
          <span>Mostrando {filtered.length} de {wines.length} vinos</span>
          <span className="text-[#C9A96E]/40">{wines.reduce((s, w) => s + w.stock, 0)} botellas totales</span>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setSelectedWine(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-[#141220] border border-white/[0.08] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header gradient */}
              <div className={`relative bg-gradient-to-br ${typeGradients[detail.type]} p-8 rounded-t-3xl overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#141220]/80 to-transparent" />
                <div className="relative">
                  <button onClick={() => setSelectedWine(null)} className="absolute top-0 right-0 p-2 hover:bg-white/10 rounded-xl transition-all">
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] border ${typeColors[detail.type]} inline-block mb-3`} style={{ fontWeight: 500 }}>{detail.type}</span>
                  <h3 className="text-2xl text-white/95" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{detail.name}</h3>
                  <p className="text-white/40 text-sm mt-1">{detail.winery} · Cosecha {detail.vintage}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Grape, label: 'Varietal', value: detail.varietal },
                    { icon: MapPin, label: 'Región', value: detail.region },
                    { icon: Thermometer, label: 'Temp.', value: detail.temperature },
                    { icon: Star, label: 'Rating', value: `${detail.rating}/5` },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="text-center p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                        <Icon className="w-4 h-4 text-[#C9A96E]/60 mx-auto mb-1.5" />
                        <p className="text-[10px] text-white/25 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm text-white/70 mt-0.5" style={{ fontWeight: 500 }}>{item.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Precio Costo</p>
                    <p className="text-xl text-white/60" style={{ fontWeight: 600 }}>{formatCurrency(detail.costPrice)}</p>
                  </div>
                  <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">Precio Venta</p>
                    <p className="text-xl text-[#C9A96E]" style={{ fontWeight: 600 }}>{formatCurrency(detail.salePrice)}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-white/50" style={{ fontWeight: 500 }}>Stock Actual</p>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] border ${
                      detail.stock === 0 ? 'bg-[#E54D6B]/15 text-[#E54D6B] border-[#E54D6B]/20' :
                      detail.stock <= detail.minStock ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                      'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                    }`} style={{ fontWeight: 500 }}>
                      {detail.stock === 0 ? 'Sin Stock' : detail.stock <= detail.minStock ? 'Bajo' : 'Normal'}
                    </span>
                  </div>
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-3xl text-white/85" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{detail.stock}</p>
                      <p className="text-[11px] text-white/25 mt-0.5">Mínimo: {detail.minStock}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${detail.stock === 0 ? 'bg-[#E54D6B]' : detail.stock <= detail.minStock ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (detail.stock / (detail.minStock * 4)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <p className="text-[10px] text-white/20 uppercase tracking-wider">Ubicación</p>
                    <p className="font-mono text-white/50 text-sm mt-0.5" style={{ fontWeight: 500 }}>{detail.location}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <p className="text-[10px] text-white/20 uppercase tracking-wider">Código</p>
                    <p className="font-mono text-white/50 text-[11px] mt-0.5" style={{ fontWeight: 500 }}>{detail.barcode}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    <p className="text-[10px] text-white/20 uppercase tracking-wider">Ingreso</p>
                    <p className="text-white/50 text-sm mt-0.5" style={{ fontWeight: 500 }}>{detail.lastEntry}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
