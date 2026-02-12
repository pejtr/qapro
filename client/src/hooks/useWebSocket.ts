import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseWebSocketOptions {
  scriptId?: number;
  userId?: number;
  userName?: string;
}

interface CursorUpdate {
  socketId: string;
  x: number;
  y: number;
  userId: number;
  userName: string;
}

interface NodeUpdate {
  socketId: string;
  nodeId: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
  userId: number;
}

interface EdgeUpdate {
  socketId: string;
  edgeId: string;
  source: string;
  target: string;
  userId: number;
}

interface UserPresence {
  socketId: string;
  userId: number;
  userName: string;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { scriptId, userId, userName } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeCursors, setActiveCursors] = useState<Map<string, CursorUpdate>>(new Map());
  const [activeUsers, setActiveUsers] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    // Initialize socket connection
    const socket = io({
      path: "/socket.io/",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[WebSocket] Connected");
      setIsConnected(true);

      // Join script room if scriptId is provided
      if (scriptId) {
        socket.emit("join-script", scriptId);
        if (userId && userName) {
          socket.emit("user-join", { scriptId, userId, userName });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
      setIsConnected(false);
    });

    // Cursor updates
    socket.on("cursor-update", (data: CursorUpdate) => {
      setActiveCursors((prev) => {
        const next = new Map(prev);
        next.set(data.socketId, data);
        return next;
      });
    });

    // User presence
    socket.on("user-joined", (data: UserPresence) => {
      setActiveUsers((prev) => {
        const next = new Map(prev);
        next.set(data.userId, data.userName);
        return next;
      });
    });

    socket.on("user-left", (data: { socketId: string; userId: number }) => {
      setActiveUsers((prev) => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
      setActiveCursors((prev) => {
        const next = new Map(prev);
        next.delete(data.socketId);
        return next;
      });
    });

    return () => {
      if (scriptId && userId) {
        socket.emit("user-leave", { scriptId, userId });
        socket.emit("leave-script", scriptId);
      }
      socket.disconnect();
    };
  }, [scriptId, userId, userName]);

  const emitCursorMove = (x: number, y: number) => {
    if (socketRef.current && scriptId && userId && userName) {
      socketRef.current.emit("cursor-move", {
        scriptId,
        x,
        y,
        userId,
        userName,
      });
    }
  };

  const emitNodeUpdate = (nodeId: string, position?: { x: number; y: number }, data?: Record<string, unknown>) => {
    if (socketRef.current && scriptId && userId) {
      socketRef.current.emit("node-update", {
        scriptId,
        nodeId,
        position,
        data,
        userId,
      });
    }
  };

  const emitNodeAdd = (nodeId: string, position: { x: number; y: number }, data: Record<string, unknown>) => {
    if (socketRef.current && scriptId && userId) {
      socketRef.current.emit("node-add", {
        scriptId,
        nodeId,
        position,
        data,
        userId,
      });
    }
  };

  const emitNodeDelete = (nodeId: string) => {
    if (socketRef.current && scriptId && userId) {
      socketRef.current.emit("node-delete", {
        scriptId,
        nodeId,
        userId,
      });
    }
  };

  const emitEdgeAdd = (edgeId: string, source: string, target: string) => {
    if (socketRef.current && scriptId && userId) {
      socketRef.current.emit("edge-add", {
        scriptId,
        edgeId,
        source,
        target,
        userId,
      });
    }
  };

  const emitEdgeDelete = (edgeId: string) => {
    if (socketRef.current && scriptId && userId) {
      socketRef.current.emit("edge-delete", {
        scriptId,
        edgeId,
        userId,
      });
    }
  };

  const onNodeChanged = (callback: (data: NodeUpdate) => void) => {
    if (socketRef.current) {
      socketRef.current.on("node-changed", callback);
      return () => {
        socketRef.current?.off("node-changed", callback);
      };
    }
  };

  const onNodeAdded = (callback: (data: NodeUpdate) => void) => {
    if (socketRef.current) {
      socketRef.current.on("node-added", callback);
      return () => {
        socketRef.current?.off("node-added", callback);
      };
    }
  };

  const onNodeDeleted = (callback: (data: { socketId: string; nodeId: string; userId: number }) => void) => {
    if (socketRef.current) {
      socketRef.current.on("node-deleted", callback);
      return () => {
        socketRef.current?.off("node-deleted", callback);
      };
    }
  };

  const onEdgeAdded = (callback: (data: EdgeUpdate) => void) => {
    if (socketRef.current) {
      socketRef.current.on("edge-added", callback);
      return () => {
        socketRef.current?.off("edge-added", callback);
      };
    }
  };

  const onEdgeDeleted = (callback: (data: { socketId: string; edgeId: string; userId: number }) => void) => {
    if (socketRef.current) {
      socketRef.current.on("edge-deleted", callback);
      return () => {
        socketRef.current?.off("edge-deleted", callback);
      };
    }
  };

  return {
    isConnected,
    activeCursors: Array.from(activeCursors.values()),
    activeUsers: Array.from(activeUsers.entries()).map(([id, name]) => ({ id, name })),
    emitCursorMove,
    emitNodeUpdate,
    emitNodeAdd,
    emitNodeDelete,
    emitEdgeAdd,
    emitEdgeDelete,
    onNodeChanged,
    onNodeAdded,
    onNodeDeleted,
    onEdgeAdded,
    onEdgeDeleted,
  };
}
