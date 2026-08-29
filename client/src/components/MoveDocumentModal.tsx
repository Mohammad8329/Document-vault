'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { MOVE_DOCUMENT, GET_COLLECTIONS, GET_COLLECTION } from '@/graphql/operations';
import { DocumentNode } from './DocumentCard';
import { X, FolderInput, AlertCircle, CheckCircle2, Folder } from 'lucide-react';

interface MoveDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentNode | null;
  currentCollectionId: string;
}

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
}

interface GetCollectionsData {
  collections: CollectionItem[];
}

export function MoveDocumentModal({
  isOpen,
  onClose,
  document,
  currentCollectionId,
}: MoveDocumentModalProps) {
  const { data } = useQuery<GetCollectionsData>(GET_COLLECTIONS);
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableCollections = (data?.collections || []).filter(
    (col) => col.id !== currentCollectionId
  );

  React.useEffect(() => {
    if (availableCollections.length > 0) {
      setSelectedTargetId(availableCollections[0]?.id || '');
    }
    setErrorMessage(null);
  }, [isOpen, currentCollectionId]);

  const [moveDocument, { loading }] = useMutation(MOVE_DOCUMENT, {
    refetchQueries: [
      { query: GET_COLLECTION, variables: { id: currentCollectionId } },
      { query: GET_COLLECTION, variables: { id: selectedTargetId } },
      { query: GET_COLLECTIONS },
    ],
    onCompleted: () => {
      onClose();
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to move document');
    },
  });

  if (!isOpen || !document) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetId) {
      setErrorMessage('Please select a destination vault');
      return;
    }

    await moveDocument({
      variables: {
        id: document.id,
        collectionId: selectedTargetId,
      },
    });
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
          maxWidth: '460px',
          padding: '28px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-highlight)',
          boxShadow: 'var(--shadow-lg)',
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
              <FolderInput size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Move Document</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Transfer document to another vault</p>
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

        <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            MOVING DOCUMENT
          </span>
          <strong style={{ fontSize: '0.92rem' }}>{document.title}</strong>
        </div>

        {availableCollections.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No other vaults exist to move this document to. Create another vault first.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                Select Destination Vault <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <select
                className="select-field"
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
              >
                {availableCollections.map((col) => (
                  <option key={col.id} value={col.id}>
                    📁 {col.name} (/{col.slug})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Moving...' : 'Move Document'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
