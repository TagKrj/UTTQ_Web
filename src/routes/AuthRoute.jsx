import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/auth/MainLayout';
import Login from '../pages/auth/Login';
import Onboard from '../pages/auth/Onboard';
import Register from '../pages/auth/Register';

const withAuthLayout = (page) => <MainLayout>{page}</MainLayout>;

const authPages = [
    { path: '/login', page: <Login /> },
    { path: '/onboard', page: <Onboard /> },
    { path: '/register', page: <Register /> }
];

export const authRoutes = authPages.map(({ path, page }) => ({
    path,
    element: withAuthLayout(page),
})).concat({
    path: '*',
    element: <Navigate to="/login" replace />,
});

export default authRoutes;
