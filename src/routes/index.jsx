import { Navigate } from 'react-router-dom';
import { authRoutes } from './AuthRoute';
import { userRoutes } from './UserRouter';
import LandingPage from '../layouts/user/landingPage';

export const landingRoutes = [
    {
        path: '/',
        element: <Navigate to="/landing" replace />,
    },
    {
        path: '/landing',
        element: <LandingPage />,
    },
];

const routes = [...authRoutes, ...userRoutes, ...landingRoutes];

export default routes;
