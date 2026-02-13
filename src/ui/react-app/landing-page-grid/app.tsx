import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLandingPages();
  }, []);

  async function loadLandingPages() {
    try {
      setLoading(true);
      const result = await app.callTool('mailchimp_landing_pages_list', { count: 100 });
      const data = JSON.parse(result.content[0].text);
      setLandingPages(data.landing_pages || []);
    } catch (err: any) {
      console.error('Failed to load landing pages:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading landing pages...</p>
      </div>
    );
  }

  const publishedPages = landingPages.filter(p => p.status === 'published').length;
  const draftPages = landingPages.filter(p => p.status === 'draft').length;
  const totalVisits = landingPages.reduce((sum, p) => sum + (p.visits || 0), 0);
  const totalSignups = landingPages.reduce((sum, p) => sum + (p.signups || 0), 0);

  const statusColors: Record<string, string> = {
    published: '#66bb6a',
    unpublished: '#757575',
    draft: '#ffa726'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>🌐 Landing Pages</h1>
          <button onClick={loadLandingPages} style={{
            padding: '8px 16px',
            background: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Pages</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>{landingPages.length}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Published</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#66bb6a' }}>{publishedPages}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Visits</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#42a5f5' }}>{totalVisits.toLocaleString()}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Signups</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#ffa726' }}>{totalSignups.toLocaleString()}</div>
          </div>
        </div>

        {/* Landing Pages Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 20 
        }}>
          {landingPages.map(page => {
            const conversionRate = page.visits > 0 ? (page.signups / page.visits) * 100 : 0;

            return (
              <div 
                key={page.id}
                style={{
                  background: '#1e1e1e',
                  border: '1px solid #333',
                  borderRadius: 8,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, border-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#1e88e5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#333';
                }}
              >
                {/* Preview */}
                <div style={{
                  background: '#2a2a2a',
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #333'
                }}>
                  {page.thumbnail ? (
                    <img 
                      src={page.thumbnail} 
                      alt={page.title}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ fontSize: 48, opacity: 0.3 }}>🌐</div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, marginBottom: 4, fontWeight: 'bold', flex: 1 }}>
                      {page.title || 'Untitled Page'}
                    </h3>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      background: statusColors[page.status] || '#757575',
                      color: 'white',
                      textTransform: 'capitalize',
                      marginLeft: 8
                    }}>
                      {page.status}
                    </span>
                  </div>

                  {page.url && (
                    <div style={{ fontSize: 12, color: '#42a5f5', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={page.url} target="_blank" rel="noopener noreferrer" style={{ color: '#42a5f5', textDecoration: 'none' }}>
                        {page.url}
                      </a>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#888' }}>Visits</div>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#42a5f5' }}>
                        {(page.visits || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#888' }}>Signups</div>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ffa726' }}>
                        {(page.signups || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {page.visits > 0 && (
                    <div style={{
                      padding: '8px 12px',
                      background: '#2a2a2a',
                      borderRadius: 4,
                      fontSize: 12,
                      textAlign: 'center'
                    }}>
                      Conversion: <strong style={{ color: '#66bb6a' }}>{conversionRate.toFixed(1)}%</strong>
                    </div>
                  )}

                  <div style={{ fontSize: 11, color: '#666', marginTop: 12 }}>
                    Created {new Date(page.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {landingPages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
            <p>No landing pages found</p>
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
