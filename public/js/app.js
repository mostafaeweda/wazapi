var app = {
  load: function (id, path) {
    $('#'+id).load(path);
  },
  loadTag: function (id, tagId) { 
    $('#'+id).load('/books/tags/' + tagId
        + '?filter=' + $('general_filter').val());
  }
};