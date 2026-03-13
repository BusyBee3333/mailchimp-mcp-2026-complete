import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerSearchTools(client: MailchimpClient): {
    mailchimp_search_campaigns: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                query: {
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
    mailchimp_search_members: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                query: {
                    type: string;
                    description: string;
                };
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
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=search-tools.d.ts.map