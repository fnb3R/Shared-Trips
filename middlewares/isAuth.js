const { SECRET, COOKIE_NAME } = require('../config/config')
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    let token = req.cookies[COOKIE_NAME];

    if(!token) return res.redirect('/auth/login');
    //.render('home', {error: {message: 'You are not authorized'}});

    jwt.verify(token, SECRET, function(err, decoded) {
        if(err) return res.redirect('/auth/login');

        next();
    }); 
}