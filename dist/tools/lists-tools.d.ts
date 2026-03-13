import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerListTools(client: MailchimpClient): {
    mailchimp_lists_list: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                count: {
                    type: string;
                    description: string;
                };
                offset: {
                    type: string;
                    description: string;
                };
                before_date_created: {
                    type: string;
                    description: string;
                };
                since_date_created: {
                    type: string;
                    description: string;
                };
                email: {
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
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_lists_get: {
        description: string;
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
    mailchimp_lists_create: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                name: {
                    type: string;
                    description: string;
                };
                contact: {
                    type: string;
                    description: string;
                    properties: {
                        company: {
                            type: string;
                            description: string;
                        };
                        address1: {
                            type: string;
                            description: string;
                        };
                        city: {
                            type: string;
                            description: string;
                        };
                        state: {
                            type: string;
                            description: string;
                        };
                        zip: {
                            type: string;
                            description: string;
                        };
                        country: {
                            type: string;
                            description: string;
                        };
                        phone: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
                permission_reminder: {
                    type: string;
                    description: string;
                };
                campaign_defaults: {
                    type: string;
                    description: string;
                    properties: {
                        from_name: {
                            type: string;
                            description: string;
                        };
                        from_email: {
                            type: string;
                            description: string;
                        };
                        subject: {
                            type: string;
                            description: string;
                        };
                        language: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
                email_type_option: {
                    type: string;
                    description: string;
                };
                double_optin: {
                    type: string;
                    description: string;
                };
                marketing_permissions: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_lists_update: {
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
                contact: {
                    type: string;
                    description: string;
                };
                permission_reminder: {
                    type: string;
                    description: string;
                };
                campaign_defaults: {
                    type: string;
                    description: string;
                };
                email_type_option: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_lists_delete: {
        description: string;
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
    mailchimp_lists_get_growth_history: {
        description: string;
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
    mailchimp_lists_batch_subscribe: {
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
                        };
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
    mailchimp_lists_get_interest_categories: {
        description: string;
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
    mailchimp_lists_get_interests: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                category_id: {
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
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_lists_get_segments: {
        description: string;
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
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_lists_get_segment: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                segment_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_lists_create_segment: {
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
                    description: string;
                    items: {
                        type: string;
                    };
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
    mailchimp_lists_update_segment: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                segment_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                options: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_lists_delete_segment: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                segment_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=lists-tools.d.ts.map