var app = {
  init: function() {
    var _self = this;
    $('#filter_newest').click(function (e) {
      _self.loadTag(null, 'newest');
    });
    $('#filter_most_rented').click(function (e) {
      _self.loadTag(null, 'most_rented');
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

  rentPopup: function (bookId) {
    $.fancybox.showActivity();
    $.ajax({
      url   : "/books/popup/" + bookId,
      success: function(data) {
        $.fancybox(data);

        $("#rental_form").bind("submit", function() {
          $.ajax({
            type    : "POST",
            cache   : false,
            url     : "/books/rent/" + bookId,
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