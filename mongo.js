var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('Quotes', server, {safe:false});

db.open(function(err, db)
{
	if(!err)
	{
		console.log("Database connection esthablished.");
		db.collection('curdate', {strict:true}, function(err, collection) {
			if (err)
			{
				console.log("[MONGO] 'date' Collection incomplete. Resetting...");
				populateDate();
			}
		})
		db.collection('quotes', {strict:true}, function(err, collection) {
			if (err)
			{
				console.log("[MONGO] 'quotes' Collection incomplete. Resetting...");
				populateQuotes();
			}
		});
	}
})

exports.date = function()
{
	db.collection('curdate', function(err, collection) {
		collection.find().toArray(function(err, items) {
			console.log(JSON.stringify(items));
			return JSON.stringify(items);
		})
	})
}


exports.quotes = function(req, res) {

		var documentJSON;
		db.collection('quotes', function(err, collection) {
			collection.find().toArray(function(err, items) {
				documentJSON = JSON.stringify(items);
				console.log(documentJSON.toString());
				console.log(items);
				return documentJSON;
			})
		})
}


var populateQuotes = function()
{
	var quotes = [ {
		quote: "This is a quote"
	},
	{
		quote: "This is another quote"
	}
	];

	db.collection('quotes', function (err, collection) {
		collection.insert(quotes, {safe:true}, function(err, result) {});
	})
};

var populateDate = function()
{
	var date = [ {
		type: "current",
		date: new Date()
	} ];

	db.collection('curdate', function (err, collection) {
		collection.insert(date, {safe:true}, function(err, result) {});
	})
};
