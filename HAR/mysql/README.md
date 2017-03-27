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
  * Number of bytes of each page
	* `0` - 100000 bytes *(~100 KB)*
	* `1` - 200000 bytes *(~200 KB)*
	* `2` - 300000 bytes *(~300 KB)*
	* `3` - 500000 bytes *(~500 KB)*
	* `4` - 750000 bytes *(~750 KB)*
	* `5` - 1000000 bytes *(~1 MB)*
	* `6` - 1500000 bytes *(~1.5 MB)*
	* `7` - 2000000 bytes *(~2 MB)*
	* `8` - 2500000 bytes *(~2.5 MB)*
	* `9` - 4000000 bytes *(~4 MB)*
	* `10` - 6000000 bytes *(~6 MB)*
	* `11` - 8000000 bytes *(~8 MB)*
* `Count` **[VARCHAR(8)]** [NOT NULL]
  * The total number of object files that make up the `Size`.
	* `0` - 1 file
	* `1` - 2 files
	* `2` - 3 files
	* `3` - 4 files
	* `4` - 5 files
	* `5` - 6 files
	* `6` - 7 files
	* `7` - 8 files
	* `8` - 9 files
	* `9` - 10 files
	* `10` - 15 files
	* `11` - 20 files
	* `12` - 25 files
	* `13` - 30 files
	* `14` - 35 files
	* `15` - 50 files
	* `16` - 70 files
	* `17` - 90 files
	* `18` - 100 files
	* `19` - 125 files
	* `20` - 150 files
	* `21` - 175 files
	* `22` - 200 files	
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
* `ComputerType` **[INT(11)]** [DEFAULT NULL]
  * Which computer was used to run HAR Parser
    * **NOTE:** Different among internal testing
    * `0` - Desktop - Ubuntu
    * `1` - Raspberry Pi 3 - Ubuntu
* `ConnectionPath` **[INT(11)]** [DEFAULT NULL]
  * Which form of connection method was used
    * **NOTE:** Different among internal testing
    * `0` - Ethernet over DNS
    * `1` - Wi-Fi over DNS
    * `2` - Ethernet over Local Network
    * `3` - Wi-Fi over Local Network
