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
