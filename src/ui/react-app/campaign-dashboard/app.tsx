import React, { useState, useEffect } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface Campaign {
  id: string;
  settings: {
    subject_line: string;
    title: string;
    from_name: string;
  };
  status: string;
  type: string;
  send_time?: string;
  emails_sent?: number;
}

export default function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const client = createMCPClient();

  useEffect(() => {
    loadCampaigns();
  }, [filter]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const params: any = { count: 50, sort_field: 'create_time', sort_dir: 'DESC' };
      if (filter !== 'all') {
        params.status = filter;
      }
      const result = await client.callTool('mailchimp_campaigns_list', params);
      setCampaigns(result.campaigns || []);
    } catch (error: any) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;
    try {
      await client.callTool('mailchimp_campaigns_send', { campaign_id: campaignId });
      loadCampaigns();
    } catch (error: any) {
      alert('Failed to send campaign: ' + error.message);
    }
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.settings.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.settings.subject_line.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    save: 'bg-gray-600',
    paused: 'bg-yellow-600',
    schedule: 'bg-blue-600',
    sending: 'bg-green-600',
    sent: 'bg-green-800'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Campaign Dashboard
          </h1>
          <button
            onClick={loadCampaigns}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Campaigns</option>
            <option value="save">Draft</option>
            <option value="paused">Paused</option>
            <option value="schedule">Scheduled</option>
            <option value="sending">Sending</option>
            <option value="sent">Sent</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Total Campaigns</div>
            <div className="text-3xl font-bold text-blue-400">{campaigns.length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Sent</div>
            <div className="text-3xl font-bold text-green-400">
              {campaigns.filter(c => c.status === 'sent').length}
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Scheduled</div>
            <div className="text-3xl font-bold text-yellow-400">
              {campaigns.filter(c => c.status === 'schedule').length}
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Drafts</div>
            <div className="text-3xl font-bold text-gray-400">
              {campaigns.filter(c => c.status === 'save').length}
            </div>
          </div>
        </div>

        {/* Campaign List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading campaigns...</div>
        ) : (
          <div className="space-y-3">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{campaign.settings.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs text-white ${statusColors[campaign.status]}`}>
                        {campaign.status}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                        {campaign.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">
                      <strong>Subject:</strong> {campaign.settings.subject_line}
                    </p>
                    <p className="text-gray-500 text-xs">
                      From: {campaign.settings.from_name}
                      {campaign.send_time && ` • Sent: ${new Date(campaign.send_time).toLocaleString()}`}
                      {campaign.emails_sent && ` • Recipients: ${campaign.emails_sent.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === 'save' && (
                      <button
                        onClick={() => sendCampaign(campaign.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition"
                      >
                        Send
                      </button>
                    )}
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
