import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

const scriptNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.string(), z.unknown()),
});

const scriptEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  type: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Scripts CRUD
  scripts: router({
    list: protectedProcedure.query(({ ctx }) => db.getScriptsByUser(ctx.user.id)),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => db.getScriptById(input.id, ctx.user.id)),
    create: protectedProcedure.input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      nodes: z.array(scriptNodeSchema).optional(),
      edges: z.array(scriptEdgeSchema).optional(),
    })).mutation(({ ctx, input }) => db.createScript({ ...input, userId: ctx.user.id, nodes: input.nodes || [], edges: input.edges || [] })),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      nodes: z.array(scriptNodeSchema).optional(),
      edges: z.array(scriptEdgeSchema).optional(),
      status: z.enum(["draft", "ready", "running", "paused", "error"]).optional(),
    })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return db.updateScript(id, ctx.user.id, data);
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => db.deleteScript(input.id, ctx.user.id)),
  }),

  // Profiles CRUD
  profiles: router({
    list: protectedProcedure.query(({ ctx }) => db.getProfilesByUser(ctx.user.id)),
    get: protectedProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => db.getProfileById(input.id, ctx.user.id)),
    create: protectedProcedure.input(z.object({
      name: z.string().min(1).max(255),
      platform: z.enum(["twitter", "instagram", "facebook", "tiktok", "youtube", "custom"]).optional(),
      proxyHost: z.string().optional(),
      proxyPort: z.number().optional(),
      proxyUsername: z.string().optional(),
      proxyPassword: z.string().optional(),
      userAgent: z.string().optional(),
      credentials: z.record(z.string(), z.string()).optional(),
    })).mutation(({ ctx, input }) => db.createProfile({ ...input, userId: ctx.user.id, credentials: input.credentials as Record<string, string> | undefined })),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      platform: z.enum(["twitter", "instagram", "facebook", "tiktok", "youtube", "custom"]).optional(),
      proxyHost: z.string().nullable().optional(),
      proxyPort: z.number().nullable().optional(),
      proxyUsername: z.string().nullable().optional(),
      proxyPassword: z.string().nullable().optional(),
      userAgent: z.string().nullable().optional(),
      credentials: z.record(z.string(), z.string()).optional(),
      status: z.enum(["active", "inactive", "banned", "warming"]).optional(),
    })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return db.updateProfile(id, ctx.user.id, data as any);
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => db.deleteProfile(input.id, ctx.user.id)),
  }),

  // Executions
  executions: router({
    list: protectedProcedure.input(z.object({ limit: z.number().optional() }).optional()).query(({ ctx, input }) => db.getExecutionsByUser(ctx.user.id, input?.limit)),
    create: protectedProcedure.input(z.object({
      scriptId: z.number(),
      profileId: z.number().optional(),
      stepsTotal: z.number().optional(),
    })).mutation(({ ctx, input }) => db.createExecution({
      ...input,
      userId: ctx.user.id,
      status: "queued",
      startedAt: new Date(),
      stepsCompleted: 0,
      stepsTotal: input.stepsTotal || 0,
    })),
  }),

  // Containers
  containers: router({
    list: protectedProcedure.query(({ ctx }) => db.getContainersByUser(ctx.user.id)),
    create: protectedProcedure.input(z.object({
      name: z.string().min(1).max(255),
      host: z.string().min(1),
      port: z.number(),
    })).mutation(({ ctx, input }) => db.createContainer({ ...input, userId: ctx.user.id })),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      name: z.string().optional(),
      status: z.enum(["running", "stopped", "error", "deploying"]).optional(),
    })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return db.updateContainer(id, ctx.user.id, data);
    }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => db.deleteContainer(input.id, ctx.user.id)),
  }),

  // Templates
  templates: router({
    list: publicProcedure.query(() => db.getAllTemplates()),
    get: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getTemplateById(input.id)),
  }),

  // Dashboard
  dashboard: router({
    stats: protectedProcedure.query(({ ctx }) => db.getDashboardStats(ctx.user.id)),
  }),

  // Collaboration
  collaboration: router({
    workspaces: protectedProcedure.query(({ ctx }) => db.getWorkspacesByUser(ctx.user.id)),
    createWorkspace: protectedProcedure.input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
    })).mutation(({ ctx, input }) => db.createWorkspace({ ...input, ownerId: ctx.user.id })),
    getMembers: protectedProcedure.input(z.object({ workspaceId: z.number() })).query(({ input }) => db.getWorkspaceMembers(input.workspaceId)),
    addMember: protectedProcedure.input(z.object({
      workspaceId: z.number(),
      userId: z.number(),
      role: z.enum(["owner", "editor", "viewer"]),
    })).mutation(({ input }) => db.addWorkspaceMember(input)),
    getActiveSessions: protectedProcedure.input(z.object({ scriptId: z.number() })).query(({ input }) => db.getActiveSessions(input.scriptId)),
    updateSession: protectedProcedure.input(z.object({
      scriptId: z.number(),
      cursorPosition: z.object({ x: z.number(), y: z.number() }).optional(),
      selectedNodeId: z.string().optional(),
    })).mutation(({ ctx, input }) => db.upsertCollaborationSession({ ...input, userId: ctx.user.id })),
  }),

  // Marketplace
  marketplace: router({
    list: publicProcedure.input(z.object({
      category: z.string().optional(),
      platform: z.string().optional(),
      limit: z.number().optional(),
    }).optional()).query(({ input }) => db.getMarketplaceTemplates(input)),
    get: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getMarketplaceTemplateById(input.id)),
    create: protectedProcedure.input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.string().optional(),
      platform: z.enum(["twitter", "instagram", "facebook", "tiktok", "youtube", "multi"]),
      nodes: z.array(scriptNodeSchema).optional(),
      edges: z.array(scriptEdgeSchema).optional(),
      price: z.number().optional(),
    })).mutation(({ ctx, input }) => db.createMarketplaceTemplate({ ...input, creatorId: ctx.user.id, nodes: input.nodes || [], edges: input.edges || [] })),
    publish: protectedProcedure.input(z.object({ id: z.number() })).mutation(({ ctx, input }) => 
      db.updateMarketplaceTemplate(input.id, ctx.user.id, { status: "published" })
    ),
    purchase: protectedProcedure.input(z.object({ templateId: z.number() })).mutation(async ({ ctx, input }) => {
      const template = await db.getMarketplaceTemplateById(input.templateId);
      if (!template) throw new Error("Template not found");
      await db.createTemplatePurchase({ templateId: input.templateId, userId: ctx.user.id, price: template.price });
      await db.incrementTemplateDownloads(input.templateId);
      return { success: true };
    }),
    getReviews: publicProcedure.input(z.object({ templateId: z.number() })).query(({ input }) => db.getTemplateReviews(input.templateId)),
    addReview: protectedProcedure.input(z.object({
      templateId: z.number(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    })).mutation(({ ctx, input }) => db.createTemplateReview({ ...input, userId: ctx.user.id })),
    hasPurchased: protectedProcedure.input(z.object({ templateId: z.number() })).query(({ ctx, input }) => 
      db.hasUserPurchased(input.templateId, ctx.user.id)
    ),
  }),

  // Documentation
  documentation: router({
    list: protectedProcedure.input(z.object({ scriptId: z.number() })).query(({ input }) => db.getDocumentationsByScript(input.scriptId)),
    generate: protectedProcedure.input(z.object({
      scriptId: z.number(),
      title: z.string().min(1).max(255),
      format: z.enum(["markdown", "html", "pdf"]).optional(),
    })).mutation(async ({ ctx, input }) => {
      const script = await db.getScriptById(input.scriptId, ctx.user.id);
      if (!script) throw new Error("Script not found");
      
      // Generate markdown documentation from script nodes
      const content = generateDocumentationContent(script);
      
      return db.createDocumentation({
        scriptId: input.scriptId,
        userId: ctx.user.id,
        title: input.title,
        content,
        format: input.format || "markdown",
      });
    }),
    update: protectedProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
    })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return db.updateDocumentation(id, ctx.user.id, data);
    }),
  }),
});

// Helper function to generate documentation content from script
function generateDocumentationContent(script: any): string {
  const lines = [
    `# ${script.name}`,
    ``,
    script.description ? `${script.description}` : '',
    ``,
    `## Workflow Steps`,
    ``,
  ];

  const nodes = script.nodes || [];
  nodes.forEach((node: any, index: number) => {
    lines.push(`### Step ${index + 1}: ${node.data.label || node.type}`);
    lines.push(``);
    lines.push(`**Type:** ${node.type}`);
    if (node.data.url) lines.push(`**URL:** ${node.data.url}`);
    if (node.data.selector) lines.push(`**Selector:** \`${node.data.selector}\``);
    if (node.data.value) lines.push(`**Value:** ${node.data.value}`);
    if (node.data.wait) lines.push(`**Wait:** ${node.data.wait}ms`);
    lines.push(``);
  });

  lines.push(`## Metadata`);
  lines.push(``);
  lines.push(`- **Created:** ${new Date(script.createdAt).toLocaleDateString()}`);
  lines.push(`- **Last Updated:** ${new Date(script.updatedAt).toLocaleDateString()}`);
  lines.push(`- **Total Steps:** ${nodes.length}`);
  lines.push(`- **Status:** ${script.status}`);

  return lines.filter(Boolean).join('\n');
}

export type AppRouter = typeof appRouter;
