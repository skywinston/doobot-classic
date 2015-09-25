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

  // create a new List from the DB

  // Render the list/new jade block with info from db passed in & send to AJAX

  // Inject into DOM with state changes
}

function saveList(){
  console.log('saveList()');
  var listTitle = $('.edit-title').val();
  $.ajax({
    url : '/lists/update',
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
  console.log("I am going to give you a form to edit your list.");
  $('.list-title').removeAttr('readonly').focus().select().on('blur keydown', updateList);
}

function updateList(){
  console.log('updateList()');
  console.log('Going to update that list in the DB now...');
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

function newListItem(){
    //bound to FAB click event while in item index view.
    console.log('newListItem()');

    // GET a new Item from the DB

    // Render the new Item block and send to AJAX request
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

$(document).ready(function() {

  $('.list-chip').click(showList);

  $('.list-bg').css({
    height: window.innerHeight - 192 + 'px'
  });

});
