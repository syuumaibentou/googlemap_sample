ons.bootstrap();

var map;
ons.ready(function() {
    myModal.show(); 
    
    // 高精度の位置情報を要求する(衛生による測位)
    var options = {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(function(position) {
        createMap(position);
    }, 
    function(result) {
        myModal.hide();
        onError(result);
    }, options);
        
    $(document).on('click', '.put-marker', function() {
        putMarker();
    });
});

function createMap(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
    // 地図のズーム値、センター位置、タイプを指定
    var mapOption = {
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    // 地図を作成
    map = new google.maps.Map($('#map')[0], mapOption);
    google.maps.event.addListener(map, "tilesloaded", function() {
        myModal.hide();
    })
};

function putMarker() {
    if (map) {
        var options = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
        navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = new google.maps.Marker({position: latlng, map: map});
        }, onError, options);
    }
}

function onError(positionError) {
    var code = positionError.code;
    switch(code) {
        case 1:
            errorMessage = '位置情報の取得がユーザーによって許可されていません。';
            break;
        case 2:
            errorMessage = '位置情報の取得が行えません。';
            break;
        case 3:
            errorMessage = '時間切れです。位置情報が利用出来ない可能性があります。';
            break;
        default:
            errorMessage = 'エラーが発生しました。' + code;
    }
    ons.notification.alert({ message: errorMessage });
};
