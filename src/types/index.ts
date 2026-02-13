// Mailchimp Marketing API v3 - Complete Type Definitions

export interface MailchimpConfig {
  apiKey: string;
  server?: string; // auto-extracted from API key if not provided
}

export interface MailchimpError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

export interface PaginatedResponse<T> {
  [key: string]: any;
  total_items: number;
  _links: Link[];
}

export interface Link {
  rel: string;
  href: string;
  method: string;
  targetSchema?: string;
  schema?: string;
}

// ===== CAMPAIGNS =====

export interface Campaign {
  id: string;
  web_id: number;
  parent_campaign_id?: string;
  type: 'regular' | 'plaintext' | 'absplit' | 'rss' | 'variate';
  create_time: string;
  archive_url: string;
  long_archive_url: string;
  status: 'save' | 'paused' | 'schedule' | 'sending' | 'sent';
  emails_sent: number;
  send_time?: string;
  content_type: 'template' | 'html' | 'url' | 'multichannel';
  needs_block_refresh?: boolean;
  resendable?: boolean;
  recipients: CampaignRecipients;
  settings: CampaignSettings;
  variate_settings?: VariateSettings;
  tracking?: CampaignTracking;
  rss_opts?: RSSOptions;
  ab_split_opts?: ABSplitOptions;
  social_card?: SocialCard;
  report_summary?: ReportSummary;
  delivery_status?: DeliveryStatus;
  _links: Link[];
}

export interface CampaignRecipients {
  list_id: string;
  list_is_active?: boolean;
  list_name?: string;
  segment_text?: string;
  recipient_count?: number;
  segment_opts?: SegmentOptions;
}

export interface CampaignSettings {
  subject_line?: string;
  preview_text?: string;
  title?: string;
  from_name?: string;
  reply_to?: string;
  use_conversation?: boolean;
  to_name?: string;
  folder_id?: string;
  authenticate?: boolean;
  auto_footer?: boolean;
  inline_css?: boolean;
  auto_tweet?: boolean;
  fb_comments?: boolean;
  timewarp?: boolean;
  template_id?: number;
  drag_and_drop?: boolean;
}

export interface CampaignTracking {
  opens?: boolean;
  html_clicks?: boolean;
  text_clicks?: boolean;
  goal_tracking?: boolean;
  ecomm360?: boolean;
  google_analytics?: string;
  clicktale?: string;
  salesforce?: SalesforceTracking;
  capsule?: CapsuleTracking;
}

export interface SalesforceTracking {
  campaign?: boolean;
  notes?: boolean;
}

export interface CapsuleTracking {
  notes?: boolean;
}

export interface VariateSettings {
  winning_combination_id?: string;
  winning_campaign_id?: string;
  winner_criteria?: 'opens' | 'clicks' | 'manual' | 'total_revenue';
  wait_time?: number;
  test_size?: number;
  subject_lines?: string[];
  send_times?: string[];
  from_names?: string[];
  reply_to_addresses?: string[];
  contents?: string[];
  combinations?: VariateCombination[];
}

export interface VariateCombination {
  id: string;
  subject_line?: number;
  send_time?: number;
  from_name?: number;
  reply_to?: number;
  content_description?: number;
  recipients?: number;
}

export interface RSSOptions {
  feed_url: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  schedule?: RSSSchedule;
  last_sent?: string;
  constrain_rss_img?: boolean;
}

export interface RSSSchedule {
  hour?: number;
  daily_send?: DailySend;
  weekly_send_day?: string;
  monthly_send_date?: number;
}

export interface DailySend {
  sunday?: boolean;
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
}

export interface ABSplitOptions {
  split_test: 'subject' | 'from_name' | 'schedule';
  pick_winner?: 'opens' | 'clicks' | 'manual';
  wait_units?: 'hours' | 'days';
  wait_time?: number;
  split_size?: number;
  from_name_a?: string;
  from_name_b?: string;
  reply_email_a?: string;
  reply_email_b?: string;
  subject_a?: string;
  subject_b?: string;
  send_time_a?: string;
  send_time_b?: string;
  send_time_winner?: string;
}

export interface SocialCard {
  image_url?: string;
  description?: string;
  title?: string;
}

export interface ReportSummary {
  opens: number;
  unique_opens: number;
  open_rate: number;
  clicks: number;
  subscriber_clicks: number;
  click_rate: number;
  ecommerce?: EcommerceReport;
}

export interface DeliveryStatus {
  enabled?: boolean;
  can_cancel?: boolean;
  status?: 'delivering' | 'delivered' | 'canceling' | 'canceled';
  emails_sent?: number;
  emails_canceled?: number;
}

export interface CampaignContent {
  variate_contents?: VariateContent[];
  plain_text?: string;
  html?: string;
  archive_html?: string;
  _links?: Link[];
}

export interface VariateContent {
  content_label: string;
  plain_text?: string;
  html?: string;
  url?: string;
}

export interface SendChecklist {
  is_ready: boolean;
  items: ChecklistItem[];
  _links: Link[];
}

export interface ChecklistItem {
  type: 'success' | 'warning' | 'error';
  id: number;
  heading: string;
  details: string;
}

// ===== LISTS / AUDIENCES =====

export interface List {
  id: string;
  web_id: number;
  name: string;
  contact: ListContact;
  permission_reminder: string;
  use_archive_bar?: boolean;
  campaign_defaults: CampaignDefaults;
  notify_on_subscribe?: string;
  notify_on_unsubscribe?: string;
  date_created: string;
  list_rating: number;
  email_type_option: boolean;
  subscribe_url_short: string;
  subscribe_url_long: string;
  beamer_address: string;
  visibility: 'pub' | 'prv';
  double_optin?: boolean;
  has_welcome?: boolean;
  marketing_permissions?: boolean;
  modules: string[];
  stats: ListStats;
  _links: Link[];
}

export interface ListContact {
  company: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface CampaignDefaults {
  from_name: string;
  from_email: string;
  subject: string;
  language: string;
}

export interface ListStats {
  member_count: number;
  total_contacts: number;
  unsubscribe_count: number;
  cleaned_count: number;
  member_count_since_send: number;
  unsubscribe_count_since_send: number;
  cleaned_count_since_send: number;
  campaign_count: number;
  campaign_last_sent?: string;
  merge_field_count: number;
  avg_sub_rate: number;
  avg_unsub_rate: number;
  target_sub_rate: number;
  open_rate: number;
  click_rate: number;
  last_sub_date?: string;
  last_unsub_date?: string;
}

export interface GrowthHistory {
  list_id: string;
  month: string;
  existing: number;
  imports: number;
  optins: number;
  _links: Link[];
}

// ===== MEMBERS =====

export interface Member {
  id: string;
  email_address: string;
  unique_email_id: string;
  contact_id: string;
  full_name?: string;
  web_id: number;
  email_type: 'html' | 'text';
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional' | 'archived';
  unsubscribe_reason?: string;
  consents_to_one_to_one_messaging?: boolean;
  merge_fields: { [key: string]: any };
  interests?: { [key: string]: boolean };
  stats: MemberStats;
  ip_signup?: string;
  timestamp_signup?: string;
  ip_opt?: string;
  timestamp_opt?: string;
  member_rating: number;
  last_changed: string;
  language?: string;
  vip?: boolean;
  email_client?: string;
  location?: MemberLocation;
  marketing_permissions?: MarketingPermission[];
  last_note?: MemberNote;
  source?: string;
  tags_count?: number;
  tags?: Tag[];
  list_id: string;
  _links: Link[];
}

export interface MemberStats {
  avg_open_rate: number;
  avg_click_rate: number;
  ecommerce_data?: EcommerceData;
}

export interface MemberLocation {
  latitude: number;
  longitude: number;
  gmtoff: number;
  dstoff: number;
  country_code: string;
  timezone: string;
  region?: string;
}

export interface MarketingPermission {
  marketing_permission_id: string;
  text: string;
  enabled: boolean;
}

export interface MemberNote {
  note_id: number;
  created_at: string;
  created_by: string;
  note: string;
}

export interface MemberActivity {
  action: string;
  timestamp: string;
  url?: string;
  type?: string;
  campaign_id?: string;
  title?: string;
  parent_campaign?: string;
}

export interface MemberTag {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

// ===== SEGMENTS =====

export interface Segment {
  id: number;
  name: string;
  member_count: number;
  type: 'saved' | 'static' | 'fuzzy';
  created_at: string;
  updated_at: string;
  options?: SegmentOptions;
  list_id: string;
  _links: Link[];
}

export interface SegmentOptions {
  match?: 'any' | 'all';
  conditions?: SegmentCondition[];
  saved_segment_id?: number;
}

export interface SegmentCondition {
  condition_type: string;
  field: string;
  op: string;
  value?: string;
  extra?: string;
}

// ===== INTEREST CATEGORIES & INTERESTS =====

export interface InterestCategory {
  list_id: string;
  id: string;
  title: string;
  display_order: number;
  type: 'checkboxes' | 'dropdown' | 'radio' | 'hidden';
  _links: Link[];
}

export interface Interest {
  category_id: string;
  list_id: string;
  id: string;
  name: string;
  subscriber_count: string;
  display_order: number;
  _links: Link[];
}

// ===== TEMPLATES =====

export interface Template {
  id: number;
  type: 'user' | 'base' | 'gallery';
  name: string;
  drag_and_drop?: boolean;
  responsive?: boolean;
  category?: string;
  date_created: string;
  date_edited?: string;
  created_by: string;
  edited_by?: string;
  active?: boolean;
  folder_id?: string;
  thumbnail?: string;
  share_url?: string;
  content_type?: 'template' | 'multichannel';
  _links: Link[];
}

export interface TemplateDefaultContent {
  html?: string;
  sections?: { [key: string]: string };
  _links?: Link[];
}

// ===== AUTOMATIONS =====

export interface Automation {
  id: string;
  create_time: string;
  start_time?: string;
  status: 'save' | 'paused' | 'sending';
  emails_sent: number;
  recipients: AutomationRecipients;
  settings: AutomationSettings;
  tracking?: CampaignTracking;
  trigger_settings?: TriggerSettings;
  report_summary?: ReportSummary;
  _links: Link[];
}

export interface AutomationRecipients {
  list_id: string;
  list_is_active?: boolean;
  list_name?: string;
  segment_opts?: SegmentOptions;
  store_id?: string;
}

export interface AutomationSettings {
  title?: string;
  from_name?: string;
  reply_to?: string;
  use_conversation?: boolean;
  to_name?: string;
  authenticate?: boolean;
  auto_footer?: boolean;
  inline_css?: boolean;
}

export interface TriggerSettings {
  workflow_type: 'abandonedBrowse' | 'abandonedCart' | 'api' | 'bestCustomers' | 'categoryFollowup' | 'dateAdded' | 'emailFollowup' | 'emailSeries' | 'groupAdd' | 'groupRemove' | 'mandrill' | 'productFollowup' | 'purchaseFollowup' | 'recurringEvent' | 'specialEvent' | 'visitUrl' | 'welcomeSeries';
  workflow_title?: string;
  runtime?: Runtime;
  workflow_emails_count?: number;
}

export interface Runtime {
  days?: string[];
  hours?: Hours;
}

export interface Hours {
  type?: 'send_asap' | 'send_between' | 'send_at';
  send_at?: string;
}

export interface AutomationEmail {
  id: string;
  web_id: number;
  workflow_id: string;
  position: number;
  delay: EmailDelay;
  create_time: string;
  start_time?: string;
  archive_url: string;
  status: 'save' | 'paused' | 'sending';
  emails_sent: number;
  send_time?: string;
  content_type: 'template' | 'html' | 'url';
  needs_block_refresh?: boolean;
  has_logo_merge_tag?: boolean;
  recipients: AutomationRecipients;
  settings: AutomationEmailSettings;
  tracking?: CampaignTracking;
  social_card?: SocialCard;
  report_summary?: ReportSummary;
  _links: Link[];
}

export interface EmailDelay {
  amount: number;
  type: 'now' | 'day' | 'hour' | 'week';
  direction: 'before' | 'after';
  action: string;
}

export interface AutomationEmailSettings {
  subject_line?: string;
  preview_text?: string;
  title?: string;
  from_name?: string;
  reply_to?: string;
  authenticate?: boolean;
  auto_footer?: boolean;
  inline_css?: boolean;
  auto_tweet?: boolean;
  fb_comments?: boolean;
  template_id?: number;
  drag_and_drop?: boolean;
}

export interface AutomationQueue {
  workflow_id: string;
  email_id: string;
  list_id: string;
  list_is_active?: boolean;
  email_address: string;
  id: string;
  next_send?: string;
  _links: Link[];
}

// ===== REPORTS =====

export interface CampaignReport {
  id: string;
  campaign_title: string;
  type: string;
  list_id: string;
  list_is_active: boolean;
  list_name: string;
  subject_line: string;
  preview_text?: string;
  emails_sent: number;
  abuse_reports: number;
  unsubscribed: number;
  send_time: string;
  rss_last_send?: string;
  bounces: Bounces;
  forwards: Forwards;
  opens: Opens;
  clicks: Clicks;
  facebook_likes?: FacebookLikes;
  industry_stats?: IndustryStats;
  list_stats?: ReportListStats;
  ab_split?: ABSplitStats;
  timewarp?: TimewarpStats[];
  timeseries?: Timeseries[];
  share_report?: ShareReport;
  ecommerce?: EcommerceReport;
  delivery_status?: DeliveryStatus;
  _links: Link[];
}

export interface Bounces {
  hard_bounces: number;
  soft_bounces: number;
  syntax_errors: number;
}

export interface Forwards {
  forwards_count: number;
  forwards_opens: number;
}

export interface Opens {
  opens_total: number;
  unique_opens: number;
  open_rate: number;
  last_open?: string;
}

export interface Clicks {
  clicks_total: number;
  unique_clicks: number;
  unique_subscriber_clicks: number;
  click_rate: number;
  last_click?: string;
}

export interface FacebookLikes {
  recipient_likes: number;
  unique_likes: number;
  facebook_likes: number;
}

export interface IndustryStats {
  type?: string;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unopen_rate: number;
  unsub_rate: number;
  abuse_rate: number;
}

export interface ReportListStats {
  sub_rate: number;
  unsub_rate: number;
  open_rate: number;
  click_rate: number;
}

export interface ABSplitStats {
  a: ABSplitStatDetail;
  b: ABSplitStatDetail;
}

export interface ABSplitStatDetail {
  bounces: number;
  abuse_reports: number;
  unsubs: number;
  recipient_clicks: number;
  forwards: number;
  forwards_opens: number;
  opens: number;
  last_open?: string;
  unique_opens: number;
}

export interface TimewarpStats {
  gmt_offset: number;
  opens: number;
  last_open?: string;
  unique_opens: number;
  clicks: number;
  last_click?: string;
  unique_clicks: number;
  bounces: number;
}

export interface Timeseries {
  timestamp: string;
  emails_sent: number;
  unique_opens: number;
  recipients_clicks: number;
}

export interface ShareReport {
  share_url: string;
  share_password: string;
}

export interface EcommerceReport {
  total_orders: number;
  total_spent: number;
  total_revenue: number;
  currency_code?: string;
}

export interface EcommerceData {
  total_revenue: number;
  number_of_orders: number;
  currency_code: string;
}

export interface ClickReport {
  id: string;
  url: string;
  total_clicks: number;
  click_percentage: number;
  unique_clicks: number;
  unique_click_percentage: number;
  last_click?: string;
  ab_split?: ABSplitClickStats;
  campaign_id: string;
  _links: Link[];
}

export interface ABSplitClickStats {
  a: ClickStatDetail;
  b: ClickStatDetail;
}

export interface ClickStatDetail {
  total_clicks: number;
  total_clicks_percentage: number;
  unique_clicks: number;
  unique_clicks_percentage: number;
  last_click?: string;
}

export interface EmailActivity {
  campaign_id: string;
  list_id: string;
  list_is_active: boolean;
  email_id: string;
  email_address: string;
  activity: EmailActivityItem[];
  _links: Link[];
}

export interface EmailActivityItem {
  action: 'open' | 'click' | 'bounce' | 'unsub' | 'abuse' | 'sent';
  timestamp: string;
  url?: string;
  type?: string;
  ip?: string;
}

export interface DomainPerformance {
  domain: string;
  emails_sent: number;
  bounces: number;
  opens: number;
  clicks: number;
  unsubs: number;
  delivered: number;
  emails_pct: number;
  bounces_pct: number;
  opens_pct: number;
  clicks_pct: number;
  unsubs_pct: number;
}

// ===== LANDING PAGES =====

export interface LandingPage {
  id: string;
  name: string;
  title?: string;
  description?: string;
  template_id: number;
  status: 'published' | 'unpublished' | 'draft';
  list_id?: string;
  store_id?: string;
  web_id: number;
  created_at: string;
  published_at?: string;
  unpublished_at?: string;
  updated_at?: string;
  url?: string;
  created_by_source?: string;
  tracking?: LandingPageTracking;
  _links: Link[];
}

export interface LandingPageTracking {
  opens?: boolean;
  text_clicks?: boolean;
  goal_tracking?: boolean;
  ecomm360?: boolean;
  google_analytics?: string;
  clicktale?: string;
}

export interface LandingPageContent {
  html?: string;
  url?: string;
  _links?: Link[];
}

export interface LandingPageReport {
  id: string;
  name: string;
  title: string;
  url: string;
  published_at: string;
  unpublished_at?: string;
  status: string;
  list_id: string;
  visits: number;
  unique_visits: number;
  subscribes: number;
  clicks: number;
  conversion_rate: number;
  timeseries?: LandingPageTimeseries[];
  ecommerce?: EcommerceReport;
  web_id: number;
  list_name?: string;
  signup_tags?: Tag[];
  _links: Link[];
}

export interface LandingPageTimeseries {
  timestamp: string;
  visits: number;
  unique_visits: number;
  subscribes: number;
  clicks: number;
  revenue: number;
}

// ===== ECOMMERCE =====

export interface Store {
  id: string;
  list_id: string;
  name: string;
  platform?: string;
  domain?: string;
  is_syncing?: boolean;
  email_address?: string;
  currency_code: string;
  money_format?: string;
  primary_locale?: string;
  timezone?: string;
  phone?: string;
  address?: Address;
  connected_site?: ConnectedSite;
  automations?: StoreAutomations;
  list_is_active?: boolean;
  created_at: string;
  updated_at: string;
  _links: Link[];
}

export interface Address {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  province_code?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;
  longitude?: number;
  latitude?: number;
}

export interface ConnectedSite {
  site_foreign_id: string;
  site_script?: SiteScript;
}

export interface SiteScript {
  url: string;
  fragment: string;
}

export interface StoreAutomations {
  abandoned_cart?: AutomationStatus;
  abandoned_browse?: AutomationStatus;
}

export interface AutomationStatus {
  is_supported: boolean;
  id?: string;
  status?: string;
}

export interface Product {
  id: string;
  currency_code?: string;
  title: string;
  handle?: string;
  url?: string;
  description?: string;
  type?: string;
  vendor?: string;
  image_url?: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  published_at_foreign?: string;
  _links: Link[];
}

export interface ProductVariant {
  id: string;
  title: string;
  url?: string;
  sku?: string;
  price?: number;
  inventory_quantity?: number;
  image_url?: string;
  backorders?: string;
  visibility?: string;
  created_at?: string;
  updated_at?: string;
  _links?: Link[];
}

export interface ProductImage {
  id: string;
  url: string;
  variant_ids?: string[];
  _links?: Link[];
}

export interface Order {
  id: string;
  customer: Customer;
  store_id?: string;
  campaign_id?: string;
  landing_site?: string;
  financial_status?: string;
  fulfillment_status?: string;
  currency_code: string;
  order_total: number;
  order_url?: string;
  discount_total?: number;
  tax_total?: number;
  shipping_total?: number;
  tracking_code?: string;
  processed_at_foreign?: string;
  cancelled_at_foreign?: string;
  updated_at_foreign?: string;
  shipping_address?: Address;
  billing_address?: Address;
  promos?: Promo[];
  lines: OrderLine[];
  outreach?: Outreach;
  _links: Link[];
}

export interface Customer {
  id: string;
  email_address: string;
  opt_in_status: boolean;
  company?: string;
  first_name?: string;
  last_name?: string;
  orders_count?: number;
  total_spent?: number;
  address?: Address;
  created_at?: string;
  updated_at?: string;
  _links?: Link[];
}

export interface OrderLine {
  id: string;
  product_id: string;
  product_title?: string;
  product_variant_id: string;
  product_variant_title?: string;
  quantity: number;
  price: number;
  discount?: number;
  _links?: Link[];
}

export interface Promo {
  code: string;
  amount_discounted: number;
  type: 'fixed' | 'percentage';
}

export interface Outreach {
  id?: string;
  name?: string;
  published_time?: string;
}

export interface Cart {
  id: string;
  customer: Customer;
  campaign_id?: string;
  checkout_url?: string;
  currency_code: string;
  order_total: number;
  tax_total?: number;
  lines: CartLine[];
  created_at?: string;
  updated_at?: string;
  _links: Link[];
}

export interface CartLine {
  id: string;
  product_id: string;
  product_title?: string;
  product_variant_id: string;
  product_variant_title?: string;
  quantity: number;
  price: number;
  _links?: Link[];
}

export interface PromoRule {
  id: string;
  title?: string;
  description?: string;
  starts_at?: string;
  ends_at?: string;
  amount?: number;
  type?: 'fixed' | 'percentage';
  target?: 'per_item' | 'total' | 'shipping';
  enabled?: boolean;
  created_at_foreign?: string;
  updated_at_foreign?: string;
  _links?: Link[];
}

export interface PromoCode {
  id: string;
  code: string;
  redemption_url?: string;
  usage_count?: number;
  enabled?: boolean;
  created_at_foreign?: string;
  updated_at_foreign?: string;
  _links?: Link[];
}

// ===== SEARCH =====

export interface SearchResults<T> {
  results: T[];
  total_items: number;
  _links: Link[];
}

export interface CampaignSearchResult {
  campaign: Campaign;
  snippet?: string;
}

export interface MemberSearchResult {
  exact_matches: {
    members: Member[];
    total_items: number;
  };
  full_search: {
    members: Member[];
    total_items: number;
  };
  _links: Link[];
}

// ===== COMMON =====

export interface BatchOperation {
  id: string;
  status: 'pending' | 'preprocessing' | 'started' | 'finalizing' | 'finished';
  total_operations: number;
  finished_operations: number;
  errored_operations: number;
  submitted_at: string;
  completed_at?: string;
  response_body_url?: string;
  _links: Link[];
}
