/**
 * Created by adrian on 25/5/15.
 */

var cookieName = 'usersessionexpressserver';
var bpmModel = require('../db/modelschemas');
var User = bpmModel.User;

exports.createUserCookie = function(res,serializedUser){

    res.cookie(cookieName,serializedUser,{ expires: new Date(Date.now() + 1000 * 60 * 3), httpOnly: true });
}

exports.destroyUserCookie = function (res){
   res.clearCookie(cookieName);
}

exports.checkIfUserHasAsignedCookie = function (req,userId) {
    if (req.cookies.cookieUdlejerciciosExpress !== undefined){
        false;
    }else if(req.cookies.usersessionexpressserver == userId){

        return true;
    }else{
        return false;
    }

}

exports.isCorrectPassword= function(requestPassword,user){

    if(user != null){
        if(requestPassword == user.password){
            return true;
        }
    }

    return false;
}

exports.checkPostRequest = function(req,objectmethods){

    var params = '';
    var first = true;

    objectmethods.forEach(function(entry) {
        if(typeof req.body[entry] === 'undefined'){
            if(first){
                first= false;
                params += entry;
            }else{
                params +=','+entry;
            }
        }
    });
    return params;
}

//this methods allows get the password(token) before that update,
exports.getTokenInUpdateMethods = function(user_id,callback){

    User.findOne({ '_id': user_id }, 'password', callback);
}




