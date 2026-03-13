import { MailchimpClient } from '../clients/mailchimp.js';
export declare function registerEcommerceTools(client: MailchimpClient): {
    mailchimp_ecommerce_stores_list: {
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
            };
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_stores_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_stores_add: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                list_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                platform: {
                    type: string;
                    description: string;
                };
                domain: {
                    type: string;
                    description: string;
                };
                currency_code: {
                    type: string;
                    description: string;
                };
                email_address: {
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
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_stores_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                domain: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
                currency_code: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_stores_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_products_list: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
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
    mailchimp_ecommerce_products_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                product_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_products_add: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                id: {
                    type: string;
                    description: string;
                };
                title: {
                    type: string;
                    description: string;
                };
                handle: {
                    type: string;
                    description: string;
                };
                url: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                type: {
                    type: string;
                    description: string;
                };
                vendor: {
                    type: string;
                    description: string;
                };
                image_url: {
                    type: string;
                    description: string;
                };
                variants: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            title: {
                                type: string;
                                description: string;
                            };
                            price: {
                                type: string;
                                description: string;
                            };
                            sku: {
                                type: string;
                                description: string;
                            };
                            inventory_quantity: {
                                type: string;
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
    mailchimp_ecommerce_products_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                product_id: {
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
                url: {
                    type: string;
                    description: string;
                };
                variants: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_products_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                product_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_orders_list: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
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
                campaign_id: {
                    type: string;
                    description: string;
                };
                customer_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_orders_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                order_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_orders_add: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                id: {
                    type: string;
                    description: string;
                };
                customer: {
                    type: string;
                    description: string;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                        email_address: {
                            type: string;
                            description: string;
                        };
                        opt_in_status: {
                            type: string;
                            description: string;
                        };
                    };
                };
                currency_code: {
                    type: string;
                    description: string;
                };
                order_total: {
                    type: string;
                    description: string;
                };
                lines: {
                    type: string;
                    description: string;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                            product_id: {
                                type: string;
                                description: string;
                            };
                            product_variant_id: {
                                type: string;
                                description: string;
                            };
                            quantity: {
                                type: string;
                                description: string;
                            };
                            price: {
                                type: string;
                                description: string;
                            };
                        };
                    };
                };
                campaign_id: {
                    type: string;
                    description: string;
                };
                financial_status: {
                    type: string;
                    description: string;
                };
                processed_at_foreign: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_orders_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                order_id: {
                    type: string;
                    description: string;
                };
                customer: {
                    type: string;
                    description: string;
                };
                order_total: {
                    type: string;
                    description: string;
                };
                financial_status: {
                    type: string;
                    description: string;
                };
                lines: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_orders_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                order_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_carts_list: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
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
    mailchimp_ecommerce_carts_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                cart_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_carts_add: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                id: {
                    type: string;
                    description: string;
                };
                customer: {
                    type: string;
                    description: string;
                    properties: {
                        id: {
                            type: string;
                            description: string;
                        };
                        email_address: {
                            type: string;
                            description: string;
                        };
                        opt_in_status: {
                            type: string;
                            description: string;
                        };
                    };
                };
                currency_code: {
                    type: string;
                    description: string;
                };
                order_total: {
                    type: string;
                    description: string;
                };
                checkout_url: {
                    type: string;
                    description: string;
                };
                lines: {
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
    mailchimp_ecommerce_carts_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                cart_id: {
                    type: string;
                    description: string;
                };
                order_total: {
                    type: string;
                    description: string;
                };
                lines: {
                    type: string;
                    description: string;
                };
                checkout_url: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_carts_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                cart_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_customers_list: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
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
                email_address: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_customers_get: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                customer_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_customers_add: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                id: {
                    type: string;
                    description: string;
                };
                email_address: {
                    type: string;
                    description: string;
                };
                opt_in_status: {
                    type: string;
                    description: string;
                };
                company: {
                    type: string;
                    description: string;
                };
                first_name: {
                    type: string;
                    description: string;
                };
                last_name: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_customers_update: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                customer_id: {
                    type: string;
                    description: string;
                };
                opt_in_status: {
                    type: string;
                    description: string;
                };
                first_name: {
                    type: string;
                    description: string;
                };
                last_name: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_customers_delete: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                customer_id: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
    mailchimp_ecommerce_promo_rules_list: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
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
    mailchimp_ecommerce_promo_codes_list: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                rule_id: {
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
    mailchimp_ecommerce_promo_codes_add: {
        description: string;
        parameters: {
            type: "object";
            properties: {
                store_id: {
                    type: string;
                    description: string;
                };
                rule_id: {
                    type: string;
                    description: string;
                };
                id: {
                    type: string;
                    description: string;
                };
                code: {
                    type: string;
                    description: string;
                };
                redemption_url: {
                    type: string;
                    description: string;
                };
                enabled: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
        execute: (params: any) => Promise<unknown>;
    };
};
//# sourceMappingURL=ecommerce-tools.d.ts.map