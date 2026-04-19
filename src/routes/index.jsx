import { authRoutes } from './AuthRoute';
import { userRoutes } from './UserRouter';
import LandingPage from '../layouts/user/landingPage';

export const landingRoutes = [
    {
        path: '/landing',
        element: <LandingPage />,
    },
];

const routes = [...authRoutes, ...userRoutes, ...landingRoutes];

export default routes;
