/**
 * Mailchimp Webhooks Tools
 * Manage webhooks for audience/list events
 */
export function registerWebhookTools(client) {
    return {
        mailchimp_webhooks_list: {
            description: 'Get all webhooks for a specific list/audience',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                },
                required: ['list_id'],
            },
            execute: async (params) => {
                return client.getWebhooks(params.list_id);
            },
        },
        mailchimp_webhooks_get: {
            description: 'Get details for a specific webhook',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    webhook_id: { type: 'string', description: 'Webhook ID' },
                },
                required: ['list_id', 'webhook_id'],
            },
            execute: async (params) => {
                return client.getWebhook(params.list_id, params.webhook_id);
            },
        },
        mailchimp_webhooks_create: {
            description: 'Create a new webhook for a list. Webhooks fire when subscribers are added, removed, or their info changes.',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    url: { type: 'string', description: 'Webhook URL to receive POST requests' },
                    events: {
                        type: 'object',
                        description: 'Events that will trigger the webhook',
                        properties: {
                            subscribe: { type: 'boolean', description: 'Trigger on new subscriptions' },
                            unsubscribe: { type: 'boolean', description: 'Trigger on unsubscribes' },
                            profile: { type: 'boolean', description: 'Trigger on profile updates' },
                            cleaned: { type: 'boolean', description: 'Trigger when emails are cleaned' },
                            upemail: { type: 'boolean', description: 'Trigger on email address changes' },
                            campaign: { type: 'boolean', description: 'Trigger on campaign send events' },
                        },
                    },
                    sources: {
                        type: 'object',
                        description: 'Sources that can trigger the webhook',
                        properties: {
                            user: { type: 'boolean', description: 'Trigger from user actions in Mailchimp UI' },
                            admin: { type: 'boolean', description: 'Trigger from admin actions' },
                            api: { type: 'boolean', description: 'Trigger from API calls' },
                        },
                    },
                },
                required: ['list_id', 'url'],
            },
            execute: async (params) => {
                const { list_id, ...data } = params;
                return client.createWebhook(list_id, data);
            },
        },
        mailchimp_webhooks_update: {
            description: 'Update an existing webhook',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    webhook_id: { type: 'string', description: 'Webhook ID' },
                    url: { type: 'string', description: 'Updated webhook URL' },
                    events: {
                        type: 'object',
                        description: 'Updated event triggers',
                        properties: {
                            subscribe: { type: 'boolean' },
                            unsubscribe: { type: 'boolean' },
                            profile: { type: 'boolean' },
                            cleaned: { type: 'boolean' },
                            upemail: { type: 'boolean' },
                            campaign: { type: 'boolean' },
                        },
                    },
                    sources: {
                        type: 'object',
                        description: 'Updated source triggers',
                        properties: {
                            user: { type: 'boolean' },
                            admin: { type: 'boolean' },
                            api: { type: 'boolean' },
                        },
                    },
                },
                required: ['list_id', 'webhook_id'],
            },
            execute: async (params) => {
                const { list_id, webhook_id, ...data } = params;
                return client.updateWebhook(list_id, webhook_id, data);
            },
        },
        mailchimp_webhooks_delete: {
            description: 'Delete a webhook',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    webhook_id: { type: 'string', description: 'Webhook ID to delete' },
                },
                required: ['list_id', 'webhook_id'],
            },
            execute: async (params) => {
                await client.deleteWebhook(params.list_id, params.webhook_id);
                return { deleted: true, webhook_id: params.webhook_id };
            },
        },
    };
}
//# sourceMappingURL=webhooks-tools.js.map