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

/**
 * 流程图节点数据。
 *
 * `NodeData` 自身带 `[key: string]: unknown` 索引签名，所以自定义字段（`name`
 * 等）虽然能写进去，但读出来是 `unknown`。这里把用到的字段显式声明成精确
 * 类型，避免每处取值都要窄化。
 */
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
