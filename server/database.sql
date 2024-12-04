-- Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Favourite table
CREATE TABLE Favourite (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    tmdb_id INT NOT NULL
);

-- Groups table
CREATE TABLE Groups (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- Groups_Users table
CREATE TABLE Groups_Users (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES Groups(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    is_owner BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Review table
CREATE TABLE Review (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    tmdb_id INT NOT NULL,
    review_text TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
