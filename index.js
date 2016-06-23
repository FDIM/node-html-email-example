var juice = require('juice');
var angularTemplate = require('angular-template');
var nodemailer = require('nodemailer');
var fs = require('fs');

var basePath = './emails/';
var data = {
  name:'Tester',
  unsubscribeLink:'http://www.google.com'
};

var tpl = angularTemplate('emails/template.html', data);

var transporter = nodemailer.createTransport({
  service:'Gmail',
  auth: {
    user:'my@gmail.com',
    pass: "<key>"
  },
  debug:true,
  logger:true,
  proxy: process.env.HTTP_PROXY
});
// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'my@gmail.com', // sender address
    to: process.argv[2], // list of receivers
    subject: "Hi "+(new Date()).getTime(), // Subject line
    text: "Hi "+(new Date()).getTime(), // plaintext body
    html: '', // html body
    attachments:[]
};
var images = [];
tpl.replace(/inline-image="([a-zA-Z0-9\-\/\\ \.]+)"/g, function(match, path){
  images.push(path);
});
var prefix = (new Date()).getTime()+'';
images.forEach((path)=>{
  var cid = prefix+path+'@gmail.com';
  tpl = tpl.replace('inline-image="'+path+'"','src="cid:'+cid+'"');
  mailOptions.attachments.push({
    filename:path,
    cid:cid,
    content: fs.createReadStream(basePath+path),
    contentType:'image/jpeg',
    contentDisposition:'inline'
  });
});

mailOptions.html = juice(tpl);
console.info(mailOptions.html);
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});