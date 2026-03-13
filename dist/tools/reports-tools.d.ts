import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerReportTools(client: MailchimpClient): {
    mailchimp_reports_list: {
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
                before_send_time: {
                    type: string;
                    description: string;
                };
                since_send_time: {
                    type: string;
                    description: string;
                };
            };
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_reports_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_reports_get_click_details: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
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
    mailchimp_reports_get_click_detail: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
                link_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_reports_get_open_details: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
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
                since: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_reports_get_domain_performance: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_reports_get_email_activity: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
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
    mailchimp_reports_get_sub_reports: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=reports-tools.d.ts.map