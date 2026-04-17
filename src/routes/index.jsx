import { authRoutes } from './AuthRoute';

export const userRoutes = [];

const routes = [...authRoutes, ...userRoutes];

export default routes;
