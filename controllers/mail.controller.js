const nodemailer = require('nodemailer');

module.exports.send = (req, res, next) => {
    let { email, subject, message } = req.body;

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your email address',
        pass: 'your email password'
      }
    });

    transporter.sendMail({
      from: '"My Awesome Project 👻" <myawesome@project.com>',
      to: email, 
      subject: subject, 
      text: message,
      html: `<b>${message}</b>`
    })
        .then(info => res.json('message', {email, subject, message, info}))
        .catch(error => console.log(error));
}