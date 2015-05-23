var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user/:id', function(req, res, next) {
  if(req.accepts('html')){

  }
});

module.exports = router;
