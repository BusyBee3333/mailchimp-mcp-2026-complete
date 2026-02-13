import { MailchimpClient } from '../clients/mailchimp.js';

export function registerSearchTools(client: MailchimpClient) {
  return {
    mailchimp_search_campaigns: {
      description: 'Search all campaigns in your account for specific query terms',
      parameters: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'Search query (searches campaign title, subject, etc.)' },
          count: { type: 'number', description: 'Number of results to return' },
          offset: { type: 'number', description: 'Number of results to skip' }
        },
        required: ['query']
      },
      execute: async (params: any) => {
        const { query, ...queryParams } = params;
        return client.searchCampaigns(query, queryParams);
      }
    },

    mailchimp_search_members: {
      description: 'Search for members across all lists or a specific list',
      parameters: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'Search query (searches email, name, merge fields)' },
          list_id: { type: 'string', description: 'Filter search to a specific list (optional)' },
          count: { type: 'number', description: 'Number of results to return' },
          offset: { type: 'number', description: 'Number of results to skip' }
        },
        required: ['query']
      },
      execute: async (params: any) => {
        const { query, ...queryParams } = params;
        return client.searchMembers(query, queryParams);
      }
    }
  };
}
