-- Adminer 4.8.1 MySQL 8.0.31 dump

-- Database name: db_pinterest

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Comment`;
CREATE TABLE `Comment` (
  `commentedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `userCommentId` int NOT NULL,
  `pictureCommentedId` int NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`userCommentId`,`pictureCommentedId`),
  KEY `Comment_pictureCommentedId_fkey` (`pictureCommentedId`),
  CONSTRAINT `Comment_pictureCommentedId_fkey` FOREIGN KEY (`pictureCommentedId`) REFERENCES `Picture` (`pictureId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Comment_userCommentId_fkey` FOREIGN KEY (`userCommentId`) REFERENCES `User` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Comment` (`commentedAt`, `userCommentId`, `pictureCommentedId`, `content`) VALUES
('2023-02-25 15:00:59.000',	1,	5,	'wow'),
('2023-02-25 16:06:08.000',	1,	10,	'pog'),
('2023-02-25 14:45:51.000',	2,	1,	'cute'),
('2023-02-25 14:07:39.000',	2,	4,	'nice');

DROP TABLE IF EXISTS `Picture`;
CREATE TABLE `Picture` (
  `pictureId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userUploadId` int NOT NULL,
  PRIMARY KEY (`pictureId`),
  UNIQUE KEY `Picture_pictureId_key` (`pictureId`),
  UNIQUE KEY `Picture_link_key` (`link`),
  KEY `Picture_userUploadId_fkey` (`userUploadId`),
  CONSTRAINT `Picture_userUploadId_fkey` FOREIGN KEY (`userUploadId`) REFERENCES `User` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Picture` (`pictureId`, `name`, `link`, `description`, `userUploadId`) VALUES
(1,	'1677231950172_icons8-circled-j-ios-16-16.png',	'/public/img/1677231950172_icons8-circled-j-ios-16-16.png',	'myimage',	3),
(2,	'1677250406981_kitten-1866475_1280.jpg',	'/public/img/1677250406981_kitten-1866475_1280.jpg',	'cat1',	3),
(3,	'1677250446393_cat-5836297_1280.jpg',	'/public/img/1677250446393_cat-5836297_1280.jpg',	'cat2',	1),
(4,	'1677250459435_cat-5767334_1280.jpg',	'/public/img/1677250459435_cat-5767334_1280.jpg',	'cat3',	1),
(5,	'1677250492880_kitten-4557097_1280.jpg',	'/public/img/1677250492880_kitten-4557097_1280.jpg',	'cat4',	2),
(10,	'1677331577066_kitten-4611189_1280.jpg',	'/public/img/1677331577066_kitten-4611189_1280.jpg',	'cat5',	2);

DROP TABLE IF EXISTS `SavePicture`;
CREATE TABLE `SavePicture` (
  `userSaveId` int NOT NULL,
  `pictureSavedId` int NOT NULL,
  `savedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`userSaveId`,`pictureSavedId`),
  KEY `SavePicture_pictureSavedId_fkey` (`pictureSavedId`),
  CONSTRAINT `SavePicture_pictureSavedId_fkey` FOREIGN KEY (`pictureSavedId`) REFERENCES `Picture` (`pictureId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `SavePicture_userSaveId_fkey` FOREIGN KEY (`userSaveId`) REFERENCES `User` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `SavePicture` (`userSaveId`, `pictureSavedId`, `savedAt`) VALUES
(1,	1,	'2023-03-03 09:11:14.648'),
(2,	3,	'2023-03-03 09:11:14.648'),
(2,	4,	'2023-03-03 09:11:14.648');

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `User_userId_key` (`userId`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `User` (`userId`, `email`, `password`, `name`, `age`, `avatar`) VALUES
(1,	'a@a.a',	'$2b$10$XjgfFkXoVHNv4/4SfAhbt..5o15uFZo2lV8DZqynu9Zf3XPSyI5Xu',	'a',	10,	'https://placekitten.com/200/200?image=1'),
(2,	'b@a.a',	'$2b$10$c0AtXMckwBzKp7ncX49r0.FUdVxHMxXt6fdeoAmOaIbmDVI2Mx18S',	'b',	10,	NULL),
(3,	'c@a.a',	'$2b$10$pdzgJbug/JnIjIUHerkv0.Ycxix8rOzwu8SA2rTV52jUAmPqc02Ze',	'c',	14,	NULL);

-- 2023-03-04 03:13:37