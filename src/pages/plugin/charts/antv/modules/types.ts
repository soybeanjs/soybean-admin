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

/** 流程图节点数据 详见 docs/v3-notes.md N-346。 */
export interface CustomNodeData extends NodeData {
  /** 节点标题（画在矩形里） */
  name?: string;
  startDate?: string;
  endDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
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
