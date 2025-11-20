import React, { useCallback } from 'react';

/**
 PUBLIC_INTERFACE
 Accessible list of note titles with keyboard navigation.
 */
export default function NotesList({ notes, selectedId, onSelect, onCreate, disabled }) {
  const handleKeyDown = useCallback(
    (e, noteId) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.(noteId);
      }
    },
    [onSelect, disabled]
  );

  return (
    <aside className="notes-list" aria-label="Notes list">
      <div className="notes-list-header">
        <h2 className="section-title">Notes</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onCreate}
          disabled={disabled}
          aria-disabled={disabled}
        >
          + New
        </button>
      </div>
      {notes.length === 0 ? (
        <p className="muted" role="status" aria-live="polite">
          No notes yet. Create your first note.
        </p>
      ) : (
        <ul role="listbox" aria-label="Select a note to edit">
          {notes.map((n) => (
            <li key={n.id} className="notes-item">
              <div
                role="option"
                tabIndex={0}
                aria-selected={selectedId === n.id}
                className={`notes-item-button ${selectedId === n.id ? 'selected' : ''}`}
                onClick={() => !disabled && onSelect?.(n.id)}
                onKeyDown={(e) => handleKeyDown(e, n.id)}
                title={n.title}
              >
                <span className="note-title">{n.title}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
