import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      const result = await app.callTool('mailchimp_reports_list', { 
        count: 50,
        sort_field: 'send_time',
        sort_dir: 'DESC'
      });
      const data = JSON.parse(result.content[0].text);
      setReports(data.reports || []);
    } catch (err: any) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading campaign reports...</p>
      </div>
    );
  }

  const totalEmails = reports.reduce((sum, r) => sum + (r.emails_sent || 0), 0);
  const avgOpenRate = reports.length > 0 
    ? reports.reduce((sum, r) => sum + (r.opens?.open_rate || 0), 0) / reports.length 
    : 0;
  const avgClickRate = reports.length > 0 
    ? reports.reduce((sum, r) => sum + (r.clicks?.click_rate || 0), 0) / reports.length 
    : 0;
  const totalRevenue = reports.reduce((sum, r) => sum + (r.ecommerce?.total_revenue || 0), 0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1>📊 Campaign Reports</h1>
          <button onClick={loadReports} style={{
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Campaigns</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>{reports.length}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Emails Sent</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#42a5f5' }}>{totalEmails.toLocaleString()}</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Avg Open Rate</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#66bb6a' }}>{(avgOpenRate * 100).toFixed(1)}%</div>
          </div>
          <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Avg Click Rate</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#ffa726' }}>{(avgClickRate * 100).toFixed(1)}%</div>
          </div>
          {totalRevenue > 0 && (
            <div style={{ padding: 24, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Revenue</div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#4caf50' }}>
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          )}
        </div>

        {/* Reports Table */}
        <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2a2a2a', textAlign: 'left' }}>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Campaign</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Sent</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Opens</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Clicks</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Bounces</th>
                <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr 
                  key={report.id} 
                  style={{ 
                    borderBottom: '1px solid #2a2a2a',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: 16 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {report.campaign_title || 'Untitled Campaign'}
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {new Date(report.send_time).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: 16 }}>{(report.emails_sent || 0).toLocaleString()}</td>
                  <td style={{ padding: 16 }}>
                    <div style={{ color: '#66bb6a', fontWeight: 'bold' }}>
                      {((report.opens?.open_rate || 0) * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {(report.opens?.unique_opens || 0).toLocaleString()} opens
                    </div>
                  </td>
                  <td style={{ padding: 16 }}>
                    <div style={{ color: '#42a5f5', fontWeight: 'bold' }}>
                      {((report.clicks?.click_rate || 0) * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {(report.clicks?.unique_clicks || 0).toLocaleString()} clicks
                    </div>
                  </td>
                  <td style={{ padding: 16 }}>
                    <div style={{ color: '#ef5350' }}>
                      {(report.bounces?.hard_bounces || 0) + (report.bounces?.soft_bounces || 0)}
                    </div>
                  </td>
                  <td style={{ padding: 16 }}>
                    {report.ecommerce?.total_revenue ? (
                      <div style={{ color: '#4caf50', fontWeight: 'bold' }}>
                        ${report.ecommerce.total_revenue.toFixed(2)}
                      </div>
                    ) : (
                      <span style={{ color: '#666' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reports.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
            <p>No campaign reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
