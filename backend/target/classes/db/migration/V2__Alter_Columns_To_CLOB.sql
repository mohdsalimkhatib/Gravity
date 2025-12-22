-- Migration V2: Alter columns to CLOB for large text support
-- This runs after baseline and updates existing VARCHAR columns to CLOB

ALTER TABLE learning ALTER COLUMN description TYPE TEXT; 
ALTER TABLE learning ALTER COLUMN attachments TYPE TEXT; 
ALTER TABLE learning ALTER COLUMN custom_properties TYPE TEXT;
