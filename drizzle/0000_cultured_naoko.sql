CREATE TABLE `collaboration_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scriptId` int NOT NULL,
	`userId` int NOT NULL,
	`cursorPosition` json,
	`selectedNodeId` varchar(64),
	`lastActiveAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaboration_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `containers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`containerId` varchar(64),
	`host` varchar(255) NOT NULL,
	`port` int NOT NULL,
	`status` enum('running','stopped','error','deploying') NOT NULL DEFAULT 'stopped',
	`cpuUsage` int DEFAULT 0,
	`memoryUsage` int DEFAULT 0,
	`assignedScripts` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `containers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documentations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scriptId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`format` enum('markdown','html','pdf') NOT NULL DEFAULT 'markdown',
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documentations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `executions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`scriptId` int NOT NULL,
	`profileId` int,
	`status` enum('queued','running','completed','failed','cancelled') NOT NULL DEFAULT 'queued',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`duration` int,
	`stepsCompleted` int NOT NULL DEFAULT 0,
	`stepsTotal` int NOT NULL DEFAULT 0,
	`logs` json,
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `executions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplace_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`creatorId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`platform` enum('twitter','instagram','facebook','tiktok','youtube','multi') NOT NULL,
	`nodes` json,
	`edges` json,
	`thumbnail` varchar(500),
	`price` int NOT NULL DEFAULT 0,
	`downloads` int NOT NULL DEFAULT 0,
	`rating` int DEFAULT 0,
	`reviewCount` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','rejected') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketplace_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` enum('twitter','instagram','facebook','tiktok','youtube','custom') NOT NULL DEFAULT 'custom',
	`proxyHost` varchar(255),
	`proxyPort` int,
	`proxyUsername` varchar(255),
	`proxyPassword` varchar(255),
	`userAgent` text,
	`credentials` json,
	`status` enum('active','inactive','banned','warming') NOT NULL DEFAULT 'active',
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`nodes` json,
	`edges` json,
	`status` enum('draft','ready','running','paused','error') NOT NULL DEFAULT 'draft',
	`lastRunAt` timestamp,
	`runCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scripts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `template_purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int NOT NULL,
	`userId` int NOT NULL,
	`price` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `template_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `template_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `template_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` enum('twitter','instagram','facebook','tiktok','youtube') NOT NULL,
	`description` text,
	`category` varchar(100),
	`nodes` json,
	`edges` json,
	`isBuiltIn` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `workspace_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','editor','viewer') NOT NULL DEFAULT 'viewer',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workspace_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`)
);
