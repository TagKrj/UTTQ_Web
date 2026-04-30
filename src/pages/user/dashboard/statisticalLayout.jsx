import React, { useState } from 'react';
import ReviewResultsStats from './statistical/ReviewResultsStats';
import ReviewTimeStats from './statistical/ReviewTimeStats';
import { ReviewSubjectDetailList, ReviewSubjectPieChartCard } from './statistical/ReviewSubjectStats';
import {
    REVIEW_SUBJECT_STATS_BY_PERIOD,
    REVIEW_SUBJECT_STATS_DEFAULT_PERIOD,
} from '../../../constants/reviewSubjectStats';

export default function StatisticalLayout() {
    const [selectedPeriod, setSelectedPeriod] = useState(REVIEW_SUBJECT_STATS_DEFAULT_PERIOD);
    const activePeriod = REVIEW_SUBJECT_STATS_BY_PERIOD[selectedPeriod];

    return (
        <div className="flex h-full w-full justify-center overflow-auto bg-white rounded-[20px] border border-[#E5E7EB] px-6 py-6 thin-scrollbar">
            <div className="flex w-full flex-col gap-6">
                <div className="flex flex-row justify-center gap-[15px]">
                    <ReviewResultsStats />
                    <ReviewSubjectPieChartCard
                        onPeriodChange={setSelectedPeriod}
                        periodData={activePeriod}
                        selectedPeriod={selectedPeriod}
                    />
                </div>

                <div className="flex flex-row justify-center gap-[15px]">
                    <ReviewTimeStats />
                    <ReviewSubjectDetailList items={activePeriod.subjects} />
                </div>
            </div>
        </div>
    );
}