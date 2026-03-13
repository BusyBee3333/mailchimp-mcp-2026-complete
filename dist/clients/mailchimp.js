export class MailchimpClient {
    apiKey;
    server;
    baseUrl;
    rateLimitRemaining = 10;
    rateLimitReset = Date.now();
    constructor(config) {
        this.apiKey = config.apiKey;
        // Extract data center from API key (format: xxxxxxxxxxxxxxxxxxxxx-us19)
        if (config.server) {
            this.server = config.server;
        }
        else {
            const parts = this.apiKey.split('-');
            if (parts.length !== 2) {
                throw new Error('Invalid API key format. Expected format: key-datacenter (e.g., xxx-us19)');
            }
            this.server = parts[1];
        }
        this.baseUrl = `https://${this.server}.api.mailchimp.com/3.0`;
    }
    /**
     * Make an authenticated request to the Mailchimp API
     */
    async request(method, endpoint, data, params) {
        // Rate limiting check
        if (this.rateLimitRemaining <= 0 && Date.now() < this.rateLimitReset) {
            const waitTime = this.rateLimitReset - Date.now();
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        // Build URL with query params
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        // Prepare headers - Mailchimp accepts Basic auth with "anystring" as username
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString('base64')}`,
            'User-Agent': 'Mailchimp-MCP-Server/1.0'
        };
        const options = {
            method,
            headers
        };
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }
        try {
            const response = await fetch(url.toString(), options);
            // Update rate limit info from headers
            const remaining = response.headers.get('X-RateLimit-Remaining');
            const reset = response.headers.get('X-RateLimit-Reset');
            if (remaining)
                this.rateLimitRemaining = parseInt(remaining);
            if (reset)
                this.rateLimitReset = new Date(reset).getTime();
            // Handle non-2xx responses
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                }
                catch {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                throw new Error(`Mailchimp API Error (${errorData.status}): ${errorData.title} - ${errorData.detail}`);
            }
            // Handle 204 No Content
            if (response.status === 204) {
                return {};
            }
            const result = await response.json();
            return result;
        }
        catch (error) {
            if (error.message?.includes('Mailchimp API Error')) {
                throw error;
            }
            throw new Error(`Request failed: ${error.message}`);
        }
    }
    // ===== HTTP METHOD HELPERS =====
    async get(endpoint, params) {
        return this.request('GET', endpoint, undefined, params);
    }
    async post(endpoint, data, params) {
        return this.request('POST', endpoint, data, params);
    }
    async put(endpoint, data, params) {
        return this.request('PUT', endpoint, data, params);
    }
    async patch(endpoint, data, params) {
        return this.request('PATCH', endpoint, data, params);
    }
    async delete(endpoint, params) {
        return this.request('DELETE', endpoint, undefined, params);
    }
    // ===== PAGINATION HELPER =====
    /**
     * Fetch all pages of a paginated endpoint
     */
    async getAllPages(endpoint, params = {}, itemsKey = 'items') {
        const allItems = [];
        let offset = 0;
        const count = params.count || 100; // Default page size
        while (true) {
            const response = await this.get(endpoint, {
                ...params,
                offset,
                count
            });
            const items = response[itemsKey];
            if (!items || items.length === 0)
                break;
            allItems.push(...items);
            // Check if we've fetched all items
            if (allItems.length >= response.total_items)
                break;
            offset += count;
        }
        return allItems;
    }
    // ===== CAMPAIGNS =====
    async getCampaigns(params) {
        return this.get('/campaigns', params);
    }
    async getCampaign(campaignId, params) {
        return this.get(`/campaigns/${campaignId}`, params);
    }
    async createCampaign(data) {
        return this.post('/campaigns', data);
    }
    async updateCampaign(campaignId, data) {
        return this.patch(`/campaigns/${campaignId}`, data);
    }
    async deleteCampaign(campaignId) {
        return this.delete(`/campaigns/${campaignId}`);
    }
    async sendCampaign(campaignId) {
        return this.post(`/campaigns/${campaignId}/actions/send`);
    }
    async scheduleCampaign(campaignId, schedule_time, timewarp, batch_delivery) {
        return this.post(`/campaigns/${campaignId}/actions/schedule`, {
            schedule_time,
            timewarp,
            batch_delivery
        });
    }
    async unscheduleCampaign(campaignId) {
        return this.post(`/campaigns/${campaignId}/actions/unschedule`);
    }
    async pauseCampaign(campaignId) {
        return this.post(`/campaigns/${campaignId}/actions/pause`);
    }
    async resumeCampaign(campaignId) {
        return this.post(`/campaigns/${campaignId}/actions/resume`);
    }
    async replicateCampaign(campaignId) {
        return this.post(`/campaigns/${campaignId}/actions/replicate`);
    }
    async testCampaign(campaignId, test_emails, send_type) {
        return this.post(`/campaigns/${campaignId}/actions/test`, { test_emails, send_type });
    }
    async getCampaignContent(campaignId) {
        return this.get(`/campaigns/${campaignId}/content`);
    }
    async setCampaignContent(campaignId, data) {
        return this.put(`/campaigns/${campaignId}/content`, data);
    }
    async getSendChecklist(campaignId) {
        return this.get(`/campaigns/${campaignId}/send-checklist`);
    }
    // ===== LISTS / AUDIENCES =====
    async getLists(params) {
        return this.get('/lists', params);
    }
    async getList(listId) {
        return this.get(`/lists/${listId}`);
    }
    async createList(data) {
        return this.post('/lists', data);
    }
    async updateList(listId, data) {
        return this.patch(`/lists/${listId}`, data);
    }
    async deleteList(listId) {
        return this.delete(`/lists/${listId}`);
    }
    async getListGrowthHistory(listId, params) {
        return this.get(`/lists/${listId}/growth-history`, params);
    }
    async batchSubscribe(listId, members, update_existing) {
        return this.post(`/lists/${listId}`, {
            members,
            update_existing
        });
    }
    // ===== MEMBERS =====
    async getMembers(listId, params) {
        return this.get(`/lists/${listId}/members`, params);
    }
    async getMember(listId, subscriberHash) {
        return this.get(`/lists/${listId}/members/${subscriberHash}`);
    }
    async addMember(listId, data) {
        return this.post(`/lists/${listId}/members`, data);
    }
    async updateMember(listId, subscriberHash, data) {
        return this.patch(`/lists/${listId}/members/${subscriberHash}`, data);
    }
    async addOrUpdateMember(listId, subscriberHash, data) {
        return this.put(`/lists/${listId}/members/${subscriberHash}`, data);
    }
    async deleteMember(listId, subscriberHash) {
        return this.delete(`/lists/${listId}/members/${subscriberHash}`);
    }
    async archiveMember(listId, subscriberHash) {
        return this.delete(`/lists/${listId}/members/${subscriberHash}/actions/delete-permanent`);
    }
    async getMemberActivity(listId, subscriberHash, params) {
        return this.get(`/lists/${listId}/members/${subscriberHash}/activity`, params);
    }
    async getMemberGoals(listId, subscriberHash) {
        return this.get(`/lists/${listId}/members/${subscriberHash}/goals`);
    }
    async getMemberTags(listId, subscriberHash) {
        return this.get(`/lists/${listId}/members/${subscriberHash}/tags`);
    }
    async addMemberTags(listId, subscriberHash, tags) {
        return this.post(`/lists/${listId}/members/${subscriberHash}/tags`, { tags });
    }
    // ===== SEGMENTS =====
    async getSegments(listId, params) {
        return this.get(`/lists/${listId}/segments`, params);
    }
    async getSegment(listId, segmentId) {
        return this.get(`/lists/${listId}/segments/${segmentId}`);
    }
    async createSegment(listId, data) {
        return this.post(`/lists/${listId}/segments`, data);
    }
    async updateSegment(listId, segmentId, data) {
        return this.patch(`/lists/${listId}/segments/${segmentId}`, data);
    }
    async deleteSegment(listId, segmentId) {
        return this.delete(`/lists/${listId}/segments/${segmentId}`);
    }
    async batchAddSegmentMembers(listId, segmentId, members) {
        return this.post(`/lists/${listId}/segments/${segmentId}/members`, {
            members_to_add: members
        });
    }
    async batchRemoveSegmentMembers(listId, segmentId, members) {
        return this.post(`/lists/${listId}/segments/${segmentId}/members`, {
            members_to_remove: members
        });
    }
    // ===== INTEREST CATEGORIES & INTERESTS =====
    async getInterestCategories(listId, params) {
        return this.get(`/lists/${listId}/interest-categories`, params);
    }
    async getInterests(listId, categoryId, params) {
        return this.get(`/lists/${listId}/interest-categories/${categoryId}/interests`, params);
    }
    // ===== TEMPLATES =====
    async getTemplates(params) {
        return this.get('/templates', params);
    }
    async getTemplate(templateId) {
        return this.get(`/templates/${templateId}`);
    }
    async createTemplate(data) {
        return this.post('/templates', data);
    }
    async updateTemplate(templateId, data) {
        return this.patch(`/templates/${templateId}`, data);
    }
    async deleteTemplate(templateId) {
        return this.delete(`/templates/${templateId}`);
    }
    async getTemplateDefaultContent(templateId) {
        return this.get(`/templates/${templateId}/default-content`);
    }
    // ===== AUTOMATIONS =====
    async getAutomations(params) {
        return this.get('/automations', params);
    }
    async getAutomation(workflowId) {
        return this.get(`/automations/${workflowId}`);
    }
    async pauseAutomation(workflowId) {
        return this.post(`/automations/${workflowId}/actions/pause-all-emails`);
    }
    async startAutomation(workflowId) {
        return this.post(`/automations/${workflowId}/actions/start-all-emails`);
    }
    async getAutomationEmails(workflowId) {
        return this.get(`/automations/${workflowId}/emails`);
    }
    async getAutomationEmail(workflowId, emailId) {
        return this.get(`/automations/${workflowId}/emails/${emailId}`);
    }
    async pauseAutomationEmail(workflowId, emailId) {
        return this.post(`/automations/${workflowId}/emails/${emailId}/actions/pause`);
    }
    async startAutomationEmail(workflowId, emailId) {
        return this.post(`/automations/${workflowId}/emails/${emailId}/actions/start`);
    }
    async getAutomationQueue(workflowId, emailId) {
        return this.get(`/automations/${workflowId}/emails/${emailId}/queue`);
    }
    async addToAutomationQueue(workflowId, emailId, email_address) {
        return this.post(`/automations/${workflowId}/emails/${emailId}/queue`, { email_address });
    }
    // ===== REPORTS =====
    async getReports(params) {
        return this.get('/reports', params);
    }
    async getReport(campaignId) {
        return this.get(`/reports/${campaignId}`);
    }
    async getClickReports(campaignId, params) {
        return this.get(`/reports/${campaignId}/click-details`, params);
    }
    async getClickReport(campaignId, linkId) {
        return this.get(`/reports/${campaignId}/click-details/${linkId}`);
    }
    async getOpenDetails(campaignId, params) {
        return this.get(`/reports/${campaignId}/open-details`, params);
    }
    async getDomainPerformance(campaignId) {
        return this.get(`/reports/${campaignId}/domain-performance`);
    }
    async getEmailActivity(campaignId, subscriberHash) {
        return this.get(`/reports/${campaignId}/email-activity/${subscriberHash}`);
    }
    async getSubReports(campaignId) {
        return this.get(`/reports/${campaignId}/sub-reports`);
    }
    // ===== LANDING PAGES =====
    async getLandingPages(params) {
        return this.get('/landing-pages', params);
    }
    async getLandingPage(pageId) {
        return this.get(`/landing-pages/${pageId}`);
    }
    async createLandingPage(data) {
        return this.post('/landing-pages', data);
    }
    async updateLandingPage(pageId, data) {
        return this.patch(`/landing-pages/${pageId}`, data);
    }
    async deleteLandingPage(pageId) {
        return this.delete(`/landing-pages/${pageId}`);
    }
    async publishLandingPage(pageId) {
        return this.post(`/landing-pages/${pageId}/actions/publish`);
    }
    async unpublishLandingPage(pageId) {
        return this.post(`/landing-pages/${pageId}/actions/unpublish`);
    }
    async getLandingPageContent(pageId) {
        return this.get(`/landing-pages/${pageId}/content`);
    }
    // ===== ECOMMERCE =====
    async getStores(params) {
        return this.get('/ecommerce/stores', params);
    }
    async getStore(storeId) {
        return this.get(`/ecommerce/stores/${storeId}`);
    }
    async addStore(data) {
        return this.post('/ecommerce/stores', data);
    }
    async updateStore(storeId, data) {
        return this.patch(`/ecommerce/stores/${storeId}`, data);
    }
    async deleteStore(storeId) {
        return this.delete(`/ecommerce/stores/${storeId}`);
    }
    async getProducts(storeId, params) {
        return this.get(`/ecommerce/stores/${storeId}/products`, params);
    }
    async getProduct(storeId, productId) {
        return this.get(`/ecommerce/stores/${storeId}/products/${productId}`);
    }
    async addProduct(storeId, data) {
        return this.post(`/ecommerce/stores/${storeId}/products`, data);
    }
    async updateProduct(storeId, productId, data) {
        return this.patch(`/ecommerce/stores/${storeId}/products/${productId}`, data);
    }
    async deleteProduct(storeId, productId) {
        return this.delete(`/ecommerce/stores/${storeId}/products/${productId}`);
    }
    async getOrders(storeId, params) {
        return this.get(`/ecommerce/stores/${storeId}/orders`, params);
    }
    async getOrder(storeId, orderId) {
        return this.get(`/ecommerce/stores/${storeId}/orders/${orderId}`);
    }
    async addOrder(storeId, data) {
        return this.post(`/ecommerce/stores/${storeId}/orders`, data);
    }
    async updateOrder(storeId, orderId, data) {
        return this.patch(`/ecommerce/stores/${storeId}/orders/${orderId}`, data);
    }
    async deleteOrder(storeId, orderId) {
        return this.delete(`/ecommerce/stores/${storeId}/orders/${orderId}`);
    }
    async getCarts(storeId, params) {
        return this.get(`/ecommerce/stores/${storeId}/carts`, params);
    }
    async getCart(storeId, cartId) {
        return this.get(`/ecommerce/stores/${storeId}/carts/${cartId}`);
    }
    async addCart(storeId, data) {
        return this.post(`/ecommerce/stores/${storeId}/carts`, data);
    }
    async updateCart(storeId, cartId, data) {
        return this.patch(`/ecommerce/stores/${storeId}/carts/${cartId}`, data);
    }
    async deleteCart(storeId, cartId) {
        return this.delete(`/ecommerce/stores/${storeId}/carts/${cartId}`);
    }
    async getCustomers(storeId, params) {
        return this.get(`/ecommerce/stores/${storeId}/customers`, params);
    }
    async getCustomer(storeId, customerId) {
        return this.get(`/ecommerce/stores/${storeId}/customers/${customerId}`);
    }
    async addCustomer(storeId, data) {
        return this.post(`/ecommerce/stores/${storeId}/customers`, data);
    }
    async updateCustomer(storeId, customerId, data) {
        return this.patch(`/ecommerce/stores/${storeId}/customers/${customerId}`, data);
    }
    async deleteCustomer(storeId, customerId) {
        return this.delete(`/ecommerce/stores/${storeId}/customers/${customerId}`);
    }
    async getPromoRules(storeId, params) {
        return this.get(`/ecommerce/stores/${storeId}/promo-rules`, params);
    }
    async getPromoRule(storeId, ruleId) {
        return this.get(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}`);
    }
    async addPromoRule(storeId, data) {
        return this.post(`/ecommerce/stores/${storeId}/promo-rules`, data);
    }
    async getPromoCodes(storeId, ruleId, params) {
        return this.get(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}/promo-codes`, params);
    }
    async getPromoCode(storeId, ruleId, codeId) {
        return this.get(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}/promo-codes/${codeId}`);
    }
    async addPromoCode(storeId, ruleId, data) {
        return this.post(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}/promo-codes`, data);
    }
    // ===== TAGS =====
    async searchTags(listId, name) {
        return this.get(`/lists/${listId}/tag-search`, { name });
    }
    // ===== SEARCH =====
    async searchCampaigns(query, params) {
        return this.get('/search-campaigns', { query, ...params });
    }
    async searchMembers(query, params) {
        return this.get('/search-members', { query, ...params });
    }
    // ===== PING =====
    async ping() {
        return this.get('/ping');
    }
    async getRoot() {
        return this.get('/');
    }
    // ===== WEBHOOKS =====
    async getWebhooks(listId) {
        return this.get(`/lists/${listId}/webhooks`);
    }
    async getWebhook(listId, webhookId) {
        return this.get(`/lists/${listId}/webhooks/${webhookId}`);
    }
    async createWebhook(listId, data) {
        return this.post(`/lists/${listId}/webhooks`, data);
    }
    async updateWebhook(listId, webhookId, data) {
        return this.patch(`/lists/${listId}/webhooks/${webhookId}`, data);
    }
    async deleteWebhook(listId, webhookId) {
        return this.delete(`/lists/${listId}/webhooks/${webhookId}`);
    }
    // ===== MERGE FIELDS =====
    async getMergeFields(listId, params) {
        return this.get(`/lists/${listId}/merge-fields`, params);
    }
    async getMergeField(listId, mergeId) {
        return this.get(`/lists/${listId}/merge-fields/${mergeId}`);
    }
    async createMergeField(listId, data) {
        return this.post(`/lists/${listId}/merge-fields`, data);
    }
    async updateMergeField(listId, mergeId, data) {
        return this.patch(`/lists/${listId}/merge-fields/${mergeId}`, data);
    }
    async deleteMergeField(listId, mergeId) {
        return this.delete(`/lists/${listId}/merge-fields/${mergeId}`);
    }
    // ===== AUDIENCE STATS =====
    async getAudienceStats(listId) {
        return this.get(`/lists/${listId}`, { fields: 'id,name,stats' });
    }
    async searchMembers2(query, params) {
        return this.get('/search-members', { query, ...params });
    }
}
//# sourceMappingURL=mailchimp.js.map