const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  // Here there is no requirement for adding username and password fields because passport local mongoose automatically add it with hashed and salted form
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);