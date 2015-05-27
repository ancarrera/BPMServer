/**
 * Created by adrian on 27/5/15.
 */
var gcm = require('node-gcm');
var message = new gcm.Message();
var U

var API_KEY = 'AIzaSyAumnnNg2xWUHqI2l7qUkyeHmoCjqpheHE';
var testRegId = 'APA91bEmT3cFVrblef93mZoOf0K_bvokxRIhDzlqbYw1Bk2MHbLePE77VPoE3bc5KrHlGHcUEX_KhA7Fk2bQEC4-N38Zw0GRMRhlxHtg_PxaWzU8zoL-tYWrFDy-9CK2I0uZto1j61RKwvQCvpbEKhIcRTLhr233wJ96ezaTvRa51Ezk85J2m94';

var DIANA_SYSTOLIC_LIMIT=170;
var DIANA_DIASTOLIC_LIMIT=110;
var REST_DIANA_LIMIT = 20;

function isCorrectPostForNotification(user){
    //if (user.getTotalinsertions() % 5 == 0){
    //    return true;
    //}
    return true;
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

    //if(user.gcmToken != undefined && user.gcmToken != ''){
    //    return true;
    //}
    return true;
    //return false;
}

function sendMessage(statusNotification,user){

    var sender = new gcm.Sender(API_KEY);
    var message = new gcm.Message();
    message.addData("message",statusNotification);
    sender.send(message, [testRegId], function (err, result) {
        if(err) console.error(err);
        else    console.log(result);
    });
}

exports.sendMobileNotification = function (user){
    if (checkIfUserHasGCMRegid(user)){
        if (isCorrectPostForNotification(user)){
            var fiveLastMeasures = getFiveLastMeasurements(user);
            var average = calculateAverages(fiveLastMeasures);
            var status = calculatePatientStatus(average);
            var message = prepareMessage(status,'es');
            sendMessage(message,user);
        }
    }
}

