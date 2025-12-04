-- Migration script to add destination_iban column to transactions table
-- Execute this script after the initial database setup

USE transaction_db;

-- Add destination_iban column if it doesn't exist
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS destination_iban VARCHAR(34) NULL 
AFTER destination_account_id;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_destination_iban ON transactions(destination_iban);

SELECT 'Migration completed: destination_iban column added successfully!' AS Status;
