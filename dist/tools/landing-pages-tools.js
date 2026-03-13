export function registerLandingPageTools(client) {
    return {
        mailchimp_landing_pages_list: {
            description: 'Get all landing pages in your Mailchimp account',
            parameters: {
                type: 'object',
                properties: {
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    sort_field: { type: 'string', enum: ['created_at', 'updated_at'], description: 'Sort field' },
                    sort_dir: { type: 'string', enum: ['ASC', 'DESC'], description: 'Sort direction' }
                }
            },
            execute: async (params) => client.getLandingPages(params)
        },
        mailchimp_landing_pages_get: {
            description: 'Get information about a specific landing page',
            parameters: {
                type: 'object',
                properties: {
                    page_id: { type: 'string', description: 'Landing page ID' }
                },
                required: ['page_id']
            },
            execute: async (params) => client.getLandingPage(params.page_id)
        },
        mailchimp_landing_pages_create: {
            description: 'Create a new landing page',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Landing page name' },
                    title: { type: 'string', description: 'Page title' },
                    description: { type: 'string', description: 'Page description' },
                    template_id: { type: 'number', description: 'Template ID to use' },
                    list_id: { type: 'string', description: 'List ID to add signups to' },
                    store_id: { type: 'string', description: 'E-commerce store ID (optional)' },
                    tracking: {
                        type: 'object',
                        description: 'Tracking settings',
                        properties: {
                            google_analytics: { type: 'string', description: 'Google Analytics tracking code' },
                            clicktale: { type: 'string', description: 'ClickTale tracking code' }
                        }
                    }
                },
                required: ['name', 'template_id']
            },
            execute: async (params) => client.createLandingPage(params)
        },
        mailchimp_landing_pages_update: {
            description: 'Update a landing page',
            parameters: {
                type: 'object',
                properties: {
                    page_id: { type: 'string', description: 'Landing page ID' },
                    name: { type: 'string', description: 'Updated page name' },
                    title: { type: 'string', description: 'Updated page title' },
                    description: { type: 'string', description: 'Updated description' },
                    list_id: { type: 'string', description: 'Updated list ID' },
                    tracking: { type: 'object', description: 'Updated tracking settings' }
                },
                required: ['page_id']
            },
            execute: async (params) => {
                const { page_id, ...data } = params;
                return client.updateLandingPage(page_id, data);
            }
        },
        mailchimp_landing_pages_delete: {
            description: 'Delete a landing page',
            parameters: {
                type: 'object',
                properties: {
                    page_id: { type: 'string', description: 'Landing page ID to delete' }
                },
                required: ['page_id']
            },
            execute: async (params) => client.deleteLandingPage(params.page_id)
        },
        mailchimp_landing_pages_publish: {
            description: 'Publish a landing page',
            parameters: {
                type: 'object',
                properties: {
                    page_id: { type: 'string', description: 'Landing page ID to publish' }
                },
                required: ['page_id']
            },
            execute: async (params) => client.publishLandingPage(params.page_id)
        },
        mailchimp_landing_pages_unpublish: {
            description: 'Unpublish a landing page',
            parameters: {
                type: 'object',
                properties: {
                    page_id: { type: 'string', description: 'Landing page ID to unpublish' }
                },
                required: ['page_id']
            },
            execute: async (params) => client.unpublishLandingPage(params.page_id)
        },
        mailchimp_landing_pages_get_content: {
            description: 'Get the HTML content for a landing page',
            parameters: {
                type: 'object',
                properties: {
                    page_id: { type: 'string', description: 'Landing page ID' }
                },
                required: ['page_id']
            },
            execute: async (params) => client.getLandingPageContent(params.page_id)
        }
    };
}
//# sourceMappingURL=landing-pages-tools.js.map