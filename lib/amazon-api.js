var OperationHelper = require('apac').OperationHelper;

var app = require('../app');
var async = require('asyncjs');
var amazonConf = app.config.external.amazon;
var BookDetails = app.Schema.BookDetails;

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
			var bdet = new BookDetails();
			//ugly code to get attributes from amazon results to
			//book details objects
			bdet.ASIN = temp.ASIN;
			bdet.Author = temp.ItemAttributes.Author;
			bdet.ISBN = temp.ItemAttributes.ISBN;
			bdet.Label = temp.ItemAttributes.Label;
			bdet.NumberOfItems = temp.ItemAttributes.NumberOfItems;
			bdet.NumberOfPages = temp.ItemAttributes.NumberOfPages;
			bdet.PublishedDate = temp.ItemAttributes.PublishedDate;
			bdet.Publisher = temp.ItemAttributes.Publisher;
			bdet.Title = temp.ItemAttributes.Title;
			bdet.Price = temp.OfferSummary.LowestNewPrice.FormattedPrice;
			result.push(bdet);
		}
		callback(err, result);
	});
};