import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
  }, []);

  async function loadAutomations() {
    try {
      setLoading(true);
      const result = await app.callTool('mailchimp_automations_list', { count: 100 });
      const data = JSON.parse(result.content[0].text);
      setAutomations(data.automations || []);
    } catch (err: any) {
      console.error('Failed to load automations:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading automations...</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    save: '#757575',
    paused: '#ffa726',
    sending: '#66bb6a'
  };

  const totalActive = automations.filter(a => a.status === 'sending').length;
  const totalPaused = automations.filter(a => a.status === 'paused').length;
  const totalEmails = automations.reduce((sum, a) => sum + (a.emails_sent || 0), 0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>⚙️ Automation Dashboard</h1>
          <button onClick={loadAutomations} style={{
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
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Automations</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>{automations.length}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Active</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#66bb6a' }}>{totalActive}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Paused</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#ffa726' }}>{totalPaused}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Emails Sent</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#42a5f5' }}>{totalEmails.toLocaleString()}</div>
          </div>
        </div>

        {/* Automations Table */}
        <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2a2a2a', textAlign: 'left' }}>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Automation</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Status</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Emails</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Recipients</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {automations.map(automation => (
                <tr 
                  key={automation.id} 
                  style={{ 
                    borderBottom: '1px solid #2a2a2a',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: 16 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {automation.settings?.title || 'Untitled Automation'}
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>{automation.id}</div>
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 4,
                      fontSize: 12,
                      background: statusColors[automation.status] || '#757575',
                      color: 'white',
                      textTransform: 'capitalize'
                    }}>
                      {automation.status}
                    </span>
                  </td>
                  <td style={{ padding: 16 }}>{(automation.emails_sent || 0).toLocaleString()}</td>
                  <td style={{ padding: 16 }}>
                    {automation.recipients?.list_name || '—'}
                  </td>
                  <td style={{ padding: 16, color: '#888' }}>
                    {new Date(automation.create_time).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {automations.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
            <p>No automations found</p>
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
