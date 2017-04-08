var fs = require("fs");

// Main Function
module.exports = (connection, verbose) => {
    return new Promise(function(resolve, reject) {
	// we need (ResponseContentLength IS NOT NULL) to prevent html loading page
	// it will have a high connect,dns, or ssltime and this is already factored in query
	connection.query(
	    `SELECT Website.WebsiteID, Size, Count, Structure, MAX(TotalTime), Website.Domain
             FROM Website INNER JOIN Entries ON Website.WebsiteID = Entries.WebsiteID
             WHERE (ResponseContentLength IS NOT NULL)
             GROUP BY WebsiteID
             ORDER BY Size, Count, Structure, MAX(TotalTime);`,
	    (error, results, fields) => {
		
		if (error) {
		    console.error(error);
		    return reject(false);
		}

		if (verbose) { console.log("Query Successful"); }

		var lastDomain = "";
		var averageTotalTime = 0;
		var thisTotalTime = 0;
		var websiteCount = 0;
		var badWebsites = new Set(); // set is ES6 unique object type
		var siteList = [];
		
		for (let i = 0; i < results.length; i++) {
		    
		    thisTotalTime = results[i]["MAX(TotalTime)"]; // get no matter what

		    // checks if list of same domains is ended
		    // if so it will find outliers and add to badWebsites set
		    // Note, need to manually check last set of data still :(
		    if ( results[i]["Domain"] != lastDomain) {

			if ( lastDomain != "" ) { //prevents first site from checking site n-1

			    for (let site of siteList) {
				// The real trick is setting how off the new time can be from the average	
				if (site.TotalTime > averageTotalTime * 2.75) {
				    badWebsites.add(site.WebsiteID);
				}
			    }
			    
			    siteList = []; //clears new site
			}
			
			// new website setup
			websiteCount = 1;
			averageTotalTime = thisTotalTime;

		    } else {
			// Incremental averageing
			// Ave(n) = Ave(n-1) + ( (Value(n) - Ave(n-1)) / n)
			websiteCount++;
			averageTotalTime = averageTotalTime + ( (thisTotalTime - averageTotalTime) / websiteCount);

			// add to temp array for checking after
			siteList.push({
			    "WebsiteID" : results[i]["WebsiteID"],
			    "TotalTime" : thisTotalTime
			});			
		    }
		    
		    lastDomain = results[i]["Domain"];
		}

		// display bad wesites
		for (let id of badWebsites) {
		    console.log("Bad WebsiteID: " + id);
		}
		
		return resolve(true);
	    });

    }) // Promise
} // module.export
