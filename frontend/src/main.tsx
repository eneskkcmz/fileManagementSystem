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
      { path: 'factories', element: <Factories /> },
      { path: 'factories/:factoryId', element: <FactoryDetail /> },
      { path: 'projects/:projectId', element: <ProjectDetail /> },
      { path: 'activity', element: <ActivityPage /> },
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
