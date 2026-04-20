import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BackArrowIcon from '../../../../assets/icons/Arrow-Left.svg';
import ClockIcon from '../../../../assets/icons/Clock Circle.svg';
import { SUMMARY_REVIEW_SECTIONS } from '../../../../constants/summaryReviewContent';
import {
    createReviewSubject,
    getReviewSubjectById,
} from '../../../../utils/reviewSubjects';

function formatElapsedTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function SummaryReview() {
    const { subjectId, exerciseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

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

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);

        return () => window.clearInterval(timerId);
    }, []);

    useEffect(() => {
        const contentElement = contentRef.current;

        if (!contentElement) {
            return undefined;
        }

        const updateScrollProgress = () => {
            const maxScroll = contentElement.scrollHeight - contentElement.clientHeight;

            if (maxScroll <= 0) {
                setScrollProgress(100);
                return;
            }

            const nextProgress = Math.round((contentElement.scrollTop / maxScroll) * 100);
            setScrollProgress(Math.min(100, Math.max(0, nextProgress)));
        };

        updateScrollProgress();
        contentElement.addEventListener('scroll', updateScrollProgress, { passive: true });
        window.addEventListener('resize', updateScrollProgress);

        return () => {
            contentElement.removeEventListener('scroll', updateScrollProgress);
            window.removeEventListener('resize', updateScrollProgress);
        };
    }, []);

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

            <div className="mt-5 flex items-center justify-between gap-4">
                <h1 className="text-[20px] font-semibold leading-[1.2] text-[#6A5AE0]">
                    Ôn tập tóm tắt
                </h1>

                <div className="inline-flex h-[29px] shrink-0 items-center gap-1.5 rounded-[10px] bg-white px-2 py-px shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
                    <img src={ClockIcon} alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <p className="text-[15px] font-normal leading-normal text-[#858494]">
                        {formatElapsedTime(elapsedSeconds)}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-[#EDEFFF] shadow-[0_18px_50px_rgba(106,90,224,0.08)]">
                <div className="flex items-center justify-between gap-4 px-6 pt-5">
                    <div className="flex-1 overflow-hidden rounded-full bg-white">
                        <div
                            className="h-2.5 rounded-full bg-[linear-gradient(-8.33969deg,rgb(106,90,224)_0%,rgb(132,118,234)_100%)] transition-[width] duration-200"
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>

                    <p className="w-12 shrink-0 text-center text-[15px] font-normal leading-normal text-[#F75555]">
                        {scrollProgress}%
                    </p>
                </div>

                <div
                    ref={contentRef}
                    className="thin-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto px-6 pb-6 pr-8"
                >
                    <div className="rounded-2xl px-4 py-4 text-[14px] leading-7 text-[#16151c] shadow-[0_1px_2px_rgba(17,24,39,0.02)]">
                        <p className="whitespace-pre-line">{SUMMARY_REVIEW_SECTIONS}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
