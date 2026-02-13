import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [lists, setLists] = useState<any[]>([]);
  const [growthHistory, setGrowthHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const listsRes = await app.callTool('mailchimp_lists_list', { count: 50 });
      const listsData = JSON.parse(listsRes.content[0].text);
      setLists(listsData.lists || []);

      // Load growth history for first list
      if (listsData.lists?.length > 0) {
        const growthRes = await app.callTool('mailchimp_lists_get_growth_history', {
          list_id: listsData.lists[0].id,
          count: 30
        });
        const growthData = JSON.parse(growthRes.content[0].text);
        setGrowthHistory(growthData.history || []);
      }
    } catch (err: any) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading audience dashboard...</p>
      </div>
    );
  }

  const totalMembers = lists.reduce((sum, list) => sum + (list.stats?.member_count || 0), 0);
  const totalSubscribed = lists.reduce((sum, list) => sum + (list.stats?.member_count_since_send || 0), 0);
  const avgOpenRate = lists.length > 0 
    ? lists.reduce((sum, list) => sum + (list.stats?.open_rate || 0), 0) / lists.length 
    : 0;
  const avgClickRate = lists.length > 0 
    ? lists.reduce((sum, list) => sum + (list.stats?.click_rate || 0), 0) / lists.length 
    : 0;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 24 }}>👥 Audience Dashboard</h1>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Lists</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>{lists.length}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Members</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#42a5f5' }}>{totalMembers.toLocaleString()}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Avg Open Rate</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#66bb6a' }}>{(avgOpenRate * 100).toFixed(1)}%</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Avg Click Rate</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#ffa726' }}>{(avgClickRate * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Growth Chart */}
        {growthHistory.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>30-Day Growth Trend</h2>
            <div style={{ background: '#1e1e1e', padding: 24, borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 200 }}>
                {growthHistory.slice().reverse().map((day, idx) => {
                  const maxGrowth = Math.max(...growthHistory.map(d => Math.abs(d.existing || 0)));
                  const height = maxGrowth > 0 ? Math.abs(day.existing || 0) / maxGrowth * 180 : 0;
                  const isPositive = (day.existing || 0) >= 0;
                  
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div 
                        style={{ 
                          width: '100%', 
                          background: isPositive ? '#66bb6a' : '#ef5350',
                          height: height || 2,
                          borderRadius: 2,
                          transition: 'height 0.3s ease'
                        }}
                        title={`${day.month}/${day.day}: ${day.existing > 0 ? '+' : ''}${day.existing}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 12, textAlign: 'center' }}>
                Last 30 days • Green: growth, Red: loss
              </div>
            </div>
          </div>
        )}

        {/* Lists Table */}
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>All Audiences</h2>
          <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2a2a2a', textAlign: 'left' }}>
                  <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Name</th>
                  <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Members</th>
                  <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Open Rate</th>
                  <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Click Rate</th>
                  <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {lists.map(list => (
                  <tr key={list.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={{ padding: 16 }}>
                      <div style={{ fontWeight: 'bold' }}>{list.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{list.id}</div>
                    </td>
                    <td style={{ padding: 16 }}>{(list.stats?.member_count || 0).toLocaleString()}</td>
                    <td style={{ padding: 16, color: '#66bb6a' }}>
                      {((list.stats?.open_rate || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: 16, color: '#ffa726' }}>
                      {((list.stats?.click_rate || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: 16, color: '#888' }}>
                      {new Date(list.date_created).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button onClick={loadData} style={{
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
