import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    reviewSvg as ReviewTabIcon,
    bagSvg as RecentTabIcon,
} from '../../../constants/dashboardIcon';

function ReviewTabLink({ to, icon: Icon, label, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `relative flex items-center gap-2.5 border-b-[3px] pb-4 transition-colors duration-200 cursor-pointer ${isActive ? 'border-[#7152f3] text-[#7152f3]' : 'border-transparent text-[#16151c] hover:text-[#7152f3]'}`}
        >
            {({ isActive }) => (
                <>
                    <Icon color={isActive ? '#7152F3' : '#16151C'} />
                    <span className="text-[16px] font-normal leading-6">
                        {label}
                    </span>
                </>
            )}
        </NavLink>
    );
}

export default function ReviewLayout() {
    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-5">
            <div className="border-b border-[#F3F4F6]">
                <div className="flex items-end gap-10">
                    <ReviewTabLink to="/review" icon={ReviewTabIcon} label="Danh sách môn học" end />
                    <ReviewTabLink to="/review/recent" icon={RecentTabIcon} label="Đã ôn tập gần đây" />
                </div>
            </div>

            <Outlet />
        </div>
    );
}
