var express = require('express');
var router = express.Router();
var accepts = require('accepts');

var bpmModel = require('../db/modelschemas');
var User = bpmModel.User;

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
                  var error = '{status:500,des:User not found}';
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


module.exports = router;
