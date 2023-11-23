const router = require("express").Router();
const connection = require("./dbConnections");
const bcrypt = require("bcryptjs");

router.post("/", (req, res) => {
  let email = req.body.email;
  let user = req.body.user;
  let pass = req.body.pass;
  let tokenId = req.body.tokenId;
  let Q = "Select token from tokens where token_id = ?";
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pass, salt);

  // let backupemail = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

  connection.query(Q, [tokenId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length === 0) {
        res.status(400).send("Invalid Token Id");
      } else {
        let token = data[0].token;
        let backupemail = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString()
        );
        let backup = backupemail.email;
        let Query =
          "Update loggeduser set account_email = ?,password = ? ,username = ? where backup_email = ?";
        connection.query(Query, [email, hash, user, backup], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            let deleteQ = "Delete from tokens where token_id = ?";
            connection.query(deleteQ, [tokenId], (err, datas) => {
              if (err) {
                console.log(err);
              } else {
                res.status(200).send("Operation Success");
              }
            });
          }
        });
      }
    }
  });

  console.log(email, user, pass, tokenId);
});

module.exports = router;
