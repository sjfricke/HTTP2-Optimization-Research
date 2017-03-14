/********************************************
Dependencies
********************************************/
const fs = require('fs'); // file system
const chc = require('chrome-har-capturer'); // capture HAR libraru
const argv = require('minimist')(process.argv.slice(2)); // used for easy param parsing
const readlineSync = require('readline-sync'); // reads input synchonously

/********************************************
Globals
********************************************/
var DB_NAME, DB_HOST, DB_USER, DB_PASS; // used to log into database
var INPUT_FILE; // where to grab the websites
var PORT = 9222; // for chrome-har-captuer 
var VERBOSE = false; // when you want your terminal spammed 
var DEBUG = false; // used for turning on debug output
var WEBSITE_LIST; // array of websites to scan

/********************************************
Param Checking and Validation
********************************************/

// -h, --help
if (argv.h || argv.help) {
    print_options();
    process.exit(1);
}

// --dbhost
if (argv.dbhost) {
    DB_HOST = argv.dbhost;
} else {
    DB_HOST = readlineSync.question("Enter IP of database: (127.0.0.1) ");
    if (DB_HOST == false) { DB_HOST = "127.0.0.1"; } //default
}

// --dbuser
if (argv.dbuser) {
    DB_USER = argv.dbuser;
} else {
    DB_USER = readlineSync.question("Enter username of database: (none) ");
}

// --dbpass
if (argv.dbpass) {
    DB_PASS = argv.dbpass;
} else {
    DB_PASS = readlineSync.question("Enter password of database: (none) ");
}

// --dbname
if (argv.dbname) {
    DB_NAME = argv.dbname;
} else {
    while (!DB_NAME) {
	DB_NAME = readlineSync.question("Enter database name: ");
    }
}

// -i, --input
if (argv.i || argv.input) {
    INPUT_FILE = argv.input || argv.i;
    if (!fs.existsSync(INPUT_FILE)) {
	console.log("Input file does not exist!");
	while (!INPUT_FILE) {
	    INPUT_FILE = readlineSync.question("Enter input file: ");
	    if (!fs.existsSync(INPUT_FILE)) {
		console.log("File does not exist!");
	    }
	}
    }
} else {
    while (!INPUT_FILE) {
	INPUT_FILE = readlineSync.question("Enter input file: ");
	if (!fs.existsSync(INPUT_FILE)) {
	    console.log("File does not exist!");
	}
    }
}
// parse file into array from line-by-line
WEBSITE_LIST = fs.readFileSync(INPUT_FILE).toString().split("\n");

// -p, --port
if (argv.p || argv.port) { PORT = argv.port || argv.p; } 

// -v, --verbose
if (argv.v || argv.verbose) { VERBOSE = true; }

// --debug
if (argv.debug) { DEBUG = true; }
    
/********************************************

 ********************************************/
//var HAR_LOAD = new Array(10);
//for (var i = 0; i<10; i++) {
HAR_LOAD = chc.load([WEBSITE_LIST[0], WEBSITE_LIST[1], WEBSITE_LIST[2], WEBSITE_LIST[3], WEBSITE_LIST[4]]);

    HAR_LOAD.on('connect', function () {
	console.log('Connected to Chrome for ');
    });

    HAR_LOAD.on('end', function (har) {
	//TODO, more robust way to find
	//var temp = WEBSITE_LIST[i].substring(WEBSITE_LIST[i].indexOf("./com/")  + 5, WEBSITE_LIST[i].length-1)
	fs.writeFileSync( 'all.har', JSON.stringify(har));
	//test(temp);
    });

    HAR_LOAD.on('error', function (err) {
	console.error('Cannot connect to Chrome from ' +  i  +  ': ' + err);
    });
//}

function test(temp) { console.log(temp); }

/*
* Used to print out options supported
*/
function print_options(){
    console.log("Usage: node HAR_Headless_Parser [options]...\n\n"+
 		"Options:\n\n"+
		"  -h, --help           Output usage information\n"+
		"      --dbhost <IP>    IP address for database [Will prompt otherwise]\n"+
		"      --dbuser <user>  User of database [Will prompt otherwise]\n"+
		"      --dbpass <pass>  Password of database [Will prompt otherwise]\n"+
		"      --dbname <name>  Name of database to store data [Will prompt otherwise]\n"+
		"  -i, --input <file>   File of website input list in line-by-line fashion [Will prompt otherwise]\n"+
		"  -p, --port <port>    Remote Debugging Protocol port [Default: 9222]\n"+
		"  -v, --verbose        Enable verbose output on stdout\n"
    );
}
