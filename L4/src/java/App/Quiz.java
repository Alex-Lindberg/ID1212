package App;

import db.QuizDAO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet(name = "quiz", value = "/quiz")
public class Quiz extends HttpServlet {

    private final QuizDAO kuizDAO;

    public Quiz() throws SQLException {
        kuizDAO = new QuizDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        HttpSession session = request.getSession();
        session.setAttribute("quiz_id", request.getParameter("quiz_id"));
        try {
            ArrayList<Question> quizList = kuizDAO.getQuizQuestions(Integer.parseInt(request.getParameter("quiz_id")));
            request.setAttribute("quizList", quizList);
            request.getRequestDispatcher("/quiz.jsp").forward(request, response);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession();
        int quizId = Integer.parseInt((String) session.getAttribute("quiz_id"));
        int userId = Integer.parseInt((String) session.getAttribute("user_id"));
        try {
            String[] answers = { "q1", "q2", "q3", "q4" };
            int score = 0;
            for (String answer : answers)
                if (request.getParameter(answer).equals("true"))
                    score++;

            kuizDAO.updateUserScore(score, userId, quizId);
            request.getRequestDispatcher("/").forward(request, response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}