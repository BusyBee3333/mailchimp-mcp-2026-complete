import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerTemplateTools(client: MailchimpClient): {
    mailchimp_templates_list: {
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
                type: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                category: {
                    type: string;
                    description: string;
                };
                folder_id: {
                    type: string;
                    description: string;
                };
                created_by: {
                    type: string;
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
    mailchimp_templates_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                template_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_templates_create: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                name: {
                    type: string;
                    description: string;
                };
                folder_id: {
                    type: string;
                    description: string;
                };
                html: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_templates_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                template_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                folder_id: {
                    type: string;
                    description: string;
                };
                html: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_templates_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                template_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_templates_get_default_content: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                template_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=templates-tools.d.ts.map