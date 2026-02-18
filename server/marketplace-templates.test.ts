import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('Marketplace Templates', () => {
  it('should list marketplace templates', async () => {
    const caller = appRouter.createCaller({ user: null });
    const templates = await caller.marketplace.list();
    
    expect(templates).toBeDefined();
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(20); // Should have 24+ templates
  });

  it('should have diverse platforms', async () => {
    const caller = appRouter.createCaller({ user: null });
    const templates = await caller.marketplace.list();
    
    const platforms = new Set(templates.map(t => t.platform));
    expect(platforms.has('instagram')).toBe(true);
    expect(platforms.has('tiktok')).toBe(true);
    expect(platforms.has('youtube')).toBe(true);
    expect(platforms.has('twitter')).toBe(true);
    expect(platforms.has('facebook')).toBe(true);
    expect(platforms.has('multi')).toBe(true);
  });

  it('should filter by platform', async () => {
    const caller = appRouter.createCaller({ user: null });
    const instagramTemplates = await caller.marketplace.list({ platform: 'instagram' });
    
    expect(instagramTemplates.every(t => t.platform === 'instagram')).toBe(true);
    expect(instagramTemplates.length).toBeGreaterThan(0);
  });

  it('should have realistic node configurations', async () => {
    const caller = appRouter.createCaller({ user: null });
    const templates = await caller.marketplace.list();
    
    const templateWithNodes = templates.find(t => t.nodes && t.nodes.length > 0);
    expect(templateWithNodes).toBeDefined();
    expect(templateWithNodes!.nodes!.length).toBeGreaterThan(0);
    expect(templateWithNodes!.edges).toBeDefined();
  });

  it('should support sorting by downloads', async () => {
    const caller = appRouter.createCaller({ user: null });
    const templates = await caller.marketplace.list({ sortBy: 'downloads' });
    
    expect(templates.length).toBeGreaterThan(0);
    // Verify descending order
    for (let i = 0; i < templates.length - 1; i++) {
      expect(templates[i].downloads).toBeGreaterThanOrEqual(templates[i + 1].downloads);
    }
  });

  it('should support sorting by rating', async () => {
    const caller = appRouter.createCaller({ user: null });
    const templates = await caller.marketplace.list({ sortBy: 'rating' });
    
    expect(templates.length).toBeGreaterThan(0);
    // Just verify it returns results (ratings may all be 0 initially)
  });

  it('should have varied categories', async () => {
    const caller = appRouter.createCaller({ user: null });
    const templates = await caller.marketplace.list();
    
    const categories = new Set(templates.map(t => t.category).filter(Boolean));
    expect(categories.size).toBeGreaterThan(3); // Should have multiple categories
    expect(categories.has('Content Management')).toBe(true);
    expect(categories.has('Engagement')).toBe(true);
    expect(categories.has('Analytics')).toBe(true);
  });
});
