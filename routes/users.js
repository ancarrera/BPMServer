var express = require('express');
var router = express.Router();

router.get('/users/:id', function(req, res, next) {
  if(req.accepts('html')){

  }else{

  }
});

module.exports = router;
