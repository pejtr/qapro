CREATE TABLE `ai_comment_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`platform` enum('instagram','tiktok','facebook','youtube','twitter') NOT NULL,
	`postUrl` varchar(512),
	`postContent` text,
	`generatedComment` text NOT NULL,
	`wasUsed` int NOT NULL DEFAULT 0,
	`feedback` enum('good','bad','neutral'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_comment_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `engagement_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`userId` int NOT NULL,
	`platform` enum('instagram','tiktok','facebook','youtube','twitter') NOT NULL,
	`actionType` enum('like','comment','follow','view_story','send_dm') NOT NULL,
	`targetUrl` varchar(512),
	`targetUsername` varchar(255),
	`targetPostId` varchar(255),
	`content` text,
	`status` enum('pending','completed','failed','skipped') NOT NULL DEFAULT 'pending',
	`error` text,
	`executedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `engagement_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `engagement_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` enum('instagram','tiktok','facebook','youtube','twitter') NOT NULL,
	`type` enum('like','comment','follow','view_story','send_dm','hashtag_monitor') NOT NULL,
	`targetCriteria` json,
	`actionConfig` json,
	`status` enum('active','paused','completed','error') NOT NULL DEFAULT 'paused',
	`actionsCompleted` int NOT NULL DEFAULT 0,
	`actionsTarget` int,
	`lastRunAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `engagement_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hashtag_monitors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`platform` enum('instagram','tiktok','facebook','youtube','twitter') NOT NULL,
	`hashtag` varchar(255) NOT NULL,
	`autoEngage` int NOT NULL DEFAULT 0,
	`engagementActions` json,
	`commentTemplates` json,
	`useAI` int NOT NULL DEFAULT 0,
	`maxActionsPerDay` int NOT NULL DEFAULT 50,
	`lastCheckedAt` timestamp,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hashtag_monitors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `snippets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` enum('selectors','actions','assertions','api_calls','custom') NOT NULL DEFAULT 'custom',
	`code` text NOT NULL,
	`language` varchar(50) NOT NULL DEFAULT 'javascript',
	`tags` json,
	`isPublic` int NOT NULL DEFAULT 0,
	`usageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `snippets_id` PRIMARY KEY(`id`)
);
