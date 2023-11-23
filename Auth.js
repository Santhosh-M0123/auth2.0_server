let router = require("express").Router();
const connections = require("./dbConnections");
const shortId = require("shortid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("./Mailer");

router.post("/login", (req, res) => {
  let userName = req.body.user;
  let pass = req.body.pass;
  let Q = "SELECT username from loggeduser WHERE username = ?";
  let secrete = "ejfgtyjobhqrthogif";

  connections.query(Q, [userName], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length == 0) {
        res.status(400).send("Username doesn't match");
      } else {
        let passQ = "select password from loggeduser where username = ?";
        connections.query(passQ, [userName], (err, result) => {
          if (err) {
            console.log(err);
          } else {
            bcrypt.compare(pass, result[0].password).then((com) => {
              if (com === true) {
                let tokenQ = "INSERT INTO tokens VALUES (?,?) ";
                let backUpQuery =
                  "SELECT backup_email from loggeduser where username = ?";
                connections.query(backUpQuery, [userName], (err, results) => {
                  if (err) {
                    console.log(err);
                  } else {
                    let backupEmail = results[0].backup_email;
                    let Id = shortId();
                    let token = jwt.sign({ email: backupEmail }, secrete);
                    connections.query(
                      tokenQ,
                      [Id, token],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                            res.status(200).send(token);
                            var mailOptions = {
                                from: 'Uxon@gmail.com',
                                to: backupEmail,
                                subject: 'Hey this is Your login code to retrieve your account',
                                text: Id
                              };
                              transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                  console.log(error);
                                } else {
                                    // res.status(200).send(token);
                                    console.log("email sent");
                                }
                              });
                        }
                      }
                    );
                  }
                });
              } else {
                res.status(400).send("Invalid password");
              }
            });
          }
        });
      }
    }
  });
});

router.post("/register", (req, res) => {
  let Id = shortId();
  let backupEmail = req.body.backup;
  let email = req.body.email;
  let user = req.body.user;
  let pass = req.body.pass;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pass, salt);
  let Q = "SELECT * FROM loggedUser WHERE account_email = ? or username = ?";

  connections.query(Q, [email,user], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length != 0) {
        res.status(400).send("Username already exists");
      } else {
        let InsertQ = "INSERT INTO loggedUser VALUES(?,?,?,?,?)";
        connections.query(
          InsertQ,
          [Id,user,hash,backupEmail,email],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send("Inserted");
            }
          }
        );
      }
    }
  });
});

module.exports = router;
