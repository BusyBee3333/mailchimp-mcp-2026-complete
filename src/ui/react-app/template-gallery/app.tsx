import React, { useState, useEffect } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

interface Template {
  id: string;
  name: string;
  type: string;
  category?: string;
  date_created: string;
  active: boolean;
  thumbnail?: string;
}

export default function TemplateGallery() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  const client = createMCPClient();

  useEffect(() => {
    loadTemplates();
  }, [typeFilter]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const params: any = { count: 100, sort_field: 'date_created', sort_dir: 'DESC' };
      if (typeFilter !== 'all') params.type = typeFilter;
      const result = await client.callTool('mailchimp_templates_list', params);
      setTemplates(result.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Template Gallery
          </h1>
          <button onClick={loadTemplates} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition">
            Refresh
          </button>
        </div>

        <div className="mb-6">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
          >
            <option value="all">All Templates</option>
            <option value="user">User Templates</option>
            <option value="base">Base Templates</option>
            <option value="gallery">Gallery Templates</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading templates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-pink-500 transition"
              >
                <div className="h-48 bg-gradient-to-br from-pink-900/20 to-purple-900/20 flex items-center justify-center">
                  <div className="text-6xl">📧</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{template.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{template.type}</span>
                    <span>{new Date(template.date_created).toLocaleDateString()}</span>
                  </div>
                  <button className="w-full px-3 py-2 bg-pink-600 hover:bg-pink-700 rounded text-sm transition">
                    Use Template
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
