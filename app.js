/* Module dependencies */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');

/* Set up Node, Stylus and Nib */
var app = express();

var fs      = require('fs');
var mongo   = require('mongodb');
var Grid    = require('gridfs-stream');
var db      = new mongo.Db('test', new mongo.Server("127.0.0.1", 27017), { safe : false });
var gfs     = Grid(db, mongo);

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

db.open(initApp);

function initApp() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger('dev'));
    app.use(stylus.middleware(
        {
            src: __dirname + '/public',
            compile: compile
        }
    ));
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser({
        keepExtensions: true,
        uploadDir: "uploads"
    }));

    /* Launcher */
    app.get('/', function(req, res) {
        res.render('index', { title : 'Home' });
    });

    app.post('/upload', function(req, res) {
        var tempfile    = req.files.file.path;
        var origname    = req.files.file.name;
        var writestream = gfs.createWriteStream({ filename: origname });

        // open a stream to the temporary file created by Express...
        var readStream = fs.createReadStream(tempfile)
            .on('end', function() { res.send('OK'); })
            .on('error', function() { res.send('ERR'); })
            // and pipe it to gfs
            .pipe(writestream);

        // This handler deletes the file once handled (success or error) so the file is either in MongoDB or not, but
        // is not stored permanently on the local filesystem
        readStream.on('close', function() { fs.unlink(tempfile); });

        // Also create a standard mongo record with some meta information about this file
        db.collection('fileMetaCollection').find({ filename: origname }).sort({ _id: -1}).limit(1).nextObject(function (err, doc) {
            var version = doc ? doc.version + 1 : 1;

            db.collection('fileMetaCollection').insert({
                filename: origname,
                author: 'Roger Foxcroft',
                uploadTime: new Date().toISOString(),
                version: version
            });
        });

        res.render("index", { title : 'Home' });
    });

    app.listen(3000);
}
