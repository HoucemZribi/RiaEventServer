const sendMail = (to, name, type) => {
  const setTransport = mailer.createTransport({
    service: "GMAIL",
    auth: {
      user: process.env.EMAIl,
      pass: process.env.PASSWORD,
    },
  });
  const getEmailData = (to, name, template) => {
    let data = null;
    switch (template) {
      case "hello":
        data = {
          from: process.env.EMAIl,
          to,
          subject: "Hello {name}",
        };
        break;
      case "Updating":
        data = {
          from: process.env.EMAIl,
          to,
          subject: "Hello {name} your event is getting updated",
        };
        break;
      default:
        data;
    }
    return data;
  };

  const mail = getEmailData(to, name, type);
  setTransport.sendMail(mail, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent ");
    }
    setTransport.close();
  });
};
module.exports = {
  sendMail,
};
