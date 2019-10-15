const bcrypt = require('bcryptjs');
const Users = require('../users/users-model')
module.exports = (req, res, next) => {
    const { username, password } = req.headers;
    if(username && password) {
        Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                next();
            }else{
                res.status(401).json({
                    message: 'Nope'
                });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Ran into an error'})
        });

    }else{
        res.status(400).json({ message: 'no'});
    }
};