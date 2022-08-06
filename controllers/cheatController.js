const CheatConfig = require("../models/CheatConfig")

// @desc    Get cheat config of user
// @route   GET api/cheat/config
// @access  Private
const getConfig = async (req, res) => {
    const config = await CheatConfig.findOne({ user: req.user })
    console.log(config)
    if (config) {
        return res.json({"success": true, config})
    }

    return res.status(400).json({success: false, msg: "Couldn't find config"})
}


// @desc    Update config of an user
// @route   POST api/cheat/config
// @access  Private
const setConfig = async (req, res) => {

    if (!req.body.config) {
        return res.status(400).json({success: false, msg: "Please provide a config object"})
    }

    // Too lazy to do error checking

    await CheatConfig.updateOne({ user: req.user }, {
        settings: req.body.config
    })

    return res.json({"success": true})
}

module.exports = {
    getConfig,
    setConfig
}