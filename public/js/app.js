var app = {
  init: function() {
    var _self = this;
    $('#general_filter').change(function (e) {
      _self.loadTag(null, this.value);
    });
  },

  load: function (path) {
    $('#shelf_box').load(path);
  },

  loadTag: function (tagId, filter) { 
    $('#shelf_box').load('/books/tags/' + (tagId || '')
        + '?filter=' + (filter || $('#general_filter').val()));
  },

  loadSearch: function () {
  	$('#shelf_box').load('/books/search/'
        + '?filter='+$('#product_criteria').val()+'&q=' 
            + encodeURIComponent($('#query_text').val()));
  },

  loadBooks: function (userID, booksType) {
  	$('#content').load('/users/'+userID+'/'+booksType);
  },

  changeAvailability: function(instanceId) {
    
  	$.ajax({
	  url: "/books/change_availability/" + instanceId,
	  type: "POST",
	  success: function(res) {
	  	$('#' + instanceId).html(res);
      $('#' + instanceId).toggle("slow", function() {
        $('#' + instanceId).toggle("slow");
      });
	  }
	});	
  },

  // called from the index page to rent 
  // any instance from the book with id = bookId
  rentPopup: function (bookId, instanceId) {
    $.fancybox.showActivity();
    $.ajax({
      url   : "/books/popup/" + bookId,
      success: function(data) {
      	$.fancybox(data);

        $("#rental_form").bind("submit", function() {
          $.ajax({
            type    : "POST",
            cache   : false,
            url     : "/books/rent/" + bookId + (instanceId ? ("/" + instanceId) : ""),
            data    : $(this).serializeArray(),
            success: function(data) {
              alert('OK');
            }
          });
          return false;
        });

      }
    });
  },

  rentRequest: function () {
    $('#rental_form').submit();
  }
};

$(document).ready(function() {
  app.init();
});