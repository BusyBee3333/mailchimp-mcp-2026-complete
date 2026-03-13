export function registerAutomationTools(client) {
    return {
        mailchimp_automations_list: {
            description: 'Get all automations (classic automations/workflows) in your account',
            parameters: {
                type: 'object',
                properties: {
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    before_create_time: { type: 'string', description: 'Filter by creation time (ISO 8601)' },
                    since_create_time: { type: 'string', description: 'Filter by creation time (ISO 8601)' },
                    before_start_time: { type: 'string', description: 'Filter by start time (ISO 8601)' },
                    since_start_time: { type: 'string', description: 'Filter by start time (ISO 8601)' },
                    status: { type: 'string', enum: ['save', 'paused', 'sending'], description: 'Filter by status' }
                }
            },
            execute: async (params) => client.getAutomations(params)
        },
        mailchimp_automations_get: {
            description: 'Get information about a specific automation workflow',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID' }
                },
                required: ['workflow_id']
            },
            execute: async (params) => client.getAutomation(params.workflow_id)
        },
        mailchimp_automations_pause: {
            description: 'Pause all emails in an automation workflow',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID to pause' }
                },
                required: ['workflow_id']
            },
            execute: async (params) => client.pauseAutomation(params.workflow_id)
        },
        mailchimp_automations_start: {
            description: 'Start all emails in an automation workflow',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID to start' }
                },
                required: ['workflow_id']
            },
            execute: async (params) => client.startAutomation(params.workflow_id)
        },
        mailchimp_automations_list_emails: {
            description: 'Get all emails in an automation workflow',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID' }
                },
                required: ['workflow_id']
            },
            execute: async (params) => client.getAutomationEmails(params.workflow_id)
        },
        mailchimp_automations_get_email: {
            description: 'Get information about a specific automation email',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID' },
                    email_id: { type: 'string', description: 'Automation email ID' }
                },
                required: ['workflow_id', 'email_id']
            },
            execute: async (params) => client.getAutomationEmail(params.workflow_id, params.email_id)
        },
        mailchimp_automations_pause_email: {
            description: 'Pause a specific automation email',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID' },
                    email_id: { type: 'string', description: 'Automation email ID to pause' }
                },
                required: ['workflow_id', 'email_id']
            },
            execute: async (params) => client.pauseAutomationEmail(params.workflow_id, params.email_id)
        },
        mailchimp_automations_start_email: {
            description: 'Start a specific automation email',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID' },
                    email_id: { type: 'string', description: 'Automation email ID to start' }
                },
                required: ['workflow_id', 'email_id']
            },
            execute: async (params) => client.startAutomationEmail(params.workflow_id, params.email_id)
        },
        mailchimp_automations_list_queue: {
            description: 'Get all subscribers in the queue for an automation email',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID' },
                    email_id: { type: 'string', description: 'Automation email ID' }
                },
                required: ['workflow_id', 'email_id']
            },
            execute: async (params) => client.getAutomationQueue(params.workflow_id, params.email_id)
        },
        mailchimp_automations_add_to_queue: {
            description: 'Manually add a subscriber to an automation email queue',
            parameters: {
                type: 'object',
                properties: {
                    workflow_id: { type: 'string', description: 'Automation workflow ID' },
                    email_id: { type: 'string', description: 'Automation email ID' },
                    email_address: { type: 'string', description: 'Subscriber email address to add to queue' }
                },
                required: ['workflow_id', 'email_id', 'email_address']
            },
            execute: async (params) => {
                const { workflow_id, email_id, email_address } = params;
                return client.addToAutomationQueue(workflow_id, email_id, email_address);
            }
        }
    };
}
//# sourceMappingURL=automations-tools.js.map