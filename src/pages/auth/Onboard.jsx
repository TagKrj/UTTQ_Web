import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '../../assets/icons/Arrow-Left.svg';
import { ONBOARD_STEPS } from '../../constants/accountOptions';

export default function Onboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(location.state?.step === 'workspace' ? 'workspace' : 'account');
    const [selectedByStep, setSelectedByStep] = useState(
        location.state?.selectedByStep ?? {
            account: null,
            workspace: null,
        }
    );

    const currentStep = ONBOARD_STEPS[activeStep];
    const selectedType = selectedByStep[activeStep];

    const handleBack = () => {
        if (activeStep === 'workspace') {
            setActiveStep('account');
            return;
        }

        navigate('/login');
    };

    const handleSkip = () => {
        if (activeStep === 'account') {
            setActiveStep('workspace');
            return;
        }

        navigate('/register', { state: { selectedByStep } });
    };

    const handleSelect = (optionId) => {
        setSelectedByStep((currentSelected) => ({
            ...currentSelected,
            [activeStep]: currentSelected[activeStep] === optionId ? null : optionId,
        }));
    };

    return (
        <div className="w-full max-w-[549px] flex flex-col gap-5">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleBack}
                    className="shrink-0 rounded-full p-1 cursor-pointer"
                    aria-label="Quay lại"
                >
                    <img src={ArrowLeftIcon} alt="Back" className="w-7 h-7" />
                </button>
                <div className="h-2.5 flex-1 rounded-full bg-[#EEE] overflow-hidden">
                    <div className={`h-full bg-[#6A5AE0] rounded-full ${currentStep.progressWidth}`} />
                </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center text-center">
                <h2 className="max-w-[480px] text-[35px] font-semibold leading-[1.12] text-[#212121]">
                    {currentStep.title}
                </h2>
                <p className="mt-3 text-base font-light text-[#212121]">{currentStep.subtitle}</p>
            </div>

            <div className="flex flex-col gap-7 mt-1">
                {currentStep.options.map((option) => {
                    const isSelected = selectedType === option.id;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelect(option.id)}
                            className={`h-[100px] rounded-[20px] px-5 flex items-center gap-4 text-left cursor-pointer transition-all ${isSelected
                                ? 'border-3 border-[#6A5AE0] bg-white'
                                : 'border border-[#EEE] bg-white hover:border-[#d7d7d7]'
                                }`}
                        >
                            <span className="p-6 rounded-full bg-[#EDEFFF] flex items-center justify-center shrink-0">
                                <img src={option.icon} alt="" className="w-8 h-8" />
                            </span>
                            <span className="text-[20px] leading-[1.2] text-[#212121] font-medium">{option.label}</span>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={handleSkip}
                className="mt-8 h-14 rounded-full text-white text-[16px] font-normal cursor-pointer bg-[#6A5AE0] hover:bg-[#5a4ad0] transition-colors shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)]"
            >
                Bỏ qua
            </button>
        </div>
    );
}
