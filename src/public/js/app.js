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

var get_usage_stat = function(next) {
    $.ajax({
        url: '/usage_stat',
        data: {},
        dataType: 'json',
        success: function(data, status, xhr){
            next(data);
        }});
};

get_usage_stat(function(usage) {
    var stat = [];
    for (var loc in usage) {
        stat.push([
            '<p>',
            '<b>', loc, '</b>', '<br/>',
            usage[loc].ride, '人騎乘',
            '</p>'
            ].join(''));
    }
    $('#usage_stat').append(stat.join(''));
});

$('#resultModal').on('show.bs.modal', function(event) {
    var modal = $(this);
    get_near_site($('#target').val(), function(res) {
        var station_name = res.station_name;
        var duration = res.duration.text;
        var station_no = res.station_no;
        var link = 'http://taipei.youbike.com.tw/en/f11.php?sno=' + station_no;
        var title = station_name + "⇒ 步行約 " + duration;
        var embeded =
        (['<p>',
         '<img src="http://ntpc.youbike.com.tw/ntpc/photos/logo/logo.png" alt="YouBike logo" id="logo">',
         '<a href="', link, '">',
         '<b>', station_name, " ⇒ 步行約 ", duration, '</b>',
         '</a>',
         '</p>'
         ]).join('');
        modal.find('.modal-title').text(title);
        modal.find('.modal-body textarea').text(embeded);
    });
});

document.querySelector('#copybutton').addEventListener('click', function(event) {
    document.querySelector('#copytextarea').select();
    document.execCommand('copy');
});

$(window).load(function(){
    $("#target").focus();
});
$(window).click(function(){
    $("#target").focus();
});
