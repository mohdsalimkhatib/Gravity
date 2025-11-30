-- Migration V2: Alter columns to CLOB for large text support
-- This runs after baseline and updates existing VARCHAR columns to CLOB

ALTER TABLE learning ALTER COLUMN description CLOB;
ALTER TABLE learning ALTER COLUMN attachments CLOB;
ALTER TABLE learning ALTER COLUMN custom_properties CLOB;
