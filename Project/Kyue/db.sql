-- $ pgcli "host=127.0.0.1 port=5432 user=pg password=pgid1212 dbname=kyue" < db.sql
-- or \i db.sql

-- DROP TABLE IF EXISTS users, courses, queue_item, messages, administrators, sessions;
-- DROP FUNCTION IF EXISTS new_session, register_user;
-- DROP PROCEDURE IF EXISTS delete_session;
-- DROP TYPE IF EXISTS roles;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE roles AS ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    role roles NOT NULL,
    created_at timestamp
);

CREATE TABLE IF NOT EXISTS courses (
    id integer PRIMARY KEY,
    title text NOT NULL,
    status integer
);

CREATE TABLE IF NOT EXISTS queue_item (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id),
    course_id integer NOT NULL REFERENCES courses (id),
    location text,
    comment text
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id),
    time timestamp NOT NULL,
    message text NOT NULL
);

CREATE TABLE IF NOT EXISTS administrators (
    user_id UUID NOT NULL REFERENCES users (id),
    courses_id integer NOT NULL REFERENCES courses (id)
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) UNIQUE ,
    updated_at TIMESTAMP NOT NULL
);

CREATE PROCEDURE delete_session(IN uid uuid)
 AS $$ 
 BEGIN
     DELETE FROM sessions
     WHERE user_id=$1;
 END
 $$ LANGUAGE plpgsql;

CREATE FUNCTION new_session(IN uid uuid) RETURNS UUID
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

    -- id integer PRIMARY KEY,
    -- username text NOT NULL,
    -- email text NOT NULL,
    -- password text  NOT NULL,
    -- role roles NOT NULL,
    -- created_at timestamp

CREATE FUNCTION register_user(
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

