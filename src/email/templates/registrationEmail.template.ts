import { Styles } from './styles';

export const RegistrationEmailSubject = 'Confirm your TeamUp account';

export const RegistrationEmailTemplate = (
    username: string,
    confirm_url: string
) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${Styles}</style>
        <title>${RegistrationEmailSubject}</title>
    </head>
    <body>
        <h1>Hello, ${username}!</h1>
        <p>You successfully registered an account on TeamUp. Before you can use our website, we need to verify that this email address belongs to you.</p>
        <p>Please, click bellow link to confirm your account.</p>
        <a href="${confirm_url}">Confirm Now</a>
        <p>Regards, <br /> TeamUp Developers</p>
    </body>
</html>`;
