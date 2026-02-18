CREATE TABLE `script_analysis_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scriptId` int NOT NULL,
	`userId` int NOT NULL,
	`executionId` int,
	`analysisType` enum('performance','errors','selectors','best_practices','security','comprehensive') NOT NULL,
	`overallScore` int,
	`issuesFound` int NOT NULL DEFAULT 0,
	`suggestionsCount` int NOT NULL DEFAULT 0,
	`analysisData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `script_analysis_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `script_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisId` int NOT NULL,
	`scriptId` int NOT NULL,
	`userId` int NOT NULL,
	`category` enum('performance','reliability','maintainability','security','best_practice') NOT NULL,
	`severity` enum('critical','high','medium','low','info') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`currentCode` text,
	`suggestedCode` text,
	`explanation` text NOT NULL,
	`estimatedImpact` varchar(255),
	`status` enum('pending','applied','dismissed','failed') NOT NULL DEFAULT 'pending',
	`appliedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `script_suggestions_id` PRIMARY KEY(`id`)
);
