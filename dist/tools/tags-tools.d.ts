import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerTagTools(client: MailchimpClient): {
    mailchimp_tags_search: {
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
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=tags-tools.d.ts.map