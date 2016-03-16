/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();

router.use('/keeps', require('./keepCtrl.js'));

module.exports = router;