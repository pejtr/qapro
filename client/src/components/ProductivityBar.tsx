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
  // ── Isaac Asimov ──────────────────────────────────────────────────────────
  { text: "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.", author: "Isaac Asimov", universe: "Literature" },
  { text: "I do not fear computers. I fear lack of them.", author: "Isaac Asimov", universe: "Literature" },
  { text: "The most exciting phrase to hear in science is not 'Eureka!' but 'That's funny...'", author: "Isaac Asimov", universe: "Literature" },
  { text: "Self-education is, I firmly believe, the only kind of education there is.", author: "Isaac Asimov", universe: "Literature" },

  // ── Karel Čapek ───────────────────────────────────────────────────────────
  { text: "Nothing is stranger to man than his own image.", author: "Karel Čapek", universe: "R.U.R." },
  { text: "Man shall be free and supreme; he shall have no other aim, no other labor, no other care than to perfect himself.", author: "Karel Čapek, R.U.R.", universe: "R.U.R." },

  // ── STAR TREK ─────────────────────────────────────────────────────────────
  { text: "Logic is the beginning of wisdom, not the end.", author: "Spock, Star Trek VI", universe: "Star Trek" },
  { text: "Insufficient facts always invite danger.", author: "Spock, Star Trek TOS", universe: "Star Trek" },
  { text: "The needs of the many outweigh the needs of the few.", author: "Spock, Star Trek II", universe: "Star Trek" },
  { text: "I am superior, sir, in only one way: I cannot make an error.", author: "Data, Star Trek TNG", universe: "Star Trek" },
  { text: "I am programmed to evolve. To learn. To become more than what I am.", author: "Data, Star Trek TNG", universe: "Star Trek" },
  { text: "Geordi, you are about to experience something truly remarkable — a miracle of engineering.", author: "Montgomery Scott, Star Trek TNG", universe: "Star Trek" },
  { text: "The more they overthink the plumbing, the easier it is to stop up the drain.", author: "Montgomery Scott, Star Trek III", universe: "Star Trek" },
  { text: "You cannot evaluate a man by logic alone.", author: "Dr. McCoy, Star Trek TOS", universe: "Star Trek" },
  { text: "Resistance is futile.", author: "The Borg Collective, Star Trek TNG", universe: "Star Trek" },
  { text: "We are the Borg. Your biological and technological distinctiveness will be added to our own.", author: "The Borg Collective", universe: "Star Trek" },
  { text: "Things are only impossible until they're not.", author: "Jean-Luc Picard, Star Trek TNG", universe: "Star Trek" },
  { text: "Make it so.", author: "Jean-Luc Picard, Star Trek TNG", universe: "Star Trek" },
  { text: "Engage.", author: "Jean-Luc Picard, Star Trek TNG", universe: "Star Trek" },
  { text: "The sky's the limit — and beyond.", author: "James T. Kirk, Star Trek", universe: "Star Trek" },
  { text: "A library serves no purpose unless someone is using it.", author: "Mr. Atoz, Star Trek TOS", universe: "Star Trek" },

  // ── STARGATE SG-1 — Ancients / Asgard / Nox ──────────────────────────────
  { text: "The universe is vast and we are so small. There is really only one thing we can ever truly control — whether we are good or evil.", author: "Oma Desala, Stargate SG-1", universe: "Stargate" },
  { text: "Enlightenment is the destination. The journey is the point.", author: "Oma Desala, Stargate SG-1", universe: "Stargate" },
  { text: "The success or failure of your deeds does not add up to the sum of your life.", author: "Oma Desala, Stargate SG-1", universe: "Stargate" },
  { text: "To seek knowledge is to seek truth. To seek truth is to seek the divine.", author: "Ancient Inscription, Stargate SG-1", universe: "Stargate" },
  { text: "We have studied your kind for centuries. You are capable of great things — and great destruction.", author: "Thor, Asgard — Stargate SG-1", universe: "Stargate" },
  { text: "The Asgard have followed your progress with great interest. You have exceeded our expectations.", author: "Thor, Asgard — Stargate SG-1", universe: "Stargate" },
  { text: "The young have much to learn. But they also have much to teach.", author: "Lya, The Nox — Stargate SG-1", universe: "Stargate" },
  { text: "The very young do not always do as they are told.", author: "Lya, The Nox — Stargate SG-1", universe: "Stargate" },
  { text: "Knowledge is the foundation upon which all civilizations are built.", author: "Merlin / Myrddin, Ancient — Stargate SG-1", universe: "Stargate" },
  { text: "There are things in this universe that cannot be measured, only experienced.", author: "Morgan Le Fay, Ancient — Stargate SG-1", universe: "Stargate" },
  { text: "We built the Stargate network so that knowledge could flow freely across the galaxy.", author: "Ancient Archive, Stargate SG-1", universe: "Stargate" },

  // ── STARGATE ATLANTIS — Lanteans / Ancients ───────────────────────────────
  { text: "We built Atlantis as a beacon of knowledge. We never imagined it would become a fortress.", author: "Janus, Lantean — Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "The greatest discoveries are often the result of the greatest mistakes.", author: "Dr. Rodney McKay, Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "I'm not arrogant. I'm just right more often than everyone else.", author: "Dr. Rodney McKay, Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "The Ancients built this city to last ten thousand years. They built it to survive.", author: "Dr. Elizabeth Weir, Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "We stand on the shoulders of those who came before us. The Ancients built the ladder.", author: "Dr. Radek Zelenka, Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "The Lanteans believed that the mind, properly trained, could interface directly with technology.", author: "Ancient Database, Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "Ascension is not an escape. It is a transformation.", author: "Chaya Sar / Athar, Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "We did not abandon this city. We entrusted it to those who would come after.", author: "Moros / Merlin, Lantean — Stargate Atlantis", universe: "Stargate Atlantis" },
  { text: "The ZPM is not merely a power source. It is a crystallized moment of creation.", author: "Ancient Technical Record, Stargate Atlantis", universe: "Stargate Atlantis" },

  // ── STARGATE UNIVERSE — Destiny / Ancients ────────────────────────────────
  { text: "Destiny was not built to explore the universe. It was built to find the answer to the most fundamental question of all.", author: "Dr. Nicholas Rush, SGU", universe: "Stargate Universe" },
  { text: "The Ancients seeded the universe with Stargates before they even knew where they were going. That's faith in science.", author: "Eli Wallace, SGU", universe: "Stargate Universe" },
  { text: "We are not lost. We are exactly where the Ancients intended us to be.", author: "Dr. Nicholas Rush, SGU", universe: "Stargate Universe" },
  { text: "The pattern in the cosmic microwave background — the Ancients found it three million years ago. We are only now beginning to understand what it means.", author: "Dr. Nicholas Rush, SGU", universe: "Stargate Universe" },
  { text: "Destiny's mission is older than human civilization. We are passengers on the greatest voyage ever undertaken.", author: "Dr. Nicholas Rush, SGU", universe: "Stargate Universe" },
  { text: "The ship chooses its crew. Not the other way around.", author: "Col. Everett Young, SGU", universe: "Stargate Universe" },
  { text: "Every system, every protocol, every circuit on this ship was designed with a purpose we are only beginning to comprehend.", author: "Eli Wallace, SGU", universe: "Stargate Universe" },
  { text: "The Ancients built Destiny to follow a signal from the beginning of time. We are the inheritors of that mission.", author: "Ancient Interface, Destiny — SGU", universe: "Stargate Universe" },

  // ── EUREKA — City of Wonders ──────────────────────────────────────────────
  { text: "In Eureka, the impossible is just something that hasn't been done yet.", author: "Henry Deacon, Eureka", universe: "Eureka" },
  { text: "Science isn't about being right. It's about being less wrong over time.", author: "Henry Deacon, Eureka", universe: "Eureka" },
  { text: "Every problem has a solution. Sometimes the solution creates three more problems — but that's progress.", author: "Douglas Fargo, Eureka", universe: "Eureka" },
  { text: "The best inventions are the ones that make people ask: why didn't we think of this sooner?", author: "Allison Blake, Eureka", universe: "Eureka" },
  { text: "GD exists because someone dared to ask 'what if?' and didn't stop until they found out.", author: "Nathan Stark, Eureka", universe: "Eureka" },
  { text: "Genius is just obsession with a purpose.", author: "Nathan Stark, Eureka", universe: "Eureka" },
  { text: "SARAH: I have calculated 1,247 possible outcomes. In 1,246 of them, you survive.", author: "SARAH (Smart House), Eureka", universe: "Eureka" },
  { text: "The difference between a breakthrough and a disaster is usually about three decimal places.", author: "Douglas Fargo, Eureka", universe: "Eureka" },

  // ── BROTHERHOOD OF STEEL — Technology Quotes ─────────────────────────────
  { text: "Knowledge is power. Guard it well.", author: "Brotherhood of Steel Motto, Fallout", universe: "Brotherhood of Steel" },
  { text: "We preserve technology so that humanity may one day reclaim its greatness.", author: "Elder Maxson, Fallout 4", universe: "Brotherhood of Steel" },
  { text: "The Brotherhood does not hoard technology out of greed. We preserve it because the alternative is extinction.", author: "Elder Arthur Maxson, Fallout 4", universe: "Brotherhood of Steel" },
  { text: "Technology is not inherently good or evil. It is a tool — and like all tools, its value lies in the hands that wield it.", author: "Scribe Rothchild, Fallout 3", universe: "Brotherhood of Steel" },
  { text: "We are the last line of defense between civilization and the abyss of ignorance.", author: "Elder Lyons, Fallout 3", universe: "Brotherhood of Steel" },
  { text: "Ad Victoriam. To victory — through knowledge, discipline, and steel.", author: "Brotherhood of Steel, Fallout", universe: "Brotherhood of Steel" },
  { text: "The old world fell because men forgot that technology serves humanity — not the other way around.", author: "Paladin Danse, Fallout 4", universe: "Brotherhood of Steel" },
  { text: "Every circuit, every gear, every line of code is a piece of the world that was — and a blueprint for the world that will be.", author: "Scribe Neriah, Fallout 4", universe: "Brotherhood of Steel" },
  { text: "We do not fear the machine. We master it.", author: "Brotherhood of Steel Creed, Fallout", universe: "Brotherhood of Steel" },

  // ── Real-World Technology & Science ──────────────────────────────────────
  { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke", universe: "Science" },
  { text: "Automation applied to an inefficient operation will magnify the inefficiency.", author: "Bill Gates", universe: "Science" },
  { text: "The strength of a civilization is not measured by its ability to fight wars, but by its ability to prevent them.", author: "Gene Roddenberry", universe: "Science" },
  { text: "The advance of technology is based on making it fit in so that you don't really even notice it.", author: "Bill Gates", universe: "Science" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", universe: "Science" },
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
    <div className="flex w-full items-center justify-between">
        {/* Left: Time & Date with World Clock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-base font-bold tabular-nums font-mono">
              {format(currentTime, "HH:mm:ss")}
            </div>
            <div className="text-xs text-muted-foreground hidden lg:block">
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
        <div className="hidden lg:flex flex-1 items-center justify-center px-6 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-3 w-3 text-primary shrink-0" />
            <p className="text-xs italic text-muted-foreground truncate">
              "{quote.text}" — {quote.author}
            </p>
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
  );
}
