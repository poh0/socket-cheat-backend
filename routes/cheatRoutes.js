const express = require('express')
const router = express.Router()
const { getConfig, setConfig } = require('../controllers/cheatController')
const passport = require('passport')

router.get('/config', passport.authenticate("jwt", {session:false}), getConfig)
router.post('/config', passport.authenticate("jwt", {session:false}), setConfig)

module.exports = router