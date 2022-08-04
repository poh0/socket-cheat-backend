const express = require('express')
const router = express.Router()
const { test } = require('../controllers/cheatController')
const passport = require('passport')

router.get('/test', passport.authenticate("jwt", {session:false}), test)

module.exports = router