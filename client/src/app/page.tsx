'use client';

import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_COLLECTIONS } from '@/graphql/operations';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Database, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  documents: Array<{ id: string; isArchived: boolean }>;
}

interface GetCollectionsData {
  collections: CollectionItem[];
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { data, loading, error } = useQuery<GetCollectionsData>(GET_COLLECTIONS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  return (
    <main style={{ minHeight: '100vh', width: '100%', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header / Theme switch */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Database size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Document Vault</h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Phase 1 Frontend Verification</p>
            </div>
          </div>

          <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '8px 14px' }}>
            {theme === 'dark' ? <Sun size={16} color="var(--warning)" /> : <Moon size={16} color="var(--accent-primary)" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </header>

        {/* Status Verification Card */}
        <section className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sparkles size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>System & Connectivity Check</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Design System</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Ready (CSS Tokens)
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Active Theme</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span className={`badge ${theme === 'dark' ? 'badge-tag' : 'badge-active'}`}>{theme.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Backend GraphQL</div>
              <div>
                {loading && <span style={{ color: 'var(--text-muted)' }}>Checking connection...</span>}
                {!loading && error && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 600, fontSize: '0.85rem' }}>
                    <ShieldAlert size={16} /> Disconnected (Start server)
                  </span>
                )}
                {!loading && data && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Connected (Yoga 4000)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* GraphQL Data Preview */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Backend Response (`collections` query)</h3>
            {loading && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading collections from GraphQL endpoint...</p>}
            {!loading && error && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                GraphQL server is not reachable on port 4000. Start it with <code>bun run dev</code> in the project root.
              </p>
            )}
            {!loading && data?.collections && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Found <strong>{data.collections.length}</strong> collection(s) in PostgreSQL database:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {data.collections.map((col) => (
                    <span key={col.id} className="badge badge-tag" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      📁 {col.name} (<code>/{col.slug}</code>)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
