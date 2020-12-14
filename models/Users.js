const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },

});
// module.exports = User = mongoose.model("users", UserSchema);
const User = mongoose.model('users', UserSchema);
module.exports = User;