DELETE FROM results;
DELETE FROM selector;
DELETE FROM questions;
DELETE FROM quizzes;
DELETE FROM users;

INSERT INTO users (id, username, password)
VALUES  (1, 'test', 'pass'),
        (2, 'alex', 'pass');

INSERT INTO quizzes (id, subject)
VALUES  (1, 'Astronomy');

INSERT INTO questions (id, text, answer,options) 
VALUES  (1,'Which planets are larger than earth?', 'Saturn' ,'{Mercury,Saturn,Mars}'),
        (2,'Which planets are farther away from the sun than earth?', 'Saturn' ,'{Mercury,Venus,Saturn}'), 
        (3,'Which planets does not have rings?', 'Mercury' ,'{Mercury,Jupiter,Saturn}');

INSERT INTO results (id, user_id, quiz_id, score)
VALUES  (1,1,1,0),(2,2,1,0);

INSERT INTO selector (quiz_id, question_id)
VALUES  (1, 1),
        (1, 2),
        (1, 3);