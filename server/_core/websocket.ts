import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { Socket } from "socket.io";

interface CursorPosition {
  x: number;
  y: number;
  userId: number;
  userName: string;
  scriptId: number;
}

interface NodeUpdate {
  scriptId: number;
  nodeId: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
  userId: number;
}

interface EdgeUpdate {
  scriptId: number;
  edgeId: string;
  source: string;
  target: string;
  userId: number;
}

let io: SocketIOServer | null = null;

export function initializeWebSocket(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    path: "/socket.io/",
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Join script room
    socket.on("join-script", (scriptId: number) => {
      socket.join(`script-${scriptId}`);
      console.log(`[WebSocket] Socket ${socket.id} joined script-${scriptId}`);
    });

    // Leave script room
    socket.on("leave-script", (scriptId: number) => {
      socket.leave(`script-${scriptId}`);
      console.log(`[WebSocket] Socket ${socket.id} left script-${scriptId}`);
    });

    // Cursor position updates
    socket.on("cursor-move", (data: CursorPosition) => {
      socket.to(`script-${data.scriptId}`).emit("cursor-update", {
        socketId: socket.id,
        ...data,
      });
    });

    // Node updates
    socket.on("node-update", (data: NodeUpdate) => {
      socket.to(`script-${data.scriptId}`).emit("node-changed", {
        socketId: socket.id,
        ...data,
      });
    });

    // Node additions
    socket.on("node-add", (data: NodeUpdate) => {
      socket.to(`script-${data.scriptId}`).emit("node-added", {
        socketId: socket.id,
        ...data,
      });
    });

    // Node deletions
    socket.on("node-delete", (data: { scriptId: number; nodeId: string; userId: number }) => {
      socket.to(`script-${data.scriptId}`).emit("node-deleted", {
        socketId: socket.id,
        ...data,
      });
    });

    // Edge updates
    socket.on("edge-update", (data: EdgeUpdate) => {
      socket.to(`script-${data.scriptId}`).emit("edge-changed", {
        socketId: socket.id,
        ...data,
      });
    });

    // Edge additions
    socket.on("edge-add", (data: EdgeUpdate) => {
      socket.to(`script-${data.scriptId}`).emit("edge-added", {
        socketId: socket.id,
        ...data,
      });
    });

    // Edge deletions
    socket.on("edge-delete", (data: { scriptId: number; edgeId: string; userId: number }) => {
      socket.to(`script-${data.scriptId}`).emit("edge-deleted", {
        socketId: socket.id,
        ...data,
      });
    });

    // User presence
    socket.on("user-join", (data: { scriptId: number; userId: number; userName: string }) => {
      socket.to(`script-${data.scriptId}`).emit("user-joined", {
        socketId: socket.id,
        ...data,
      });
    });

    socket.on("user-leave", (data: { scriptId: number; userId: number }) => {
      socket.to(`script-${data.scriptId}`).emit("user-left", {
        socketId: socket.id,
        ...data,
      });
    });

    socket.on("disconnect", () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  console.log("[WebSocket] Socket.io server initialized");
  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function broadcastToScript(scriptId: number, event: string, data: unknown) {
  if (io) {
    io.to(`script-${scriptId}`).emit(event, data);
  }
}
