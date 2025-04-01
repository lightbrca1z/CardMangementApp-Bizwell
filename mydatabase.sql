-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: 127.0.0.1
-- 生成日時: 2025-04-01 04:58:20
-- サーバのバージョン： 10.4.32-MariaDB
-- PHP のバージョン: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `mydatabase`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `businesscard`
--

CREATE TABLE `businesscard` (
  `BusinessCardID` int(11) NOT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `OrganizationID` int(11) DEFAULT NULL,
  `OrganizationID2` int(11) DEFAULT NULL,
  `RepresentativeID` int(11) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Mobile` varchar(20) DEFAULT NULL,
  `Fax` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `RegionID` int(11) DEFAULT NULL,
  `Address` varchar(191) DEFAULT NULL,
  `Notes` varchar(191) DEFAULT NULL,
  `ImageURL` varchar(191) DEFAULT NULL,
  `CreatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `businesscard`
--

INSERT INTO `businesscard` (`BusinessCardID`, `CategoryID`, `OrganizationID`, `OrganizationID2`, `RepresentativeID`, `Phone`, `Mobile`, `Fax`, `Email`, `RegionID`, `Address`, `Notes`, `ImageURL`, `CreatedAt`) VALUES
(1, 1, 1, NULL, 1, '３３３', '２２２', '２２２', 'aaa2020@gmail.com', 1, '333', '333', NULL, '2025-04-01 02:24:37.143'),
(2, 2, 2, NULL, 2, '２２２', '１１１', '３３３', 'qqq@gmail.com', 1, '444', '555', NULL, '2025-04-01 02:42:29.858');

-- --------------------------------------------------------

--
-- テーブルの構造 `category`
--

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `category`
--

INSERT INTO `category` (`CategoryID`, `CategoryName`) VALUES
(1, '１１１'),
(2, '２２２');

-- --------------------------------------------------------

--
-- テーブルの構造 `organization`
--

CREATE TABLE `organization` (
  `OrganizationID` int(11) NOT NULL,
  `OrganizationName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `organization`
--

INSERT INTO `organization` (`OrganizationID`, `OrganizationName`) VALUES
(1, '２２２'),
(2, '３３３');

-- --------------------------------------------------------

--
-- テーブルの構造 `region`
--

CREATE TABLE `region` (
  `RegionID` int(11) NOT NULL,
  `RegionName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `region`
--

INSERT INTO `region` (`RegionID`, `RegionName`) VALUES
(1, '333');

-- --------------------------------------------------------

--
-- テーブルの構造 `representative`
--

CREATE TABLE `representative` (
  `RepresentativeID` int(11) NOT NULL,
  `RepresentativeName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `representative`
--

INSERT INTO `representative` (`RepresentativeID`, `RepresentativeName`) VALUES
(1, '３３３'),
(2, '４４４');

-- --------------------------------------------------------

--
-- テーブルの構造 `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `user_businesscard`
--

CREATE TABLE `user_businesscard` (
  `UserID` int(11) NOT NULL,
  `BusinessCardID` int(11) NOT NULL,
  `CreatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('7d7f5b44-f05a-40be-895e-5956a209e2f1', '2753649960b40f82fee7ce16475f871e2b1fdc8d62f67c9f414170cd9ae0f3cf', '2025-04-01 02:41:32.980', '20250401024132_add_unique_constraints', NULL, NULL, '2025-04-01 02:41:32.947', 1),
('fab60cc5-3eca-436c-98b4-c01ce2df14de', '8b47d8890edb6f10d188a8ede82e5acc3158cadb4fe431cee7181feb8c4d2fbe', '2025-04-01 02:18:52.355', '20250401021852_init', NULL, NULL, '2025-04-01 02:18:52.099', 1);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `businesscard`
--
ALTER TABLE `businesscard`
  ADD PRIMARY KEY (`BusinessCardID`),
  ADD KEY `BusinessCard_CategoryID_fkey` (`CategoryID`),
  ADD KEY `BusinessCard_OrganizationID_fkey` (`OrganizationID`),
  ADD KEY `BusinessCard_OrganizationID2_fkey` (`OrganizationID2`),
  ADD KEY `BusinessCard_RepresentativeID_fkey` (`RepresentativeID`),
  ADD KEY `BusinessCard_RegionID_fkey` (`RegionID`);

--
-- テーブルのインデックス `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`CategoryID`),
  ADD UNIQUE KEY `Category_CategoryName_key` (`CategoryName`);

--
-- テーブルのインデックス `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`OrganizationID`),
  ADD UNIQUE KEY `Organization_OrganizationName_key` (`OrganizationName`);

--
-- テーブルのインデックス `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`RegionID`),
  ADD UNIQUE KEY `Region_RegionName_key` (`RegionName`);

--
-- テーブルのインデックス `representative`
--
ALTER TABLE `representative`
  ADD PRIMARY KEY (`RepresentativeID`),
  ADD UNIQUE KEY `Representative_RepresentativeName_key` (`RepresentativeName`);

--
-- テーブルのインデックス `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `User_Email_key` (`Email`);

--
-- テーブルのインデックス `user_businesscard`
--
ALTER TABLE `user_businesscard`
  ADD PRIMARY KEY (`UserID`,`BusinessCardID`),
  ADD KEY `User_BusinessCard_BusinessCardID_fkey` (`BusinessCardID`);

--
-- テーブルのインデックス `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `businesscard`
--
ALTER TABLE `businesscard`
  MODIFY `BusinessCardID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- テーブルの AUTO_INCREMENT `category`
--
ALTER TABLE `category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- テーブルの AUTO_INCREMENT `organization`
--
ALTER TABLE `organization`
  MODIFY `OrganizationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- テーブルの AUTO_INCREMENT `region`
--
ALTER TABLE `region`
  MODIFY `RegionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- テーブルの AUTO_INCREMENT `representative`
--
ALTER TABLE `representative`
  MODIFY `RepresentativeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- テーブルの AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `businesscard`
--
ALTER TABLE `businesscard`
  ADD CONSTRAINT `BusinessCard_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `BusinessCard_OrganizationID2_fkey` FOREIGN KEY (`OrganizationID2`) REFERENCES `organization` (`OrganizationID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `BusinessCard_OrganizationID_fkey` FOREIGN KEY (`OrganizationID`) REFERENCES `organization` (`OrganizationID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `BusinessCard_RegionID_fkey` FOREIGN KEY (`RegionID`) REFERENCES `region` (`RegionID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `BusinessCard_RepresentativeID_fkey` FOREIGN KEY (`RepresentativeID`) REFERENCES `representative` (`RepresentativeID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- テーブルの制約 `user_businesscard`
--
ALTER TABLE `user_businesscard`
  ADD CONSTRAINT `User_BusinessCard_BusinessCardID_fkey` FOREIGN KEY (`BusinessCardID`) REFERENCES `businesscard` (`BusinessCardID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `User_BusinessCard_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
