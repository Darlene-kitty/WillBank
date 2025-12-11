-- WillBank MySQL Initialization Script
-- Execute this script to create all required databases

-- Create databases
CREATE DATABASE IF NOT EXISTS client_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS account_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS transaction_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS notification_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional - if you want a dedicated user instead of root)
-- CREATE USER IF NOT EXISTS 'willbank'@'localhost' IDENTIFIED BY 'willbank123';
-- GRANT ALL PRIVILEGES ON client_db.* TO 'willbank'@'localhost';
-- GRANT ALL PRIVILEGES ON account_db.* TO 'willbank'@'localhost';
-- GRANT ALL PRIVILEGES ON transaction_db.* TO 'willbank'@'localhost';
-- GRANT ALL PRIVILEGES ON notification_db.* TO 'willbank'@'localhost';
-- FLUSH PRIVILEGES;

-- Verify databases
SHOW DATABASES;

SELECT 'WillBank databases created successfully!' AS Status;
