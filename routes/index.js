var path = require('path');
var DirReader = require( 'DirReader' );
var ROOTFOLDER = './public/share';
var ASSIGNEDPATH = '/';

module.exports = {
	'/': index,
	'/user': user,
	'/File/Dir/*': readdir,
	'/File/Dir': readdir
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

    if (req.params.ROOT)
    {
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        ASSIGNEDPATH = '/' + req.params[0];
    } 
	DirReader.ReadDir( ROOTFOLDER,  ASSIGNEDPATH, function( err, DirPath, stats, ifDir ){

		if( err ){
			console.log( '[ ERROR ]', err );
		}
		else {
			DirList[DirListIndex] = {
				"type": ( ifDir ? 'Directory' : 'File' ),
				"path": path.normalize(DirPath)
			};

			DirListIndex += 1;
		}
	}, function(){
		res.send(DirList);
	});

};