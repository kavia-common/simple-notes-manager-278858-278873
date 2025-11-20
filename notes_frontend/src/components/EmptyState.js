import React from 'react';

/**
 PUBLIC_INTERFACE
 Simple empty state prompting users to select or create a note.
 */
export default function EmptyState({ onCreate, disabled }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <p className="muted">Select a note to view or edit, or create a new one.</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onCreate}
        disabled={disabled}
        aria-disabled={disabled}
      >
        + New Note
      </button>
    </div>
  );
}
