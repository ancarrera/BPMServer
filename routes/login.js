/**
 * Created by Adrian on 21/5/15.
 */
var express = require('express');
var router = new express.Router();

router.get('/login',function(req,res,next){

    if(req.accepts('html')){
        res.render('login', { title: 'Login',header1:'Introduce el usuario (formato e-mail)',
            header2:'Introduce la contraseña'});
    }

});

router.post('/login',function(req,res,next){

});

module.exports = router