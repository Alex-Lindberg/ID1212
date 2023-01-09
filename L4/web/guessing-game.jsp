<html>
  <head>
    <title>This is the guessing game JSP</title>
  </head>
  <body>
    <h1>Guessing Game</h1>
    <% String hintMessage = (String) request.getAttribute("hintMessage"); int numberOfGuesses = (int)
    request.getAttribute("numberOfGuesses"); %>
    <h2>Number of Guesses: <%= numberOfGuesses %></h2>
    <h2><%= hintMessage %></h2>
    <%-- If gameOverMessage is not null, then the game is over and we should redirect to home page with a timmer of 5
    secondes and disply the timmer. --%> <% if (request.getAttribute("gameOverMessage") != null) { %>
    <h2><%= request.getAttribute("gameOverMessage") %></h2>

    <script>
      let timeLeft = 5;
      const downloadTimer = setInterval(function () {
        if (timeLeft <= 0) {
          clearInterval(downloadTimer);
          document.getElementById('countdown').innerHTML = 'Finished';
          window.location.href = 'index.jsp';
        } else {
          document.getElementById('countdown').innerHTML = 'Redirecting to home page in: ' + timeLeft + ' seconds';
        }
        timeLeft -= 1;
      }, 1000);
    </script>
    <p id="countdown"></p>
    <% } else { %>
    <form action="guessing-game" method="post">
      <label>
        <input type="text" name="guess" placeholder="Enter your guess" />
      </label>
      <input type="submit" value="Guess" />
    </form>
    <% } %>
  </body>
</html>
