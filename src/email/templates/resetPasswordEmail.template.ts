export const ResetPasswordEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset password in TeamUp</title>
    </head>
    <body>
        <h1>Hello %USERNAME%</h1>
        <p>Here is your reset password link:</p>
        <p>
            <a href="%FRONT_URL%/reset-password/%RESET_ID%">Reset password</a>
        </p>
        <p>Regards,<br />TeamUp Team</p>
    </body>
</html>`;
