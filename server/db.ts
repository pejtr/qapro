import { eq, and, desc, gt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, scripts, profiles, executions, containers, templates, 
  InsertScript, InsertProfile, InsertExecution, InsertContainer,
  workspaces, InsertWorkspace, workspaceMembers, InsertWorkspaceMember,
  collaborationSessions, InsertCollaborationSession,
  marketplaceTemplates, InsertMarketplaceTemplate,
  templateReviews, InsertTemplateReview,
  templatePurchases, InsertTemplatePurchase,
  documentations, InsertDocumentation
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== Scripts ==========
export async function getScriptsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scripts).where(eq(scripts.userId, userId)).orderBy(desc(scripts.updatedAt));
}

export async function getScriptById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(scripts).where(and(eq(scripts.id, id), eq(scripts.userId, userId))).limit(1);
  return result[0];
}

export async function createScript(data: InsertScript) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(scripts).values(data);
  return { id: Number(result[0].insertId) };
}

export async function updateScript(id: number, userId: number, data: Partial<InsertScript>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(scripts).set(data).where(and(eq(scripts.id, id), eq(scripts.userId, userId)));
}

export async function deleteScript(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(scripts).where(and(eq(scripts.id, id), eq(scripts.userId, userId)));
}

// ========== Profiles ==========
export async function getProfilesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(profiles).where(eq(profiles.userId, userId)).orderBy(desc(profiles.updatedAt));
}

export async function getProfileById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(profiles).where(and(eq(profiles.id, id), eq(profiles.userId, userId))).limit(1);
  return result[0];
}

export async function createProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(profiles).values(data);
  return { id: Number(result[0].insertId) };
}

export async function updateProfile(id: number, userId: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(profiles).set(data).where(and(eq(profiles.id, id), eq(profiles.userId, userId)));
}

export async function deleteProfile(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(profiles).where(and(eq(profiles.id, id), eq(profiles.userId, userId)));
}

// ========== Executions ==========
export async function getExecutionsByUser(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(executions).where(eq(executions.userId, userId)).orderBy(desc(executions.createdAt)).limit(limit);
}

export async function createExecution(data: InsertExecution) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(executions).values(data);
  return { id: Number(result[0].insertId) };
}

export async function getExecutionById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(executions).where(and(eq(executions.id, id), eq(executions.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateExecution(id: number, userId: number, data: Partial<InsertExecution>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(executions).set(data).where(and(eq(executions.id, id), eq(executions.userId, userId)));
  const [execution] = await db.select().from(executions).where(eq(executions.id, id)).limit(1);
  return execution;
}

// ========== Containers ==========
export async function getContainersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(containers).where(eq(containers.userId, userId)).orderBy(desc(containers.updatedAt));
}

export async function createContainer(data: InsertContainer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(containers).values(data);
  return { id: Number(result[0].insertId) };
}

export async function updateContainer(id: number, userId: number, data: Partial<InsertContainer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(containers).set(data).where(and(eq(containers.id, id), eq(containers.userId, userId)));
}

export async function deleteContainer(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(containers).where(and(eq(containers.id, id), eq(containers.userId, userId)));
}

// ========== Templates ==========
export async function getAllTemplates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(templates).orderBy(templates.platform);
}

export async function getTemplateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
  return result[0];
}

// ========== Dashboard Stats ==========
export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return { totalScripts: 0, totalProfiles: 0, totalExecutions: 0, runningInstances: 0, successRate: 0 };
  
  const [scriptCount] = await db.select({ count: sql<number>`count(*)` }).from(scripts).where(eq(scripts.userId, userId));
  const [profileCount] = await db.select({ count: sql<number>`count(*)` }).from(profiles).where(eq(profiles.userId, userId));
  const [execCount] = await db.select({ count: sql<number>`count(*)` }).from(executions).where(eq(executions.userId, userId));
  const [runningCount] = await db.select({ count: sql<number>`count(*)` }).from(executions).where(and(eq(executions.userId, userId), eq(executions.status, "running")));
  const [completedCount] = await db.select({ count: sql<number>`count(*)` }).from(executions).where(and(eq(executions.userId, userId), eq(executions.status, "completed")));
  
  const total = Number(execCount?.count || 0);
  const completed = Number(completedCount?.count || 0);
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    totalScripts: Number(scriptCount?.count || 0),
    totalProfiles: Number(profileCount?.count || 0),
    totalExecutions: total,
    runningInstances: Number(runningCount?.count || 0),
    successRate,
  };
}


// ========== Workspaces & Collaboration ==========
export async function getWorkspacesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workspaces).where(eq(workspaces.ownerId, userId)).orderBy(desc(workspaces.updatedAt));
}

export async function createWorkspace(data: InsertWorkspace) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(workspaces).values(data);
  return { id: Number(result[0].insertId) };
}

export async function getWorkspaceMembers(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workspaceMembers).where(eq(workspaceMembers.workspaceId, workspaceId));
}

export async function addWorkspaceMember(data: InsertWorkspaceMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(workspaceMembers).values(data);
  return { id: Number(result[0].insertId) };
}

export async function getActiveSessions(scriptId: number) {
  const db = await getDb();
  if (!db) return [];
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return db.select().from(collaborationSessions)
    .where(and(eq(collaborationSessions.scriptId, scriptId), gt(collaborationSessions.lastActiveAt, fiveMinutesAgo)));
}

export async function upsertCollaborationSession(data: InsertCollaborationSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(collaborationSessions).values(data).onDuplicateKeyUpdate({
    set: { cursorPosition: data.cursorPosition, selectedNodeId: data.selectedNodeId, lastActiveAt: new Date() }
  });
}

// ========== Marketplace ==========
export async function getMarketplaceTemplates(filters?: { category?: string; platform?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(marketplaceTemplates.status, 'published')];
  if (filters?.category) conditions.push(eq(marketplaceTemplates.category, filters.category));
  if (filters?.platform) conditions.push(eq(marketplaceTemplates.platform, filters.platform as any));
  return db.select().from(marketplaceTemplates)
    .where(and(...conditions))
    .orderBy(desc(marketplaceTemplates.downloads))
    .limit(filters?.limit || 50);
}

export async function getMarketplaceTemplateById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(marketplaceTemplates).where(eq(marketplaceTemplates.id, id)).limit(1);
  return result[0];
}

export async function createMarketplaceTemplate(data: InsertMarketplaceTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(marketplaceTemplates).values(data);
  return { id: Number(result[0].insertId) };
}

export async function updateMarketplaceTemplate(id: number, creatorId: number, data: Partial<InsertMarketplaceTemplate>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(marketplaceTemplates).set(data).where(and(eq(marketplaceTemplates.id, id), eq(marketplaceTemplates.creatorId, creatorId)));
}

export async function incrementTemplateDownloads(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(marketplaceTemplates).set({ downloads: sql`downloads + 1` }).where(eq(marketplaceTemplates.id, id));
}

export async function getTemplateReviews(templateId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(templateReviews).where(eq(templateReviews.templateId, templateId)).orderBy(desc(templateReviews.createdAt));
}

export async function createTemplateReview(data: InsertTemplateReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(templateReviews).values(data);
  return { id: Number(result[0].insertId) };
}

export async function createTemplatePurchase(data: InsertTemplatePurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(templatePurchases).values(data);
  return { id: Number(result[0].insertId) };
}

export async function hasUserPurchased(templateId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(templatePurchases)
    .where(and(eq(templatePurchases.templateId, templateId), eq(templatePurchases.userId, userId))).limit(1);
  return result.length > 0;
}

// ========== Documentation ==========
export async function getDocumentationsByScript(scriptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documentations).where(eq(documentations.scriptId, scriptId)).orderBy(desc(documentations.version));
}

export async function createDocumentation(data: InsertDocumentation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(documentations).values(data);
  return { id: Number(result[0].insertId) };
}

export async function updateDocumentation(id: number, userId: number, data: Partial<InsertDocumentation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(documentations).set(data).where(and(eq(documentations.id, id), eq(documentations.userId, userId)));
}
