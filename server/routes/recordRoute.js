const express = require('express');
const router = express.Router();
const { createRecord } = require('../controllers/recordController');

router.post('/create', createRecord);

module.exports = router;