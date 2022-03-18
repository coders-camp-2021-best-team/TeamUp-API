import nodemailer from 'nodemailer';

import { RegistrationEmailTemplate, ResetPasswordEmailTemplate } from '.';

import logger from '../logger';
import env from '../config';
const { SMTP_USERNAME, SMTP_PASSWORD, FRONT_URL } = env;

export const EmailService = new (class {
    async registrationEmail(to: string, username: string, activateID: string) {
        let template = RegistrationEmailTemplate;

        template = template.replaceAll('%USERNAME%', username);
        template = template.replaceAll('%FRONT_URL%', FRONT_URL);
        template = template.replaceAll('%ACTIVATE_ID%', activateID);

        logger.info(template);
        await this.sendEmail(to, 'Registration email in TeamUp', template);
    }

    async resetPasswordEmail(to: string, username: string, resetID: string) {
        let template = ResetPasswordEmailTemplate;

        template = template.replaceAll('%USERNAME%', username);
        template = template.replaceAll('%FRONT_URL%', FRONT_URL);
        template = template.replaceAll('%RESET_ID%', resetID);

        logger.info(template);
        await this.sendEmail(to, 'Reset password in TeamUp', template);
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
                    user: SMTP_USERNAME,
                    pass: SMTP_PASSWORD
                },
                logger: true
            });

            return await transporter.sendMail({
                from: `no-reply <${SMTP_USERNAME}>`,
                to,
                subject,
                html: htmlBody
            });
        } catch {
            return null;
        }
    }
})();
