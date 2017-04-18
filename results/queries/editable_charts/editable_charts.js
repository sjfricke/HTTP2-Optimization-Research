// Can change different Size and Count intervals here
const SIZE = ["100 KB", "250 KB", "500 KB", "750 KB", "1 MB", "1.5 MB", "2 MB", "2.5 MB", "4 MB", "6 MB", "8 MB"];
const COUNT = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15", "20", "25", "30", "35", "50", "70", "90", "100", "125", "150", "175", "200"];
const OBJECTSTRUCTURE = ['a', 'b', 'c', 'd'];


var fs = require("fs");


// Top part of HTML


/** HEADER **/
HTML = `<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>`; //CHARTS loader
HTML += `<script type="text/javascript" src="https://www.google.com/jsapi"></script>`; //JS API
HTML+= `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>`; //jQuery
HTML += `<ul id="series" style="list-style: none">`;

/** GENERATE HTML AND CHECKBOXES **/
//objectOrder vs Sizes
var count = 0;
    for (let i = 0; i < OBJECTSTRUCTURE.length; i++){         // Iterate through count

        HTML +=  `<li><input type="checkbox" name="series" value="` +  count + `" checked="true" />` + objOrder(OBJECTSTRUCTURE[i]) + `</li>`;
        HTML += "<br>";
        count++;

}

HTML += `</ul><div id="chart_div"></div>`; // DIV FOR CHART TO LOAD INTO



HTML += `<script>`;

HTML += `google.load('visualization', '1', {packages: ['corechart']});
google.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();`;


HTML+= `data.addColumn('number', 'Item');`;

//TODO FIX COLUMNS THAT BELONG TO EACH DATA SET
var ss = []; //no need of zero(count) b/c javascript already adds it in html site
var asc = [];
var desc = [];
var rand = [];
var row_id = 1;

// add column for each count value
for (let i = 0; i < OBJECTSTRUCTURE.length; i++){
    for (let j = 0; j < SIZE.length; j++) {
        //separates number of columns belonging to each structure type to be able to
        if (i == 0){ss.push(row_id);row_id++; ss.push(row_id);row_id++;}
        if (i == 1){asc.push(row_id);row_id++; asc.push(row_id);row_id++;} //
        if (i == 2){desc.push(row_id);row_id++; desc.push(row_id);row_id++;}
        if (i == 3){rand.push(row_id);row_id++; rand.push(row_id);row_id++;}
        //Add column to table
        HTML += "data.addColumn('number', '" + objOrder(OBJECTSTRUCTURE[i]) +' - ' + SIZE[j] + "');data.addColumn({type: 'string', role: 'tooltip'});"
        }
}

// Main Function
module.exports = (connection, verbose) => {
    return new Promise(function(resolve, reject) {
        connection.query(
            `SELECT Website.WebsiteID, Size, Count, Structure, 
             MAX(TotalTime), AVG(Send), AVG(Wait), AVG(Receive) 
             FROM Website INNER JOIN Entries ON Website.WebsiteID = Entries.WebsiteID  
             WHERE (ResponseContentLength IS NOT NULL)
             GROUP BY WebsiteID;`,
            (error, results, fields) => {

                if (error) {
                    console.error(error);
                    return reject(false);
                }

                if (verbose) {
                    console.log("Query Successful");
                }

                // Data needs to be sorted by both 'Size' and 'Count'
                // Need Ave.Send, Ave.Wait, and Ave.Receive for tooltips

                // hold double array of data in object form
                // data[COUNT][SIZE] = { }

                var data = []; // holds all the info

                for (let i = 0; i < OBJECTSTRUCTURE.length; i++) {
                    let outer_array = [];
                    for (let j = 0; j < COUNT.length; j++) {
                        let inner_array = []
                        for (let k = 0; k < SIZE.length; k++) {
                            inner_array.push({
                                "num_of_entries": 0,
                                "TotalTime": 0,
                                "Send": 0,
                                "Wait": 0,
                                "Receive": 0,
                                "Order": i //Order of sites
                            });

                        }
                        outer_array.push(inner_array);
                    }
                    data.push(outer_array);
                }

                if (verbose) {
                    console.log("Data double array created");
                }

                // take queried data and add it to data
                for (var i = 0; i < results.length; i++) {
                    var count = parseInt(results[i]["Count"]);
                    var size = parseInt(results[i]["Size"]);

                    var order = parse_obj_order(results[i].Structure);

                    data[order][count][size].num_of_entries++;
                    data[order][count][size].TotalTime += results[i]['MAX(TotalTime)'];
                    data[order][count][size].Send += results[i]['AVG(Send)'];
                    data[order][count][size].Wait += results[i]['AVG(Wait)'];
                    data[order][count][size].Receive += results[i]['AVG(Receive)'];
                }

                if (verbose) {
                    console.log("Query results sorted out");
                }

                // Need to no calculate data as its formated to Google Chart Row format

                var chart_row_data = [];
                /*
                 * Data row format:
                 * ["<COUNT[i]>", <totalTime_1>, <toolTipData_1>, <totalTime_2>, <toolTipData_2>, ... ]
                 * Where _1 is the first column of data for COUNT[i]
                 */


                //add values in order of ss, asc, desc, rand
                //Arrays to update values

                    for (let i = 0; i < COUNT.length; i++) {
                        let row_data = [parseInt(COUNT[i])]; //parseInt if X row is number and continuous
                        for(let j = 0; j < OBJECTSTRUCTURE.length; j++){

                            for (let k = 0; k < SIZE.length; k++) {

                                // want to add items in this order: // [count, ss1, ss1_tip, ss2, ss2_tip asc1, asc1_tip, asc2_asc_2tip]
                                let entries = data[j][i][k].num_of_entries; //NOTE ORDER [STRUCTURE][COUNT][SIZE]
                                let total_time = data[j][i][k].TotalTime / entries;

                                row_data.push(total_time);
                                //TOOL TIP
                                row_data.push("Total Time: " + total_time.toFixed(2) + " ms\n" +
                                    "Files: " + COUNT[i] + "\n" +
                                    "Number of trials: " + data[j][i][k].num_of_entries + "\n" +
                                    "\n" +
                                    "Avg Send: " +
                                    (data[j][i][k].Send / entries).toFixed(2) + " ms\n" +
                                    "Avg Wait: " +
                                    (data[j][i][k].Wait / entries).toFixed(2) + " ms\n" +
                                    "Avg Receive : " +
                                    (data[j][i][k].Receive / entries).toFixed(2) + " ms"
                                );
                            }
                        }
                        chart_row_data.push(row_data);
                    }

                if (verbose) { console.log("Chart Row data done"); }


                /** DONE CRETING ROWS **/
                HTML += "data.addRows(" + JSON.stringify(chart_row_data) + ");";


                //ADD options
                HTML += "var options = {"+
                    "title:'Load time over different number of files',"+
                    "hAxis:{title:'Files in Page'},"+
                    "vAxis:{title:'Time (milliseconds)'},"+
                    "colors:['Red','Green','Navy','Purple','DarkOrange','Black','Cyan','SteelBlue','Gold','SpringGreen'],"+
                    "height: 1200,"+
                    "width:1200,"+
                    "explorer: {},"+
                    "pointSize: 5,"+
                    "strictFirstColumnType: true"+
                    "};";


                /** GOOGLE VISUALIZATION AND CHARTS **/
                HTML += `
    var view = new google.visualization.DataView(data);
    
    var chart = new google.visualization.LineChart($('#chart_div')[0]);
    chart.draw(view, options);`


                    /** HTML TO UPDATE CHECKBOXES **/


// HTML +=`$('#series').find(':checkbox').change(function () {
//         var cols = [0];
//         $('#series').find(':checkbox:checked').each(function () {
//             console.log(this);
//             //let structure = parseInt($(this).attr('value'));
//             //if(structure == 0){cols.concat(ss)};
//             //if(structure == 1){cols.concat(asc)};
//             //if(structure == 2){cols.concat(desc)};
//             //if(structure == 3){cols.concat(rand)};
//
//         });
//         view.setColumns(cols);
//         chart.draw(view, options);
//     });
// }`;

    HTML +=`$('#series').find(':checkbox').change(function () {
        var cols = [0];` +
        `var ss =` + JSON.stringify(ss) + `;` +
        `var asc = `+ JSON.stringify(asc) + `;` +
        `var desc = `+ JSON.stringify(desc) + `;` +
        `var rand = `+ JSON.stringify(rand) + `;` +
        `$('#series').find(':checkbox:checked').each(function () {
            console.log(this);
            //cols.push(parseInt($(this).attr('value')));
            let v = parseInt($(this).attr('value'));
            if(v == 0){cols = cols.concat(ss);}
            if(v == 1){cols = cols.concat(asc);}
            if(v == 2){cols = cols.concat(desc);}
            if(v == 3){cols = cols.concat(rand);}
            
            
            
        });
        view.setColumns(cols);
        chart.draw(view, options);
    });
}`;
//     HTML +=`$('#series').find(':checkbox').change(function () {
//         var cols = [0];
//         $('#series').find(':checkbox:checked').each(function () {
//             console.log(this);
//             cols.push(parseInt($(this).attr('value')));
//         });
//         view.setColumns(cols);
//         chart.draw(view, options);
//     });
// }`;

                //END JAVASCRIPT
                HTML += `</script>`;

                // TODO check if directory exists and different relavent path
                fs.writeFileSync('./charts/editable_charts.html', HTML);

                return resolve(true);
            });

    }) // Promise
} // module.export

function objOrder(character){

    var order = '';
    switch(character){

        case 'a':
            order = 'SS';
            break;
        case 'b':
            order = 'Asc';
            break;
        case 'c':
            order = 'Desc';
            break;
        case 'd':
            order = 'Rand';
            break;
        default:
            order = 'error';
    }

    return order;
}

function parse_obj_order(character){

    var order = 0;
    switch(character){

        case 'a':
            order = 0;
            break;
        case 'b':
            order = 1;
            break;
        case 'c':
            order = 2;
            break;
        case 'd':
            order = 3;
            break;
        default:
            order = -1 ;
    }

    return order;
}

// a - Same Size
// Each file is Size / Count
// b - Ascending Order
// c - Descending Order
// d - Random