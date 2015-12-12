'use strict';

$(document).ready(init);

function init() {
  $('#pending').on('click', openPendingModal);
  $('#pendingModal').on('click', '.acceptTrade', acceptTrade);
  $('#pendingModal').on('click', '.declineTrade', cancelTrade);
  $('#pendingModal').on('click', '.cancelTrade', cancelTrade);
}

function openPendingModal() {
  console.log('pending clicked');
  $('#pendingModal').modal('show');
}

function cancelTrade(){
  var $removeRow = $(this).closest('.trade');
  var data = {_id: $(this).attr('id')}
  $.ajax({
    type: "POST",
    url: '/trading/deleteTrade',
    data: data
  })
  .done(function(data){
    $removeRow.remove()
    console.log('cancel trade ', data);
  })
}



function acceptTrade(){
  var $removeRow = $(this).closest('.trade');
  var id = ($(this).attr('id'));
  var data = {_id: id};
  $.post('/trading/makeTrade', data)
  .done(function(data){
    $removeRow.remove()
    // $(`*[data-user='${data[0]._id}']`).remove()
    // $(`*[data-user='${data[1]._id}']`).remove()
    $(`#${data[0]._id}`).remove();
    $(`#${data[1]._id}`).remove();
    console.log('pub item name ', data[0]._id);
    console.log('pub item owner ', data[1]._id);

    var $myItemsTr = $('#myItemsTemplate').clone();
    $myItemsTr.removeAttr('id');
    $myItemsTr.find('.myItem').text(data[1].itemName);
    $myItemsTr.prependTo('#myItemsTable');

    var $publicItemsTr = $('#publicItemsTemplate').clone();
    $publicItemsTr.removeAttr('id');
    $publicItemsTr.find('.publicItemName').text(data[0].itemName);
    $publicItemsTr.find('.publicItemOwner').text(data[1].owner.username);
    $publicItemsTr.prependTo('#publicItemsTable');




    $('#pendingModal').modal('hide');
  })
}








