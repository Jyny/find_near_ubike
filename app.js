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

var get_site_data = function(next){
    var sitedatas = [];
    fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', function(data){
        sitedatas.push(data);
        //console.log(data);
    })
    .on('end', function() {
        next(sitedatas);
    });
};

var get_near_site = function(addr, next){
    get_location(addr, function(mylocation){
        get_site_data(function(sitedatas){
            var dist = function(x1, y1, x2, y2) {
                return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2); 
            };
            for(var site of sitedatas){
                site.distance = dist(mylocation.longitude, mylocation.latitude, site.lng, site.lat);
            }
            sitedatas.sort(function(a,b){
                return a.distance - b.distance;         
            });
            
            var near_sites = sitedatas.slice(0,6);
            async.each(near_sites, function(site, next){
                var params = {
                    origin: mylocation.latitude + ',' + mylocation.longitude,
                    destination: site.lat + ',' + site.lng,
                    mode: 'walking',
                    language: 'zh_tw'
                };
                gmAPI.directions(params, function(err, res){
                    if (!err)
                        site.duration = res.routes[0].legs[0].duration;
                    next(err);
                });
            }, function(err) {
                near_sites.sort(function (a, b) {return a.duration - b.duration;});
                next(mylocation, near_sites);
            });
        });
    });
};

module.exports = function(addr, next){
    get_near_site(addr, function(mylocation, near_sites){
        next(mylocation, near_sites);
    });
};

/*get_near_site("台灣大學", function(mylocation, near_sites){
    console.log(mylocation);
    console.log(near_sites);
});*/
