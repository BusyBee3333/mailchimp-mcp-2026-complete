import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [automationId, setAutomationId] = useState('');
  const [automation, setAutomation] = useState<any>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setAutomationId(id);
      loadAutomationDetail(id);
    }
  }, []);

  async function loadAutomationDetail(id: string) {
    try {
      setLoading(true);
      setError(null);

      const [autoRes, emailsRes] = await Promise.all([
        app.callTool('mailchimp_automations_get', { workflow_id: id }),
        app.callTool('mailchimp_automations_list_emails', { workflow_id: id }).catch(() => null)
      ]);

      const autoData = JSON.parse(autoRes.content[0].text);
      setAutomation(autoData);

      if (emailsRes) {
        const emailsData = JSON.parse(emailsRes.content[0].text);
        setEmails(emailsData.emails || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load automation details');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading automation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, background: '#121212', minHeight: '100vh', color: '#f44336' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => automationId && loadAutomationDetail(automationId)} style={{
          padding: '8px 16px',
          background: '#1e88e5',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          Retry
        </button>
      </div>
    );
  }

  if (!automation) {
    return (
      <div style={{ padding: 40, background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Enter an automation ID:</p>
        <input 
          type="text" 
          value={automationId} 
          onChange={e => setAutomationId(e.target.value)}
          placeholder="Automation/Workflow ID"
          style={{
            padding: 8,
            background: '#1e1e1e',
            color: '#e0e0e0',
            border: '1px solid #333',
            borderRadius: 4,
            marginRight: 8
          }}
        />
        <button onClick={() => loadAutomationDetail(automationId)} style={{
          padding: '8px 16px',
          background: '#1e88e5',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          Load
        </button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    save: '#757575',
    paused: '#ffa726',
    sending: '#66bb6a'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 8 }}>⚙️ {automation.settings?.title || 'Automation'}</h1>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <span style={{
            padding: '6px 12px',
            borderRadius: 4,
            fontSize: 14,
            background: statusColors[automation.status] || '#757575',
            color: 'white',
            textTransform: 'capitalize'
          }}>
            {automation.status}
          </span>
          <span style={{ color: '#888' }}>Created: {new Date(automation.create_time).toLocaleDateString()}</span>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Emails Sent</div>
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>{(automation.emails_sent || 0).toLocaleString()}</div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Recipients</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#42a5f5' }}>
              {automation.recipients?.list_name || '—'}
            </div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Workflow Steps</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ffa726' }}>{emails.length}</div>
          </div>
        </div>

        {/* Email Sequence */}
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Email Sequence</h2>
          <div style={{ position: 'relative' }}>
            {emails.length === 0 ? (
              <div style={{ 
                background: '#1e1e1e', 
                padding: 40, 
                borderRadius: 8, 
                border: '1px solid #333',
                textAlign: 'center',
                color: '#888'
              }}>
                No emails in this automation
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {emails.map((email, idx) => (
                  <div key={email.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    {/* Step Number */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#1e88e5',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>

                    {/* Email Card */}
                    <div style={{ 
                      flex: 1,
                      background: '#1e1e1e', 
                      padding: 20, 
                      borderRadius: 8, 
                      border: '1px solid #333'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                        <div>
                          <h3 style={{ fontSize: 16, marginBottom: 4, fontWeight: 'bold' }}>
                            {email.settings?.title || email.settings?.subject_line || 'Untitled Email'}
                          </h3>
                          <div style={{ fontSize: 12, color: '#888' }}>ID: {email.id}</div>
                        </div>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          background: email.status === 'sending' ? '#66bb6a' : '#757575',
                          color: 'white'
                        }}>
                          {email.status || 'draft'}
                        </span>
                      </div>

                      {email.delay && (
                        <div style={{ 
                          fontSize: 14, 
                          color: '#ffa726', 
                          marginBottom: 12,
                          padding: '8px 12px',
                          background: '#2a2a2a',
                          borderRadius: 4,
                          display: 'inline-block'
                        }}>
                          ⏱️ Delay: {email.delay.amount} {email.delay.type}
                        </div>
                      )}

                      <div style={{ fontSize: 14, color: '#ccc' }}>
                        {email.settings?.subject_line && (
                          <div><strong>Subject:</strong> {email.settings.subject_line}</div>
                        )}
                        {email.emails_sent !== undefined && (
                          <div style={{ marginTop: 8, color: '#888' }}>
                            Sent to {email.emails_sent.toLocaleString()} recipients
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <button onClick={() => loadAutomationDetail(automationId)} style={{
            padding: '10px 20px',
            background: '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14
          }}>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
