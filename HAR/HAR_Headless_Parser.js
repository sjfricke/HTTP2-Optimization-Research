/********************************************
Dependencies
********************************************/
var fs = require('fs'); // file system
var chc = require('chrome-har-capturer'); // capture HAR libraru
var argv = require('minimist')(process.argv.slice(2)); // used for easy param parsing

/********************************************
Param Checking
********************************************/

// --help
if (argv.help) {
    print_options();
    process.exit(1);
}

function print_options(){
    console.log("Usage: node HAR_Headless_Parser [options]...\n\n"+
 		"Options:\n\n"+
		"  -h, --help           Output usage information\n"+
		"  -d, --db <name>      Name of database to store data [Will prompt otherwise]\n"+
		"      --dbhost <IP>    IP address for database [Will prompt otherwise]\n"+
		"      --dbuser <user>  User of database [Will prompt otherwise]\n"+
		"      --dbpass <pass>  Password of database [Will prompt otherwise]\n"+
		"  -i, --input <file>   File of website input list in line-by-line fashion [Will prompt otherwise]\n"+
		"  -p, --port <port>    Remote Debugging Protocol port [Default: 9222]\n"+
		"  -o, --output <file>  Dump to folder instead of HAR_Generate folder [Defult: ./]\n"+
		"  -v, --verbose        Enable verbose output on stdout\n"
    );
}


var c = chc.load(['https://http2optimization.com/']);

c.on('connect', function () {
    console.log('Connected to Chrome');
});
c.on('end', function (har) {
    fs.writeFileSync('test.har', JSON.stringify(har));

});
c.on('error', function (err) {
    console.error('Cannot connect to Chrome: ' + err);
});
