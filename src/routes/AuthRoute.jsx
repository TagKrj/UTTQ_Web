import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/user/MainLayout';
import Login from '../pages/auth/Login';

export const authRoutes = [
    {
        path: '/login',
        element: (
            <MainLayout>
                <Login />
            </MainLayout>
        ),
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
];

export default authRoutes;
