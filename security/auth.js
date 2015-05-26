/**
 * Created by adrian on 25/5/15.
 */

var md5 = require('MD5');

var cookieName = 'usersessionexpressserver';

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




