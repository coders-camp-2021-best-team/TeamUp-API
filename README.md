# TeamUp-API

This project was made due to the **[CodersCamp2021](https://www.coderscamp.edu.pl/)**

[Docs](https://gracious-neumann-544c01.netlify.app/)

[Deploy on Heroku](https://coderscamp-teamup.herokuapp.com/)

## Important Notices

### .env.example & .docker.env.example

Before you can start the app, you need to create your own `.env` and `.docker.env` files.
There are `.env.example` and `.docker.env.example` files with example values that are ready to use.

### For Windows users

If you are a Windows user, please use Git Bash or any other UNIX-like shell (e.g. Git Bash).
Some commands **MAY NOT** work on default Windows Command Line.

## Available Commands

In the project directory, you can run:

### `yarn install`

Installs all required packages.
This is the first command that you should run after cloning this repo.
**Without this you will not be able to run the app.**

### `yarn build:watch`

Runs a TypeScript build task in watch mode. It watches for any changes in your code and recompiles everything on the fly.
**Without this you will not be able to run the app.**

### `cp .docker.env.example .docker.env && cp .env.example .env`

Creates env config files with all default values.
**Without this you will not be able to run the app.**

### `docker compose up -d`

Starts all required Docker containers. Docker container that API lives in is also watching for any changes in the code. You don't need to restart all Docker containers.
**This is how you run the app.**

**API exposes an open debugger port 9229! Please don't work in any public WiFi networks or setup correct firewall rules to block network traffic on port 9229!!!**

### `docker compose down`

Stops all Docker containers.

### `yarn test`

Runs tests.

### `yarn lint`

Checks every source code file using ESLint and rules described in `.eslintrc`.

### `yarn format`

Formats entire project using Prettier according to formatting rules described in `.prettierrc`.
