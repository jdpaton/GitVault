var conf = require('./config');
var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: conf.get('smtp_service'),
    auth: {
        user: conf.get('smtp_user'),
        pass: conf.get('smtp_pass')
    }
});

var mailOptions = {
    from: "Gitvault  <gitvault@" + conf.get('domain') + ">", // sender address
    to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
    subject: "Gitvault Notification", // Subject line
    text: "Ping ✔", // plaintext body
    html: "<b>Ping ✔</b>" // html body
}

function sendMail(opts, cb){

  opts.to = opts.to || conf.get('smtp_default_recipient');
  opts.from = mailOptions.from;
  if(! opts.subject) opts.subject = mailOptions.subject;
  if(! opts.text) opts.text = mailOptions.text;
  if(! opts.text && !opts.html) opts.html = mailOptions.html;

  smtpTransport.sendMail(opts, cb);

}

module.exports.sendMail = sendMail;
