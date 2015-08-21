var app = require('./app.js');
var express = require('express');
var web_app = express();

web_app.use('/', express.static('public'));

var near_sites_handler = function(sitedatas) {
    return function (req, res){
        app.get_near_site(sitedatas, req.query.addr,
            function(err, near_sites){
                res.setHeader('Content-Type', 'application/json');
                res.send(near_sites[0]);
            });
    };
};

web_app.get('/usage_stat/', function(req, res) {
    app.get_usage_stat(function(err, usage) {
        res.setHeader('Content-Type', 'application/json');
        res.send(usage);
    });
});

app.get_site_data('data.json', function(err, sitedatas) {
    web_app.get('/near_sites/', near_sites_handler(sitedatas));
    web_app.listen(8080);
});
