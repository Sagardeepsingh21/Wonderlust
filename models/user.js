const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plm = require("passport-local-mongoose");
const passportLocalMongoose = plm.default || plm;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

 // should be "function"

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);