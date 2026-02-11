ALTER TABLE `containers` MODIFY COLUMN `assignedScripts` json;--> statement-breakpoint
ALTER TABLE `executions` MODIFY COLUMN `logs` json;--> statement-breakpoint
ALTER TABLE `profiles` MODIFY COLUMN `credentials` json;--> statement-breakpoint
ALTER TABLE `scripts` MODIFY COLUMN `nodes` json;--> statement-breakpoint
ALTER TABLE `scripts` MODIFY COLUMN `edges` json;--> statement-breakpoint
ALTER TABLE `templates` MODIFY COLUMN `nodes` json;--> statement-breakpoint
ALTER TABLE `templates` MODIFY COLUMN `edges` json;