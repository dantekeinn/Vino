import { createBrowserRouter } from 'react-router';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Movements from './pages/Movements';
import Suppliers from './pages/Suppliers';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'inventario', Component: Inventory },
      { path: 'movimientos', Component: Movements },
      { path: 'proveedores', Component: Suppliers },
      { path: 'alertas', Component: Alerts },
      { path: 'reportes', Component: Reports },
    ],
  },
]);
