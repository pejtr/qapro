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
  Play,
  Eye,
  Hash,
  Target,
  Users,
  Video,
  Music,
  Calendar,
  ShoppingCart,
  Gift,
  Bell,
  Sparkles,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  Share,
  Repeat,
  AtSign,
  Radio,
  Mic,
  Film,
  Image,
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
  features?: string[];
}

const TEMPLATES: TemplateItem[] = [
  // Instagram Templates (10)
  { 
    id: "ig-1", 
    name: "Auto Like & Comment", 
    description: "Automatically like and comment on posts with AI-generated contextual responses", 
    platform: "instagram", 
    category: "Engagement", 
    steps: 8, 
    popularity: "high", 
    icon: Heart,
    features: ["AI Comments", "Hashtag Targeting", "Rate Limiting"]
  },
  { 
    id: "ig-2", 
    name: "Story Viewer & Reply Bot", 
    description: "View stories and send intelligent DM responses to increase engagement", 
    platform: "instagram", 
    category: "Engagement", 
    steps: 6, 
    popularity: "high", 
    icon: Eye,
    features: ["Story Tracking", "Auto Reply", "DM Automation"]
  },
  { 
    id: "ig-3", 
    name: "Hashtag Hunter Pro", 
    description: "Monitor hashtags and engage with posts automatically (like, comment, follow)", 
    platform: "instagram", 
    category: "Growth", 
    steps: 10, 
    popularity: "high", 
    icon: Hash,
    features: ["Hashtag Monitor", "Auto Engage", "Analytics"]
  },
  { 
    id: "ig-4", 
    name: "DM Responder AI", 
    description: "Intelligent DM automation with AI-powered contextual responses", 
    platform: "instagram", 
    category: "Messaging", 
    steps: 7, 
    popularity: "high", 
    icon: Send,
    features: ["AI Responses", "Template Library", "Auto Reply"]
  },
  { 
    id: "ig-5", 
    name: "Follower Tracker & Analyzer", 
    description: "Track follower growth, engagement rates, and identify unfollowers", 
    platform: "instagram", 
    category: "Analytics", 
    steps: 5, 
    popularity: "medium", 
    icon: Users,
    features: ["Growth Analytics", "Unfollow Detection", "Engagement Metrics"]
  },
  { 
    id: "ig-6", 
    name: "Reel Engagement Booster", 
    description: "Automatically engage with trending reels to boost visibility", 
    platform: "instagram", 
    category: "Engagement", 
    steps: 9, 
    popularity: "high", 
    icon: Video,
    features: ["Reel Discovery", "Auto Like", "Comment Bot"]
  },
  { 
    id: "ig-7", 
    name: "Profile Scraper Pro", 
    description: "Extract profile data, followers, and engagement metrics for analysis", 
    platform: "instagram", 
    category: "Research", 
    steps: 8, 
    popularity: "medium", 
    icon: Target,
    features: ["Data Export", "Follower Analysis", "Engagement Stats"]
  },
  { 
    id: "ig-8", 
    name: "Competitor Monitor", 
    description: "Track competitor posts, engagement, and growth strategies", 
    platform: "instagram", 
    category: "Research", 
    steps: 11, 
    popularity: "medium", 
    icon: BarChart3,
    features: ["Competitor Tracking", "Post Analysis", "Growth Insights"]
  },
  { 
    id: "ig-9", 
    name: "Follow/Unfollow Manager", 
    description: "Smart follow/unfollow strategy based on engagement and activity", 
    platform: "instagram", 
    category: "Growth", 
    steps: 12, 
    popularity: "high", 
    icon: UserPlus,
    features: ["Smart Targeting", "Auto Follow", "Unfollow Inactive"]
  },
  { 
    id: "ig-10", 
    name: "Content Scheduler Pro", 
    description: "Schedule posts, stories, and reels with optimal timing analysis", 
    platform: "instagram", 
    category: "Content", 
    steps: 7, 
    popularity: "medium", 
    icon: Calendar,
    features: ["Post Scheduling", "Optimal Timing", "Multi-Post Support"]
  },

  // TikTok Templates (10)
  { 
    id: "tt-1", 
    name: "Video Liker Pro", 
    description: "Automatically like videos based on hashtags, sounds, and creators", 
    platform: "tiktok", 
    category: "Engagement", 
    steps: 7, 
    popularity: "high", 
    icon: Heart,
    features: ["Smart Targeting", "Rate Limiting", "Analytics"]
  },
  { 
    id: "tt-2", 
    name: "Comment Bot AI", 
    description: "Post AI-generated contextual comments on trending videos", 
    platform: "tiktok", 
    category: "Engagement", 
    steps: 9, 
    popularity: "high", 
    icon: MessageCircle,
    features: ["AI Comments", "Trend Detection", "Engagement Tracking"]
  },
  { 
    id: "tt-3", 
    name: "Duet Automation", 
    description: "Automatically create duets with trending content", 
    platform: "tiktok", 
    category: "Content", 
    steps: 10, 
    popularity: "medium", 
    icon: Video,
    features: ["Auto Duet", "Trend Finder", "Video Processing"]
  },
  { 
    id: "tt-4", 
    name: "Hashtag Tracker Pro", 
    description: "Monitor hashtags and engage with posts automatically", 
    platform: "tiktok", 
    category: "Growth", 
    steps: 8, 
    popularity: "high", 
    icon: Hash,
    features: ["Hashtag Monitor", "Auto Engage", "Trend Alerts"]
  },
  { 
    id: "tt-5", 
    name: "Trend Analyzer AI", 
    description: "Analyze trending sounds, hashtags, and content patterns with AI", 
    platform: "tiktok", 
    category: "Research", 
    steps: 6, 
    popularity: "high", 
    icon: TrendingUp,
    features: ["Trend Detection", "Sound Analysis", "Content Insights"]
  },
  { 
    id: "tt-6", 
    name: "Creator Outreach Bot", 
    description: "Automatically reach out to creators for collaborations", 
    platform: "tiktok", 
    category: "Growth", 
    steps: 11, 
    popularity: "medium", 
    icon: Users,
    features: ["Auto DM", "Creator Finder", "Template Messages"]
  },
  { 
    id: "tt-7", 
    name: "Live Stream Monitor", 
    description: "Monitor live streams and engage with viewers automatically", 
    platform: "tiktok", 
    category: "Engagement", 
    steps: 7, 
    popularity: "medium", 
    icon: Radio,
    features: ["Live Detection", "Auto Comment", "Viewer Tracking"]
  },
  { 
    id: "tt-8", 
    name: "Sound Tracker Pro", 
    description: "Track trending sounds and get alerts for viral opportunities", 
    platform: "tiktok", 
    category: "Research", 
    steps: 5, 
    popularity: "medium", 
    icon: Music,
    features: ["Sound Tracking", "Viral Alerts", "Usage Analytics"]
  },
  { 
    id: "tt-9", 
    name: "Challenge Participant Bot", 
    description: "Automatically participate in trending challenges", 
    platform: "tiktok", 
    category: "Content", 
    steps: 12, 
    popularity: "high", 
    icon: Sparkles,
    features: ["Challenge Detection", "Auto Participate", "Engagement Boost"]
  },
  { 
    id: "tt-10", 
    name: "Analytics Dashboard", 
    description: "Comprehensive analytics for views, engagement, and growth", 
    platform: "tiktok", 
    category: "Analytics", 
    steps: 6, 
    popularity: "medium", 
    icon: BarChart3,
    features: ["Growth Metrics", "Engagement Stats", "Trend Reports"]
  },

  // Facebook Templates (10)
  { 
    id: "fb-1", 
    name: "Post Liker Pro", 
    description: "Automatically like posts in groups and pages based on keywords", 
    platform: "facebook", 
    category: "Engagement", 
    steps: 8, 
    popularity: "high", 
    icon: ThumbsUp,
    features: ["Smart Targeting", "Group Support", "Rate Limiting"]
  },
  { 
    id: "fb-2", 
    name: "Comment Responder AI", 
    description: "AI-powered comment responses for posts and pages", 
    platform: "facebook", 
    category: "Engagement", 
    steps: 9, 
    popularity: "high", 
    icon: MessageSquare,
    features: ["AI Responses", "Template Library", "Auto Reply"]
  },
  { 
    id: "fb-3", 
    name: "Group Manager Pro", 
    description: "Manage multiple groups with auto-posting and moderation", 
    platform: "facebook", 
    category: "Management", 
    steps: 12, 
    popularity: "high", 
    icon: Users,
    features: ["Multi-Group", "Auto Post", "Moderation Tools"]
  },
  { 
    id: "fb-4", 
    name: "Page Monitor", 
    description: "Monitor competitor pages and track engagement metrics", 
    platform: "facebook", 
    category: "Research", 
    steps: 7, 
    popularity: "medium", 
    icon: Eye,
    features: ["Page Tracking", "Engagement Stats", "Competitor Analysis"]
  },
  { 
    id: "fb-5", 
    name: "Event Tracker Pro", 
    description: "Track events and automatically engage with attendees", 
    platform: "facebook", 
    category: "Engagement", 
    steps: 10, 
    popularity: "medium", 
    icon: Calendar,
    features: ["Event Monitor", "Auto Engage", "Attendee Tracking"]
  },
  { 
    id: "fb-6", 
    name: "Marketplace Bot", 
    description: "Automate marketplace listings and respond to inquiries", 
    platform: "facebook", 
    category: "Commerce", 
    steps: 11, 
    popularity: "medium", 
    icon: ShoppingCart,
    features: ["Auto List", "Inquiry Response", "Price Tracking"]
  },
  { 
    id: "fb-7", 
    name: "Story Viewer Bot", 
    description: "Automatically view stories to increase visibility", 
    platform: "facebook", 
    category: "Engagement", 
    steps: 5, 
    popularity: "high", 
    icon: Eye,
    features: ["Story Tracking", "Auto View", "Analytics"]
  },
  { 
    id: "fb-8", 
    name: "Friend Request Manager", 
    description: "Smart friend request automation based on mutual friends and interests", 
    platform: "facebook", 
    category: "Growth", 
    steps: 9, 
    popularity: "high", 
    icon: UserPlus,
    features: ["Smart Targeting", "Auto Request", "Accept/Decline Rules"]
  },
  { 
    id: "fb-9", 
    name: "Birthday Greeter", 
    description: "Automatically send birthday wishes to friends and connections", 
    platform: "facebook", 
    category: "Engagement", 
    steps: 4, 
    popularity: "medium", 
    icon: Gift,
    features: ["Auto Greet", "Custom Messages", "Scheduling"]
  },
  { 
    id: "fb-10", 
    name: "Ad Monitor Pro", 
    description: "Track competitor ads and analyze advertising strategies", 
    platform: "facebook", 
    category: "Research", 
    steps: 8, 
    popularity: "medium", 
    icon: Target,
    features: ["Ad Tracking", "Competitor Analysis", "Strategy Insights"]
  },

  // YouTube Templates (10)
  { 
    id: "yt-1", 
    name: "Video Liker Pro", 
    description: "Automatically like videos based on channels and keywords", 
    platform: "youtube", 
    category: "Engagement", 
    steps: 6, 
    popularity: "high", 
    icon: ThumbsUp,
    features: ["Smart Targeting", "Channel Support", "Rate Limiting"]
  },
  { 
    id: "yt-2", 
    name: "Comment Bot AI", 
    description: "Post AI-generated contextual comments on videos", 
    platform: "youtube", 
    category: "Engagement", 
    steps: 9, 
    popularity: "high", 
    icon: MessageCircle,
    features: ["AI Comments", "Engagement Tracking", "Template Library"]
  },
  { 
    id: "yt-3", 
    name: "Subscriber Tracker Pro", 
    description: "Track subscriber growth and analyze engagement patterns", 
    platform: "youtube", 
    category: "Analytics", 
    steps: 7, 
    popularity: "medium", 
    icon: Users,
    features: ["Growth Analytics", "Engagement Metrics", "Trend Reports"]
  },
  { 
    id: "yt-4", 
    name: "Playlist Manager", 
    description: "Organize and optimize playlists for maximum engagement", 
    platform: "youtube", 
    category: "Management", 
    steps: 8, 
    popularity: "medium", 
    icon: Music,
    features: ["Auto Organize", "SEO Optimization", "Analytics"]
  },
  { 
    id: "yt-5", 
    name: "Live Chat Bot", 
    description: "Engage with live stream viewers with automated responses", 
    platform: "youtube", 
    category: "Engagement", 
    steps: 10, 
    popularity: "high", 
    icon: MessageSquare,
    features: ["Live Chat", "Auto Response", "Moderation"]
  },
  { 
    id: "yt-6", 
    name: "Community Post Responder", 
    description: "Automatically respond to community posts with AI", 
    platform: "youtube", 
    category: "Engagement", 
    steps: 7, 
    popularity: "medium", 
    icon: MessageCircle,
    features: ["AI Responses", "Auto Like", "Engagement Boost"]
  },
  { 
    id: "yt-7", 
    name: "Channel Monitor", 
    description: "Monitor competitor channels and track content strategies", 
    platform: "youtube", 
    category: "Research", 
    steps: 9, 
    popularity: "medium", 
    icon: Eye,
    features: ["Channel Tracking", "Content Analysis", "Strategy Insights"]
  },
  { 
    id: "yt-8", 
    name: "Premiere Notifier", 
    description: "Get alerts for premieres and engage automatically", 
    platform: "youtube", 
    category: "Engagement", 
    steps: 6, 
    popularity: "medium", 
    icon: Bell,
    features: ["Premiere Alerts", "Auto Engage", "Reminder System"]
  },
  { 
    id: "yt-9", 
    name: "Shorts Engager Pro", 
    description: "Automatically engage with YouTube Shorts to boost visibility", 
    platform: "youtube", 
    category: "Engagement", 
    steps: 8, 
    popularity: "high", 
    icon: Film,
    features: ["Shorts Discovery", "Auto Like", "Comment Bot"]
  },
  { 
    id: "yt-10", 
    name: "Analytics Tracker", 
    description: "Comprehensive analytics for views, watch time, and revenue", 
    platform: "youtube", 
    category: "Analytics", 
    steps: 7, 
    popularity: "medium", 
    icon: BarChart3,
    features: ["Revenue Tracking", "Watch Time", "Engagement Metrics"]
  },

  // Twitter Templates (10)
  { 
    id: "tw-1", 
    name: "Tweet Liker Pro", 
    description: "Automatically like tweets based on keywords and hashtags", 
    platform: "twitter", 
    category: "Engagement", 
    steps: 8, 
    popularity: "high", 
    icon: Heart,
    features: ["Smart Targeting", "Hashtag Support", "Rate Limiting"]
  },
  { 
    id: "tw-2", 
    name: "Reply Bot AI", 
    description: "Post AI-generated contextual replies to tweets", 
    platform: "twitter", 
    category: "Engagement", 
    steps: 9, 
    popularity: "high", 
    icon: MessageCircle,
    features: ["AI Replies", "Thread Support", "Engagement Tracking"]
  },
  { 
    id: "tw-3", 
    name: "Retweet Automation", 
    description: "Automatically retweet content matching your criteria", 
    platform: "twitter", 
    category: "Engagement", 
    steps: 7, 
    popularity: "high", 
    icon: Repeat,
    features: ["Smart Filtering", "Auto Retweet", "Analytics"]
  },
  { 
    id: "tw-4", 
    name: "DM Responder AI", 
    description: "Intelligent DM automation with AI-powered responses", 
    platform: "twitter", 
    category: "Messaging", 
    steps: 8, 
    popularity: "high", 
    icon: Send,
    features: ["AI Responses", "Template Library", "Auto Reply"]
  },
  { 
    id: "tw-5", 
    name: "Hashtag Monitor Pro", 
    description: "Monitor hashtags and engage with tweets automatically", 
    platform: "twitter", 
    category: "Growth", 
    steps: 10, 
    popularity: "high", 
    icon: Hash,
    features: ["Hashtag Tracking", "Auto Engage", "Trend Alerts"]
  },
  { 
    id: "tw-6", 
    name: "Thread Reader Bot", 
    description: "Automatically read and engage with Twitter threads", 
    platform: "twitter", 
    category: "Engagement", 
    steps: 6, 
    popularity: "medium", 
    icon: MessageSquare,
    features: ["Thread Detection", "Auto Like", "Reply Support"]
  },
  { 
    id: "tw-7", 
    name: "Space Listener", 
    description: "Monitor Twitter Spaces and engage with participants", 
    platform: "twitter", 
    category: "Engagement", 
    steps: 9, 
    popularity: "medium", 
    icon: Mic,
    features: ["Space Alerts", "Auto Join", "Engagement Tracking"]
  },
  { 
    id: "tw-8", 
    name: "Poll Voter Pro", 
    description: "Automatically vote on polls based on your preferences", 
    platform: "twitter", 
    category: "Engagement", 
    steps: 5, 
    popularity: "medium", 
    icon: BarChart3,
    features: ["Auto Vote", "Poll Discovery", "Analytics"]
  },
  { 
    id: "tw-9", 
    name: "Mention Tracker", 
    description: "Track mentions and respond automatically with AI", 
    platform: "twitter", 
    category: "Engagement", 
    steps: 8, 
    popularity: "high", 
    icon: AtSign,
    features: ["Mention Alerts", "AI Responses", "Engagement Stats"]
  },
  { 
    id: "tw-10", 
    name: "Trend Analyzer AI", 
    description: "Analyze trending topics and optimize engagement strategy", 
    platform: "twitter", 
    category: "Research", 
    steps: 7, 
    popularity: "medium", 
    icon: TrendingUp,
    features: ["Trend Detection", "Strategy Insights", "Analytics"]
  },
];

const PLATFORM_LABELS: Record<string, { label: string; emoji: string }> = {
  all: { label: "All Platforms", emoji: "🌐" },
  instagram: { label: "Instagram", emoji: "📷" },
  tiktok: { label: "TikTok", emoji: "🎵" },
  facebook: { label: "Facebook", emoji: "📘" },
  youtube: { label: "YouTube", emoji: "▶️" },
  twitter: { label: "Twitter / X", emoji: "𝕏" },
};

const POPULARITY_COLORS: Record<string, string> = {
  high: "text-green-400 bg-green-500/10 border-green-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-gray-400 bg-gray-500/10 border-gray-500/20",
};

export default function SocialTemplates() {
  const [activePlatform, setActivePlatform] = useState("all");

  const filteredTemplates = activePlatform === "all" 
    ? TEMPLATES 
    : TEMPLATES.filter((t) => t.platform === activePlatform);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Share2 className="h-6 w-6 text-primary" />
          Social Media Templates
        </h1>
        <p className="text-muted-foreground mt-1">
          50+ pre-built automation templates with intelligent engagement, AI comments, and viral growth strategies
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
              {filteredTemplates.map((template) => (
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
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    {template.features && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs px-2 py-0 h-5">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {template.steps} steps
                        </span>
                        <span className="capitalize">{template.category}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs" 
                        onClick={() => toast.success(`Template "${template.name}" loaded into Script Builder`)}
                      >
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
