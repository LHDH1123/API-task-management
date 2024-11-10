const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

database.connect();

const app = express();
app.use(cors());

const port = process.env.PORT;

const routeClient = require("./routes/client/index.route");

app.use(bodyParser.json());
app.use(cookieParser());
routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
