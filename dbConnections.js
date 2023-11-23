const mysql = require("mysql2");

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#santho01",
  database: "hacktrix",
});

con.connect((err) => {
  if(err){
    console.log(err)
  }else{
    console.log('connected')
  }
})

module.exports = con;
