#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createHash } from "crypto";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "mailchimp";
const MCP_VERSION = "1.0.0";

// ============================================
// API CLIENT
// ============================================
class MailchimpClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // Extract data center from API key (format: key-dc)
    const dc = apiKey.split("-").pop() || "us1";
    this.baseUrl = `https://${dc}.api.mailchimp.com/3.0`;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Mailchimp API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Helper to hash email for subscriber operations
  hashEmail(email: string): string {
    return createHash("md5").update(email.toLowerCase()).digest("hex");
  }

  // Campaign endpoints
  async listCampaigns(count?: number, offset?: number, status?: string, type?: string) {
    const params = new URLSearchParams();
    if (count) params.append("count", count.toString());
    if (offset) params.append("offset", offset.toString());
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/campaigns${query}`);
  }

  async getCampaign(campaignId: string) {
    return this.get(`/campaigns/${campaignId}`);
  }

  async createCampaign(type: string, settings: any, recipients?: any) {
    const payload: any = { type, settings };
    if (recipients) payload.recipients = recipients;
    return this.post("/campaigns", payload);
  }

  async sendCampaign(campaignId: string) {
    return this.post(`/campaigns/${campaignId}/actions/send`, {});
  }

  // List/Audience endpoints
  async listLists(count?: number, offset?: number) {
    const params = new URLSearchParams();
    if (count) params.append("count", count.toString());
    if (offset) params.append("offset", offset.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/lists${query}`);
  }

  async addSubscriber(listId: string, email: string, status: string, mergeFields?: any, tags?: string[]) {
    const payload: any = {
      email_address: email,
      status: status, // subscribed, unsubscribed, cleaned, pending, transactional
    };
    if (mergeFields) payload.merge_fields = mergeFields;
    if (tags) payload.tags = tags;
    return this.post(`/lists/${listId}/members`, payload);
  }

  async getSubscriber(listId: string, email: string) {
    const hash = this.hashEmail(email);
    return this.get(`/lists/${listId}/members/${hash}`);
  }

  // Template endpoints
  async listTemplates(count?: number, offset?: number, type?: string) {
    const params = new URLSearchParams();
    if (count) params.append("count", count.toString());
    if (offset) params.append("offset", offset.toString());
    if (type) params.append("type", type);
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/templates${query}`);
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_campaigns",
    description: "List email campaigns in Mailchimp",
    inputSchema: {
      type: "object" as const,
      properties: {
        count: { type: "number", description: "Number of campaigns to return (max 1000)" },
        offset: { type: "number", description: "Pagination offset" },
        status: { 
          type: "string", 
          description: "Filter by status: save, paused, schedule, sending, sent",
          enum: ["save", "paused", "schedule", "sending", "sent"]
        },
        type: { 
          type: "string", 
          description: "Filter by type: regular, plaintext, absplit, rss, variate",
          enum: ["regular", "plaintext", "absplit", "rss", "variate"]
        },
      },
    },
  },
  {
    name: "get_campaign",
    description: "Get details of a specific campaign",
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: { type: "string", description: "The campaign ID" },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "create_campaign",
    description: "Create a new email campaign",
    inputSchema: {
      type: "object" as const,
      properties: {
        type: { 
          type: "string", 
          description: "Campaign type: regular, plaintext, absplit, rss, variate",
          enum: ["regular", "plaintext", "absplit", "rss", "variate"]
        },
        list_id: { type: "string", description: "The list/audience ID to send to" },
        subject_line: { type: "string", description: "Email subject line" },
        preview_text: { type: "string", description: "Preview text (snippet)" },
        title: { type: "string", description: "Internal campaign title" },
        from_name: { type: "string", description: "Sender name" },
        reply_to: { type: "string", description: "Reply-to email address" },
      },
      required: ["type", "list_id", "subject_line", "from_name", "reply_to"],
    },
  },
  {
    name: "send_campaign",
    description: "Send a campaign immediately (campaign must be ready to send)",
    inputSchema: {
      type: "object" as const,
      properties: {
        campaign_id: { type: "string", description: "The campaign ID to send" },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "list_lists",
    description: "List all audiences/lists in the account",
    inputSchema: {
      type: "object" as const,
      properties: {
        count: { type: "number", description: "Number of lists to return" },
        offset: { type: "number", description: "Pagination offset" },
      },
    },
  },
  {
    name: "add_subscriber",
    description: "Add a new subscriber to an audience/list",
    inputSchema: {
      type: "object" as const,
      properties: {
        list_id: { type: "string", description: "The list/audience ID" },
        email: { type: "string", description: "Subscriber email address" },
        status: { 
          type: "string", 
          description: "Subscription status",
          enum: ["subscribed", "unsubscribed", "cleaned", "pending", "transactional"]
        },
        first_name: { type: "string", description: "Subscriber first name" },
        last_name: { type: "string", description: "Subscriber last name" },
        tags: { 
          type: "array", 
          items: { type: "string" },
          description: "Tags to apply to subscriber" 
        },
      },
      required: ["list_id", "email", "status"],
    },
  },
  {
    name: "get_subscriber",
    description: "Get subscriber information by email address",
    inputSchema: {
      type: "object" as const,
      properties: {
        list_id: { type: "string", description: "The list/audience ID" },
        email: { type: "string", description: "Subscriber email address" },
      },
      required: ["list_id", "email"],
    },
  },
  {
    name: "list_templates",
    description: "List available email templates",
    inputSchema: {
      type: "object" as const,
      properties: {
        count: { type: "number", description: "Number of templates to return" },
        offset: { type: "number", description: "Pagination offset" },
        type: { 
          type: "string", 
          description: "Filter by template type: user, base, gallery",
          enum: ["user", "base", "gallery"]
        },
      },
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: MailchimpClient, name: string, args: any) {
  switch (name) {
    case "list_campaigns": {
      const { count, offset, status, type } = args;
      return await client.listCampaigns(count, offset, status, type);
    }
    case "get_campaign": {
      const { campaign_id } = args;
      return await client.getCampaign(campaign_id);
    }
    case "create_campaign": {
      const { type, list_id, subject_line, preview_text, title, from_name, reply_to } = args;
      const settings: any = {
        subject_line,
        from_name,
        reply_to,
      };
      if (preview_text) settings.preview_text = preview_text;
      if (title) settings.title = title;
      
      const recipients = { list_id };
      return await client.createCampaign(type, settings, recipients);
    }
    case "send_campaign": {
      const { campaign_id } = args;
      return await client.sendCampaign(campaign_id);
    }
    case "list_lists": {
      const { count, offset } = args;
      return await client.listLists(count, offset);
    }
    case "add_subscriber": {
      const { list_id, email, status, first_name, last_name, tags } = args;
      const mergeFields: any = {};
      if (first_name) mergeFields.FNAME = first_name;
      if (last_name) mergeFields.LNAME = last_name;
      return await client.addSubscriber(
        list_id, 
        email, 
        status, 
        Object.keys(mergeFields).length > 0 ? mergeFields : undefined,
        tags
      );
    }
    case "get_subscriber": {
      const { list_id, email } = args;
      return await client.getSubscriber(list_id, email);
    }
    case "list_templates": {
      const { count, offset, type } = args;
      return await client.listTemplates(count, offset, type);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey) {
    console.error("Error: MAILCHIMP_API_KEY environment variable required");
    console.error("Format: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1 (key-datacenter)");
    process.exit(1);
  }

  const client = new MailchimpClient(apiKey);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
