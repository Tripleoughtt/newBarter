'use strict'; 

let mongoose = require('mongoose');
let jwt = require('jwt-simple');
let User = require('./user')
let Item = require('./item')
let Schema = mongoose.Schema;
let Trade;

let tradeSchema = mongoose.Schema({
  requestingUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  respondingUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  requestedItem: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
  responseItem: {type: Schema.Types.ObjectId, ref: 'Item', required: true}
  
});

tradeSchema.statics.newTrade = (req, res, cb) => {
  console.log("Trade info: ", req.body)
  let trade = new Trade();
  let tradeInfo = req.body
  let payload = jwt.decode(req.cookies.token, process.env.JWT_SECRET)
  console.log('newTrade id', payload._id)
  User.find({"username": tradeInfo.respondingUser}, function(err, respondingUser){
    trade.respondingUser = respondingUser[0]._id;
    trade.requestingUser = payload._id;
    Item.find({owner: trade.requestingUser, itemName: tradeInfo.offeredItem}, function(err, itemForTrade){
      trade.responseItem = (itemForTrade[0]._id);

      Item.find({owner: trade.respondingUser, itemName: tradeInfo.requestedItem}, function(err, desiredItem){
        trade.requestedItem = desiredItem[0]._id;
        trade.save((err, savedTrade) => {
          Trade.findById(savedTrade._id, (err, foundTrade) => {
            console.log('model newTrade saved Trade ', foundTrade);
            res.send(foundTrade);
          }).populate('requestingUser respondingUser requestedItem responseItem', "username itemName")
        })
      })
    })
  })
}

tradeSchema.methods.makeTrade = (trade, cb) => {
  console.log('initial trade: ', trade)
  Item.findByIdAndUpdate(trade.requestedItem, {$set: {owner: trade.requestingUser}}).populate('owner', 'username').exec((err, requestMatch) => {
    if (err) return console.error(err);
    console.log(requestMatch);
    Item.findByIdAndUpdate(trade.responseItem, {$set: {owner: trade.respondingUser}}).populate('owner', 'username').exec((err, responseMatch) => {
      if (err) return console.error(err);
      console.log(responseMatch);
      cb(err, [requestMatch, responseMatch]);
    })
  })
}


Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;

















