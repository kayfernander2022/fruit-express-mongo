// Import Dependencies
const mongoose = require("./connection");//bringing over the edited mongoose file from connections folder not.

// pull schema and model from mongoose
const { Schema, model } = mongoose;

// make fruits schema
const userSchema = new Schema({
  username: {type: String, required: true, unique: true},//if more then one property we have to name them. eg: type:, required:, and unique:
  password: {type: String, required: true}
});

// make fruit model
const User = model("User", userSchema);


// Export Model
///////////////////////////////////////////////////
module.exports = User