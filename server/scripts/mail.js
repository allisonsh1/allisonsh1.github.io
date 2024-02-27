const nodemailer = require('nodemailer');

function sendEmail(subject, content) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'nspease16@gmail.com',
            pass: 'negb euee apnl xbbc',
        }
    });

    let mailOptions = {
        from: '"Test" nspease16@gmail.com',
        to: 'nspease16@gmail.com',
        subject,
        text: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message Sent: ${info.messageId}`);
    })
}

module.exports = {
    sendEmail,
}