import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BackArrowIcon from '../../../../assets/icons/Arrow-Left.svg';
import ClockIcon from '../../../../assets/icons/Clock Circle.svg';
import RestartIcon from '../../../../assets/icons/Restart.svg';
import YesIcon from '../../../../assets/icons/yesIcon.svg';
import NoIcon from '../../../../assets/icons/xIcon.svg';
import Rectangle83Background from '../../../../assets/imgs/Rectangle83.png';
import {
    createReviewSubject,
    getReviewSubjectById,
} from '../../../../utils/reviewSubjects';

const FEEDBACK_DELAY_MS = 1500;

const FLASHCARDS = [
    {
        id: '1',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Theo Ăngghen, Vấn đề cơ bản lớn của mọi triết học là gì?',
        answer: 'Là vấn đề quan hệ giữa tư duy với tồn tại',
    },
    {
        id: '2',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học xuất hiện vào khoảng thời gian nào?',
        answer: 'Khoảng thế kỷ VIII - VI TCN',
    },
    {
        id: '3',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Trung tâm hình thành triết học cổ đại gồm những nền văn minh nào?',
        answer: 'Trung Quốc, Ấn Độ, Hy Lạp',
    },
    {
        id: '4',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Thuật ngữ “triết” trong Trung Quốc có nghĩa là gì?',
        answer: 'Trí tuệ, hiểu biết sâu sắc',
    },
    {
        id: '5',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Darśana trong triết học Ấn Độ có nghĩa là gì?',
        answer: 'Chiêm ngưỡng, suy ngẫm bằng lý trí',
    },
    {
        id: '6',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Philosophia trong triết học Hy Lạp có nghĩa là gì?',
        answer: 'Yêu mến sự thông thái',
    },
    {
        id: '7',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học thuộc hình thái nào của đời sống xã hội?',
        answer: 'Hình thái ý thức xã hội',
    },
    {
        id: '8',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học nghiên cứu thế giới như thế nào?',
        answer: 'Một chỉnh thể thống nhất',
    },
    {
        id: '9',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học tìm ra những quy luật nào?',
        answer: 'Những quy luật chung nhất chi phối tự nhiên, xã hội loài người, hoạt động và đời sống của con người',
    },
    {
        id: '10',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học hệ thống hóa tri thức bằng gì?',
        answer: 'Tư duy lý luận, logic và khoa học',
    },
    {
        id: '11',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học phản ánh khả năng nào của con người?',
        answer: 'Khả năng nhận thức và đánh giá thế giới',
    },
    {
        id: '12',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Bản chất của triết học là gì?',
        answer: 'Hoạt động tinh thần của con người',
    },
    {
        id: '13',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học nhằm tìm hiểu điều gì của sự vật, hiện tượng?',
        answer: 'Bản chất',
    },
    {
        id: '14',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học cổ đại phương Đông tiêu biểu ở đâu?',
        answer: 'Trung Quốc và Ấn Độ',
    },
    {
        id: '15',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học giúp con người hướng đến điều gì?',
        answer: 'Chân lý và lẽ phải',
    },
    {
        id: '16',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học phản ánh điều gì của con người?',
        answer: 'Khả năng nhận thức và đánh giá thế giới',
    },
    {
        id: '17',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học là hoạt động gì của con người?',
        answer: 'Hoạt động tinh thần',
    },
    {
        id: '18',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học tìm bản chất của cái gì?',
        answer: 'Sự vật, hiện tượng',
    },
    {
        id: '19',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học gắn với nhu cầu nào của con người?',
        answer: 'Tìm hiểu và định hướng thế giới',
    },
    {
        id: '20',
        badge: 'ĐỊNH NGHĨA',
        prompt: 'Triết học thể hiện khát vọng nào của con người?',
        answer: 'Tìm kiếm chân lý và tri thức',
    },
].map((card) => ({
    ...card,
    isDefinitionCorrect: card.isDefinitionCorrect ?? true,
}));

function joinClassNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function formatElapsedTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function getExpectedAnswerType(card) {
    return card.isDefinitionCorrect ? 'correct' : 'wrong';
}

function ScoreRing({ score }) {
    const size = 168;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const scorePercent = Math.max(0, Math.min(100, (score / 10) * 100));
    const dashOffset = circumference - (scorePercent / 100) * circumference;

    return (
        <div className="relative mx-auto flex h-[168px] w-[168px] items-center justify-center">
            <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
                aria-hidden="true"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#ffffff"
                    strokeWidth={strokeWidth}
                    opacity="0.92"
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#6152e6"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    fill="none"
                    className="transition-[stroke-dashoffset] duration-200"
                />
            </svg>

            <div className="flex h-[134px] w-[134px] flex-col items-center justify-center rounded-full text-[#1f1d2c] ]">
                <div className="flex items-end gap-1">
                    <span className="text-[40px] font-semibold leading-none">{score.toFixed(1)}</span>
                    <span className="pb-2 text-[16px] font-normal leading-none text-[#6A5AE0]">/10</span>
                </div>
                <span className="mt-1 text-[13px] font-normal text-[#8c87a7]">Điểm</span>
            </div>
        </div>
    );
}

function DecisionButton({ iconSrc, label, tone, active = false, muted = false, disabled = false, onClick }) {
    const toneStyles = {
        success: {
            circle: 'bg-[#dff5df]',
            label: 'text-[#4AAF57]',
            ring: 'ring-[#4AAF57]',
        },
        danger: {
            circle: 'bg-[#fde5e5]',
            label: 'text-[#f75555]',
            ring: 'ring-[#f75555]',
        },
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={joinClassNames(
                'flex flex-col items-center gap-2 transition-opacity',
                muted ? 'opacity-55' : 'opacity-100',
                disabled ? 'cursor-default' : 'cursor-pointer',
            )}
        >
            <span className={joinClassNames(
                'flex h-[54px] w-[54px] items-center justify-center rounded-full transition-all',
                toneStyles[tone].circle,
                active && `ring-2 ${toneStyles[tone].ring}`,
            )}>
                <img src={iconSrc} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
            </span>

            <span className={joinClassNames('text-[16px] font-semibold leading-none', toneStyles[tone].label)}>
                {label}
            </span>
        </button>
    );
}

export default function FlashcardReview() {
    const { subjectId, exerciseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const startedAtRef = useRef(Date.now());
    const feedbackTimerRef = useRef(null);

    const { subject, exercise } = useMemo(() => {
        const stateSubject = location.state?.subject;
        const stateExercise = location.state?.exercise;

        const resolvedSubject = stateSubject ?? getReviewSubjectById(subjectId) ?? createReviewSubject({
            id: subjectId || '0',
            name: subjectId ? String(subjectId) : 'Môn học',
            documents: '0 tài liệu đã tải',
        });

        const resolvedExercise = stateExercise
            ?? resolvedSubject.exercises.find((item) => item.id === String(exerciseId))
            ?? resolvedSubject.exercises[0];

        return {
            subject: resolvedSubject,
            exercise: resolvedExercise,
        };
    }, [exerciseId, location.state?.exercise, location.state?.subject, subjectId]);

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [phase, setPhase] = useState('practice');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [cardResponses, setCardResponses] = useState(() => Array(FLASHCARDS.length).fill(null));
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [frozenElapsedSeconds, setFrozenElapsedSeconds] = useState(null);

    const activeCard = FLASHCARDS[currentCardIndex];
    const answeredCount = cardResponses.filter(Boolean).length;
    const progressPercent = FLASHCARDS.length > 0 ? Math.round((answeredCount / FLASHCARDS.length) * 100) : 0;
    const correctCount = cardResponses.filter((entry) => entry === 'correct').length;
    const wrongCount = cardResponses.filter((entry) => entry === 'wrong').length;
    const score = FLASHCARDS.length > 0 ? (correctCount / FLASHCARDS.length) * 10 : 0;

    useEffect(() => {
        if (phase === 'result') {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [phase]);

    useEffect(() => () => {
        if (feedbackTimerRef.current) {
            window.clearTimeout(feedbackTimerRef.current);
        }
    }, []);

    function goToNextCard() {
        setSelectedAnswer(null);

        if (currentCardIndex >= FLASHCARDS.length - 1) {
            setFrozenElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
            setPhase('result');
            return;
        }

        setCurrentCardIndex((currentIndex) => Math.min(FLASHCARDS.length - 1, currentIndex + 1));
        setPhase('practice');
    }

    function handleRateCard(answerType) {
        if (phase !== 'practice' || selectedAnswer) {
            return;
        }

        const expectedAnswerType = getExpectedAnswerType(activeCard);
        const isUserCorrect = answerType === expectedAnswerType;

        setSelectedAnswer(answerType);
        setCardResponses((currentResponses) => {
            const nextResponses = [...currentResponses];
            nextResponses[currentCardIndex] = isUserCorrect ? 'correct' : 'wrong';
            return nextResponses;
        });
        setPhase('feedback');

        if (feedbackTimerRef.current) {
            window.clearTimeout(feedbackTimerRef.current);
        }

        feedbackTimerRef.current = window.setTimeout(() => {
            goToNextCard();
        }, FEEDBACK_DELAY_MS);
    }

    function handleRestart() {
        if (feedbackTimerRef.current) {
            window.clearTimeout(feedbackTimerRef.current);
        }

        startedAtRef.current = Date.now();
        setCurrentCardIndex(0);
        setPhase('practice');
        setSelectedAnswer(null);
        setCardResponses(Array(FLASHCARDS.length).fill(null));
        setElapsedSeconds(0);
        setFrozenElapsedSeconds(null);
    }

    const displayElapsedSeconds = phase === 'result'
        ? frozenElapsedSeconds ?? elapsedSeconds
        : elapsedSeconds;

    const isUserCorrect = selectedAnswer === getExpectedAnswerType(activeCard);
    const isDefinitionCorrect = activeCard.isDefinitionCorrect ?? true;

    return (
        <div className="flex min-h-0 flex-1 flex-col pb-2">
            <div className="mt-4 flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate(`/review/${subject.id}/choose-method/${exercise.id}`, {
                        state: {
                            subject,
                            exercise,
                        },
                    })}
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-[#212121] transition-opacity hover:opacity-75 cursor-pointer"
                    aria-label="Quay lại màn chọn phương pháp"
                >
                    <img src={BackArrowIcon} alt="" aria-hidden="true" className="h-7 w-7" />
                </button>

                <div className="flex min-w-0 items-center gap-3 text-[18px] font-semibold leading-[1.2] text-[#212121]">
                    <span className="truncate">{subject.name}</span>
                    <span className="shrink-0 text-[#6A5AE0]">•</span>
                    <span className="truncate font-semibold">{exercise.title}</span>
                </div>
            </div>

            {phase !== 'result' ? (
                <div className="flex min-h-0 flex-1 flex-col pb-2">
                    <div className="mt-5 flex items-center justify-between gap-4">
                        <h1 className="text-[20px] font-semibold leading-[1.2] text-[#6A5AE0]">
                            Ôn tập flashcard
                        </h1>

                        <div className="inline-flex h-[29px] shrink-0 items-center gap-1.5 bg-white px-2 py-px">
                            <img src={ClockIcon} alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
                            <p className="text-[15px] font-normal leading-normal text-[#858494]">
                                {formatElapsedTime(displayElapsedSeconds)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                        <div className="flex-1 overflow-hidden rounded-full bg-[#ebeaf9]">
                            <div
                                className="h-2.5 rounded-full bg-[linear-gradient(90deg,rgb(122,106,245)_0%,rgb(97,82,230)_100%)] transition-[width] duration-200"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <p className="w-12 shrink-0 text-center text-[15px] font-normal leading-normal text-[#9E9E9E]">
                            {progressPercent}%
                        </p>
                    </div>

                    <div className="mt-6 rounded-[30px] border-2 border-dashed border-[#7b6df4] bg-[#ecebff] px-8 py-10 shadow-[0_18px_55px_rgba(106,90,224,0.06)]">
                        <div className="relative min-h-[206px] rounded-3xl">
                            <span className="absolute left-0 top-0 inline-flex rounded-full bg-white px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.4px] text-[#51545f] shadow-[0_1px_2px_rgba(17,24,39,0.08)]">
                                {activeCard.badge}
                            </span>

                            <div className="flex min-h-[206px] flex-col items-center justify-center px-5 text-center">
                                <p className="max-w-[520px] text-[18px] font-medium leading-7 text-[#1d1830] whitespace-pre-line">
                                    {activeCard.prompt}
                                </p>

                                <p className="mt-2 max-w-[520px] text-[18px] font-semibold leading-7 text-[#6A5AE0] whitespace-pre-line">
                                    {activeCard.answer}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-end">
                        <p className="text-[15px] font-semibold leading-6 text-[#f75555]">
                            {currentCardIndex + 1}/{FLASHCARDS.length}
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-10">
                        <DecisionButton
                            iconSrc={YesIcon}
                            label="Đúng"
                            active={selectedAnswer === 'correct'}
                            muted={phase === 'feedback' && selectedAnswer !== 'correct'}
                            disabled={phase !== 'practice'}
                            tone="success"
                            onClick={() => handleRateCard('correct')}
                        />

                        <div className="pt-2 text-[34px] font-semibold tracking-[6px] text-[#d6dbe6]">
                            •••
                        </div>

                        <DecisionButton
                            iconSrc={NoIcon}
                            label="Sai"
                            active={selectedAnswer === 'wrong'}
                            muted={phase === 'feedback' && selectedAnswer !== 'wrong'}
                            disabled={phase !== 'practice'}
                            tone="danger"
                            onClick={() => handleRateCard('wrong')}
                        />
                    </div>

                    {phase === 'feedback' ? (
                        <div className={joinClassNames(
                            'mt-6 mx-auto w-full max-w-[520px] rounded-[30px] px-6 py-7 text-center',
                            isUserCorrect ? 'bg-[#dff5df]' : 'bg-[#fce2e2]',
                        )}>
                            <p className={joinClassNames(
                                'text-[18px] font-semibold leading-7',
                                isUserCorrect ? 'text-[#4AAF57]' : 'text-[#f75555]',
                            )}>
                                Bạn đã trả lời {isUserCorrect ? 'đúng' : 'sai'}
                            </p>
                            <p className={joinClassNames(
                                'mt-1 text-[16px] leading-7 text-[#96a0a8]',
                            )}>
                                Định nghĩa này là <span className={joinClassNames('font-semibold', isDefinitionCorrect ? 'text-[#4AAF57]' : 'text-[#f75555]')}>
                                    {isDefinitionCorrect ? 'ĐÚNG' : 'SAI'}
                                </span>
                            </p>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="mt-5 flex flex-1 flex-col items-center justify-center pb-8">
                    <div className="w-full self-start pl-6 pb-4">
                        <p className='text-[20px] font-semibold leading-[1.2] text-[#6A5AE0]'>Ôn tập flashcard</p>
                    </div>
                    <div
                        className="relative mt-25 w-full max-w-[360px] overflow-hidden rounded-[26px] bg-[#ebe7ff] px-6 py-6 shadow-[0_18px_50px_rgba(106,90,224,0.10)]"
                        style={{ backgroundImage: `url(${Rectangle83Background})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'top left', backgroundSize: 'auto 100%' }}
                    >
                        <div className="absolute right-6 top-6 inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-white px-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
                            <img src={ClockIcon} alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
                            <span className="text-[15px] font-normal leading-none text-[#1f1d2c]">
                                {formatElapsedTime(displayElapsedSeconds)}
                            </span>
                        </div>

                        <div className="pt-14 text-center">
                            <p className="text-[19px] font-semibold leading-7 text-[#1d1830]">
                                Bạn đã trả lời đúng
                            </p>
                            <p className="mt-1 text-[20px] font-semibold leading-7 text-[#6A5AE0]">
                                {correctCount}/{FLASHCARDS.length} câu
                            </p>
                        </div>

                        <div className="mt-8">
                            <ScoreRing score={score} />
                        </div>
                    </div>

                    <div className="mt-auto w-full flex items-center justify-end pt-8">
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="inline-flex h-14 items-center gap-2 rounded-full bg-[#7152f3] px-6 text-[16px] font-normal leading-6 text-white shadow-[0_16px_30px_rgba(113,82,243,0.35)] hover:bg-[#5a41c2] transform-color cursor-pointer"
                        >
                            <span>Làm lại</span>
                            <img src={RestartIcon} alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
                        </button>
                    </div>

                    <div className="sr-only">
                        Đã trả lời đúng {correctCount} trên {FLASHCARDS.length} câu. Đã trả lời sai {wrongCount} câu.
                    </div>
                </div>
            )}
        </div>
    );
}
