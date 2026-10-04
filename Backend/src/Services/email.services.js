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

// Throws on failure so the calling controller can handle it
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
    }
    catch(error){
        console.error("email failed: %s", error.message);
        throw error;
    }
}

async function registrationSucessEmail(to,name){
    const subject = "Welcome to Transactify";
    const text = `Hello ${name},\n\nThank you for registering at Transactify. We're excited to have you on board!\n\nBest regards,\nThe Transactify Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Transactify. We're excited to have you on board!</p><p>Best regards,<br>The Transactify Team</p>`;

    await sendEmail(to, subject, text ,html);
}

async function transactionEmail (to, name, amount, fromAccount, toAccount){
    const subject = "Transaction Notification";
    const text = `Hello ${name},\n\nA transaction of amount ${amount} has been made from account ${fromAccount} to account ${toAccount}.\n\nBest regards,\nThe Transactify Team`;
    const html = `<p>Hello ${name},</p><p>A transaction of amount ${amount} has been made from account ${fromAccount} to account ${toAccount}.</p><p>Best regards,<br>The Transactify Team</p>`;

    await sendEmail(to, subject, text, html);
}

async function transactionFailedEmail (to, name, amount, fromAccount, toAccount){
    const subject = "Transaction Failed Notification";
    const text = `Hello ${name},\n\nWe regret to inform you that a transaction of amount ${amount} from account ${fromAccount} to account ${toAccount} has failed.\n\nBest regards,\nThe Transactify Team`;
    const html = `<p>Hello ${name},</p><p>We regret to inform you that a transaction of amount ${amount} from account ${fromAccount} to account ${toAccount} has failed.</p><p>Best regards,<br>The Transactify Team</p>`;

    await sendEmail(to, subject, text, html);
}

module.exports = {sendEmail,registrationSucessEmail,transactionEmail,transactionFailedEmail};