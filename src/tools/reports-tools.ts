import { MailchimpClient } from '../clients/mailchimp.js';
import crypto from 'crypto';

function getSubscriberHash(email: string): string {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
}

export function registerReportTools(client: MailchimpClient) {
  return {
    mailchimp_reports_list: {
      description: 'Get campaign reports for your Mailchimp account',
      parameters: {
        type: 'object' as const,
        properties: {
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          type: { type: 'string', enum: ['regular', 'plaintext', 'absplit', 'rss', 'variate'], description: 'Filter by campaign type' },
          before_send_time: { type: 'string', description: 'Filter by send time (ISO 8601)' },
          since_send_time: { type: 'string', description: 'Filter by send time (ISO 8601)' }
        }
      },
      execute: async (params: any) => client.getReports(params)
    },

    mailchimp_reports_get: {
      description: 'Get a detailed campaign report',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.getReport(params.campaign_id)
    },

    mailchimp_reports_get_click_details: {
      description: 'Get detailed click reports for all links in a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => {
        const { campaign_id, ...queryParams } = params;
        return client.getClickReports(campaign_id, queryParams);
      }
    },

    mailchimp_reports_get_click_detail: {
      description: 'Get click details for a specific link in a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          link_id: { type: 'string', description: 'Link ID from click report' }
        },
        required: ['campaign_id', 'link_id']
      },
      execute: async (params: any) => client.getClickReport(params.campaign_id, params.link_id)
    },

    mailchimp_reports_get_open_details: {
      description: 'Get detailed open information for a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          since: { type: 'string', description: 'Filter by open time (ISO 8601)' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => {
        const { campaign_id, ...queryParams } = params;
        return client.getOpenDetails(campaign_id, queryParams);
      }
    },

    mailchimp_reports_get_domain_performance: {
      description: 'Get top-performing email domains for a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.getDomainPerformance(params.campaign_id)
    },

    mailchimp_reports_get_email_activity: {
      description: 'Get activity for a specific subscriber in a campaign',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Campaign ID' },
          email_address: { type: 'string', description: 'Subscriber email address' }
        },
        required: ['campaign_id', 'email_address']
      },
      execute: async (params: any) => {
        const hash = getSubscriberHash(params.email_address);
        return client.getEmailActivity(params.campaign_id, hash);
      }
    },

    mailchimp_reports_get_sub_reports: {
      description: 'Get sub-reports for multivariate, RSS, or A/B test campaigns',
      parameters: {
        type: 'object' as const,
        properties: {
          campaign_id: { type: 'string', description: 'Parent campaign ID' }
        },
        required: ['campaign_id']
      },
      execute: async (params: any) => client.getSubReports(params.campaign_id)
    }
  };
}
