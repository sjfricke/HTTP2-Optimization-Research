var chc = require('chrome-har-capturer');
var c = chc.load(['https://http2optimization.com/W_0_3_a/']);
c.on('connect', function () {
    console.log('Connected to Chrome');
});
c.on('end', function (har) {
    har.log.entries.forEach(function(element, index) {
	console.log("index: ", index, " => ", element.response._transferSize);
    });
});
c.on('error', function (err) {
    console.error('Cannot connect to Chrome: ' + err);
});
