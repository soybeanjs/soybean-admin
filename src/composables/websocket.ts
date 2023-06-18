import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useAppStore } from '../store';

type ListenEvents = {
  update: (id: string, data: { name: string; age: number }) => void;
};

type EmitEvents = {
  update: (id: string, data: { name: string; age: number }) => void;
};

export function useWebsocket() {
  const app = useAppStore();

  const socket: Socket<ListenEvents, EmitEvents> = (app.socket || io('ws://localhost:8080')) as Socket<
    ListenEvents,
    EmitEvents
  >;

  if (!app.socket) {
    app.setSocket(socket);
  }

  function init() {
    window.console.log('[socket.io] connecting...');

    socket.on('connect', () => {
      window.console.log('[socket.io] connected.');
    });

    socket.on('disconnect', () => {
      window.console.log('[socket.io] disconnected.');
    });

    socket.on('update', (id, data) => {
      window.console.log('[socket.io] update', id, data);
    });
  }

  function handleUpdate(id: string, data: { name: string; age: number }) {
    socket.emit('update', id, data);
  }

  init();

  return {
    handleUpdate
  };
}
