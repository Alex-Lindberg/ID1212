const express = require("express");
const cors = require("cors");
const helmet = require("helmet")
const bodyParser = require("body-parser");
const routes = require("./routes");
const { connect } = require("./api/db");

const app = express();
connect();

app.use(helmet())
app.use(cors());
app.use(bodyParser.json());

routes.init(app);

// listener
app.listen(3000, () => {
    console.log("listening on port :>> ", 3000);
    console.log('! ---- Backend Ready ---- !\n');
});
