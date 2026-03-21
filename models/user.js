const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-lacal-mongoose");

const userSchema = new Schema({
    email:{
        type : String,
        required : true,
    },
})

userSchema.plugin(passportLocalMongoose);

// we added the userSchema plugin as it add a username it self with hashing and salting
module.exports = mongoose.model("User",userSchema);
