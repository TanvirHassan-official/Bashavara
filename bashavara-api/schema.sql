-- =============================================================================
-- BashaVara Full Database Schema
-- Compatible with MySQL 8.0+ / MariaDB 10.5+
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `bashavara` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bashavara`;

-- ── 1. BetterAuth Core Tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `user` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `emailVerified` BOOLEAN NOT NULL DEFAULT FALSE,
  `image` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` VARCHAR(50) NOT NULL DEFAULT 'student',
  `phone` VARCHAR(50) NULL,
  `businessName` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `session` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `expiresAt` TIMESTAMP NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ipAddress` VARCHAR(45) NULL,
  `userAgent` TEXT NULL,
  `userId` VARCHAR(36) NOT NULL,
  CONSTRAINT `fk_session_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `account` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `accountId` VARCHAR(255) NOT NULL,
  `providerId` VARCHAR(255) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `accessToken` TEXT NULL,
  `refreshToken` TEXT NULL,
  `idToken` TEXT NULL,
  `accessTokenExpiresAt` TIMESTAMP NULL,
  `refreshTokenExpiresAt` TIMESTAMP NULL,
  `scope` TEXT NULL,
  `password` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_account_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `verification` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `identifier` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) NOT NULL,
  `expiresAt` TIMESTAMP NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. Roommate Profiles Table ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `roommate_profiles` (
  `user_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `budget` INT NOT NULL DEFAULT 1000,
  `department` VARCHAR(100) NULL,
  `sleep_schedule` VARCHAR(50) NULL DEFAULT 'Flexible',
  `smoking_preference` VARCHAR(50) NULL DEFAULT 'Non-Smoker',
  `bio` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_roommate_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. Listings Table ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `listings` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `landlord_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `rent` DECIMAL(10,2) NOT NULL,
  `utility_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `distance` VARCHAR(100) NULL,
  `bedrooms` INT NOT NULL DEFAULT 1,
  `bathrooms` INT NOT NULL DEFAULT 1,
  `department_relevance` VARCHAR(255) NULL DEFAULT 'Any',
  `photo_url` TEXT NULL,
  `available_from` VARCHAR(100) NULL,
  `status` ENUM('active', 'paused', 'rented') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_listing_landlord` FOREIGN KEY (`landlord_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 4. Listing Amenities Table ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `listing_amenities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `listing_id` VARCHAR(36) NOT NULL,
  `amenity` VARCHAR(100) NOT NULL,
  CONSTRAINT `fk_amenity_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_listing_amenity` (`listing_id`, `amenity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 5. Unified Requests Table (Listing & Roommate Requests) ───────────────────

CREATE TABLE IF NOT EXISTS `requests` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `sender_id` VARCHAR(36) NOT NULL,
  `receiver_id` VARCHAR(36) NOT NULL,
  `listing_id` VARCHAR(36) NULL,
  `type` ENUM('listing', 'roommate') NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  `message` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_request_sender` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_request_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_request_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 6. Reviews Table ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `listing_id` VARCHAR(36) NOT NULL,
  `reviewer_id` VARCHAR(36) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_review_listing` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`reviewer_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_listing_reviewer` (`listing_id`, `reviewer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
