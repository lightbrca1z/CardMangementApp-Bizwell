-- Drop existing tables (順序付きで安全に削除)
DROP TABLE IF EXISTS user_businesscard;
DROP TABLE IF EXISTS businesscard;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS representative;

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
(1, '1'),
(2, '2'),
(3, '3'),
(4, '4'),
(5, '5');


-- CREATE TABLE representative
CREATE TABLE representative (
  RepresentativeID SERIAL PRIMARY KEY,
  RepresentativeName VARCHAR(100) NOT NULL UNIQUE
);

-- INSERT INTO representative
INSERT INTO representative (RepresentativeID, RepresentativeName) VALUES
(1, '岡部'),
(2, '花見'),
(3, '金島'),
(4, '山野'),
(5, '大川楓'),
(6, '末吉');

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
INSERT INTO businesscard (CategoryID, OrganizationID, OrganizationID2, RepresentativeID, Phone, Mobile, Fax, Email, RegionID, Address, Notes, ImageURL, CreatedAt) VALUES
(1, 1, NULL, 1, '３３３', '２２２', '２２２', 'aaa2020@gmail.com', 1, '333', '333', NULL, '2025-04-01 02:24:37.143'),
(2, 2, NULL, 2, '２２２', '１１１', '３３３', 'qqq@gmail.com', 1, '444', '555', NULL, '2025-04-01 02:42:29.858');

-- CREATE TABLE user_businesscard
CREATE TABLE user_businesscard (
  UserID INTEGER NOT NULL,
  BusinessCardID INTEGER NOT NULL,
  CreatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (UserID, BusinessCardID),
  FOREIGN KEY (UserID) REFERENCES "user" (UserID) ON UPDATE CASCADE,
  FOREIGN KEY (BusinessCardID) REFERENCES businesscard (BusinessCardID) ON UPDATE CASCADE
);
