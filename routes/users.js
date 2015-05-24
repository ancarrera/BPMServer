var express = require('express');
var router = express.Router();
var accepts = require('accepts');

var bpmModel = require('../db/modelschemas');
var User = bpmModel.User;

var userAttributes = ['email','name','firstsurname','secondsurname','age','city','administration','country','password'];


router.get('/users/create',function(req,res,next){

    if(req.accepts('html')=='html'){
        res.status(200);
        res.render('createuser');
    }else{
        res.header({'Content-Type':'text/plain'});
        res.status(406);
        res.send('Not acceptable');
    }


});

router.post('/users/create',function(req,res,next){


    var accept = accepts(req);
    if(req.accepts('json')=='json' || req.accepts('html')=='html'){

        var checkedParams = checkPostRequest(req,userAttributes);
        if(checkedParams == ''){

            var user = createNewUser(req);

            switch (accept.type(['html','json'])){

                case 'html':

                    user.save(function(err){

                        if(err){
                            res.status(500);
                            res.send('<h1>Error 500</h1> <p>User can not be registered</p>');
                        }else{
                            res.status(200);
                            res.render("home",{'user':user});
                        }

                    });
                    break;
                case 'json':
                    user.save(function(err){

                        if(err){
                            res.status(500);
                            var error = {"status":500,"des":"User can not be registered"};
                            res.json(error);
                        }else{
                            res.status(200);
                            res.json(user);
                        }

                    });
                    break;
            }
        }else{

            switch (accept.type(['html','json'])){
                case 'html':
                    res.status(400);
                    res.send('<h1>Error 400: Bad request</h1><p>Missing params ['+checkedParams+']</p>');
                    break;
                case 'json':
                    res.status(400);
                    var error_json = {"status":400,"des":"Bad request","missing_params":JSON.stringify(checkedParams.split(','))};
                    res.json(error_json);
                    break;
            }
        }

    }else{
        res.header({'Content-Type':'text/plain'});
        res.status(406);
        res.send('Not acceptable');
    }


});

router.get('/users/:id/edit',function(req,res,next){

    if(req.accepts('html')=='html'){
        res.status(200);
        User.findOne({'_id':req.params.id},function(err,user){
            res.render('edituser',{'user':user});
        });

    }else{
        res.header({'Content-Type':'text/plain'});
        res.status(406);
        res.send('Not acceptable');
    }


});

router.put('/users/:id',function(req,res,next){

    var accept = accepts(req);
    if(req.accepts('json')=='json' || req.accepts('html')=='html'){

        var checkedParams = checkPostRequest(req,userAttributes);
        if(checkedParams == ''){

            var user = createNewUser(req);
            user._id = req.params.id;
            switch (accept.type(['html','json'])){

                case 'html':

                    user.update(function(err){

                        if(err){
                            res.status(500);
                            res.send('<h1>Error 500</h1> <p>User can not be edited</p>');
                        }else{
                            res.status(200);
                            res.redirect('/users/'+user._id);
                        }

                    });
                    break;
                case 'json':
                    user.update(function(err){

                        if(err){
                            res.status(500);
                            var error = {"status":500,"des":"User can not be edited"};
                            res.json(error);
                        }else{
                            res.status(200);
                            res.json(user);
                        }

                    });
                    break;
            }
        }else{

            switch (accept.type(['html','json'])){
                case 'html':
                    res.status(400);
                    res.send('<h1>Error 400: Bad request</h1><p>Missing params ['+checkedParams+']</p>');
                    break;
                case 'json':
                    res.status(400);
                    var error_json = {"status":400,"des":"Bad request","missing_params":JSON.stringify(checkedParams.split(','))};
                    res.json(error_json);
                    break;
            }
        }

    }else{
        res.header({'Content-Type':'text/plain'});
        res.status(406);
        res.send('Not acceptable');
    }


});

router.delete('/users/:id/delete', function (req,res,next) {
        var accept = accepts(req);
        if(req.accepts('json')=='json'  || req.accepts('html')=='html'){
            User.findOne({'_id':req.params.id},function(err,user){

                switch (accept.type(['html','json'])){

                    case 'html':
                        if(!err && user != null){
                           user.remove();
                           res.redirect('/login')
                        }else{
                            res.status(404);
                            res.send('<h1>Error 404</h1> <p>User not found</p>');
                        }
                        break;
                    case 'json':
                        if(!err && user != null){
                            user.remove();
                            res.json({"status":200,"des":"User deleted"});
                        }else{
                            res.status(404);
                            var error = {"status":404,"des":"User not found"};
                            res.json(error);
                        }
                        break;
                }
            });

        }else{
            res.header({'Content-Type':'text/plain'})
            res.status(406);
            res.send('Not acceptable');
        }

    });

router.get('/users/:id', function(req, res, next) {
    var accept = accepts(req);
    if(req.accepts('json')=='json'  || req.accepts('html')=='html'){
        User.findOne({'_id':req.params.id},function(err,user){

            switch (accept.type(['html','json'])){

                case 'html':
                    if(!err && user != null){
                        res.render('getuser', {'user': user});
                    }else{
                        res.status(404);
                        res.send('<h1>Error 404</h1> <p>User not found</p>');
                    }
                    break;
                case 'json':
                    if(!err && user != null){
                        res.json(user);
                    }else{
                        res.status(404);
                        var error = {"status":404,"des":"User not found"};
                        res.json(error);
                    }
                    break;
            }
        });

    }else{
        res.header({'Content-Type':'text/plain'})
        res.status(406);
        res.send('Not acceptable');
    }

});

function checkPostRequest(req,objectmethods){
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

function createNewUser(req){
    var user = new User;
    user.name = req.body.name;
    user.email = req.body.email;
    user.firstsurname = req.body.firstsurname;
    user.secondsurname = req.body.secondsurname;
    user.age = req.body.age;
    user.city = req.body.city;
    user.administration = req.body.administration;
    user.country = req.body.country;
    user.password = req.body.password;
    return user;
}

module.exports = router;
