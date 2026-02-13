import { MailchimpClient } from '../clients/mailchimp.js';

export function registerTagTools(client: MailchimpClient) {
  return {
    mailchimp_tags_search: {
      description: 'Search for tags on a list by name',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          name: { type: 'string', description: 'Tag name to search for (partial match)' }
        },
        required: ['list_id', 'name']
      },
      execute: async (params: any) => {
        return client.searchTags(params.list_id, params.name);
      }
    }
  };
}
