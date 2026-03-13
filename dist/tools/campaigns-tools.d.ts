import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerCampaignTools(client: MailchimpClient): {
    mailchimp_campaigns_list: {
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
                status: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                list_id: {
                    type: string;
                    description: string;
                };
                folder_id: {
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
    mailchimp_campaigns_get: {
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
    mailchimp_campaigns_create: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                type: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                recipients: {
                    type: string;
                    description: string;
                    properties: {
                        list_id: {
                            type: string;
                            description: string;
                        };
                        segment_opts: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
                settings: {
                    type: string;
                    description: string;
                    properties: {
                        subject_line: {
                            type: string;
                            description: string;
                        };
                        preview_text: {
                            type: string;
                            description: string;
                        };
                        title: {
                            type: string;
                            description: string;
                        };
                        from_name: {
                            type: string;
                            description: string;
                        };
                        reply_to: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_campaigns_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
                recipients: {
                    type: string;
                    description: string;
                };
                settings: {
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
    mailchimp_campaigns_delete: {
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
    mailchimp_campaigns_send: {
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
    mailchimp_campaigns_schedule: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
                schedule_time: {
                    type: string;
                    description: string;
                };
                timewarp: {
                    type: string;
                    description: string;
                };
                batch_delivery: {
                    type: string;
                    description: string;
                    properties: {
                        batch_delay: {
                            type: string;
                            description: string;
                        };
                        batch_count: {
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
    mailchimp_campaigns_unschedule: {
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
    mailchimp_campaigns_pause: {
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
    mailchimp_campaigns_resume: {
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
    mailchimp_campaigns_replicate: {
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
    mailchimp_campaigns_test: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
                test_emails: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                    };
                };
                send_type: {
                    type: string;
                    enum: string[];
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_campaigns_get_content: {
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
    mailchimp_campaigns_set_content: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                campaign_id: {
                    type: string;
                    description: string;
                };
                plain_text: {
                    type: string;
                    description: string;
                };
                html: {
                    type: string;
                    description: string;
                };
                url: {
                    type: string;
                    description: string;
                };
                template: {
                    type: string;
                    description: string;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                        sections: {
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
    mailchimp_campaigns_get_send_checklist: {
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
//# sourceMappingURL=campaigns-tools.d.ts.map