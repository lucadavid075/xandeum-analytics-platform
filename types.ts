
export interface MilestoneInfo {
  version: string;
  name: string;
  goal: string;
  description: string;
}

export interface NodeStatsFields {
  cpu_percent: number;
  ram_used: number; // Bytes
  uptime: number; // seconds
  active_streams: number;
  disk_usage?: number; 
  // Detailed fields
  current_index?: number;
  file_size?: number; // Bytes
  last_updated?: number; // timestamp
  packets_received?: number;
  packets_sent?: number;
  ram_total?: number; // Bytes
  total_bytes?: number;
  total_pages?: number;
}

export interface NodeStatsResult extends NodeStatsFields {
  // Optional backward compatibility if API returns nested stats in some cases
  stats?: NodeStatsFields;
}

export interface NodeVersionResult {
  version: string;
}

export interface NodePod {
  address: string;
  version: string;
  last_seen?: string;
  last_seen_timestamp?: number;
  total_count?: number;
}

export interface IpNodeDetail {
  status: 'online' | 'offline';
  version?: {
    result?: NodeVersionResult;
  };
  stats?: {
    result?: NodeStatsResult;
  };
  pods?: NodePod[];
}

export interface IpNodesMap {
  [ip: string]: IpNodeDetail;
}

export interface MergedPNode {
  address: string;
  version: string;
  last_seen?: string;
  last_seen_timestamp?: number;
  pubkey?: string;
  source_ip: string;
}

export interface ApiSummary {
  unique_pnodes: number;
  online_ip_nodes: number;
  offline_ip_nodes: number;
}

export interface ApiResponse {
  ip_nodes: IpNodesMap;
  merged_pnodes: MergedPNode[];
  summary: ApiSummary;
}

// For D3 Graph
export interface GraphNode {
  id: string;
  group: 'ip' | 'pnode';
  status?: string;
  val: number; // Radius influence
  // d3.SimulationNodeDatum properties
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  // d3.SimulationLinkDatum properties
  index?: number;
}
