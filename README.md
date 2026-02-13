# Mailchimp MCP Server

Complete Model Context Protocol (MCP) server for Mailchimp Marketing API v3.0 with 104+ tools and 15+ React UI apps.

## 🚀 Features

### 104+ MCP Tools

Comprehensive coverage of the Mailchimp Marketing API v3.0:

- **Campaigns** (15 tools): Create, manage, send, schedule, and test email campaigns
- **Lists/Audiences** (14 tools): Manage lists, segments, interest categories, and growth analytics
- **Members** (12 tools): Add, update, tag, and track list subscribers
- **Ecommerce** (28 tools): Manage stores, products, orders, carts, customers, and promo codes
- **Automations** (10 tools): Manage automation workflows and emails
- **Reports** (8 tools): Access campaign analytics, click tracking, and performance data
- **Landing Pages** (8 tools): Create and manage landing pages
- **Templates** (6 tools): Manage email templates
- **Search** (2 tools): Search campaigns and members
- **Tags** (1 tool): Search and manage tags

### 15+ React UI Apps

Beautiful, dark-themed React applications for visual interaction:

1. **Campaign Dashboard** - View and manage all campaigns
2. **Audience Manager** - Comprehensive audience/list management
3. **Subscriber Grid** - Searchable subscriber table
4. **Segment Builder** - Create and manage segments
5. **Template Gallery** - Browse and use email templates
6. **Automation Flow** - Manage automation workflows
7. **Campaign Analytics** - Detailed campaign performance metrics
8. **A/B Test Results** - Compare A/B test outcomes
9. **Email Preview** - Preview campaign emails
10. **Tag Manager** - Organize and apply tags
11. **Landing Page Builder** - Create landing pages
12. **Content Manager** - Manage email content
13. **Growth Chart** - Visualize audience growth over time
14. **Send Time Optimizer** - Find optimal send times
15. **List Health Monitor** - Track list health metrics
16. **Ecommerce Dashboard** - Manage stores and products
17. **Promo Code Manager** - Create and track promo codes

## 📦 Installation

```bash
npm install
npm run build
```

## 🔧 Configuration

Set your Mailchimp API key as an environment variable:

```bash
export MAILCHIMP_API_KEY="your-api-key-us19"
```

Your API key format: `xxxxxxxxxxxxxxxxxxxxx-datacenter` (e.g., `abc123-us19`)

You can obtain your API key from: Mailchimp Account → Extras → API Keys

## 🎯 Usage

### As MCP Server

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mailchimp": {
      "command": "node",
      "args": ["/path/to/servers/mailchimp/dist/index.js"],
      "env": {
        "MAILCHIMP_API_KEY": "your-api-key-us19"
      }
    }
  }
}
```

### Standalone

```bash
npm start
```

## 📚 API Coverage

### Campaign Management

- Create campaigns (regular, A/B split, RSS, variate)
- Set HTML/template content
- Send, schedule, pause, resume campaigns
- Send test emails
- Replicate campaigns
- Get send checklist

### Audience/List Management

- Create and manage audiences
- Add/update/remove members (batch operations supported)
- Create segments (static, saved, fuzzy)
- Manage interest categories and groups
- Track growth history

### Member Management

- Add/update members with merge fields
- Tag management (add/remove tags)
- Track member activity and goals
- Bulk subscribe operations
- VIP member designation

### Automation Workflows

- List all automations
- Pause/start workflows
- Manage automation emails
- Queue management

### Analytics & Reports

- Campaign performance reports
- Click-through tracking
- Open rate details
- Domain performance analysis
- A/B test results
- Email activity per subscriber

### E-commerce

- Store management
- Product catalog (variants, SKUs, inventory)
- Order tracking
- Cart abandonment
- Customer management
- Promo rules and codes

### Templates & Landing Pages

- Template gallery
- Create custom templates
- Landing page builder
- Publish/unpublish pages

## 🎨 React Apps

All apps use a consistent dark theme with Tailwind CSS:
- Background: `bg-gray-900`
- Cards: `bg-gray-800` with `border-gray-700`
- Accents: Blue (`blue-400`, `blue-600`) and Green (`green-400`, `green-600`)
- Typography: White text with gray variants for hierarchy

### Running Individual Apps

```bash
cd src/ui/react-app/campaign-dashboard
npm install
npm run dev
```

## 🔐 Authentication

The server uses HTTP Basic authentication with Mailchimp's API:
- Username: `anystring` (Mailchimp ignores this)
- Password: Your API key

## ⚡ Rate Limiting

Mailchimp enforces rate limits (typically 10 requests/second). The client automatically:
- Tracks rate limit headers
- Waits when limit is reached
- Resumes after reset time

## 📖 Tool Examples

### Create a Campaign

```typescript
{
  "type": "regular",
  "recipients": {
    "list_id": "abc123"
  },
  "settings": {
    "subject_line": "Welcome to our newsletter!",
    "from_name": "Your Company",
    "reply_to": "hello@yourcompany.com",
    "title": "Welcome Campaign"
  }
}
```

### Add a Subscriber

```typescript
{
  "list_id": "abc123",
  "email_address": "subscriber@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "John",
    "LNAME": "Doe"
  }
}
```

### Get Campaign Report

```typescript
{
  "campaign_id": "abc123"
}
```

## 🧪 Testing

```bash
npm run typecheck  # TypeScript type checking
npm test          # Run tests (if configured)
```

## 🏗️ Architecture

```
mailchimp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── clients/
│   │   └── mailchimp.ts      # Mailchimp API client
│   ├── tools/
│   │   ├── campaigns-tools.ts
│   │   ├── lists-tools.ts
│   │   ├── members-tools.ts
│   │   ├── automations-tools.ts
│   │   ├── templates-tools.ts
│   │   ├── reports-tools.ts
│   │   ├── landing-pages-tools.ts
│   │   ├── ecommerce-tools.ts
│   │   ├── tags-tools.ts
│   │   └── search-tools.ts
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── ui/
│       └── react-app/        # 15+ React applications
│           ├── campaign-dashboard/
│           ├── audience-manager/
│           ├── subscriber-grid/
│           └── ... (12+ more apps)
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit PRs.

## 📞 Support

- [Mailchimp API Documentation](https://mailchimp.com/developer/marketing/api/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- Issues: GitHub Issues

## 🔗 Related

- [Mailchimp Marketing API v3.0](https://mailchimp.com/developer/marketing/api/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCPEngine](https://github.com/BusyBee3333/mcpengine)

---

**Built with ❤️ for the MCP community**
