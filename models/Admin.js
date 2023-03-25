const mongoose = require("mongoose");
const schemas = require("../config/schemas.config")


const AdminSchema = mongoose.Schema({
  name : {
    type: String,
    required: true,
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : schemas.USERS
  }
});

module.exports = mongoose.model("admins", AdminSchema);