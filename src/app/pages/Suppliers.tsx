import { motion } from 'motion/react';
import {
  Truck,
  DollarSign,
  Wine,
  MapPin,
  Star,
  Phone,
  Mail,
  FileText,
  Plus,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useWine } from '../context/WineContext';

export default function Suppliers() {
  const { suppliers, formatCurrency } = useWine();
  const activeCount = suppliers.filter((s) => s.status === 'activo').length;
  const totalPurchases = suppliers.reduce((s, sp) => s + sp.totalPurchases, 0);
  const totalLabels = suppliers.reduce((s, sp) => s + sp.wines, 0);

  const stats = [
    { icon: Truck, label: 'Proveedores Activos', value: activeCount, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: DollarSign, label: 'Total Compras', value: formatCurrency(totalPurchases), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Wine, label: 'Etiquetas', value: totalLabels, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            <p className="text-[#C9A96E] text-xs tracking-[0.2em] uppercase" style={{ fontWeight: 600 }}>Red comercial</p>
          </div>
          <h2 className="text-white/90 text-2xl" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Proveedores</h2>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-r from-[#8B2252] to-[#A63366] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B2252]/20 transition-all flex items-center gap-2 self-start text-sm">
          <Plus className="w-4 h-4" /> Nuevo Proveedor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 flex items-center gap-4"
            >
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[11px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 500 }}>{stat.label}</p>
                <p className="text-2xl text-white/80" style={{ fontWeight: 700 }}>{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {suppliers.map((sup, idx) => (
          <motion.div
            key={sup.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.06 }}
            className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 group"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B2252] to-[#C9A96E] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[#8B2252]/10" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  {sup.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h3 className="text-white/85 group-hover:text-white/95 transition-colors" style={{ fontWeight: 600 }}>{sup.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] border ${
                      sup.status === 'activo'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                        : 'bg-white/[0.04] text-white/25 border-white/[0.06]'
                    }`} style={{ fontWeight: 500 }}>
                      {sup.status === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-white/35 mb-3">Contacto: <span className="text-white/50">{sup.contact}</span></p>
                  <div className="flex flex-col gap-1.5 text-sm text-white/30">
                    <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-white/15 flex-shrink-0" /> <span className="truncate">{sup.address}</span></span>
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                      <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-white/15" /> {sup.phone}</span>
                      <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-white/15" /> {sup.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-64 space-y-3 flex-shrink-0">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.04]">
                    <p className="text-[10px] text-white/20 uppercase tracking-wider">Vinos</p>
                    <p className="text-sm text-white/60 mt-0.5" style={{ fontWeight: 700 }}>{sup.wines}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.04]">
                    <p className="text-[10px] text-white/20 uppercase tracking-wider">Rating</p>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2.5 h-2.5 ${i < sup.rating ? 'text-[#C9A96E] fill-[#C9A96E]' : 'text-white/10'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.04]">
                    <p className="text-[10px] text-white/20 uppercase tracking-wider">Compras</p>
                    <p className="text-[11px] text-[#C9A96E]/70 mt-0.5" style={{ fontWeight: 600 }}>{formatCurrency(sup.totalPurchases)}</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/15 text-center">Último pedido: {sup.lastOrder}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-[#8B2252] to-[#A63366] text-white rounded-xl hover:shadow-lg hover:shadow-[#8B2252]/20 transition-all text-sm flex items-center justify-center gap-1.5" style={{ fontWeight: 500 }}>
                    Nuevo Pedido <ExternalLink className="w-3 h-3" />
                  </button>
                  <button className="px-3 py-2.5 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-all">
                    <FileText className="w-4 h-4 text-white/25" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
