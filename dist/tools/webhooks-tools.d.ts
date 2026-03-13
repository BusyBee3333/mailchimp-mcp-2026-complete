import { MailchimpClient } from '../clients/mailchimp.js';
/**
 * Mailchimp Webhooks Tools
 * Manage webhooks for audience/list events
 */
export declare function registerWebhookTools(client: MailchimpClient): {
    mailchimp_webhooks_list: {
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
    mailchimp_webhooks_get: {
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
                webhook_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_webhooks_create: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                url: {
                    type: string;
                    description: string;
                };
                events: {
                    type: string;
                    description: string;
                    properties: {
                        subscribe: {
                            type: string;
                            description: string;
                        };
                        unsubscribe: {
                            type: string;
                            description: string;
                        };
                        profile: {
                            type: string;
                            description: string;
                        };
                        cleaned: {
                            type: string;
                            description: string;
                        };
                        upemail: {
                            type: string;
                            description: string;
                        };
                        campaign: {
                            type: string;
                            description: string;
                        };
                    };
                };
                sources: {
                    type: string;
                    description: string;
                    properties: {
                        user: {
                            type: string;
                            description: string;
                        };
                        admin: {
                            type: string;
                            description: string;
                        };
                        api: {
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
    mailchimp_webhooks_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                webhook_id: {
                    type: string;
                    description: string;
                };
                url: {
                    type: string;
                    description: string;
                };
                events: {
                    type: string;
                    description: string;
                    properties: {
                        subscribe: {
                            type: string;
                        };
                        unsubscribe: {
                            type: string;
                        };
                        profile: {
                            type: string;
                        };
                        cleaned: {
                            type: string;
                        };
                        upemail: {
                            type: string;
                        };
                        campaign: {
                            type: string;
                        };
                    };
                };
                sources: {
                    type: string;
                    description: string;
                    properties: {
                        user: {
                            type: string;
                        };
                        admin: {
                            type: string;
                        };
                        api: {
                            type: string;
                        };
                    };
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_webhooks_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                webhook_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<{
            deleted: boolean;
            webhook_id: any;
        }>;
    };
};
//# sourceMappingURL=webhooks-tools.d.ts.map