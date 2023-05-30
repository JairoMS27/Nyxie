const {model, Schema} = require("mongoose");

let ticketSchema = new Schema({
    Guild: String,
    Channel: String,
    Ticket: String,
    AdminRole: String,
});

module.exports = model("ticketSchema", ticketSchema);