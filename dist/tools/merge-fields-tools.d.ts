import { MailchimpClient } from '../clients/mailchimp.js';
/**
 * Mailchimp Merge Fields Tools
 * Manage merge fields (custom fields) for audience lists
 */
export declare function registerMergeFieldTools(client: MailchimpClient): {
    mailchimp_merge_fields_list: {
        description: string;
        annotations: {
            readOnlyHint: boolean;
        };
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                count: {
                    type: string;
                    description: string;
                };
                offset: {
                    type: string;
                    description: string;
                };
                type: {
                    type: string;
                    description: string;
                    enum: string[];
                };
                required: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_merge_fields_get: {
        description: string;
        annotations: {
            readOnlyHint: boolean;
        };
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                merge_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_merge_fields_create: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                tag: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                type: {
                    type: string;
                    description: string;
                    enum: string[];
                };
                required: {
                    type: string;
                    description: string;
                };
                default_value: {
                    type: string;
                    description: string;
                };
                public: {
                    type: string;
                    description: string;
                };
                display_order: {
                    type: string;
                    description: string;
                };
                options: {
                    type: string;
                    description: string;
                    properties: {
                        default_country: {
                            type: string;
                            description: string;
                        };
                        phone_format: {
                            type: string;
                            description: string;
                        };
                        date_format: {
                            type: string;
                            description: string;
                        };
                        choices: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                        size: {
                            type: string;
                            description: string;
                        };
                    };
                };
                help_text: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_merge_fields_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                merge_id: {
                    type: string;
                    description: string;
                };
                tag: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                required: {
                    type: string;
                    description: string;
                };
                default_value: {
                    type: string;
                    description: string;
                };
                public: {
                    type: string;
                    description: string;
                };
                display_order: {
                    type: string;
                    description: string;
                };
                options: {
                    type: string;
                    description: string;
                };
                help_text: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_merge_fields_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                merge_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<{
            deleted: boolean;
            merge_id: any;
        }>;
    };
};
//# sourceMappingURL=merge-fields-tools.d.ts.map