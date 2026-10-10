import type { Task } from 'dhtmlx-gantt';

export const ganttTasks: Task[] = [
  {
    id: 11,
    text: 'Soybean 架构设计',
    type: 'project',
    progress: 0,
    open: true,
    start_date: new Date('2024-01-10 00:00'),
    duration: 12,
    parent: 0
  },
  {
    id: 12,
    text: '测试版本',
    start_date: new Date('2024-03-20 00:00'),
    type: 'project',
    duration: 5,
    render: 'split',
    parent: '11',
    progress: 0,
    open: true
  },
  {
    id: 99,
    text: '测试版本1 发布',
    start_date: new Date('2024-03-20 00:00'),
    end_date: new Date('2024-03-25 00:00'),
    parent: '12',
    progress: 0,
    open: true
  },
  {
    id: 98,
    text: '测试版本2 发布',
    start_date: new Date('2024-03-26 00:00'),
    duration: 4,
    parent: '12',
    progress: 0,
    open: true
  },
  {
    id: 97,
    text: '测试版本3 发布',
    start_date: new Date('2024-03-31 00:00'),
    duration: 10,
    parent: '12',
    progress: 0,
    open: true
  },
  {
    id: 13,
    text: '1.0 版本',
    start_date: new Date('2024-03-31 00:00'),
    type: 'project',
    render: 'split',
    parent: '11',
    progress: 0.5,
    open: false,
    duration: 11
  },
  {
    id: 17,
    text: '1.0正式发布',
    start_date: new Date('2024-03-31 00:00'),
    end_date: new Date('2024-04-03 00:00'),
    parent: '13',
    progress: 0,
    open: true
  },
  {
    id: 18,
    text: '1.0.1 版本',
    start_date: new Date('2024-04-03 00:00'),
    duration: 5,
    parent: '13',
    progress: 0,
    open: true
  },
  {
    id: 19,
    text: '1.0.2 版本',
    start_date: new Date('2024-04-08 00:00'),
    duration: 6,
    parent: '13',
    progress: 0,
    open: true
  },
  {
    id: 20,
    text: '1.0.3 版本',
    start_date: new Date('2024-04-16 00:00'),
    duration: 8,
    parent: '13',
    progress: 0,
    open: true
  },
  {
    id: 31,
    text: '1.0.4 版本',
    start_date: new Date('2024-04-17 00:00'),
    duration: 8,
    parent: '13',
    progress: 0,
    open: true
  },
  {
    id: 32,
    text: '1.0.5 版本',
    start_date: new Date('2024-04-26 00:00'),
    duration: 9,
    parent: '13',
    progress: 0,
    open: true
  },
  {
    id: 33,
    text: '1.0.9 版本',
    start_date: new Date('2024-05-05 00:00'),
    duration: 2,
    parent: '13',
    progress: 0,
    open: true
  },
  {
    id: 14,
    text: '1.1 版本',
    start_date: new Date('2024-05-07 00:00'),
    duration: 30,
    parent: '11',
    progress: 0,
    open: true
  },
  {
    id: 15,
    text: '1.2 版本',
    start_date: new Date('2024-06-06 00:00'),
    duration: 46,
    parent: '11',
    progress: 0,
    open: true
  },
  {
    id: 16,
    text: '1.3版本',
    type: 'project',
    render: 'split',
    parent: '11',
    progress: 0,
    open: true,
    start_date: new Date('2024-07-22 00:00'),
    duration: 11
  },
  {
    id: 21,
    text: '1.3.1版本',
    start_date: new Date('2024-07-22 00:00'),
    duration: 7,
    parent: '16',
    progress: 0,
    open: true
  },
  {
    id: 22,
    text: '1.3.2版本',
    start_date: new Date('2024-07-29 00:00'),
    duration: 7,
    parent: '16',
    progress: 0,
    open: true
  }
];
