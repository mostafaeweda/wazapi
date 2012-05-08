var OperationHelper = require('apac').OperationHelper;

var app = require('../app');
var async = require('asyncjs');
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
 * 	callback --> a function that takes 2 params: error and results where
 *							results are array of Books.
**/
exports.searchBooks = function(keyword, callback) {
	var arr = [];
	//get the results in the first 10 pages from amazon search
	//That's because amazon api don't support to get results for more than
	//10 pages.
	async.range(1,6, 1).map(function(item, next){
		opHelper.execute('ItemSearch', {
	    'SearchIndex': 'Books',
	    'Keywords': keyword,
	    'itemPage': item,
	    'Availability': 'Available',
	    'ResponseGroup': 'ItemAttributes,Offers,Reviews'
		}, function(error, results) {
			arr = arr.concat(results.Items.Item);
			if (item < results.Items.TotalPages)
	  		next(null, item+1);
	  	else
	  		next(async.STOP);
		});
	}).toArray(function (err, values){
		var result = [];
		for (var i = 0, n = arr.length; i < n; i++) {
			var temp = arr[i];
			var attr = temp.ItemAttributes;
			var bdet = new Book();
			//ugly code to get attributes from amazon results to
			//book details objects
			bdet.details.ASIN = temp.ASIN;
			bdet.author = attr.Author;
			bdet.ISBN = attr.ISBN;
			bdet.details.label = attr.Label;
			bdet.details.numberOfItems = attr.NumberOfItems;
			bdet.details.numberOfPages = attr.NumberOfPages;
			bdet.publishDate = attr.PublicationDate;
			bdet.publisher = attr.Publisher;
			bdet.title = attr.Title;
			bdet.price.marketPrice = temp.OfferSummary.LowestNewPrice.Amount / 100;
			result.push(bdet);
		}
		callback(err, result);
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