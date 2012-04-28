var app = require('../app');

var per_page = app.config.per_page;

var Book = app.Schema.Book;
var Tag = app.Schema.Tag;
 
/*
 * Search books with the specified tag or filter
 */
exports.search = function(req, res, next) {
    var tagId = req.params.tagId;
    var page = Number(req.query.p) || 0;

    var filter = req.query.filter || 'most_rented';

    var query;
    if (! tagId)
        query = Book.find();
    else
        query = Book.find({tags: tagId});

    query.skip(page * per_page).limit(per_page);

    switch (filter) {
        case 'most_rented':
            query.sort('rentalHits', -1).find(displayRes);
        break;

        case 'newest':
            query.sort('createdDate', -1).find(displayRes);
        break;

        default:
            return next(new Error('Filter can\'t be applied'));
        break;
    }

    function displayRes(err, result) {
        if (err) return next(err);

        res.render('books/search', {
            result: result
        });
    }
};