import React from 'react';

export default function RecentSubjects() {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="mt-2 flex items-center justify-between gap-6">
                <h2 className="text-[18px] font-semibold leading-6 text-[#16151c]">
                    Đã ôn tập gần đây
                </h2>

                <p className="pt-2 text-[14px] font-light leading-6 text-[#a2a1a8]">
                    Danh sách sẽ hiển thị ở đây khi có dữ liệu.
                </p>
            </div>

            <div className="mt-5 flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FAFAFF] text-[16px] font-light leading-6 text-[#a2a1a8]">
                Chưa có môn ôn tập gần đây
            </div>
        </div>
    );
}
