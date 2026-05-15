import API_ENDPOINTS from '../config/api';
import { getStoredAuth } from './authService';

const flashcardSetRequests = new Map();

function getAccessToken(token) {
    if (token) return token;

    const storedAuth = getStoredAuth();
    if (storedAuth?.accessToken) return storedAuth.accessToken;

    if (typeof window === 'undefined') return null;

    return window.localStorage.getItem('access_token')
        || window.sessionStorage.getItem('access_token');
}

function resolvePayload(payload) {
    return payload?.data ?? payload;
}

function getErrorMessage(payload, fallback) {
    return payload?.message || payload?.error || fallback;
}

async function parseJson(response) {
    return response.json().catch(() => null);
}

async function requestJson(url, { method = 'GET', token } = {}) {
    const accessToken = getAccessToken(token);

    if (!accessToken) {
        throw new Error('Vui lòng đăng nhập!');
    }

    const response = await fetch(url, {
        method,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const payload = await parseJson(response);

    if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Không thể tải flashcard.'));
    }

    return resolvePayload(payload);
}

function getArrayPayload(payload, keys) {
    const data = resolvePayload(payload);

    if (Array.isArray(data)) return data;

    for (const key of keys) {
        if (Array.isArray(data?.[key])) return data[key];
    }

    return [];
}

function getFirstId(payload) {
    const data = resolvePayload(payload);
    const source = data?.flashcardSet ?? data?.set ?? data?.item ?? data;

    return source?.id ?? source?._id ?? source?.flashcardSetId;
}

function getPayloadSource(payload) {
    const data = resolvePayload(payload);
    return data?.flashcardSet ?? data?.set ?? data?.item ?? data;
}

function getStatus(payload) {
    return String(getPayloadSource(payload)?.status ?? '').toLowerCase();
}

function isCompleted(payload) {
    return getStatus(payload) === 'completed';
}

function isFailed(payload) {
    return getStatus(payload) === 'failed';
}

function normalizeBoolean(value) {
    if (typeof value === 'boolean') return value;

    if (typeof value === 'string') {
        const normalizedValue = value.toLowerCase().trim();

        if (normalizedValue === 'true') return true;
        if (normalizedValue === 'false') return false;
    }

    return undefined;
}

function shuffleItems(items) {
    const shuffledItems = [...items];

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
    }

    return shuffledItems;
}

function pickDifferentAnswer(cards, currentIndex) {
    const currentAnswer = cards[currentIndex]?.answer;
    const answerCandidates = cards.filter((card, index) => index !== currentIndex && card.answer !== currentAnswer);

    if (answerCandidates.length === 0) {
        return currentAnswer;
    }

    const randomCandidate = answerCandidates[Math.floor(Math.random() * answerCandidates.length)];
    return randomCandidate.answer;
}

function removeInternalCardFields(card) {
    const cleanedCard = { ...card };
    delete cleanedCard.hasExplicitCorrectness;
    return cleanedCard;
}

function buildTrueFalseCards(cards) {
    if (cards.some((card) => card.hasExplicitCorrectness)) {
        return cards.map((card) => ({
            ...removeInternalCardFields(card),
            isDefinitionCorrect: card.isDefinitionCorrect ?? true,
        }));
    }

    if (cards.length < 2) {
        return cards.map((card) => ({
            ...removeInternalCardFields(card),
            isDefinitionCorrect: true,
        }));
    }

    const falseCardCount = Math.max(1, Math.round(cards.length * 0.45));
    const falseIndexes = new Set(
        shuffleItems(cards.map((_, index) => index)).slice(0, falseCardCount),
    );

    return cards.map((card, index) => {
        const cleanedCard = removeInternalCardFields(card);

        if (!falseIndexes.has(index)) {
            return {
                ...cleanedCard,
                isDefinitionCorrect: true,
            };
        }

        return {
            ...cleanedCard,
            answer: pickDifferentAnswer(cards, index),
            isDefinitionCorrect: false,
        };
    });
}

async function fetchUsableSet(set, { token } = {}) {
    const setId = getFirstId(set);

    if (!setId) return null;

    const detail = await fetchFlashcardSetById(setId, { token });
    const normalizedSet = normalizeFlashcardSet(detail);

    return normalizedSet.cards.length > 0 ? detail : null;
}

async function findCompletedSetWithCards(sets, { token } = {}) {
    const completedSets = sets.filter(isCompleted);

    for (const set of completedSets) {
        const usableSet = await fetchUsableSet(set, { token });

        if (usableSet) {
            return usableSet;
        }
    }

    return null;
}

export async function generateFlashcardSet(documentId, { token } = {}) {
    return requestJson(API_ENDPOINTS.FLASHCARD_SETS.GENERATE(documentId), {
        method: 'POST',
        token,
    });
}

export async function fetchFlashcardSetsByDocument(documentId, { token } = {}) {
    const payload = await requestJson(API_ENDPOINTS.FLASHCARD_SETS.LIST(documentId), { token });
    return getArrayPayload(payload, ['items', 'flashcardSets', 'sets', 'data']);
}

export async function fetchFlashcardSetById(id, { token } = {}) {
    return requestJson(API_ENDPOINTS.FLASHCARD_SETS.DETAIL(id), { token });
}

export async function getOrCreateFlashcardSetByDocument(documentId, { token } = {}) {
    const requestKey = `${documentId}:${token || 'stored-token'}`;

    if (flashcardSetRequests.has(requestKey)) {
        return flashcardSetRequests.get(requestKey);
    }

    const requestPromise = (async () => {
        const existingSets = await fetchFlashcardSetsByDocument(documentId, { token });
        const completedSet = await findCompletedSetWithCards(existingSets, { token });

        if (completedSet) {
            return completedSet;
        }

        const generatedSet = await generateFlashcardSet(documentId, { token });
        const generatedSetId = getFirstId(generatedSet);
        const generatedDetail = generatedSetId
            ? await fetchFlashcardSetById(generatedSetId, { token })
            : generatedSet;
        const normalizedGeneratedSet = normalizeFlashcardSet(generatedDetail);

        if (normalizedGeneratedSet.cards.length > 0) {
            return generatedDetail;
        }

        const refreshedSets = await fetchFlashcardSetsByDocument(documentId, { token });
        const refreshedCompletedSet = await findCompletedSetWithCards(refreshedSets, { token });

        if (refreshedCompletedSet) {
            return refreshedCompletedSet;
        }

        if (isFailed(generatedDetail)) {
            throw new Error('Backend sinh flashcard thất bại. Vui lòng thử lại hoặc kiểm tra cấu hình AI/log backend.');
        }

        throw new Error('Bộ flashcard chưa có thẻ nào.');
    })();

    flashcardSetRequests.set(requestKey, requestPromise);

    try {
        return await requestPromise;
    } finally {
        flashcardSetRequests.delete(requestKey);
    }
}

export function normalizeFlashcardSet(rawSet) {
    const source = getPayloadSource(rawSet);
    const rawCards = getArrayPayload(source, ['flashcards', 'cards', 'items']);

    const cards = rawCards
        .map((card, index) => {
            const explicitCorrectness = normalizeBoolean(
                card?.isDefinitionCorrect ?? card?.isCorrect ?? card?.correct,
            );

            return {
                id: String(card?.id ?? card?._id ?? card?.flashcardId ?? index + 1),
                badge: card?.badge ?? card?.type ?? 'ĐÚNG / SAI',
                prompt: card?.front ?? card?.prompt ?? card?.question ?? card?.term ?? '',
                answer: card?.back ?? card?.answer ?? card?.definition ?? card?.content ?? '',
                isDefinitionCorrect: explicitCorrectness,
                hasExplicitCorrectness: explicitCorrectness !== undefined,
            };
        })
        .filter((card) => card.prompt && card.answer);

    return {
        id: String(getFirstId(source) ?? ''),
        title: source?.title ?? source?.name ?? 'Bộ flashcard',
        status: source?.status ?? '',
        cards: buildTrueFalseCards(cards),
    };
}
