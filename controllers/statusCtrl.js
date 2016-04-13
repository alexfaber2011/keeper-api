/**
 * Created by alexfaber on 3/20/16.
 */
var express = require('express');
var router = express.Router();

router.get('/status', function(req, res, next){
    res.json(req.headers);
});

module.exports = router;
