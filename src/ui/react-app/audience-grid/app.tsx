import React, { useState, useEffect } from 'react';

interface AudienceGridProps {
  useApp: any;
}

interface Member {
  email_address: string;
  full_name?: string;
  status: string;
  member_rating: number;
  timestamp_opt?: string;
  tags?: Array<{ name: string }>;
  vip?: boolean;
}

export default function AudienceGrid({ useApp }: AudienceGridProps) {
  const { callTool } = useApp();
  const [lists, setLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    try {
      const result = await callTool('mailchimp_lists_list', { count: 50 });
      setLists(result.lists || []);
      if (result.lists?.length > 0) {
        setSelectedListId(result.lists[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load lists');
    }
  }

  async function loadMembers() {
    if (!selectedListId) return;

    try {
      setLoading(true);
      setError(null);

      const params: any = {
        list_id: selectedListId,
        count: 100,
        sort_field: 'timestamp_opt',
        sort_dir: 'DESC'
      };

      if (filter !== 'all') {
        params.status = filter;
      }

      const result = await callTool('mailchimp_members_list', params);
      setMembers(result.members || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedListId) {
      loadMembers();
    }
  }, [selectedListId, filter]);

  const filteredMembers = members.filter(m => 
    !search || m.email_address.toLowerCase().includes(search.toLowerCase()) ||
    m.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h2>👥 Audience Members</h2>

      {/* List & Filter Controls */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select 
          value={selectedListId} 
          onChange={e => setSelectedListId(e.target.value)}
          style={{ padding: 8, minWidth: 200 }}
        >
          {lists.map(list => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>

        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="all">All Status</option>
          <option value="subscribed">Subscribed</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="cleaned">Cleaned</option>
          <option value="pending">Pending</option>
        </select>

        <input
          type="text"
          placeholder="Search email or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, flex: 1, minWidth: 200 }}
        />

        <button onClick={loadMembers} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, background: '#ffebee', color: '#c62828', borderRadius: 4, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading members...</div>
      ) : (
        <>
          <div style={{ marginBottom: 8, color: '#666', fontSize: 14 }}>
            Showing {filteredMembers.length} of {members.length} members
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: 8 }}>Email</th>
                  <th style={{ padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Status</th>
                  <th style={{ padding: 8 }}>Rating</th>
                  <th style={{ padding: 8 }}>Tags</th>
                  <th style={{ padding: 8 }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.email_address} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>
                      {member.email_address}
                      {member.vip && <span style={{ marginLeft: 4, color: '#f57c00' }}>⭐</span>}
                    </td>
                    <td style={{ padding: 8 }}>{member.full_name || '-'}</td>
                    <td style={{ padding: 8 }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        background: member.status === 'subscribed' ? '#e8f5e9' : '#f5f5f5',
                        color: member.status === 'subscribed' ? '#388e3c' : '#666'
                      }}>
                        {member.status}
                      </span>
                    </td>
                    <td style={{ padding: 8 }}>
                      {'★'.repeat(member.member_rating)}{'☆'.repeat(5 - member.member_rating)}
                    </td>
                    <td style={{ padding: 8 }}>
                      {member.tags?.slice(0, 3).map(tag => (
                        <span key={tag.name} style={{
                          display: 'inline-block',
                          padding: '2px 6px',
                          margin: '0 4px 4px 0',
                          background: '#e3f2fd',
                          borderRadius: 4,
                          fontSize: 11
                        }}>
                          {tag.name}
                        </span>
                      ))}
                      {(member.tags?.length || 0) > 3 && <span style={{ fontSize: 11, color: '#666' }}>+{(member.tags?.length || 0) - 3}</span>}
                    </td>
                    <td style={{ padding: 8 }}>
                      {member.timestamp_opt ? new Date(member.timestamp_opt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              No members found
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const textFallback = `
👥 MAILCHIMP AUDIENCE GRID

Features:
- Browse all members in a list
- Filter by subscription status
- Search by email or name
- View member ratings and tags
- VIP member indicators

Use mailchimp_lists_list and mailchimp_members_list tools to access data.
`;
