import React, { useEffect, useRef, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

const DEFAULT_FORM = {
    title: '',
    description: '',
    file: null,
};

function isAllowedFile(file) {
    if (!file) {
        return false;
    }

    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension));

    return ALLOWED_MIME_TYPES.includes(file.type) || hasAllowedExtension;
}

export default function AddSubject({ open, onClose, onSubmit, loading = false, error = '', successMessage = '' }) {
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setFormData(DEFAULT_FORM);
            setFormError('');

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

    const handleBackdropClick = () => {
        onClose?.();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] ?? null;

        setFormError('');

        if (!file) {
            setFormData((currentForm) => ({ ...currentForm, file: null }));
            return;
        }

        if (!isAllowedFile(file)) {
            setFormError('Vui lòng chọn file .pdf, .doc hoặc .docx.');
            setFormData((currentForm) => ({ ...currentForm, file: null }));
            event.target.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setFormError('File tải lên vượt quá 5MB.');
            setFormData((currentForm) => ({ ...currentForm, file: null }));
            event.target.value = '';
            return;
        }

        setFormData((currentForm) => ({ ...currentForm, file }));
    };

    const handleSubmit = async () => {
        setFormError('');

        if (!formData.title.trim()) {
            setFormError('Vui lòng nhập tiêu đề tài liệu.');
            return;
        }

        if (!formData.file) {
            setFormError('Vui lòng chọn tài liệu để tải lên.');
            return;
        }

        try {
            await onSubmit?.({
                title: formData.title.trim(),
                description: formData.description.trim(),
                file: formData.file,
            });

            setFormData(DEFAULT_FORM);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch {
            // Errors are surfaced via props.
        }
    };

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(255,255,255,0.72)] px-4 py-6 backdrop-blur-sm"
            onMouseDown={handleBackdropClick}
            role="presentation"
        >
            <div
                className="w-full max-w-[456px] overflow-hidden rounded-[20px] bg-white px-5 pb-5 pt-5 shadow-[0_24px_80px_rgba(17,24,39,0.12)]"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-subject-title"
            >
                <h2
                    id="add-subject-title"
                    className="text-[20px] font-semibold leading-[30px] text-[#16151c]"
                >
                    Thêm môn học
                </h2>

                <div className="mt-5 h-px w-full bg-[#F3F4F6]" />

                <div className="mx-auto mt-14 flex w-[380px] flex-col gap-2.5">
                    <label htmlFor="upload-file" className="text-[12px] font-light text-[#9e9e9e]">
                        Tài liệu (PDF/DOC/DOCX, tối đa 5MB)
                    </label>
                    <input
                        ref={fileInputRef}
                        id="upload-file"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        aria-label="Tải tài liệu"
                        onChange={handleFileChange}
                        className="h-14 w-full rounded-xl bg-[#fafafa] px-5 text-[14px] leading-[1.4] tracking-[0.2px] text-[#16151c] outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[#6a5ae0] file:px-4 file:py-2 file:text-white file:shadow-[4px_8px_24px_0_rgba(77,93,250,0.2)] file:cursor-pointer"
                    />
                    {formData.file ? (
                        <p className="text-[12px] font-light text-[#616161]">
                            Đã chọn: {formData.file.name}
                        </p>
                    ) : null}

                    <input
                        type="text"
                        aria-label="Tiêu đề tài liệu"
                        placeholder="Tiêu đề tài liệu"
                        value={formData.title}
                        onChange={(event) => setFormData((currentForm) => ({ ...currentForm, title: event.target.value }))}
                        className="h-14 w-full rounded-xl bg-[#fafafa] px-5 text-[14px] leading-[1.4] tracking-[0.2px] text-[#16151c] outline-none placeholder:text-[#9e9e9e] focus:ring-1 focus:ring-[#6a5ae0]/15 font-light"
                    />

                    <textarea
                        aria-label="Nhập mô tả (tùy chọn)"
                        placeholder="Nhập mô tả (tùy chọn)"
                        value={formData.description}
                        onChange={(event) => setFormData((currentForm) => ({ ...currentForm, description: event.target.value }))}
                        className="h-[150px] w-full resize-none rounded-xl bg-[#fafafa] px-5 py-4 text-[14px] leading-[1.4] tracking-[0.2px] text-[#16151c] outline-none placeholder:text-[#9e9e9e] focus:ring-1 focus:ring-[#6a5ae0]/15 font-light"
                    />
                </div>

                <div className="mx-auto mt-8 flex w-[342px] items-center justify-between gap-2.5">
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
                        disabled={loading}
                        className="flex h-[50px] w-[166px] items-center justify-center rounded-full bg-[#6a5ae0] text-[16px] leading-none text-white transition-colors hover:bg-[#5b4ed0] cursor-pointer shadow-[4px_8px_24px_0_rgba(77,93,250,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Đang tải...' : 'Tải lên'}
                    </button>
                </div>

                {formError || error ? (
                    <p className="mt-4 text-center text-[13px] font-light text-red-500" aria-live="polite">
                        {formError || error}
                    </p>
                ) : null}

                {successMessage ? (
                    <p className="mt-3 text-center text-[13px] font-light text-emerald-600" aria-live="polite">
                        {successMessage}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
