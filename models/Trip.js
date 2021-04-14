const mongoose = require('mongoose');
const User = require('./User');

const tripScheme = new mongoose.Schema({
    startPoint: {
        type: String,
        required: true,
        minlength: 4,
    },
    endPoint: {
        type: String,
        required: true,
        minlength: 4,
    },
    date: {
        type: String,
        required: true,
        minlength: 6,
    },
    time: {
        type: String,
        required: true,
        minlength: 6,
    },
    seats: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
    carImage: {
        type: String,
        required: true,
        minlength: 10,
    },
    creator: {
        type: String,
        required: true,
    },
    buddies: [{
        type: String,
    }],
});

module.exports = mongoose.model('Trip', tripScheme);