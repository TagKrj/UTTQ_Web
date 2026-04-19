import React from 'react';
import SideBar from './sideBar';
import TopBar from './topBar';

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen w-full gap-5 bg-white p-5">
            <SideBar />

            <div className="flex min-w-0 flex-1 flex-col px-2">
                <div className="flex h-full w-full flex-col gap-5 rounded-lg">
                    <TopBar />
                    <div className="min-h-0 flex-1 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
