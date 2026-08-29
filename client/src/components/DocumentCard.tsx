'use client';

import React from 'react';
import {
  FileText,
  Calendar,
  Clock,
  Tag,
  Archive,
  ArchiveRestore,
  Trash2,
  FolderInput,
  Edit3
} from 'lucide-react';

export interface DocumentNode {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  collectionId: string;
}

interface DocumentCardProps {
  document: DocumentNode;
  onEdit?: (doc: DocumentNode) => void;
  onArchiveToggle?: (doc: DocumentNode) => void;
  onDelete?: (id: string, title: string) => void;
  onMove?: (doc: DocumentNode) => void;
}

export function DocumentCard({
  document,
  onEdit,
  onArchiveToggle,
  onDelete,
  onMove,
}: DocumentCardProps) {
  const createdDate = new Date(Number(document.createdAt) || document.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const updatedDate = new Date(Number(document.updatedAt) || document.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        opacity: document.isArchived ? 0.78 : 1,
        border: document.isArchived ? '1px dashed var(--border-highlight)' : '1px solid var(--border-subtle)',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div>
        {/* Card Header with Badges & Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {document.isArchived ? (
              <span className="badge badge-archived" style={{ gap: '4px' }}>
                <Archive size={12} />
                Archived
              </span>
            ) : (
              <span className="badge badge-active" style={{ gap: '4px' }}>
                <FileText size={12} />
                Active
              </span>
            )}
          </div>

          {/* Quick Card Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {onMove && (
              <button
                onClick={() => onMove(document)}
                className="btn-icon"
                title="Move to another vault"
                style={{ padding: '6px' }}
              >
                <FolderInput size={15} />
              </button>
            )}

            {onArchiveToggle && (
              <button
                onClick={() => onArchiveToggle(document)}
                className="btn-icon"
                title={document.isArchived ? 'Unarchive document' : 'Archive document'}
                style={{ padding: '6px', color: document.isArchived ? 'var(--success)' : 'var(--warning)' }}
              >
                {document.isArchived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(document)}
                className="btn-icon"
                title="Edit document"
                style={{ padding: '6px' }}
              >
                <Edit3 size={15} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(document.id, document.title)}
                className="btn-icon"
                title="Delete document"
                style={{ padding: '6px', color: 'var(--danger)' }}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            lineHeight: 1.35,
            marginBottom: '10px',
            color: 'var(--text-primary)',
          }}
        >
          {document.title}
        </h3>

        {/* Markdown Content Preview */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-line',
          }}
        >
          {document.content}
        </p>

        {/* Tag Pills */}
        {document.tags && document.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {document.tags.map((tag, idx) => (
              <span key={idx} className="badge badge-tag" style={{ gap: '3px' }}>
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.74rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={13} />
          Created {createdDate}
        </span>

        {document.updatedAt && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            Updated {updatedDate}
          </span>
        )}
      </div>
    </div>
  );
}
