-- Baseline migration: Create LEARNING table with proper CLOB columns for large text content
-- This ensures the table is created with correct schema before Hibernate runs
-- baseline-on-migrate=true preserves existing data if table already exists

CREATE TABLE IF NOT EXISTS learning (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description CLOB,
    category VARCHAR(255),
    date DATE,
    tags VARCHAR(255),
    attachments CLOB,
    custom_properties CLOB
);
