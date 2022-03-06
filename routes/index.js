const express = require('express');
const router = express.Router();

// routes
router.use('/', require('./callRoutes'));

module.exports = router;