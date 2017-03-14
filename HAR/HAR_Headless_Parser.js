/********************************************
Dependencies
********************************************/
var fs = require('fs'); // file system
var chc = require('chrome-har-capturer'); // capture HAR libraru
var argv = require('minimist')(process.argv.slice(2)); // used for easy param parsing
var util = require("util");
var spawn = require("child_process").spawn; // used to call python script

/********************************************
Param Checking
********************************************/

// --help
if (argv.help) {
    print_options();
    process.exit(1);
}

function print_options(){
    console.log("Usage: HAR_Headless_Parser [options]...\n\n"+
 		"Options:\n\n"+
		"  -h, --help           Output usage information\n"+
		"  -d, --database       IP address for database\n"+
		"  -i, --input          File of input list in line-by-line fashion\n"+
		"  -p, --port <port>    Remote Debugging Protocol port\n"+
		"  -o, --output <file>  Dump to folder instead of HAR_Generate folder\n"+
		"  -v, --verbose        Enable verbose output on stderr\n"
    );
}


var c = chc.load(['https://http2optimization.com/']);

c.on('connect', function () {
    console.log('Connected to Chrome');
});
c.on('end', function (har) {
    fs.writeFileSync('test.har', JSON.stringify(har));

/*    var process = spawn('python',["./HAR_parser/HAR_parser.py"]);

    util.log('readingin')

    process.stdout.on('data',function(chunk){

        var textChunk = chunk.toString('utf8');// buffer to string

    	util.log(textChunk);
    });
*/
});
c.on('error', function (err) {
    console.error('Cannot connect to Chrome: ' + err);
});
