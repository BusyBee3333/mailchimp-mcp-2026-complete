import React, { useState, useEffect } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface Segment {
  id: string;
  name: string;
  type: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export default function SegmentBuilder() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [listId, setListId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');

  const client = createMCPClient();

  const loadSegments = async () => {
    if (!listId) return;
    setLoading(true);
    try {
      const result = await client.callTool('mailchimp_lists_get_segments', {
        list_id: listId,
        count: 100
      });
      setSegments(result.segments || []);
    } catch (error) {
      console.error('Failed to load segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSegment = async () => {
    if (!listId || !newSegmentName) return;
    try {
      await client.callTool('mailchimp_lists_create_segment', {
        list_id: listId,
        name: newSegmentName,
        static_segment: []
      });
      setNewSegmentName('');
      setShowCreateForm(false);
      loadSegments();
    } catch (error: any) {
      alert('Failed to create segment: ' + error.message);
    }
  };

  const typeColors: Record<string, string> = {
    saved: 'bg-blue-600',
    static: 'bg-green-600',
    fuzzy: 'bg-purple-600'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Segment Builder
          </h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            Create Segment
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Segment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Segment Name"
                value={newSegmentName}
                onChange={(e) => setNewSegmentName(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={createSegment}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List ID Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="List ID"
            value={listId}
            onChange={(e) => setListId(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            onClick={loadSegments}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Load Segments
          </button>
        </div>

        {/* Segments Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading segments...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-purple-500 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold">{segment.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${typeColors[segment.type]}`}>
                    {segment.type}
                  </span>
                </div>
                <div className="bg-gray-900 p-4 rounded mb-4">
                  <div className="text-3xl font-bold text-purple-400">
                    {segment.member_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Members</div>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  Created: {new Date(segment.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm transition">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition">
                    View
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
