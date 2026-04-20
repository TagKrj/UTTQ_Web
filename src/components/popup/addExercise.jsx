import React, { useEffect, useRef, useState } from 'react';
import UploadShapeIcon from '../../assets/icons/Combo shape.svg';
import PdfIcon from '../../assets/icons/fas1.svg';
import DeleteIcon from '../../assets/icons/trash01.svg';

function formatFileSize(bytes) {
    if (!bytes || bytes <= 0) {
        return '0 KB';
    }

    const kilobytes = bytes / 1024;

    if (kilobytes < 1) {
        return '1 KB';
    }

    return `${Math.round(kilobytes)} KB`;
}

function buildAttachment(file) {
    return {
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
    };
}

function AttachmentRow({ attachment, onRemove }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-[14px] bg-[#EDEAFE] px-5 py-3.5">
            <div className="flex min-w-0 items-center gap-3.5">
                <img src={PdfIcon} alt="" aria-hidden="true" className="h-10 w-10 shrink-0" />

                <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold leading-5 text-[#6A5AE0]">
                        {attachment.name}
                    </p>
                    <p className="mt-0.5 text-[13px] font-normal leading-5 text-[#858494]">
                        {attachment.sizeLabel}
                    </p>
                </div>
            </div>

            <button
                type="button"
                aria-label={`Xóa ${attachment.name}`}
                onClick={() => onRemove(attachment.id)}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-[#EB3838] transition-transform duration-200 hover:scale-105"
            >
                <img src={DeleteIcon} alt="" aria-hidden="true" className="h-5 w-5 shrink-0" />
            </button>
        </div>
    );
}

export default function AddExercise({ open, onClose, onSubmit }) {
    const fileInputRef = useRef(null);
    const [exerciseName, setExerciseName] = useState('');
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        if (open) {
            setExerciseName('');
            setAttachments([]);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [open]);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const handleFiles = (fileList) => {
        const pdfFiles = Array.from(fileList ?? []).filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));

        if (pdfFiles.length === 0) {
            return;
        }

        setAttachments((currentAttachments) => [
            ...currentAttachments,
            ...pdfFiles.map((file) => buildAttachment(file)),
        ]);
    };

    const handleFileChange = (event) => {
        handleFiles(event.target.files);
        event.target.value = '';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
    };

    const handleSubmit = () => {
        onSubmit?.({
            exerciseName: exerciseName.trim(),
            files: attachments,
        });
        onClose?.();
    };

    const handleBackdropMouseDown = () => {
        onClose?.();
    };

    const handleRemoveAttachment = (attachmentId) => {
        setAttachments((currentAttachments) => currentAttachments.filter((attachment) => attachment.id !== attachmentId));
    };

    return (
        <div
            className="fixed inset-0 z-80 flex items-center justify-center bg-[rgba(255,255,255,0.72)] px-4 py-6 backdrop-blur-sm"
            onMouseDown={handleBackdropMouseDown}
            role="presentation"
        >
            <div
                className="w-full max-w-[456px] overflow-hidden rounded-[20px] bg-white px-5 pb-5 pt-5 shadow-[0_24px_80px_rgba(17,24,39,0.12)]"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-exercise-title"
            >
                <h2 id="add-exercise-title" className="text-[20px] font-semibold leading-[30px] text-[#16151c]">
                    Thêm bài tập
                </h2>

                <div className="mt-5 h-px w-full bg-[#F3F4F6]" />

                <div className="mx-auto mt-8 flex w-full max-w-[392px] flex-col gap-2.5">
                    <input
                        type="text"
                        aria-label="Tên bài tập"
                        placeholder="Tên bài tập"
                        value={exerciseName}
                        onChange={(event) => setExerciseName(event.target.value)}
                        className="h-14 w-full rounded-2xl bg-[#FAFAFA] px-5 text-[14px] leading-[1.4] font-light tracking-[0.2px] text-[#16151c] outline-none placeholder:text-[#9E9E9E] focus:ring-1 focus:ring-[#6A5AE0]/15"
                    />

                    {attachments.length === 0 ? (
                        <button
                            type="button"
                            onClick={openFilePicker}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={handleDrop}
                            className="flex h-40 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(106,90,224,0.42)] bg-white transition-colors hover:bg-[#FBFAFF] cursor-pointer"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#6A5AE0] shadow-[0_8px_20px_rgba(106,90,224,0.22)]">
                                <img src={UploadShapeIcon} alt="" aria-hidden="true" className="h-[18px] w-[15px] shrink-0" />
                            </span>

                            <p className="mt-5 text-[14px] leading-5 text-[#212121]">
                                Kéo thả hoặc <span className="text-[#6A5AE0]">chọn file</span> để tải lên
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-[#A2A1A8]">
                                Hỗ trợ formats : pdf
                            </p>
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2.5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={openFilePicker}
                                    className="text-[14px] font-semibold leading-5 text-[#6A5AE0] transition-opacity hover:opacity-80 cursor-pointer"
                                >
                                    Thêm pdf
                                </button>
                            </div>

                            <div className="thin-scrollbar flex max-h-[230px] flex-col gap-2.5 overflow-y-auto">
                                {attachments.map((attachment) => (
                                    <AttachmentRow
                                        key={attachment.id}
                                        attachment={attachment}
                                        onRemove={handleRemoveAttachment}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                <div className="mx-auto mt-8 flex w-full max-w-[342px] items-center justify-between gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-[50px] w-[166px] items-center justify-center rounded-full border border-[rgba(162,161,168,0.2)] bg-white text-[16px] leading-none text-[#16151c] transition-colors hover:bg-[#fafafa] cursor-pointer"
                    >
                        Hủy
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex h-[50px] w-[166px] items-center justify-center rounded-full bg-[#6A5AE0] text-[16px] leading-none text-white transition-colors hover:bg-[#5B4ED0] cursor-pointer shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)]"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}
