const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) res.status(401).send('Access Denied');
    jwt.verify(token, process.env.SECRET_KEY, (err, verified) => {
        if (err) res.send(err.message);
        else {
            req.user = verified;
            console.log(verified);
            next();
        }
    });
}