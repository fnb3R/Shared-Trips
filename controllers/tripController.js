const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const isAuth = require('../middlewares/isAuth');
const authService = require('../services/authService');
const { COOKIE_NAME } = require('../config/config');
const tripService = require('../services/tripService');

router.get('/add',isAuth,  (req, res) => {
    res.render('offer')
});

router.post('/add',isAuth, (req, res) => {
    const {destinations, dateTime, carImage, seats, description} = req.body;
    let creator = res.locals.user._id;
    
    let dests = destinations.split(" - ");
    let error = "";
    if(dests.length != 2) {
            error += 'Destinations are not formatted correctly! ';
           
    }

    // if(!Date.parse(dateTime)) {
    //     error += 'Date is not formatted correctly! ';
    // }

    let dates = dateTime.split(" - ");
    if(dates.length != 2) {
        error += 'Date is not formatted correctly! ';
            
    }
    if(!carImage.includes("http") || !carImage.includes("https")) {
        error += 'Car image url is not formatted correctly! ';
        
    }

    if(error != "") {
        throw new Error(error);
        return;
    }
    tripService.addTrip(dests[0], dests[1], dates[0], dates[1], seats, description, carImage, creator)
    .then(res.redirect('/'));
});

router.get('/shared-trips',isAuth,  (req, res) => {
    let userId = res.locals.user._id;
        tripService.getAll().lean()
            .then(trips => {
                res.render('sharedTrips', {trips});
                //console.log(userExpenses);
            })
    
    //res.render('sharedTrips')
});

router.get('/:id/details',isAuth,  (req, res) => {
    let id = req.params.id.slice(1);
    //console.log(idOfExpense);
    tripService.getOneById(id).lean()
        .then(trip => {
            let currentUser = res.locals.user._id;
            
            //
            //console.log(trip);
            trip.isDriver = trip.creator == currentUser;
            
            if(trip.buddies ) {
                console.log(trip.buddies.find(x => x==currentUser));
                trip.joined = Boolean(trip.buddies.find(x => x==res.locals.user.username)) && !trip.isDriver;
                trip.notJoinedSeatsLeft = trip.buddies.length < trip.seats && !trip.isDriver && !trip.joined;
                trip.notJoinedNoSeatsLeft = trip.buddies.length >= trip.seats && !trip.isDriver && !trip.joined;
                trip.seats -= trip.buddies.length;
            }
            else {
                trip.joined = false;
                trip.notJoinedSeatsLeft = !trip.isDriver;
                trip.notJoinedNoSeatsLeft = false;
            }

            authService.getOneById(trip.creator).lean().then(drive => {
                
                
                trip.driverName = drive.email;


                console.log(trip);
                res.render('details', {trip});
            })
            //trip.notJoinedSeatsLeft = trip.buddies.length < trip.seats;
            //trip.notJoinedNoSeatsLeft = trip.buddies.length >= trip.seats;
        
            
            

            
        })
    
});

router.get('/:expenseId/delete',isAuth,  (req, res) => {
    let id = req.params.expenseId.slice(1);
    tripService.deleteOne(id)
        .then(res.redirect('/'))
    
});

router.get('/:expenseId/join',isAuth,  (req, res) => {
    let id = req.params.expenseId.slice(1);
    tripService.join(id,res.locals.user.username)
        .then(res.redirect('/'))
    
});



module.exports = router;