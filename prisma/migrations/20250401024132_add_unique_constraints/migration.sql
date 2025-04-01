/*
  Warnings:

  - A unique constraint covering the columns `[CategoryName]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[OrganizationName]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RegionName]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[RepresentativeName]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Category_CategoryName_key` ON `Category`(`CategoryName`);

-- CreateIndex
CREATE UNIQUE INDEX `Organization_OrganizationName_key` ON `Organization`(`OrganizationName`);

-- CreateIndex
CREATE UNIQUE INDEX `Region_RegionName_key` ON `Region`(`RegionName`);

-- CreateIndex
CREATE UNIQUE INDEX `Representative_RepresentativeName_key` ON `Representative`(`RepresentativeName`);
