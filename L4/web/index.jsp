<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/index.css" />
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/indexPage.css" />
    <title>Lab 4: Java EE</title>
  </head>
  <body>
    <div id="content">
      <h1  id="page-title"><%= "Labb 4" %></h1>
      <div id="items">
        <a href="guessing-game">Guessing Game</a>
        <br/>
        <a href="login">Quiz Login</a>
      </div>
    </div>
  </body>
</html>
