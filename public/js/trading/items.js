'use strict';

$(document).ready(init);

function init() {
  $('#myItemsTable').on('click', '.deleteItem', removeItem);
  $('#trade').on('click', tradeInit);
  $('#myItemsTable').on('click', '.cancelTrade', cancelTrade);
  $('#myItemsTable').on('click', '.acceptTrade', acceptTrade);
  $('#myItemsTable').on('click', '.forTrade', changeTradeStatus)
}
function changeTradeStatus() {
  var item = {}
  item.itemName = ($(this).closest('tr').find('.myItem').text());
  $.post('trading/notForTrade', item)
  .done(function(changedTradeStatus) {
    console.log('changed trade status ', changedTradeStatus)
  })
  .fail(function(err) {
    console.error(err);
  })
}

function removeItem(){
  var $toRemove = $(this).closest('tr');
  var itemName = $toRemove.find('.myItem').text();
  $.post('/trading/removeItem', {itemName: itemName})
  .done(function(data){
    console.log('remove item ', data);
    $toRemove.remove();
  })
}

function tradeInit() {
  var data = {};
  data.requestedItem = $('.request:checked').closest('tr').find('.publicItemName').text();
  data.respondingUser = $('.request:checked').closest('tr').find('.publicItemOwner').text();
  data.offeredItem = $('.offer:checked').closest('tr').find('.myItem').text();
  console.log('pre post data ', data);
  $.post('/trading/newTrade', data)
  .done(function(tradeComplete){
    console.log('trade init ', tradeComplete);

    var $cancel = $('<div>').addClass('btn btn-responsive btn-info cancelTrade').attr('id', tradeComplete._id).text('Cancel');
    var $row = $('<div>').addClass('row').append($cancel);
    var $btnContainer = $('<div>').addClass('btnContainer').append($row);

    var offer = `${tradeComplete.requestingUser.username} wants to offer ${tradeComplete.responseItem.itemName} for ${tradeComplete.respondingUser.username}'s ${tradeComplete.requestedItem.itemName}.`
    var $pendingString = $('<div>').addClass('pendingString col-md-9').text(offer);

    var $tradeRow = $('<div>').addClass('trade row').append($pendingString, $btnContainer);
    $('#pendings').append($tradeRow);

    $('#offerConfirmationModal').modal('show');
    setTimeout(function() {
      $('#offerConfirmationModal').modal('hide')
    }, 1000)
  })
  .fail(function(err){
    console.error('err? ', err);
  })
};



setInterval(() => {
  if ($('.request:checked')[0] && $('.offer:checked')[0]){
    $('#trade').prop('disabled', false)
  } else {$('#trade').prop('disabled', true)}
}, 500)