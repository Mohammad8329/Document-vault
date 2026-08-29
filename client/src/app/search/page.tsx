'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_DOCUMENTS,
  GET_COLLECTIONS,
  DELETE_DOCUMENT,
  UPDATE_DOCUMENT
} from '@/graphql/operations';
import { Sidebar } from '@/components/Sidebar';
import { DocumentCard, DocumentNode } from '@/components/DocumentCard';
import { DocumentModal } from '@/components/DocumentModal';
import { MoveDocumentModal } from '@/components/MoveDocumentModal';
import { CreateCollectionModal } from '@/components/CreateCollectionModal';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Search,
  Filter,
  Layers,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowDownCircle,
  Folder,
  Archive,
  ArrowLeft
} from 'lucide-react';

interface DocumentEdge {
  cursor: string;
  node: DocumentNode;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface GetDocumentsData {
  documents: {
    edges: DocumentEdge[];
    pageInfo: PageInfo;
  };
}

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
}

interface GetCollectionsData {
  collections: CollectionItem[];
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [archiveFilter, setArchiveFilter] = useState<'all' | 'active' | 'archived'>('all');

  // Modals state
  const [isCreateColModalOpen, setIsCreateColModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentNode | null>(null);
  const [movingDoc, setMovingDoc] = useState<DocumentNode | null>(null);

  // Derive GraphQL filter arguments
  const isArchivedArg =
    archiveFilter === 'all' ? undefined : archiveFilter === 'archived' ? true : false;
  const collectionIdArg = selectedCollectionId ? selectedCollectionId : undefined;
  const searchArg = debouncedSearch.trim() ? debouncedSearch.trim() : undefined;

  const { data: collectionsData } = useQuery<GetCollectionsData>(GET_COLLECTIONS);
  const collections = collectionsData?.collections || [];

  const { data, loading, error, fetchMore } = useQuery<GetDocumentsData>(GET_DOCUMENTS, {
    variables: {
      collectionId: collectionIdArg,
      search: searchArg,
      isArchived: isArchivedArg,
      take: 6,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    refetchQueries: [{ query: GET_DOCUMENTS }, { query: GET_COLLECTIONS }],
  });

  const [updateDocument] = useMutation(UPDATE_DOCUMENT, {
    refetchQueries: [{ query: GET_DOCUMENTS }, { query: GET_COLLECTIONS }],
  });

  const edges = data?.documents?.edges || [];
  const pageInfo = data?.documents?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage || false;
  const endCursor = pageInfo?.endCursor;

  const handleLoadMore = () => {
    if (!hasNextPage || !endCursor) return;

    fetchMore({
      variables: {
        after: endCursor,
        take: 6,
      },
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCollectionId('');
    setArchiveFilter('all');
  };

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
  };

  const activeFiltersCount =
    (debouncedSearch.trim() ? 1 : 0) +
    (selectedCollectionId ? 1 : 0) +
    (archiveFilter !== 'all' ? 1 : 0);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar onOpenCreateCollection={() => setIsCreateColModalOpen(true)} />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', marginBottom: '6px' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
                  Dashboard
                </Link>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Global Search</span>
              </div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Search & Pagination Explorer
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Deep query document titles and contents across all vaults with cursor-based pagination.
              </p>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <RotateCcw size={15} />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Search & Filter Control Bar */}
          <div
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Realtime Debounced Search Input */}
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                color="var(--accent-primary)"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Search substring in document title or markdown content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '16px', fontSize: '1rem', height: '48px' }}
                autoFocus
              />
            </div>

            {/* Filter Dropdowns & Segmented Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
                alignItems: 'center',
              }}
            >
              {/* Vault Selector */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <Folder size={14} /> FILTER BY VAULT
                </label>
                <select
                  className="select-field"
                  value={selectedCollectionId}
                  onChange={(e) => setSelectedCollectionId(e.target.value)}
                >
                  <option value="">All Vaults ({collections.length})</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      📁 {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Archived State Filter */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <Archive size={14} /> STATUS FILTER
                </label>
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--bg-secondary)',
                    padding: '4px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    height: '42px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setArchiveFilter('all')}
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: archiveFilter === 'all' ? 'var(--surface-card-hover)' : 'transparent',
                      color: archiveFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={() => setArchiveFilter('active')}
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: archiveFilter === 'active' ? 'var(--surface-card-hover)' : 'transparent',
                      color: archiveFilter === 'active' ? 'var(--success)' : 'var(--text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() => setArchiveFilter('archived')}
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: archiveFilter === 'archived' ? 'var(--surface-card-hover)' : 'transparent',
                      color: archiveFilter === 'archived' ? 'var(--warning)' : 'var(--text-muted)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    Archived
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>
              Showing <strong>{edges.length}</strong> document result{edges.length === 1 ? '' : 's'}
              {debouncedSearch && (
                <> for query <em>"{debouncedSearch}"</em></>
              )}
            </span>

            {pageInfo && (
              <span className="badge badge-tag" style={{ fontSize: '0.75rem' }}>
                Cursor: {endCursor ? 'Active' : 'Initial Page'}
              </span>
            )}
          </div>

          {/* Documents Grid */}
          {edges.length === 0 && !loading ? (
            <div
              className="glass-card"
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <FileText size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Documents Found</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px' }}>
                {activeFiltersCount > 0
                  ? 'No documents matched your search filter criteria. Try resetting your search term or vault filter.'
                  : 'No documents exist in the vault repository.'}
              </p>
              {activeFiltersCount > 0 && (
                <button onClick={handleResetFilters} className="btn btn-secondary">
                  <RotateCcw size={16} />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
              {edges.map((edge) => (
                <DocumentCard
                  key={edge.node.id}
                  document={edge.node}
                  onEdit={handleEdit}
                  onArchiveToggle={handleArchiveToggle}
                  onDelete={handleDelete}
                  onMove={(d) => setMovingDoc(d)}
                />
              ))}
            </div>
          )}

          {/* Cursor Pagination "Load More" */}
          {hasNextPage && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '24px' }}>
              <button
                onClick={handleLoadMore}
                className="btn btn-secondary"
                disabled={loading}
                style={{ padding: '14px 28px', fontSize: '0.92rem', gap: '10px' }}
              >
                <ArrowDownCircle size={18} color="var(--accent-primary)" />
                <span>{loading ? 'Fetching Next Page...' : 'Load More Documents (Cursor Pagination)'}</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {editingDoc && (
        <DocumentModal
          isOpen={Boolean(editingDoc)}
          onClose={() => setEditingDoc(null)}
          collectionId={editingDoc.collectionId}
          initialDocument={editingDoc}
        />
      )}

      {movingDoc && (
        <MoveDocumentModal
          isOpen={Boolean(movingDoc)}
          onClose={() => setMovingDoc(null)}
          document={movingDoc}
          currentCollectionId={movingDoc.collectionId}
        />
      )}

      <CreateCollectionModal
        isOpen={isCreateColModalOpen}
        onClose={() => setIsCreateColModalOpen(false)}
      />
    </div>
  );
}
