/* Create by .\node_modules\.bin\express FileBrowser */
/**
 * Module dependencies.
 */

var express = require('express');
var Courser = require('courser');
//var config = require('node-conf').load(process.env.NODE_ENV || 'development');
var http = require('http');
var path = require('path');

var app = express();

// Environment Settings
if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/* Check database settings
if (!config.database) {
	console.log('No database settings in config file');
	return;
}
*/

// Initializing Routes
var courser = new Courser(app);
courser.addPath(__dirname + '/routes');
courser.init(function() {
		http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
});
