import React, { useEffect, useState } from 'react';
import './App.css';
import { useNotes } from './hooks/useNotes';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application composing layout and wiring hooks + components.
   * Includes theme toggle and responsive two-column layout.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const {
    notes,
    selectedNote,
    selectedNoteId,
    loading,
    error,
    selectNote,
    createNote,
    saveNote,
    deleteNote,
    setError,
  } = useNotes();

  const handleCreateStart = async () => {
    // Start creation by clearing selection and presenting empty editor
    // Alternatively, directly create with a placeholder title
    selectNote(null);
  };

  const handleCreate = async ({ title, content }) => {
    await createNote({ title, content });
  };

  const handleSave = async (id, payload) => {
    await saveNote(id, payload);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
  };

  const clearGlobalError = () => setError('');

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="logo-circle" aria-hidden="true">N</div>
          <h1 className="app-title">Notes</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="btn"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main className="content">
        <NotesList
          notes={notes}
          selectedId={selectedNoteId}
          onSelect={selectNote}
          onCreate={handleCreateStart}
          disabled={loading}
        />

        <section className="editor-container">
          {selectedNote || selectedNoteId === null ? (
            <NoteEditor
              note={selectedNoteId === null ? null : selectedNote}
              onCreate={handleCreate}
              onSave={handleSave}
              onDelete={handleDelete}
              disabled={loading}
              globalError={error}
              clearError={clearGlobalError}
            />
          ) : (
            <EmptyState onCreate={handleCreateStart} disabled={loading} />
          )}
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <span className="muted">Backend: http://localhost:3001</span>
        {loading && (
          <span className="muted" aria-live="polite" role="status">
            Loading...
          </span>
        )}
      </footer>
    </div>
  );
}

export default App;
