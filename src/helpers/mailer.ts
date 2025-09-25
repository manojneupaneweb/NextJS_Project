import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';


export const sendEmail = async (email: string, emailType: string, userId: string) => {
    try {

        const hashToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashToken,
                verifyTokenExpiry: Date.now() + 3600000,
            }, { new: true });
        }
        if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            }, { new: true });
        }
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.nodemailer_user,
                pass: process.env.nodemailer_pass
            }
        })

        let subject, html;

        if (emailType === "VERIFY") {
            subject = "Verify your email";
            html = `<p>Click <a href="${process.env.BASE_URL}/verify-email?token=${hashToken}">here</a> to verify your email. This link will expire in 1 hour.</p>`;
        } else if (emailType === "RESET") {
            subject = "Reset your password";
            html = `<p>Click <a href="${process.env.BASE_URL}/reset-password?token=${hashToken}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
        }

        const mailOptions = {
            from: "manojneupane@gmail.com",
            to: email,
            subject,
            html,
            text: `Your token is: ${hashToken}`,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;


    } catch (error) {
        console.error("Error sending email:", error);
    }
}