const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e3c050e161710d",
      pass: "26d633bd020ff1"
    }
  });

const message = {
    from: 'emusk@example.com',
    to: 'austin.puthen@pace.edu',
    subject: 'love your work',
    text: 'How ya doing'
};

transport.sendMail(message, function(err,info) {
    if(err) {
        console.log(err);
    } else {
        console.log(info);
    }
})
