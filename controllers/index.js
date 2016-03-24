/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();

router.use('/api/v1/auth', require('./authCtrl.js'));
router.use('/api/v1/keeps', require('./keepCtrl.js'));
router.use('/api/v1/tags', require('./tagCtrl.js'));

module.exports = router;