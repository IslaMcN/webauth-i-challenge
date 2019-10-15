const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const router = require('express').Router();

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
    .then(save => {
        res.status(201).json(save);
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    Users.findBy({username})
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({
                message: `You may enter. . . ${user.username}`,
            });
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            res.status(200)
            .json({
                message: 'Bye Felicia!'
            });
        });
    }else{
        res.status(200).json({
            message: 'Who are you?'
        });
    }
});

module.exports = router;