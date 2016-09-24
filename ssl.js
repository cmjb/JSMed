var tls = require('tls'),
	fs = require('fs'),
	sys = require('sys'),
	options = {
		key: fs.readFileSync('server-key.key'),
		cert: fs.readFileSync('server-cert.pem'),
		requestCert: true,
		//ca: [ fs.readFileSync('client-cert.pem')]
	};

//var mongo = require('./mongo');
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
				//populateDate();
			}
		});
		db.collection('quotes', {strict:true}, function(err, collection) {
			if (err)
			{
				console.log("[MONGO] 'quotes' Collection incomplete. Resetting...");
				//populateQuotes();
			}
		});
	}
})

function date() 
{
	db.collection('curdate', function(err, collection) {
		collection.find().toArray(function(err, items) {
			console.log(items);
			console.log(JSON.stringify(items));
			datestr = JSON.stringify(items);
			return items;
		})
	})
}

function quotes() {
		var documentJSON;
		db.collection('quotes', function(err, collection) {
			collection.find().toArray(function(err, items) {
				if(err) {
					console.log( 'errror');
				}else{
				documentJSON = items;
				console.log(documentJSON);
				console.log(JSON.stringify(documentJSON));
				var njs = JSON.stringify(documentJSON);
				console.log("--" + njs);
				quotestr = njs;
				return njs;
				//for( var i = 0; i<documentJSON.length(); i++) {
				//	console.log(documentJSON[i]);
				//}
				}
			})
		})

	
}

setTimeout(function() {console.log('wjs' + quotes())}, 5000);
setTimeout(function() {console.log('sjs' + date())}, 5000); 

sys.puts("TLS server started.");

var quotestr;
var datestr;
quotes();
date();

var server = tls.createServer(options, function(socket) {
	socket.setEncoding("utf8");
	sys.puts("TLS Connection established.");
	socket.addListener("data", function(data) {
		sys.puts("Data received: " + data);	
		if(data.toString() == "JSON") {
			sys.puts("Sending data...");
			date();
			//var js = '{"date": "11270"}';
			socket.write(datestr+ '\n');
		        socket.write("DateSent\n");
			//socket.end();
		} else if(data.toString() == "QUOTES")
		{
			sys.puts("mongo accessed");
			quotes();
			sys.puts('njs: ' + quotestr);
			socket.write(quotestr + '\n');
			
		}
	});

	socket.addListener("connect", function() {
		sys.puts("Client connected.");
	});

	socket.addListener("end", function() {
		sys.puts("Connection dead.")
	})
})

server.listen(8000, function () {
	console.log('TLS server bound.')
})
