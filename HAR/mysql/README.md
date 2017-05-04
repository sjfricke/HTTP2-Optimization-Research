# MySQL Table Creating

## Setup
To setup your own MySQL tables for the HAR parser

1. Open up MySQL via command line or MySQL Workbench or any other method
2. Execute the `Website.sql` query
3. Execute the `Entries.sql` query

## Website Table
* `WebsiteID` **[INT]** [NOT NULL] [AUTO_INCREMENT] *[PRIMARY KEY]*
  * Used to track each call to a website as its own instance.
* `Domain` **[VARCHAR(100)]** [NOT NULL]
  * The full domain path of the site.
* `NumberOfFiles` **[INT]** [NOT NULL]
  * Number of files in each site.
  * Each one corresponds to an `Entries table` record.
* `StartedDateTime` **[DATETIME]** [NOT NULL]
  * Timestamp when page was attempted to be loaded.
* `OnContentLoad` **[FLOAT]** [NOT NULL]
  * Number of milliseconds since page load started. 
  * Use -1 if the timing does not apply to the current request.
* `OnLoad` **[FLOAT]** [NOT NULL]
  * Number of milliseconds since page load started.
  * Use -1 if the timing does not apply to the current request.
* `ObjectType` **[VARCHAR(8)]** [NOT NULL]
  * Type object in page.
	* `W` - JavaScript file
	* `X` - CSS file
	* `Y` - Image file
	* `Z` - Random file
  * This field can be just one or any permutation of the letters.
* `Size` **[VARCHAR(8)]** [NOT NULL]
  * Number of bytes of each page in bytes
  * Examples:
  	* 1024 == *1 KB*
	* 100000 == *~100 KB*
	* 1000000 == *~1 MB*
	* 5000000 == *~5 MB*
* `Count` **[VARCHAR(8)]** [NOT NULL]
  * The total number of object files that make up the `Size`.
* `Structure` **[VARCHAR(8)]** [NOT NULL]
  * How the `Count` number of files are divided among the total page `Size`.
	* `a` - Same Size
	  * Each file is `Size / Count`
	* `b` - Ascending Order
	* `c` - Descending Order
	* `d` - Random
	
## Entries Table
* `EntryID` **[INT(11)]** [NOT NULL] [AUTO_INCREMENT] *[PRIMARY KEY]*
  * Gives each Entry a unique ID.
* `WebsiteID` **[INT]** [NOT NULL] *[FOREIGN KEY]*
  * Used to map to Website table.
* `Domain` **[VARCHAR(512)]** [NOT NULL]
  * The domain path to each page.
* `StartedDateTime` **[DATETIME]** [NOT NULL]
  * Timestamp of when request started.
* `TotalTime` **[FLOAT]** [NOT NULL]
  * Total elapsed time of the request in milliseconds.
	* This is the sum of all timings available in the timings object (not including -1 values).
* `RequestCacheControl` **[VARCHAR(45)]** [DEFAULT NULL]
  * Request HTTP Header value for `cache-control`.
* `RequestDate` **[DATETIME]** [DEFAULT NULL]
  * Request HTTP Header value for `date`.
* `RequestUserAgent` **[VARCHAR(512)]** [DEFAULT NULL]
  * Request HTTP Header value for `user-agent`.
* `RequestHeadersSize` **[INT(11)]** [DEFAULT NULL]
  * Total number of bytes from the start of the HTTP request message until (and including) the double CRLF before the body. 
  * Set to -1 if the info is not available
* `RequestBodySize` **[INT(11)]** [DEFAULT NULL]
  * Size of the request body (POST data payload) in bytes.
  * Set to -1 if the info is not available.
* `RequestUrl` **[VARCHAR(512)]** [NOT NULL]
  * Full path to the object of this entry.
* `ResponseDate` **[DATETIME]** [DEFAULT NULL]
  * Response HTTP Header value for `date`.
* `ResponseLastModified` **[DATETIME]** [DEFAULT NULL]
  * Response HTTP Header value for `last-modified`.
* `ResponseServer` **[VARCHAR(128)]** [DEFAULT NULL]
  * Response HTTP Header value for `server`.
* `ResponseContentLength` **[INT(11)]** [DEFAULT NULL]
  * Response HTTP Header value for `content-length`.
* `ResponseStatus` **[INT(11)]** [DEFAULT NULL]
  * Response Status Code
* `ResponseHeadersSize` **[INT(11)]** [DEFAULT NULL]
  * Total number of bytes from the start of the HTTP response message until (and including) the double CRLF before the body.
  * Set to -1 if the info is not available.
* `ResponseBodySize` **[INT(11)]** [DEFAULT NULL]
  * Size of the received response body in bytes. Set to zero in case of responses coming from the cache (304).
  * Set to -1 if the info is not available.
* `ResponseHttpVersion` **[VARCHAR(45)]** [NOT NULL]
  * Response HTTP Version
* `ResponseTransferSize` **[INT(11)]** [DEFAULT NULL]
  * The size (in octets) of the fetched resource. 
  * The size includes the response header fields plus the response payload body.
  * Defined by `RFC7230`. 
  * If the resource is fetched from a local cache, this property returns zero.
* `Blocked` **[FLOAT]** [NOT NULL]
  * Time spent in a queue waiting for a network connection.
  * Use -1 if the timing does not apply to the current request.
* `DNS` **[FLOAT]** [NOT NULL]
  * DNS resolution time. The time required to resolve a host name.
  * Use -1 if the timing does not apply to the current request.
* `Connect` **[FLOAT]** [NOT NULL]
  * Time required to create TCP connection.
  * Use -1 if the timing does not apply to the current request
* `Send` **[FLOAT]** [NOT NULL]
  * Time required to send HTTP request to the server.
* `Wait` **[FLOAT]** [NOT NULL]
  * Waiting for a response from the server.
* `Receive` **[FLOAT]** [NOT NULL]
  * Time required to read entire response from the server (or cache).
* `SSLTime` **[FLOAT]** [NOT NULL]
  * Time required for SSL/TLS negotiation. If this field is defined then the time is also included in the connect field (to ensure backward compatibility with HAR 1.1).
  * Use -1 if the timing does not apply to the current request.
* `ExtraConfig` **[INT(11)]** [DEFAULT NULL]
  * A custom field used for personal configuration not specified 
