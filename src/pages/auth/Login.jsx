import React, { useRef, useState } from 'react';
import FacebookIcon from '../../assets/icons/Facebook.svg';
import GoogleIcon from '../../assets/icons/Google.svg';
import AppleIcon from '../../assets/icons/Apple.svg';

function UserRoundedSvg({ color }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6 shrink-0">
            <circle cx="12" cy="6" r="4" fill={color} />
            <ellipse cx="12" cy="17" rx="7" ry="4" fill={color} />
        </svg>
    );
}

function ExcludeSvg({ color }) {
    return (
        <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5 shrink-0">
            <path d="M7.07031 0C9.62759 0 11.6855 2.01272 11.6855 4.49707V5.77441C13.1207 6.22238 14.1668 7.52154 14.167 9.07324V13.1875C14.167 15.1087 12.574 16.6669 10.6104 16.667H3.55762C1.59308 16.667 0 15.1087 0 13.1875V9.07324C0.000191835 7.52154 1.04713 6.22238 2.48145 5.77441V4.49707C2.48991 2.01283 4.54705 0.00017002 7.07031 0ZM7.0791 9.4873C6.67276 9.4873 6.34296 9.80969 6.34277 10.207V12.0459C6.34284 12.4516 6.67269 12.7744 7.0791 12.7744C7.49398 12.7744 7.82415 12.4516 7.82422 12.0459V10.207C7.82404 9.80969 7.49391 9.48731 7.0791 9.4873ZM7.08789 1.44922C5.36892 1.44922 3.97136 2.80767 3.96289 4.48047V5.59473H10.2041V4.49707C10.2041 2.8161 8.80671 1.44939 7.08789 1.44922Z" fill={color} />
        </svg>
    );
}

function HideSvg({ color }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5 shrink-0">
            <path d="M3 10s2.8-4.5 7-4.5S17 10 17 10s-2.8 4.5-7 4.5S3 10 3 10Z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 4l12 12" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function EyeSvg({ color }) {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5 shrink-0">
            <path d="M3 10s2.8-4.5 7-4.5S17 10 17 10s-2.8 4.5-7 4.5S3 10 3 10Z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="10" r="2" stroke={color} strokeWidth="1.6" />
        </svg>
    );
}

export default function Login() {
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login with:', email, password, rememberMe);
    };

    const isEmailFocused = focusedField === 'email';
    const isPasswordFocused = focusedField === 'password';
    const hasEmailText = email.trim() !== '';
    const hasPasswordText = password.trim() !== '';
    const emailActive = isEmailFocused ? 'border-[#6A5AE0] bg-[rgba(106,90,224,0.08)]' : 'border-transparent bg-gray-50';
    const passwordActive = isPasswordFocused ? 'border-[#6A5AE0] bg-[rgba(106,90,224,0.08)]' : 'border-transparent bg-gray-50';
    const emailText = hasEmailText ? 'text-[#212121] font-normal' : 'text-gray-400 font-light';
    const passwordText = hasPasswordText ? 'text-[#212121] font-normal' : 'text-gray-400 font-light';
    const emailIconColor = hasEmailText ? '#212121' : isEmailFocused ? '#6A5AE0' : '#9E9E9E';
    const passwordIconColor = hasPasswordText ? '#212121' : isPasswordFocused ? '#6A5AE0' : '#9E9E9E';

    return (
        <div className="w-full max-w-[435px] flex flex-col gap-10">
            <div className="flex justify-center">
                <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 text-center">Đăng nhập</h1>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-7">
                <div
                    onClick={() => emailInputRef.current?.focus()}
                    className={`flex gap-3 h-15 items-center px-5 rounded-xl border-[1.5px] transition-colors cursor-text ${emailActive}`}
                >
                    <UserRoundedSvg color={emailIconColor} />
                    <input
                        ref={emailInputRef}
                        type="email"
                        placeholder="Tên đăng nhập"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className={`flex-1 bg-transparent outline-none text-sm tracking-wider placeholder:text-gray-400 ${emailText}`}
                        required
                    />
                </div>

                <div
                    onClick={(e) => {
                        if (e.target.closest('button')) return;
                        passwordInputRef.current?.focus();
                    }}
                    className={`flex gap-3 h-15 items-center px-5 rounded-xl border-[1.5px] transition-colors cursor-text ${passwordActive}`}
                >
                    <ExcludeSvg color={passwordIconColor} />
                    <input
                        ref={passwordInputRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        className={`flex-1 bg-transparent outline-none text-sm tracking-wider placeholder:text-gray-400 ${passwordText}`}
                        required
                    />
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        {showPassword ? <EyeSvg color={passwordIconColor} /> : <HideSvg color={passwordIconColor} />}
                    </button>
                </div>

                <div className="flex items-center justify-center">
                    <label htmlFor="remember" className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="peer sr-only"
                        />
                        <span className="relative grid h-6 w-6 place-items-center rounded-lg border-3 border-[#6A5AE0] bg-white transition-all duration-200 peer-checked:bg-[#6A5AE0] peer-checked:border-[#6A5AE0] peer-focus-visible:ring-2 peer-focus-visible:ring-[#6A5AE0]/30">
                            <svg
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                                className={`h-[18px] w-[18px] text-white transition-opacity duration-200 ${rememberMe ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <path d="M3.5 8.3L6.9 11.7L12.8 5.8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="text-sm font-normal text-gray-900">Ghi nhớ mật khẩu</span>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#6A5AE0] text-white font-medium py-4 px-4 rounded-full hover:bg-[#5a4ad0] transition-colors shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)] cursor-pointer"
                >
                    Đăng nhập
                </button>

                <div className="text-center">
                    <a href="#" className="text-[#6A5AE0] font-normal text-base hover:underline">
                        Quên mật khẩu?
                    </a>
                </div>
            </form>

            <div className="flex items-center gap-4 mt-7">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-[#616161] font-normal text-lg px-2">Hoặc đăng nhập với</span>
                <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="flex gap-5 justify-center">
                <button className="bg-white border border-gray-200 px-8 py-4 rounded-2xl hover:scale-103 transition-transform flex items-center justify-center cursor-pointer">
                    <img src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
                </button>

                <button className="bg-white border border-gray-200 px-8 py-4 rounded-2xl hover:scale-103 transition-transform flex items-center justify-center cursor-pointer">
                    <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
                </button>

                <button className="bg-white border border-gray-200 px-8 py-4 rounded-2xl hover:scale-103 transition-transform flex items-center justify-center cursor-pointer">
                    <img src={AppleIcon} alt="Apple" className="w-6 h-6" />
                </button>
            </div>

            <div className="text-center text-sm">
                <span className="text-[#9E9E9E] font-light">Đăng ký tài khoản mới? </span>
                <a href="#" className="text-[#6A5AE0] font-normal hover:underline">
                    Đăng ký
                </a>
            </div>
        </div>
    );
}
