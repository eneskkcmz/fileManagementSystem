import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Factories } from './pages/Factories';
import { FactoryDetail } from './pages/FactoryDetail';
import { ProjectDetail } from './pages/ProjectDetail';
import { ActivityPage } from './pages/ActivityPage';
import {
  BuHaftaPage, IslerPage, KisilerPage, DokumanlarPage, AnalitikPage,
} from './pages/Placeholders';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10_000, refetchOnWindowFocus: false } },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'bu-hafta', element: <BuHaftaPage /> },
      { path: 'isler', element: <IslerPage /> },
      { path: 'kisiler', element: <KisilerPage /> },
      { path: 'dokumanlar', element: <DokumanlarPage /> },
      { path: 'analitik', element: <AnalitikPage /> },
      { path: 'aktiviteler', element: <ActivityPage /> },
      // Geçici Yönetim (tek-müşteri modeline geçilince sadeleşecek)
      { path: 'fabrikalar', element: <Factories /> },
      { path: 'factories/:factoryId', element: <FactoryDetail /> },
      { path: 'projects/:projectId', element: <ProjectDetail /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
