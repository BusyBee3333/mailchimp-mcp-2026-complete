import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'campaigns' | 'members'>('campaigns');
  const [campaignResults, setCampaignResults] = useState<any[]>([]);
  const [memberResults, setMemberResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function performSearch() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      if (searchType === 'campaigns') {
        const result = await app.callTool('mailchimp_search_campaigns', { query });
        const data = JSON.parse(result.content[0].text);
        setCampaignResults(data.results || []);
        setMemberResults([]);
      } else {
        const result = await app.callTool('mailchimp_search_members', { query });
        const data = JSON.parse(result.content[0].text);
        setMemberResults(data.exact_matches?.members || data.full_search?.members || []);
        setCampaignResults([]);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setCampaignResults([]);
      setMemberResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchType]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 24 }}>🔍 Universal Search</h1>

        {/* Search Controls */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button
              onClick={() => setSearchType('campaigns')}
              style={{
                padding: '10px 20px',
                background: searchType === 'campaigns' ? '#1e88e5' : '#2a2a2a',
                color: 'white',
                border: searchType === 'campaigns' ? '2px solid #42a5f5' : '1px solid #444',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              📧 Campaigns
            </button>
            <button
              onClick={() => setSearchType('members')}
              style={{
                padding: '10px 20px',
                background: searchType === 'members' ? '#1e88e5' : '#2a2a2a',
                color: 'white',
                border: searchType === 'members' ? '2px solid #42a5f5' : '1px solid #444',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              👥 Members
            </button>
          </div>

          <input 
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${searchType}...`}
            style={{
              width: '100%',
              padding: 16,
              background: '#2a2a2a',
              color: '#e0e0e0',
              border: '1px solid #444',
              borderRadius: 8,
              fontSize: 16
            }}
          />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
            <p>Searching...</p>
          </div>
        )}

        {/* Campaign Results */}
        {!loading && campaignResults.length > 0 && (
          <div>
            <div style={{ marginBottom: 16, fontSize: 14, color: '#888' }}>
              Found {campaignResults.length} campaign{campaignResults.length !== 1 ? 's' : ''}
            </div>

            <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2a2a2a', textAlign: 'left' }}>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Campaign</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Status</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Type</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignResults.map(campaign => (
                    <tr key={campaign.campaign.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <td style={{ padding: 16 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                          {campaign.campaign.settings?.title || campaign.campaign.settings?.subject_line || 'Untitled'}
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>{campaign.campaign.id}</div>
                      </td>
                      <td style={{ padding: 16 }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          background: campaign.campaign.status === 'sent' ? '#66bb6a' : '#757575',
                          color: 'white'
                        }}>
                          {campaign.campaign.status}
                        </span>
                      </td>
                      <td style={{ padding: 16, textTransform: 'capitalize' }}>{campaign.campaign.type}</td>
                      <td style={{ padding: 16, color: '#888' }}>
                        {campaign.campaign.send_time ? new Date(campaign.campaign.send_time).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Member Results */}
        {!loading && memberResults.length > 0 && (
          <div>
            <div style={{ marginBottom: 16, fontSize: 14, color: '#888' }}>
              Found {memberResults.length} member{memberResults.length !== 1 ? 's' : ''}
            </div>

            <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2a2a2a', textAlign: 'left' }}>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Member</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Status</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Rating</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {memberResults.map(member => (
                    <tr key={member.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <td style={{ padding: 16 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                          {member.full_name || member.email_address}
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>{member.email_address}</div>
                      </td>
                      <td style={{ padding: 16 }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12,
                          background: member.status === 'subscribed' ? '#66bb6a' : '#757575',
                          color: 'white',
                          textTransform: 'capitalize'
                        }}>
                          {member.status}
                        </span>
                      </td>
                      <td style={{ padding: 16 }}>{'⭐'.repeat(member.member_rating || 0)}</td>
                      <td style={{ padding: 16, color: '#888' }}>
                        {member.timestamp_opt ? new Date(member.timestamp_opt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && query && campaignResults.length === 0 && memberResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
            <p>No results found for "{query}"</p>
          </div>
        )}

        {!loading && !query && (
          <div style={{ 
            textAlign: 'center', 
            padding: 80, 
            color: '#888',
            background: '#1e1e1e',
            borderRadius: 8,
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔍</div>
            <p style={{ fontSize: 16 }}>Search across your Mailchimp account</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>
              Find campaigns, members, and more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
