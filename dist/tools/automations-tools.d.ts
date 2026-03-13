import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerAutomationTools(client: MailchimpClient): {
    mailchimp_automations_list: {
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
                before_create_time: {
                    type: string;
                    description: string;
                };
                since_create_time: {
                    type: string;
                    description: string;
                };
                before_start_time: {
                    type: string;
                    description: string;
                };
                since_start_time: {
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
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_pause: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_start: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_list_emails: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_get_email: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
                email_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_pause_email: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
                email_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_start_email: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
                email_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_list_queue: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
                email_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_automations_add_to_queue: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                workflow_id: {
                    type: string;
                    description: string;
                };
                email_id: {
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
};
//# sourceMappingURL=automations-tools.d.ts.map