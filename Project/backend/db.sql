DROP FUNCTION IF EXISTS new_session, delete_session, register_user, enqueue, create_course;
DROP TABLE IF EXISTS users, courses, queue_item, messages, administrators, sessions;
DROP TYPE IF EXISTS roles, queue_status;

-- ############
--  EXTENSIONS
-- ############

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- #######
--  TYPES
-- #######

CREATE TYPE roles AS ENUM ('admin', 'user');
CREATE TYPE queue_status AS ENUM ('Waiting', 'Getting help');

-- ########
--  TABLES
-- ########

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    role roles NOT NULL,
    created_at timestamp
);

CREATE TABLE IF NOT EXISTS courses (
    id text PRIMARY KEY,
    title text NOT NULL,
    status integer
);

CREATE TABLE IF NOT EXISTS queue_item (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id),
    course_id text NOT NULL REFERENCES courses (id),
    location text,
    comment text,
    status queue_status
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id),
    time timestamp NOT NULL,
    message text NOT NULL
);

CREATE TABLE IF NOT EXISTS administrators (
    user_id UUID NOT NULL REFERENCES users (id),
    courses_id text NOT NULL REFERENCES courses (id)
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) UNIQUE ,
    updated_at TIMESTAMP NOT NULL
);

-- ###########
--  FUNCTIONS
-- ###########

CREATE OR REPLACE FUNCTION delete_session(IN uid uuid) 
    RETURNS BOOLEAN
AS $$
DECLARE deleted UUID;
BEGIN
    DELETE FROM sessions
    WHERE user_id=$1
    RETURNING user_id INTO deleted;
    IF (deleted is not null) then
        RETURN true;
    ELSE 
        RETURN false;
    END IF;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION new_session(IN uid uuid) RETURNS UUID
AS $$ 
DECLARE new_id uuid;
BEGIN
    SELECT gen_random_uuid () INTO new_id;
    INSERT INTO sessions
    VALUES (new_id, $1, NOW())
    ON CONFLICT ON CONSTRAINT sessions_user_id_key DO 
        UPDATE SET updated_at = NOW(), session_id = new_id;
    RETURN new_id;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION register_user(
    IN new_username text, IN new_email text, IN password text, 
    OUT new_user json) 
    RETURNS json
AS $$ 
DECLARE new_id uuid;
BEGIN
    SELECT gen_random_uuid () INTO new_id;
    INSERT INTO users
    VALUES (new_id, $1, $2, $3, 'user', NOW())
    ON CONFLICT DO NOTHING
    RETURNING
        json_build_object('user', json_build_object('username', users.username, 'email', users.email)) INTO new_user;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_course(
    IN new_id text, IN new_title text, OUT course json) 
    RETURNS json
AS $$ 
BEGIN
    INSERT INTO courses
    VALUES ($1, $2, 0)
    ON CONFLICT DO NOTHING
    RETURNING
        json_build_object('id', courses.id, 'title', courses.title, 'status', courses.status) INTO course;
END
$$
LANGUAGE plpgsql;

    -- id UUID PRIMARY KEY,
    -- user_id UUID NOT NULL REFERENCES users (id),
    -- course_id text NOT NULL REFERENCES courses (id),
    -- location text,
    -- comment text,
    -- status queue_status

CREATE OR REPLACE FUNCTION enqueue(
    IN user_id UUID, IN course_id text, IN location text, IN comment text, 
    OUT succeeded BOOLEAN) 
    RETURNS BOOLEAN
AS $$ 
BEGIN
    INSERT INTO queue_item
    VALUES (gen_random_uuid(), $1, $2, $3, $4, 'Waiting')
    ON CONFLICT DO NOTHING
    RETURNING
        true INTO succeeded;
END
$$
LANGUAGE plpgsql;
