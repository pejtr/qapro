import { useEffect, useState, useRef } from "react";
import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface ExecutionNotification {
  executionId: number;
  scriptId: number;
  status: "completed" | "failed" | "running";
  message: string;
  timestamp: number;
  userId: number;
}

export function NotificationCenter() {
  const { data: user } = trpc.auth.me.useQuery();
  const [notifications, setNotifications] = useState<ExecutionNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const socket = io({
      path: "/socket.io/",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[NotificationCenter] WebSocket connected");
    });

    const handleNotification = (notification: ExecutionNotification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      const icon =
        notification.status === "completed" ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : notification.status === "failed" ? (
          <XCircle className="h-5 w-5 text-red-500" />
        ) : (
          <Clock className="h-5 w-5 text-blue-500" />
        );

      toast(notification.message, {
        icon,
        duration: 5000,
      });
    };

    socket.on(`execution-notification-${user.id}`, handleNotification);

    return () => {
      socket.off(`execution-notification-${user.id}`, handleNotification);
      socket.disconnect();
    };
  }, [user]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setUnreadCount(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications([])}
            >
              Clear all
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification, index) => (
                <div
                  key={`${notification.executionId}-${index}`}
                  className="p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(notification.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Execution #{notification.executionId} • Script #
                        {notification.scriptId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
