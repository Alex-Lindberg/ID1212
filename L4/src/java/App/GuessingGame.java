package App;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;

@WebServlet(name = "guessing-game", value = "/guessing-game")

public class GuessingGame extends HttpServlet {

    private HashMap<String, GameModel> models = new HashMap<>();
    //private GameModel model; // <- Overwrote games

    private HttpSession getSession(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            session = request.getSession();
        }
        System.out.println("Session id: " + session.getId());
        return session;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        HttpSession session = getSession(request, response);
        GameModel model;
        if (session.getAttribute("model") == null) {
            model = new GameModel(session.getId());
            models.put(session.getId(), model);
            session.setAttribute("model", model);
        } else {
            model = models.get(session.getId());
            //model = (GameModel) session.getAttribute("model");
            if (model.isFinished()) {
                System.out.println("Game Finished for: " + session.getId());
                session.removeAttribute("model");
                models.remove(session.getId());
                request.getRequestDispatcher("/").forward(request, response);
                return;
            }
        }
        request.setAttribute("hintMessage", model.getWelcomeMessage());
        request.setAttribute("numberOfGuesses", model.getNumberOfGuesses());
        request.getRequestDispatcher("/guessing-game.jsp").forward(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = getSession(request, response);
        GameModel model = models.get(session.getId());
        String hintMessage = model.guess(Integer.parseInt(request.getParameter("guess")));
        request.setAttribute("hintMessage", hintMessage);
        request.setAttribute("numberOfGuesses", model.getNumberOfGuesses());
        if (model.isFinished()) {
            session.removeAttribute("model");
            request.setAttribute("gameOverMessage", "Game over!");
        }
        request.getRequestDispatcher("/guessing-game.jsp").forward(request, response);
    }
}