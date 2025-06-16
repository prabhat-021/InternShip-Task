const mongoose = require("mongoose");

const pluginSchema = new mongoose.Schema({
  prompt: String,
  code: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plugin", pluginSchema);
