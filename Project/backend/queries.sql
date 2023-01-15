
-- Select courses and their administrators as an array
SELECT courses.*,
    COALESCE (array_agg(administrators.user_id) 
        filter (where administrators.user_id is not null), 
    '{}') AS administrators
FROM courses
LEFT JOIN administrators ON administrators.course_id = courses.id
GROUP BY courses.id;
