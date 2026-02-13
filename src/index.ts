#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { MailchimpClient } from './clients/mailchimp.js';
import { registerCampaignTools } from './tools/campaigns-tools.js';
import { registerListTools } from './tools/lists-tools.js';
import { registerMemberTools } from './tools/members-tools.js';
import { registerTemplateTools } from './tools/templates-tools.js';
import { registerAutomationTools } from './tools/automations-tools.js';
import { registerReportTools } from './tools/reports-tools.js';
import { registerLandingPageTools } from './tools/landing-pages-tools.js';
import { registerEcommerceTools } from './tools/ecommerce-tools.js';
import { registerTagTools } from './tools/tags-tools.js';
import { registerSearchTools } from './tools/search-tools.js';

// Get API key from environment
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;

if (!MAILCHIMP_API_KEY) {
  console.error('Error: MAILCHIMP_API_KEY environment variable is required');
  process.exit(1);
}

// Initialize Mailchimp client
const client = new MailchimpClient({
  apiKey: MAILCHIMP_API_KEY
});

// Initialize MCP server
const server = new Server(
  {
    name: 'mailchimp-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    },
  }
);

// Register all tools
const toolRegistry: Record<string, any> = {
  ...registerCampaignTools(client),
  ...registerListTools(client),
  ...registerMemberTools(client),
  ...registerTemplateTools(client),
  ...registerAutomationTools(client),
  ...registerReportTools(client),
  ...registerLandingPageTools(client),
  ...registerEcommerceTools(client),
  ...registerTagTools(client),
  ...registerSearchTools(client)
};

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = Object.entries(toolRegistry).map(([name, tool]) => ({
    name,
    description: tool.description,
    inputSchema: tool.parameters
  }));

  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const tool = toolRegistry[name];
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const result = await tool.execute(args);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Resources for documentation
const resources = [
  {
    uri: 'mailchimp://docs/api',
    name: 'Mailchimp API Documentation',
    description: 'Official Mailchimp Marketing API v3 documentation',
    mimeType: 'text/plain'
  },
  {
    uri: 'mailchimp://docs/campaigns',
    name: 'Campaign Management Guide',
    description: 'Guide for creating, managing, and sending campaigns',
    mimeType: 'text/plain'
  },
  {
    uri: 'mailchimp://docs/audiences',
    name: 'Audience Management Guide',
    description: 'Guide for managing lists, members, segments, and tags',
    mimeType: 'text/plain'
  }
];

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  let content = '';
  
  switch (uri) {
    case 'mailchimp://docs/api':
      content = `# Mailchimp Marketing API v3

This MCP server provides comprehensive access to the Mailchimp Marketing API v3.

## Tool Categories:
- **Campaigns** (15 tools): Create, manage, send, schedule, and test email campaigns
- **Lists/Audiences** (13 tools): Manage lists, segments, interest categories, and growth analytics
- **Members** (13 tools): Add, update, tag, and track list subscribers
- **Templates** (6 tools): Manage email templates
- **Automations** (10 tools): Manage automation workflows and emails
- **Reports** (8 tools): Access campaign analytics, click tracking, and performance data
- **Landing Pages** (8 tools): Create and manage landing pages
- **E-commerce** (32+ tools): Manage stores, products, orders, carts, customers, and promo codes
- **Tags** (1 tool): Search and manage tags
- **Search** (2 tools): Search campaigns and members

Total: 60+ tools covering the complete Mailchimp API

## Authentication:
Set MAILCHIMP_API_KEY environment variable with your Mailchimp API key.
Format: xxxxxxxxxxxxx-us19 (key-datacenter)

## Rate Limits:
Mailchimp enforces rate limits (typically 10 requests/second). The client handles rate limiting automatically.
`;
      break;
      
    case 'mailchimp://docs/campaigns':
      content = `# Campaign Management Guide

## Campaign Lifecycle:
1. Create campaign (mailchimp_campaigns_create)
2. Set content (mailchimp_campaigns_set_content)
3. Review checklist (mailchimp_campaigns_get_send_checklist)
4. Send test (mailchimp_campaigns_test)
5. Send or schedule (mailchimp_campaigns_send or mailchimp_campaigns_schedule)

## Campaign Types:
- **regular**: Standard one-time email campaign
- **plaintext**: Plain text email
- **absplit**: A/B split test campaign
- **rss**: RSS-driven campaign
- **variate**: Multivariate test campaign

## Scheduling:
Use mailchimp_campaigns_schedule with ISO 8601 datetime.
Enable Timewarp to send at local recipient time zones.

## Testing:
Send test emails to up to 5 addresses before sending to full list.
`;
      break;
      
    case 'mailchimp://docs/audiences':
      content = `# Audience Management Guide

## Core Concepts:
- **List/Audience**: Your subscriber database
- **Member**: Individual subscriber in a list
- **Segment**: Filtered subset of list members
- **Interest Category**: Group title (e.g., "Preferences")
- **Interest**: Group option (e.g., "Daily Newsletter", "Weekly Digest")
- **Tag**: Custom label for organizing members

## Member Status:
- **subscribed**: Active subscriber
- **unsubscribed**: Opted out
- **cleaned**: Bounced/invalid email
- **pending**: Double opt-in pending
- **transactional**: Transactional-only (no marketing)

## Batch Operations:
Use mailchimp_lists_batch_subscribe to add/update multiple members at once.

## Segmentation:
Create static segments (fixed member list) or saved segments (dynamic conditions).
`;
      break;
  }
  
  return {
    contents: [
      {
        uri,
        mimeType: 'text/plain',
        text: content
      }
    ]
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Mailchimp MCP Server running on stdio');
  console.error(`Connected to Mailchimp API (${client['server']})`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
