const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

const register = (email, password) => {
    let user = new User({email, password});
    
    return user.save();
};

const getOneById = (id) => {
    let user = User.findById(id).lean();
    return user;
}

const getManyById = (id) => {
    let users = User.find({_id: id}).lean();
    return users;
}

const login = async (email, password) => {
    let user = await User.findOne({email});

    if (!user) return Promise.reject({message: 'No such user', status: 404});
        // if(!user) throw {message: 'No such user', status: 404};

    let areEqual = await bcrypt.compare(password, user.password);
    if(!areEqual) return Promise.reject({message: 'Invalid Password', status: 404});

    let token = jwt.sign({_id: user._id, username: user.email}, SECRET);
    return token;
    
};

module.exports = {
    register,
    login,
    getOneById,
    getManyById,
}