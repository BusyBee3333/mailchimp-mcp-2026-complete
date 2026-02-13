import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface CampaignDetail {
  id: string;
  title: string;
  status: string;
  type: string;
  send_time?: string;
  emails_sent: number;
  settings?: any;
  report?: {
    opens: { opens_total: number; unique_opens: number; open_rate: number; };
    clicks: { clicks_total: number; unique_clicks: number; click_rate: number; };
    bounces?: { hard_bounces: number; soft_bounces: number; };
    unsubscribed?: number;
  };
  timeline?: Array<{ timestamp: string; action: string; title: string; }>;
}

function App() {
  const app = useApp();
  const [campaignId, setCampaignId] = useState<string>('');
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setCampaignId(id);
      loadCampaignDetail(id);
    }
  }, []);

  async function loadCampaignDetail(id: string) {
    try {
      setLoading(true);
      setError(null);

      const [campaignRes, reportRes] = await Promise.all([
        app.callTool('mailchimp_campaigns_get', { campaign_id: id }),
        app.callTool('mailchimp_reports_get', { campaign_id: id }).catch(() => null)
      ]);

      const campaignData = JSON.parse(campaignRes.content[0].text);
      const reportData = reportRes ? JSON.parse(reportRes.content[0].text) : null;

      setCampaign({
        id: campaignData.id,
        title: campaignData.settings?.title || campaignData.settings?.subject_line || 'Untitled',
        status: campaignData.status,
        type: campaignData.type,
        send_time: campaignData.send_time,
        emails_sent: campaignData.emails_sent || 0,
        settings: campaignData.settings,
        report: reportData ? {
          opens: reportData.opens || {},
          clicks: reportData.clicks || {},
          bounces: reportData.bounces,
          unsubscribed: reportData.unsubscribed
        } : undefined,
        timeline: reportData?.timeseries || []
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', background: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <p>Loading campaign details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, background: '#121212', minHeight: '100vh', color: '#f44336' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => campaignId && loadCampaignDetail(campaignId)} style={{
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

  if (!campaign) {
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
        <button onClick={() => loadCampaignDetail(campaignId)} style={{
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
        <h1 style={{ marginBottom: 8 }}>📧 {campaign.title}</h1>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: 4,
            fontSize: 14,
            background: campaign.status === 'sent' ? '#2e7d32' : '#424242',
            color: 'white'
          }}>
            {campaign.status}
          </span>
          <span style={{ color: '#888' }}>Type: {campaign.type}</span>
          {campaign.send_time && (
            <span style={{ color: '#888' }}>Sent: {new Date(campaign.send_time).toLocaleString()}</span>
          )}
        </div>

        {/* Performance Cards */}
        {campaign.report && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Emails Sent</div>
              <div style={{ fontSize: 32, fontWeight: 'bold' }}>{campaign.emails_sent.toLocaleString()}</div>
            </div>
            <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Open Rate</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#66bb6a' }}>
                {(campaign.report.opens.open_rate * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                {campaign.report.opens.unique_opens.toLocaleString()} opens
              </div>
            </div>
            <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Click Rate</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#42a5f5' }}>
                {(campaign.report.clicks.click_rate * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                {campaign.report.clicks.unique_clicks.toLocaleString()} clicks
              </div>
            </div>
            {campaign.report.bounces && (
              <div style={{ padding: 20, background: '#1e1e1e', borderRadius: 8, border: '1px solid #333' }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Bounces</div>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ef5350' }}>
                  {(campaign.report.bounces.hard_bounces + campaign.report.bounces.soft_bounces).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  {campaign.report.bounces.hard_bounces} hard, {campaign.report.bounces.soft_bounces} soft
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {campaign.timeline && campaign.timeline.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Activity Timeline</h2>
            <div style={{ background: '#1e1e1e', borderRadius: 8, border: '1px solid #333', padding: 20 }}>
              {campaign.timeline.map((event, idx) => (
                <div key={idx} style={{ 
                  borderLeft: '2px solid #1e88e5', 
                  paddingLeft: 16, 
                  marginBottom: 16,
                  paddingBottom: idx === campaign.timeline!.length - 1 ? 0 : 16
                }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{event.title || event.action}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{new Date(event.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button onClick={() => loadCampaignDetail(campaignId)} style={{
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
