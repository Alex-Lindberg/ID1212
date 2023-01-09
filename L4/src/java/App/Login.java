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
import java.util.HashMap;

@WebServlet(name = "login", value = "/login")

public class Login extends HttpServlet {

    private final QuizDAO quizDAO;

    public Login() throws SQLException {
        quizDAO = new QuizDAO();
    }

    static HttpSession getHttpSession(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            session = request.getSession();
        }

        response.setHeader("Set-Cookie", "JSESSIONID=" + session.getId() + "; HttpOnly");
        System.out.println("Session id: " + session.getId());
        return session;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        HttpSession session = getHttpSession(request, response);
        String username = request.getParameter("username");
        try {
            session.setAttribute("user_id", String.valueOf(quizDAO.getUserId(username)));
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        String password = request.getParameter("password");
        try {
            if (quizDAO.userAuthenticated(username, password)) {
                int userId = quizDAO.getUserId(username);
                HashMap<String, Integer> userScores = quizDAO.getUserScores(userId);
                request.setAttribute("userScores", userScores);
                request.getRequestDispatcher("/quiz-game.jsp").forward(request, response);
            } else {
                response.sendError(401, "Unauthorized");
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}