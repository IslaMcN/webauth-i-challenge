module.exports = (req, res, next) => {
    if (req.session && req.session.username){
        next();
    } else {
        res.status(401).json({
            message: 'Dont even think about it'
        })
    }
};