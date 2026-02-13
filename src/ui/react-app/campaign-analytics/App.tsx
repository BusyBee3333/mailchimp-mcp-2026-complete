import React, { useState } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface Report {
  id: string;
  campaign_title: string;
  emails_sent: number;
  opens: { opens_total: number; unique_opens: number; open_rate: number };
  clicks: { clicks_total: number; unique_clicks: number; click_rate: number };
  bounces: { hard_bounces: number; soft_bounces: number };
  unsubscribed: number;
}

export default function CampaignAnalytics() {
  const [report, setReport] = useState<Report | null>(null);
  const [campaignId, setCampaignId] = useState('');
  const [loading, setLoading] = useState(false);
  const client = createMCPClient();

  const loadReport = async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const result = await client.callTool('mailchimp_reports_get', { campaign_id: campaignId });
      setReport(result);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-8">
          Campaign Analytics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Campaign ID"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <button
            onClick={loadReport}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
          >
            Load Report
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading analytics...</div>
        ) : report ? (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{report.campaign_title}</h2>
              <p className="text-gray-400">Campaign ID: {report.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-400 text-sm mb-1">Emails Sent</div>
                <div className="text-3xl font-bold text-blue-400">{report.emails_sent.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-400 text-sm mb-1">Open Rate</div>
                <div className="text-3xl font-bold text-green-400">{report.opens.open_rate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">{report.opens.unique_opens.toLocaleString()} unique</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-400 text-sm mb-1">Click Rate</div>
                <div className="text-3xl font-bold text-yellow-400">{report.clicks.click_rate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">{report.clicks.unique_clicks.toLocaleString()} unique</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="text-gray-400 text-sm mb-1">Unsubscribes</div>
                <div className="text-3xl font-bold text-red-400">{report.unsubscribed.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Bounce Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Hard Bounces</div>
                  <div className="text-2xl font-bold text-red-400">{report.bounces.hard_bounces.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Soft Bounces</div>
                  <div className="text-2xl font-bold text-yellow-400">{report.bounces.soft_bounces.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Enter a campaign ID to view analytics</div>
        )}
      </div>
    </div>
  );
}
