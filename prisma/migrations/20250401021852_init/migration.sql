-- CreateTable
CREATE TABLE `User` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_Email_key`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `CategoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoryName` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`CategoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `OrganizationID` INTEGER NOT NULL AUTO_INCREMENT,
    `OrganizationName` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`OrganizationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Representative` (
    `RepresentativeID` INTEGER NOT NULL AUTO_INCREMENT,
    `RepresentativeName` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`RepresentativeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `RegionID` INTEGER NOT NULL AUTO_INCREMENT,
    `RegionName` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`RegionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessCard` (
    `BusinessCardID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoryID` INTEGER NULL,
    `OrganizationID` INTEGER NULL,
    `OrganizationID2` INTEGER NULL,
    `RepresentativeID` INTEGER NULL,
    `Phone` VARCHAR(20) NULL,
    `Mobile` VARCHAR(20) NULL,
    `Fax` VARCHAR(20) NULL,
    `Email` VARCHAR(255) NULL,
    `RegionID` INTEGER NULL,
    `Address` VARCHAR(191) NULL,
    `Notes` VARCHAR(191) NULL,
    `ImageURL` VARCHAR(191) NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`BusinessCardID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_BusinessCard` (
    `UserID` INTEGER NOT NULL,
    `BusinessCardID` INTEGER NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`UserID`, `BusinessCardID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BusinessCard` ADD CONSTRAINT `BusinessCard_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `Category`(`CategoryID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessCard` ADD CONSTRAINT `BusinessCard_OrganizationID_fkey` FOREIGN KEY (`OrganizationID`) REFERENCES `Organization`(`OrganizationID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessCard` ADD CONSTRAINT `BusinessCard_OrganizationID2_fkey` FOREIGN KEY (`OrganizationID2`) REFERENCES `Organization`(`OrganizationID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessCard` ADD CONSTRAINT `BusinessCard_RepresentativeID_fkey` FOREIGN KEY (`RepresentativeID`) REFERENCES `Representative`(`RepresentativeID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessCard` ADD CONSTRAINT `BusinessCard_RegionID_fkey` FOREIGN KEY (`RegionID`) REFERENCES `Region`(`RegionID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_BusinessCard` ADD CONSTRAINT `User_BusinessCard_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_BusinessCard` ADD CONSTRAINT `User_BusinessCard_BusinessCardID_fkey` FOREIGN KEY (`BusinessCardID`) REFERENCES `BusinessCard`(`BusinessCardID`) ON DELETE RESTRICT ON UPDATE CASCADE;
