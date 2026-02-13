import React, { useState } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface GrowthData {
  month: string;
  existing: number;
  imports: number;
  optins: number;
  optouts: number;
  cleaned: number;
}

export default function GrowthChart() {
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [listId, setListId] = useState('');
  const [loading, setLoading] = useState(false);
  const client = createMCPClient();

  const loadGrowthHistory = async () => {
    if (!listId) return;
    setLoading(true);
    try {
      const result = await client.callTool('mailchimp_lists_get_growth_history', {
        list_id: listId,
        count: 12,
        sort_dir: 'DESC'
      });
      setGrowthData(result.history || []);
    } catch (error) {
      console.error('Failed to load growth history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-8">
          Growth Chart
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="List ID"
            value={listId}
            onChange={(e) => setListId(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <button
            onClick={loadGrowthHistory}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition"
          >
            Load Growth Data
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading growth history...</div>
        ) : growthData.length > 0 ? (
          <div className="space-y-3">
            {growthData.map((month) => (
              <div
                key={month.month}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5"
              >
                <h3 className="text-lg font-semibold mb-4">{month.month}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Existing</div>
                    <div className="text-xl font-bold text-blue-400">{month.existing.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Imports</div>
                    <div className="text-xl font-bold text-green-400">+{month.imports.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Opt-ins</div>
                    <div className="text-xl font-bold text-teal-400">+{month.optins.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Opt-outs</div>
                    <div className="text-xl font-bold text-red-400">-{month.optouts.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Cleaned</div>
                    <div className="text-xl font-bold text-yellow-400">-{month.cleaned.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Enter a list ID to view growth history</div>
        )}
      </div>
    </div>
  );
}
