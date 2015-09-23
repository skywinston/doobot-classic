console.log("DooBot all up in the client!");

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

function createFirstList(){
  var user;
  $.ajax({
    url: '/current_user',
    method: 'get',
    success: function(data){
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
}

function createList(){
  $.ajax({
    url : 'lists/new',
    method : 'get',
    success : function(data){
      $(data).appendTo('.list-index');
      $('.edit-title').focus().keydown(function(e){
        if (e.which === 13) { updateList() };
      });
      $('.save-list-icon').click(updateList);
    },
    error : function(err){
      console.log("Error from server:", err);
    }
  });

  // create a new List from the DB

  // Render the list/new jade block with info from db passed in & send to AJAX

  // Inject into DOM with state changes
}

function editList(){
  console.log("I am going to give you a form to edit your list.");
}

function updateList(){
  var listTitle = $('.edit-title').val();
  $.ajax({
    url : '/lists/update',
    method : 'post',
    data : {
      listTitle : listTitle
    },
    success : function(data){
      console.log(data);
      var optionsIcon = document.createElement('i');
      $('.save-list-icon').addClass('animated fadeDownOut').remove();
      $(optionsIcon).addClass('material-icons list-options animated fadeDownIn').html('more_vert').appendTo('.edit-mode');
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

function showAllLists(){
  console.log('showAllLists');
  $.ajax({
    url : '/lists',
    method : 'get',
    success : function(data){
      $('.list-index').append(data);
      $('.list-chip').addClass('animated fadeInUp').click(showList);
      $('.FAB').addClass('swift-out').css({
        top : '24px'
      });
    },
    error : function(err){
      console.log("Error from server:", err);
    }
  });
}

function showList(){
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
    $('.list-chip').remove();
    $.ajax({
      url : '/lists/' + listId,
      method : 'get',
      success : function(data){
        var html = data;
        var listBgHeight = window.innerHeight - 192;
        $(data).css('height', listBgHeight + 'px').appendTo('body');
        $('#robby').css({
          top : '164px'
        }).unbind('click').click(newListItem);
        makeBackButton();
      },
      error : function(err){
        console.log(err);
      }
    });
  });
}

function newListItem(){
    //bound to FAB click event while in item index view.
    console.log("Make a new list item!");

    // GET a new Item from the DB

    // Render the new Item block and send to AJAX request
}

function backToAllLists(){
  console.log("backToAllLists");
  $('.list-title').removeClass('animated slideInUp enter')
    .addClass('animated fadeOutDown exit')
    .one(animationEnd, function(){
      $('.list-title').remove();
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
  $('#robby').unbind('click').click(createList);
  showAllLists();
}

$(document).ready(function() {

  $('#robby').click(createList);

  $('.list-chip').click(showList);

  $('.list-bg').css({
    height: window.innerHeight - 192 + 'px'
  });



  // //Uncomment this if AJAX + jade.compile doesn't pan out

  // With reload: User Clicks FAB in items index view...
  // $('#add-item').click(function(){
  //   $('.no-items').removeClass('animated slideInLeft').addClass('animated fadeOutDown');
  //   if( $('.list-item').length ){
  //     console.log('hit the if');
  //     $('.list-item').addClass('animated fadeOutDown').one(animationEnd, function(){
  //       window.location = '/items/new';
  //     });
  //   } else {
  //     console.log('hit the else');
  //
  //   }
  // });

  // var listTitle = $('#list-title-item-view');
  // if(listTitle){
  //   var fab = $('#add-item');
  //   $(listTitle).addClass('title-above-new-item');
  //   $(fab).addClass('rotateToCancelPos');
  // }

  // Attempt at AJAX with jade.compile for one-page sweet goodness.
  $('#add-item').click(function(){
    $('.no-items').removeClass('animated slideInLeft').addClass('animated fadeOutDown');
    $.ajax({
      url : '/ajaxreqs',
      method : 'get',
      success : function(data){
        debugger;
        console.log("This is the data sent from the server in response to AJAX req");
        console.log(data);
      },
      error : function(err){
        console.log(err);
      }
    });
  });


  // User clicks FAB in items index view
  // $('#add-item').click(function(){
  //   //Remove the 'add a list item' hint
  //   $('.no-items').removeClass('animated slideInLeft').addClass('animated fadeOutDown');
  //   // Create the new item form elements
  //   var form = document.createElement('form');
  //   $(form).attr({
  //     action : '/items',
  //     method : 'post',
  //     id : 'new-item',
  //     class : '',
  //     tabindex : 1
  //   });
  //   var divWrapperItem = document.createElement('div');
  //   var itemStatusBubble = document.createElement('div');
  //   $(itemStatusBubble).attr({
  //     class : 'item-status'
  //   }).click(function(){
  //     // What happens when someone marks an item as done...
  //   });
  //
  //   var inputItemTitle = document.createElement('input');
  //   $(inputItemTitle).attr({
  //     class : 'item-title',
  //     type : 'text',
  //     name : 'itemTitle',
  //     placeholder : 'Describe this item...'
  //   });
  //
  //   var saveList = document.createElement('input');
  //   $(saveList).attr({
  //     type: 'submit',
  //     value: ''
  //   }).addClass('save-FAB animated slideInUp');
  //
  //   var itemExtras  = document.createElement('div'); // needs to be moved under each item extra once written...
  //   $(itemExtras).addClass('item-extras');

  // });
});
