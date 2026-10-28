const BASE_URL = '/api/hsprice';
const TIMEOUT_MS = 15000;
const API_KEY = import.meta.env.VITE_API_KEY;

export class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiError';
  }
}

const isFilled = (item) => Boolean(item && (item.number || item.brand || item.name));

async function request(params) {
  if (!API_KEY) {
    throw new ApiError('Не задан ключ API. Укажите VITE_API_KEY в файле .env.local');
  }

  const query = Object.entries({ key: API_KEY, ...params })
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('&');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BASE_URL}?${query}`, { signal: controller.signal });
  } catch (error) {
    throw new ApiError(
      error.name === 'AbortError'
        ? 'Превышено время ожидания ответа сервиса'
        : 'Сервис недоступен. Проверьте подключение к сети'
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new ApiError(`Ошибка сервера (HTTP ${response.status})`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Сервис вернул некорректный ответ');
  }

  if (data && data.error) {
    const messages = Array.isArray(data.error) ? data.error : [data.error];
    throw new ApiError(messages.join('; '));
  }

  // Пустая структура от сервиса означает, что деталь не найдена
  const goods = Array.isArray(data) ? data : data?.goods;
  return Array.isArray(goods) ? goods.filter(isFilled) : [];
}

export function fetchGoodsByNumber(number) {
  return request({ number });
}

export function fetchAnalogues(number, brand) {
  return request({ number, brand, analogues: 'on', info: 'on' });
}
