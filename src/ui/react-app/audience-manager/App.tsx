import React, { useState, useEffect } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface List {
  id: string;
  name: string;
  stats: {
    member_count: number;
    unsubscribe_count: number;
    cleaned_count: number;
    open_rate: number;
    click_rate: number;
  };
  date_created: string;
}

export default function AudienceManager() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const client = createMCPClient();

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setLoading(true);
    try {
      const result = await client.callTool('mailchimp_lists_list', { count: 100 });
      setLists(result.lists || []);
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMembers = lists.reduce((sum, list) => sum + list.stats.member_count, 0);
  const avgOpenRate = lists.length > 0
    ? lists.reduce((sum, list) => sum + list.stats.open_rate, 0) / lists.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Audience Manager
          </h1>
          <button
            onClick={loadLists}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
          >
            Refresh
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Lists</div>
            <div className="text-3xl font-bold text-green-400">{lists.length}</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Subscribers</div>
            <div className="text-3xl font-bold text-blue-400">{totalMembers.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Avg Open Rate</div>
            <div className="text-3xl font-bold text-yellow-400">{avgOpenRate.toFixed(1)}%</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Unsubscribes</div>
            <div className="text-3xl font-bold text-red-400">
              {lists.reduce((sum, l) => sum + l.stats.unsubscribe_count, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Lists Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading audiences...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-green-500 transition cursor-pointer"
                onClick={() => setSelectedList(list.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-green-400">{list.name}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(list.date_created).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Subscribers</div>
                    <div className="text-lg font-bold">{list.stats.member_count.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Unsubscribed</div>
                    <div className="text-lg font-bold text-red-400">
                      {list.stats.unsubscribe_count.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Open Rate</div>
                    <div className="text-lg font-bold text-yellow-400">{list.stats.open_rate.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-400">Click Rate</div>
                    <div className="text-lg font-bold text-blue-400">{list.stats.click_rate.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition">
                    Manage
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition">
                    Segments
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
