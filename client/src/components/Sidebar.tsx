'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { GET_COLLECTIONS } from '@/graphql/operations';
import { useTheme } from '@/context/ThemeContext';
import {
  Folder,
  Plus,
  Search,
  LayoutDashboard,
  Sun,
  Moon,
  Database,
  FileText,
  Archive,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onOpenCreateCollection?: () => void;
}

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

export function Sidebar({ onOpenCreateCollection }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data, loading } = useQuery<GetCollectionsData>(GET_COLLECTIONS);

  const collections = data?.collections || [];
  const totalDocs = collections.reduce((acc, col) => acc + (col.documents?.length || 0), 0);
  const totalArchived = collections.reduce(
    (acc, col) => acc + (col.documents?.filter((d) => d.isArchived).length || 0),
    0
  );

  return (
    <aside
      style={{
        width: '280px',
        minWidth: '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border-subtle)',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 20,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px 18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Database size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'block' }}>
              DocVault
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              GraphQL Knowledge Hub
            </span>
          </div>
        </Link>

        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} color="var(--warning)" /> : <Moon size={17} color="var(--accent-primary)" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div style={{ padding: '16px 14px 8px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: pathname === '/' ? 'var(--surface-glass-hover)' : 'transparent',
            border: pathname === '/' ? '1px solid var(--border-highlight)' : '1px solid transparent',
            transition: 'all var(--transition-fast)',
          }}
        >
          <LayoutDashboard size={18} color={pathname === '/' ? 'var(--accent-primary)' : 'currentColor'} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: pathname === '/search' ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: pathname === '/search' ? 'var(--surface-glass-hover)' : 'transparent',
            border: pathname === '/search' ? '1px solid var(--border-highlight)' : '1px solid transparent',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Search size={18} color={pathname === '/search' ? 'var(--accent-primary)' : 'currentColor'} />
          <span>Search & Filter</span>
        </Link>
      </div>

      {/* Vault Collections Section Header */}
      <div
        style={{
          padding: '18px 20px 8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: 'var(--text-muted)',
          }}
        >
          Vaults ({collections.length})
        </span>

        {onOpenCreateCollection && (
          <button
            onClick={onOpenCreateCollection}
            className="btn-icon"
            style={{ padding: '4px', borderRadius: 'var(--radius-sm)' }}
            title="Create New Collection"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Collections List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 14px 16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
        }}
      >
        {loading && (
          <div style={{ padding: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Loading vaults...
          </div>
        )}

        {!loading && collections.length === 0 && (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
              margin: '8px 0',
            }}
          >
            No vaults created yet.
          </div>
        )}

        {collections.map((col) => {
          const isActive = pathname === `/collections/${col.id}`;
          const activeDocsCount = col.documents?.filter((d) => !d.isArchived).length || 0;

          return (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--surface-card-hover)' : 'transparent',
                border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                <Folder
                  size={16}
                  color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'}
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.name}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontWeight: 700,
                  }}
                >
                  {activeDocsCount}
                </span>
                <ChevronRight size={14} color="var(--text-muted)" opacity={isActive ? 1 : 0.4} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Metrics Footer */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={15} color="var(--accent-primary)" />
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Docs</span>
            <strong style={{ fontSize: '0.85rem' }}>{totalDocs}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Archive size={15} color="var(--warning)" />
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Archived</span>
            <strong style={{ fontSize: '0.85rem' }}>{totalArchived}</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}
