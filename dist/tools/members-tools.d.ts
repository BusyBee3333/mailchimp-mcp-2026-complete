import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerMemberTools(client: MailchimpClient): {
    mailchimp_members_list: {
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
                email_type: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                status: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                since_timestamp_opt: {
                    type: string;
                    description: string;
                };
                before_timestamp_opt: {
                    type: string;
                    description: string;
                };
                since_last_changed: {
                    type: string;
                    description: string;
                };
                vip_only: {
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
    mailchimp_members_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_add: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
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
                location: {
                    type: string;
                    description: string;
                    properties: {
                        latitude: {
                            type: string;
                        };
                        longitude: {
                            type: string;
                        };
                    };
                };
                tags: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
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
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_add_or_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
                status_if_new: {
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
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_archive: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_get_activity: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
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
    mailchimp_members_get_goals: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_get_tags: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_add_tags: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
                tags: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                        properties: {
                            name: {
                                type: string;
                                description: string;
                            };
                            status: {
                                type: string;
                                enum: string[];
                                description: string;
                            };
                        };
                    };
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_members_batch_add_remove: {
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
                members_to_add: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                    };
                };
                members_to_remove: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=members-tools.d.ts.map