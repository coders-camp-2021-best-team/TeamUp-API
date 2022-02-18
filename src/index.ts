import express from 'express';

import env from './config';
const { PORT } = env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: 'Hello, world!'
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
