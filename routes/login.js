/**
 * Created by Adrian on 21/5/15.
 */
var express = require('express');
var router = new express.Router();
var auth = require('../security/auth');
var accepts = require('accepts');
var bpmModel = require('../db/modelschemas');
var User = bpmModel.User;

router.get('/login',function(req,res,next){

    if(req.accepts('html')=='html'){
        res.render('login', { title: 'Login',header1:'Enter your username (register e-mail)',
            header2:'Enter your password'});
    }

});

router.post('/login',function(req,res,next){
    var accept = accepts(req);
    if(req.accepts('json')=='json' || req.accepts('html')=='html'){

        switch (accept.type(['html','json'])){

            case 'html':

                User.findOne({'email':req.body.email},function(err,user){
                    if(err || !auth.isCorrectPassword(req.body.password,user)){
                        res.status(400);
                        res.send('<h1>Error 400</h1> <p>Email or password incorrect</p>');
                    }else{
                        res.status(200);
                        auth.createUserCookie(res,user._id);
                        res.redirect('/users/'+user._id);
                    }
                });
                break;
            case 'json':
                User.findOne({'email':req.body.email},function(err,user){
                    user.password = md5(user.password);
                    res.render('edituser',{'user':user});
                });
                break;
        }

    }else{
        res.header({'Content-Type':'text/plain'});
        res.status(406);
        res.send('Not acceptable');
    }


});

router.get('/logout',function(req,res,next){

    if(req.accepts('html')=='html'){
        auth.destroyUserCookie(res);
        res.redirect('/login')

    }else{
        res.end();
    }

});

module.exports = router;