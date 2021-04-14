const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const authService = require('../services/authService');
const { COOKIE_NAME } = require('../config/config');

router.get('/', (req, res) => {
    res.send('Auth Controller')
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    const {email, password} = req.body;
    
    authService.login(email, password)
        .then(token => {

            res.cookie(COOKIE_NAME, token, { httpOnly: true });
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
})

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res, next) => {

        const { email, password, passwordRepeat } = req.body;
        let pattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        if (!pattern.test(email)) {
            throw new Error('Email is invalid!');
            return;
        }
        
        if (password !== passwordRepeat) {
            throw new Error('Password Mismatch');
            return;
        }
        authService.register(email, password)
        .then(createdUser => {
            console.log('createdUser');
            console.log(createdUser);
            authService.login(email, password)
        .then(token => {

            res.cookie(COOKIE_NAME, token, { httpOnly: true });
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
    });
    }
);

router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.redirect('/');
});

module.exports = router;