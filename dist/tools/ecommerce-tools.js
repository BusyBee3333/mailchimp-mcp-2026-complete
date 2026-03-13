export function registerEcommerceTools(client) {
    return {
        // ===== STORES =====
        mailchimp_ecommerce_stores_list: {
            description: 'Get all e-commerce stores connected to your account',
            parameters: {
                type: 'object',
                properties: {
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' }
                }
            },
            execute: async (params) => client.getStores(params)
        },
        mailchimp_ecommerce_stores_get: {
            description: 'Get information about a specific store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' }
                },
                required: ['store_id']
            },
            execute: async (params) => client.getStore(params.store_id)
        },
        mailchimp_ecommerce_stores_add: {
            description: 'Add a new e-commerce store',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Unique store ID' },
                    list_id: { type: 'string', description: 'List ID to associate with store' },
                    name: { type: 'string', description: 'Store name' },
                    platform: { type: 'string', description: 'E-commerce platform (e.g., Shopify, WooCommerce)' },
                    domain: { type: 'string', description: 'Store domain' },
                    currency_code: { type: 'string', description: 'ISO 4217 currency code (e.g., USD)' },
                    email_address: { type: 'string', description: 'Store contact email' },
                    phone: { type: 'string', description: 'Store phone number' }
                },
                required: ['id', 'list_id', 'name', 'currency_code']
            },
            execute: async (params) => client.addStore(params)
        },
        mailchimp_ecommerce_stores_update: {
            description: 'Update a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    name: { type: 'string', description: 'Updated store name' },
                    domain: { type: 'string', description: 'Updated domain' },
                    email_address: { type: 'string', description: 'Updated email' },
                    currency_code: { type: 'string', description: 'Updated currency code' }
                },
                required: ['store_id']
            },
            execute: async (params) => {
                const { store_id, ...data } = params;
                return client.updateStore(store_id, data);
            }
        },
        mailchimp_ecommerce_stores_delete: {
            description: 'Delete a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID to delete' }
                },
                required: ['store_id']
            },
            execute: async (params) => client.deleteStore(params.store_id)
        },
        // ===== PRODUCTS =====
        mailchimp_ecommerce_products_list: {
            description: 'Get all products for a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' }
                },
                required: ['store_id']
            },
            execute: async (params) => {
                const { store_id, ...queryParams } = params;
                return client.getProducts(store_id, queryParams);
            }
        },
        mailchimp_ecommerce_products_get: {
            description: 'Get information about a specific product',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    product_id: { type: 'string', description: 'Product ID' }
                },
                required: ['store_id', 'product_id']
            },
            execute: async (params) => client.getProduct(params.store_id, params.product_id)
        },
        mailchimp_ecommerce_products_add: {
            description: 'Add a new product to a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    id: { type: 'string', description: 'Unique product ID' },
                    title: { type: 'string', description: 'Product title' },
                    handle: { type: 'string', description: 'Product URL handle' },
                    url: { type: 'string', description: 'Product URL' },
                    description: { type: 'string', description: 'Product description' },
                    type: { type: 'string', description: 'Product type/category' },
                    vendor: { type: 'string', description: 'Product vendor' },
                    image_url: { type: 'string', description: 'Product image URL' },
                    variants: {
                        type: 'array',
                        description: 'Product variants (at least one required)',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'Variant ID' },
                                title: { type: 'string', description: 'Variant title' },
                                price: { type: 'number', description: 'Variant price' },
                                sku: { type: 'string', description: 'SKU' },
                                inventory_quantity: { type: 'number', description: 'Inventory quantity' }
                            }
                        }
                    }
                },
                required: ['store_id', 'id', 'title', 'variants']
            },
            execute: async (params) => {
                const { store_id, ...data } = params;
                return client.addProduct(store_id, data);
            }
        },
        mailchimp_ecommerce_products_update: {
            description: 'Update a product',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    product_id: { type: 'string', description: 'Product ID' },
                    title: { type: 'string', description: 'Updated title' },
                    description: { type: 'string', description: 'Updated description' },
                    url: { type: 'string', description: 'Updated URL' },
                    variants: { type: 'array', description: 'Updated variants' }
                },
                required: ['store_id', 'product_id']
            },
            execute: async (params) => {
                const { store_id, product_id, ...data } = params;
                return client.updateProduct(store_id, product_id, data);
            }
        },
        mailchimp_ecommerce_products_delete: {
            description: 'Delete a product',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    product_id: { type: 'string', description: 'Product ID to delete' }
                },
                required: ['store_id', 'product_id']
            },
            execute: async (params) => client.deleteProduct(params.store_id, params.product_id)
        },
        // ===== ORDERS =====
        mailchimp_ecommerce_orders_list: {
            description: 'Get all orders for a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    campaign_id: { type: 'string', description: 'Filter by campaign ID' },
                    customer_id: { type: 'string', description: 'Filter by customer ID' }
                },
                required: ['store_id']
            },
            execute: async (params) => {
                const { store_id, ...queryParams } = params;
                return client.getOrders(store_id, queryParams);
            }
        },
        mailchimp_ecommerce_orders_get: {
            description: 'Get information about a specific order',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    order_id: { type: 'string', description: 'Order ID' }
                },
                required: ['store_id', 'order_id']
            },
            execute: async (params) => client.getOrder(params.store_id, params.order_id)
        },
        mailchimp_ecommerce_orders_add: {
            description: 'Add a new order',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    id: { type: 'string', description: 'Unique order ID' },
                    customer: {
                        type: 'object',
                        description: 'Customer information',
                        properties: {
                            id: { type: 'string', description: 'Customer ID' },
                            email_address: { type: 'string', description: 'Email address' },
                            opt_in_status: { type: 'boolean', description: 'Marketing opt-in status' }
                        }
                    },
                    currency_code: { type: 'string', description: 'ISO 4217 currency code' },
                    order_total: { type: 'number', description: 'Total order amount' },
                    lines: {
                        type: 'array',
                        description: 'Order line items',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'Line item ID' },
                                product_id: { type: 'string', description: 'Product ID' },
                                product_variant_id: { type: 'string', description: 'Variant ID' },
                                quantity: { type: 'number', description: 'Quantity' },
                                price: { type: 'number', description: 'Price per item' }
                            }
                        }
                    },
                    campaign_id: { type: 'string', description: 'Campaign ID that generated this order' },
                    financial_status: { type: 'string', description: 'Financial status (paid, pending, etc.)' },
                    processed_at_foreign: { type: 'string', description: 'Order processing time (ISO 8601)' }
                },
                required: ['store_id', 'id', 'customer', 'currency_code', 'order_total', 'lines']
            },
            execute: async (params) => {
                const { store_id, ...data } = params;
                return client.addOrder(store_id, data);
            }
        },
        mailchimp_ecommerce_orders_update: {
            description: 'Update an order',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    order_id: { type: 'string', description: 'Order ID' },
                    customer: { type: 'object', description: 'Updated customer data' },
                    order_total: { type: 'number', description: 'Updated order total' },
                    financial_status: { type: 'string', description: 'Updated financial status' },
                    lines: { type: 'array', description: 'Updated line items' }
                },
                required: ['store_id', 'order_id']
            },
            execute: async (params) => {
                const { store_id, order_id, ...data } = params;
                return client.updateOrder(store_id, order_id, data);
            }
        },
        mailchimp_ecommerce_orders_delete: {
            description: 'Delete an order',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    order_id: { type: 'string', description: 'Order ID to delete' }
                },
                required: ['store_id', 'order_id']
            },
            execute: async (params) => client.deleteOrder(params.store_id, params.order_id)
        },
        // ===== CARTS =====
        mailchimp_ecommerce_carts_list: {
            description: 'Get all carts (abandoned carts) for a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' }
                },
                required: ['store_id']
            },
            execute: async (params) => {
                const { store_id, ...queryParams } = params;
                return client.getCarts(store_id, queryParams);
            }
        },
        mailchimp_ecommerce_carts_get: {
            description: 'Get information about a specific cart',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    cart_id: { type: 'string', description: 'Cart ID' }
                },
                required: ['store_id', 'cart_id']
            },
            execute: async (params) => client.getCart(params.store_id, params.cart_id)
        },
        mailchimp_ecommerce_carts_add: {
            description: 'Add a new cart (for abandoned cart tracking)',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    id: { type: 'string', description: 'Unique cart ID' },
                    customer: {
                        type: 'object',
                        description: 'Customer information',
                        properties: {
                            id: { type: 'string', description: 'Customer ID' },
                            email_address: { type: 'string', description: 'Email address' },
                            opt_in_status: { type: 'boolean', description: 'Marketing opt-in status' }
                        }
                    },
                    currency_code: { type: 'string', description: 'ISO 4217 currency code' },
                    order_total: { type: 'number', description: 'Cart total' },
                    checkout_url: { type: 'string', description: 'Cart checkout URL' },
                    lines: {
                        type: 'array',
                        description: 'Cart line items',
                        items: { type: 'object' }
                    }
                },
                required: ['store_id', 'id', 'customer', 'currency_code', 'order_total', 'lines']
            },
            execute: async (params) => {
                const { store_id, ...data } = params;
                return client.addCart(store_id, data);
            }
        },
        mailchimp_ecommerce_carts_update: {
            description: 'Update a cart',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    cart_id: { type: 'string', description: 'Cart ID' },
                    order_total: { type: 'number', description: 'Updated cart total' },
                    lines: { type: 'array', description: 'Updated line items' },
                    checkout_url: { type: 'string', description: 'Updated checkout URL' }
                },
                required: ['store_id', 'cart_id']
            },
            execute: async (params) => {
                const { store_id, cart_id, ...data } = params;
                return client.updateCart(store_id, cart_id, data);
            }
        },
        mailchimp_ecommerce_carts_delete: {
            description: 'Delete a cart',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    cart_id: { type: 'string', description: 'Cart ID to delete' }
                },
                required: ['store_id', 'cart_id']
            },
            execute: async (params) => client.deleteCart(params.store_id, params.cart_id)
        },
        // ===== CUSTOMERS =====
        mailchimp_ecommerce_customers_list: {
            description: 'Get all customers for a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' },
                    email_address: { type: 'string', description: 'Filter by email address' }
                },
                required: ['store_id']
            },
            execute: async (params) => {
                const { store_id, ...queryParams } = params;
                return client.getCustomers(store_id, queryParams);
            }
        },
        mailchimp_ecommerce_customers_get: {
            description: 'Get information about a specific customer',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    customer_id: { type: 'string', description: 'Customer ID' }
                },
                required: ['store_id', 'customer_id']
            },
            execute: async (params) => client.getCustomer(params.store_id, params.customer_id)
        },
        mailchimp_ecommerce_customers_add: {
            description: 'Add a new customer',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    id: { type: 'string', description: 'Unique customer ID' },
                    email_address: { type: 'string', description: 'Email address' },
                    opt_in_status: { type: 'boolean', description: 'Marketing opt-in status' },
                    company: { type: 'string', description: 'Company name' },
                    first_name: { type: 'string', description: 'First name' },
                    last_name: { type: 'string', description: 'Last name' }
                },
                required: ['store_id', 'id', 'email_address', 'opt_in_status']
            },
            execute: async (params) => {
                const { store_id, ...data } = params;
                return client.addCustomer(store_id, data);
            }
        },
        mailchimp_ecommerce_customers_update: {
            description: 'Update a customer',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    customer_id: { type: 'string', description: 'Customer ID' },
                    opt_in_status: { type: 'boolean', description: 'Updated opt-in status' },
                    first_name: { type: 'string', description: 'Updated first name' },
                    last_name: { type: 'string', description: 'Updated last name' }
                },
                required: ['store_id', 'customer_id']
            },
            execute: async (params) => {
                const { store_id, customer_id, ...data } = params;
                return client.updateCustomer(store_id, customer_id, data);
            }
        },
        mailchimp_ecommerce_customers_delete: {
            description: 'Delete a customer',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    customer_id: { type: 'string', description: 'Customer ID to delete' }
                },
                required: ['store_id', 'customer_id']
            },
            execute: async (params) => client.deleteCustomer(params.store_id, params.customer_id)
        },
        // ===== PROMO CODES =====
        mailchimp_ecommerce_promo_rules_list: {
            description: 'Get all promo rules for a store',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' }
                },
                required: ['store_id']
            },
            execute: async (params) => {
                const { store_id, ...queryParams } = params;
                return client.getPromoRules(store_id, queryParams);
            }
        },
        mailchimp_ecommerce_promo_codes_list: {
            description: 'Get all promo codes for a promo rule',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    rule_id: { type: 'string', description: 'Promo rule ID' },
                    count: { type: 'number', description: 'Number of records to return' },
                    offset: { type: 'number', description: 'Number of records to skip' }
                },
                required: ['store_id', 'rule_id']
            },
            execute: async (params) => {
                const { store_id, rule_id, ...queryParams } = params;
                return client.getPromoCodes(store_id, rule_id, queryParams);
            }
        },
        mailchimp_ecommerce_promo_codes_add: {
            description: 'Add a promo code to a promo rule',
            parameters: {
                type: 'object',
                properties: {
                    store_id: { type: 'string', description: 'Store ID' },
                    rule_id: { type: 'string', description: 'Promo rule ID' },
                    id: { type: 'string', description: 'Promo code ID' },
                    code: { type: 'string', description: 'Promo code text' },
                    redemption_url: { type: 'string', description: 'Promo code redemption URL' },
                    enabled: { type: 'boolean', description: 'Whether code is enabled' }
                },
                required: ['store_id', 'rule_id', 'id', 'code']
            },
            execute: async (params) => {
                const { store_id, rule_id, ...data } = params;
                return client.addPromoCode(store_id, rule_id, data);
            }
        }
    };
}
//# sourceMappingURL=ecommerce-tools.js.map