import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '../../assets/icons/Arrow-Left.svg';
import { ChevronDownSvg, EmailSvg, ExcludeSvg as LockSvg, EyeSvg, HideSvg, UserRoundedSvg, VietnamFlagSvg } from '../../constants/loginIcons';

function RegisterField({
    fieldKey,
    inputRef,
    focusedField,
    setFocusedField,
    value,
    onChange,
    placeholder,
    type = 'text',
    autoComplete,
    inputMode,
    maxLength,
    renderLeftSlot,
    renderRightSlot,
    heightClass = 'h-[60px]',
}) {
    const isFocused = focusedField === fieldKey;
    const hasText = value.trim() !== '';
    const activeClass = isFocused ? 'border-[#6A5AE0] bg-[rgba(106,90,224,0.08)]' : 'border-transparent bg-gray-50';
    const textClass = hasText ? 'text-[#212121] font-normal' : 'text-gray-400 font-light';
    const iconColor = hasText ? '#212121' : isFocused ? '#6A5AE0' : '#9E9E9E';

    return (
        <div
            onClick={(event) => {
                if (event.target.closest('button')) return;
                inputRef.current?.focus();
            }}
            className={`flex gap-3 ${heightClass} items-center px-5 rounded-xl border-[1.5px] transition-colors cursor-text ${activeClass}`}
        >
            <span className="shrink-0">{renderLeftSlot?.(iconColor)}</span>
            <input
                ref={inputRef}
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                inputMode={inputMode}
                maxLength={maxLength}
                placeholder={placeholder}
                onFocus={() => setFocusedField(fieldKey)}
                onBlur={() => setFocusedField('')}
                className={`min-w-0 flex-1 bg-transparent outline-none text-[14px] tracking-[0.2px] placeholder:text-gray-400 ${textClass}`}
            />
            {renderRightSlot ? <span className="shrink-0">{renderRightSlot(iconColor)}</span> : null}
        </div>
    );
}

export default function Register() {
    const location = useLocation();
    const navigate = useNavigate();
    const onboardSelections = location.state?.selectedByStep ?? null;
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        email: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');

    const isUsernameFocused = focusedField === 'username';
    const isPasswordFocused = focusedField === 'password';
    const isConfirmPasswordFocused = focusedField === 'confirmPassword';
    const isPhoneFocused = focusedField === 'phone';
    const isEmailFocused = focusedField === 'email';

    const hasUsernameText = formData.username.trim() !== '';
    const hasPasswordText = formData.password.trim() !== '';
    const hasConfirmPasswordText = formData.confirmPassword.trim() !== '';
    const hasPhoneText = formData.phone.trim() !== '';
    const hasEmailText = formData.email.trim() !== '';

    const usernameIconColor = hasUsernameText ? '#212121' : isUsernameFocused ? '#6A5AE0' : '#9E9E9E';
    const passwordIconColor = hasPasswordText ? '#212121' : isPasswordFocused ? '#6A5AE0' : '#9E9E9E';
    const confirmPasswordIconColor = hasConfirmPasswordText ? '#212121' : isConfirmPasswordFocused ? '#6A5AE0' : '#9E9E9E';
    const phoneIconColor = hasPhoneText ? '#212121' : isPhoneFocused ? '#6A5AE0' : '#9E9E9E';
    const emailIconColor = hasEmailText ? '#212121' : isEmailFocused ? '#6A5AE0' : '#9E9E9E';

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Register with:', formData);
        window.alert('Đăng ký thành công');
        // navigate('/login');
    };

    const updateField = (field, transform = (value) => value) => (event) => {
        setFormData((currentForm) => ({
            ...currentForm,
            [field]: transform(event.target.value),
        }));
    };

    return (
        <div className="w-full max-w-[549px] flex flex-col gap-[99px]">
            <div className="-mt-8 flex items-center gap-4 lg:-mt-30">
                <button
                    type="button"
                    onClick={() => navigate('/onboard', { state: { step: 'workspace', selectedByStep: onboardSelections } })}
                    className="shrink-0 rounded-full p-1 cursor-pointer"
                    aria-label="Quay lại"
                >
                    <img src={ArrowLeftIcon} alt="Back" className="w-7 h-7" />
                </button>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#EEE]">
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: '76.15%',
                            backgroundImage: 'linear-gradient(-5.66002deg, rgb(106, 90, 224) 0%, rgb(132, 118, 234) 100%)',
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-[46px] mt-10">
                <div className="flex h-[53px] items-center justify-center">
                    <h1 className="text-[48px] font-semibold leading-[1.1] text-[#212121]">Đăng ký</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                    <div className="flex flex-col gap-2.5">
                        <RegisterField
                            fieldKey="username"
                            inputRef={usernameInputRef}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            value={formData.username}
                            onChange={updateField('username')}
                            placeholder="Tên đăng nhập"
                            autoComplete="username"
                            renderLeftSlot={() => <UserRoundedSvg color={usernameIconColor} />}
                        />

                        <RegisterField
                            fieldKey="password"
                            inputRef={passwordInputRef}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            value={formData.password}
                            onChange={updateField('password')}
                            placeholder="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            renderLeftSlot={() => <LockSvg color={passwordIconColor} />}
                            renderRightSlot={(color) => (
                                <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => setShowPassword((current) => !current)}
                                    className="cursor-pointer transition-colors hover:text-[#212121]"
                                >
                                    {showPassword ? <EyeSvg color={color} /> : <HideSvg color={color} />}
                                </button>
                            )}
                        />

                        <RegisterField
                            fieldKey="confirmPassword"
                            inputRef={confirmPasswordInputRef}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            value={formData.confirmPassword}
                            onChange={updateField('confirmPassword')}
                            placeholder="Xác nhận mật khẩu"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            renderLeftSlot={() => <LockSvg color={confirmPasswordIconColor} />}
                            renderRightSlot={(color) => (
                                <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => setShowConfirmPassword((current) => !current)}
                                    className="cursor-pointer transition-colors hover:text-[#212121]"
                                >
                                    {showConfirmPassword ? <EyeSvg color={color} /> : <HideSvg color={color} />}
                                </button>
                            )}
                        />

                        <RegisterField
                            fieldKey="phone"
                            inputRef={phoneInputRef}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            value={formData.phone}
                            onChange={updateField('phone', (value) => value.replace(/\D/g, '').slice(0, 10))}
                            heightClass="h-[56px]"
                            placeholder="Số điện thoại"
                            type="tel"
                            autoComplete="tel"
                            inputMode="numeric"
                            maxLength={10}
                            renderLeftSlot={() => (
                                <div className="flex items-center gap-2 shrink-0">
                                    <VietnamFlagSvg />
                                    <ChevronDownSvg color={phoneIconColor} />
                                </div>
                            )}
                        />

                        <RegisterField
                            fieldKey="email"
                            inputRef={emailInputRef}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            value={formData.email}
                            onChange={updateField('email')}
                            placeholder="Email"
                            type="email"
                            autoComplete="email"
                            renderLeftSlot={() => <EmailSvg color={emailIconColor} />}
                        />
                    </div>

                    <button
                        type="submit"
                        className="h-[58px] rounded-[100px] bg-[#6A5AE0] px-4 text-[16px] font-normal text-white shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)] transition-colors hover:bg-[#5a4ad0] cursor-pointer"
                    >
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
}
