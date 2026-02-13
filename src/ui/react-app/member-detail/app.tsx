import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [listId, setListId] = useState('');
  const [email, setEmail] = useState('');
  const [member, setMember] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lid = urlParams.get('list_id');
    const em = urlParams.get('email');
    if (lid && em) {
      setListId(lid);
      setEmail(em);
      loadMemberDetail(lid, em);
    }
  }, []);

  async function loadMemberDetail(lid: string, em: string) {
    try {
      setLoading(true);
      setError(null);

      const [memberRes, activityRes, tagsRes] = await Promise.all([
        app.callTool('mailchimp_members_get', { list_id: lid, subscriber_hash: em }),
        app.callTool('mailchimp_members_get_activity', { list_id: lid, subscriber_hash: em }).catch(() => null),
        app.callTool('mailchimp_members_get_tags', { list_id: lid, subscriber_hash: em }).catch(() => null)
      ]);

      const memberData = JSON.parse(memberRes.content[0].text);
      setMember(memberData);

      if (activityRes) {
        const activityData = JSON.parse(activityRes.content[0].text);
        setActivity(activityData.activity || []);
      }

      if (tagsRes) {
        const tagsData = JSON.parse(tagsRes.content[0].text);
        setTags(tagsData.tags || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load member details');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading member details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, background: '#121212', minHeight: '100vh', color: '#f44336' }}>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div style={{ padding: 40, background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Enter member details:</p>
        <div style={{ marginTop: 16 }}>
          <input 
            type="text" 
            value={listId}
            onChange={e => setListId(e.target.value)}
            placeholder="List ID"
            style={{
              padding: 8,
              background: '#1e1e1e',
              color: '#e0e0e0',
              border: '1px solid #333',
              borderRadius: 4,
              marginRight: 8,
              marginBottom: 8
            }}
          />
          <input 
            type="text" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email or Subscriber Hash"
            style={{
              padding: 8,
              background: '#1e1e1e',
              color: '#e0e0e0',
              border: '1px solid #333',
              borderRadius: 4,
              marginRight: 8,
              marginBottom: 8
            }}
          />
          <button onClick={() => loadMemberDetail(listId, email)} style={{
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
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    subscribed: '#66bb6a',
    unsubscribed: '#ef5350',
    cleaned: '#757575',
    pending: '#ffa726'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ marginBottom: 8 }}>{member.full_name || 'Member Profile'}</h1>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 12 }}>{member.email_address}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              padding: '6px 12px',
              borderRadius: 4,
              fontSize: 14,
              background: statusColors[member.status] || '#757575',
              color: 'white',
              textTransform: 'capitalize'
            }}>
              {member.status}
            </span>
            {member.vip && (
              <span style={{
                padding: '6px 12px',
                borderRadius: 4,
                fontSize: 14,
                background: '#ffd700',
                color: '#000'
              }}>
                ⭐ VIP
              </span>
            )}
            <span style={{ color: '#888' }}>Rating: {'⭐'.repeat(member.member_rating || 0)}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Campaigns Sent</div>
            <div style={{ fontSize: 28, fontWeight: 'bold' }}>{member.stats?.avg_open_rate ? '—' : '0'}</div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Avg Open Rate</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#66bb6a' }}>
              {member.stats?.avg_open_rate ? `${(member.stats.avg_open_rate * 100).toFixed(1)}%` : '—'}
            </div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Avg Click Rate</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#42a5f5' }}>
              {member.stats?.avg_click_rate ? `${(member.stats.avg_click_rate * 100).toFixed(1)}%` : '—'}
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Tags</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tags.map((tag, idx) => (
                <span key={idx} style={{
                  padding: '6px 12px',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: 4,
                  fontSize: 14
                }}>
                  🏷️ {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        {activity.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Activity Timeline</h2>
            <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', padding: 20 }}>
              {activity.slice(0, 20).map((event, idx) => (
                <div key={idx} style={{ 
                  borderLeft: '2px solid #1e88e5', 
                  paddingLeft: 16, 
                  marginBottom: 16,
                  paddingBottom: idx === Math.min(19, activity.length - 1) ? 0 : 16
                }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4, textTransform: 'capitalize' }}>
                    {event.action?.replace('_', ' ')}
                  </div>
                  {event.title && <div style={{ fontSize: 13, marginBottom: 2 }}>{event.title}</div>}
                  <div style={{ fontSize: 12, color: '#888' }}>{new Date(event.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button onClick={() => loadMemberDetail(listId, email)} style={{
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
