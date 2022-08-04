
const test = async (req, res) => {
    req.io.sockets.emit("my message", {"foo": "bar"})
    return res.json({"success": true})
}

module.exports = {
    test
}