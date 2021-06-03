const nodemailer = require("nodemailer");

function SendEmail({ destination, object, body }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "RiaInEvent@gmail.com",
      pass: "zribi2020",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: "RiaInEvent@gmail.com",
    to: destination,
    subject: object,
    text: body,
  };

  transporter.sendMail(mailOptions, function (err, res) {
    if (err) {
      console.log("Error sending mail");
      console.error(err);
      console.log("****************************");
    } else {
      console.log("Email Sent");
    }
  });
}

module.exports = { SendEmail };
