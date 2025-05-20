/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Employee_login_key` ON `Employee`(`login`);
