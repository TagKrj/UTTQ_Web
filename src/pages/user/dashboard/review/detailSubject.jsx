import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AddExercise from '../../../../components/popup/addExercise';
import {
    createReviewSubject,
    getReviewSubjectById,
} from '../../../../utils/reviewSubjects';
import BackArrowIcon from '../../../../assets/icons/Arrow-Left.svg';
import AddCircleIcon from '../../../../assets/icons/Add-Circle.svg';
import StarWhiteIcon from '../../../../assets/icons/StarWhite.svg';
import CalendarCheckIcon from '../../../../assets/icons/calendar-check.svg';
import FileIcon from '../../../../assets/icons/File.svg';
import ClockIcon from '../../../../assets/icons/Clock Circle.svg';

function MetricItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-2.5">
            <img src={icon} alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
            <p className="text-[16px] font-light leading-6 text-white">
                <span className="font-light">{label}</span>
                <span className="font-normal">{value}</span>
            </p>
        </div>
    );
}

function getExerciseTone(progress) {
    if (progress === 100) {
        return {
            titleColor: '#049c6b',
            percentColor: '#049c6b',
            cardClass: 'bg-[rgba(74,222,128,0.2)] border-[rgba(74,222,128,0.2)]',
            fillStyle: 'linear-gradient(-2.018556889661326deg, rgb(4, 156, 107) 0%, rgb(0, 195, 143) 100%)',
        };
    }

    if (progress === 0) {
        return {
            titleColor: '#0c092a',
            percentColor: '#9e9e9e',
            cardClass: 'bg-white border-[#efeefc]',
            fillStyle: null,
        };
    }

    if (progress < 50) {
        return {
            titleColor: '#0c092a',
            percentColor: '#f75555',
            cardClass: 'bg-white border-[rgba(247,85,85,0.2)]',
            fillStyle: 'linear-gradient(-6.586743434767868deg, rgb(247, 85, 85) 0%, rgb(255, 136, 136) 100%)',
        };
    }

    return {
        titleColor: '#0c092a',
        percentColor: '#ff981f',
        cardClass: 'bg-white border-[rgba(250,204,21,0.2)]',
        fillStyle: 'linear-gradient(-4.057076549495022deg, rgb(255, 152, 31) 0%, rgb(255, 177, 85) 100%)',
    };
}

function ExerciseCard({ exercise }) {
    const tone = getExerciseTone(exercise.progress);

    return (
        <div className={`flex h-[76px] min-h-[76px] flex-none shrink-0 items-center overflow-hidden rounded-[20px] border-[1.5px] px-[30px] cursor-pointer hover:shadow-[2px_4px_12px_0_rgba(162,161,168,0.2)] transition-shadow ${tone.cardClass}`}>
            <div className="flex h-[58px] w-full flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                    <p
                        className="min-w-0 max-w-[303px] truncate text-[15px] font-semibold leading-normal"
                        style={{ color: tone.titleColor }}
                    >
                        {exercise.title}
                    </p>

                    <p
                        className="w-9 text-center text-[13px] font-medium leading-[1.2]"
                        style={{ color: tone.percentColor }}
                    >
                        {exercise.progress}%
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <img src={ClockIcon} alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <p className="text-[12px] font-normal leading-normal text-[#858494]">
                        {exercise.latestAttemptedAt}
                    </p>
                </div>

                <div className="relative h-[7px] w-full overflow-hidden rounded-full bg-[#eee]">
                    {exercise.progress > 0 ? (
                        <div
                            className="absolute left-0 top-0 h-full rounded-full"
                            style={{ width: `${exercise.progress}%`, backgroundImage: tone.fillStyle }}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default function DetailSubject() {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);

    const subject = useMemo(() => {
        const matchedSubject = getReviewSubjectById(subjectId);

        if (matchedSubject) {
            return matchedSubject;
        }

        if (location.state?.id === String(subjectId)) {
            return location.state;
        }

        return createReviewSubject({
            id: subjectId || '0',
            name: subjectId ? String(subjectId) : 'Môn học',
            documents: '0 tài liệu đã tải',
        });
    }, [location.state, subjectId]);

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="mt-4 flex items-center justify-between gap-6">
                <button
                    type="button"
                    onClick={() => navigate('/review')}
                    className="flex min-w-0 items-center gap-3 text-left cursor-pointer"
                >
                    <img src={BackArrowIcon} alt="" aria-hidden="true" className="h-7 w-7 shrink-0" />
                    <h1 className="truncate text-[18px] font-semibold leading-[1.2] text-[#212121]">
                        {subject.name}
                    </h1>
                </button>

                <button
                    type="button"
                    onClick={() => setIsAddExerciseOpen(true)}
                    className="flex h-9 w-[111px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#6949ff] px-4 text-[15px] font-normal leading-[1.4] tracking-[0.2px] text-white shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)]"
                >
                    <span>Thêm</span>
                    <img src={AddCircleIcon} alt="" aria-hidden="true" className="h-5 w-5 shrink-0" />
                </button>
            </div>

            <div className="mt-5 flex min-h-0 flex-1 items-start justify-between gap-[30px]">
                <div className="flex w-[243px] shrink-0 flex-col gap-5">
                    <div className="flex h-[177px] flex-col justify-between rounded-[10px] bg-[#7152f3] p-5">
                        <MetricItem icon={StarWhiteIcon} label="Chưa xong: " value={subject.unfinishedCount} />
                        <MetricItem icon={CalendarCheckIcon} label="Hoàn Thành: " value={subject.completedCount} />
                        <MetricItem icon={FileIcon} label="Mã môn: " value={subject.subjectCode} />
                    </div>

                    <p className="text-[13px] leading-normal font-normal text-[#858494]">
                        {subject.description}
                    </p>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-5">
                    <h2 className="text-[18px] font-semibold leading-[1.2] text-[#212121]">
                        Danh sách bài tập
                    </h2>

                    <div className="flex flex-col gap-3 max-h-[700px] overflow-y-auto thin-scrollbar pb-10">
                        {subject.exercises.map((exercise) => (
                            <ExerciseCard key={exercise.id} exercise={exercise} />
                        ))}
                    </div>
                </div>
            </div>

            <AddExercise
                open={isAddExerciseOpen}
                onClose={() => setIsAddExerciseOpen(false)}
                onSubmit={() => setIsAddExerciseOpen(false)}
            />
        </div>
    );
}