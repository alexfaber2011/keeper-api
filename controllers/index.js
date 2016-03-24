/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();

router.use('/api/v1/auth', require('./authCtrl'));
router.use('/api/v1/keeps', require('./keepCtrl'));
router.use('/api/v1/tags', require('./tagCtrl'));
router.use('/api/v1/people', require('./personCtrl'));

module.exports = router;