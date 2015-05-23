/**
 * Created by Adrian on 23/5/15.
 */
var express = require('express');
var router = new express.Router();
var bpmModel = require('../db/modelschemas');

var User = bpmModel.User;
var Measurement = bpmModel.Measurement;

router.get("/test",function(req,res,next) {
    var user = new User;
    user.name = 'Pepe';
    user.firstsurname = 'Pardo';
    user.secondsurname = 'Pardo';

    user.save(function (err) {
        if (err)
            console.log('Error saving user');
        else
            console.log('Saveeeeee')
    });
    console.log(JSON.stringify(user));

    //var query = User.findOne({'name': 'Pepe'});
    //query.select('*');
    //query.exec(function (err, user) {
    //    if (err) return handleError(err);
    //    console.log('Return query value %s ', user.name);
    //});
    res.send(JSON.stringify(user));
});

module.exports = router;
