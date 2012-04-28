var app = require('../app');

var per_page = app.config.per_page;

var Book = app.Schema.Book;
var Tag = app.Schema.Tag;

/*
 * Search books with the specified tag
 */
exports.search = function(req, res, next) {
    var tagId = req.params.tagId;
    var filter = req.query.filter || 'most_rented';
    if (! tagId) return next("Search tag not provided");
    switch (filter) {
        case 'most_rented':
        Book.find({tags: tagId}).sort('rentalHits', -1)
            .limit(per_page).find(displayRes);
        break;

        case 'newest':
        Book.find({tags: tagId}).sort('createdDate', -1)
            .limit(per_page).find(displayRes);
        break;

        default:
            displayRes(new Error('Filter can\'t be applied'));
        break;
    }
    function displayRes(err, result) {
        if (err) return next(err);

        res.render('books/search', {

            result: result
        });
    }
    
};