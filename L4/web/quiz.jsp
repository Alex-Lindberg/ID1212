<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ page import="java.util.ArrayList" %>
<%@ page import="App.Question" %>

<%
    ArrayList<Question> questions = (ArrayList<Question>) request.getAttribute("quizList");
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Quiz</title>
</head>
<body>
<form action="quiz" method="post">
    <%
        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);
    %>
    <h3>Question <%= i + 1 %></h3>
    <p><%= q.getQuestion() %></p>
    <label>
        <select name="q<%= i + 1 %>">
            <%
                request.setAttribute("q"+i+1, q);

                String[] options = q.getOptions();
                for (String option : options) {
            %>
            <option value="<%= q.isCorrectAnswer(option)  %>"><%= option %> </option>
            <%
                }
            %>
        </select>
    </label>
    <%
        }
    %>
    <br>
    <a href="quiz?quiz_id=<% request.getParameter("quiz_id"); %>&anotherNameOfParameterToSend=TheAotherValueOfTheParameter" >
    <input type="submit" value="Submit Quiz" /> </a>

</form>
</body>
</html>
