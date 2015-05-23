/**
 * Created by Adrian on 22/5/15.
 */
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var MeasuremetsSchema = new Schema({
    'systolic':String,
    'diastolic':String,
    'pulse':String,
    'date':String
});

var UserSchema = new Schema({

    'name':String,
    'firstsurname':String,
    'secondsurname':String,
    'age':String,
    'city':String,
    'administration':String,
    'country':String,
    'password':String,
    'totalinsertions':{ type:Number,default:0},
    'measurements':{ type:[MeasuremetsSchema],index:true}

});

var Measurement = mongoose.model('Measurement',MeasuremetsSchema);
var User = mongoose.model('User',UserSchema);

exports.User = User;
exports.Measurement = Measurement;