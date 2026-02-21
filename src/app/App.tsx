import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { WineProvider } from './context/WineContext';

export default function App() {
  return (
    <WineProvider>
      <Toaster position="top-right" richColors theme="dark" />
      <RouterProvider router={router} />
    </WineProvider>
  );
}