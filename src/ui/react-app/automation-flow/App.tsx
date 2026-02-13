import React, { useState, useEffect } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface Automation {
  id: string;
  settings: { title: string };
  status: string;
  emails_sent: number;
  create_time: string;
}

export default function AutomationFlow() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const client = createMCPClient();

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    setLoading(true);
    try {
      const result = await client.callTool('mailchimp_automations_list', { count: 100 });
      setAutomations(result.automations || []);
    } catch (error) {
      console.error('Failed to load automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    save: 'bg-gray-600',
    paused: 'bg-yellow-600',
    sending: 'bg-green-600'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-8">
          Automation Flow
        </h1>
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-4">
            {automations.map((auto) => (
              <div key={auto.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{auto.settings.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[auto.status]}`}>
                    {auto.status}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Emails sent: {auto.emails_sent.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
