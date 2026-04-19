import MainLayout from '../layouts/user/MainLayout';
import Statistical from '../pages/user/dashboard/statistical';
import Setting from '../pages/user/dashboard/setting';
import Account from '../pages/user/dashboard/account';
import { reviewRoutes } from './ReviewRoute';

const withUserLayout = (page) => <MainLayout>{page}</MainLayout>;

const userPages = [
    { path: '/', page: <Statistical /> },
    { path: '/statistical', page: <Statistical /> },
    { path: '/setting', page: <Setting /> },
    { path: '/account', page: <Account /> },
];

export const userRoutes = [
    ...userPages.map(({ path, page }) => ({
        path,
        element: withUserLayout(page),
    })),
    ...reviewRoutes,
];

export default userRoutes;
