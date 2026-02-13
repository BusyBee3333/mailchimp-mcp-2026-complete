import { MailchimpClient } from '../clients/mailchimp.js';

export function registerTemplateTools(client: MailchimpClient) {
  return {
    mailchimp_templates_list: {
      description: 'Get all templates in your Mailchimp account',
      parameters: {
        type: 'object' as const,
        properties: {
          count: { type: 'number', description: 'Number of records to return' },
          offset: { type: 'number', description: 'Number of records to skip' },
          type: { type: 'string', enum: ['user', 'base', 'gallery'], description: 'Filter by template type' },
          category: { type: 'string', description: 'Filter by category' },
          folder_id: { type: 'string', description: 'Filter by folder ID' },
          created_by: { type: 'string', description: 'Filter by creator username' },
          since_created_at: { type: 'string', description: 'Filter by creation date (ISO 8601)' },
          before_created_at: { type: 'string', description: 'Filter by creation date (ISO 8601)' },
          sort_field: { type: 'string', enum: ['date_created', 'date_edited', 'name'], description: 'Sort field' },
          sort_dir: { type: 'string', enum: ['ASC', 'DESC'], description: 'Sort direction' }
        }
      },
      execute: async (params: any) => client.getTemplates(params)
    },

    mailchimp_templates_get: {
      description: 'Get information about a specific template',
      parameters: {
        type: 'object' as const,
        properties: {
          template_id: { type: 'string', description: 'Template ID' }
        },
        required: ['template_id']
      },
      execute: async (params: any) => client.getTemplate(params.template_id)
    },

    mailchimp_templates_create: {
      description: 'Create a new template',
      parameters: {
        type: 'object' as const,
        properties: {
          name: { type: 'string', description: 'Template name' },
          folder_id: { type: 'string', description: 'Folder ID to store template in' },
          html: { type: 'string', description: 'HTML content for the template' }
        },
        required: ['name', 'html']
      },
      execute: async (params: any) => client.createTemplate(params)
    },

    mailchimp_templates_update: {
      description: 'Update a template',
      parameters: {
        type: 'object' as const,
        properties: {
          template_id: { type: 'string', description: 'Template ID' },
          name: { type: 'string', description: 'Updated template name' },
          folder_id: { type: 'string', description: 'Updated folder ID' },
          html: { type: 'string', description: 'Updated HTML content' }
        },
        required: ['template_id']
      },
      execute: async (params: any) => {
        const { template_id, ...data } = params;
        return client.updateTemplate(template_id, data);
      }
    },

    mailchimp_templates_delete: {
      description: 'Delete a template',
      parameters: {
        type: 'object' as const,
        properties: {
          template_id: { type: 'string', description: 'Template ID to delete' }
        },
        required: ['template_id']
      },
      execute: async (params: any) => client.deleteTemplate(params.template_id)
    },

    mailchimp_templates_get_default_content: {
      description: 'Get the default content for a template',
      parameters: {
        type: 'object' as const,
        properties: {
          template_id: { type: 'string', description: 'Template ID' }
        },
        required: ['template_id']
      },
      execute: async (params: any) => client.getTemplateDefaultContent(params.template_id)
    }
  };
}
