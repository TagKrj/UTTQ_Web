import API_ENDPOINTS from '../config/api';

const AUTH_STORAGE_KEY = 'myweb.auth';

function isClient() {
	return typeof window !== 'undefined';
}

function readAuthFromStorage(storage) {
	try {
		const rawValue = storage.getItem(AUTH_STORAGE_KEY);

		return rawValue ? JSON.parse(rawValue) : null;
	} catch {
		return null;
	}
}

function writeAuthToStorage(storage, auth) {
	storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function clearAuthFromStorage(storage) {
	storage.removeItem(AUTH_STORAGE_KEY);
}

function resolveApiPayload(payload) {
	return payload?.data ?? payload;
}

function normalizeAuthPayload(payload) {
	const authPayload = resolveApiPayload(payload);

	if (!authPayload?.accessToken || !authPayload?.refreshToken || !authPayload?.user) {
		throw new Error('Phản hồi xác thực không hợp lệ.');
	}

	return {
		accessToken: authPayload.accessToken,
		refreshToken: authPayload.refreshToken,
		user: authPayload.user,
	};
}

export function getStoredAuth() {
	if (!isClient()) {
		return null;
	}

	return readAuthFromStorage(window.localStorage) ?? readAuthFromStorage(window.sessionStorage);
}

export function saveStoredAuth(auth, rememberMe = false) {
	if (!isClient()) {
		return;
	}

	clearStoredAuth();

	const storage = rememberMe ? window.localStorage : window.sessionStorage;
	writeAuthToStorage(storage, auth);
}

export function clearStoredAuth() {
	if (!isClient()) {
		return;
	}

	clearAuthFromStorage(window.localStorage);
	clearAuthFromStorage(window.sessionStorage);
}

export async function login(credentials, { rememberMe = false } = {}) {
	const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(credentials),
	});

	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		clearStoredAuth();
		throw new Error(payload?.message || payload?.error || 'Đăng nhập thất bại.');
	}

	try {
		const auth = normalizeAuthPayload(payload);
		saveStoredAuth(auth, rememberMe);
		return auth;
	} catch (error) {
		clearStoredAuth();
		throw error;
	}
}

export async function register(payload) {
	const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(payload),
	});

	const responsePayload = await response.json().catch(() => null);

	if (!response.ok) {
		throw new Error(responsePayload?.message || responsePayload?.error || 'Đăng ký thất bại.');
	}

	return resolveApiPayload(responsePayload) ?? {
		message: 'Đăng ký thành công',
	};
}

export async function logout() {
	const storedAuth = getStoredAuth();
	const accessToken = storedAuth?.accessToken;

	clearStoredAuth();

	if (!accessToken) {
		return {
			message: 'Đăng xuất thành công',
		};
	}

	const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		throw new Error(payload?.message || payload?.error || 'Đăng xuất thất bại.');
	}

	return resolveApiPayload(payload) ?? {
		message: 'Đăng xuất thành công',
	};
}
