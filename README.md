# Zenduty MCP Server

An open‑source MCP server exposing commonly used Zenduty endpoints as tools.

## Features
- List users (account members)
- Get user by ID
- List teams
- List services
- List incidents (filters: status, service)
- Create incident

## Setup

### 1) Install
```bash
npm install
```

### 2) Configure
Create `.env` from `.env.example` and set:
```
ZENDUTY_API_TOKEN=your-token
ZENDUTY_BASE_URL=https://www.zenduty.com/api
```
> If your API requires a `Bearer` prefix, set: `ZENDUTY_API_TOKEN="Bearer your-token"`. Otherwise the server defaults to `Token your-token`.

### 3) Build
```bash
npm run build
```

### 4) Run
```bash
npm start
```

## Using with MCP Clients

### Claude Desktop (mcp.json)
Add to your `mcp.json`:
```json
{
  "mcpServers": {
    "zenduty": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "ZENDUTY_API_TOKEN": "${env:ZENDUTY_API_TOKEN}",
        "ZENDUTY_BASE_URL": "${env:ZENDUTY_BASE_URL}"
      }
    }
  }
}
```

## Example Tool Invocations

- **List users**
```json
{"tool": "zenduty.list_members", "input": {}}
```

- **Get user**
```json
{"tool": "zenduty.get_member", "input": {"id": "<member-uuid>"}}
```

- **List teams**
```json
{"tool": "zenduty.list_teams", "input": {}}
```

- **List services**
```json
{"tool": "zenduty.list_services", "input": {}}
```

- **List incidents**
```json
{"tool": "zenduty.list_incidents", "input": {"status": "open"}}
```

- **Create incident**
```json
{
  "tool": "zenduty.create_incident",
  "input": {
    "message": "Checkout errors spike",
    "service": "<service-uuid>",
    "description": "5xx rising on payment gateway",
    "urgency": "high"
  }
}
```

## Notes & Gotchas
- Authentication header: if your org uses `Bearer <token>`, set `ZENDUTY_API_TOKEN` to start with `Bearer `. Otherwise, the server sends `Token <token>`.
- Pagination: the client follows `next` links when the API returns `{ results, next }` or collects all items when the API returns arrays.
- Permissions: make sure your token has the scopes required for the tools you use (read vs write).

## Contributing
PRs welcome! Please open issues for new tools (escalation policies, schedules, on-call, etc.).

## License
MIT
