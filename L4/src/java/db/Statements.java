package db;

public class Statements {
    public static final String VALIDATE_USER
            = "SELECT * FROM users WHERE username = ? AND password = ?";
    public static final String GET_USER_ID
            = "SELECT id FROM users WHERE username = ?";
    public static final String GET_USER_SCORE
            = "SELECT * FROM results WHERE user_id = ?";
    public static final String GET_QUIZ_QUESTIONS
            = "SELECT questions.*\n"
            + "FROM quizzes\n"
            + "JOIN selector ON ? = selector.quiz_id\n"
            + "JOIN questions ON selector.question_id = questions.id\n"
            + "WHERE quizzes.id = ?";
    public static final String UPDATE_SCORE
            = "UPDATE results "
            + "SET score =  ? "
            + "WHERE user_id = ? AND quiz_id = ?";
}
