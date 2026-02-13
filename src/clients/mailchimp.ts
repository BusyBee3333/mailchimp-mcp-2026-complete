import { MailchimpConfig, MailchimpError, PaginatedResponse } from '../types/index.js';

export class MailchimpClient {
  private apiKey: string;
  private server: string;
  private baseUrl: string;
  private rateLimitRemaining: number = 10;
  private rateLimitReset: number = Date.now();

  constructor(config: MailchimpConfig) {
    this.apiKey = config.apiKey;
    
    // Extract data center from API key (format: xxxxxxxxxxxxxxxxxxxxx-us19)
    if (config.server) {
      this.server = config.server;
    } else {
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
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T> {
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString('base64')}`,
      'User-Agent': 'Mailchimp-MCP-Server/1.0'
    };

    const options: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
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
      
      if (remaining) this.rateLimitRemaining = parseInt(remaining);
      if (reset) this.rateLimitReset = new Date(reset).getTime();

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData: MailchimpError;
        try {
          errorData = await response.json() as MailchimpError;
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        throw new Error(
          `Mailchimp API Error (${errorData.status}): ${errorData.title} - ${errorData.detail}`
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const result = await response.json();
      return result as T;
    } catch (error: any) {
      if (error.message?.includes('Mailchimp API Error')) {
        throw error;
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  // ===== HTTP METHOD HELPERS =====

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  async post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('POST', endpoint, data, params);
  }

  async put<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('PUT', endpoint, data, params);
  }

  async patch<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, params);
  }

  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, params);
  }

  // ===== PAGINATION HELPER =====

  /**
   * Fetch all pages of a paginated endpoint
   */
  async getAllPages<T>(
    endpoint: string,
    params: Record<string, any> = {},
    itemsKey: string = 'items'
  ): Promise<T[]> {
    const allItems: T[] = [];
    let offset = 0;
    const count = params.count || 100; // Default page size
    
    while (true) {
      const response = await this.get<PaginatedResponse<T>>(endpoint, {
        ...params,
        offset,
        count
      });

      const items = response[itemsKey] as T[];
      if (!items || items.length === 0) break;
      
      allItems.push(...items);
      
      // Check if we've fetched all items
      if (allItems.length >= response.total_items) break;
      
      offset += count;
    }

    return allItems;
  }

  // ===== CAMPAIGNS =====

  async getCampaigns(params?: {
    count?: number;
    offset?: number;
    type?: string;
    status?: string;
    before_send_time?: string;
    since_send_time?: string;
    before_create_time?: string;
    since_create_time?: string;
    list_id?: string;
    folder_id?: string;
    sort_field?: string;
    sort_dir?: 'ASC' | 'DESC';
  }) {
    return this.get('/campaigns', params);
  }

  async getCampaign(campaignId: string, params?: { fields?: string[]; exclude_fields?: string[] }) {
    return this.get(`/campaigns/${campaignId}`, params);
  }

  async createCampaign(data: any) {
    return this.post('/campaigns', data);
  }

  async updateCampaign(campaignId: string, data: any) {
    return this.patch(`/campaigns/${campaignId}`, data);
  }

  async deleteCampaign(campaignId: string) {
    return this.delete(`/campaigns/${campaignId}`);
  }

  async sendCampaign(campaignId: string) {
    return this.post(`/campaigns/${campaignId}/actions/send`);
  }

  async scheduleCampaign(campaignId: string, schedule_time: string, timewarp?: boolean, batch_delivery?: any) {
    return this.post(`/campaigns/${campaignId}/actions/schedule`, {
      schedule_time,
      timewarp,
      batch_delivery
    });
  }

  async unscheduleCampaign(campaignId: string) {
    return this.post(`/campaigns/${campaignId}/actions/unschedule`);
  }

  async pauseCampaign(campaignId: string) {
    return this.post(`/campaigns/${campaignId}/actions/pause`);
  }

  async resumeCampaign(campaignId: string) {
    return this.post(`/campaigns/${campaignId}/actions/resume`);
  }

  async replicateCampaign(campaignId: string) {
    return this.post(`/campaigns/${campaignId}/actions/replicate`);
  }

  async testCampaign(campaignId: string, test_emails: string[], send_type: 'html' | 'plaintext') {
    return this.post(`/campaigns/${campaignId}/actions/test`, { test_emails, send_type });
  }

  async getCampaignContent(campaignId: string) {
    return this.get(`/campaigns/${campaignId}/content`);
  }

  async setCampaignContent(campaignId: string, data: any) {
    return this.put(`/campaigns/${campaignId}/content`, data);
  }

  async getSendChecklist(campaignId: string) {
    return this.get(`/campaigns/${campaignId}/send-checklist`);
  }

  // ===== LISTS / AUDIENCES =====

  async getLists(params?: {
    count?: number;
    offset?: number;
    before_date_created?: string;
    since_date_created?: string;
    before_campaign_last_sent?: string;
    since_campaign_last_sent?: string;
    email?: string;
    sort_field?: string;
    sort_dir?: 'ASC' | 'DESC';
  }) {
    return this.get('/lists', params);
  }

  async getList(listId: string) {
    return this.get(`/lists/${listId}`);
  }

  async createList(data: any) {
    return this.post('/lists', data);
  }

  async updateList(listId: string, data: any) {
    return this.patch(`/lists/${listId}`, data);
  }

  async deleteList(listId: string) {
    return this.delete(`/lists/${listId}`);
  }

  async getListGrowthHistory(listId: string, params?: { count?: number; offset?: number; sort_field?: string; sort_dir?: 'ASC' | 'DESC' }) {
    return this.get(`/lists/${listId}/growth-history`, params);
  }

  async batchSubscribe(listId: string, members: any[], update_existing?: boolean) {
    return this.post(`/lists/${listId}`, {
      members,
      update_existing
    });
  }

  // ===== MEMBERS =====

  async getMembers(listId: string, params?: {
    count?: number;
    offset?: number;
    email_type?: string;
    status?: string;
    since_timestamp_opt?: string;
    before_timestamp_opt?: string;
    since_last_changed?: string;
    before_last_changed?: string;
    unique_email_id?: string;
    vip_only?: boolean;
    interest_category_id?: string;
    interest_ids?: string;
    interest_match?: 'any' | 'all';
    sort_field?: string;
    sort_dir?: 'ASC' | 'DESC';
  }) {
    return this.get(`/lists/${listId}/members`, params);
  }

  async getMember(listId: string, subscriberHash: string) {
    return this.get(`/lists/${listId}/members/${subscriberHash}`);
  }

  async addMember(listId: string, data: any) {
    return this.post(`/lists/${listId}/members`, data);
  }

  async updateMember(listId: string, subscriberHash: string, data: any) {
    return this.patch(`/lists/${listId}/members/${subscriberHash}`, data);
  }

  async addOrUpdateMember(listId: string, subscriberHash: string, data: any) {
    return this.put(`/lists/${listId}/members/${subscriberHash}`, data);
  }

  async deleteMember(listId: string, subscriberHash: string) {
    return this.delete(`/lists/${listId}/members/${subscriberHash}`);
  }

  async archiveMember(listId: string, subscriberHash: string) {
    return this.delete(`/lists/${listId}/members/${subscriberHash}/actions/delete-permanent`);
  }

  async getMemberActivity(listId: string, subscriberHash: string, params?: { count?: number; offset?: number; fields?: string[]; exclude_fields?: string[] }) {
    return this.get(`/lists/${listId}/members/${subscriberHash}/activity`, params);
  }

  async getMemberGoals(listId: string, subscriberHash: string) {
    return this.get(`/lists/${listId}/members/${subscriberHash}/goals`);
  }

  async getMemberTags(listId: string, subscriberHash: string) {
    return this.get(`/lists/${listId}/members/${subscriberHash}/tags`);
  }

  async addMemberTags(listId: string, subscriberHash: string, tags: Array<{ name: string; status: 'active' | 'inactive' }>) {
    return this.post(`/lists/${listId}/members/${subscriberHash}/tags`, { tags });
  }

  // ===== SEGMENTS =====

  async getSegments(listId: string, params?: { count?: number; offset?: number; type?: string; since_created_at?: string; before_created_at?: string; since_updated_at?: string; before_updated_at?: string }) {
    return this.get(`/lists/${listId}/segments`, params);
  }

  async getSegment(listId: string, segmentId: string) {
    return this.get(`/lists/${listId}/segments/${segmentId}`);
  }

  async createSegment(listId: string, data: any) {
    return this.post(`/lists/${listId}/segments`, data);
  }

  async updateSegment(listId: string, segmentId: string, data: any) {
    return this.patch(`/lists/${listId}/segments/${segmentId}`, data);
  }

  async deleteSegment(listId: string, segmentId: string) {
    return this.delete(`/lists/${listId}/segments/${segmentId}`);
  }

  async batchAddSegmentMembers(listId: string, segmentId: string, members: string[]) {
    return this.post(`/lists/${listId}/segments/${segmentId}/members`, {
      members_to_add: members
    });
  }

  async batchRemoveSegmentMembers(listId: string, segmentId: string, members: string[]) {
    return this.post(`/lists/${listId}/segments/${segmentId}/members`, {
      members_to_remove: members
    });
  }

  // ===== INTEREST CATEGORIES & INTERESTS =====

  async getInterestCategories(listId: string, params?: { count?: number; offset?: number; type?: string }) {
    return this.get(`/lists/${listId}/interest-categories`, params);
  }

  async getInterests(listId: string, categoryId: string, params?: { count?: number; offset?: number }) {
    return this.get(`/lists/${listId}/interest-categories/${categoryId}/interests`, params);
  }

  // ===== TEMPLATES =====

  async getTemplates(params?: { count?: number; offset?: number; type?: string; category?: string; folder_id?: string; created_by?: string; since_created_at?: string; before_created_at?: string; sort_field?: string; sort_dir?: 'ASC' | 'DESC' }) {
    return this.get('/templates', params);
  }

  async getTemplate(templateId: string) {
    return this.get(`/templates/${templateId}`);
  }

  async createTemplate(data: any) {
    return this.post('/templates', data);
  }

  async updateTemplate(templateId: string, data: any) {
    return this.patch(`/templates/${templateId}`, data);
  }

  async deleteTemplate(templateId: string) {
    return this.delete(`/templates/${templateId}`);
  }

  async getTemplateDefaultContent(templateId: string) {
    return this.get(`/templates/${templateId}/default-content`);
  }

  // ===== AUTOMATIONS =====

  async getAutomations(params?: { count?: number; offset?: number; before_create_time?: string; since_create_time?: string; before_start_time?: string; since_start_time?: string; status?: string }) {
    return this.get('/automations', params);
  }

  async getAutomation(workflowId: string) {
    return this.get(`/automations/${workflowId}`);
  }

  async pauseAutomation(workflowId: string) {
    return this.post(`/automations/${workflowId}/actions/pause-all-emails`);
  }

  async startAutomation(workflowId: string) {
    return this.post(`/automations/${workflowId}/actions/start-all-emails`);
  }

  async getAutomationEmails(workflowId: string) {
    return this.get(`/automations/${workflowId}/emails`);
  }

  async getAutomationEmail(workflowId: string, emailId: string) {
    return this.get(`/automations/${workflowId}/emails/${emailId}`);
  }

  async pauseAutomationEmail(workflowId: string, emailId: string) {
    return this.post(`/automations/${workflowId}/emails/${emailId}/actions/pause`);
  }

  async startAutomationEmail(workflowId: string, emailId: string) {
    return this.post(`/automations/${workflowId}/emails/${emailId}/actions/start`);
  }

  async getAutomationQueue(workflowId: string, emailId: string) {
    return this.get(`/automations/${workflowId}/emails/${emailId}/queue`);
  }

  async addToAutomationQueue(workflowId: string, emailId: string, email_address: string) {
    return this.post(`/automations/${workflowId}/emails/${emailId}/queue`, { email_address });
  }

  // ===== REPORTS =====

  async getReports(params?: { count?: number; offset?: number; type?: string; before_send_time?: string; since_send_time?: string }) {
    return this.get('/reports', params);
  }

  async getReport(campaignId: string) {
    return this.get(`/reports/${campaignId}`);
  }

  async getClickReports(campaignId: string, params?: { count?: number; offset?: number }) {
    return this.get(`/reports/${campaignId}/click-details`, params);
  }

  async getClickReport(campaignId: string, linkId: string) {
    return this.get(`/reports/${campaignId}/click-details/${linkId}`);
  }

  async getOpenDetails(campaignId: string, params?: { count?: number; offset?: number; since?: string }) {
    return this.get(`/reports/${campaignId}/open-details`, params);
  }

  async getDomainPerformance(campaignId: string) {
    return this.get(`/reports/${campaignId}/domain-performance`);
  }

  async getEmailActivity(campaignId: string, subscriberHash: string) {
    return this.get(`/reports/${campaignId}/email-activity/${subscriberHash}`);
  }

  async getSubReports(campaignId: string) {
    return this.get(`/reports/${campaignId}/sub-reports`);
  }

  // ===== LANDING PAGES =====

  async getLandingPages(params?: { count?: number; offset?: number; sort_field?: string; sort_dir?: 'ASC' | 'DESC' }) {
    return this.get('/landing-pages', params);
  }

  async getLandingPage(pageId: string) {
    return this.get(`/landing-pages/${pageId}`);
  }

  async createLandingPage(data: any) {
    return this.post('/landing-pages', data);
  }

  async updateLandingPage(pageId: string, data: any) {
    return this.patch(`/landing-pages/${pageId}`, data);
  }

  async deleteLandingPage(pageId: string) {
    return this.delete(`/landing-pages/${pageId}`);
  }

  async publishLandingPage(pageId: string) {
    return this.post(`/landing-pages/${pageId}/actions/publish`);
  }

  async unpublishLandingPage(pageId: string) {
    return this.post(`/landing-pages/${pageId}/actions/unpublish`);
  }

  async getLandingPageContent(pageId: string) {
    return this.get(`/landing-pages/${pageId}/content`);
  }

  // ===== ECOMMERCE =====

  async getStores(params?: { count?: number; offset?: number }) {
    return this.get('/ecommerce/stores', params);
  }

  async getStore(storeId: string) {
    return this.get(`/ecommerce/stores/${storeId}`);
  }

  async addStore(data: any) {
    return this.post('/ecommerce/stores', data);
  }

  async updateStore(storeId: string, data: any) {
    return this.patch(`/ecommerce/stores/${storeId}`, data);
  }

  async deleteStore(storeId: string) {
    return this.delete(`/ecommerce/stores/${storeId}`);
  }

  async getProducts(storeId: string, params?: { count?: number; offset?: number }) {
    return this.get(`/ecommerce/stores/${storeId}/products`, params);
  }

  async getProduct(storeId: string, productId: string) {
    return this.get(`/ecommerce/stores/${storeId}/products/${productId}`);
  }

  async addProduct(storeId: string, data: any) {
    return this.post(`/ecommerce/stores/${storeId}/products`, data);
  }

  async updateProduct(storeId: string, productId: string, data: any) {
    return this.patch(`/ecommerce/stores/${storeId}/products/${productId}`, data);
  }

  async deleteProduct(storeId: string, productId: string) {
    return this.delete(`/ecommerce/stores/${storeId}/products/${productId}`);
  }

  async getOrders(storeId: string, params?: { count?: number; offset?: number; campaign_id?: string; customer_id?: string; has_outreach?: boolean }) {
    return this.get(`/ecommerce/stores/${storeId}/orders`, params);
  }

  async getOrder(storeId: string, orderId: string) {
    return this.get(`/ecommerce/stores/${storeId}/orders/${orderId}`);
  }

  async addOrder(storeId: string, data: any) {
    return this.post(`/ecommerce/stores/${storeId}/orders`, data);
  }

  async updateOrder(storeId: string, orderId: string, data: any) {
    return this.patch(`/ecommerce/stores/${storeId}/orders/${orderId}`, data);
  }

  async deleteOrder(storeId: string, orderId: string) {
    return this.delete(`/ecommerce/stores/${storeId}/orders/${orderId}`);
  }

  async getCarts(storeId: string, params?: { count?: number; offset?: number }) {
    return this.get(`/ecommerce/stores/${storeId}/carts`, params);
  }

  async getCart(storeId: string, cartId: string) {
    return this.get(`/ecommerce/stores/${storeId}/carts/${cartId}`);
  }

  async addCart(storeId: string, data: any) {
    return this.post(`/ecommerce/stores/${storeId}/carts`, data);
  }

  async updateCart(storeId: string, cartId: string, data: any) {
    return this.patch(`/ecommerce/stores/${storeId}/carts/${cartId}`, data);
  }

  async deleteCart(storeId: string, cartId: string) {
    return this.delete(`/ecommerce/stores/${storeId}/carts/${cartId}`);
  }

  async getCustomers(storeId: string, params?: { count?: number; offset?: number; email_address?: string }) {
    return this.get(`/ecommerce/stores/${storeId}/customers`, params);
  }

  async getCustomer(storeId: string, customerId: string) {
    return this.get(`/ecommerce/stores/${storeId}/customers/${customerId}`);
  }

  async addCustomer(storeId: string, data: any) {
    return this.post(`/ecommerce/stores/${storeId}/customers`, data);
  }

  async updateCustomer(storeId: string, customerId: string, data: any) {
    return this.patch(`/ecommerce/stores/${storeId}/customers/${customerId}`, data);
  }

  async deleteCustomer(storeId: string, customerId: string) {
    return this.delete(`/ecommerce/stores/${storeId}/customers/${customerId}`);
  }

  async getPromoRules(storeId: string, params?: { count?: number; offset?: number }) {
    return this.get(`/ecommerce/stores/${storeId}/promo-rules`, params);
  }

  async getPromoRule(storeId: string, ruleId: string) {
    return this.get(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}`);
  }

  async addPromoRule(storeId: string, data: any) {
    return this.post(`/ecommerce/stores/${storeId}/promo-rules`, data);
  }

  async getPromoCodes(storeId: string, ruleId: string, params?: { count?: number; offset?: number }) {
    return this.get(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}/promo-codes`, params);
  }

  async getPromoCode(storeId: string, ruleId: string, codeId: string) {
    return this.get(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}/promo-codes/${codeId}`);
  }

  async addPromoCode(storeId: string, ruleId: string, data: any) {
    return this.post(`/ecommerce/stores/${storeId}/promo-rules/${ruleId}/promo-codes`, data);
  }

  // ===== TAGS =====

  async searchTags(listId: string, name: string) {
    return this.get(`/lists/${listId}/tag-search`, { name });
  }

  // ===== SEARCH =====

  async searchCampaigns(query: string, params?: { count?: number; offset?: number }) {
    return this.get('/search-campaigns', { query, ...params });
  }

  async searchMembers(query: string, params?: { list_id?: string; count?: number; offset?: number }) {
    return this.get('/search-members', { query, ...params });
  }

  // ===== PING =====

  async ping() {
    return this.get('/ping');
  }

  async getRoot() {
    return this.get('/');
  }
}
