import { Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/auth/MainLayout';
import AuthRoute from './AuthRoute';

// Auth Routes
export const authRoutes = [
    {
        path: '/auth',
        element: <AuthRoute element={<MainLayout />} />
    }
];

// User Routes
export const userRoutes = [
];

// All Routes
const routes = [...authRoutes, ...userRoutes];

export default routes;
