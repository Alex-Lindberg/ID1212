<html>
  <head>
    <title>This is the guessing game JSP</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/index.css" />
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/styles/guessGame.css" />
    <style>

    </style>
  </head>
  <body>
    <div id="container">
      <h1>Guessing Game</h1>
      
<% 
  String hintMessage = (String) request.getAttribute("hintMessage"); 
  int numberOfGuesses = (int) request.getAttribute("numberOfGuesses");
%>
      <h2>Number of Guesses: <%= numberOfGuesses %></h2>
      <h2><%= hintMessage %></h2>
<% 
  if (request.getAttribute("gameOverMessage") != null) { 
%>
      <h2><%= request.getAttribute("gameOverMessage") %></h2>
      <a id="home-button" href="index.jsp">Home</a>

<% } else { %>

      <form action="guessing-game" method="post">
        <label>
          <input type="text" name="guess" placeholder="Enter your guess" />
        </label>
        <input type="submit" value="Guess" />
      </form>
<% } %>
    </div>
  </body>
</html>
