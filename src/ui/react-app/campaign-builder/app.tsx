import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [lists, setLists] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [campaignType, setCampaignType] = useState('regular');
  const [listId, setListId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [fromName, setFromName] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [listsRes, templatesRes] = await Promise.all([
        app.callTool('mailchimp_lists_list', { count: 50 }),
        app.callTool('mailchimp_templates_list', { count: 50 })
      ]);

      const listsData = JSON.parse(listsRes.content[0].text);
      const templatesData = JSON.parse(templatesRes.content[0].text);

      setLists(listsData.lists || []);
      setTemplates(templatesData.templates || []);

      if (listsData.lists?.length > 0) setListId(listsData.lists[0].id);
      if (templatesData.templates?.length > 0) setTemplateId(templatesData.templates[0].id);
    } catch (err: any) {
      console.error('Failed to load data:', err);
    }
  }

  async function createCampaign() {
    if (!listId || !subject || !fromName || !replyTo) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const result = await app.callTool('mailchimp_campaigns_create', {
        type: campaignType,
        recipients: { list_id: listId },
        settings: {
          subject_line: subject,
          preview_text: preview,
          title: title || subject,
          from_name: fromName,
          reply_to: replyTo
        }
      });

      const campaignData = JSON.parse(result.content[0].text);

      if (templateId) {
        await app.callTool('mailchimp_campaigns_set_content', {
          campaign_id: campaignData.id,
          template: { id: templateId }
        });
      }

      setMessage({ type: 'success', text: `Campaign created successfully! ID: ${campaignData.id}` });
      
      // Reset form
      setSubject('');
      setPreview('');
      setTitle('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create campaign' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#121212', minHeight: '100vh', color: '#e0e0e0', padding: 20 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 24 }}>📝 Campaign Builder</h1>

        {message && (
          <div style={{
            padding: 16,
            marginBottom: 20,
            background: message.type === 'success' ? '#1b5e20' : '#b71c1c',
            borderRadius: 8,
            border: `1px solid ${message.type === 'success' ? '#2e7d32' : '#d32f2f'}`
          }}>
            {message.text}
          </div>
        )}

        <div style={{ background: '#1e1e1e', padding: 24, borderRadius: 8, border: '1px solid #333' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Campaign Type</label>
            <select 
              value={campaignType}
              onChange={e => setCampaignType(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            >
              <option value="regular">Regular Campaign</option>
              <option value="plaintext">Plain Text</option>
              <option value="absplit">A/B Test</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Audience *</label>
            <select 
              value={listId}
              onChange={e => setListId(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            >
              {lists.map(list => (
                <option key={list.id} value={list.id}>{list.name} ({list.stats?.member_count || 0} members)</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Template</label>
            <select 
              value={templateId}
              onChange={e => setTemplateId(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            >
              <option value="">None</option>
              {templates.map(tmpl => (
                <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Campaign Title</label>
            <input 
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Internal name for this campaign"
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Subject Line *</label>
            <input 
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Email subject line"
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Preview Text</label>
            <input 
              type="text"
              value={preview}
              onChange={e => setPreview(e.target.value)}
              placeholder="Text shown in inbox preview"
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>From Name *</label>
            <input 
              type="text"
              value={fromName}
              onChange={e => setFromName(e.target.value)}
              placeholder="Your Company"
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Reply To Email *</label>
            <input 
              type="email"
              value={replyTo}
              onChange={e => setReplyTo(e.target.value)}
              placeholder="reply@example.com"
              style={{
                width: '100%',
                padding: 10,
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '1px solid #444',
                borderRadius: 4,
                fontSize: 14
              }}
            />
          </div>

          <button 
            onClick={createCampaign}
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              background: loading ? '#555' : '#1e88e5',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 16,
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
