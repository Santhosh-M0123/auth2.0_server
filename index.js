const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const Auth = require("./Auth");
const AuthToken = require("./validation");
const Revoke = require("./Revoke");

app.use(cors());
app.use(bodyparser.json());

app.use("/auth" , Auth);
app.use("/user" , AuthToken);
app.use("/revoke", Revoke);

app.listen(8000 , () => {
  console.log("App running on port 8000");
})