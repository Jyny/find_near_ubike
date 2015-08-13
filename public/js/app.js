get_near_site = function(addr, next) {
  $.ajax({
    url: '/near_sites',
    data: {'addr': addr},
    dataType: 'json',
    success: function(data, status, xhr){
      next({
        station_name: data['near_sites'][0]['sna (station name)'],
        duration: data['near_sites'][0]['duration']['text']
      });
    }});
}

$('#resultModal').on('show.bs.modal', function(event) {
  var modal = $(this);
  get_near_site($('#target').val(), function(res) {
    var title = res['station_name'] + "⇒ 步行約 " + res["duration"];
    var embeded =
      '<p>' + '<img src="http://ntpc.youbike.com.tw/ntpc/photos/logo/logo.png" alt="YouBike logo" id="logo">'
      + '<b>' + res['station_name'] + " ⇒ 步行約 " + res["duration"] + '</b>' + '</p>';
    modal.find('.modal-title').text(title);
    modal.find('.modal-body textarea').text(embeded);
  });
});
