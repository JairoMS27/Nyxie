const {model, Schema} = require("mongoose");

let clearSchema = new Schema({
    Guild: String,
    Channelogs: String,
});

module.exports = model("clearSchema", clearSchema);