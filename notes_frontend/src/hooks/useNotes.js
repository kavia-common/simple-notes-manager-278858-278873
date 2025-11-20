import { useCallback, useEffect, useMemo, useState } from 'react';
import { listNotes, createNote, updateNote, deleteNote, getNote } from '../api/client';

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Manage notes state, selection, loading, and errors.
   * Exposes CRUD handlers and keeps local state in sync by refetching.
   */
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listNotes();
      setNotes(Array.isArray(data) ? data : []);
      // If selected note no longer exists, clear selection
      if (selectedNoteId != null && !data.some((n) => n.id === selectedNoteId)) {
        setSelectedNoteId(null);
      }
    } catch (e) {
      // Minimal console logging, surface to UI
      // eslint-disable-next-line no-console
      console.error(e);
      setError(e?.message || 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const selectNote = useCallback(async (id) => {
    setSelectedNoteId(id);
    // Optionally refresh the single note to ensure freshest data
    try {
      const fresh = await getNote(id);
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === id);
        if (idx >= 0) {
          const next = prev.slice();
          next[idx] = fresh;
          return next;
        }
        return prev.concat(fresh);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError(e?.message || 'Failed to load the selected note.');
    }
  }, []);

  const createHandler = useCallback(
    async ({ title, content }) => {
      setLoading(true);
      setError('');
      try {
        const created = await createNote({ title, content });
        await fetchNotes();
        setSelectedNoteId(created.id);
        return created;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(e?.message || 'Failed to create note.');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchNotes]
  );

  const saveHandler = useCallback(
    async (id, { title, content }) => {
      setLoading(true);
      setError('');
      try {
        const updated = await updateNote(id, { title, content });
        await fetchNotes();
        return updated;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(e?.message || 'Failed to save note.');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchNotes]
  );

  const deleteHandler = useCallback(
    async (id) => {
      setLoading(true);
      setError('');
      try {
        await deleteNote(id);
        await fetchNotes();
        if (selectedNoteId === id) {
          setSelectedNoteId(null);
        }
        return true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(e?.message || 'Failed to delete note.');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchNotes, selectedNoteId]
  );

  return {
    notes,
    selectedNote,
    selectedNoteId,
    loading,
    error,
    fetchNotes,
    selectNote,
    createNote: createHandler,
    saveNote: saveHandler,
    deleteNote: deleteHandler,
    setError,
  };
}
