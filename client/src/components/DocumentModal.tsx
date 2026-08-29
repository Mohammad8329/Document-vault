'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_DOCUMENT, UPDATE_DOCUMENT, GET_COLLECTION, GET_COLLECTIONS } from '@/graphql/operations';
import { DocumentNode } from './DocumentCard';
import { X, FilePlus, Edit3, AlertCircle, CheckCircle2, Tag } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  initialDocument?: DocumentNode | null;
}

export function DocumentModal({
  isOpen,
  onClose,
  collectionId,
  initialDocument,
}: DocumentModalProps) {
  const isEditing = Boolean(initialDocument);
  const [title, setTitle] = useState(initialDocument?.title || '');
  const [content, setContent] = useState(initialDocument?.content || '');
  const [tagsInput, setTagsInput] = useState(initialDocument?.tags?.join(', ') || '');
  const [isArchived, setIsArchived] = useState(initialDocument?.isArchived || false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if initialDocument changes
  React.useEffect(() => {
    if (initialDocument) {
      setTitle(initialDocument.title);
      setContent(initialDocument.content);
      setTagsInput(initialDocument.tags?.join(', ') || '');
      setIsArchived(initialDocument.isArchived);
    } else {
      setTitle('');
      setContent('');
      setTagsInput('');
      setIsArchived(false);
    }
    setErrorMessage(null);
  }, [initialDocument, isOpen]);

  const [createDocument, { loading: creating }] = useMutation(CREATE_DOCUMENT, {
    refetchQueries: [
      { query: GET_COLLECTION, variables: { id: collectionId } },
      { query: GET_COLLECTIONS },
    ],
    onCompleted: () => {
      onClose();
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to create document');
    },
  });

  const [updateDocument, { loading: updating }] = useMutation(UPDATE_DOCUMENT, {
    refetchQueries: [
      { query: GET_COLLECTION, variables: { id: collectionId } },
      { query: GET_COLLECTIONS },
    ],
    onCompleted: () => {
      onClose();
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update document');
    },
  });

  if (!isOpen) return null;

  const loading = creating || updating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Document title cannot be empty');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Document content cannot be empty');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEditing && initialDocument) {
      await updateDocument({
        variables: {
          id: initialDocument.id,
          title: title.trim(),
          content: content.trim(),
          tags: parsedTags,
          isArchived,
        },
      });
    } else {
      await createDocument({
        variables: {
          collectionId,
          title: title.trim(),
          content: content.trim(),
          tags: parsedTags,
        },
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-modal"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isEditing ? <Edit3 size={19} /> : <FilePlus size={19} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isEditing ? 'Edit Document' : 'Create New Document'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isEditing ? 'Update document metadata and contents' : 'Add a new markdown document to this vault'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Document Title <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Architecture RFC & Design"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              Document Content <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <textarea
              className="textarea-field"
              rows={6}
              placeholder="Write or paste your markdown content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
              <Tag size={13} color="var(--accent-primary)" />
              Tags (Comma separated)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. backend, graphql, spec, architecture"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {isEditing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
              <input
                type="checkbox"
                id="isArchivedCheck"
                checked={isArchived}
                onChange={(e) => setIsArchived(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <label htmlFor="isArchivedCheck" style={{ fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}>
                Archive this document (hidden from default active list)
              </label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{isEditing ? 'Save Changes' : 'Create Document'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
