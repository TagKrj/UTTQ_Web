import API_ENDPOINTS from '../config/api';
import { getStoredAuth } from './authService';

function resolveApiPayload(payload) {
	return payload?.data ?? payload;
}

export async function uploadDocument({ file, title }) {
	if (!file) {
		throw new Error('Vui lòng chọn tài liệu để tải lên.');
	}

	if (!title?.trim()) {
		throw new Error('Vui lòng nhập tiêu đề tài liệu.');
	}

	const accessToken = getStoredAuth()?.accessToken;

	if (!accessToken) {
		throw new Error('Bạn cần đăng nhập để tải tài liệu.');
	}

	const formData = new FormData();
	formData.append('file', file);
	formData.append('title', title.trim());

	const response = await fetch(API_ENDPOINTS.DOCUMENTS.UPLOAD, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: formData,
	});

	const contentType = response.headers.get('content-type') || '';
	const responsePayload = contentType.includes('application/json')
		? await response.json().catch(() => null)
		: await response.text().catch(() => null);

	if (!response.ok) {
		if (typeof responsePayload === 'string' && responsePayload) {
			throw new Error(responsePayload);
		}

		throw new Error(responsePayload?.message || responsePayload?.error || 'Tải tài liệu thất bại.');
	}

	return resolveApiPayload(responsePayload) ?? { message: 'Tải lên thành công' };
}
