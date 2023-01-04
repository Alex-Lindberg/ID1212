const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const { connect } = require("./api/db");
const { createUser, getUser } = require("./middlewares/users");

const app = express();

connect();

app.use(cors());
app.use(bodyParser.json());
routes.init(app);

// listener
app.listen(3000, () => {
    console.log("listening on port :>> ", 3000);
});
