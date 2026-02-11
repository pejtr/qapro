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
	`assignedScripts` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `containers_id` PRIMARY KEY(`id`)
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
	`logs` json DEFAULT ('[]'),
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `executions_id` PRIMARY KEY(`id`)
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
	`credentials` json DEFAULT ('{}'),
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
	`nodes` json DEFAULT ('[]'),
	`edges` json DEFAULT ('[]'),
	`status` enum('draft','ready','running','paused','error') NOT NULL DEFAULT 'draft',
	`lastRunAt` timestamp,
	`runCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scripts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`platform` enum('twitter','instagram','facebook','tiktok','youtube') NOT NULL,
	`description` text,
	`category` varchar(100),
	`nodes` json DEFAULT ('[]'),
	`edges` json DEFAULT ('[]'),
	`isBuiltIn` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
