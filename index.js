var juice = require('juice');
var angularTemplate = require('angular-template');
var nodemailer = require('nodemailer');

var smtpServerURL = 'smtp://<username>:<password>@<host>:<port>';
var data = {
  name:'Tester',
  unsubscribeLink:'http://www.google.com'
};

var tpl = angularTemplate('emails/template.html', data);
var inlined = juice(tpl);

var transporter = nodemailer.createTransport(smtpServerURL);
// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'no-reply@example.com', // sender address
    to: 'my@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: inlined // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});