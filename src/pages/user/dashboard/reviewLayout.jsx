import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BagSvg as RecentTabIcon, ReviewSvg as ReviewTabIcon } from '../../../constants/dashboardIcon';

function ReviewTabLink({ to, icon: Icon, label, active }) {
    const iconNode = Icon({ color: active ? '#7152F3' : '#16151C' });

    return (
        <Link
            to={to}
            className={`relative flex items-center gap-2.5 border-b-[3px] pb-4 transition-colors duration-200 cursor-pointer ${active ? 'border-[#7152f3] text-[#7152f3]' : 'border-transparent text-[#16151c] hover:text-[#7152f3]'}`}
        >
            {iconNode}
            <span className="text-[16px] font-normal leading-6">
                {label}
            </span>
        </Link>
    );
}

export default function ReviewLayout() {
    const location = useLocation();
    const isRecentTabActive = location.pathname === '/review/recent';
    const isSubjectTabActive = location.pathname === '/review' || (location.pathname.startsWith('/review/') && !isRecentTabActive);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-5">
            <div className="border-b border-[#F3F4F6]">
                <div className="flex items-end gap-10">
                    <ReviewTabLink to="/review" icon={ReviewTabIcon} label="Danh sách môn học" active={isSubjectTabActive} />
                    <ReviewTabLink to="/review/recent" icon={RecentTabIcon} label="Đã ôn tập gần đây" active={isRecentTabActive} />
                </div>
            </div>

            <Outlet />
        </div>
    );
}
