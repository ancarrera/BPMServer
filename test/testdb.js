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

    user.save();

    var userresult = User.where('name', 'Pepe').exec();

    console.log(JSON.stringify(user));
});

module.exports = router;
