CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorId` int NOT NULL,
	`entityType` varchar(40) NOT NULL,
	`entityId` int NOT NULL,
	`action` varchar(80) NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buyerId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`goal` text NOT NULL,
	`budgetMin` decimal(12,2) NOT NULL,
	`budgetMax` decimal(12,2) NOT NULL,
	`deliveryDays` int NOT NULL,
	`city` varchar(80) NOT NULL,
	`deliveryMode` varchar(80) NOT NULL,
	`notes` text,
	`category` varchar(80) NOT NULL,
	`status` enum('published','matching','in_progress','completed','closed') NOT NULL DEFAULT 'published',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `demands_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onboardingApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicantId` int NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`city` varchar(80) NOT NULL,
	`categories` json NOT NULL,
	`caseLinks` json NOT NULL,
	`priceRange` varchar(80) NOT NULL,
	`introduction` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`reviewNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `onboardingApplications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demandId` int NOT NULL,
	`quoteId` int NOT NULL,
	`buyerId` int NOT NULL,
	`providerId` int NOT NULL,
	`status` enum('awaiting_payment','paid','in_progress','delivered','completed','disputed','cancelled') NOT NULL DEFAULT 'awaiting_payment',
	`paymentStatus` enum('unpaid','escrowed','released','refunded') NOT NULL DEFAULT 'unpaid',
	`disputeNote` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`headline` varchar(240) NOT NULL,
	`bio` text NOT NULL,
	`avatarUrl` text,
	`city` varchar(80) NOT NULL,
	`categories` json NOT NULL,
	`deliveryModes` json NOT NULL,
	`priceMin` decimal(12,2) NOT NULL,
	`priceMax` decimal(12,2) NOT NULL,
	`rating` decimal(3,2) NOT NULL DEFAULT '0',
	`completedOrders` int NOT NULL DEFAULT 0,
	`responseHours` int NOT NULL DEFAULT 24,
	`verificationStatus` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`status` enum('draft','published','paused') NOT NULL DEFAULT 'draft',
	`cases` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`demandId` int NOT NULL,
	`providerId` int NOT NULL,
	`message` text NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`deliveryDays` int NOT NULL,
	`status` enum('submitted','selected','rejected','withdrawn') NOT NULL DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`reviewerId` int NOT NULL,
	`providerId` int NOT NULL,
	`rating` int NOT NULL,
	`content` text NOT NULL,
	`status` enum('pending','published','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','provider','admin') NOT NULL DEFAULT 'user';