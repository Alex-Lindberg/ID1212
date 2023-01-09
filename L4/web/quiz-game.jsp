<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Quiz</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/index.css" />
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/quizGame.css" />
</head>
<body>
    <div id="container">
    <h2><%= "Choose a quiz!" %></h2>
    <br/>
    <table>
        <thead>
            <tr>
                <th>Quiz</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
<% 
    HashMap<String, Integer> quizMap = (HashMap<String, Integer>) request.getAttribute("userScores");
    for (Map.Entry<String, Integer> entry : quizMap.entrySet()) {
        String key = entry.getKey();
        Integer value = entry.getValue();
%>
            <tr>
                <td> <a href="quiz?quiz_id=<%=key%>" > <%= key %>  </a> </td>
                <td> <a> <%= value %>  </a> </td>
            </tr>
<% } %>
        </tbody>
    </table>
</div>
</body>
</html>
