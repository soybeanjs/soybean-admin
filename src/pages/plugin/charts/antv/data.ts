import type { CustomGraphData } from './modules/types';

// 日期可以自己随便设置，就是字符串展示，也可以修改为业务需要的字段
export function getFlowData(): CustomGraphData {
  return {
    nodes: [
      {
        id: 'NS',
        name: 'Start',
        status: 'COMPLETED',
        startDate: '2024-10-01',
        endDate: '2024-10-07',
        actualStartDate: '2024-10-01',
        actualEndDate: '2024-10-07'
      },
      {
        id: 'N1',
        name: 'Node1',
        status: 'COMPLETED_EARLY',
        startDate: '2024-10-08',
        endDate: '2024-10-10',
        actualStartDate: '2024-10-08',
        actualEndDate: '2024-10-09',
        milestone: true
      },
      {
        id: 'N2',
        name: 'Node2',
        status: 'COMPLETED_EARLY',
        startDate: '2024-10-11',
        endDate: '2024-10-13',
        actualStartDate: '2024-10-11',
        actualEndDate: '2024-10-12'
      },
      { id: 'N3', name: 'Node3', status: 'IN_PROGRESS', isDeleted: true },
      { id: 'N4', name: 'Node4', status: 'COMPLETED_LATE' },
      { id: 'N5', name: 'Node5', status: 'DELAYED', isDelayed: true, milestone: true },
      { id: 'N6', name: 'Node6', status: 'PAUSED' },
      { id: 'N7', name: 'Node7', status: 'NOT_STARTED' },
      { id: 'N8', name: 'Node8', status: 'NOT_STARTED' },
      { id: 'N9', name: 'End', status: 'NOT_STARTED' },
      { id: 'NX', name: 'NodeX', status: 'NOT_STARTED', isDeleted: true }
    ],
    edges: [
      { id: 'E1', source: 'NS', target: 'N1' },
      { id: 'E2', source: 'N1', target: 'N2' },
      { id: 'E3', source: 'N1', target: 'N3', isDeleted: true },
      { id: 'E4', source: 'N1', target: 'N4' },
      { id: 'E5', source: 'N2', target: 'N5' },
      { id: 'E6', source: 'N3', target: 'N5', isDeleted: true },
      { id: 'E7', source: 'N4', target: 'N5' },
      { id: 'E8', source: 'N5', target: 'N6' },
      { id: 'E9', source: 'N6', target: 'N7' },
      { id: 'E10', source: 'N6', target: 'N8' },
      { id: 'E11', source: 'N7', target: 'N9' },
      { id: 'EX', source: 'N8', target: 'N9' },
      { id: 'EO', source: 'N5', target: 'NX', isDeleted: true }
    ]
  };
}
