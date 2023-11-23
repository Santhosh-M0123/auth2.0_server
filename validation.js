let router = require("express").Router();
const jwt = require("jsonwebtoken");
const connection = require('./dbConnections');
const bcrypt = require("bcryptjs");


let secrete = "ejfgtyjobhqrthogif";
router.post("/auth" , (req,res)=>{
    let token = req.body.token;
    let verify = jwt.verify(token , secrete)
    console.log(verify)
    if(verify === false){
        console.log("running");
        res.status(404).send("You don't have access to service");
    }else{
        let q = "select * from tokens where token = ?";
        connection.query(q, [token] , (err,data)=>{
            if(err){
                console.log(err)
            }else{
                if(data.length != 0){
                    // console.log(data)
                    res.send(data);
                }else{
                    res.status(404).send("UnAthorised User")
                }
            }
        })
    }
});

router.post("/updateUsername" , (req,res)=>{
    let token = req.body.token;
    let userName = req.body.user;
    let verify = jwt.verify(token , secrete);
    let Q = "update loggeduser set username = ? where backup_email = ?";
    console.log(token);
    if(verify === false){
        res.status(400).send("Access Denied");
    }else{
        // console.log("token verified");
        let q = "select token_id from tokens where token = ?";
        connection.query(q , [token] ,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                console.log(result)
                if(result.length === 0){
                    // let oldUsername = JSON.parse(
                    //     Buffer.from(token.split(".")[1], "base64").toString()
                    //   );
                    //   let old = oldUsername.email;
                    //   connection.query(Q, [userName , old] , (err,data)=>{
                    //     if(err){
                    //         console.log(err)
                    //     }else{
                    //         res.status(200).send("Updated Successfully");
                    //     }
                    //   })
                    res.status(404).send("Unauthorised User");
                }else{
                    let oldUsername = JSON.parse(
                        Buffer.from(token.split(".")[1], "base64").toString()
                      );
                      let old = oldUsername.email;
                      connection.query(Q, [userName , old] , (err,data)=>{
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).send("Updated Successfully");
                        }
                      })
                    // res.status(404).send("Unauthorised User");
                }
            }
        })
    }
});


router.post("/updateEmail" , (req,res)=>{
    let token = req.body.token;
    let email = req.body.email;
    let verify = jwt.verify(token , secrete);
    let Q = "update loggeduser set account_email = ? where backup_email = ?";
    if(verify === false){
        res.status(400).send("Access Denied");
    }else{
        // console.log("token verified");
        let q = "select token_id from tokens where token = ?";
        connection.query(q , [token] ,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                if(result.length != 0){
                    let oldUsername = JSON.parse(
                        Buffer.from(token.split(".")[1], "base64").toString()
                      );
                      let old = oldUsername.email;
                      connection.query(Q, [email , old] , (err,data)=>{
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).send("Updated Successfully");
                        }
                      })
                }else{
                    res.status(404).send("Unauthorised User");
                }
            }
        })
    }
});

router.post("/updatePassword" , (req,res)=>{
    let token = req.body.token;
    let pass = req.body.pass;
    let verify = jwt.verify(token , secrete);
    var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pass, salt);
    let Q = "update loggeduser set password = ? where backup_email = ?";
    if(verify === false){
        res.status(400).send("Access Denied");
    }else{
        // console.log("token verified");
        let q = "select token_id from tokens where token = ?";
        connection.query(q , [token] ,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                if(result.length != 0){
                    let oldUsername = JSON.parse(
                        Buffer.from(token.split(".")[1], "base64").toString()
                      );
                      let old = oldUsername.email;
                      connection.query(Q, [hash , old] , (err,data)=>{
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).send("Updated Successfully");
                        }
                      })
                }else{
                    res.status(404).send("Unauthorised User");
                }
            }
        })
    }
});

router.post("/update" , (req,res)=>{
    let token = req.body.token;
    let verify = jwt.verify(token , secrete);
    if(verify === false){
        console.log(err)
    }else{
        let user = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
          );
        let email = user.email;

        let Q1 = "select token_id from tokens where token = ?"
        connection.query(Q1 , [token] , (err,result) => {
            if(err){
                console.log(err)
            }else{
                if(result.length === 0){
                    res.status(400).send("You Doesn't have access to use this service");
                }else{
                    let Q2 = "select username , account_email from loggeduser where backup_email = ?"
                    connection.query(Q2 , [email] , (err,data) => {
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).send(data);
                        }
                    });
                }
            }
        })
    }
})

router.post("/updateall" , (req,res)=>{
    let token = req.body.token;
    let userName = req.body.user;
    let pass = req.body.pass;
    let Useremail = req.body.email;
    let verify = jwt.verify(token , secrete);
    var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pass, salt);
    if(verify === false){
        console.log(err)
    }else{
        let user = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
          );
        let email = user.email;

        let Q1 = "select token_id from tokens where token = ?"
        connection.query(Q1 , [token] , (err,result) => {
            if(err){
                console.log(err)
            }else{
                if(result.length === 0){
                    res.status(400).send("You Doesn't have access to use this service");
                }else{
                    let Q2 = "update loggeduser set account_email = ? , password = ? , username =? where backup_email = ?"
                    connection.query(Q2 , [Useremail,hash,userName,email] , (err,data) => {
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).send("Updated successfully");
                        }
                    });
                }
            }
        })
    }
});

router.post("/logout" , (req,res)=> {
    let token = req.body.token;
    let verify = jwt.verify(token , secrete);
    if(verify === false){
        res.status(404).send("Cannot do operations")
    }else{
        let Q = "delete from tokens where token = ?"
        connection.query(Q , [token],(err,data)=>{
            if(err){
                console.log(err)
            }else{
                res.status(200).send("ok");
            }
        })
    }
});
module.exports = router;