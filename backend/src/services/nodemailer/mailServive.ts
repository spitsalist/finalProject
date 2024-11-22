import nodemailer from 'nodemailer';

export const sendEmail = async(to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port:465,
        secure:true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    })
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    })
}
