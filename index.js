const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/db-config');
const Users = require('./users/users-model');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('This is working!');
});

server.post('/api/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 5);
    user.password = hash;

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    
    if (username && password) {
        Users.findBy({username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({
                    message: `Welcome ${user.username}`
                });
            }else{
                res.status(401).json({
                    message: 'You shall not pass!!!'
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: `It is not working because ${error}`
            });
        })
        
    }else{
        res.status(400).json({
            message: 'You gotta provide the deets.'
        })
    }
});

server.get('/api/users', protected, (req, res) => {
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

server.get('/hash', (req, res) => {
    const password = req.headers.authorization;
    
    if (password){
        const hash = bcrypt.hashSync(password, 10);
        res.status(200).json({ hash });
    }else{
        res.status(400).json({ 
            message: 'Gimme those deets!'
        })
    }
});

function protected(req, res, next){
    let { username, password } = req.headers;

    if(username && password){
        Users.findBy({ username })
        .fist()
        .ten(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next();
            }else{
                res.status(401).json({
                    message: 'Nope'
                })
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
    }else{
        res.status(400).json({
            message: 'Need the deets'
        })
    }
}

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`I'm running on ${port}`))