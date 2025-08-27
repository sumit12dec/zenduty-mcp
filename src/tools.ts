import { z } from "zod";
import type { Tool } from "@modelcontextprotocol/sdk/server";
import { ZendutyClient } from "./zendutyClient.js";

export function buildTools(client: ZendutyClient): Tool[] {
  return [
    {
      name: "zenduty.list_members",
      description: "List all account members (users).",
      inputSchema: z.object({}).passthrough().strip().describe("No input"),
      handler: async () => {
        const members = await client.listMembers();
        return { content: [{ type: "json", json: members }] };
      }
    },
    {
      name: "zenduty.get_member",
      description: "Get a single member by ID (target_id).",
      inputSchema: z.object({ id: z.string().describe("Member UUID") }),
      handler: async ({ id }) => {
        const member = await client.getMember(id);
        return { content: [{ type: "json", json: member }] };
      }
    },
    {
      name: "zenduty.list_teams",
      description: "List all teams in the account.",
      inputSchema: z.object({}).passthrough().strip(),
      handler: async () => {
        const teams = await client.listTeams();
        return { content: [{ type: "json", json: teams }] };
      }
    },
    {
      name: "zenduty.list_services",
      description: "List all services.",
      inputSchema: z.object({}).passthrough().strip(),
      handler: async () => {
        const services = await client.listServices();
        return { content: [{ type: "json", json: services }] };
      }
    },
    {
      name: "zenduty.list_incidents",
      description: "List incidents with optional filters (status, service).",
      inputSchema: z.object({
        status: z.string().optional().describe("Filter by status"),
        service: z.string().optional().describe("Filter by service UUID")
      }),
      handler: async (input) => {
        const incidents = await client.listIncidents(input);
        return { content: [{ type: "json", json: incidents }] };
      }
    },
    {
      name: "zenduty.create_incident",
      description: "Create an incident for a service.",
      inputSchema: z.object({
        message: z.string(),
        service: z.string().describe("Service UUID"),
        description: z.string().optional(),
        urgency: z.string().optional()
      }),
      handler: async (payload) => {
        const incident = await client.createIncident(payload);
        return { content: [{ type: "json", json: incident }] };
      }
    }
  ];
}
