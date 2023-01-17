DROP FUNCTION IF EXISTS new_session, delete_session, register_user, enqueue, create_course, update_queue_item;
DROP TABLE IF EXISTS users, courses, queue_item, administrators, sessions;
DROP TYPE IF EXISTS roles, queue_status;

-- ############
--  EXTENSIONS
-- ############

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- #######
--  TYPES
-- #######

CREATE TYPE roles AS ENUM ('admin', 'user');

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
    status integer,
    course_description text
);

CREATE TABLE IF NOT EXISTS queue_item (
    user_id UUID NOT NULL REFERENCES users (id),
    course_id text NOT NULL REFERENCES courses (id),
    location text,
    comment text,
    status boolean,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS administrators (
    user_id UUID NOT NULL REFERENCES users (id),
    course_id text NOT NULL REFERENCES courses (id),
    PRIMARY KEY (user_id, course_id)
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
    VALUES ($1, $2, 0, '')
    ON CONFLICT DO NOTHING
    RETURNING
        json_build_object(
            'id', courses.id, 'title', courses.title, 
            'status', courses.status, 'course_description', courses.course_description
        ) INTO course;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enqueue(
    IN us_id UUID, IN co_id text, IN location text, IN comment text, 
    OUT item JSON) 
    RETURNS JSON
 AS $$ 
 BEGIN
    INSERT INTO queue_item
    VALUES ($1, $2, $3, $4, false, NOW())
    ON CONFLICT (user_id, course_id) DO NOTHING;

    UPDATE courses SET status=status+1
    WHERE courses.id=$2;

    SELECT json_build_object(
        'user_id', users.id,
        'course_id', queue_item.course_id,
        'username', users.username, 
        'location', queue_item.location, 
        'comment', queue_item.comment, 
        'status', queue_item.status,
        'created_at', queue_item.created_at)
    FROM queue_item 
    INNER JOIN users ON users.id=queue_item.user_id
    WHERE users.id=$1 AND queue_item.course_id=$2
    INTO item;
 END
 $$
 LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION dequeue(
    IN us_id UUID, IN co_id text) 
    RETURNS boolean
 AS $$ 
 BEGIN
    DELETE FROM queue_item
    WHERE queue_item.user_id=$1 AND queue_item.course_id=$2;
    CASE WHEN FOUND=true THEN
        UPDATE courses SET status=status-1
        WHERE courses.id=$2;
    END CASE;
    RETURN FOUND;
 END
 $$
 LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_course_description(
    IN co_id text, IN course_desc text, OUT course json) 
    RETURNS json
 AS $$ 
 BEGIN
    UPDATE courses SET course_description=$2
    WHERE courses.id=$1
    RETURNING
        json_build_object(
            'id', courses.id, 'title', courses.title, 
            'status', courses.status, 'course_description', courses.course_description
        ) INTO course;
 END
 $$
 LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_queue_item(
    IN user_id_in UUID, IN course_id_in text, 
    IN location_in text, IN comment_in text,  
    IN status_in boolean,
    OUT item JSON) 
    RETURNS JSON
 AS $$ 
 BEGIN
    UPDATE queue_item SET 
        location = COALESCE ($3, location),
        comment = COALESCE ($4, comment),
        status = $5
    WHERE user_id=$1
    AND course_id=$2;
    SELECT json_build_object(
        'user_id', users.id, 
        'course_id', course_id, 
        'username', users.username, 
        'location', queue_item.location, 
        'comment', queue_item.comment, 
        'status', queue_item.status,
        'created_at', queue_item.created_at)
    FROM queue_item INNER JOIN users ON users.id=queue_item.user_id
    WHERE queue_item.course_id=$2
    INTO item;
 END
 $$
 LANGUAGE plpgsql;

-- related trigger:
-- CREATE OR REPLACE FUNCTION notify_queue_item_event()
--     RETURNS trigger
--     LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     PERFORM pg_notify('new_query_item_event', row_to_json(NEW)::text);
--     RETURN NULL;
-- END;
-- $$

-- ##########
--  TRIGGERS
-- ##########

-- change from insert to also include patch events somehow
-- CREATE TRIGGER update_queue_item_trigger AFTER INSERT ON queue_item
-- FOR EACH ROW EXECUTE PROCEDURE notify_queue_item_event();

-- ##########
--  DEFAULTS
-- ##########

SELECT register_user('Alex', 'alex5@kth.se', '123');
SELECT register_user('test', 'test@kth.se', '123');
SELECT register_user('admin', 'admin@kth.se', '123');

UPDATE users SET role='admin' WHERE username IN ('Alex', 'admin');

SELECT register_user('Dennis', 'denhad@kth.se', '123');
SELECT register_user('Lucas', 'lulars@kth.se', '123');

SELECT create_course('ID1212', 'Nätverksprogramering'     );
SELECT create_course('IK1204', 'Kommunikation och Nätverk');
SELECT create_course('ID1216', 'Operativsystem'           );
SELECT create_course('ID1217', 'Concurrent Programming'   );
SELECT create_course('IS1200', 'Datateknik'               );
SELECT create_course('DH2642', 'Interaction Programming'  );

SELECT enqueue(id , 'ID1212', 'location 1', 'some text 1')
FROM users WHERE username='Alex';
SELECT enqueue(id , 'ID1212', 'location 2', 'some text 2')
FROM users WHERE username='Lucas';
SELECT enqueue(id , 'ID1212', 'location 3', 'some text 3')
FROM users WHERE username='test';
SELECT enqueue(id , 'ID1212', 'location 4', 'some text 4')
FROM users WHERE username='Dennis';

SELECT update_queue_item(id, 'ID1212', 'New location', null, true) 
FROM users WHERE username='Alex';

SELECT enqueue(id , 'IK1204', 'location 1', 'some text 1')
FROM users WHERE username='Alex';
SELECT enqueue(id , 'IK1204', 'location 2', 'some text 2')
FROM users WHERE username='Lucas';
SELECT enqueue(id , 'IK1204', 'location 3', 'some text 3')
FROM users WHERE username='test';
SELECT enqueue(id , 'IK1204', 'location 4', 'some text 4')
FROM users WHERE username='Dennis';

SELECT enqueue(id , 'IS1200', 'location 1', 'some text 1')
FROM users WHERE username='Alex';
SELECT enqueue(id , 'IS1200', 'location 2', 'some text 2')
FROM users WHERE username='Lucas';

SELECT enqueue(id , 'DH2642', 'location 3', 'some text 3')
FROM users WHERE username='test';
SELECT enqueue(id , 'DH2642', 'location 4', 'some text 4')
FROM users WHERE username='Dennis';
