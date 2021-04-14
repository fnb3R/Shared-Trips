const mongoose = require('mongoose');
const Trip = require('./Trip');
const bcrypt = require('bcrypt');
const {SALT_ROUNDS, SECRET} = require('../config/config');

const userScheme = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
        
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },

    trips: [{
        type: mongoose.Types.ObjectId,
        ref: 'Trip'
    }],
});

userScheme.pre('save', function(next) {
    bcrypt.genSalt(SALT_ROUNDS)
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {
            this.password = hash;
            next();
        });
});

module.exports = mongoose.model('User', userScheme)