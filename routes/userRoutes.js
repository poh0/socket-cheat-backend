const express = require('express')
const router = express.Router()
const { register, authenticate, profile } = require('../controllers/userController')
const passport = require('passport')

router.post('/register', register)
router.post('/authenticate', authenticate)
router.get('/profile', passport.authenticate("jwt", {session:false}), profile)

module.exports = router