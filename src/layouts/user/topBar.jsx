import React, { useEffect, useState } from 'react';
import NotificationIcon from '../../assets/icons/notification.svg';
import AvatarIcon from '../../assets/imgs/Avatars.svg';
import { USER_PROFILE } from '../../constants/userProfile';

function SearchIcon({ color }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 10.25C1.5 15.0825 5.41751 19 10.25 19C15.0825 19 19 15.0825 19 10.25C19 5.41751 15.0825 1.5 10.25 1.5C5.41751 1.5 1.5 5.41751 1.5 10.25ZM10.25 20.5C4.58908 20.5 0 15.9109 0 10.25C0 4.58908 4.58908 0 10.25 0C15.9109 0 20.5 4.58908 20.5 10.25C20.5 12.8105 19.5611 15.1517 18.0089 16.9482L21.2803 20.2197C21.5732 20.5126 21.5732 20.9874 21.2803 21.2803C20.9874 21.5732 20.5126 21.5732 20.2197 21.2803L16.9482 18.0089C15.1517 19.5611 12.8105 20.5 10.25 20.5Z" fill="#16151C" />
        </svg>
    );
}

function getGreetingPeriod(hour) {
    return hour < 12 ? 'sáng' : 'tối';
}

export default function TopBar() {
    const [greetingPeriod, setGreetingPeriod] = useState(() => getGreetingPeriod(new Date().getHours()));
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        const updateGreetingPeriod = () => {
            setGreetingPeriod(getGreetingPeriod(new Date().getHours()));
        };

        updateGreetingPeriod();
        const intervalId = window.setInterval(updateGreetingPeriod, 60_000);

        return () => window.clearInterval(intervalId);
    }, []);

    const hasSearchText = searchQuery.trim() !== '';
    const searchIconColor = hasSearchText ? '#212121' : isSearchFocused ? '#6A5AE0' : '#16151C';
    const searchInputClassName = hasSearchText ? 'text-[#212121] font-normal' : 'text-[#99A1AF] font-light';

    return (
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-3">
            <div className="min-w-0">
                <p className="text-[20px] font-semibold leading-[1.2] text-[#212121]">
                    Xin chào {USER_PROFILE.displayName} 👋🏻
                </p>
                <p className="mt-1 text-[13px] font-normal leading-5 text-[#99A1AF]">
                    Xin chào buổi {greetingPeriod}
                </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
                <label
                    className={`flex h-[46px] w-full min-w-0 items-center gap-3 rounded-[10px] border-[1.5px] px-4 transition-colors duration-200 sm:max-w-[261px] lg:w-[261px] ${isSearchFocused ? 'border-[#6A5AE0] bg-[rgba(106,90,224,0.08)]' : 'border-[rgba(162,161,168,0.1)] bg-white'}`}
                >
                    <SearchIcon color={searchIconColor} />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="search"
                        placeholder="Tìm kiếm"
                        aria-label="Tìm kiếm"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className={`h-full w-full min-w-0 bg-transparent text-[15px] leading-6 outline-none placeholder:text-[#99A1AF] ${searchInputClassName}`}
                    />
                </label>

                <button
                    type="button"
                    aria-label="Thông báo"
                    className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-[rgba(162,161,168,0.1)] hover:bg-[rgba(162,161,168,0.2)] cursor-pointer"
                >
                    <img src={NotificationIcon} alt="Thông báo" />
                </button>

                <button
                    type="button"
                    aria-label="Tài khoản"
                    className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0px_1px_3px_rgba(0,0,0,0.06)] cursor-pointer"
                >
                    <img src={AvatarIcon} alt="Tài khoản" className="h-full w-full object-cover" />
                </button>
            </div>
        </div>
    );
}
