import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

// Mock data - will be replaced with real data from backend
const mockMessages = [
  {
    id: 1,
    sender: "John Doe",
    preview: "Hey, I reviewed your automation script and it looks great!",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    unread: true,
    online: true,
  },
  {
    id: 2,
    sender: "Sarah Smith",
    preview: "Can you help me with the Docker configuration?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unread: true,
    online: false,
  },
  {
    id: 3,
    sender: "Mike Johnson",
    preview: "The test results are ready for review.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    unread: false,
    online: true,
  },
];

export function MessagingDropdown() {
  const [, setLocation] = useLocation();
  const unreadCount = mockMessages.filter(m => m.unread).length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-bold text-base">
          Messages
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {mockMessages.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No messages yet
          </div>
        ) : (
          <>
            {mockMessages.map((message) => (
              <DropdownMenuItem
                key={message.id}
                className="p-3 cursor-pointer hover:bg-accent"
                onClick={() => setLocation(`/messages/${message.id}`)}
              >
                <div className="flex gap-3 w-full">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(message.sender)}
                      </AvatarFallback>
                    </Avatar>
                    {message.online && (
                      <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`font-medium text-sm truncate ${message.unread ? 'font-bold' : ''}`}>
                        {message.sender}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm text-muted-foreground truncate ${message.unread ? 'font-semibold text-foreground' : ''}`}>
                      {message.preview}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary font-medium cursor-pointer"
              onClick={() => setLocation('/messages')}
            >
              See all messages
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
