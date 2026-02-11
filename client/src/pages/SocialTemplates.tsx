import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Share2,
  Heart,
  MessageCircle,
  UserPlus,
  Send,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Play,
} from "lucide-react";
import { toast } from "sonner";

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  platform: string;
  category: string;
  steps: number;
  popularity: "high" | "medium" | "low";
  icon: React.ElementType;
}

const TEMPLATES: TemplateItem[] = [
  { id: "tw-1", name: "Auto Like & Retweet", description: "Automatically engage with posts matching your keywords and hashtags", platform: "twitter", category: "Engagement", steps: 8, popularity: "high", icon: Heart },
  { id: "tw-2", name: "Follow/Unfollow Manager", description: "Smart follow/unfollow strategy based on target audience criteria", platform: "twitter", category: "Growth", steps: 12, popularity: "high", icon: UserPlus },
  { id: "tw-3", name: "Auto DM Responder", description: "Respond to direct messages with customizable templates", platform: "twitter", category: "Messaging", steps: 6, popularity: "medium", icon: Send },
  { id: "ig-1", name: "Story Viewer Bot", description: "Automatically view stories of target accounts to increase visibility", platform: "instagram", category: "Engagement", steps: 5, popularity: "high", icon: Heart },
  { id: "ig-2", name: "Comment Automation", description: "Post relevant comments on posts matching your niche", platform: "instagram", category: "Engagement", steps: 9, popularity: "medium", icon: MessageCircle },
  { id: "ig-3", name: "Hashtag Research", description: "Analyze and collect trending hashtags in your niche", platform: "instagram", category: "Research", steps: 7, popularity: "medium", icon: TrendingUp },
  { id: "fb-1", name: "Group Post Scheduler", description: "Schedule and auto-post content across multiple Facebook groups", platform: "facebook", category: "Publishing", steps: 10, popularity: "high", icon: Clock },
  { id: "fb-2", name: "Lead Scraper", description: "Extract leads from Facebook groups and pages", platform: "facebook", category: "Research", steps: 8, popularity: "medium", icon: UserPlus },
  { id: "tt-1", name: "Video Engagement Bot", description: "Like, comment, and follow based on trending content", platform: "tiktok", category: "Engagement", steps: 7, popularity: "high", icon: Heart },
  { id: "tt-2", name: "Trend Monitor", description: "Track trending sounds, hashtags, and content patterns", platform: "tiktok", category: "Research", steps: 5, popularity: "medium", icon: TrendingUp },
  { id: "yt-1", name: "Comment Manager", description: "Auto-reply to comments on your videos with smart responses", platform: "youtube", category: "Engagement", steps: 6, popularity: "medium", icon: MessageCircle },
  { id: "yt-2", name: "Subscriber Analyzer", description: "Analyze subscriber growth patterns and engagement metrics", platform: "youtube", category: "Analytics", steps: 8, popularity: "low", icon: TrendingUp },
];

const PLATFORM_LABELS: Record<string, { label: string; emoji: string }> = {
  twitter: { label: "Twitter / X", emoji: "𝕏" },
  instagram: { label: "Instagram", emoji: "📷" },
  facebook: { label: "Facebook", emoji: "📘" },
  tiktok: { label: "TikTok", emoji: "🎵" },
  youtube: { label: "YouTube", emoji: "▶️" },
};

const POPULARITY_COLORS: Record<string, string> = {
  high: "text-green-400 bg-green-500/10 border-green-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-gray-400 bg-gray-500/10 border-gray-500/20",
};

export default function SocialTemplates() {
  const [activePlatform, setActivePlatform] = useState("twitter");

  const filteredTemplates = TEMPLATES.filter((t) => t.platform === activePlatform);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Share2 className="h-6 w-6 text-primary" />
          Social Media Templates
        </h1>
        <p className="text-muted-foreground mt-1">
          Pre-built automation templates for major social media platforms with data-driven logic
        </p>
      </div>

      <Tabs value={activePlatform} onValueChange={setActivePlatform}>
        <TabsList className="h-10">
          {Object.entries(PLATFORM_LABELS).map(([key, { label, emoji }]) => (
            <TabsTrigger key={key} value={key} className="text-sm">
              <span className="mr-1.5">{emoji}</span>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(PLATFORM_LABELS).map((platform) => (
          <TabsContent key={platform} value={platform} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.filter((t) => t.platform === platform).map((template) => (
                <Card key={template.id} className="bg-card border-border group hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className={`text-xs ${POPULARITY_COLORS[template.popularity]}`}>
                        {template.popularity === "high" ? "Popular" : template.popularity === "medium" ? "Trending" : "New"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {template.steps} steps
                        </span>
                        <span className="capitalize">{template.category}</span>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Template "${template.name}" loaded into Script Builder`)}>
                        <Play className="h-3 w-3 mr-1" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
