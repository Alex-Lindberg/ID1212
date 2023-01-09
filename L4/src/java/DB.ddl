create table if not exists quizzes
(
    id      integer     not null
    constraint "QUIZZES_pk"
    primary key,
    subject varchar(64) not null
    );

create table if not exists users
(
    id       integer     not null
    constraint "USERS_pk"
    primary key,
    username varchar(32) not null,
    password varchar(32) not null
    );

create table if not exists results
(
    id      integer
    constraint results_pk
    primary key,
    user_id integer not null
    constraint results_users_id_fk
    references users,
    quiz_id integer not null
    constraint results_quizzes_id_fk
    references quizzes,
    score   integer
);

create table if not exists questions
(
    id      integer     not null
    constraint "QUESTIONS_pk"
    primary key,
    text    varchar(64) not null,
    options text[] not null,
    answer  varchar(64) not null
    );

create table if not exists selector
(
    quiz_id     integer not null
    constraint selector_quizzes_id_fk
    references quizzes,
    question_id integer not null
    constraint selector_questions_id_fk
    references questions
);

