import nodemailer from 'nodemailer';

import { InternalServerErrorException } from '../common';
import env from '../config';
import {
    RegistrationEmailSubject,
    RegistrationEmailTemplate,
    ResetPasswordEmailSubject,
    ResetPasswordEmailTemplate
} from '.';
const {
    EMAIL_ENABLE,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    EMAIL_FROM,
    CLIENT_URL
} = env;

export const EmailService = new (class {
    transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_SECURE,
            auth: {
                user: SMTP_USERNAME,
                pass: SMTP_PASSWORD
            },
            logger: true
        });
    }

    registrationEmail(to: string, username: string, activateID: string) {
        return this.sendEmail(
            to,
            RegistrationEmailSubject,
            RegistrationEmailTemplate(
                username,
                `${CLIENT_URL}/activate-account/${activateID}`
            )
        );
    }

    resetPasswordEmail(to: string, username: string, resetID: string) {
        return this.sendEmail(
            to,
            ResetPasswordEmailSubject,
            ResetPasswordEmailTemplate(
                username,
                `${CLIENT_URL}/reset-password/${resetID}`
            )
        );
    }

    async sendEmail(to: string, subject: string, html: string) {
        if (!EMAIL_ENABLE) return;

        try {
            await this.transporter.sendMail({
                to,
                from: EMAIL_FROM,
                subject,
                html
            });
        } catch {
            throw new InternalServerErrorException();
        }
    }
})();
