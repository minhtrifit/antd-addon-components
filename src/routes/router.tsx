import { createBrowserRouter } from 'react-router-dom';
import { APP_ROUTE } from './route.constant';

import Layout from '@/components/global/layout/Layout';
import DashboardLayout from '@/components/global/layout/DashboardLayout';

import { NotFoundPage } from '@/pages/not-found-page';
import HomePage from '@/pages/home';
import DashboardPage from '@/pages/dashboard';
import JsonEditorPage from '@/pages/json-editor';

export const router = createBrowserRouter([
  {
    path: APP_ROUTE.DEFAULT,
    element: <Layout />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: APP_ROUTE.DASHBOARD,
    element: <DashboardLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
  {
    path: APP_ROUTE.JSON_EDITOR,
    element: <DashboardLayout />,
    children: [{ index: true, element: <JsonEditorPage /> }],
  },
  { path: '/*', element: <NotFoundPage /> },
]);
