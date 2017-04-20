/********************************************
0;136;0cDependencies
********************************************/
const fs = require('fs'); // file system
const argv = require('minimist')(process.argv.slice(2)); // used for easy param parsing
const readlineSync = require('readline-sync'); // reads input synchonously
const mysql = require('mysql'); // offical mysql library
const Promise = require("bluebird");

/********************************************
Globals
********************************************/
const COMPUTER_TYPE = 1; // computer type 0 == desktop, 1 == pi //TODO
const CONNECTION_PATH = 1; // connection path 0 == local, 1 == internet //TODO

var DB_NAME, DB_HOST, DB_USER, DB_PASS; // used to log into database

var VERBOSE = false; // when you want your terminal spammed
var DEBUG = false; // used for turning on debug output

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
    if (DB_HOST == false) { DB_HOST = "127.0.0.1"; } // default
}

// --dbport
if (argv.dbport) {
    DB_PORT = argv.dbport;
} else {
    DB_PORT = readlineSync.question("Enter port of database: (3306) ");
    if (DB_PORT == false) { DB_PORT = "3306"; } // default
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
    // TODO make password not show when typing
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

// -v, --verbose
if (argv.v || argv.verbose) { VERBOSE = true; }

// --debug
if (argv.debug) { DEBUG = true; }

/********************************************
Main Parsing and Database Inserting
 ********************************************/

// Not using pooling due to tracking each insert over performance since no real time transactions needed
// More setting can be added but ignored for the general case
var connection = mysql.createConnection({
    host        : DB_HOST,
    user        : DB_USER,
    password    : DB_PASS,
    database    : DB_NAME,
    port        : DB_PORT,
    dateStrings : 'date', // needed to allow javascript dates, MySQL will be forced to cast it
});
if (DEBUG) { console.log("DB_HOST: ",DB_HOST,"\nDB_USER: ",DB_USER,"\nDB_PASS: ",DB_PASS,"\nDB_NAME: ",DB_NAME,"\nDB_PORT: ",DB_PORT,"\n");}

connection.connect( (err) => {
    if (err) {
	console.error('ERROR: connecting to database: ' + err.stack);
	process.exit(1);
    }

    if (VERBOSE) { console.log("Connected to database as threadId", connection.threadId, "\n"); }

    main_loop();
});

/*
 * This is the main script function
 * 
 * 1. Gets SQL query
 * 2. Parses/cleans/format data
 * 3. Generates chart data
 */
async function main_loop() {
    try {
	let query_result;

	//query_result = await require("./queries/outlier_finder.js")(connection, VERBOSE);

    query_result = await require("./queries/http1_vs_http2.js")(connection, VERBOSE);
    if (VERBOSE) { console.log("http1_vs_http2 done!\n"); }


    } catch (error) {
	console.error(error);
    }

    cleanup();
}

function cleanup() {
    connection.end(); // close SQL connection for good practice
    process.exit(1); // remove only if need to continue after cleanup
}

/*
* Used to print out options supported
*/
function print_options(){
    console.log("Usage: node HAR_Headless_Parser [options]...\n\n"+
 		"Options:\n\n"+
		"  -h, --help           Output usage information\n"+
		"      --dbhost <IP>    IP address for database [Will prompt otherwise] [Default: 127.0.0.1]\n"+
		"      --dbport <port>  Port on machine to access database [Will prompt otherwise] [Default: 3306]\n"+
		"      --dbuser <user>  User of database [Will prompt otherwise]\n"+
		"      --dbpass <pass>  Password of database [Will prompt otherwise]\n"+
		"      --dbname <name>  Name of database to store data [Will prompt otherwise]\n"+
		"  -v, --verbose        Enable verbose output on stdout\n"
    );
}
