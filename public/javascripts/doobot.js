console.log("DooBot all up in the client!");

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(document).ready(function() {
  var user;
  $.ajax({
    url: '/current_user',
    method: 'get',
    success: function(data){
      console.log("Logging the data clientside:", data);
      user = data;
      var userId = data.user._id;
      $('#first-list').click(function(){
        var viewportHeight = window.innerHeight;
        var listForm = document.createElement('form');
        var listTitle = document.createElement('input');
        var saveList = document.createElement('input');
        var user = document.createElement('input');
        $('#first-list').unbind('click');

        $(listForm).addClass('list-form').attr({
          action: '/lists',
          method: 'post'
        });

        $(listTitle).addClass('list-chip new-mode animated slideInUp').attr({
          type: "text",
          placeholder: "Reasons why DooBot is great...",
          name: "listTitle"
        });

        $(saveList).attr({
          type: 'submit',
          value: ''
        }).addClass('save-FAB animated slideInUp');

        $(user).attr({
          type: 'hidden',
          value: userId,
          name: 'userId'
        });

        $('body').append(listForm);
        $(listForm).append(listTitle, saveList, user);
      });
    },
    error: function(data){
      console.log("ERROR: ", data);
    }
  });

  $('.list-bg').css({
    height: window.innerHeight - 192 + 'px'
  });

  // if($('#add-item')){
  //   $('#add-item').click(function(){
  //     var newItemContainer = document.createElement('div');
  //     var newItem = document.createElement('div');
  //   });
  // }

  $('#new-list').click(function(){
    var modal = document.createElement('div');
    var listChip = document.createElement('input');
    $(modal).addClass('new-list modal animated slideInUp').append(listChip);
    $('body').append(modal);
  });

  // User clicks FAB in items index view
  $('#add-item').click(function(){
    //Remove the 'add a list item' hint
    $('.no-items').removeClass('animated slideInLeft').addClass('animated fadeOutDown');
    // Create the new item form elements
    var form = document.createElement('form');
    $(form).attr({
      action : '/items',
      method : 'post',
      id : 'new-item',
      class : ''
    });
    var inputItemTitle = document.createElement('input');
    $(inputItemTitle).attr({
      console.log(this);
    });
  });
});
