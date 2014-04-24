var fs = require('fs');
var url = require('url');
var path = require('path');
var DirReader = require( 'DirReader' );
var ROOTFOLDER = './public/share';
var TXTFOLDER = '/File/Txt/';

module.exports = {
	'/': index,
	'/user': user,
	'/File/Txt/*': readtxt,
	'/File/Media/*': readmedia,  
	'/File/Music/*': readmusic,  
	'/File/Video/*': readvideo,  
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

function readtxt(req, res) {
    var ASSIGNEDPATH = '';
    if (req.params.ROOT)
    {
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        ASSIGNEDPATH = req.params[0];
    } 
    fs.readFile(ROOTFOLDER + '/' + ASSIGNEDPATH, 'utf8', function (err, data) {
        if (err) 
            throw err;
        return res.json({ 
            txt : data.toString()
        });
    });
};

function readmedia(req, res) {
    var ASSIGNEDPATH = '';
    if (req.params.ROOT)
    {
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        ASSIGNEDPATH = req.params[0];
    } 

    var filepath = path.join(ROOTFOLDER, ASSIGNEDPATH);

    fs.exists(filepath, function(exists) {
        if (!exists) {
            //res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found\n');
            return;
        }

        fs.readFile(filepath, function(err, content) {
            //res.writeHead(200, {'Content-Type': 'text/plain'});
            if( err ){
                console.log( '[ ERROR ]', err );
            }
            else {
                res.end(content);
                /*  Error when playing Fashion_DivX720p_ASP.divx on Cubieboard.
                    terminate called after throwing an instance of 'std::bad_alloc'
                      what():  std::bad_alloc
                    Aborted
                */
            }
        });
    });
};

function readmusic(req, res) {
    var ASSIGNEDPATH = '';
    if (req.params.ROOT)
    {
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        ASSIGNEDPATH = req.params[0];
    } 
    
    var filepath = path.join(ROOTFOLDER, ASSIGNEDPATH);

    fs.exists(filepath, function(exists) {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found\n');
            return;
        }
        
        fs.readFile(filepath, function(err, content) {
            if( err ){
                console.log( '[ ERROR ]', err );
            }
            else {
                res.end(new Buffer(content));
            }
            
        });
    });
};

function readvideo(req, res) {
    var ASSIGNEDPATH = '';
    if (req.params.ROOT)
    {
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        ASSIGNEDPATH = req.params[0];
    } 
    var filename= url.parse( '..' + '/' + ROOTFOLDER + '/' + ASSIGNEDPATH).pathname;
    
    var filepath = path.join(__dirname, filename); 

    fs.exists(filepath, function(exists) {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found\n');
            return;
        }        

        var stream = fs.createReadStream(filepath); 
        stream.pipe(res);

    });
};

function readdir (req, res) {
	var DirList =  {};
	var DirListIndex = 0;
    var ASSIGNEDPATH = '';

    if (req.params.ROOT)
    {
        ROOTFOLDER = './' + req.params.ROOT;
    }
    
    if (req.params[0])
    {
        ASSIGNEDPATH = req.params[0];
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
