-- Drop existing tables (順序付きで安全に削除)
DROP TABLE IF EXISTS user_businesscard;
DROP TABLE IF EXISTS businesscard;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS representative;
DROP TABLE IF EXISTS _prisma_migrations;

-- CREATE TABLE category
CREATE TABLE category (
  CategoryID SERIAL PRIMARY KEY,
  CategoryName VARCHAR(100) NOT NULL UNIQUE
);

-- INSERT INTO category
INSERT INTO category (CategoryID, CategoryName) VALUES
(1, '新宿'),
(2, '東京'),
(3, '品川'),
(4, '木場');

-- CREATE TABLE organization
CREATE TABLE organization (
  OrganizationID SERIAL PRIMARY KEY,
  OrganizationName VARCHAR(255) NOT NULL UNIQUE
);

-- INSERT INTO organization
INSERT INTO organization (OrganizationID, OrganizationName) VALUES
(1, 'A'),
(2, 'B'),
(3, 'C'),
(4, 'D');

-- CREATE TABLE region
CREATE TABLE region (
  RegionID SERIAL PRIMARY KEY,
  RegionName VARCHAR(100) NOT NULL UNIQUE
);

-- INSERT INTO region
INSERT INTO region (RegionID, RegionName) VALUES
(1, '岡部'),
(2, '花見'),
(3, '金島'),
(4, '山野'),
(5, '大川楓'),
(6, '末吉');

-- CREATE TABLE representative
CREATE TABLE representative (
  RepresentativeID SERIAL PRIMARY KEY,
  RepresentativeName VARCHAR(100) NOT NULL UNIQUE
);

-- INSERT INTO representative
INSERT INTO representative (RepresentativeID, RepresentativeName) VALUES
(1, '1'),
(2, '2'),
(3, '3'),
(4, '4'),
(5, '5');

-- CREATE TABLE "user"
CREATE TABLE "user" (
  UserID SERIAL PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(255) NOT NULL UNIQUE,
  PasswordHash VARCHAR(255) NOT NULL,
  CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE businesscard
CREATE TABLE businesscard (
  BusinessCardID SERIAL PRIMARY KEY,
  CategoryID INTEGER,
  OrganizationID INTEGER,
  OrganizationID2 INTEGER,
  RepresentativeID INTEGER,
  Phone VARCHAR(20),
  Mobile VARCHAR(20),
  Fax VARCHAR(20),
  Email VARCHAR(255),
  RegionID INTEGER,
  Address VARCHAR(191),
  Notes VARCHAR(191),
  ImageURL VARCHAR(191),
  CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (CategoryID) REFERENCES category (CategoryID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (OrganizationID) REFERENCES organization (OrganizationID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (OrganizationID2) REFERENCES organization (OrganizationID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (RepresentativeID) REFERENCES representative (RepresentativeID) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (RegionID) REFERENCES region (RegionID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- INSERT INTO businesscard
INSERT INTO businesscard (BusinessCardID, CategoryID, OrganizationID, OrganizationID2, RepresentativeID, Phone, Mobile, Fax, Email, RegionID, Address, Notes, ImageURL, CreatedAt) VALUES
(1, 1, 1, NULL, 1, '３３３', '２２２', '２２２', 'aaa2020@gmail.com', 1, '333', '333', NULL, '2025-04-01 02:24:37.143'),
(2, 2, 2, NULL, 2, '２２２', '１１１', '３３３', 'qqq@gmail.com', 1, '444', '555', NULL, '2025-04-01 02:42:29.858');

-- CREATE TABLE user_businesscard
CREATE TABLE user_businesscard (
  UserID INTEGER NOT NULL,
  BusinessCardID INTEGER NOT NULL,
  CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (UserID, BusinessCardID),
  FOREIGN KEY (UserID) REFERENCES "user" (UserID) ON UPDATE CASCADE,
  FOREIGN KEY (BusinessCardID) REFERENCES businesscard (BusinessCardID) ON UPDATE CASCADE
);

-- CREATE TABLE _prisma_migrations
CREATE TABLE _prisma_migrations (
  id UUID PRIMARY KEY,
  checksum VARCHAR(64) NOT NULL,
  finished_at TIMESTAMP(3),
  migration_name VARCHAR(255) NOT NULL,
  logs TEXT,
  rolled_back_at TIMESTAMP(3),
  started_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  applied_steps_count INTEGER NOT NULL DEFAULT 0
);

-- INSERT INTO _prisma_migrations
INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES
('7d7f5b44-f05a-40be-895e-5956a209e2f1', '2753649960b40f82fee7ce16475f871e2b1fdc8d62f67c9f414170cd9ae0f3cf', '2025-04-01 02:41:32.980', '20250401024132_add_unique_constraints', NULL, NULL, '2025-04-01 02:41:32.947', 1),
('fab60cc5-3eca-436c-98b4-c01ce2df14de', '8b47d8890edb6f10d188a8ede82e5acc3158cadb4fe431cee7181feb8c4d2fbe', '2025-04-01 02:18:52.355', '20250401021852_init', NULL, NULL, '2025-04-01 02:18:52.099', 1);
