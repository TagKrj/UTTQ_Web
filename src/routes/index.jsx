import { Navigate } from 'react-router-dom';
import { authRoutes } from './AuthRoute';
import LandingPage from '../layouts/user/landingPage';

export const userRoutes = [
    {
        path: '/',
        element: <Navigate to="/landing" replace />,
    },
    {
        path: '/landing',
        element: <LandingPage />,
    },
];

const routes = [...authRoutes, ...userRoutes];

export default routes;
