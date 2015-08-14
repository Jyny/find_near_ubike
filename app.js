var geocoderProvider = 'google';
var httpAdapter = 'http';
var extra = {};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

var fs = require('fs');
var csv = require(('csv-parser'));
var async = require('async');
var GoogleMapsAPI = require('googlemaps');

var config = {
    'key': '',
    'google_client_id':   '', //optional
    'stagger_time':       1000, //optional
    'encode_polylines':   false,
    'secure':             true, // use https
    'proxy':              '', // optional
    'google_private_key': '' // to use maps for Work
};
var gmAPI = new GoogleMapsAPI(config);

var get_location = function(addr, next) {
    geocoder.geocode(addr, function(err, location){
        next(location[0]);
    });
};

var get_site_data = function(filename, next){
    var sitedatas = [];
    fs.createReadStream(filename)
    .pipe(csv())
    .on('data', function(data){
        sitedatas.push(data);
        //console.log(data);
    })
    .on('end', function() {
        next(sitedatas);
    });
};

var get_near_site = function(sitedatas, addr, next){
    get_location(addr, function(mylocation){
        var distance = function(site) {
            var f = function(x1, y1, x2, y2) {
                return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            };
            return f(mylocation.longitude, mylocation.latitude, site.lng, site.lat);
        };

        sitedatas.sort(function(a,b){
            return distance(a) - distance(b);
        });

        var near_sites = sitedatas.slice(0,6);

        async.map(near_sites, function(site, next){
            var params = {
                origin: mylocation.latitude + ',' + mylocation.longitude,
                destination: site.lat + ',' + site.lng,
                mode: 'walking',
                language: 'zh_tw'
            };
            gmAPI.directions(params, function(err, res){
                if (err)
                    next(err, null);
                next(err, {
                    duration: res.routes[0].legs[0].duration,
                    station_name: site['sna (station name)']
                });
            });
        }, function(err, res) {
            res.sort(function (a, b) {return a.duration - b.duration;});
            next(err, res);
        });
    });
};

module.exports = {
    get_site_data: get_site_data,
    get_near_site: get_near_site
};
