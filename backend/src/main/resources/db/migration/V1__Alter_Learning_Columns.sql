-- Baseline migration: Create table structure (if not exists)
CREATE TABLE IF NOT EXISTS learning (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(1000),  -- Will be altered in V2
    category VARCHAR(255),
    date DATE,
    tags VARCHAR(255),
    attachments VARCHAR(1000),  -- Will be altered in V2
    custom_properties VARCHAR(1000)  -- Will be altered in V2
);
