/**
 * Created by Adrian on 23/5/15.
 */
var express = require('express');
var router = new express.Router();
var bpmModel = require('../db/modelschemas');

var User = bpmModel.User;
var Measurement = bpmModel.Measurement;

router.get('/test/save',function(req,res,next) {
    var user  = createFakeUser();
    console.log(JSON.stringify(user));
    res.end();
});
//http://tech-blog.maddyzone.com/node/add-update-delete-object-array-schema-mongoosemongodb
router.get('/test/save/measurements',function(req,res,next){
   createFakeUser();
   var measurement = createFakeMeasurement();
    User.findOne({'_id':'1'},function(err,user){
        user.push()
    });

    //User.findByIdAndUpdate(
    //    1,
    //    { $push: {"measurements": measurement}},
    //    {  safe: true, upsert: true},
    //    function(err, model) {
    //        if(err){
    //            console.log(err);
    //            return res.send(err);
    //        }
    //        return res.json(model);
    //    });
    res.end();
});

var clear = function(){
    global.db.dropDatabase();
    return function(req,res,next){
        res.end();
    }
}

router.get('/test/clear',clear);

function createFakeUser(){
    var user = new User;
    user.name = 'Pep';
    user.firstsurname = 'Farre';
    user.secondsurname = 'Farre';

    user.save();

}

function createFakeMeasurement(){
    var measurement = new Measurement;
    measurement.systolic = 120;
    measurement.diastolic = 80;
    measurement.pulse = 65;
    measurement.date = '24-05-2015';
    measurement.save();
    return measurement;
}

router.get('/users/:id/measurements',function (req,res,next){

    var measurement = new Measurement;
    measurement.systolic = "137"
    measurement.diastolic = "90"
    measurement.pulse = "70"
    measurement.date = "25-05-15";
    measurement.save(function(err){

            if(!err){
                User.findByIdAndUpdate(
                    req.params.id,
                    { $push: {"measurements": measurement}},
                    {  safe: true, upsert: true},
                    function(err, model) {
                        if(err){
                            console.log(err);
                            return res.send(err);
                        }else{
                            var measuremetns = model.measurements;
                            return res.render('getUserMeasurements',{'user':model});
                        }
                        //return res.json(model);

                    });
            }

        }

    )


});



module.exports = router;
