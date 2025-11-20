import { BASE_URL } from '../config';

/**
 * Lightweight fetch wrapper with timeout, JSON handling, and error normalization.
 * Ensures consistent error messages and throws on non-2xx responses.
 */
async function request(path, { method = 'GET', body, headers = {}, timeoutMs = 10000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const opts = {
    method,
    headers: {
      'Accept': 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: controller.signal,
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts);

    // Attempt to parse JSON if content-type indicates JSON
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok) {
      const message =
        (data && (data.detail || data.message)) ||
        `Request failed with status ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Request timed out. Please try again.');
      timeoutError.code = 'ETIMEOUT';
      throw timeoutError;
    }
    // Re-throw normalized error
    if (!(err instanceof Error)) {
      const wrapped = new Error('Network error occurred.');
      wrapped.cause = err;
      throw wrapped;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** List all notes */
  return request('/notes', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createNote({ title, content = '' }) {
  /** Create a new note */
  return request('/notes', { method: 'POST', body: { title, content } });
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a note by id */
  if (!id && id !== 0) throw new Error('Note id is required');
  return request(`/notes/${encodeURIComponent(id)}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update a note by id */
  if (!id && id !== 0) throw new Error('Note id is required');
  return request(`/notes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: { title, content },
  });
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id */
  if (!id && id !== 0) throw new Error('Note id is required');
  // FastAPI returns 204 No Content
  await request(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return true;
}
