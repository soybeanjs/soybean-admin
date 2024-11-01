import type { EdgeData, GraphData, NodeData } from '@antv/g6';

export type NodeStatus =
  | 'MILESTONE'
  | 'NOT_STARTED'
  | 'DELAYED'
  | 'PAUSED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'COMPLETED_EARLY'
  | 'COMPLETED_LATE';

export interface CustomNodeData extends NodeData {
  isDelayed?: boolean;
  isDeleted?: boolean;
  milestone?: boolean;
  status?: NodeStatus;
}

export interface CustomEdgeData extends EdgeData {
  isDelayed?: boolean;
  isDeleted?: boolean;
}

export interface CustomGraphData extends GraphData {
  nodes: CustomNodeData[];
  edges: CustomEdgeData[];
}
