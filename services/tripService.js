const User = require('../models/User');
const Trip = require('../models/Trip');

const addTrip = (startPoint, endPoint, date, time, seats, description, carImage, creator) => {
    let trip = new Trip({startPoint, endPoint, date, time, seats, description, carImage, creator});
    
    return trip.save();
};

const getByUser = (userId) => {
    let trips = Trip.find({user: userId}).lean();
    
    return trips;
}

const getAll = () => {
    let trips = Trip.find();
    
    return trips;
}

const deleteOne = (id) => {
    let deleted = Trip.deleteOne({_id: id});
    return deleted;
}

const getOneById = (id) => {
    let trip = Trip.findById(id).lean();
    return trip;
}

const join = (id,joinerID) => {
    let trip = Trip.findById(id).lean();
    if(trip.buddies) trip.buddies.push(joinerID);
    else trip.buddies = [joinerID];
    trip = Trip.findByIdAndUpdate(id,{buddies: trip.buddies});
    return trip;
}

module.exports = {
    addTrip,
    getAll,
    getByUser,
    deleteOne,
    getOneById,
    join,
};