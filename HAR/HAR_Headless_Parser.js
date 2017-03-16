/********************************************
Dependencies
********************************************/
const fs = require('fs'); // file system
const chc = require('chrome-har-capturer'); // capture HAR libraru
const argv = require('minimist')(process.argv.slice(2)); // used for easy param parsing
const readlineSync = require('readline-sync'); // reads input synchonously
const mysql = require('mysql'); // offical mysql library
const async = require('async');

/********************************************
Globals
********************************************/
const COMPUTER_TYPE = 0; // computer type 0 == pi, 1 == desktop //TODO
const CONNECTION_PATH = 1; // connection path 0 == local, 1 == internet //TODO

var DB_NAME, DB_HOST, DB_USER, DB_PASS; // used to log into database
var INPUT_FILE; // where to grab the websites
var PORT = 9222; // for chrome-har-captuer 
var VERBOSE = false; // when you want your terminal spammed 
var DEBUG = false; // used for turning on debug output
var WEBSITE_LIST; // array of websites to scan
var PARSE_LOOP_COUNT = 0; // used to track recursive loop

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

// --dbport
if (argv.dbport) {
    DB_PORT = argv.dbport;
} else {
    DB_PORT = readlineSync.question("Enter port of database: (3306) ");
    if (DB_PORT == false) { DB_PORT = "3306"; } //default
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
// checks for empty lines
for (let i = 0; i < WEBSITE_LIST.length; ) {
    if (WEBSITE_LIST[i] == "" | WEBSITE_LIST[i] == false) {
	WEBSITE_LIST.splice(i,1);
    } else {
	i++; // if spliced the i value is already the next element
    }
}

// -p, --port
if (argv.p || argv.port) { PORT = argv.port || argv.p; } 

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
    dateStrings : 'date' // needed to allow javascript dates, MySQL will be forced to cast it   
});
if (DEBUG) { console.log("DB_HOST: ",DB_HOST,"\nDB_USER: ",DB_USER,"\nDB_PASS: ",DB_PASS,"\nDB_NAME: ",DB_NAME,"\nDB_PORT: ",DB_PORT,"\n");}

connection.connect( (err) => {
    if (err) {
	console.error('ERROR: connecting to database: ' + err.stack);
	process.exit(1);
    }
    
    if (VERBOSE) { console.log("Connected to database as threadId", connection.threadId, "\n"); }

    parse_loop();
});

/*
 * This is the main parsing loop that recursively runs
 * Currently best approach to synch all async functions
 */
function parse_loop() {

    // called when no more sites left
    if (PARSE_LOOP_COUNT >= WEBSITE_LIST.length) {
	cleanup();
	return;
    }
   
    // loads site and waits for event
    HAR_LOAD = chc.load(WEBSITE_LIST[PARSE_LOOP_COUNT]);

    HAR_LOAD.on('connect', function () {
        if (VERBOSE) { console.log(WEBSITE_LIST[PARSE_LOOP_COUNT] + ' connected to Chrome\n'); }
    });

    // TODO, have it retry or something better then skip
    HAR_LOAD.on('error', (err) => {
	console.error('Cannot connect to Chrome for' + WEBSITE_LIST[PARSE_LOOP_COUNT] + ' due to : ' + err);
	console.error("TODO: Catch HAR_LOAD error");
	process.exit(1);
    });

    // takes har and inserts it
    HAR_LOAD.on('end', (har) => {


	// gets website obj data and parses it out for use in query insert
	var website_obj = har.log.entries[0].request.headers[0].value.replace(/[/]+/g, ''); // returns ex: W_1_2_a
	var obj_type = website_obj.split("_")[0];
	var obj_size  = website_obj.split("_")[1];
	var obj_count = website_obj.split("_")[2];
	var obj_structure = website_obj.split("_")[3];

	var domain = har.log.pages[0].title; // keep variable as we use is multiple times below
	var WebsiteID; // gets called from website_query and used as foreign key for entry insert query
	
	/** WEBSITE QUERY **/
	var website_query = connection.query('INSERT INTO ' + DB_NAME + '.Website SET ' +
					     'Domain = ?, NumberOfFiles = ?, StartedDateTime = ?, OnContentLoad = ?, OnLoad = ?, ' +
					     'ObjectType = ?, Size = ?, Count = ?, Structure = ?',
			 [
			     domain, // domain,
			     har.log.entries.length, // NumberOfFiles
			     new Date(har.log.pages[0].startedDateTime), // StartedDateTime
			     har.log.pages[0].pageTimings.onContentLoad, // OnContentLoad
			     har.log.pages[0].pageTimings.onLoad, // OnLoad
			     obj_type, // ObjectType
			     obj_size, // Size
			     obj_count, // Count
			     obj_structure // Structure

			 ],
	    (error, results, fields) => { // returns on website query insert

		if (error) {
		    console.error("website_query error: ", error);
		    console.log("TODO: Catch query error");
		    process.exit(1);
		}

		WebsiteId = results.insertId;
		
		// loops through each asynch call in a synch fashion
		async.forEachSeries(har.log.entries,
		    function(entry, callback) { // each entry table query
			
			// loops through all headers and will be null if not found as headers are optional
			var header_req_cache_control = findHeader(entry.request.headers, "cache-control");
			var header_req_date = findHeader(entry.request.headers, "date");
			var header_req_user_agent = findHeader(entry.request.headers, "user-agent");			
			var header_res_date = findHeader(entry.response.headers, "date");
			var header_res_last_modified = findHeader(entry.response.headers, "last-modified");
			var header_res_server = findHeader(entry.response.headers, "server");
			var header_res_content_length = findHeader(entry.response.headers, "content-length");
			
			var entry_query = connection.query('INSERT INTO ' + DB_NAME + '.Entries SET WebsiteId = ?, ' +
				         'Domain = ?, StartedDateTime = ?, TotalTime = ?, RequestCacheControl = ?, RequestDate = ?, RequestUserAgent = ?, '+
					 'RequestUrl = ?, RequestHeadersSize = ?, RequestBodySize = ?, ResponseDate = ?, ResponseLastModified = ?, '+
					 'ResponseServer = ?, ResponseContentLength = ?, ResponseStatus = ?, ResponseHeadersSize = ?, ResponseBodySize = ?, '+
				         'ResponseHttpVersion = ?, ResponseTransferSize = ?, Blocked = ?, DNS = ?, Connect = ?, Send = ?, Wait = ?, '+
					 'Receive = ?, SSLTime = ?, ComputerType = ?, ConnectionPath = ?',
					 [
					     WebsiteId, // WebsiteId		       
					     domain, // Domain
					     new Date(entry.startedDateTime), // StartedDateTime
					     entry.time, // TotalTime

					     header_req_cache_control, // RequestCacheControl
					     new Date(header_req_date), // RequestDate
					     header_req_user_agent, // RequestUserAgent
					     entry.request.url, // RequestUrl
					     entry.request.headersSize, // RequestHeadersSize
					     entry.request.bodySize, // RequestBodySize

					     new Date(header_res_date), // ResponseDate
					     new Date(header_res_last_modified), // ResponseLastModified
					     header_res_server, // ResponseServer
					     header_res_content_length, // ResponseContentLength
					     entry.response.status, // ResponseStatus
					     entry.response.headersSize, // ResponseHeadersSize
					     entry.response.bodySize, // ResponseBodySize
					     entry.response.httpVersion, //ResponseHttpVersion
					     entry.response._transferSize, // ResponseTransferSize

					     entry.timings.blocked, // Blocked
					     entry.timings.dns, // DNS
					     entry.timings.connect, // Connect
					     entry.timings.send, // Send
					     entry.timings.wait, // Wait
					     entry.timings.receive, // Receive
					     entry.timings.ssl, // SSLTime
					     
					     COMPUTER_TYPE, // ComputerType
					     CONNECTION_PATH // ConnectionPath
					 ],
			    function(error, results) {
				// call with each query
				if (error) {
				    console.error("entry_query error: ", error);
				    console.log("TODO: Catch query error");
				    process.exit(1);
				}
				
				if (VERBOSE) { console.log("Datbase insert for ", entry.request.url, "\n"); }

				callback(); // used to call next async entry

			}); // connection.query
			
			if (DEBUG) console.log(entry_query.sql, "\n");
			
		    }, function(error) { // called when all entries are done

 			if (error) { 
			    console.error("async series error: ", error);
			    console.log("TODO: Catch async error");
			    process.exit(1);
			}
			
			if (VERBOSE) { console.log("Parse loop " + PARSE_LOOP_COUNT + " complete"); }
			PARSE_LOOP_COUNT++;
			parse_loop(); // recursion call
				     
	     }); // forEachOfSeries
		
	}); // website_query
	
	if (DEBUG) { console.log(website_query.sql, "\n") };
	
    }); // HAR_LOAD.on(end)

    
} // parse_loop


function cleanup() {
    connection.end(); // close SQL connection for good practice
    process.exit(1); // remove only if need to continue after cleanup
}

/*
 * custom array.find for headers, really just finds name key that matchs and the value in it
 * header format: { name : "header_key", value : "header_value" }
 */
function findHeader(headers, name) {
    for (let i = 0; i < headers.length; i++) {
	if (headers[i].name == name) {
	    return headers[i].value
	}
    }
    return null; // null if not found for SQL database as undefinded is not SQL type
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
		"  -i, --input <file>   File of website input list in line-by-line fashion [Will prompt otherwise]\n"+
		"  -p, --port <port>    Remote Debugging Protocol port [Default: 9222]\n"+
		"  -v, --verbose        Enable verbose output on stdout\n"
    );
}
