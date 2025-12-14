-- Baseline migration: Create table structure (if not exists)
CREATE TABLE IF NOT EXISTS learning (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(1000),
    category VARCHAR(255),
    date DATE,
    tags VARCHAR(255),
    attachments VARCHAR(1000),
    custom_properties VARCHAR(1000)
);
