module.exports = (connection) => {
    return new Promise(function(resolve, reject) {
	connection.query("SELECT ObjectType, Size FROM Website WHERE WebsiteID = 282;", (error, results, fields) => {

	    console.log("RUN 3");
	    if (error) {
		console.error(error);
		return reject(false);
	    }       

	    return resolve(results);
	});

    })
}
