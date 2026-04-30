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

function resolveAuthPayload(payload) {
	return payload?.data ?? payload;
}

function normalizeAuthPayload(payload) {
	const authPayload = resolveAuthPayload(payload);

	if (!authPayload?.accessToken || !authPayload?.refreshToken || !authPayload?.user) {
		throw new Error('Login response is invalid.');
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
		throw new Error(payload?.message || payload?.error || 'Login failed.');
	}

	const auth = normalizeAuthPayload(payload);

	saveStoredAuth(auth, rememberMe);

	return auth;
}

export async function logout() {
	clearStoredAuth();

	return {
		message: 'Đăng xuất thành công',
	};
}
