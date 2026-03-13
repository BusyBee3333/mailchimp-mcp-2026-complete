/**
 * Mailchimp Merge Fields Tools
 * Manage merge fields (custom fields) for audience lists
 */
export function registerMergeFieldTools(client) {
    return {
        mailchimp_merge_fields_list: {
            description: 'Get all merge fields (custom fields) for a list/audience',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    count: { type: 'number', description: 'Number of records to return (default 10)' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    type: {
                        type: 'string',
                        description: 'Filter by merge field type',
                        enum: ['text', 'number', 'address', 'phone', 'date', 'url', 'imageurl', 'radio', 'dropdown', 'birthday', 'zip'],
                    },
                    required: { type: 'boolean', description: 'Filter by required status' },
                },
                required: ['list_id'],
            },
            execute: async (params) => {
                const { list_id, ...queryParams } = params;
                return client.getMergeFields(list_id, queryParams);
            },
        },
        mailchimp_merge_fields_get: {
            description: 'Get a specific merge field by ID',
            annotations: { readOnlyHint: true },
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    merge_id: { type: 'number', description: 'Merge field ID (numeric)' },
                },
                required: ['list_id', 'merge_id'],
            },
            execute: async (params) => {
                return client.getMergeField(params.list_id, params.merge_id);
            },
        },
        mailchimp_merge_fields_create: {
            description: 'Create a new merge field (custom field) for a list',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    tag: {
                        type: 'string',
                        description: 'Merge tag in uppercase (e.g., FNAME, LNAME, PHONE). Must be unique per list.',
                    },
                    name: { type: 'string', description: 'Display name for the field' },
                    type: {
                        type: 'string',
                        description: 'Field type',
                        enum: ['text', 'number', 'address', 'phone', 'date', 'url', 'imageurl', 'radio', 'dropdown', 'birthday', 'zip'],
                    },
                    required: { type: 'boolean', description: 'Whether the field is required' },
                    default_value: { type: 'string', description: 'Default value if left blank' },
                    public: { type: 'boolean', description: 'Whether the field is visible on the signup form' },
                    display_order: { type: 'number', description: 'Order in which to display field on forms' },
                    options: {
                        type: 'object',
                        description: 'Field-type-specific options',
                        properties: {
                            default_country: { type: 'number', description: 'Default country code for address/phone' },
                            phone_format: { type: 'string', description: 'Phone format: US or International' },
                            date_format: { type: 'string', description: 'Date format: MM/DD or DD/MM' },
                            choices: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Choices for radio/dropdown fields',
                            },
                            size: { type: 'number', description: 'Max text field size' },
                        },
                    },
                    help_text: { type: 'string', description: 'Descriptive text shown on signup forms' },
                },
                required: ['list_id', 'tag', 'name', 'type'],
            },
            execute: async (params) => {
                const { list_id, ...data } = params;
                return client.createMergeField(list_id, data);
            },
        },
        mailchimp_merge_fields_update: {
            description: 'Update an existing merge field',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    merge_id: { type: 'number', description: 'Merge field ID' },
                    tag: { type: 'string', description: 'Updated merge tag' },
                    name: { type: 'string', description: 'Updated display name' },
                    required: { type: 'boolean', description: 'Updated required status' },
                    default_value: { type: 'string', description: 'Updated default value' },
                    public: { type: 'boolean', description: 'Updated public visibility' },
                    display_order: { type: 'number', description: 'Updated display order' },
                    options: { type: 'object', description: 'Updated field options' },
                    help_text: { type: 'string', description: 'Updated help text' },
                },
                required: ['list_id', 'merge_id'],
            },
            execute: async (params) => {
                const { list_id, merge_id, ...data } = params;
                return client.updateMergeField(list_id, merge_id, data);
            },
        },
        mailchimp_merge_fields_delete: {
            description: 'Delete a merge field. Note: built-in fields (EMAIL, FNAME, LNAME) cannot be deleted.',
            parameters: {
                type: 'object',
                properties: {
                    list_id: { type: 'string', description: 'List/audience ID' },
                    merge_id: { type: 'number', description: 'Merge field ID to delete' },
                },
                required: ['list_id', 'merge_id'],
            },
            execute: async (params) => {
                await client.deleteMergeField(params.list_id, params.merge_id);
                return { deleted: true, merge_id: params.merge_id };
            },
        },
    };
}
//# sourceMappingURL=merge-fields-tools.js.map