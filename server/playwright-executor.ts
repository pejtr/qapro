import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';

export interface ExecutionStep {
  type: 'click' | 'fill' | 'navigate' | 'wait' | 'screenshot' | 'assert';
  selector?: string;
  value?: string;
  url?: string;
  timeout?: number;
}

export interface ExecutionConfig {
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  viewport?: { width: number; height: number };
  userAgent?: string;
  proxy?: {
    server: string;
    username?: string;
    password?: string;
  };
}

export interface ExecutionResult {
  success: boolean;
  logs: string[];
  screenshots: string[];
  error?: string;
  duration: number;
}

export class PlaywrightExecutor {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async initialize(config: ExecutionConfig): Promise<void> {
    const browserType = config.browser === 'chromium' ? chromium : 
                       config.browser === 'firefox' ? firefox : webkit;

    this.browser = await browserType.launch({
      headless: config.headless,
    });

    this.context = await this.browser.newContext({
      viewport: config.viewport,
      userAgent: config.userAgent,
      proxy: config.proxy,
    });

    this.page = await this.context.newPage();
  }

  async execute(steps: ExecutionStep[]): Promise<ExecutionResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const screenshots: string[] = [];

    try {
      if (!this.page) {
        throw new Error('Executor not initialized');
      }

      for (const step of steps) {
        logs.push(`Executing: ${step.type} ${step.selector || step.url || ''}`);

        switch (step.type) {
          case 'navigate':
            if (step.url) {
              await this.page.goto(step.url, { waitUntil: 'networkidle' });
              logs.push(`Navigated to ${step.url}`);
            }
            break;

          case 'click':
            if (step.selector) {
              await this.page.click(step.selector, { timeout: step.timeout || 30000 });
              logs.push(`Clicked on ${step.selector}`);
            }
            break;

          case 'fill':
            if (step.selector && step.value) {
              await this.page.fill(step.selector, step.value, { timeout: step.timeout || 30000 });
              logs.push(`Filled ${step.selector} with value`);
            }
            break;

          case 'wait':
            if (step.timeout) {
              await this.page.waitForTimeout(step.timeout);
              logs.push(`Waited for ${step.timeout}ms`);
            }
            break;

          case 'screenshot':
            const screenshot = await this.page.screenshot({ fullPage: true });
            const screenshotBase64 = screenshot.toString('base64');
            screenshots.push(screenshotBase64);
            logs.push('Captured screenshot');
            break;

          case 'assert':
            if (step.selector) {
              const element = await this.page.locator(step.selector);
              await element.waitFor({ state: 'visible', timeout: step.timeout || 30000 });
              logs.push(`Assertion passed: ${step.selector} is visible`);
            }
            break;
        }
      }

      const duration = Date.now() - startTime;
      return {
        success: true,
        logs,
        screenshots,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        logs,
        screenshots,
        error: error instanceof Error ? error.message : String(error),
        duration,
      };
    }
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Workflow to Playwright code converter
export function workflowToPlaywrightCode(nodes: any[]): string {
  const lines: string[] = [
    "import { test, expect } from '@playwright/test';",
    "",
    "test('QA Automation - AI ToolKit Generated Test', async ({ page }) => {",
  ];

  for (const node of nodes) {
    switch (node.type) {
      case 'navigate':
        lines.push(`  await page.goto('${node.data.url}');`);
        break;
      case 'click':
        lines.push(`  await page.click('${node.data.selector}');`);
        break;
      case 'fill':
        lines.push(`  await page.fill('${node.data.selector}', '${node.data.value}');`);
        break;
      case 'wait':
        lines.push(`  await page.waitForTimeout(${node.data.timeout || 1000});`);
        break;
      case 'screenshot':
        lines.push(`  await page.screenshot({ path: 'screenshot-${Date.now()}.png' });`);
        break;
      case 'assert':
        lines.push(`  await expect(page.locator('${node.data.selector}')).toBeVisible();`);
        break;
    }
  }

  lines.push("});");
  return lines.join('\n');
}
