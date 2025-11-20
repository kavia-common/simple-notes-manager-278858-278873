import React, { useEffect, useMemo, useState } from 'react';

/**
 PUBLIC_INTERFACE
 Form for creating and editing a note.
 Shows validation and network errors (aria-live polite).
 */
export default function NoteEditor({
  note,
  onCreate,
  onSave,
  onDelete,
  disabled,
  globalError,
  clearError,
}) {
  const isEditingExisting = !!(note && note.id !== undefined && note.id !== null);

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note]);

  const characterLimits = useMemo(
    () => ({
      titleMax: 120,
      contentMax: 5000,
    }),
    []
  );

  const validate = () => {
    if (!title || title.trim().length === 0) {
      return 'Title is required.';
    }
    if (title.length > characterLimits.titleMax) {
      return `Title must be at most ${characterLimits.titleMax} characters.`;
    }
    if (content && content.length > characterLimits.contentMax) {
      return `Content must be at most ${characterLimits.contentMax} characters.`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) return;
    const v = validate();
    if (v) {
      setLocalError(v);
      return;
    }
    setLocalError('');
    try {
      if (isEditingExisting) {
        await onSave?.(note.id, { title: title.trim(), content });
      } else {
        await onCreate?.({ title: title.trim(), content });
      }
    } catch {
      // globalError will display from parent hook; keep local silence here
    }
  };

  const handleDelete = async () => {
    if (disabled || !isEditingExisting) return;
    const ok = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
    if (!ok) return;
    try {
      await onDelete?.(note.id);
    } catch {
      // globalError will display from parent hook
    }
  };

  const effectiveError = localError || globalError;

  return (
    <section className="editor" aria-label="Note editor">
      <form className="editor-form" onSubmit={handleSubmit} noValidate>
        <div className="form-header">
          <h2 className="section-title">{isEditingExisting ? 'Edit Note' : 'Create Note'}</h2>
          {isEditingExisting && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={disabled}
              aria-disabled={disabled}
            >
              Delete
            </button>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={characterLimits.titleMax}
            required
            disabled={disabled}
            aria-invalid={!!effectiveError}
          />
          <div className="helper">
            {title.length}/{characterLimits.titleMax}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={characterLimits.contentMax}
            rows={10}
            disabled={disabled}
          />
          <div className="helper">
            {content.length}/{characterLimits.contentMax}
          </div>
        </div>

        <div
          className={`error-banner ${effectiveError ? 'visible' : ''}`}
          role="status"
          aria-live="polite"
        >
          {effectiveError && (
            <div className="error-text">
              {effectiveError}
              {clearError && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => clearError('')}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={disabled}
            aria-disabled={disabled}
          >
            {isEditingExisting ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </section>
  );
}
