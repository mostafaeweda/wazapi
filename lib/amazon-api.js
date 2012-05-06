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
	    'ResponseGroup': 'ItemAttributes,Offers'
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
			var bdet = new Book();
			//ugly code to get attributes from amazon results to
			//book details objects
			bdet.details.ASIN = temp.ASIN;
			bdet.author = temp.ItemAttributes.Author;
			bdet.ISBN = temp.ItemAttributes.ISBN;
			bdet.details.Label = temp.ItemAttributes.Label;
			bdet.details.NumberOfItems = temp.ItemAttributes.NumberOfItems;
			bdet.details.NumberOfPages = temp.ItemAttributes.NumberOfPages;
			bdet.publishDate = temp.ItemAttributes.PublicationDate;
			bdet.publisher = temp.ItemAttributes.Publisher;
			bdet.title = temp.ItemAttributes.Title;
			bdet.price.marketPrice = temp.OfferSummary.LowestNewPrice.Amount / 100;
			result.push(bdet);
		}
		callback(err, result);
	});
};