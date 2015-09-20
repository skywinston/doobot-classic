console.log("DooBot all up in the client!");

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';


$(document).ready(function() {
  $.ajax({
    url: '/current_user',
    method: 'get',
    success: function(data){
      console.log("Logging the data clientside:", data);
      var userId = data.user._id;
      $('.FAB').click(function(){
        var viewportHeight = window.innerHeight;
        var listForm = document.createElement('form');
        var listTitle = document.createElement('input');
        var saveList = document.createElement('input');
        var user = document.createElement('input');
        $('.FAB').unbind('click');

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


    // $(saveList).addClass('save-FAB animated slideInUp').on('click', function(){
    //   var listName = $(listTitle).val();
    //   $.ajax({
    //     url: '/current_user',
    //     success: function(data){
    //       var userId = data.user._id;
    //       $.ajax({
    //         url: '/lists',
    //         data: {
    //           userId : userId,
    //           listName : listName
    //         },
    //         success: function(data){
    //           $(listTitle).html('');
    //           $('.list-chip').removeClass('new-mode').addClass('show-mode');
    //         },
    //         error: function(data){
    //           console.log("Error:", data);
    //         },
    //         method: 'POST'
    //       });
    //     },
    //     error: function(data){
    //       console.log("ERROR: ", data);
    //     }
    //
    //   });
    // });
  });
});
