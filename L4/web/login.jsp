<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Login Page</title>
    <link
      rel="stylesheet"
      type="text/css"
      href="${pageContext.request.contextPath}/styles/index.css"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="${pageContext.request.contextPath}/styles/login.css"
    />
  </head>
  <body>
    <div id="container">
      <form action="login" method="post">
        <label for="uname">Username </label>
        <input id="uname" type="text" name="username" />
        <label for="pword">Password </label>
        <input id="pword" type="password" name="password" />
        <input id="button" type="submit" value="Login" />
      </form>
      <a href="index.jsp" >Home</a>
    </div>
  </body>
</html>
