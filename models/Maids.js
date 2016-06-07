var mongoose = require('mongoose');

var MaidsSchema = new mongoose.Schema({
  name: { type: String, index: { unique: true }},
  notes: String,
});


mongoose.model('Maids', MaidsSchema);