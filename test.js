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

var get_location = function(addr, next){
  var params = {
    "address":    addr,
    "language":   "zh_tw",
    "region":     "tw"
  };
  gmAPI.geocode(params, function(err, result){
    next(result);
  });
};

get_location("逢甲大學", function(mylocation){
  console.log(mylocation.results);
});