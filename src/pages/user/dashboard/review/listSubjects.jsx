import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../../components/pagination';
import AddSubject from '../../../../components/popup/addSubject';
import EditSubject from '../../../../components/popup/editSubject';
import {
    SwitchSvg as SortIcon,
    editSvg as EditIcon,
    removeSvg as RemoveIcon,
} from '../../../../constants/dashboardIcon';
import { REVIEW_SUBJECTS, createReviewSubject } from '../../../../utils/reviewSubjects';

function PlusIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
        >
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6.5V13.5M6.5 10H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function ActionButton({ icon, label, onClick }) {
    const IconComponent = icon;

    return (
        <button
            type="button"
            aria-label={label}
            onClick={(event) => {
                event.stopPropagation();
                onClick?.(event);
            }}
            className="flex h-7 w-7 cursor-pointer items-center justify-center text-[#16151c] transition-colors duration-200 hover:text-[#7152f3]"
        >
            <IconComponent color="currentColor" />
        </button>
    );
}

function RowItem({ subject, documents, onClick, onDelete, onEdit }) {
    return (
        <div
            className="grid cursor-pointer grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_96px] items-center rounded-[10px] border-b border-[#F3F4F6] py-5 transition-colors hover:bg-[#EDEFFF] last:border-b-0"
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onClick?.();
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div className="min-w-0">
                <p className="truncate text-[14px] font-light leading-6 text-[#16151c]">
                    {subject}
                </p>
            </div>

            <div className="min-w-0">
                <p className="truncate text-[14px] font-light leading-6 text-[#16151c]">
                    {documents}
                </p>
            </div>

            <div className="flex items-center justify-end gap-4">
                <ActionButton icon={EditIcon} label="Chỉnh sửa" onClick={onEdit} />
                <ActionButton icon={RemoveIcon} label="Xóa" onClick={onDelete} />
            </div>
        </div>
    );
}

export default function ListSubjects() {
    const [sortOrder, setSortOrder] = useState('newest');
    const [rows, setRows] = useState(REVIEW_SUBJECTS);
    const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
    const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
    const [subjectBeingEdited, setSubjectBeingEdited] = useState(null);
    const navigate = useNavigate();

    const visibleRows = sortOrder === 'newest' ? [...rows].reverse() : rows;

    const openAddSubjectModal = () => {
        setIsAddSubjectOpen(true);
    };

    const openEditSubjectModal = (subject) => {
        setSubjectBeingEdited(subject);
        setIsEditSubjectOpen(true);
    };

    const closeAddSubjectModal = () => {
        setIsAddSubjectOpen(false);
    };

    const closeEditSubjectModal = () => {
        setIsEditSubjectOpen(false);
        setSubjectBeingEdited(null);
    };

    const handleDeleteRow = (rowId, subject) => {
        const shouldDelete = window.confirm(`Bạn có chắc muốn xóa "${subject}" không?`);

        if (shouldDelete) {
            setRows((currentRows) => currentRows.filter((row) => row.id !== rowId));
        }
    };

    const handleAddSubject = ({ subjectCode, subjectName, description }) => {
        setRows((currentRows) => {
            const nextId = currentRows.length > 0 ? Math.max(...currentRows.map((row) => row.id)) + 1 : 1;
            const newSubjectName = subjectName || subjectCode || 'Môn học mới';

            return [
                ...currentRows,
                createReviewSubject({
                    id: nextId,
                    name: newSubjectName,
                    documents: '0 tài liệu đã tải',
                    subjectCode: subjectCode || `MTA${String(nextId).padStart(2, '0')}`,
                    description,
                }),
            ];
        });
    };

    const handleUpdateSubject = ({ subjectCode, subjectName, description }) => {
        if (!subjectBeingEdited) {
            return;
        }

        setRows((currentRows) => currentRows.map((row) => {
            if (row.id !== subjectBeingEdited.id) {
                return row;
            }

            return {
                ...row,
                name: subjectName || subjectCode || row.name,
                subjectCode: subjectCode || row.subjectCode,
                description,
            };
        }));
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="mt-2 flex items-center justify-between gap-6">
                <h2 className="text-[18px] font-semibold leading-6 text-[#16151c]">
                    120 môn học
                </h2>

                <div className="flex items-center gap-6 pt-2">
                    <button
                        type="button"
                        onClick={() => setSortOrder((currentOrder) => (currentOrder === 'newest' ? 'oldest' : 'newest'))}
                        aria-pressed={sortOrder === 'newest'}
                        className="flex cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#7152f3] transition-colors duration-200 hover:text-[#5a44d0]"
                    >
                        <span>{sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'}</span>
                        <span className={`inline-flex transition-transform duration-200 ${sortOrder === 'newest' ? 'rotate-0' : 'rotate-180'}`}>
                            <SortIcon />
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={openAddSubjectModal}
                        className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#7152f3] px-4 text-[16px] font-normal leading-6 text-white shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)] transition-colors hover:bg-[#5a44d0]"
                    >
                        <span>Thêm</span>
                        <PlusIcon />
                    </button>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_96px] items-center border-b border-[#F3F4F6] pb-4 text-[14px] font-light leading-[22px] text-[#a2a1a8]">
                <p>Tên môn học</p>
                <p>Số tài liệu đã tải</p>
                <p className="text-right">Action</p>
            </div>

            <div className="thin-scrollbar -mr-2 min-h-0 flex-1 overflow-y-auto pr-3">
                <div className="divide-y divide-[#F3F4F6]">
                    {visibleRows.map((row) => (
                        <RowItem
                            key={row.id}
                            subject={row.name}
                            documents={row.documents}
                            onClick={() => navigate(String(row.id), { state: row })}
                            onDelete={() => handleDeleteRow(row.id, row.name)}
                            onEdit={() => openEditSubjectModal(row)}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-8 border-t border-[#F3F4F6] pt-6">
                <Pagination pageSize={10} totalItems={60} currentPage={1} totalPages={4} itemLabel="môn học" />
            </div>

            <AddSubject
                open={isAddSubjectOpen}
                onClose={closeAddSubjectModal}
                onSubmit={handleAddSubject}
            />

            <EditSubject
                open={isEditSubjectOpen}
                onClose={closeEditSubjectModal}
                onSubmit={handleUpdateSubject}
                initialValues={subjectBeingEdited ?? undefined}
            />
        </div>
    );
}
