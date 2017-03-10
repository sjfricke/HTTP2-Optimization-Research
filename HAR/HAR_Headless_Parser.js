var fs = require('fs');
var chc = require('chrome-har-capturer');
var c = chc.load(['https://http2optimization.com/']);
c.on('connect', function () {
    console.log('Connected to Chrome');
});
c.on('end', function (har) {
    fs.writeFileSync('test.har', JSON.stringify(har));
});
c.on('error', function (err) {
    console.error('Cannot connect to Chrome: ' + err);
});
