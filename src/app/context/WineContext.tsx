import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type WineType = 'Tinto' | 'Blanco' | 'Rosado' | 'Espumante' | 'Dulce';

export interface WineProduct {
  id: number;
  name: string;
  winery: string;
  type: WineType;
  varietal: string;
  vintage: number;
  region: string;
  country: string;
  stock: number;
  minStock: number;
  costPrice: number;
  salePrice: number;
  location: string;
  rating: number;
  temperature: string;
  barcode: string;
  lastEntry: string;
}

export interface StockMovement {
  id: number;
  date: string;
  type: 'entrada' | 'salida' | 'ajuste';
  wineId: number;
  wineName: string;
  quantity: number;
  reason: string;
  supplier?: string;
  document?: string;
  user: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  wines: number;
  lastOrder: string;
  status: 'activo' | 'inactivo';
  rating: number;
  totalPurchases: number;
}

interface WineContextValue {
  wines: WineProduct[];
  movements: StockMovement[];
  suppliers: Supplier[];
  addWine: (wine: Omit<WineProduct, 'id'>) => void;
  updateWine: (id: number, data: Partial<WineProduct>) => void;
  deleteWine: (id: number) => void;
  addMovement: (mov: Omit<StockMovement, 'id' | 'date'>) => void;
  totalBottles: number;
  totalValue: number;
  totalCost: number;
  lowStockWines: WineProduct[];
  outOfStockWines: WineProduct[];
  formatCurrency: (v: number) => string;
  wineTypes: WineType[];
  regions: string[];
}

const WineContext = createContext<WineContextValue | null>(null);

export function useWine() {
  const ctx = useContext(WineContext);
  if (!ctx) throw new Error('useWine must be used within WineProvider');
  return ctx;
}

const INITIAL_WINES: WineProduct[] = [
  { id: 1, name: 'Catena Zapata Malbec', winery: 'Bodega Catena Zapata', type: 'Tinto', varietal: 'Malbec', vintage: 2020, region: 'Mendoza', country: 'Argentina', stock: 48, minStock: 12, costPrice: 3200, salePrice: 5800, location: 'A1-01', rating: 4.8, temperature: '16-18°C', barcode: '7790185000011', lastEntry: '2025-12-15' },
  { id: 2, name: 'Luigi Bosca Reserva', winery: 'Luigi Bosca', type: 'Tinto', varietal: 'Cabernet Sauvignon', vintage: 2019, region: 'Mendoza', country: 'Argentina', stock: 36, minStock: 10, costPrice: 2800, salePrice: 4900, location: 'A1-02', rating: 4.5, temperature: '16-18°C', barcode: '7790185000028', lastEntry: '2025-11-20' },
  { id: 3, name: 'Rutini Trumpeter Chardonnay', winery: 'Rutini Wines', type: 'Blanco', varietal: 'Chardonnay', vintage: 2022, region: 'Mendoza', country: 'Argentina', stock: 24, minStock: 8, costPrice: 1800, salePrice: 3200, location: 'B1-01', rating: 4.3, temperature: '8-10°C', barcode: '7790185000035', lastEntry: '2026-01-10' },
  { id: 4, name: 'Chandon Brut Nature', winery: 'Chandon Argentina', type: 'Espumante', varietal: 'Blend', vintage: 2021, region: 'Mendoza', country: 'Argentina', stock: 60, minStock: 20, costPrice: 2200, salePrice: 3800, location: 'C1-01', rating: 4.4, temperature: '6-8°C', barcode: '7790185000042', lastEntry: '2026-01-05' },
  { id: 5, name: 'Susana Balbo Signature Rosé', winery: 'Susana Balbo', type: 'Rosado', varietal: 'Malbec Rosé', vintage: 2023, region: 'Mendoza', country: 'Argentina', stock: 18, minStock: 6, costPrice: 2400, salePrice: 4200, location: 'B2-01', rating: 4.6, temperature: '10-12°C', barcode: '7790185000059', lastEntry: '2026-02-01' },
  { id: 6, name: 'Zuccardi Valle de Uco', winery: 'Familia Zuccardi', type: 'Tinto', varietal: 'Malbec', vintage: 2018, region: 'Valle de Uco', country: 'Argentina', stock: 5, minStock: 8, costPrice: 8500, salePrice: 14500, location: 'A2-01', rating: 4.9, temperature: '16-18°C', barcode: '7790185000066', lastEntry: '2025-10-30' },
  { id: 7, name: 'Terrazas de los Andes Reserva', winery: 'Terrazas de los Andes', type: 'Tinto', varietal: 'Malbec', vintage: 2021, region: 'Mendoza', country: 'Argentina', stock: 42, minStock: 15, costPrice: 1900, salePrice: 3400, location: 'A1-03', rating: 4.2, temperature: '16-18°C', barcode: '7790185000073', lastEntry: '2026-01-18' },
  { id: 8, name: 'Alma Negra M·Blend', winery: 'Ernesto Catena', type: 'Tinto', varietal: 'Blend', vintage: 2021, region: 'Mendoza', country: 'Argentina', stock: 3, minStock: 6, costPrice: 3600, salePrice: 6200, location: 'A2-02', rating: 4.7, temperature: '16-18°C', barcode: '7790185000080', lastEntry: '2025-09-12' },
  { id: 9, name: 'Trapiche Gran Medalla', winery: 'Trapiche', type: 'Tinto', varietal: 'Cabernet Franc', vintage: 2019, region: 'Mendoza', country: 'Argentina', stock: 15, minStock: 8, costPrice: 4200, salePrice: 7200, location: 'A2-03', rating: 4.6, temperature: '16-18°C', barcode: '7790185000097', lastEntry: '2025-12-01' },
  { id: 10, name: 'Norton Reserva Torrontés', winery: 'Bodega Norton', type: 'Blanco', varietal: 'Torrontés', vintage: 2023, region: 'Salta', country: 'Argentina', stock: 30, minStock: 10, costPrice: 1500, salePrice: 2800, location: 'B1-02', rating: 4.1, temperature: '8-10°C', barcode: '7790185000104', lastEntry: '2026-02-10' },
  { id: 11, name: 'Familia Schroeder Pinot Noir', winery: 'Familia Schroeder', type: 'Tinto', varietal: 'Pinot Noir', vintage: 2020, region: 'Patagonia', country: 'Argentina', stock: 8, minStock: 6, costPrice: 3800, salePrice: 6500, location: 'A3-01', rating: 4.5, temperature: '14-16°C', barcode: '7790185000111', lastEntry: '2025-11-05' },
  { id: 12, name: 'Navarro Correas Colección Privada', winery: 'Navarro Correas', type: 'Tinto', varietal: 'Malbec', vintage: 2020, region: 'Mendoza', country: 'Argentina', stock: 22, minStock: 10, costPrice: 2100, salePrice: 3700, location: 'A1-04', rating: 4.3, temperature: '16-18°C', barcode: '7790185000128', lastEntry: '2026-01-22' },
  { id: 13, name: 'Salentein Numina', winery: 'Bodegas Salentein', type: 'Tinto', varietal: 'Malbec', vintage: 2019, region: 'Valle de Uco', country: 'Argentina', stock: 12, minStock: 6, costPrice: 5200, salePrice: 8800, location: 'A2-04', rating: 4.7, temperature: '16-18°C', barcode: '7790185000135', lastEntry: '2025-12-20' },
  { id: 14, name: 'Nieto Senetiner Bonarda', winery: 'Nieto Senetiner', type: 'Tinto', varietal: 'Bonarda', vintage: 2022, region: 'Mendoza', country: 'Argentina', stock: 28, minStock: 8, costPrice: 1400, salePrice: 2600, location: 'A1-05', rating: 4.0, temperature: '16-18°C', barcode: '7790185000142', lastEntry: '2026-02-05' },
  { id: 15, name: 'Cruzat Cuvée Prestige', winery: 'Bodega Cruzat', type: 'Espumante', varietal: 'Pinot Noir / Chardonnay', vintage: 2020, region: 'Mendoza', country: 'Argentina', stock: 2, minStock: 6, costPrice: 4800, salePrice: 8200, location: 'C1-02', rating: 4.8, temperature: '6-8°C', barcode: '7790185000159', lastEntry: '2025-08-15' },
  { id: 16, name: 'Colomé Torrontés', winery: 'Bodega Colomé', type: 'Blanco', varietal: 'Torrontés', vintage: 2023, region: 'Salta', country: 'Argentina', stock: 20, minStock: 8, costPrice: 2600, salePrice: 4500, location: 'B1-03', rating: 4.4, temperature: '8-10°C', barcode: '7790185000166', lastEntry: '2026-01-28' },
  { id: 17, name: 'El Enemigo Cabernet Franc', winery: 'Aleanna', type: 'Tinto', varietal: 'Cabernet Franc', vintage: 2019, region: 'Mendoza', country: 'Argentina', stock: 10, minStock: 5, costPrice: 6000, salePrice: 10500, location: 'A3-02', rating: 4.8, temperature: '16-18°C', barcode: '7790185000173', lastEntry: '2025-11-15' },
  { id: 18, name: 'Lagarde Guarda Syrah', winery: 'Bodega Lagarde', type: 'Tinto', varietal: 'Syrah', vintage: 2020, region: 'Mendoza', country: 'Argentina', stock: 16, minStock: 6, costPrice: 3100, salePrice: 5400, location: 'A1-06', rating: 4.4, temperature: '16-18°C', barcode: '7790185000180', lastEntry: '2025-12-28' },
  { id: 19, name: 'Alamos Dulce Natural', winery: 'Alamos', type: 'Dulce', varietal: 'Moscatel', vintage: 2022, region: 'Mendoza', country: 'Argentina', stock: 14, minStock: 6, costPrice: 1200, salePrice: 2200, location: 'D1-01', rating: 4.0, temperature: '6-8°C', barcode: '7790185000197', lastEntry: '2026-01-15' },
  { id: 20, name: 'Pascual Toso Magdalena Toso', winery: 'Pascual Toso', type: 'Tinto', varietal: 'Malbec Blend', vintage: 2017, region: 'Mendoza', country: 'Argentina', stock: 4, minStock: 4, costPrice: 9800, salePrice: 16500, location: 'A3-03', rating: 4.9, temperature: '16-18°C', barcode: '7790185000204', lastEntry: '2025-07-20' },
];

const INITIAL_MOVEMENTS: StockMovement[] = [
  { id: 1, date: '2026-02-20', type: 'entrada', wineId: 1, wineName: 'Catena Zapata Malbec', quantity: 24, reason: 'Compra a proveedor', supplier: 'Distribuidora Catena', document: 'FC-0847', user: 'Admin' },
  { id: 2, date: '2026-02-19', type: 'salida', wineId: 4, wineName: 'Chandon Brut Nature', quantity: 6, reason: 'Venta mostrador', document: 'VTA-1523', user: 'María López' },
  { id: 3, date: '2026-02-19', type: 'salida', wineId: 7, wineName: 'Terrazas de los Andes Reserva', quantity: 3, reason: 'Venta online', document: 'VTA-1522', user: 'Sistema Web' },
  { id: 4, date: '2026-02-18', type: 'entrada', wineId: 10, wineName: 'Norton Reserva Torrontés', quantity: 12, reason: 'Compra a proveedor', supplier: 'Norton Distribución', document: 'FC-0845', user: 'Admin' },
  { id: 5, date: '2026-02-18', type: 'salida', wineId: 6, wineName: 'Zuccardi Valle de Uco', quantity: 2, reason: 'Venta degustación', document: 'VTA-1520', user: 'Carlos Méndez' },
  { id: 6, date: '2026-02-17', type: 'entrada', wineId: 5, wineName: 'Susana Balbo Signature Rosé', quantity: 18, reason: 'Compra a proveedor', supplier: 'Vinoteca Mayorista', document: 'FC-0843', user: 'Admin' },
  { id: 7, date: '2026-02-17', type: 'salida', wineId: 9, wineName: 'Trapiche Gran Medalla', quantity: 4, reason: 'Venta corporativa', document: 'VTA-1518', user: 'María López' },
  { id: 8, date: '2026-02-16', type: 'ajuste', wineId: 15, wineName: 'Cruzat Cuvée Prestige', quantity: -1, reason: 'Rotura en depósito', document: 'AJ-0031', user: 'Admin' },
  { id: 9, date: '2026-02-16', type: 'entrada', wineId: 3, wineName: 'Rutini Trumpeter Chardonnay', quantity: 12, reason: 'Compra a proveedor', supplier: 'Rutini Distribuidora', document: 'FC-0841', user: 'Admin' },
  { id: 10, date: '2026-02-15', type: 'salida', wineId: 13, wineName: 'Salentein Numina', quantity: 6, reason: 'Venta evento especial', document: 'VTA-1515', user: 'Carlos Méndez' },
  { id: 11, date: '2026-02-15', type: 'salida', wineId: 17, wineName: 'El Enemigo Cabernet Franc', quantity: 2, reason: 'Venta mostrador', document: 'VTA-1514', user: 'María López' },
  { id: 12, date: '2026-02-14', type: 'entrada', wineId: 14, wineName: 'Nieto Senetiner Bonarda', quantity: 24, reason: 'Compra a proveedor', supplier: 'Distribuidora Nieto', document: 'FC-0839', user: 'Admin' },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Distribuidora Catena', contact: 'Alejandro Vega', phone: '+54 261 555-0101', email: 'ventas@catena-dist.com.ar', address: 'Ruta 7, Km 1050, Agrelo, Mendoza', wines: 4, lastOrder: '2026-02-20', status: 'activo', rating: 5, totalPurchases: 2450000 },
  { id: 2, name: 'Vinoteca Mayorista Sur', contact: 'Laura Fernández', phone: '+54 11 555-0202', email: 'compras@vmayorista.com.ar', address: 'Av. Belgrano 1240, CABA', wines: 8, lastOrder: '2026-02-17', status: 'activo', rating: 4, totalPurchases: 1820000 },
  { id: 3, name: 'Norton Distribución', contact: 'Martín Rodríguez', phone: '+54 261 555-0303', email: 'pedidos@norton-dist.com.ar', address: 'Ruta 40, Km 955, Luján de Cuyo', wines: 3, lastOrder: '2026-02-18', status: 'activo', rating: 4, totalPurchases: 980000 },
  { id: 4, name: 'Rutini Distribuidora', contact: 'Pablo García', phone: '+54 261 555-0404', email: 'ventas@rutini-dist.com.ar', address: 'Montecaseros 1125, San Martín, Mendoza', wines: 2, lastOrder: '2026-02-16', status: 'activo', rating: 5, totalPurchases: 1350000 },
  { id: 5, name: 'Patagonia Wines Import', contact: 'Natalia Pérez', phone: '+54 299 555-0505', email: 'info@patagoniawines.com.ar', address: 'Av. Argentina 250, Neuquén', wines: 3, lastOrder: '2025-12-10', status: 'activo', rating: 3, totalPurchases: 620000 },
  { id: 6, name: 'Bodega del Norte SRL', contact: 'Ricardo Sánchez', phone: '+54 387 555-0606', email: 'contacto@bodegadelnorte.com.ar', address: 'Ruta Nac. 68, Km 42, Cafayate, Salta', wines: 2, lastOrder: '2025-10-05', status: 'inactivo', rating: 3, totalPurchases: 340000 },
];

export function WineProvider({ children }: { children: ReactNode }) {
  const [wines, setWines] = useState<WineProduct[]>(INITIAL_WINES);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

  const addWine = (wine: Omit<WineProduct, 'id'>) => {
    setWines(prev => [...prev, { ...wine, id: Math.max(...prev.map(w => w.id), 0) + 1 }]);
  };

  const updateWine = (id: number, data: Partial<WineProduct>) => {
    setWines(prev => prev.map(w => (w.id === id ? { ...w, ...data } : w)));
  };

  const deleteWine = (id: number) => {
    setWines(prev => prev.filter(w => w.id !== id));
  };

  const addMovement = (mov: Omit<StockMovement, 'id' | 'date'>) => {
    const newId = Math.max(...movements.map(m => m.id), 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    setMovements(prev => [{ ...mov, id: newId, date: today }, ...prev]);

    setWines(prev =>
      prev.map(w => {
        if (w.id !== mov.wineId) return w;
        const delta = mov.type === 'entrada' ? mov.quantity : mov.type === 'salida' ? -mov.quantity : mov.quantity;
        return { ...w, stock: Math.max(0, w.stock + delta), lastEntry: mov.type === 'entrada' ? today : w.lastEntry };
      }),
    );
  };

  const totalBottles = useMemo(() => wines.reduce((s, w) => s + w.stock, 0), [wines]);
  const totalValue = useMemo(() => wines.reduce((s, w) => s + w.stock * w.salePrice, 0), [wines]);
  const totalCost = useMemo(() => wines.reduce((s, w) => s + w.stock * w.costPrice, 0), [wines]);
  const lowStockWines = useMemo(() => wines.filter(w => w.stock <= w.minStock && w.stock > 0), [wines]);
  const outOfStockWines = useMemo(() => wines.filter(w => w.stock === 0), [wines]);

  const wineTypes: WineType[] = ['Tinto', 'Blanco', 'Rosado', 'Espumante', 'Dulce'];
  const regions = useMemo(() => [...new Set(wines.map(w => w.region))], [wines]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

  return (
    <WineContext.Provider
      value={{
        wines,
        movements,
        suppliers,
        addWine,
        updateWine,
        deleteWine,
        addMovement,
        totalBottles,
        totalValue,
        totalCost,
        lowStockWines,
        outOfStockWines,
        formatCurrency,
        wineTypes,
        regions,
      }}
    >
      {children}
    </WineContext.Provider>
  );
}
