import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo2 from '../../../assets/icons/logo2.svg';
import RegisterIcon from '../../../assets/icons/registerIcon.svg';
import ProfileIcon from '../../../assets/icons/Profile.svg';

const NAV_ITEMS = [
    { label: 'Giải pháp', targetId: 'solution-section' },
    { label: 'Tính năng', targetId: 'features-section' },
    { label: 'Số liệu', targetId: 'stats-section' },
    { label: 'Về chúng tôi', targetId: 'about-section' },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.targetId);

function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);

    targetElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
}

export default function Header() {
    const headerRef = useRef(null);
    const [activeSection, setActiveSection] = useState('solution-section');

    useEffect(() => {
        const updateActiveSection = () => {
            const headerHeight = headerRef.current?.offsetHeight ?? 0;
            const scrollPosition = window.scrollY + headerHeight + 16;

            let currentSection = 'solution-section';

            SECTION_IDS.forEach((sectionId) => {
                const sectionElement = document.getElementById(sectionId);

                if (!sectionElement) {
                    return;
                }

                if (sectionElement.offsetTop <= scrollPosition) {
                    currentSection = sectionId;
                }
            });

            setActiveSection(currentSection);
        };

        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection, { passive: true });
        window.addEventListener('resize', updateActiveSection);

        return () => {
            window.removeEventListener('scroll', updateActiveSection);
            window.removeEventListener('resize', updateActiveSection);
        };
    }, []);

    return (
        <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 w-full bg-white px-6 py-2 shadow-[0_1px_0_rgba(0,0,0,0.06)] lg:px-[100px] lg:py-2.5">
            <div className="mx-auto flex w-full max-w-[1920px] items-center gap-8 py-2">
                <Link to="/landing" className="flex shrink-0 items-center gap-3">
                    <img src={Logo2} alt="UTTQ" className="h-[50px] w-auto" />
                    <span
                        className="text-[32px] font-semibold leading-[1.2] text-[#212121]"
                        style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
                    >
                        UTTQ
                    </span>
                </Link>

                <nav className="hidden flex-1 items-center justify-center gap-12 text-[20px] font-normal tracking-[0.2px] md:flex">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => scrollToSection(item.targetId)}
                            className={`cursor-pointer transition-colors hover:text-[#212121] ${activeSection === item.targetId ? 'text-[#212121]' : 'text-[#616161]'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="hidden shrink-0 items-center gap-3 md:flex">
                    <Link
                        to="/onboard"
                        className="flex h-[50px] w-[138px] items-center justify-center gap-2.5 rounded-full bg-[#EDEFFF] px-4 text-[16px] font-semibold text-[#6949FF] hover:bg-[#e8ebfe] transition-colors"
                    >
                        <img src={RegisterIcon} alt="" className="h-5 w-5 shrink-0" />
                        <span>Đăng ký</span>
                    </Link>

                    <Link
                        to="/login"
                        className="flex h-[50px] w-[155px] items-center justify-center gap-2.5 rounded-full bg-[#6949FF] px-4 text-[16px] font-normal text-white shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)] transition-transform hover:scale-[1.02]"
                    >
                        <img src={ProfileIcon} alt="" className="h-5 w-5 shrink-0" />
                        <span>Đăng nhập</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
