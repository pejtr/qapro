CREATE TABLE `job_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`job_id` int NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'saved',
	`notes` text,
	`applied_date` timestamp,
	`interview_date` timestamp,
	`follow_up_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text NOT NULL,
	`salary_min` int,
	`salary_max` int,
	`job_type` varchar(50) NOT NULL,
	`skills` text NOT NULL,
	`description` text NOT NULL,
	`requirements` text,
	`company_size` varchar(50),
	`apply_url` text NOT NULL,
	`posted_date` timestamp NOT NULL,
	`source` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_listings_id` PRIMARY KEY(`id`)
);
