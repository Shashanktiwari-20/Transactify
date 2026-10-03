const nodemailer = require("nodemailer");
const config = require("../Config/Config");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type : 'OAuth2',
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify((error,success) => {
    if(error){
        console.error(error);
    }
    else {
        console.log("transport verification : ",success);
    }
})

const sendEmail = async (to,subject,text,html) => {
    try{
        const info = await transporter.sendMail({
            from : `"Transactify" <${config.GOOGLE_USER}>`,
            to: to,
            subject:subject,
            text: text,
            html:html
        })
        console.log("message sent: %s",info.messageId);
        console.log("preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    catch(error){
        return res.status(400).json({
            message : error.message
        })
    }
}

async function registrationSucessEmail(to,name){
    const subject = "welcome to Transactify";
    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text ,html);
}

module.exports = {sendEmail,registrationSucessEmail};