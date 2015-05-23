/**
 * Created by Adrian on 22/5/15.
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema =  mongoose.Schema;

var MeasuremetsSchema = new Schema({
    'systolic':{type:String,default:""},
    'diastolic':{type:String,default:""},
    'pulse':{type:String,default:""},
    'date':{type:String,default:""}
});

var UserSchema = new Schema({

    'name':{type:String,default:""},
    'firstsurname':{ type:String,default:""},
    'secondsurname':{ type:String,default:""},
    'age':{ type:String,default:""},
    'city':{ type:String,default:""},
    'administration':{ type:String,default:""},
    'country':{ type:String,default:""},
    'password':{ type:String,default:""},
    'totalinsertions':{ type:Number,default:0},
    'measurements':[MeasuremetsSchema]
});

var connection = global.db.connections[0];
autoIncrement.initialize(connection);
UserSchema.plugin(autoIncrement.plugin,'User');
MeasuremetsSchema.plugin(autoIncrement.plugin,'Measurement');

var Measurement = mongoose.model('Measurement',MeasuremetsSchema);
var User = mongoose.model('User',UserSchema);

exports.User = User;
exports.Measurement = Measurement;
exports.handleDBError = function (err, res) {

    res.status(500).send('Internal error reading in DB');
}


