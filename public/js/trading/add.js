'use strict';

$(document).ready(init);

function init() {
  $('#add').on('click', openAddModal);
  $('#saveNewItem').on('click', saveNewItem);
}

function openAddModal() {
  console.log('add modal clicked')
  $('#addModal').modal('show');
}

function saveNewItem() {
  var item = {};
  item.name = $('#itemName').val(); 
  // itemInfo.item.description = $('#itemDescription').val(); 
  console.log(item);
  if (item.name === '') {
    $('.message').hide();
    $('#emptyFormWarn').show();
  } else {
    $('input').val('');
    $('.message').hide();
    $.post('trading/addItem', item)
    .done(function(savedItem) {
      console.log('new item saved ', savedItem);

      var $tr = $('<tr>')

      var $myItem = $('<div>').addClass('myItem').text(savedItem.itemName);
      var $item = $('<div>').addClass('item').append($myItem);
      var $itemTd = $('<td>').append($item);

      var $trash = $('<i>').addClass('fa fa-trash fa-md deleteItem');
      var $trashTd = $('<td>').append($trash);

      var $offer = $('<input>').addClass('offer').attr('type', 'radio').attr('name', 'offer');
      var $offerTd = $('<td>').append($offer);

      var $forTrade = $('<input>').addClass('forTrade').attr('type', 'checkbox').attr('checked', 'true');
      var $forTradeTd = $('<td>').append($forTrade);

      $tr.append($itemTd, $forTradeTd, $offerTd, $trashTd);
      $('#myItemsTable').prepend($tr);

      $('#addModal').modal('hide');
    })
    .fail(function(err) {
      console.error(err);
      $('#emptyFormWarn').show();
    })
  }
}






