'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple')
var authMiddleware = require('../config/auth')
var User = require('../models/user');
var Item = require('../models/item');
var Trade = require('../models/trade');

router.post('/', authMiddleware, function(req, res, next) {
  var payload = jwt.decode(req.body.token, process.env.JWT_SECRET)
  console.log(payload)
  var data = {}
  data.currentUser = payload.username
  Item.find({owner: payload._id}, (err, myItems) => {
      // console.log(myItems)
      data.myItems = myItems;
      Item.find({forTrade: true , owner: {$ne : payload._id}}, (err, publicItems) => {
        // console.log(publicItems)
        data.publicItems = publicItems;
        Trade.find({$or: [{requestingUser: payload._id},
        {respondingUser: payload._id}]}, (err, pendingTrades) => {
          // console.log('Pending Trades: ', pendingTrades);
          data.pendingTrades = pendingTrades
          console.log(data)
          res.send({data: data});
        }).populate('requestingUser respondingUser requestedItem responseItem', "username itemName")
      }).populate('owner', 'username')
  })
});

router.post('/newTrade', (req, res) => {
  console.log(req.body)
  Trade.newTrade(req, res, function(err, savedTrade) {
    if (err) return console.error(err);
    console.log('saved trade in route ', savedTrade);
    // res.send(savedTrade)
  })
})

router.post('/makeTrade', (req, res) => {
  Trade.findById(req.body._id, (err, trade) => {
    trade.makeTrade(trade, (err, tradeComplete) => {
      if (err) return console.error(err);
      console.log(tradeComplete);
        Trade.findByIdAndRemove(req.body._id, (err, removedTrade) => {
          if (err) return console.error(err);
          console.log(removedTrade);
          res.send(tradeComplete)
        })
    })
  }) 
})

router.post('/notForTrade', (req, res) => {
  // console.log(req.body);
  var payload = jwt.decode(req.cookies.token, process.env.JWT_SECRET);
  // console.log(payload);
  Item.find({itemName: req.body.itemName, owner: payload._id}, (err, foundItem) => {
    if (err) return console.error(err);
    // console.log(foundItem)
    Item.findByIdAndUpdate(foundItem[0]._id, {$set: {forTrade: !foundItem[0].forTrade}}, (err, updatedStatus) => {
      if (err) return console.error(err);
      // console.log('foundItems for trade status ', updatedStatus);      
      res.send(updatedStatus);
    })
  })
})

router.post('/deleteTrade', (req, res) => {
  Trade.findByIdAndRemove(req.body._id, (err, removedTrade) => {
    res.send(removedTrade)
  })
})

router.post('/removeItem', (req, res) => {
  console.log(req.cookies)
  console.log(req.body)
  var payload = jwt.decode(req.cookies.token, process.env.JWT_SECRET)
  Item.find({owner: payload._id, itemName: req.body.itemName}, (err, foundItem) => {
    console.log('found items: ', foundItem)
    Item.findByIdAndRemove(foundItem[0]._id, (err, removedItem) => {
      console.log(removedItem)
      res.send(removedItem);
    })
  })
})

router.post('/addItem', (req, res) => {
  var item = new Item(req.body.item);
  console.log(item)
  var payload = jwt.decode(req.cookies.token, process.env.JWT_SECRET)
  console.log(payload.username)
  Item.find({itemName: req.body.name, owner: payload._id}, (err, item) => {
    if (err || item[0]) return res.send(err || 'you already own this item')
  })
  item.owner = payload._id
  item.itemName = req.body.name
  console.log(payload._id)
  item.save(function(err, savedItem){
    if(err) return console.log(err)
    console.log(savedItem)
    res.send(savedItem)
  })
})

module.exports = router;
