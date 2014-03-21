//var fs = require('fs');
var path = require('path')
var DirReader = require( 'DirReader' );

module.exports = {
	'/': index,
	'/user': user,
	'/File/Dir':  {
		get: readdir,
		post: updatedir
	},
}

function index (req, res) {
	res.render('index', { title: 'Under Construction.'});
};

function user (req, res) {
	res.send("respond with a resource");
};

function updatedir(req, res) {

	res.end('POST Method');
};

function readdir (req, res) {
	var DirList =  {};
	var DirListIndex = 0;
	console.log( req.method );
	//console.log( DirList[DirListIndex] );
	//console.log( DirList[DirListIndex]['type'] );
	DirReader.RetrieveDirSync( './public/share', function( err, DirPath, stats, ifDir ){
	//DirReader.RetrieveDir( './public/share', function( err, DirPath, stats, ifDir ){
	//DirReader.ReadDir( './public/share', function( err, DirPath, stats, ifDir ){

		if( err ){
			console.log( '[ ERROR ]', err );
		}
		else {
			//DirList[DirListIndex]['type'] = ( ifDir ? 'DIRECTORY' : 'FILE' );
			//console.log( '[ ifDir ]', ifDir );
			//console.log( '[ DirPath ]', DirPath );
			DirList[DirListIndex] = {
				"type": ( ifDir ? 'Directory' : 'File' ),
				"path": path.normalize(DirPath)
			};
			/* set all the properties with anonymous function
			DirList = new function () {
				this[DirListIndex] = {
					"type": ifDir,
					"path": DirPath
				};
			};
			*/
			//console.log( '[' + DirList[DirListIndex]['type'] + '] ' + DirList[DirListIndex]['path'] + '\n');
			DirListIndex += 1;
		}
	}, function(){
		console.log( DirList );
		res.send(DirList);
	});

	//console.log( DirList );
	//res.send("The directory reading is not finished!");
};