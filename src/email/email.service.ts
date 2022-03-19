import nodemailer from 'nodemailer';

import {
    RegistrationEmailTemplate,
    RegistrationEmailSubject,
    ResetPasswordEmailTemplate,
    ResetPasswordEmailSubject
} from '.';

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
        // TODO: in future we won't use API_URL, we need to make a pretty page that will not display json response from api

        return this.sendEmail(
            to,
            RegistrationEmailSubject,
            RegistrationEmailTemplate(
                username,
                `${API_URL}/user/activate/${activateID}`
            )
        );
    }

    resetPasswordEmail(to: string, username: string, resetID: string) {
        // TODO: in future we won't use API_URL, we need to make a pretty page that will not display json response from api

        return this.sendEmail(
            to,
            ResetPasswordEmailSubject,
            ResetPasswordEmailTemplate(
                username,
                `${API_URL}/user/reset-password/${resetID}`
            )
        );
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
