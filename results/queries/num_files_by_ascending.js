// Can change different Size and Count intervals here
const SIZE = ["100 KB", "250 KB", "500 KB", "750 KB", "1 MB", "1.5 MB", "2 MB", "2.5 MB", "4 MB", "6 MB", "8 MB"];
const COUNT = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15", "20", "25", "30", "35", "50", "70", "90", "100", "125", "150", "175", "200"];

var fs = require("fs");

// used to store HTML string to write to file
// Top part of HTML
var HTML = "<script type='text/javascript' src='https://www.gstatic.com/charts/loader.js'></script>" +
    "<div id='chart_div'></div>" +
    "<script>function drawChart(){" +
    "var data = new google.visualization.DataTable();" +
    "data.addColumn('number','X');";

// add column for each count value
for (let i = 0; i < SIZE.length; i++) {
    HTML += "data.addColumn('number', '" + SIZE[i] + "');data.addColumn({type: 'string', role: 'tooltip'});"
}

// Main Function
module.exports = (connection, verbose) => {
    return new Promise(function(resolve, reject) {
	connection.query(
	    `SELECT Website.WebsiteID, Size, Count, Structure, 
             MAX(TotalTime), SUM(ResponseTransferSize), AVG(Send), AVG(Wait), AVG(Receive) 
             FROM Website INNER JOIN Entries ON Website.WebsiteID = Entries.WebsiteID  
             WHERE (ResponseContentLength IS NOT NULL) AND (Structure = "b") 
             GROUP BY WebsiteID;`,
	    (error, results, fields) => {
		
		if (error) {
		    console.error(error);
		    return reject(false);
		}

		if (verbose) { console.log("Query Successful"); }
		
		// Data needs to be sorted by both 'Size' and 'Count'
		// Need Ave.Send, Ave.Wait, and Ave.Receive for tooltips

		// hold double array of data in object form
		// data[COUNT][SIZE] = { }

		var data = []; // holds all the info
		
		for (let i = 0; i < COUNT.length; i++) {
		    let inner_array = []
		    for (let j = 0; j < SIZE.length; j++) {

			inner_array.push({
			    "num_of_entries" : 0,
			    "TotalTime" : 0,
			    "Send" : 0,
			    "Wait" : 0,
			    "Receive" : 0
			});
		    }
		    data.push(inner_array);
		}

		if (verbose) { console.log("Data double array created"); }
		
		// take queried data and add it to data
		for (var i = 0; i < results.length; i++) {
		    var count = parseInt(results[i]["Count"]);
		    var size = parseInt(results[i]["Size"]);

		    data[count][size].num_of_entries++;
		    data[count][size].TotalTime += results[i]['MAX(TotalTime)'];
		    data[count][size].Send += results[i]['AVG(Send)'];
		    data[count][size].Wait += results[i]['AVG(Wait)'];
		    data[count][size].Receive += results[i]['AVG(Receive)'];
		}		

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
		    
		    for (let j = 0; j < SIZE.length;j++) {

			let entries = data[i][j].num_of_entries;

			let total_time = data[i][j].TotalTime / entries;
			
			row_data.push( total_time  );
			
			row_data.push( "Total Time: " + total_time.toFixed(2) + " ms\n" +
				       "Files: " + COUNT[i] + "\n" +
				       "Number of trials: " + data[i][j].num_of_entries + "\n" +
				       "\n" +
				       "Avg Send: " +
				       (data[i][j].Send / entries).toFixed(2) + " ms\n" +
				       "Avg Wait: " +
				       (data[i][j].Wait / entries).toFixed(2) + " ms\n" +
		 		       "Avg Receive : " +
				       (data[i][j].Receive / entries).toFixed(2) + " ms"
				     );
		    }
		    
		    chart_row_data.push(row_data);
		}

		if (verbose) { console.log("Chart Row data done"); }
		
		HTML += "data.addRows(" + JSON.stringify(chart_row_data) + ");";

		// TODO give more colors choices
		HTML += "var options = {"+
		    "title:'Load time over different number of files in ascending order',"+
		    "hAxis:{title:'Files in Page'},"+
		    "vAxis:{title:'Time (milliseconds)'},"+
		    "colors:['Red','Green','Navy','Purple','DarkOrange','Black','Cyan','SteelBlue','Gold','SpringGreen'],"+
		    "height: 800,"+
		    "pointSize: 5"+
		    "};"+
		    "var chart = new google.visualization.LineChart(document.getElementById('chart_div'));"+
		    "chart.draw(data, options);}"+
		    ""+
		    "google.charts.load('current', {packages: ['corechart', 'line']});"+
		    "google.charts.setOnLoadCallback(drawChart);"+
		    "</script>";

		// TODO check if directory exists and different relavent path
		fs.writeFileSync('./charts/num_files_by_ascending.html', HTML);
		
		return resolve(true);
	    });

    }) // Promise
} // module.export
