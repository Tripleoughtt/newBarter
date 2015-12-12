'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Item;

let itemSchema = mongoose.Schema({
  itemName: {type: String, required: true},
  owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
  forTrade: {type: Boolean, required: true, default: true}
});

Item = mongoose.model('Item', itemSchema);

module.exports = Item;
