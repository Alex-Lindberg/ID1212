<%--
  Created by IntelliJ IDEA.
  User: nvrmind
  Date: 12/29/22
  Time: 5:14 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page import="com.kth.assignment_4.assignment_4.Model" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title>This is the guessing game JSP</title>
</head>
<body>
<h1>Guessing Game</h1>
<%
  String hintMessage = (String) request.getAttribute("hintMessage");
  int numberOfGuesses = (int) request.getAttribute("numberOfGuesses");
%>
<h2> Number of Guesses: <%= numberOfGuesses %></h2>
<h2><%= hintMessage %></h2>

<form action="guessing-game" method="post">
  <label>
    <input type="number" name="guess">
  </label>
  <input type="submit" value="Guess">
</form>
</body>
</html>