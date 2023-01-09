<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<%--<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>--%>
<%--<%@ page import="java.util.Map" %>--%>
<%--<%@ page import="java.util.HashMap" %>&lt;%&ndash;--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<h2><%= "Choose a quiz!" %></h2>
<br/>
<table border ="1" width="500" align="center" >
    <tr>
        <th>Quiz</th>
        <th>Score</th>
    </tr>
    <% HashMap<String, Integer> quizMap = (HashMap<String, Integer>) request.getAttribute("userScores");
        for (Map.Entry<String, Integer> entry : quizMap.entrySet()) {
            String key = entry.getKey();
            Integer value = entry.getValue();
            %>
            <tr>
                <td> <a href="quiz?quiz_id=<%=key%>" > <%= key %>  </a> </td>
                <td> <a> <%= value %>  </a> </td>
            </tr>
    <% } %>
</table>
</body>
</html>
