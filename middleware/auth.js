const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
    console.log(req);
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied.No access token provided.');

    try {
        const decoded = jwt.decode(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
}

module.exports = auth;