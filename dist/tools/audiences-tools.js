/**
 * Mailchimp Audiences Tools
 * Audience-level stats and growth analytics.
 * Core CRUD operations (list/get/create/update/delete) are in lists-tools.ts.
 */
export function registerAudienceTools(client) {
    return {
        mailchimp_audiences_get_stats: {
            description: 'Get detailed statistics for a specific audience/list including subscriber counts, open/click rates, and growth data',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                },
                required: ['list_id'],
            },
            execute: async (params) => {
                return client.getAudienceStats(params.list_id);
            },
        },
        mailchimp_audiences_get_growth_history: {
            description: 'Get month-by-month growth history for an audience showing subscriptions and unsubscriptions',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    count: { type: 'number', description: 'Number of months to return' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    sort_field: {
                        type: 'string',
                        enum: ['month'],
                        description: 'Field to sort by',
                    },
                    sort_dir: {
                        type: 'string',
                        enum: ['ASC', 'DESC'],
                        description: 'Sort direction',
                    },
                },
                required: ['list_id'],
            },
            execute: async (params) => {
                const { list_id, ...queryParams } = params;
                return client.getListGrowthHistory(list_id, queryParams);
            },
        },
        mailchimp_audiences_batch_subscribe: {
            description: 'Batch subscribe or update multiple members in a single API call (up to 500 members)',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    members: {
                        type: 'array',
                        description: 'Array of member objects to subscribe/update',
                        items: {
                            type: 'object',
                            properties: {
                                email_address: { type: 'string', description: 'Member email' },
                                status: {
                                    type: 'string',
                                    enum: ['subscribed', 'unsubscribed', 'cleaned', 'pending'],
                                    description: 'Subscription status',
                                },
                                merge_fields: { type: 'object', description: 'Merge field values (FNAME, LNAME, etc.)' },
                                interests: { type: 'object', description: 'Interest group preferences' },
                                language: { type: 'string', description: 'Language code (ISO 639-1)' },
                                vip: { type: 'boolean', description: 'Mark as VIP' },
                                tags: { type: 'array', items: { type: 'string' }, description: 'Tags to assign' },
                            },
                            required: ['email_address', 'status'],
                        },
                    },
                    update_existing: {
                        type: 'boolean',
                        description: 'Whether to update existing subscribers (default: false)',
                    },
                },
                required: ['list_id', 'members'],
            },
            execute: async (params) => {
                const { list_id, members, update_existing } = params;
                return client.batchSubscribe(list_id, members, update_existing);
            },
        },
        mailchimp_audiences_get_segments: {
            description: 'Get all segments for a list/audience',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    type: {
                        type: 'string',
                        enum: ['saved', 'static', 'fuzzy'],
                        description: 'Filter by segment type',
                    },
                    since_created_at: { type: 'string', description: 'Filter segments created after (ISO 8601)' },
                    before_created_at: { type: 'string', description: 'Filter segments created before (ISO 8601)' },
                    since_updated_at: { type: 'string', description: 'Filter segments updated after (ISO 8601)' },
                    before_updated_at: { type: 'string', description: 'Filter segments updated before (ISO 8601)' },
                },
                required: ['list_id'],
            },
            execute: async (params) => {
                const { list_id, ...queryParams } = params;
                return client.getSegments(list_id, queryParams);
            },
        },
        mailchimp_audiences_create_segment: {
            description: 'Create a new saved or static segment for a list',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    name: { type: 'string', description: 'Segment name' },
                    static_segment: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Email addresses for a static segment',
                    },
                    options: {
                        type: 'object',
                        description: 'Conditions for a saved segment (use instead of static_segment)',
                        properties: {
                            match: { type: 'string', enum: ['any', 'all'], description: 'Match any or all conditions' },
                            conditions: {
                                type: 'array',
                                description: 'Segmentation conditions',
                                items: { type: 'object' },
                            },
                        },
                    },
                },
                required: ['list_id', 'name'],
            },
            execute: async (params) => {
                const { list_id, ...data } = params;
                return client.createSegment(list_id, data);
            },
        },
        mailchimp_audiences_get_interest_categories: {
            description: 'Get all interest categories (groups) for a list',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    type: {
                        type: 'string',
                        enum: ['checkboxes', 'dropdown', 'radio', 'hidden'],
                        description: 'Filter by interest category type',
                    },
                },
                required: ['list_id'],
            },
            execute: async (params) => {
                const { list_id, ...queryParams } = params;
                return client.getInterestCategories(list_id, queryParams);
            },
        },
    };
}
//# sourceMappingURL=audiences-tools.js.map