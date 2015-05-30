/**
 * Created by adrian on 27/5/15.
 */
var gcm = require('node-gcm');
var message = new gcm.Message();

var API_KEY = 'AIzaSyAumnnNg2xWUHqI2l7qUkyeHmoCjqpheHE';
var DIANA_SYSTOLIC_LIMIT=170;
var DIANA_DIASTOLIC_LIMIT=110;
var REST_DIANA_LIMIT = 20;

function isCorrectPostForNotification(user){
    if (user.totalinsertions % 5 == 0){
        return true;
    }
    return false;
}

function calculatePatientStatus(average){
    if (average.diastolic>DIANA_DIASTOLIC_LIMIT || average.systolic >DIANA_SYSTOLIC_LIMIT){
        return 2;
    }else if ((DIANA_DIASTOLIC_LIMIT - average.diastolic)<=REST_DIANA_LIMIT
        || (DIANA_SYSTOLIC_LIMIT - average.systolic)<=REST_DIANA_LIMIT){
        return 1;
    }else {
        return 0;
    }
}

function prepareMessage(status,lan){
    var message ="";
    var part1_es = "Segun las ultimas 5 mediciones introducidas tu estado de salud es ";
    var part1_en = "According to the latest 5 measurements made your health is ";
    var part2_en_zero = "good";
    var part2_es_zero = "bueno";
    var part2_one = "regular";
    var part2_en_two = "bad";
    var part2_es_two = "malo";

    if (lan == 'en') {
        switch (status) {
            case 0:
                message = part1_en + part2_en_zero;
                break;
            case 1:
                message = part1_en + part2_one;
                break;
            case 2:
                message = part1_en + part2_en_two;
                break;
        }
    }else{
        switch (status) {
            case 0:
                message = part1_es + part2_es_zero;
                break;
            case 1:
                message = part1_es + part2_one;
                break;
            case 2:
                message = part1_es + part2_es_two;
                break;
        }
    }
    return message;
}

function getFiveLastMeasurements(user){

    var totalInsertions = user.totalinsertions;
    var measurementsArray = [];

    for (var i=totalInsertions-1;i>=(totalInsertions-5);i--){
        measurementsArray.push(user.measurements[i]);
    }
    return measurementsArray;
}

function calculateAverages(measurements){
    var average = {'systolic':0,'distolic':0,'pulse':0};

    var tmp_sys = 0,tmp_dia = 0,tmp_pul = 0;
    measurements.forEach(function (measurement){
        tmp_sys = tmp_sys + parseInt(measurement.systolic);
        tmp_dia = tmp_dia +  parseInt(measurement.diastolic);
        tmp_pul = tmp_pul + parseInt(measurement.pulse);
    });


    average.systolic = tmp_sys /5;
    average.diastolic = tmp_dia / 5;
    average.pulse = tmp_pul / 5;

    return average;
}

function checkIfUserHasGCMRegid(user){

    if(user.gcmToken != undefined && user.gcmToken != ''){
        return true;
    }
    return false;
}

function sendMessage(statusNotification,user){

    var sender = new gcm.Sender(API_KEY);
    var message = new gcm.Message();
    message.addData("message",statusNotification);
    sender.send(message, user.gcmToken,function (err, result) {
        if(err) console.error(err);
        else    console.log(result);
    });
}
function createNotificationMessage(user,lan){

    var fiveLastMeasures = getFiveLastMeasurements(user);
    var average = calculateAverages(fiveLastMeasures);
    var status = calculatePatientStatus(average);
    var message = prepareMessage(status,lan);

    return message;
}

exports.sendMobileNotification = function (user,lan){
    if (isCorrectPostForNotification(user)){
        if (checkIfUserHasGCMRegid(user)){
            var message = createNotificationMessage(user,lan);
            sendMessage(message,user);
        }
    }
}

exports.sendWebNotification = function (res,user){

    if (isCorrectPostForNotification(user)){
        var fiveLastMeasures = getFiveLastMeasurements(user);
        var average = calculateAverages(fiveLastMeasures);
        var status = calculatePatientStatus(average);
        var message = prepareMessage(status,'en');
        res.status(200);
        res.render('notification', {'message': message, 'user': user});
    }else{
        res.status(200);
        res.redirect('/users/'+user._id+'/measurements');
    }
}