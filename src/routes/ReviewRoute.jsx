import MainLayout from '../layouts/user/MainLayout';
import ReviewLayout from '../pages/user/dashboard/reviewLayout';
import ListSubjects from '../pages/user/dashboard/review/listSubjects';
import RecentSubjects from '../pages/user/dashboard/review/recentSubjects';

const withReviewLayout = (page) => <MainLayout>{page}</MainLayout>;

export const reviewRoutes = [
    {
        path: '/review',
        element: withReviewLayout(<ReviewLayout />),
        children: [
            {
                index: true,
                element: <ListSubjects />,
            },
            {
                path: 'recent',
                element: <RecentSubjects />,
            },
        ],
    },
];

export default reviewRoutes;
