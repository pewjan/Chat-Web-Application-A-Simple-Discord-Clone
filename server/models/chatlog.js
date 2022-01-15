const mongoose = require("mongoose");
const chatSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const chatSchemaFunc = (serverName) => {
  return mongoose.model(serverName, chatSchema);
};
module.exports = chatSchemaFunc;
