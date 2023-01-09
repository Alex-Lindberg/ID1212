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
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/index.css" />
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/quiz.css" />
</head>
<body>
    <div id="container">
        <form action="quiz" method="post">
<%
    for (int i = 0; i < questions.size(); i++) {
        Question q = questions.get(i);
%>
            <h3>Question <%= i + 1 %></h3>
            <div id="question-wrapper">

                <label for="question-selector">
                    <span><%= q.getQuestion() %></label></span>
                    <select id="question-selector" name="q<%= i + 1 %>">
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
                </div>
<%
}
%>
            <br>
            <a href="quiz?quiz_id=<% 
                    request.getParameter("quiz_id"); 
                %>&anotherNameOfParameterToSend=TheAotherValueOfTheParameter" >
                <input type="submit" value="Submit Quiz" /> 
            </a>
        </form>
    </div>
</body>
</html>
