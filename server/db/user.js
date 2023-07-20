const mongoose = require("mongoose");



// add following, array, reference to issue
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    adminFlag: { type: Boolean, required: true },
    followissue: [{type:mongoose.Schema.Types.ObjectId, ref: 'Issue'}],
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;