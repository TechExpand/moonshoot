const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create user schema & model
const TokenSchema = new Schema({
    network_id: {
        type: String,
    },
    pool_id: {
        type: String,
    },
});


const Token = mongoose.model('token', TokenSchema);

module.exports = Token;