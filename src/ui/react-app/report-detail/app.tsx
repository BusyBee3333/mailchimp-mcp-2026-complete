import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [campaignId, setCampaignId] = useState('');
  const [report, setReport] = useState<any>(null);
  const [clickDetails, setClickDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setCampaignId(id);
      loadReportDetail(id);
    }
  }, []);

  async function loadReportDetail(id: string) {
    try {
      setLoading(true);
      setError(null);

      const [reportRes, clicksRes] = await Promise.all([
        app.callTool('mailchimp_reports_get', { campaign_id: id }),
        app.callTool('mailchimp_reports_get_click_details', { campaign_id: id }).catch(() => null)
      ]);

      const reportData = JSON.parse(reportRes.content[0].text);
      setReport(reportData);

      if (clicksRes) {
        const clicksData = JSON.parse(clicksRes.content[0].text);
        setClickDetails(clicksData.urls_clicked || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load report details');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading report details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, background: '#121212', minHeight: '100vh', color: '#f44336' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => campaignId && loadReportDetail(campaignId)} style={{
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

  if (!report) {
    return (
      <div style={{ padding: 40, background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Enter a campaign ID:</p>
        <input 
          type="text" 
          value={campaignId} 
          onChange={e => setCampaignId(e.target.value)}
          placeholder="Campaign ID"
          style={{
            padding: 8,
            background: '#1e1e1e',
            color: '#e0e0e0',
            border: '1px solid #333',
            borderRadius: 4,
            marginRight: 8
          }}
        />
        <button onClick={() => loadReportDetail(campaignId)} style={{
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

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 8 }}>📊 {report.campaign_title}</h1>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
          Sent: {new Date(report.send_time).toLocaleString()}
        </div>

        {/* Primary Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Emails Sent</div>
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>{(report.emails_sent || 0).toLocaleString()}</div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Successful Deliveries</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#66bb6a' }}>
              {((report.emails_sent || 0) - (report.bounces?.hard_bounces || 0) - (report.bounces?.soft_bounces || 0)).toLocaleString()}
            </div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Open Rate</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#66bb6a' }}>
              {((report.opens?.open_rate || 0) * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {(report.opens?.unique_opens || 0).toLocaleString()} unique opens
            </div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Click Rate</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#42a5f5' }}>
              {((report.clicks?.click_rate || 0) * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {(report.clicks?.unique_clicks || 0).toLocaleString()} unique clicks
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Bounces</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ef5350' }}>
              {((report.bounces?.hard_bounces || 0) + (report.bounces?.soft_bounces || 0)).toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {report.bounces?.hard_bounces || 0} hard, {report.bounces?.soft_bounces || 0} soft
            </div>
          </div>
          <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Unsubscribes</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ff9800' }}>
              {(report.unsubscribed || 0).toLocaleString()}
            </div>
          </div>
          {report.abuse_reports !== undefined && (
            <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Abuse Reports</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#f44336' }}>
                {report.abuse_reports}
              </div>
            </div>
          )}
        </div>

        {/* Revenue (if available) */}
        {report.ecommerce && report.ecommerce.total_revenue > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>E-commerce Performance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Revenue</div>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4caf50' }}>
                  ${(report.ecommerce.total_revenue || 0).toFixed(2)}
                </div>
              </div>
              <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Total Orders</div>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#4caf50' }}>
                  {report.ecommerce.total_orders || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Links */}
        {clickDetails.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Top Clicked Links</h2>
            <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#2a2a2a', textAlign: 'left' }}>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>URL</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Total Clicks</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Unique Clicks</th>
                    <th style={{ padding: 16, borderBottom: '1px solid #333' }}>Click %</th>
                  </tr>
                </thead>
                <tbody>
                  {clickDetails.slice(0, 10).map((link, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <td style={{ padding: 16, maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#42a5f5', textDecoration: 'none' }}>
                          {link.url}
                        </a>
                      </td>
                      <td style={{ padding: 16 }}>{link.total_clicks || 0}</td>
                      <td style={{ padding: 16 }}>{link.unique_clicks || 0}</td>
                      <td style={{ padding: 16, color: '#66bb6a' }}>
                        {((link.click_percentage || 0) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <button onClick={() => loadReportDetail(campaignId)} style={{
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
