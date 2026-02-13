import { MailchimpClient } from '../clients/mailchimp.js';

export function registerListTools(client: MailchimpClient) {
  return {
    mailchimp_lists_list: {
      description: 'Get all lists/audiences in your Mailchimp account',
      parameters: {
        type: 'object' as const,
        properties: {
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          before_date_created: { type: 'string', description: 'Return lists created before this date (ISO 8601)' },
          since_date_created: { type: 'string', description: 'Return lists created after this date (ISO 8601)' },
          email: { type: 'string', description: 'Filter by subscriber email' },
          sort_field: { type: 'string', enum: ['date_created'], description: 'Sort field' },
          sort_dir: { type: 'string', enum: ['ASC', 'DESC'], description: 'Sort direction' }
        }
      },
      execute: async (params: any) => client.getLists(params)
    },

    mailchimp_lists_get: {
      description: 'Get details for a specific list/audience',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' }
        },
        required: ['list_id']
      },
      execute: async (params: any) => client.getList(params.list_id)
    },

    mailchimp_lists_create: {
      description: 'Create a new audience/list',
      parameters: {
        type: 'object' as const,
        properties: {
          name: { type: 'string', description: 'List name' },
          contact: {
            type: 'object',
            description: 'Contact information for the list',
            properties: {
              company: { type: 'string', description: 'Company name' },
              address1: { type: 'string', description: 'Street address' },
              city: { type: 'string', description: 'City' },
              state: { type: 'string', description: 'State/province' },
              zip: { type: 'string', description: 'Postal code' },
              country: { type: 'string', description: 'Two-letter country code' },
              phone: { type: 'string', description: 'Phone number' }
            },
            required: ['company', 'address1', 'city', 'state', 'zip', 'country']
          },
          permission_reminder: { type: 'string', description: 'Permission reminder text' },
          campaign_defaults: {
            type: 'object',
            description: 'Default campaign settings',
            properties: {
              from_name: { type: 'string', description: 'Default from name' },
              from_email: { type: 'string', description: 'Default from email' },
              subject: { type: 'string', description: 'Default subject' },
              language: { type: 'string', description: 'Default language (ISO 639-1)' }
            },
            required: ['from_name', 'from_email', 'subject', 'language']
          },
          email_type_option: { type: 'boolean', description: 'Whether to ask subscribers for email type preference' },
          double_optin: { type: 'boolean', description: 'Enable double opt-in' },
          marketing_permissions: { type: 'boolean', description: 'Enable marketing permissions (GDPR)' }
        },
        required: ['name', 'contact', 'permission_reminder', 'campaign_defaults', 'email_type_option']
      },
      execute: async (params: any) => client.createList(params)
    },

    mailchimp_lists_update: {
      description: 'Update list settings',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          name: { type: 'string', description: 'Updated list name' },
          contact: { type: 'object', description: 'Updated contact information' },
          permission_reminder: { type: 'string', description: 'Updated permission reminder' },
          campaign_defaults: { type: 'object', description: 'Updated campaign defaults' },
          email_type_option: { type: 'boolean', description: 'Email type option' }
        },
        required: ['list_id']
      },
      execute: async (params: any) => {
        const { list_id, ...data } = params;
        return client.updateList(list_id, data);
      }
    },

    mailchimp_lists_delete: {
      description: 'Permanently delete a list and all its members',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID to delete' }
        },
        required: ['list_id']
      },
      execute: async (params: any) => client.deleteList(params.list_id)
    },

    mailchimp_lists_get_growth_history: {
      description: 'Get month-by-month growth statistics for a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          count: { type: 'number', description: 'Number of months to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          sort_field: { type: 'string', enum: ['month'], description: 'Sort field' },
          sort_dir: { type: 'string', enum: ['ASC', 'DESC'], description: 'Sort direction' }
        },
        required: ['list_id']
      },
      execute: async (params: any) => {
        const { list_id, ...queryParams } = params;
        return client.getListGrowthHistory(list_id, queryParams);
      }
    },

    mailchimp_lists_batch_subscribe: {
      description: 'Batch add or update multiple list members at once',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          members: {
            type: 'array',
            description: 'Array of member objects to add/update',
            items: {
              type: 'object',
              properties: {
                email_address: { type: 'string', description: 'Email address' },
                status: { type: 'string', enum: ['subscribed', 'unsubscribed', 'cleaned', 'pending'], description: 'Subscription status' },
                merge_fields: { type: 'object', description: 'Merge field values (FNAME, LNAME, etc.)' },
                interests: { type: 'object', description: 'Interest group preferences' }
              }
            }
          },
          update_existing: { type: 'boolean', description: 'Update existing members or skip them' }
        },
        required: ['list_id', 'members']
      },
      execute: async (params: any) => {
        const { list_id, members, update_existing } = params;
        return client.batchSubscribe(list_id, members, update_existing);
      }
    },

    mailchimp_lists_get_interest_categories: {
      description: 'Get all interest categories (group titles) for a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          type: { type: 'string', enum: ['checkboxes', 'dropdown', 'radio', 'hidden'], description: 'Filter by category type' }
        },
        required: ['list_id']
      },
      execute: async (params: any) => {
        const { list_id, ...queryParams } = params;
        return client.getInterestCategories(list_id, queryParams);
      }
    },

    mailchimp_lists_get_interests: {
      description: 'Get all interests (group names) in a specific interest category',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          category_id: { type: 'string', description: 'Interest category ID' },
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' }
        },
        required: ['list_id', 'category_id']
      },
      execute: async (params: any) => {
        const { list_id, category_id, ...queryParams } = params;
        return client.getInterests(list_id, category_id, queryParams);
      }
    },

    mailchimp_lists_get_segments: {
      description: 'Get all segments for a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          type: { type: 'string', enum: ['saved', 'static', 'fuzzy'], description: 'Filter by segment type' },
          since_created_at: { type: 'string', description: 'Filter by creation date (ISO 8601)' },
          before_created_at: { type: 'string', description: 'Filter by creation date (ISO 8601)' }
        },
        required: ['list_id']
      },
      execute: async (params: any) => {
        const { list_id, ...queryParams } = params;
        return client.getSegments(list_id, queryParams);
      }
    },

    mailchimp_lists_get_segment: {
      description: 'Get details for a specific segment',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          segment_id: { type: 'string', description: 'Segment ID' }
        },
        required: ['list_id', 'segment_id']
      },
      execute: async (params: any) => client.getSegment(params.list_id, params.segment_id)
    },

    mailchimp_lists_create_segment: {
      description: 'Create a new segment for a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          name: { type: 'string', description: 'Segment name' },
          static_segment: {
            type: 'array',
            description: 'Array of email addresses for static segment',
            items: { type: 'string' }
          },
          options: {
            type: 'object',
            description: 'Segment conditions (for saved/fuzzy segments)',
            properties: {
              match: { type: 'string', enum: ['any', 'all'], description: 'Match any or all conditions' },
              conditions: {
                type: 'array',
                description: 'Array of segment conditions',
                items: { type: 'object' }
              }
            }
          }
        },
        required: ['list_id', 'name']
      },
      execute: async (params: any) => {
        const { list_id, ...data } = params;
        return client.createSegment(list_id, data);
      }
    },

    mailchimp_lists_update_segment: {
      description: 'Update a segment',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          segment_id: { type: 'string', description: 'Segment ID' },
          name: { type: 'string', description: 'Updated segment name' },
          options: { type: 'object', description: 'Updated segment conditions' }
        },
        required: ['list_id', 'segment_id']
      },
      execute: async (params: any) => {
        const { list_id, segment_id, ...data } = params;
        return client.updateSegment(list_id, segment_id, data);
      }
    },

    mailchimp_lists_delete_segment: {
      description: 'Delete a segment',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          segment_id: { type: 'string', description: 'Segment ID to delete' }
        },
        required: ['list_id', 'segment_id']
      },
      execute: async (params: any) => client.deleteSegment(params.list_id, params.segment_id)
    }
  };
}
