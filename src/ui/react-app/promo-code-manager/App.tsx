import React, { useState } from 'react';
import { createMCPClient } from '@modelcontextprotocol/ext-apps';

export default function App() {
  const [data, setData] = useState<any>(null);
  const client = createMCPClient();
  const appName = window.location.pathname.split('/').pop() || 'App';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-8">
          {appName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h1>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    </div>
  );
}
