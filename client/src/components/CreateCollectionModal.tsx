'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_COLLECTION, GET_COLLECTIONS } from '@/graphql/operations';
import { X, FolderPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCollectionModal({ isOpen, onClose }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createCollection, { loading }] = useMutation(CREATE_COLLECTION, {
    refetchQueries: [{ query: GET_COLLECTIONS }],
    onCompleted: () => {
      setName('');
      setSlug('');
      setErrorMessage(null);
      onClose();
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to create collection');
    },
  });

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (autoSlug) {
      // Auto generate slug from name
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Collection name cannot be empty');
      return;
    }
    if (!slug.trim()) {
      setErrorMessage('Slug cannot be empty (e.g. engineering-vault)');
      return;
    }

    await createCollection({
      variables: {
        name: name.trim(),
        slug: slug.trim(),
      },
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
          maxWidth: '480px',
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
              <FolderPlus size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Create New Vault</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Group your documents into a secure collection</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form Error Banner */}
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
              Collection Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Product Architecture"
              value={name}
              onChange={handleNameChange}
              autoFocus
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                URL Slug <span style={{ color: 'var(--accent-primary)' }}>*</span>
              </label>
              <button
                type="button"
                onClick={() => setAutoSlug(!autoSlug)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: autoSlug ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {autoSlug ? 'Auto-sync ON' : 'Custom Slug'}
              </button>
            </div>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. product-architecture"
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(e.target.value);
              }}
            />
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Must contain only lowercase letters, numbers, and hyphens (e.g. <code>my-vault-2026</code>).
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                'Creating Vault...'
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Create Vault</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
