'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client/react';
import { GET_COLLECTIONS } from '@/graphql/operations';
import { Sidebar } from '@/components/Sidebar';
import { CreateCollectionModal } from '@/components/CreateCollectionModal';
import {
  FolderPlus,
  Search,
  FileText,
  Archive,
  ArrowUpRight,
  Sparkles,
  Layers,
  FolderOpen,
  Calendar
} from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  documents: Array<{ id: string; isArchived: boolean }>;
}

interface GetCollectionsData {
  collections: Collection[];
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading } = useQuery<GetCollectionsData>(GET_COLLECTIONS);

  const collections = data?.collections || [];
  const totalDocs = collections.reduce((acc, col) => acc + (col.documents?.length || 0), 0);
  const totalArchived = collections.reduce(
    (acc, col) => acc + (col.documents?.filter((d) => d.isArchived).length || 0),
    0
  );
  const activeDocs = totalDocs - totalArchived;

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar onOpenCreateCollection={() => setIsModalOpen(true)} />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Top Banner / Welcome */}
          <div
            className="glass-card"
            style={{
              padding: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, var(--surface-card) 0%, var(--bg-tertiary) 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '620px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-glow)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={14} />
                <span>Next-Gen Document Vault</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '10px' }}>
                Secure Document Repository
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6 }}>
                Organize company specifications, engineering docs, and archives into structured GraphQL vaults with real-time substring search.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 2 }}>
              <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '12px 20px' }}>
                <FolderPlus size={18} />
                <span>New Vault</span>
              </button>

              <Link href="/search" className="btn btn-secondary" style={{ padding: '12px 20px' }}>
                <Search size={18} />
                <span>Search All</span>
              </Link>
            </div>
          </div>

          {/* Quick Analytics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <div className="glass-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL VAULTS</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)' }}>
                  <Layers size={18} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{collections.length}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Top-level collections</span>
            </div>

            <div className="glass-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACTIVE DOCUMENTS</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', color: 'var(--success)' }}>
                  <FileText size={18} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{activeDocs}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Available across all vaults</span>
            </div>

            <div className="glass-card" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>ARCHIVED DOCUMENTS</span>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                  <Archive size={18} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalArchived}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Preserved records</span>
            </div>
          </div>

          {/* Vaults Grid Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>All Vaults</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Select a collection to view and manage its documents</p>
              </div>

              <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                <FolderPlus size={16} />
                <span>Create Vault</span>
              </button>
            </div>

            {loading && (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading collections from database...
              </div>
            )}

            {!loading && collections.length === 0 && (
              <div
                className="glass-card"
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  <FolderOpen size={28} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Vaults Created Yet</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                  Create your first collection to start storing and organizing your markdown documents.
                </p>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                  <FolderPlus size={16} />
                  <span>Create First Vault</span>
                </button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '18px' }}>
              {collections.map((col) => {
                const docCount = col.documents?.length || 0;
                const dateFormatted = new Date(Number(col.createdAt) || col.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="glass-card"
                      style={{
                        padding: '22px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
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
                            <FolderOpen size={22} />
                          </div>

                          <span className="btn-icon" style={{ opacity: 0.7 }}>
                            <ArrowUpRight size={18} />
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{col.name}</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontFamily: 'monospace', marginBottom: '14px' }}>
                          /{col.slug}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '14px',
                          borderTop: '1px solid var(--border-subtle)',
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} />
                          {dateFormatted}
                        </span>

                        <span className="badge badge-tag">
                          {docCount} {docCount === 1 ? 'Document' : 'Documents'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <CreateCollectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
