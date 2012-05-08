var OperationHelper = require('apac').OperationHelper;

var app = require('../app');
var Asyncjs = require('asyncjs');
var amazonConf = app.config.external.amazon;
var Book = app.Schema.Book;

var opHelper = new OperationHelper({
  awsId:     amazonConf.awsId,
  awsSecret: amazonConf.awsSecret,
  assocId:   amazonConf.assocId,
});

/**
 * search books on Amazon.
 * inputs:
 * 	keyword --> represents a keyword to search on or isbn or asin.
  * page --> the page to get. start with 1
 * 	callback --> a function that takes 2 params: error and results where
 *							results are array of Books.
**/
exports.searchBooks = function(keyword, page, callback) {
	opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': keyword,
    'itemPage': page,
    'Availability': 'Available',
    'ResponseGroup': 'ItemAttributes,Offers'
	}, function(error, results) {
		var bookResults = [];
		var items = results.Items.Item;
		var parseItem = function(item) {
				var attr = item.ItemAttributes;
				var bdet = new Book();

				bdet.details.ASIN = item.ASIN;
				bdet.author = attr.Author;
				bdet.ISBN = attr.ISBN;
				bdet.details.label = attr.Label;
				bdet.details.numberOfItems = attr.NumberOfItems;
				bdet.details.numberOfPages = attr.NumberOfPages;
				bdet.publishDate = attr.PublicationDate;
				bdet.publisher = attr.Publisher;
				bdet.title = attr.Title;
				bdet.price.marketPrice = item.OfferSummary.LowestNewPrice.Amount / 100;
				return bdet;
		}
		if (items instanceof Array) {
			for (var i = 0, n = items.length; i < n; i++) {
				bookResults.push(parseItem(items[i]));
			}
		} else {
				bookResults.push(parseItem(items));
		}
		callback(error, bookResults);
		
	});
};

/**
 * get reviews iFrame URL from Amazon for a given book.
 * inputs:
 * 	isbn --> represents isbn of the book.
 * 	callback --> a function that takes 2 params: error and result where
 *							results is the iFrameURL.
 * NOTE: the reviews URL wasn't saved with the book in the database as
 * it expires in 24 hours and needs to be updated every 24 hours.
**/
exports.getReviewsURL = function(isbn, callback) {
	opHelper.execute('ItemLookup', {
    'SearchIndex': 'Books',
    'ItemId'  : isbn,
    'IdType'  : 'ISBN',
    'ResponseGroup': 'Reviews'
	}, function(error, results) {
		callback(error, results.Items.Item.CustomerReviews.IFrameURL);
	});	
};