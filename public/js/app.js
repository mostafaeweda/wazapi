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
            + $('#query_text').val());
  }
};

$(document).ready(function() {
  app.init();
});