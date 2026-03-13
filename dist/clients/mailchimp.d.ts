import { MailchimpConfig } from '../types/index.js';
export declare class MailchimpClient {
    private apiKey;
    private server;
    private baseUrl;
    private rateLimitRemaining;
    private rateLimitReset;
    constructor(config: MailchimpConfig);
    /**
     * Make an authenticated request to the Mailchimp API
     */
    private request;
    get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
    post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T>;
    put<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T>;
    patch<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T>;
    delete<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
    /**
     * Fetch all pages of a paginated endpoint
     */
    getAllPages<T>(endpoint: string, params?: Record<string, any>, itemsKey?: string): Promise<T[]>;
    getCampaigns(params?: {
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
    }): Promise<unknown>;
    getCampaign(campaignId: string, params?: {
        fields?: string[];
        exclude_fields?: string[];
    }): Promise<unknown>;
    createCampaign(data: any): Promise<unknown>;
    updateCampaign(campaignId: string, data: any): Promise<unknown>;
    deleteCampaign(campaignId: string): Promise<unknown>;
    sendCampaign(campaignId: string): Promise<unknown>;
    scheduleCampaign(campaignId: string, schedule_time: string, timewarp?: boolean, batch_delivery?: any): Promise<unknown>;
    unscheduleCampaign(campaignId: string): Promise<unknown>;
    pauseCampaign(campaignId: string): Promise<unknown>;
    resumeCampaign(campaignId: string): Promise<unknown>;
    replicateCampaign(campaignId: string): Promise<unknown>;
    testCampaign(campaignId: string, test_emails: string[], send_type: 'html' | 'plaintext'): Promise<unknown>;
    getCampaignContent(campaignId: string): Promise<unknown>;
    setCampaignContent(campaignId: string, data: any): Promise<unknown>;
    getSendChecklist(campaignId: string): Promise<unknown>;
    getLists(params?: {
        count?: number;
        offset?: number;
        before_date_created?: string;
        since_date_created?: string;
        before_campaign_last_sent?: string;
        since_campaign_last_sent?: string;
        email?: string;
        sort_field?: string;
        sort_dir?: 'ASC' | 'DESC';
    }): Promise<unknown>;
    getList(listId: string): Promise<unknown>;
    createList(data: any): Promise<unknown>;
    updateList(listId: string, data: any): Promise<unknown>;
    deleteList(listId: string): Promise<unknown>;
    getListGrowthHistory(listId: string, params?: {
        count?: number;
        offset?: number;
        sort_field?: string;
        sort_dir?: 'ASC' | 'DESC';
    }): Promise<unknown>;
    batchSubscribe(listId: string, members: any[], update_existing?: boolean): Promise<unknown>;
    getMembers(listId: string, params?: {
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
    }): Promise<unknown>;
    getMember(listId: string, subscriberHash: string): Promise<unknown>;
    addMember(listId: string, data: any): Promise<unknown>;
    updateMember(listId: string, subscriberHash: string, data: any): Promise<unknown>;
    addOrUpdateMember(listId: string, subscriberHash: string, data: any): Promise<unknown>;
    deleteMember(listId: string, subscriberHash: string): Promise<unknown>;
    archiveMember(listId: string, subscriberHash: string): Promise<unknown>;
    getMemberActivity(listId: string, subscriberHash: string, params?: {
        count?: number;
        offset?: number;
        fields?: string[];
        exclude_fields?: string[];
    }): Promise<unknown>;
    getMemberGoals(listId: string, subscriberHash: string): Promise<unknown>;
    getMemberTags(listId: string, subscriberHash: string): Promise<unknown>;
    addMemberTags(listId: string, subscriberHash: string, tags: Array<{
        name: string;
        status: 'active' | 'inactive';
    }>): Promise<unknown>;
    getSegments(listId: string, params?: {
        count?: number;
        offset?: number;
        type?: string;
        since_created_at?: string;
        before_created_at?: string;
        since_updated_at?: string;
        before_updated_at?: string;
    }): Promise<unknown>;
    getSegment(listId: string, segmentId: string): Promise<unknown>;
    createSegment(listId: string, data: any): Promise<unknown>;
    updateSegment(listId: string, segmentId: string, data: any): Promise<unknown>;
    deleteSegment(listId: string, segmentId: string): Promise<unknown>;
    batchAddSegmentMembers(listId: string, segmentId: string, members: string[]): Promise<unknown>;
    batchRemoveSegmentMembers(listId: string, segmentId: string, members: string[]): Promise<unknown>;
    getInterestCategories(listId: string, params?: {
        count?: number;
        offset?: number;
        type?: string;
    }): Promise<unknown>;
    getInterests(listId: string, categoryId: string, params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    getTemplates(params?: {
        count?: number;
        offset?: number;
        type?: string;
        category?: string;
        folder_id?: string;
        created_by?: string;
        since_created_at?: string;
        before_created_at?: string;
        sort_field?: string;
        sort_dir?: 'ASC' | 'DESC';
    }): Promise<unknown>;
    getTemplate(templateId: string): Promise<unknown>;
    createTemplate(data: any): Promise<unknown>;
    updateTemplate(templateId: string, data: any): Promise<unknown>;
    deleteTemplate(templateId: string): Promise<unknown>;
    getTemplateDefaultContent(templateId: string): Promise<unknown>;
    getAutomations(params?: {
        count?: number;
        offset?: number;
        before_create_time?: string;
        since_create_time?: string;
        before_start_time?: string;
        since_start_time?: string;
        status?: string;
    }): Promise<unknown>;
    getAutomation(workflowId: string): Promise<unknown>;
    pauseAutomation(workflowId: string): Promise<unknown>;
    startAutomation(workflowId: string): Promise<unknown>;
    getAutomationEmails(workflowId: string): Promise<unknown>;
    getAutomationEmail(workflowId: string, emailId: string): Promise<unknown>;
    pauseAutomationEmail(workflowId: string, emailId: string): Promise<unknown>;
    startAutomationEmail(workflowId: string, emailId: string): Promise<unknown>;
    getAutomationQueue(workflowId: string, emailId: string): Promise<unknown>;
    addToAutomationQueue(workflowId: string, emailId: string, email_address: string): Promise<unknown>;
    getReports(params?: {
        count?: number;
        offset?: number;
        type?: string;
        before_send_time?: string;
        since_send_time?: string;
    }): Promise<unknown>;
    getReport(campaignId: string): Promise<unknown>;
    getClickReports(campaignId: string, params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    getClickReport(campaignId: string, linkId: string): Promise<unknown>;
    getOpenDetails(campaignId: string, params?: {
        count?: number;
        offset?: number;
        since?: string;
    }): Promise<unknown>;
    getDomainPerformance(campaignId: string): Promise<unknown>;
    getEmailActivity(campaignId: string, subscriberHash: string): Promise<unknown>;
    getSubReports(campaignId: string): Promise<unknown>;
    getLandingPages(params?: {
        count?: number;
        offset?: number;
        sort_field?: string;
        sort_dir?: 'ASC' | 'DESC';
    }): Promise<unknown>;
    getLandingPage(pageId: string): Promise<unknown>;
    createLandingPage(data: any): Promise<unknown>;
    updateLandingPage(pageId: string, data: any): Promise<unknown>;
    deleteLandingPage(pageId: string): Promise<unknown>;
    publishLandingPage(pageId: string): Promise<unknown>;
    unpublishLandingPage(pageId: string): Promise<unknown>;
    getLandingPageContent(pageId: string): Promise<unknown>;
    getStores(params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    getStore(storeId: string): Promise<unknown>;
    addStore(data: any): Promise<unknown>;
    updateStore(storeId: string, data: any): Promise<unknown>;
    deleteStore(storeId: string): Promise<unknown>;
    getProducts(storeId: string, params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    getProduct(storeId: string, productId: string): Promise<unknown>;
    addProduct(storeId: string, data: any): Promise<unknown>;
    updateProduct(storeId: string, productId: string, data: any): Promise<unknown>;
    deleteProduct(storeId: string, productId: string): Promise<unknown>;
    getOrders(storeId: string, params?: {
        count?: number;
        offset?: number;
        campaign_id?: string;
        customer_id?: string;
        has_outreach?: boolean;
    }): Promise<unknown>;
    getOrder(storeId: string, orderId: string): Promise<unknown>;
    addOrder(storeId: string, data: any): Promise<unknown>;
    updateOrder(storeId: string, orderId: string, data: any): Promise<unknown>;
    deleteOrder(storeId: string, orderId: string): Promise<unknown>;
    getCarts(storeId: string, params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    getCart(storeId: string, cartId: string): Promise<unknown>;
    addCart(storeId: string, data: any): Promise<unknown>;
    updateCart(storeId: string, cartId: string, data: any): Promise<unknown>;
    deleteCart(storeId: string, cartId: string): Promise<unknown>;
    getCustomers(storeId: string, params?: {
        count?: number;
        offset?: number;
        email_address?: string;
    }): Promise<unknown>;
    getCustomer(storeId: string, customerId: string): Promise<unknown>;
    addCustomer(storeId: string, data: any): Promise<unknown>;
    updateCustomer(storeId: string, customerId: string, data: any): Promise<unknown>;
    deleteCustomer(storeId: string, customerId: string): Promise<unknown>;
    getPromoRules(storeId: string, params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    getPromoRule(storeId: string, ruleId: string): Promise<unknown>;
    addPromoRule(storeId: string, data: any): Promise<unknown>;
    getPromoCodes(storeId: string, ruleId: string, params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    getPromoCode(storeId: string, ruleId: string, codeId: string): Promise<unknown>;
    addPromoCode(storeId: string, ruleId: string, data: any): Promise<unknown>;
    searchTags(listId: string, name: string): Promise<unknown>;
    searchCampaigns(query: string, params?: {
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    searchMembers(query: string, params?: {
        list_id?: string;
        count?: number;
        offset?: number;
    }): Promise<unknown>;
    ping(): Promise<unknown>;
    getRoot(): Promise<unknown>;
    getWebhooks(listId: string): Promise<unknown>;
    getWebhook(listId: string, webhookId: string): Promise<unknown>;
    createWebhook(listId: string, data: {
        url: string;
        events?: {
            subscribe?: boolean;
            unsubscribe?: boolean;
            profile?: boolean;
            cleaned?: boolean;
            upemail?: boolean;
            campaign?: boolean;
        };
        sources?: {
            user?: boolean;
            admin?: boolean;
            api?: boolean;
        };
    }): Promise<unknown>;
    updateWebhook(listId: string, webhookId: string, data: {
        url?: string;
        events?: {
            subscribe?: boolean;
            unsubscribe?: boolean;
            profile?: boolean;
            cleaned?: boolean;
            upemail?: boolean;
            campaign?: boolean;
        };
        sources?: {
            user?: boolean;
            admin?: boolean;
            api?: boolean;
        };
    }): Promise<unknown>;
    deleteWebhook(listId: string, webhookId: string): Promise<unknown>;
    getMergeFields(listId: string, params?: {
        count?: number;
        offset?: number;
        type?: string;
        required?: boolean;
    }): Promise<unknown>;
    getMergeField(listId: string, mergeId: number): Promise<unknown>;
    createMergeField(listId: string, data: {
        tag: string;
        name: string;
        type: string;
        required?: boolean;
        default_value?: string;
        public?: boolean;
        display_order?: number;
        options?: {
            default_country?: number;
            phone_format?: string;
            date_format?: string;
            choices?: string[];
            size?: number;
        };
        help_text?: string;
    }): Promise<unknown>;
    updateMergeField(listId: string, mergeId: number, data: {
        tag?: string;
        name?: string;
        required?: boolean;
        default_value?: string;
        public?: boolean;
        display_order?: number;
        options?: Record<string, any>;
        help_text?: string;
    }): Promise<unknown>;
    deleteMergeField(listId: string, mergeId: number): Promise<unknown>;
    getAudienceStats(listId: string): Promise<unknown>;
    searchMembers2(query: string, params?: {
        list_id?: string;
        count?: number;
        offset?: number;
    }): Promise<unknown>;
}
//# sourceMappingURL=mailchimp.d.ts.map