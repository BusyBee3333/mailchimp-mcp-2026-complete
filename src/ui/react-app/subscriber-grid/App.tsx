import React, { useState, useEffect } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface Member {
  id: string;
  email_address: string;
  status: string;
  merge_fields: { FNAME?: string; LNAME?: string };
  timestamp_opt?: string;
  vip: boolean;
}

export default function SubscriberGrid() {
  const [members, setMembers] = useState<Member[]>([]);
  const [listId, setListId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('subscribed');

  const client = createMCPClient();

  const loadMembers = async () => {
    if (!listId) return;
    setLoading(true);
    try {
      const result = await client.callTool('mailchimp_members_list', {
        list_id: listId,
        count: 100,
        status: statusFilter
      });
      setMembers(result.members || []);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    subscribed: 'bg-green-600',
    unsubscribed: 'bg-red-600',
    cleaned: 'bg-yellow-600',
    pending: 'bg-blue-600'
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-8">
          Subscriber Grid
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="List ID"
            value={listId}
            onChange={(e) => setListId(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="cleaned">Cleaned</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={loadMembers}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Load Subscribers
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
          <div className="text-sm text-gray-400">
            Showing {members.length} {statusFilter} subscribers
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading subscribers...</div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">VIP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Subscribed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 text-sm">{member.email_address}</td>
                    <td className="px-6 py-4 text-sm">
                      {member.merge_fields.FNAME} {member.merge_fields.LNAME}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[member.status]}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {member.vip ? '⭐' : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {member.timestamp_opt ? new Date(member.timestamp_opt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
