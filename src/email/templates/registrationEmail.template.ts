export const RegistrationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registration email in TeamUp</title>
    </head>
    <body>
        <h1>Hello %USERNAME%</h1>
        <p>Welcome in our application. Please click below confirmation link.</p>
        <p>
            <a href="%URL%"
                >Confirmation link</a
            >
        </p>
        <p>Regards,<br />TeamUp Team</p>
    </body>
</html>`;
