const express = require('express');
const router = express.Router();

const controller = require('../controllers/callController');

router.route('/getCallLogs')
    .get(controller.getCallLogs)

router.route('/voice')
    .post(controller.voice);

router.route('/gather')
    .post(controller.gather);

router.route('/endCall')
    .post(controller.endCall);


module.exports = router;