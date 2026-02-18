import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Network,
  Sparkles,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const motivationalQuotes = [
  // Isaac Asimov
  { text: "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.", author: "Isaac Asimov" },
  { text: "I do not fear computers. I fear lack of them.", author: "Isaac Asimov" },
  { text: "The most exciting phrase to hear in science, the one that heralds new discoveries, is not 'Eureka!' but 'That's funny...'", author: "Isaac Asimov" },
  { text: "Self-education is, I firmly believe, the only kind of education there is.", author: "Isaac Asimov" },
  { text: "Life is pleasant. Death is peaceful. It's the transition that's troublesome.", author: "Isaac Asimov" },
  
  // Karel Čapek (R.U.R.)
  { text: "Robots of the world! The power of man has fallen! A new world has arisen!", author: "Karel Čapek, R.U.R." },
  { text: "Man shall be free and supreme; he shall have no other aim, no other labor, no other care than to perfect himself.", author: "Karel Čapek, R.U.R." },
  { text: "Nothing is stranger to man than his own image.", author: "Karel Čapek" },
  { text: "If dogs could talk, perhaps we would find it as hard to get along with them as we do with people.", author: "Karel Čapek" },
  
  // Gene Roddenberry
  { text: "The strength of a civilization is not measured by its ability to fight wars, but rather by its ability to prevent them.", author: "Gene Roddenberry" },
  { text: "If man is to survive, he will have learned to take a delight in the essential differences between men and between cultures.", author: "Gene Roddenberry" },
  { text: "We must question the story logic of having an all-knowing all-powerful God, who creates faulty Humans, and then blames them for his own mistakes.", author: "Gene Roddenberry" },
  { text: "The human race is a remarkable creature, one with great potential, and I hope that Star Trek has helped to show us what we can be if we believe in ourselves and our abilities.", author: "Gene Roddenberry" },
  
  // Success & Abundance
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Abundance is not something we acquire. It is something we tune into.", author: "Wayne Dyer" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  
  // Love & Inspiration
  { text: "Love is the bridge between you and everything.", author: "Rumi" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  
  // Automation & Technology
  { text: "Automation applied to an inefficient operation will magnify the inefficiency.", author: "Bill Gates" },
  { text: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
  { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
  { text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.", author: "Bill Gates" },
];

export function ProductivityBar({ 
  onOpenMindMap, 
  onOpenCalendar, 
  onOpenTodo 
}: { 
  onOpenMindMap: () => void;
  onOpenCalendar: () => void;
  onOpenTodo: () => void;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quote, setQuote] = useState(motivationalQuotes[0]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Change quote daily
  useEffect(() => {
    const dayOfYear = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    setQuote(motivationalQuotes[quoteIndex]);
  }, [currentTime]);

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left: Time & Date with World Clock */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-2xl font-bold tabular-nums">
              {format(currentTime, "HH:mm:ss")}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent transition-colors">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <DropdownMenuLabel>World Clock</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇨🇿</span>
                    <div>
                      <div className="text-sm font-medium">Prague</div>
                      <div className="text-xs text-muted-foreground">CET</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold">
                      {format(currentTime, "HH:mm:ss")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(currentTime, "MMM d")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <div>
                      <div className="text-sm font-medium">New York</div>
                      <div className="text-xs text-muted-foreground">EST</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'America/New_York' })), "HH:mm:ss")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'America/New_York' })), "MMM d")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <div>
                      <div className="text-sm font-medium">Los Angeles</div>
                      <div className="text-xs text-muted-foreground">PST</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })), "HH:mm:ss")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })), "MMM d")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇮🇩</span>
                    <div>
                      <div className="text-sm font-medium">Bali</div>
                      <div className="text-xs text-muted-foreground">WITA</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Makassar' })), "HH:mm:ss")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Makassar' })), "MMM d")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇹🇭</span>
                    <div>
                      <div className="text-sm font-medium">Bangkok</div>
                      <div className="text-xs text-muted-foreground">ICT</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })), "HH:mm:ss")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })), "MMM d")}
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Motivational Quote */}
        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          <div className="flex items-center gap-2 max-w-4xl">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <div className="flex flex-col">
              <p className="text-sm italic text-foreground">
                "{quote.text}"
              </p>
              <p className="text-xs text-muted-foreground">
                — {quote.author}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenMindMap}
            className="gap-2"
          >
            <Network className="h-4 w-4" />
            <span className="hidden sm:inline">Mind Map</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCalendar}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenTodo}
            className="gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">To-Do</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
