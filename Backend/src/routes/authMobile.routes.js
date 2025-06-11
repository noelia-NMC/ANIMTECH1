const express = require('express');
const router = express.Router();
const { registerMobile, loginMobile } = require('../controllers/authMobile.controller');

router.post('/register', registerMobile);
router.post('/login', loginMobile);

module.exports = router;
