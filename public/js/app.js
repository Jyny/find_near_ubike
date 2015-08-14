/*global $:false */
var get_near_site = function(addr, next) {
    $.ajax({
        url: '/near_sites',
        data: {'addr': addr},
        dataType: 'json',
        success: function(data, status, xhr){
            next(data);
        }});
};

$('#resultModal').on('show.bs.modal', function(event) {
    var modal = $(this);
    get_near_site($('#target').val(), function(res) {
        var station_name = res.station_name;
        var duration = res.duration.text;
        var title = station_name + "⇒ 步行約 " + duration;
        var embeded =
            (['<p>',
             '<img src="http://ntpc.youbike.com.tw/ntpc/photos/logo/logo.png" alt="YouBike logo" id="logo">',
             '<b>', station_name, " ⇒ 步行約 ", duration, '</b>',
             '</p>'
            ]).join('');
        modal.find('.modal-title').text(title);
        modal.find('.modal-body textarea').text(embeded);
    });
});
