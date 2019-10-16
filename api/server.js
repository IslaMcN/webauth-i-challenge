const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');
const KnexSessionStore = require('connect-session-knex')(sessions);

const authRouter = require('../auth/auth-router');
const userRouter = require('../users/users-router');
const knexConfig = require('../database/dbConfig');

const server = express();

const sessionConfiguration = {
    name: 'Arya',
    secret: 'dadadadada',
    cookie: {
        httpOnly: true,
        maxAge: 10000 * 60 * 60,
        secure: false,
    },
    resave: false,
    saveUnitialized: true,

    store: new KnexSessionStore({
        knex: knexConfig,
        createtable: true,
        clearInterval: 5000 * 60 * 30
    }),
};

server.use(sessions(sessionConfiguration));

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use('/api/auth', authRouter);
server.use('/api/users', userRouter);
server.get('/', (req, res) => {
    res.json({ api: 'up'});
});

module.exports = server;