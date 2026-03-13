import { MailchimpClient } from '../clients/mailchimp.js';
/**
 * Mailchimp Audiences Tools
 * Audience-level stats and growth analytics.
 * Core CRUD operations (list/get/create/update/delete) are in lists-tools.ts.
 */
export declare function registerAudienceTools(client: MailchimpClient): {
    mailchimp_audiences_get_stats: {
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
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_audiences_get_growth_history: {
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
                sort_field: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                sort_dir: {
                    type: string;
                    enum: string[];
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_audiences_batch_subscribe: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                members: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                        properties: {
                            email_address: {
                                type: string;
                                description: string;
                            };
                            status: {
                                type: string;
                                enum: string[];
                                description: string;
                            };
                            merge_fields: {
                                type: string;
                                description: string;
                            };
                            interests: {
                                type: string;
                                description: string;
                            };
                            language: {
                                type: string;
                                description: string;
                            };
                            vip: {
                                type: string;
                                description: string;
                            };
                            tags: {
                                type: string;
                                items: {
                                    type: string;
                                };
                                description: string;
                            };
                        };
                        required: string[];
                    };
                };
                update_existing: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_audiences_get_segments: {
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
                    enum: string[];
                    description: string;
                };
                since_created_at: {
                    type: string;
                    description: string;
                };
                before_created_at: {
                    type: string;
                    description: string;
                };
                since_updated_at: {
                    type: string;
                    description: string;
                };
                before_updated_at: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_audiences_create_segment: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                static_segment: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                options: {
                    type: string;
                    description: string;
                    properties: {
                        match: {
                            type: string;
                            enum: string[];
                            description: string;
                        };
                        conditions: {
                            type: string;
                            description: string;
                            items: {
                                type: string;
                            };
                        };
                    };
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_audiences_get_interest_categories: {
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
                    enum: string[];
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=audiences-tools.d.ts.map