/** 缩放比例取值范围 */
export type SScaleRange = [number, number];

/** 偏移量 */
export interface STranslate {
  /** X偏移量 */
  x: number;
  /** Y偏移量 */
  y: number;
}

/** 位置 */
export interface SPosition {
  /** x坐标 */
  x: number;
  /** y坐标 */
  y: number;
}

/** 坐标 */
export interface SCoord {
  /** x坐标 */
  x: number;
  /** y坐标 */
  y: number;
}

/** 节点尺寸 */
export interface SNodeSize {
  /** 节点宽 */
  w: number;
  /** 节点高 */
  h: number;
}

/** 图的节点 */
export interface SGraphNode extends SCoord {
  /** 节点id */
  id: string;
  /** 节点名称 */
  label: string;
}

/** 图的关系线 */
export interface SGraphEdge {
  sourceCoord: SCoord;
  targetCoord: SCoord;
}

export interface SGraphData {
  nodes: SGraphNode[];
  edges: SGraphEdge[];
}
