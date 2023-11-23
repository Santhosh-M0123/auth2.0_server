const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // user: 'santhoshmsanthosh.1916@gmail.com',
      user : "uxonlydesign@gmail.com",
      // pass: 'wxkvwrkautjeiato'
      pass : "ejqzivtrrfndjklz"
    }
  });

module.exports = transporter;