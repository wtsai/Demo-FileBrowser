var fs = require('fs');
var path = require('path');
var DirReader = require( 'DirReader' );
var ROOTFOLDER = './public/share';
var TXTFOLDER = '/File/Txt/';

module.exports = {
	'/': index,
	'/user': user,
	'/File/Txt/*': readtxt,
	'/File/Dir/*': readdir,
	'/File/Dir': readdir
}
/*
module.exports = {
	'/': index,
	'/user': user,
	'/File/Dir': readdir,
	'/File/Dir/*': readdir,
	'/File/Dir/:ROOT': readdir,
	'/File/Dir/:ROOT/*': readdir
}
*/

function index (req, res) {
	res.render('index', { title: 'Under Construction.'});
};

function user (req, res) {
	res.send("respond with a resource");
    //res.sendfile('hello.html'); //http://www.hacksparrow.com/how-to-server-static-html-files-in-express-js.html
};

function updatedir(req, res) {
	res.end('POST Method');
};

function readtxt(req, res) {
    var ASSIGNEDPATH = '';
    if (req.params.ROOT)
    {
        console.log( '[readtxt][ req.params.ROOT ]: ' + req.params.ROOT );
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        console.log( '[readtxt][ req.params[0] ]: ' + req.params[0] );
        //ASSIGNEDPATH = '/' + req.params[0];
        ASSIGNEDPATH = req.params[0];
    } 
	console.log( '[readtxt]req.params[0]: ' + req.params[0]);
	console.log( '[readtxt]ASSIGNEDPATH: ' + ASSIGNEDPATH);
	console.log( '[readtxt]ROOTFOLDER:' + ROOTFOLDER );
    fs.readFile(ROOTFOLDER + '/' + ASSIGNEDPATH, 'utf8', function (err, data) {
        if (err) 
            throw err;
        console.log('txt: ' + data);
        return res.json({ 
            txt : data.toString()
        });
    });
};

function readdir (req, res) {
	var DirList =  {};
	var DirListIndex = 0;
    var ASSIGNEDPATH = '';

    if (req.params.ROOT)
    {
        //console.log( '[ req.params.ROOT ]: ' + req.params.ROOT );
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        //console.log( '[ req.params[0] ]: ' + req.params[0] );
        //ASSIGNEDPATH = '/' + req.params[0];
        ASSIGNEDPATH = req.params[0];
    } 
	console.log( '[readdir]req.params[0]: ' + req.params[0]);
	console.log( '[readdir]ASSIGNEDPATH: ' + ASSIGNEDPATH);
	console.log( '[readdir]ROOTFOLDER:' + ROOTFOLDER );
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
        // Initail ASSIGNEDPATH and req.params[0] to ''
        req.params[0] = '';
        ASSIGNEDPATH = '';
	}, function(){
		//console.log( DirList );
		res.send(DirList);
	});

	//console.log( DirList );
	//res.send("The directory reading is not finished!");
};
