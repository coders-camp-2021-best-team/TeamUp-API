import { Styles } from './styles';

export const ResetPasswordEmailSubject = 'Reset your TeamUp account password';

export const ResetPasswordEmailTemplate = (
    username: string,
    reset_url: string
) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${Styles}</style>
        <title>${ResetPasswordEmailSubject}</title>
    </head>
    <body>
        <h1>Hello, ${username}!</h1>
        <p>We've received a request to reset the password for your TeamUp account.</p>
        <p>You can reset your password by clicking the link below.</p>
        <a href="${reset_url}">Confirm Now</a>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Regards, <br /> TeamUp Developers</p>
    </body>
</html>`;
