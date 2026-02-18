CREATE TABLE `job_listing_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`job_id` int NOT NULL,
	`tag_id` int NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_listing_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`color` varchar(20) NOT NULL DEFAULT 'blue',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_tags_id` PRIMARY KEY(`id`)
);
