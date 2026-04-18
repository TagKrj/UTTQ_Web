import React from 'react';
import SideBar from './sideBar';

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen w-full gap-5 bg-white p-5">
            <SideBar />

            <div className="flex-1 min-w-0">
                <div className="h-full w-full bg-yellow-300">
                    <div className="h-full w-full rounded-lg p-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
