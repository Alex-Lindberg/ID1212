package com.kth.assignment_4.assignment_4;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.io.PrintWriter;


/**
 * @author Alex Lindberg
 * @created 2022-12-27
 */


@WebServlet(name = "guessing-game", value = "/guessing-game")

public class GuessingGame extends HttpServlet {


    private Model model;
    private HttpSession getSession(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            session = request.getSession();
        }

        response.setHeader("Set-Cookie", "JSESSIONID=" + session.getId() + "; HttpOnly");
        System.out.println("Session id: " + session.getId());
        return session;
    }
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        HttpSession session = getSession(request, response);

        if (session.getAttribute("model") == null) {
            model = new Model(session.getId());
            session.setAttribute("model", model);
        } else {
            model = (Model) session.getAttribute("model");
            if (model.isGameOver()) {
                System.out.println("Game is over");
                model = new Model(session.getId());
            }
        }
        // serve the jsp page
        request.setAttribute("hintMessage", model.getWelcomeMessage());
        request.setAttribute("numberOfGuesses", model.getNumberOfGuesses());
        request.getRequestDispatcher("/guessing-game.jsp").forward(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = getSession(request, response);
        if (model.isGameOver()) {
            System.out.println("Game is over");
            model = new Model(session.getId());
        }
        String hintMessage = model.guess(Integer.parseInt(request.getParameter("guess")));
        request.setAttribute("hintMessage", hintMessage);
        request.setAttribute("numberOfGuesses", model.getNumberOfGuesses());
        RequestDispatcher view = request.getRequestDispatcher("/guessing-game.jsp");
        view.forward(request, response);
    }
}