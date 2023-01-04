package com.kth.assignment_4.assignment_4;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class UserServlet extends HttpServlet {


    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {

            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet UserServlet</title>");
            out.println("</head>");
            out.println("<body>");


            try{
                EntityManagerFactory emf = Persistence.createEntityManagerFactory("UserPU");
                EntityManager em = emf.createEntityManager();
                em.getTransaction().begin();
                Users obj1 = new Users();
                obj1.setId(1);
                obj1.setUsername("ada@kth.se");
                em.persist(obj1);
                //em.getTransaction().commit();

                Users obj2 = new Users();
                obj2.setId(2);
                obj2.setUsername("beda@kth.se");
                em.persist(obj2);

                //Det kommer en uppdatering med finder-metoder
                //em.find(test.Users, 1);

                em.remove(obj1);

                em.getTransaction().commit();
            }
            catch(Exception e){
                System.out.println(e.getMessage());
            }


            out.println("<h1>Servlet UserServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

}
