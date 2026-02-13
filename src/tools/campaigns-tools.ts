import { MailchimpClient } from '../clients/mailchimp.js';

export function registerCampaignTools(client: MailchimpClient) {
  return {
    mailchimp_campaigns_list: {
      description: 'List all campaigns in your Mailchimp account with optional filters',
      parameters: {
        type: 'object' as const,
        properties: {
          count: { type: 'number', description: 'Number of records to return (max 1000)' },
          offset: { type: 'number', description: 'Number of records to skip' },
          type: { type: 'string', enum: ['regular', 'plaintext', 'absplit', 'rss', 'variate'], description: 'Campaign type filter' },
          status: { type: 'string', enum: ['save', 'paused', 'schedule', 'sending', 'sent'], description: 'Campaign status filter' },
          list_id: { type: 'string', description: 'Filter by list/audience ID' },
          folder_id: { type: 'string', description: 'Filter by folder ID' },
          sort_field: { type: 'string', enum: ['create_time', 'send_time'], description: 'Field to sort by' },
          sort_dir: { type: 'string', enum: ['ASC', 'DESC'], description: 'Sort direction' }
        }
      },
      execute: async (params: any) => client.getCampaigns(params)
    },

    mailchimp_campaigns_get: {
      description: 'Get details for a specific campaign by ID',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.getCampaign(params.campaign_id)
    },

    mailchimp_campaigns_create: {
      description: 'Create a new campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          type: { type: 'string', enum: ['regular', 'plaintext', 'absplit', 'rss', 'variate'], description: 'Campaign type' },
          recipients: {
            type: 'object',
            description: 'Campaign recipients settings',
            properties: {
              list_id: { type: 'string', description: 'List/audience ID' },
              segment_opts: { type: 'object', description: 'Segment options for targeting' }
            },
            required: ['list_id']
          },
          settings: {
            type: 'object',
            description: 'Campaign settings',
            properties: {
              subject_line: { type: 'string', description: 'Email subject line' },
              preview_text: { type: 'string', description: 'Preview text' },
              title: { type: 'string', description: 'Internal campaign title' },
              from_name: { type: 'string', description: 'From name' },
              reply_to: { type: 'string', description: 'Reply-to email address' }
            },
            required: ['subject_line', 'from_name', 'reply_to']
          }
        },
        required: ['type', 'recipients', 'settings']
      },
      execute: async (params: any) => client.createCampaign(params)
    },

    mailchimp_campaigns_update: {
      description: 'Update a campaign\'s settings',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          recipients: { type: 'object', description: 'Updated recipient settings' },
          settings: { type: 'object', description: 'Updated campaign settings' },
          tracking: { type: 'object', description: 'Updated tracking settings' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => {
        const { campaign_id, ...data } = params;
        return client.updateCampaign(campaign_id, data);
      }
    },

    mailchimp_campaigns_delete: {
      description: 'Permanently delete a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID to delete' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.deleteCampaign(params.campaign_id)
    },

    mailchimp_campaigns_send: {
      description: 'Send a campaign immediately',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID to send' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.sendCampaign(params.campaign_id)
    },

    mailchimp_campaigns_schedule: {
      description: 'Schedule a campaign to be sent at a specific time',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          schedule_time: { type: 'string', description: 'ISO 8601 datetime to send (e.g., 2024-12-31T10:00:00Z)' },
          timewarp: { type: 'boolean', description: 'Enable Timewarp (send at local recipient time)' },
          batch_delivery: {
            type: 'object',
            description: 'Batch delivery settings',
            properties: {
              batch_delay: { type: 'number', description: 'Minutes between batches' },
              batch_count: { type: 'number', description: 'Number of batches' }
            }
          }
        },
        required: ['campaign_id', 'schedule_time']
      },
      execute: async (params: any) => {
        const { campaign_id, schedule_time, timewarp, batch_delivery } = params;
        return client.scheduleCampaign(campaign_id, schedule_time, timewarp, batch_delivery);
      }
    },

    mailchimp_campaigns_unschedule: {
      description: 'Unschedule a scheduled campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.unscheduleCampaign(params.campaign_id)
    },

    mailchimp_campaigns_pause: {
      description: 'Pause an RSS campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'RSS campaign ID to pause' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.pauseCampaign(params.campaign_id)
    },

    mailchimp_campaigns_resume: {
      description: 'Resume a paused RSS campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'RSS campaign ID to resume' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.resumeCampaign(params.campaign_id)
    },

    mailchimp_campaigns_replicate: {
      description: 'Replicate (duplicate) a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID to replicate' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.replicateCampaign(params.campaign_id)
    },

    mailchimp_campaigns_test: {
      description: 'Send a test email for a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          test_emails: {
            type: 'array',
            description: 'Array of email addresses to send test to (max 5)',
            items: { type: 'string' }
          },
          send_type: {
            type: 'string',
            enum: ['html', 'plaintext'],
            description: 'Type of test email to send'
          }
        },
        required: ['campaign_id', 'test_emails', 'send_type']
      },
      execute: async (params: any) => {
        const { campaign_id, test_emails, send_type } = params;
        return client.testCampaign(campaign_id, test_emails, send_type);
      }
    },

    mailchimp_campaigns_get_content: {
      description: 'Get the HTML and plain-text content for a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.getCampaignContent(params.campaign_id)
    },

    mailchimp_campaigns_set_content: {
      description: 'Set the content for a campaign (HTML, plain text, template, or URL)',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          plain_text: { type: 'string', description: 'Plain text content' },
          html: { type: 'string', description: 'HTML content' },
          url: { type: 'string', description: 'URL to import content from' },
          template: {
            type: 'object',
            description: 'Template-based content',
            properties: {
              id: { type: 'number', description: 'Template ID' },
              sections: { type: 'object', description: 'Template sections to populate' }
            }
          }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => {
        const { campaign_id, ...content } = params;
        return client.setCampaignContent(campaign_id, content);
      }
    },

    mailchimp_campaigns_get_send_checklist: {
      description: 'Review pre-send checklist for a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.getSendChecklist(params.campaign_id)
    }
  };
}
