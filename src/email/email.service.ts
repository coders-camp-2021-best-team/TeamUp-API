import nodemailer from 'nodemailer';

import { RegistrationEmailTemplate, ResetPasswordEmailTemplate } from '.';

import env from '../config';
const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    EMAIL_FROM,
    API_URL
} = env;

export const EmailService = new (class {
    transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: true,
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD
            },
            logger: true
        });
    }

    registrationEmail(to: string, username: string, activateID: string) {
        let template = RegistrationEmailTemplate;

        template = template.replaceAll('%USERNAME%', username);
        template = template.replaceAll(
            '%URL%',
            `${API_URL}/user/activate/${activateID}`
        );
        // TODO: in future we won't use API_URL, we need to make a pretty page that will not display json response from api

        return this.sendEmail(to, 'Registration email in TeamUp', template);
    }

    resetPasswordEmail(to: string, username: string, resetID: string) {
        let template = ResetPasswordEmailTemplate;

        template = template.replaceAll('%USERNAME%', username);
        template = template.replaceAll(
            '%URL%',
            `${API_URL}/user/reset-password/${resetID}`
        );
        // TODO: in future we won't use API_URL, we need to make a pretty page that will not display json response from api

        return this.sendEmail(to, 'Reset password in TeamUp', template);
    }

    async sendEmail(to: string, subject: string, html: string) {
        return this.transporter.sendMail({
            to,
            from: EMAIL_FROM,
            subject,
            html
        });
    }
})();
