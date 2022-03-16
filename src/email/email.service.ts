import nodemailer from 'nodemailer';
import env from '../config';

const { SMPT_USERNAME, SMPT_PASSWORD } = env;

export const EmailService = new (class {
    async registrationEmail(to: string, username: string) {
        // add userId: string
        await this.sendEmail(
            to,
            'Registration email in TeamUp',
            `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Registration email in TeamUp</title>
                    </head>
                    <body>
                        <h1>Hello ${username}</h1>
                        <p>Welcome in our application. Please click below confirmation link.</p>
                        <p><a href="#">Confirmation link</a></p>
                        <p>Regards,<br>TeamUp Team</p>
                    </body>
                </html>` //# = www.waszastrona.pl/activate/${userId}
        );
    }

    async resetPasswordEmail(to: string, username: string) {
        // add userId: string
        await this.sendEmail(
            to,
            'Reset password in TeamUp',
            `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Reset password in TeamUp</title>
                    </head>
                    <body>
                        <h1>Hello ${username}</h1>
                        <p>Here is your reset password link:</p>
                        <p><a href="#">Reset password</a></p>
                        <p>Regards,<br>TeamUp Team</p>
                    </body>
                </html>` // # = www.waszastrona.pl/reset-password/${userId}
        );
    }

    async sendEmail(to: string, subject: string, htmlBody: string) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: SMPT_USERNAME,
                    pass: SMPT_PASSWORD
                },
                logger: true
            });

            return await transporter.sendMail({
                from: `no-replay <${SMPT_USERNAME}>`,
                to: to,
                subject: subject,
                html: htmlBody
            });
        } catch {
            return null;
        }
    }
})();
