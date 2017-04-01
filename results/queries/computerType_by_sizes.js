// Can change different Size and Count intervals here
const SIZE = ["100 KB", "250 KB", "500 KB", "750 KB", "1 MB", "1.5 MB", "2 MB", "2.5 MB", "4 MB", "6 MB", "8 MB"];
const COUNT = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15", "20", "25", "30", "35", "50", "70", "90", "100", "125", "150", "175", "200"];

const ComputerType = ['Desktop' , 'Rpi'];
const count = 6; //TODO SEE COUNT array for number of files


var fs = require("fs");

// used to store HTML string to write to file
// Top part of HTML
// var HTML = "<script type='text/javascript' src='https://www.gstatic.com/charts/loader.js'></script><div id='chart_div'></div> <script>function drawChart(){var data = new google.visualization.DataTable();data.addColumn('string','X');";

//HTML div
var HTML = "<script type='text/javascript' src='https://www.gstatic.com/charts/loader.js'></script> <div id='chart_div'></div>";

HTML += `<img src="http://static.tumblr.com/zsvxup4/NgOm4sea0/it_s_something.png" >`;

HTML += "<script>"; //Begin Chart JS script tag

//Top of Chart
HTML += `google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawTrendlines);

function drawTrendlines() {
      var data = new google.visualization.DataTable();

  data.addColumn('number', 'Website Size');`;

/** Add Rows **/
for (let i = 0; i < ComputerType.length ; i++){
    HTML += `data.addColumn('number', '` + ComputerType[i] + `');`;
}

// Main Function
module.exports = (connection, verbose) => {
    return new Promise(function(resolve, reject) {
	connection.query(
	    `SELECT Website.WebsiteID, Size, Count, Structure, 
             MAX(TotalTime), SUM(ResponseTransferSize), AVG(Send), AVG(Wait), AVG(Receive), ComputerType, RequestUserAgent 
             FROM Website INNER JOIN Entries ON Website.WebsiteID = Entries.WebsiteID  
             WHERE (ResponseContentLength IS NOT NULL) AND (Structure = "a") AND (Count = "` + count + `") 
             GROUP BY WebsiteID;`,
	    (error, results, fields) => {

		if (error) {
		    console.error(error);
		    return reject(false);
		}

		if (verbose) { console.log("Query Successful"); }

            /** PREPARE DOUBLE ARRAY TO STORE DATA **/
            var data = [];
            for (let i = 0; i < SIZE.length; i++){ //Sizes
                let inner_array = [];
                for (let j = 0 ; j < 2; j++){ // computer type 0 = desktop, 1 = pi
                    inner_array.push({
                        'num_entries' : 0,
                        'avg_received' : 0,
                        'avg_sent': 0,
                        'avg_wait': 0,
                        'total_time': 0
                    });

                }
                data.push(inner_array);
            }
             if (verbose) { console.log("2D array for data created"); }


            /** FILL DOUBLE ARRAY WITH QUERY DATA **/
            for (let i = 0; i < results.length; i++){

                var size = parseInt(results[i]['Size']);
                var computerType = results[i]['ComputerType'];

                data[size][computerType].num_entries += 1;
                data[size][computerType].avg_received += results[i]['AVG(Receive)'];
                data[size][computerType].avg_sent += results[i]['AVG(Send)'];
                data[size][computerType].avg_wait+= results[i]['AVG(Wait)'];
                data[size][computerType].total_time += results[i]['MAX(TotalTime)'];
            }
            if (verbose) { console.log("Finished filling 2D array"); }


            /** ADDING DATA TO TABLE **/
            //ROW Format:  [size , Desktop_TotalTime, Rpi_TotalTime]
            let row_data = []

            var chart_row_data = [];

            for (let i = 0 ; i < SIZE.length ; i++){
                let row_data = []
                row_data.push(convertSize(i)); //TODO add actual size
                for(let j =0; j < ComputerType.length; j++){
                    row_data.push(data[i][j].total_time / data[i][j].num_entries); //Add totals for Desktop/Rpi to the row
                }
                chart_row_data.push(row_data);
            }

		if (verbose) { console.log("Chart Row data done"); }

		/** Generate Rows HTML **/
		HTML += "data.addRows(" + JSON.stringify(chart_row_data) + ");";


            //Bottom of HTML
            HTML += `var options = {
        hAxis: {
          title: 'Sizes(in MB)'
        },
        vAxis: {
          title: 'OnLoad Time ms'
        },
        series: {
          1: {curveType: 'function'}
        },
        pointSize: 3,
        height: 1024,
        width:1024,
        colors: ['#AB0D06', '#007329'],
        trendlines: {
          0: {type: 'linear', color: '#333', opacity: 1},
          1: {type: 'linear', color: '#111', opacity: .3}
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }`;

            HTML += "</script>"; //END Chart script tag


            // TODO check if directory exists and different relavent path
		fs.writeFileSync('./charts/computerType_by_sizes.html', HTML);

		return resolve(true);
	    });

    }) // Promise
} // module.export


 function convertSize (number) {

    var size;
    switch(number) {
        case 0:
            size = 0.1;
            break;
        case 1:
            size = .5;
            break;
        case 2:
            size = 1;
            break;
        case 3:
            size = 2;
            break;
        case 4:
            size = 4;
            break;
        case 5:
            size = 8;
            break;
        case 6:
            size = 100;
            break;
        default:
            size = 0;
    }
    // 0 - 100000 bytes (~100 KB)
    // 1 - 500000 bytes (~500 KB)
    // 2 - 1000000 bytes (~1 MB)
    // 3 - 2000000 bytes (~2 MB)
    // 4 - 4000000 bytes (~4 MB)
    // 5 - 8000000 bytes (~8 MB)
    // 6 - 100000000 bytes (~100 MB)

    return size;
}
