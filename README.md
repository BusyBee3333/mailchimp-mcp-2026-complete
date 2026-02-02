> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/mailchimp)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 Mailchimp MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your Mailchimp email marketing platform.** Instead of manually building campaigns, managing lists, or segmenting audiences, just *tell* AI what you need.

### 📧 Email Marketing Power Moves

The AI can run your entire email marketing operation with natural language:

| Use Case | What AI Does | Tools Used |
|----------|--------------|------------|
| **"Create a product launch campaign: segment list by purchase history, use template #5, schedule for Friday 10am"** | Creates campaign with targeting rules, applies template, sets send time | `create_campaign`, `list_lists`, `list_templates` |
| **"Show me all campaigns sent in Q4 with open rates below 15%"** | Filters campaigns by date and analyzes performance metrics | `list_campaigns`, `get_campaign` |
| **"Add 500 new subscribers from CSV with tags 'webinar-attendees' and 'tech-industry'"** | Batch imports subscribers with custom tags and merge fields | `add_subscriber` (bulk), `list_lists` |
| **"Generate engagement report: top campaigns, list growth, subscriber churn by segment"** | Aggregates campaign stats, list metrics, and subscriber activity | `list_campaigns`, `list_lists`, `get_subscriber` |
| **"Clone last month's newsletter, update subject line to mention new product, send test to team"** | Duplicates campaign, modifies settings, sends test before scheduling | `get_campaign`, `create_campaign`, `send_campaign` |

### 🔗 The Real Power: Marketing Automation

AI chains Mailchimp operations together:

- **Audience intelligence** → Analyze subscriber behavior → Segment by engagement → Create targeted campaigns
- **Campaign optimization** → Review past performance → Identify winning templates → Replicate for new sends
- **List health** → Monitor subscriber growth → Flag inactive segments → Re-engagement campaigns

## 📦 What's Inside

**8 email marketing tools** covering campaigns, audiences, subscribers, and templates:

1. **`list_campaigns`** — List and filter campaigns by status (sent, scheduled, draft) or type (regular, A/B test)
2. **`get_campaign`** — Get campaign details including content, settings, and performance metrics
3. **`create_campaign`** — Build new campaigns with subject lines, sender info, and audience targeting
4. **`send_campaign`** — Send campaigns immediately (must be fully configured and ready)
5. **`list_lists`** — View all audiences with member counts, growth stats, and settings
6. **`add_subscriber`** — Add new subscribers with email, merge fields (first/last name), tags, and status
7. **`get_subscriber`** — Lookup subscriber by email to see tags, stats, and activity history
8. **`list_templates`** — Browse saved templates (user-created, base layouts, or gallery designs)

All with automatic data center routing, proper error handling, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Mailchimp-MCP-2026-Complete.git
   cd mailchimp-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Mailchimp API key:**
   - Log in to Mailchimp
   - Go to **Profile → Extras → API Keys**
   - Click **Create A Key** and copy it
   - Format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1` (key-datacenter)
   - Required permissions: Campaigns, Audiences (read/write)

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "mailchimp": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/mailchimp-mcp-2026-complete/dist/index.js"],
         "env": {
           "MAILCHIMP_API_KEY": "your-key-datacenter"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/mailchimp-mcp)

1. Click the button above
2. Set your Mailchimp API key in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t mailchimp-mcp .
docker run -p 3000:3000 \
  -e MAILCHIMP_API_KEY=your-key-datacenter \
  mailchimp-mcp
```

## 🔐 Authentication

Mailchimp uses API key authentication (no OAuth required):

1. **Get your key**: Mailchimp Profile → Extras → API Keys
2. **Format**: Key includes data center suffix (e.g., `-us1`, `-us19`)
3. **Automatic routing**: MCP server extracts data center from key and routes requests correctly

📚 **Official docs**: [Mailchimp API Authentication](https://mailchimp.com/developer/marketing/guides/quick-start/#generate-your-api-key)

## 🎯 Example Prompts

Once connected to Claude, use natural language:

**Campaign Management:**
- *"List all campaigns sent in the last 30 days"*
- *"Get full details on campaign 'abc123' including click-through rates"*
- *"Create a regular campaign for list '9876' with subject 'New Product Launch' from 'sales@company.com'"*
- *"Send campaign 'xyz789' immediately"*

**Audience Building:**
- *"Show me all my audiences with subscriber counts"*
- *"Add subscriber jane@example.com to list '9876' with status 'subscribed' and tag 'vip-customer'"*
- *"Get subscriber info for john@example.com from list '9876'"*

**Template Selection:**
- *"List all user-created email templates"*
- *"Show me gallery templates for product announcements"*

**Advanced Workflows:**
- *"Find campaigns with 'newsletter' in the title, show open rates"*
- *"Add 5 subscribers to my main list with tags based on signup source"*
- *"Generate report: campaigns sent this month, total opens, clicks, unsubscribes"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Mailchimp account with API key

### Setup

```bash
git clone https://github.com/BusyBee3333/Mailchimp-MCP-2026-Complete.git
cd mailchimp-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Mailchimp API key
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Mailchimp API error: 401 Unauthorized"
- Verify your API key is correct (copy-paste from Mailchimp)
- Check that the key includes the data center suffix (e.g., `-us1`)
- Ensure your API key hasn't been deleted in Mailchimp settings
- Confirm your account is active and in good standing

### "Mailchimp API error: 404 Resource Not Found"
- Campaign/List IDs must be exact matches (case-sensitive)
- Use `list_campaigns` or `list_lists` to get correct IDs
- Some resources may have been archived or deleted

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Check that the path in `claude_desktop_config.json` is absolute
- Verify build completed: `ls dist/index.js`
- Check Claude logs: `tail -f ~/Library/Logs/Claude/mcp*.log`

### "Rate limit exceeded"
- Mailchimp limits API calls per key (varies by plan)
- Batch operations when possible (e.g., bulk subscriber imports)
- Check your API usage in Mailchimp dashboard

## 📖 Resources

- [Mailchimp Marketing API Reference](https://mailchimp.com/developer/marketing/api/)
- [Mailchimp API Quick Start](https://mailchimp.com/developer/marketing/guides/quick-start/)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Documentation](https://claude.ai/desktop)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/automation-workflows`)
3. Commit your changes (`git commit -m 'Add automation support'`)
4. Push to the branch (`git push origin feature/automation-workflows`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

Want more MCP servers? Check our [catalog](https://mcpengine.pages.dev) covering 30+ business platforms.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
