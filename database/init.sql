CREATE TABLE IF NOT EXISTS scheduled_messages (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    time VARCHAR(5) NOT NULL,
    message TEXT NOT NULL,
    mentioned_user_id VARCHAR(255),
    mentioned_everyone BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);