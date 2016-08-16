var fs = require('fs');
var request = require('request');
var util = require('util');


URL = {
    "gaode": "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
    "gaode.image": "http://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    "tianditu": "http://t2.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
    "googlesat": "http://khm0.googleapis.com/kh?v=203&hl=zh-CN&&x={x}&y={y}&z={z}",
    "tianditusat": "http://t2.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
    "esrisat": "http://server.arcgisonline.com/arcgis/rest/services/world_imagery/mapserver/tile/{z}/{y}/{x}",
    "gaode.road": "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    "default": "http://61.144.226.124:9001/map/GISDATA/WORKNET/{z}/{y}/{x}.png"
}




var download = function(left, right, top, bottom, z, filename, maptype){
    maptype = maptype||"default";
     for (var x = left; x < right+1; x++) {
         for (var y = top; y < bottom+1; y++) {
             var path =  './tiles/{filename}/{z}/{x}/{y}.png'.format({x:x,y:y,z:z,filename:filename});
             if(fs.accessSync(path)){
                 _download(x,y,z,filename,maptype);
             }
         }
     }
}

var _download = function (x, y, z, filename, maptype) {
    var filepath = "./tiles/test.png"
    var url= URL[maptype].format({x:x,y:y,z:z});
    request.head(url, function (err, res, body) {
        if (err) {
            console.log('err:' + err);
        }
        request(url).pipe(fs.createWriteStream(filepath));
    });
};

String.prototype.format = function(json){
    var temp = this;
    for(var key in  json){
        temp = temp.replace("{"+key+"}",json[key]);
    }
    return temp;
}

_download();