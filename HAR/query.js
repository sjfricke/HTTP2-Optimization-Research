


/** WEBSITE QUERY **/

// website_query = "INSERT INTO Website(Domain, NumberOfFiles, RequestOrder, FirstLoad , OnContentLoad, OnLoad ) " \
// "VALUES(%s, %s, %s, %s, %s, %s)"

connection.query('INSERT INTO har_db.Website set Domain = ?, NumberOfFiles = ?, RequestOrder = ?, FirstLoad = ?,' +
    ' OnContentLoad = ? , OnLoad = ?, ObjectType = ?, Size = ?, Count = ?, Structure = ? )',
       [
           har.log.pages[0].title, // domain,
           har.log.entries.length, // NumberOfFiles
           argv.requestOrder, //RequestOrder //TODO add flag for request order or how else to get it?
           argv.firstLoad, //FirstLoad //TODO how to get determine First Load?
           har.log.pages[0].pageTimings.onContentLoad,// OnContentLoad data['log']['pages'][0]['pageTimings']['onContentLoad']
           har.log.pages[0].pageTimings.onLoad,// OnLoad
           argv.obj_type,// ObjectType //TODO
           argv.obj_size,// Size //TODO
           argv.obj_count,// Count //TODO
           argv.obj_structure// Structure //TODO

       ]
)

/** Entries QUERY **/
/** Note the zeros below should be replaced by i for the number of entries **/


connection.query('INSERT INTO har_db.Entries SET Domain = ?, Url = ?, Blocked = ?, DNS = ?, Connected = ?, Send = ?,' +
    ' Wait = ?, Receive = ?, SSL_time = ?, ' +
    'RequestHeadersSize = ?, RequestBodySize = ?, ResponseHeadersSize = ?, ResponseBodySize = ?, ResponseStatus = ?,' +
    'ResponseTransferSize = ?, ContentType = ? ',
            har.log.pages[0].title ,// Domain
            har.log.entries[0].request.url, // Url
            har.log.entries[0].timings.blocked, // Blocked
            har.log.entries[0].timings.dns, // DNS
            har.log.entries[0].timings.connect, // Connect
            har.log.entries[0].timings.send, // Send
            har.log.entries[0].timings.wait, // Wait
            har.log.entries[0].timings.receive, // Receive
            har.log.entries[0].timings.ssl, // SSL_time
            har.log.entries[0].request.headersSize, // RequestHeaderSize
            har.log.entries[0].request.bodySize, // RequestBodySize
            har.log.entries[0].response.headersSize, // ResponseHeaderSize
            har.log.entries[0].response.bodySize,// ResponseBodySize
            har.log.entries[0].response.status,// ResponseStatus
            har.log.entries[0].response._transferSize,// ResponseTransferSize
            har.log.entries[0].response.headers[5].value,// ContentType
            argv.computer_type, // computer type 0 == pi, 1 == desktop //TODO
            argv.connection_path// connection path 0 == local, 1 == internet //TODO
        ]
)

// connection.query('INSERT INTO har_db.test SET value_INT = ?, value_STRING = ?', [a, b], function (error, results) {
//     if (error) throw error;
//
//     console.dir(results);
// });