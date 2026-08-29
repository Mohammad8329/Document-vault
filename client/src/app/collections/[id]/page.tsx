'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_COLLECTION, GET_COLLECTIONS, DELETE_DOCUMENT, UPDATE_DOCUMENT } from '@/graphql/operations';
import { Sidebar } from '@/components/Sidebar';
import { DocumentCard, DocumentNode } from '@/components/DocumentCard';
import { DocumentModal } from '@/components/DocumentModal';
import { MoveDocumentModal } from '@/components/MoveDocumentModal';
import { CreateCollectionModal } from '@/components/CreateCollectionModal';
import {
  Folder,
  FilePlus,
  ArrowLeft,
  Calendar,
  Layers,
  FileText,
  Archive,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';

interface CollectionDetail {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  documents: DocumentNode[];
}

interface GetCollectionData {
  collection: CollectionDetail | null;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Modals state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isCreateColModalOpen, setIsCreateColModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentNode | null>(null);
  const [movingDoc, setMovingDoc] = useState<DocumentNode | null>(null);

  // Filters state
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>('all');

  const { data, loading, error } = useQuery<GetCollectionData>(GET_COLLECTION, {
    variables: { id: collectionId },
    skip: !collectionId,
  });

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    refetchQueries: [
      { query: GET_COLLECTION, variables: { id: collectionId } },
      { query: GET_COLLECTIONS },
    ],
  });

  const [updateDocument] = useMutation(UPDATE_DOCUMENT, {
    refetchQueries: [
      { query: GET_COLLECTION, variables: { id: collectionId } },
      { query: GET_COLLECTIONS },
    ],
  });

  const collection = data?.collection;

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      await deleteDocument({ variables: { id } });
    }
  };

  const handleArchiveToggle = async (doc: DocumentNode) => {
    await updateDocument({
      variables: {
        id: doc.id,
        isArchived: !doc.isArchived,
      },
    });
  };

  const handleEdit = (doc: DocumentNode) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingDoc(null);
    setIsDocModalOpen(true);
  };

  // Filter documents by tab and local search text
  const filteredDocuments = (collection?.documents || []).filter((doc) => {
    if (activeTab === 'active' && doc.isArchived) return false;
    if (activeTab === 'archived' && !doc.isArchived) return false;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchContent = doc.content.toLowerCase().includes(q);
      const matchTags = doc.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchContent || matchTags;
    }
    return true;
  });

  const totalCount = collection?.documents?.length || 0;
  const archivedCount = collection?.documents?.filter((d) => d.isArchived).length || 0;
  const activeCount = totalCount - archivedCount;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar onOpenCreateCollection={() => setIsCreateColModalOpen(true)} />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Breadcrumb & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {collection?.name || 'Vault Details'}
            </span>
          </div>

          {loading && (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading collection data...
            </div>
          )}

          {!loading && !collection && (
            <div
              className="glass-card"
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--warning-bg)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={28} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Vault Not Found</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
                The collection you requested does not exist in PostgreSQL or was deleted.
              </p>
              <Link href="/" className="btn btn-primary">
                Return to Dashboard
              </Link>
            </div>
          )}

          {!loading && collection && (
            <>
              {/* Collection Header Banner */}
              <div
                className="glass-card"
                style={{
                  padding: '30px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-glow)',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Folder size={22} />
                    </div>
                    <div>
                      <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                        {collection.name}
                      </h1>
                      <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                        /{collection.slug}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} />
                      Created {new Date(Number(collection.createdAt) || collection.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Layers size={14} />
                      {totalCount} Total Document{totalCount === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCreateNew} className="btn btn-primary" style={{ padding: '10px 18px' }}>
                    <FilePlus size={17} />
                    <span>New Document</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Local Search Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                {/* Tabs */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--bg-secondary)',
                    padding: '4px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('all')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: activeTab === 'all' ? 'var(--surface-card-hover)' : 'transparent',
                      color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    All ({totalCount})
                  </button>

                  <button
                    onClick={() => setActiveTab('active')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: activeTab === 'active' ? 'var(--surface-card-hover)' : 'transparent',
                      color: activeTab === 'active' ? 'var(--success)' : 'var(--text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    Active ({activeCount})
                  </button>

                  <button
                    onClick={() => setActiveTab('archived')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: activeTab === 'archived' ? 'var(--surface-card-hover)' : 'transparent',
                      color: activeTab === 'archived' ? 'var(--warning)' : 'var(--text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    Archived ({archivedCount})
                  </button>
                </div>

                {/* Local Search Input */}
                <div style={{ position: 'relative', width: '280px' }}>
                  <Search
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Filter vault documents..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Documents Grid */}
              {filteredDocuments.length === 0 ? (
                <div
                  className="glass-card"
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <FileText size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    {searchFilter ? 'No matching documents found' : 'No documents in this vault'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                    {searchFilter
                      ? 'Try adjusting your search query or filters.'
                      : 'Add your first document to begin storing knowledge in this collection.'}
                  </p>
                  {!searchFilter && (
                    <button onClick={handleCreateNew} className="btn btn-primary" style={{ marginTop: '8px' }}>
                      <FilePlus size={16} />
                      <span>Create Document</span>
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
                  {filteredDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onEdit={handleEdit}
                      onArchiveToggle={handleArchiveToggle}
                      onDelete={handleDelete}
                      onMove={(d) => setMovingDoc(d)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {collectionId && (
        <DocumentModal
          isOpen={isDocModalOpen}
          onClose={() => {
            setIsDocModalOpen(false);
            setEditingDoc(null);
          }}
          collectionId={collectionId as string}
          initialDocument={editingDoc}
        />
      )}

      {collectionId && (
        <MoveDocumentModal
          isOpen={Boolean(movingDoc)}
          onClose={() => setMovingDoc(null)}
          document={movingDoc}
          currentCollectionId={collectionId as string}
        />
      )}

      <CreateCollectionModal
        isOpen={isCreateColModalOpen}
        onClose={() => setIsCreateColModalOpen(false)}
      />
    </div>
  );
}
