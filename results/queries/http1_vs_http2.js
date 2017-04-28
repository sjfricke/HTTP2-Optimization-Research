// WE ASSUMING CURRENTLY THAT EVERY COUNT IS HERE AS WE ARE USING INDEX MATCHING - TOTALLY A //TODO
const COUNT = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15", "20", "25", "30", "35", "50", "70", "90", "100", "125", "150", "175", "200"];
// Each column has a index after saved for tooltips
const COLUMNS = [
	{ name : "1 MB - HTTP1.1 - Same Size",	ResponseHttpVersion : "http/1.1",	Size : 4, Structure : "a", data : [] }, // 1
	{ name : "1 MB - HTTP2 - Same Size",   	ResponseHttpVersion : "h2",       	Size : 4, Structure : "a", data : [] }, // 3
	{ name : "1 MB - HTTP1.1 - Ascending", 	ResponseHttpVersion : "http/1.1", 	Size : 4, Structure : "b", data : [] }, // 5
	{ name : "1 MB - HTTP2 - Ascending",   	ResponseHttpVersion : "h2",       	Size : 4, Structure : "b", data : [] }, // 7
	{ name : "1 MB - HTTP1.1 - Descending", ResponseHttpVersion : "http/1.1", 	Size : 4, Structure : "c", data : [] }, // 9
	{ name : "1 MB - HTTP2 - Descending",  	ResponseHttpVersion : "h2",       	Size : 4, Structure : "c", data : [] }, // 11
	{ name : "1 MB - HTTP1.1 - Random", 	ResponseHttpVersion : "http/1.1", 	Size : 4, Structure : "d", data : [] }, // 13 
	{ name : "1 MB - HTTP2 - Random", 	ResponseHttpVersion : "h2", 		Size : 4, Structure : "d", data : [] }, // 15
	{ name : "2 MB - HTTP1.1 - Same Size",	ResponseHttpVersion : "http/1.1",	Size : 6, Structure : "a", data : [] }, // 17
	{ name : "2 MB - HTTP2 - Same Size",   	ResponseHttpVersion : "h2",       	Size : 6, Structure : "a", data : [] }, // 19
	{ name : "2 MB - HTTP1.1 - Ascending", 	ResponseHttpVersion : "http/1.1", 	Size : 6, Structure : "b", data : [] }, // 21
	{ name : "2 MB - HTTP2 - Ascending",   	ResponseHttpVersion : "h2",       	Size : 6, Structure : "b", data : [] }, // 23
	{ name : "2 MB - HTTP1.1 - Descending", ResponseHttpVersion : "http/1.1", 	Size : 6, Structure : "c", data : [] }, // 25
	{ name : "2 MB - HTTP2 - Descending",  	ResponseHttpVersion : "h2",       	Size : 6, Structure : "c", data : [] }, // 27
	{ name : "2 MB - HTTP1.1 - Random", 	ResponseHttpVersion : "http/1.1", 	Size : 6, Structure : "d", data : [] }, // 29
	{ name : "2 MB - HTTP2 - Random", 	ResponseHttpVersion : "h2", 		Size : 6, Structure : "d", data : [] }, // 31
	{ name : "4 MB - HTTP1.1 - Same Size",	ResponseHttpVersion : "http/1.1",	Size : 8, Structure : "a", data : [] }, // 33
	{ name : "4 MB - HTTP2 - Same Size",   	ResponseHttpVersion : "h2",       	Size : 8, Structure : "a", data : [] }, // 35
	{ name : "4 MB - HTTP1.1 - Ascending", 	ResponseHttpVersion : "http/1.1", 	Size : 8, Structure : "b", data : [] }, // 37
	{ name : "4 MB - HTTP2 - Ascending",   	ResponseHttpVersion : "h2",       	Size : 8, Structure : "b", data : [] }, // 39
	{ name : "4 MB - HTTP1.1 - Descending", ResponseHttpVersion : "http/1.1", 	Size : 8, Structure : "c", data : [] }, // 41
	{ name : "4 MB - HTTP2 - Descending",  	ResponseHttpVersion : "h2",       	Size : 8, Structure : "c", data : [] }, // 43
	{ name : "4 MB - HTTP1.1 - Random", 	ResponseHttpVersion : "http/1.1", 	Size : 8, Structure : "d", data : [] }, // 45
	{ name : "4 MB - HTTP2 - Random", 	ResponseHttpVersion : "h2", 		Size : 8, Structure : "d", data : [] }	// 47
];
// all groups need zero index for the X column
const GROUPS = [
	{ name : "Same Size", 	index : [0,1,2,3,4,17,18,19,20,33,34,35,36] 	},
	{ name : "Ascending",	index : [0,5,6,7,8,21,22,23,24,37,38,39,40]  	},
	{ name : "Descending", 	index : [0,9,10,11,12,25,26,27,28,41,42,43,44]	},
	{ name : "Random", 		index : [0,13,14,15,16,29,30,31,32,45,46,47,48]	},
	{ name : "HTTP/1.1 (Same Size)", 	index : [0,1,2,5,6,9,10,13,14,17,18,21,22,25,26,29,30,33,34,37,38,41,42,45,46] },
	{ name : "HTTP2 (Same Size)", 		index : [0,3,4,7,8,11,12,15,16,19,20,23,24,27,28,31,32,35,36,39,40,43,44,47,48]	}
]

var fs = require("fs");

// used to store HTML string to write to file
// Top part of HTML
var HTML = "<html><head><title>HTTP2 Opimization</title></head>\n"+
    "<body>\n"+
    "<div id='control_div'>";			

// Adds buttons
for (var i = 0; i < GROUPS.length; i++) {
    HTML += "<button style='marginRight:10px' "+
	"onclick='changeView(["+ GROUPS[i].index +"])'"+
	">" + GROUPS[i].name + "</button> ";
}

HTML += "</div>\n"+
    "<div id='chart_div'></div>\n"+
    "</body>\n"+
    "<script type='text/javascript' src='https://www.gstatic.com/charts/loader.js'></script>\n" + 
    "<script> var view, options, chart;\n" +
    "function drawChart(){\n" +
    "data = new google.visualization.DataTable();\n" +
    "data.addColumn('number','X');\n";

// add column for each count value
for (let i = 0; i < COLUMNS.length; i++) {
    HTML += "data.addColumn('number', '" + COLUMNS[i].name + "');data.addColumn({type: 'string', role: 'tooltip'});\n"
}

// Main Function
module.exports = (connection, verbose) => {
    return new Promise(function(resolve, reject) {
    	// NEED to run
		connection.query(
	         `SELECT Website.WebsiteID, Size, Count, Structure, 
             MAX(TotalTime), AVG(Send), AVG(Wait), AVG(Receive), ResponseHttpVersion
             FROM Website INNER JOIN Entries ON Website.WebsiteID = Entries.WebsiteID  
             WHERE (ResponseHttpVersion = "h2" OR ResponseHttpVersion = "http/1.1") AND (RequestUrl <> Entries.Domain)
             GROUP BY WebsiteID, ResponseHttpVersion
             ORDER BY Size, Structure, ResponseHttpVersion desc;`,
	    (error, results, fields) => {
		
		if (error) {
		    console.error(error);
		    return reject(false);
		}
		
		if (verbose) { console.log("Query Successful"); }
		
		
		
		for (let i = 0; i < COLUMNS.length; i++) {
		    
		    for (let j = 0; j < COUNT.length; j++) {
			
			COLUMNS[i].data.push({
				    "num_of_entries" : 0,
			    "TotalTime" : 0,
			    "Send" : 0,
			    "Wait" : 0,
			    "Receive" : 0
			});
		    }
		}
		
		if (verbose) { console.log("Column Data array initalized"); }
		


		// take queried data and add it to data
		for (let i = 0; i < results.length; i++) {

		    // grab field for less verbose variable names
		    let Count = parseInt(results[i]["Count"]);
		    let Size = parseInt(results[i]["Size"]);
		    let Structure = results[i]["Structure"];
		    let ResponseHttpVersion = results[i]["ResponseHttpVersion"];
		    
 		    // O(n3) ... ya I know, but honestly auto generated google charts wasn't gonna be O(n) was it now...
 		    // Assuming doing a ORDER BY in query allows for the best optimization from Branch Prediciton and caching

 		    for (let j = 0; j < COLUMNS.length; j++) {				
 			
 			if (Size == COLUMNS[j].Size &&
 			    Structure == COLUMNS[j].Structure &&
 			    ResponseHttpVersion == COLUMNS[j].ResponseHttpVersion) {
			    // hit condition when finds correct column matching DB data

			    //TODO Get rid of dependent on Count index being from listed values and DB
 			    COLUMNS[j].data[Count].num_of_entries++;

 			    // Incremental averageing
			    // Ave(n) = Ave(n-1) + ( (Value(n) - Ave(n-1)) / n)
			    COLUMNS[j].data[Count].TotalTime = COLUMNS[j].data[Count].TotalTime + ( (results[i]['MAX(TotalTime)'] - COLUMNS[j].data[Count].TotalTime) / COLUMNS[j].data[Count].num_of_entries);
			    COLUMNS[j].data[Count].Send = COLUMNS[j].data[Count].Send + ( (results[i]['AVG(Send)'] - COLUMNS[j].data[Count].Send) / COLUMNS[j].data[Count].num_of_entries);
			    COLUMNS[j].data[Count].Wait = COLUMNS[j].data[Count].Wait + ( (results[i]['AVG(Wait)'] - COLUMNS[j].data[Count].Wait) / COLUMNS[j].data[Count].num_of_entries);
			    COLUMNS[j].data[Count].Receive = COLUMNS[j].data[Count].Receive + ( (results[i]['AVG(Receive)'] - COLUMNS[j].data[Count].Receive) / COLUMNS[j].data[Count].num_of_entries);
			    //break; // breaks the COLUMNS loop to get next result
 			}
 		    } // column.length loop
		} //result.length loop		

		if (verbose) { console.log("Query results sorted out"); }
		
		// Need to no calculate data as its formated to Google Chart Row format
		
		var chart_row_data = [];
		/* 
		 * Data row format:
		 * ["<COUNT[i]>", <totalTime_1>, <toolTipData_1>, <totalTime_2>, <toolTipData_2>, ... ]
		 * Where _1 is the first column of data for COUNT[i]
		 */
		for (let i = 0; i < COUNT.length; i++) {

		    let row_data = [ parseInt(COUNT[i]) ]; //parseInt if X row is number and continious
		    
		    for (let j = 0; j < COLUMNS.length; j++) {

			let total_time = COLUMNS[j].data[i].TotalTime;
			
			row_data.push( total_time  );
			
			row_data.push( "Total Time: " + total_time.toFixed(2) + " ms\n" +
				       "Files: " + COUNT[i] + "\n" +
				       "Number of trials: " + COLUMNS[j].data[i].num_of_entries + "\n" +
				       "\n" +
				       "Avg Send: " +
				       COLUMNS[j].data[i].Send.toFixed(2) + " ms\n" +
				       "Avg Wait: " +
				       COLUMNS[j].data[i].Wait.toFixed(2) + " ms\n" +
		 		       "Avg Receive : " +
				       COLUMNS[j].data[i].Receive.toFixed(2) + " ms"
				     );
		    }
		    
		    chart_row_data.push(row_data);
		}

		if (verbose) { console.log("Chart Row data done"); }
		
		HTML += "data.addRows(" + JSON.stringify(chart_row_data) + ");\n";

		// TODO give more colors choices
		HTML += "options = {\n"+
		    "title:'Load time over different number of files of same size',\n"+
		    "hAxis:{title:'Files in Page'},\n"+
		    "vAxis:{title:'Time (milliseconds)'},\n"+
		    "colors:['Red','Green','Navy','Purple','DarkOrange','Black','Cyan','SteelBlue','Gold','SpringGreen'],\n"+
		    "height: 600,\n"+
		    "explorer: {},\n"+
		    "pointSize: 5\n"+
		    "};\n"+ // end of option object
		    "view = new google.visualization.DataView(data);\n"+
		    "chart = new google.visualization.LineChart(document.getElementById('chart_div'));\n"+
		    "chart.draw(view, options);\n"+
		    "}\n"+ // end of drawChart()
		    "google.charts.load('current', {packages: ['corechart', 'line']});\n"+
		    "google.charts.setOnLoadCallback(drawChart);\n"+
		    // add change view function
		    "function changeView(index) {\n"+
		    "view.setColumns( index );\n"+
		    "chart.draw(view, options);\n"+
		    "}\n"+
		    "</script>"+		    
		    "</html>";

		// TODO check if directory exists and different relavent path
		fs.writeFileSync('./charts/http1_vs_http2.html', HTML);
		
		return resolve(true);
	    });
	
    }) // Promise
} // module.export
