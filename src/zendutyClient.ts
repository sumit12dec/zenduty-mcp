import axios, { AxiosInstance } from "axios";

export interface ZendutyClientOptions {
  baseUrl?: string; // defaults to https://www.zenduty.com/api
  token: string;    // API token. If it already starts with "Bearer " or "Token ", we pass as-is.
}

export class ZendutyClient {
  private http: AxiosInstance;

  constructor(opts: ZendutyClientOptions) {
    const baseURL = (opts.baseUrl ?? "https://www.zenduty.com/api").replace(/\/$/, "");
    const authHeader = opts.token.startsWith("Bearer ") || opts.token.startsWith("Token ")
      ? opts.token
      : `Token ${opts.token}`;

    this.http = axios.create({
      baseURL,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      },
      timeout: 30_000
    });
  }

  // Generic paginated GET (follows `next` links if present)
  private async pagedGet<T = any>(url: string, params?: Record<string, any>): Promise<T[]> {
    const results: T[] = [];
    let next: string | null = url;
    let firstParams = params;

    while (next) {
      const { data } = await this.http.get(next, { params: firstParams });
      firstParams = undefined; // only for first page
      if (Array.isArray(data)) {
        results.push(...data);
        next = null; // unpaginated list
      } else if (data?.results) {
        results.push(...data.results);
        next = data.next ?? null;
      } else {
        // Single object endpoint
        return [data as T];
      }
    }
    return results;
  }

  // --- Users ---
  async listMembers() {
    return this.pagedGet("/account/members/");
  }
  async getMember(id: string) {
    const { data } = await this.http.get(`/account/members/${id}/`);
    return data;
  }

  // --- Teams ---
  async listTeams() {
    return this.pagedGet("/account/teams/");
  }

  // --- Services ---
  async listServices() {
    return this.pagedGet("/services/");
  }

  // --- Incidents ---
  async listIncidents(params?: { status?: string; service?: string }) {
    return this.pagedGet("/incidents/", params);
  }
  async createIncident(payload: {
    message: string;
    service: string; // service unique id
    description?: string;
    urgency?: string; // e.g., "high", depending on your Zenduty setup
  }) {
    const { data } = await this.http.post(`/incidents/`, payload);
    return data;
  }
}
