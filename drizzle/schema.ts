import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const scripts = mysqlTable("scripts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  nodes: json("nodes").$type<ScriptNode[]>(),
  edges: json("edges").$type<ScriptEdge[]>(),
  status: mysqlEnum("status", ["draft", "ready", "running", "paused", "error"]).default("draft").notNull(),
  lastRunAt: timestamp("lastRunAt"),
  runCount: int("runCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Script = typeof scripts.$inferSelect;
export type InsertScript = typeof scripts.$inferInsert;

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  platform: mysqlEnum("platform", ["twitter", "instagram", "facebook", "tiktok", "youtube", "custom"]).default("custom").notNull(),
  proxyHost: varchar("proxyHost", { length: 255 }),
  proxyPort: int("proxyPort"),
  proxyUsername: varchar("proxyUsername", { length: 255 }),
  proxyPassword: varchar("proxyPassword", { length: 255 }),
  userAgent: text("userAgent"),
  credentials: json("credentials").$type<Record<string, string>>(),
  status: mysqlEnum("status", ["active", "inactive", "banned", "warming"]).default("active").notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

export const executions = mysqlTable("executions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  scriptId: int("scriptId").notNull(),
  profileId: int("profileId"),
  status: mysqlEnum("status", ["queued", "running", "completed", "failed", "cancelled"]).default("queued").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  duration: int("duration"),
  stepsCompleted: int("stepsCompleted").default(0).notNull(),
  stepsTotal: int("stepsTotal").default(0).notNull(),
  logs: json("logs").$type<ExecutionLog[]>(),
  error: text("error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Execution = typeof executions.$inferSelect;
export type InsertExecution = typeof executions.$inferInsert;

export const containers = mysqlTable("containers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  containerId: varchar("containerId", { length: 64 }),
  host: varchar("host", { length: 255 }).notNull(),
  port: int("port").notNull(),
  status: mysqlEnum("status", ["running", "stopped", "error", "deploying"]).default("stopped").notNull(),
  cpuUsage: int("cpuUsage").default(0),
  memoryUsage: int("memoryUsage").default(0),
  assignedScripts: json("assignedScripts").$type<number[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Container = typeof containers.$inferSelect;
export type InsertContainer = typeof containers.$inferInsert;

export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  platform: mysqlEnum("platform", ["twitter", "instagram", "facebook", "tiktok", "youtube"]).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  nodes: json("nodes").$type<ScriptNode[]>(),
  edges: json("edges").$type<ScriptEdge[]>(),
  isBuiltIn: int("isBuiltIn").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Template = typeof templates.$inferSelect;

export interface ScriptNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface ScriptEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface ExecutionLog {
  timestamp: number;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  step?: number;
  screenshot?: string;
}

// Collaboration tables
export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

export const workspaceMembers = mysqlTable("workspace_members", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "editor", "viewer"]).default("viewer").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;

export const collaborationSessions = mysqlTable("collaboration_sessions", {
  id: int("id").autoincrement().primaryKey(),
  scriptId: int("scriptId").notNull(),
  userId: int("userId").notNull(),
  cursorPosition: json("cursorPosition").$type<{ x: number; y: number }>(),
  selectedNodeId: varchar("selectedNodeId", { length: 64 }),
  lastActiveAt: timestamp("lastActiveAt").defaultNow().notNull(),
});

export type CollaborationSession = typeof collaborationSessions.$inferSelect;
export type InsertCollaborationSession = typeof collaborationSessions.$inferInsert;

// Marketplace tables
export const marketplaceTemplates = mysqlTable("marketplace_templates", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  platform: mysqlEnum("platform", ["twitter", "instagram", "facebook", "tiktok", "youtube", "multi"]).notNull(),
  nodes: json("nodes").$type<ScriptNode[]>(),
  edges: json("edges").$type<ScriptEdge[]>(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  price: int("price").default(0).notNull(),
  downloads: int("downloads").default(0).notNull(),
  rating: int("rating").default(0),
  reviewCount: int("reviewCount").default(0).notNull(),
  status: mysqlEnum("status", ["draft", "published", "rejected"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketplaceTemplate = typeof marketplaceTemplates.$inferSelect;
export type InsertMarketplaceTemplate = typeof marketplaceTemplates.$inferInsert;

export const templateReviews = mysqlTable("template_reviews", {
  id: int("id").autoincrement().primaryKey(),
  templateId: int("templateId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TemplateReview = typeof templateReviews.$inferSelect;
export type InsertTemplateReview = typeof templateReviews.$inferInsert;

export const templatePurchases = mysqlTable("template_purchases", {
  id: int("id").autoincrement().primaryKey(),
  templateId: int("templateId").notNull(),
  userId: int("userId").notNull(),
  price: int("price").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type TemplatePurchase = typeof templatePurchases.$inferSelect;
export type InsertTemplatePurchase = typeof templatePurchases.$inferInsert;

// Documentation tables
export const documentations = mysqlTable("documentations", {
  id: int("id").autoincrement().primaryKey(),
  scriptId: int("scriptId").notNull(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  format: mysqlEnum("format", ["markdown", "html", "pdf"]).default("markdown").notNull(),
  version: int("version").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Documentation = typeof documentations.$inferSelect;
export type InsertDocumentation = typeof documentations.$inferInsert;


// ========== Blog System ==========
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: int("authorId").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  featuredImage: varchar("featuredImage", { length: 512 }),
  metaDescription: varchar("metaDescription", { length: 320 }),
  keywords: text("keywords"),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

export const blogTags = mysqlTable("blog_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogTag = typeof blogTags.$inferInsert;

export const blogPostCategories = mysqlTable("blog_post_categories", {
  postId: int("postId").notNull(),
  categoryId: int("categoryId").notNull(),
});

export const blogPostTags = mysqlTable("blog_post_tags", {
  postId: int("postId").notNull(),
  tagId: int("tagId").notNull(),
});

export const blogComments = mysqlTable("blog_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;


export const snippets = mysqlTable("snippets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["selectors", "actions", "assertions", "api_calls", "custom"]).default("custom").notNull(),
  code: text("code").notNull(),
  language: varchar("language", { length: 50 }).default("javascript").notNull(),
  tags: json("tags").$type<string[]>(),
  isPublic: int("isPublic").default(0).notNull(), // 0 = false, 1 = true
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Snippet = typeof snippets.$inferSelect;
export type InsertSnippet = typeof snippets.$inferInsert;


// ========== Engagement Automation ==========
export const engagementCampaigns = mysqlTable("engagement_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  platform: mysqlEnum("platform", ["instagram", "tiktok", "facebook", "youtube", "twitter"]).notNull(),
  type: mysqlEnum("type", ["like", "comment", "follow", "view_story", "send_dm", "hashtag_monitor"]).notNull(),
  targetCriteria: json("targetCriteria").$type<{
    hashtags?: string[];
    keywords?: string[];
    accounts?: string[];
    minLikes?: number;
    maxLikes?: number;
  }>(),
  actionConfig: json("actionConfig").$type<{
    useAI?: boolean;
    commentTemplates?: string[];
    dmTemplates?: string[];
    maxActionsPerDay?: number;
    delayBetweenActions?: number; // seconds
  }>(),
  status: mysqlEnum("status", ["active", "paused", "completed", "error"]).default("paused").notNull(),
  actionsCompleted: int("actionsCompleted").default(0).notNull(),
  actionsTarget: int("actionsTarget"),
  lastRunAt: timestamp("lastRunAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EngagementCampaign = typeof engagementCampaigns.$inferSelect;
export type InsertEngagementCampaign = typeof engagementCampaigns.$inferInsert;

export const engagementActions = mysqlTable("engagement_actions", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  platform: mysqlEnum("platform", ["instagram", "tiktok", "facebook", "youtube", "twitter"]).notNull(),
  actionType: mysqlEnum("actionType", ["like", "comment", "follow", "view_story", "send_dm"]).notNull(),
  targetUrl: varchar("targetUrl", { length: 512 }),
  targetUsername: varchar("targetUsername", { length: 255 }),
  targetPostId: varchar("targetPostId", { length: 255 }),
  content: text("content"), // comment or DM content
  status: mysqlEnum("status", ["pending", "completed", "failed", "skipped"]).default("pending").notNull(),
  error: text("error"),
  executedAt: timestamp("executedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EngagementAction = typeof engagementActions.$inferSelect;
export type InsertEngagementAction = typeof engagementActions.$inferInsert;

export const hashtagMonitors = mysqlTable("hashtag_monitors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: mysqlEnum("platform", ["instagram", "tiktok", "facebook", "youtube", "twitter"]).notNull(),
  hashtag: varchar("hashtag", { length: 255 }).notNull(),
  autoEngage: int("autoEngage").default(0).notNull(), // boolean
  engagementActions: json("engagementActions").$type<("like" | "comment" | "follow")[]>(),
  commentTemplates: json("commentTemplates").$type<string[]>(),
  useAI: int("useAI").default(0).notNull(), // boolean
  maxActionsPerDay: int("maxActionsPerDay").default(50).notNull(),
  lastCheckedAt: timestamp("lastCheckedAt"),
  isActive: int("isActive").default(1).notNull(), // boolean
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HashtagMonitor = typeof hashtagMonitors.$inferSelect;
export type InsertHashtagMonitor = typeof hashtagMonitors.$inferInsert;

export const aiCommentHistory = mysqlTable("ai_comment_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: mysqlEnum("platform", ["instagram", "tiktok", "facebook", "youtube", "twitter"]).notNull(),
  postUrl: varchar("postUrl", { length: 512 }),
  postContent: text("postContent"),
  generatedComment: text("generatedComment").notNull(),
  wasUsed: int("wasUsed").default(0).notNull(), // boolean
  feedback: mysqlEnum("feedback", ["good", "bad", "neutral"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AICommentHistory = typeof aiCommentHistory.$inferSelect;
export type InsertAICommentHistory = typeof aiCommentHistory.$inferInsert;
