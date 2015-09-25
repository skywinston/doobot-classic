console.log("DooBot all up in the client!");

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

function createFirstList(){
  console.log("createFirstList()");
  $('body').attr('data-app-state', 'onboarding');
  $.ajax({
    url : '/lists/first',
    method : 'get',
    success : function(data){
      console.log(data);
      $('.instructions').addClass('animated fadeOutUp').html('Now give your list a name')
        .removeClass('fadeOutUp').addClass('fadeInUp');
      $(data).appendTo('body');
      $('.edit-title').focus().keydown(function(e){
        if (e.which === 13) { saveList() };
      });
      $('.save-FAB').click(saveList);
    },
    error : function(err){
      console.log("Error from /lists/first:", err);
    }
  });
}

function createList(){
  console.log('createList()');
  $.ajax({
    url : 'lists/new',
    method : 'get',
    success : function(data){
      $(data).appendTo('.list-index');
      $('.edit-title').focus().keydown(function(e){
        if (e.which === 13) { saveList() };
      });
      $('.save-list-icon').click(saveList);
    },
    error : function(err){
      console.log("Error from server:", err);
    }
  });
}

function saveList(){
  console.log('saveList()');
  var listTitle = $('.edit-title').val();
  $.ajax({
    url : '/lists',
    method : 'post',
    data : {
      listTitle : listTitle
    },
    success : function(data){
      if ( $('body').attr('data-app-state') === 'onboarding' ) {
        $('.edit-title').click(showList).attr('data-list-id', data._id);
        $('.edit-title').trigger('click');
      }

      $('.save-list-icon').addClass('animated fadeDownOut').remove();
      $('.edit-mode').attr({
        'data-list-id' : data._id
      }).removeClass('edit-mode').click(showList);
      $('.edit-title').attr('readonly', true).blur();
    },
    error : function(err){
      console.log("Error from server:", err);
    }
  });
}

function editList(){
  console.log('editList()');
  $('.list-title').removeAttr('readonly').focus().select().blur(updateList).keydown(function(e){
    if ( e.which === 13 ) { $('.list-title').trigger('blur') }
  });
}

function updateList(){
  console.log('updateList()');
  var listId = $('.list-title').attr('data-list-id');
  var listTitle = $('.list-title').val();
  $('.list-title').attr('readonly', 'readonly').unbind('blur');
  $.ajax({
    url : '/lists/update',
    method : 'post',
    data : {
      listId : listId,
      listTitle : listTitle
    },
    success : function(data){
      console.log("Datafrom post to /lists/update:", data);
    },
    error : function(err){
      console.log("Error from post to /lists/update:", err);
    }
  });
}

function deleteList(){
  console.log('deleteList()');
  $.ajax({
    url : '/lists/delete',
    method : 'get',
    success : function(html){
      $(html).prependTo('body');
    },
    error : function(err){
      console.log("Error from GET to /lists/delete", err);
    }
  });
}

function cancelDeleteList(){
  console.log('cancelDeleteList()');
  $('.delete-sheet').removeClass('animated fadeInUp').addClass('animated fadeOutDown');
  $('.opacity-mask').removeClass('animated fadeIn').addClass('animated fadeOut').one(animationEnd, function(){
    $('.opacity-mask').remove();
  });
}

function confirmDeleteList(){
  console.log('confirmDeleteList()');
  var listId = $('.list-title').attr('data-list-id');
  $.ajax({
    url : '/lists/delete',
    method : 'post',
    data : {
      listId : listId
    },
    success : function(confirmation){
      $('.delete-sheet').removeClass('animated fadeInUp').addClass('animated fadeOutDown');
      $('.opacity-mask').removeClass('animated fadeIn')
        .addClass('animated fadeOut')
        .one(animationEnd, function(){
          $('.opacity-mask').remove();
          $('.all-lists').trigger('click');
        });
    },
    error : function(err){
      console.log("Error from POST to /lists/delete:", err);
    }
  });
}

function showList(){
  console.log('showList()');
  function makeBackButton(){
    console.log('makeBackButton');
    var button = document.createElement('button');
    var icon = document.createElement('i');
    var label = document.createElement('p');
    $(button).attr({
      onclick : "backToAllLists()",
      class : 'all-lists animated fadeInDown',
    });

    $(icon).attr({
      class : 'material-icons'
    }).html(
        "keyboard_arrow_down"
    );

    $(label).html('Back to all items');

    $(button).append(icon, label).prependTo('.appnav')
  }
  var listId = $(this).attr('data-list-id');

  $('.list-chip').addClass('animated fadeOutDown').one(animationEnd, function(){
    $(this).remove();
  });
  $.ajax({
    url : '/lists/' + listId,
    method : 'get',
    success : function(data){
      console.log("Logging data in ShowList AJAX success callback", data);
      var html = data;
      var listBgHeight = window.innerHeight - 192;
      if( $('body').attr('data-app-state') === 'onboarding'){
        $('#welcome-to-doobot').remove();
        $('#welcome-instructions').remove();
        $('body').removeAttr('data-app-state');
      }
      $('.list-index').remove();
      $(data).appendTo('body');
      $('.list-bg').css('height', listBgHeight + 'px');
      $('#robby').attr({
        class : 'FAB item-mode',
        onclick : 'newListItem()'
      });
      makeBackButton();
    },
    error : function(err){
      console.log(err);
    }
  });
}

function backToAllLists(){
  console.log("backToAllLists");
  $('.flex-row').removeClass('animated slideInUp enter')
    .addClass('animated fadeOutDown exit')
    .one(animationEnd, function(){
      $('.flex-row').remove();
    });
  $('.list-bg').removeClass('animated fadeInUp')
    .addClass('animated fadeOutDown')
    .one(animationEnd, function(){
      $('.list-bg').remove();
    });
  $('.all-lists').removeClass('animated fadeInDown')
    .addClass('animated fadeOutUp')
    .one(animationEnd, function(){
      $('.all-lists').remove();
    });
  $('#robby').attr({
    onclick : 'createList()',
    class : 'FAB'
  });
  showAllLists();
}

function showAllLists(){
  console.log('showAllLists');
  $.ajax({
    url : '/lists',
    method : 'get',
    success : function(data){
      console.log($('.FAB').hasClass('item-mode'));
      $('body').append(data);
      $('.list-chip').addClass('animated fadeInUp').click(showList);
    },
    error : function(err){
      console.log("Error from server:", err);
    }
  });
}

function newListItem(){
    //bound to FAB click event while in item index view.
    console.log('newListItem()');

    // GET a new Item from the DB

    // Render the new Item block and send to AJAX request
}



$(document).ready(function() {

  $('.list-chip').click(showList);

  $('.list-bg').css({
    height: window.innerHeight - 192 + 'px'
  });

});
