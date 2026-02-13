import { MailchimpClient } from '../clients/mailchimp.js';
import crypto from 'crypto';

// Helper to create MD5 hash of email (lowercase) for subscriber_hash
function getSubscriberHash(email: string): string {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
}

export function registerMemberTools(client: MailchimpClient) {
  return {
    mailchimp_members_list: {
      description: 'Get all members (subscribers) in a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          email_type: { type: 'string', enum: ['html', 'text'], description: 'Filter by email type preference' },
          status: { type: 'string', enum: ['subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional'], description: 'Filter by subscription status' },
          since_timestamp_opt: { type: 'string', description: 'Filter by opt-in time (ISO 8601)' },
          before_timestamp_opt: { type: 'string', description: 'Filter by opt-in time (ISO 8601)' },
          since_last_changed: { type: 'string', description: 'Filter by last changed date (ISO 8601)' },
          vip_only: { type: 'boolean', description: 'Filter to VIP members only' },
          sort_field: { type: 'string', enum: ['timestamp_opt', 'timestamp_signup', 'last_changed'], description: 'Sort field' },
          sort_dir: { type: 'string', enum: ['ASC', 'DESC'], description: 'Sort direction' }
        },
        required: ['list_id']
      },
      execute: async (params: any) => {
        const { list_id, ...queryParams } = params;
        return client.getMembers(list_id, queryParams);
      }
    },

    mailchimp_members_get: {
      description: 'Get information about a specific list member',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Member email address' }
        },
        required: ['list_id', 'email_address']
      },
      execute: async (params: any) => {
        const hash = getSubscriberHash(params.email_address);
        return client.getMember(params.list_id, hash);
      }
    },

    mailchimp_members_add: {
      description: 'Add a new member to a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Email address' },
          status: { type: 'string', enum: ['subscribed', 'unsubscribed', 'cleaned', 'pending'], description: 'Subscription status' },
          merge_fields: {
            type: 'object',
            description: 'Merge field values (e.g., {"FNAME": "John", "LNAME": "Doe"})'
          },
          interests: {
            type: 'object',
            description: 'Interest group preferences (e.g., {"interest_id": true})'
          },
          language: { type: 'string', description: 'Language preference (ISO 639-1)' },
          vip: { type: 'boolean', description: 'Mark as VIP' },
          location: {
            type: 'object',
            description: 'Location data',
            properties: {
              latitude: { type: 'number' },
              longitude: { type: 'number' }
            }
          },
          tags: {
            type: 'array',
            description: 'Tags to apply to member',
            items: { type: 'string' }
          }
        },
        required: ['list_id', 'email_address', 'status']
      },
      execute: async (params: any) => {
        const { list_id, ...data } = params;
        return client.addMember(list_id, data);
      }
    },

    mailchimp_members_update: {
      description: 'Update an existing list member',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Member email address' },
          status: { type: 'string', enum: ['subscribed', 'unsubscribed', 'cleaned', 'pending'], description: 'Updated subscription status' },
          merge_fields: { type: 'object', description: 'Updated merge field values' },
          interests: { type: 'object', description: 'Updated interest preferences' },
          language: { type: 'string', description: 'Updated language preference' },
          vip: { type: 'boolean', description: 'VIP status' }
        },
        required: ['list_id', 'email_address']
      },
      execute: async (params: any) => {
        const { list_id, email_address, ...data } = params;
        const hash = getSubscriberHash(email_address);
        return client.updateMember(list_id, hash, data);
      }
    },

    mailchimp_members_add_or_update: {
      description: 'Add a new member or update existing member (upsert)',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Email address' },
          status_if_new: { type: 'string', enum: ['subscribed', 'unsubscribed', 'cleaned', 'pending'], description: 'Status for new members' },
          merge_fields: { type: 'object', description: 'Merge field values' },
          interests: { type: 'object', description: 'Interest preferences' },
          language: { type: 'string', description: 'Language preference' },
          vip: { type: 'boolean', description: 'VIP status' }
        },
        required: ['list_id', 'email_address', 'status_if_new']
      },
      execute: async (params: any) => {
        const { list_id, email_address, ...data } = params;
        const hash = getSubscriberHash(email_address);
        return client.addOrUpdateMember(list_id, hash, data);
      }
    },

    mailchimp_members_delete: {
      description: 'Delete (unsubscribe and archive) a member from a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Email address to delete' }
        },
        required: ['list_id', 'email_address']
      },
      execute: async (params: any) => {
        const hash = getSubscriberHash(params.email_address);
        return client.deleteMember(params.list_id, hash);
      }
    },

    mailchimp_members_archive: {
      description: 'Permanently delete (archive) a member from a list',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Email address to archive' }
        },
        required: ['list_id', 'email_address']
      },
      execute: async (params: any) => {
        const hash = getSubscriberHash(params.email_address);
        return client.archiveMember(params.list_id, hash);
      }
    },

    mailchimp_members_get_activity: {
      description: 'Get recent activity for a specific list member',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Member email address' },
          count: { type: 'number', description: 'Number of activity records to return' },
          offset: { type: 'number', description: 'Number of records to skip' }
        },
        required: ['list_id', 'email_address']
      },
      execute: async (params: any) => {
        const { list_id, email_address, ...queryParams } = params;
        const hash = getSubscriberHash(email_address);
        return client.getMemberActivity(list_id, hash, queryParams);
      }
    },

    mailchimp_members_get_goals: {
      description: 'Get recent goal events for a specific list member',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Member email address' }
        },
        required: ['list_id', 'email_address']
      },
      execute: async (params: any) => {
        const hash = getSubscriberHash(params.email_address);
        return client.getMemberGoals(params.list_id, hash);
      }
    },

    mailchimp_members_get_tags: {
      description: 'Get all tags assigned to a member',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Member email address' }
        },
        required: ['list_id', 'email_address']
      },
      execute: async (params: any) => {
        const hash = getSubscriberHash(params.email_address);
        return client.getMemberTags(params.list_id, hash);
      }
    },

    mailchimp_members_add_tags: {
      description: 'Add or remove tags for a member',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          email_address: { type: 'string', description: 'Member email address' },
          tags: {
            type: 'array',
            description: 'Tags to add or remove',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Tag name' },
                status: { type: 'string', enum: ['active', 'inactive'], description: 'active=add tag, inactive=remove tag' }
              }
            }
          }
        },
        required: ['list_id', 'email_address', 'tags']
      },
      execute: async (params: any) => {
        const { list_id, email_address, tags } = params;
        const hash = getSubscriberHash(email_address);
        return client.addMemberTags(list_id, hash, tags);
      }
    },

    mailchimp_members_batch_add_remove: {
      description: 'Batch add or remove members from a segment',
      parameters: {
        type: 'object' as const,
        properties: {
          list_id: { type: 'string', description: 'List ID' },
          segment_id: { type: 'string', description: 'Static segment ID' },
          members_to_add: {
            type: 'array',
            description: 'Email addresses to add to segment',
            items: { type: 'string' }
          },
          members_to_remove: {
            type: 'array',
            description: 'Email addresses to remove from segment',
            items: { type: 'string' }
          }
        },
        required: ['list_id', 'segment_id']
      },
      execute: async (params: any) => {
        const { list_id, segment_id, members_to_add, members_to_remove } = params;
        if (members_to_add && members_to_add.length > 0) {
          return client.batchAddSegmentMembers(list_id, segment_id, members_to_add);
        } else if (members_to_remove && members_to_remove.length > 0) {
          return client.batchRemoveSegmentMembers(list_id, segment_id, members_to_remove);
        }
        throw new Error('Must provide either members_to_add or members_to_remove');
      }
    }
  };
}
