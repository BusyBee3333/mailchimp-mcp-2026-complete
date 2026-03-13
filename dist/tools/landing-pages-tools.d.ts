import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerLandingPageTools(client: MailchimpClient): {
    mailchimp_landing_pages_list: {
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
    mailchimp_landing_pages_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                page_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_landing_pages_create: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                name: {
                    type: string;
                    description: string;
                };
                title: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                template_id: {
                    type: string;
                    description: string;
                };
                list_id: {
                    type: string;
                    description: string;
                };
                store_id: {
                    type: string;
                    description: string;
                };
                tracking: {
                    type: string;
                    description: string;
                    properties: {
                        google_analytics: {
                            type: string;
                            description: string;
                        };
                        clicktale: {
                            type: string;
                            description: string;
                        };
                    };
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_landing_pages_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                page_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                title: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                list_id: {
                    type: string;
                    description: string;
                };
                tracking: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_landing_pages_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                page_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_landing_pages_publish: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                page_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_landing_pages_unpublish: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                page_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_landing_pages_get_content: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                page_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=landing-pages-tools.d.ts.map