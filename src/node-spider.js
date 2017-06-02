const fs = require('fs')
const path = require('path')
const http = require('http')
const lwip = require('lwip')
const async = require('async')


const URL = {
    'gaode': 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
    'gaode.image': 'http://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    'tianditu': 'http://t2.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}',
    'googlesat': 'http://khm0.googleapis.com/kh?v=203&hl=zh-CN&&x={x}&y={y}&z={z}',
    'tianditusat': 'http://t2.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}',
    'esrisat': 'http://server.arcgisonline.com/arcgis/rest/services/world_imagery/mapserver/tile/{z}/{y}/{x}',
    'gaode.road': 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
    'default': 'http://61.144.226.124:9001/map/GISDATA/WORKNET/{z}/{y}/{x}.png'
}

const procesLatlng = function (north, west, south, east, zoom, output, maptype) {
    output = output || 'mosaic'
    maptype = maptype || 'default'

    var left_top = latlng2tilenum(north, west, zoom)
    var right_bottom = latlng2tilenum(south, east, zoom)
    processTilenum(left_top[0], right_bottom[0], left_top[1], right_bottom[1], zoom, output, maptype)
}


const processTilenum = function (left, right, top, bottom, zoom, output, maptype) {
    output = output || 'mosaic'
    maptype = maptype || 'default'
    checkout(left, right, top, bottom, zoom, output, maptype)

}

const download = function (left, right, top, bottom, z, filename, maptype) {
    maptype = maptype || 'default'
    for (var x = left; x < right + 1; x++) {
        for (var y = top; y < bottom + 1; y++) {
            var pathname = 'tiles/{filename}/{z}/{x}/{y}.png'.format({ x: x, y: y, z: z, filename: filename })
            _download(x, y, z, pathname, maptype)

        }
    }
}

const _download = function (x, y, z, filename, maptype) {
    var url = URL[maptype].format({ x: x, y: y, z: z, s: random(1, 4) })
    var pathname = path.dirname(filename)
    mkdirsSync(pathname)
    if (!fs.existsSync(filename)) {
        http.get(url, function (res) {

            var imgData = ''
            res.setEncoding('binary')
            res.on('data', function (chunk) {
                imgData += chunk
            })
            res.on('end', function () {
                fs.writeFile(filename, imgData, 'binary', function (err) {
                    if (err) {
                        throw new Error('Network Error, Fail to download')
                    }
                })
            })
        })
    }
}

const latlng2tilenum = function (lat_deg, lng_deg, zoom) {
    var n = Math.pow(2, zoom)
    var xtile = ((lng_deg + 180) / 360) * n
    var lat_rad = lat_deg / 180 * Math.PI
    var ytile = (1 - (Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI)) / 2 * n
    return [Math.floor(xtile), Math.floor(ytile)]
}

const random = function (start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start
}

const checkout = function (left, right, top, bottom, z, filename, maptype) {
    maptype = maptype || 'default'
    var tasks = []
    for (let x = left; x < right + 1; x++) {
        for (let y = top; y < bottom + 1; y++) {
            tasks.push(checkoutSingle(x, y, z, filename, maptype))
        }
    }

    Promise.all(tasks).then(function () {
        mosaic(left, right, top, bottom, z, filename, maptype)
    })
}

const checkoutSingle = function (x, y, z, filename, maptype) {
    var pathname = 'tiles/{filename}/{z}/{x}/{y}.png'.format({ x: x, y: y, z: z, filename: filename })
    var abspath = path.resolve(pathname)

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(abspath)) {
            _download(x, y, z, pathname, maptype)
        } else {
            fs.stat(abspath, function (err, stats) {
                if (err) {
                    _download(x, y, z, pathname, maptype)
                    reject(err)
                    return
                }
                if (!stats.size) {
                    fs.unlinkSync(path)
                    _download(x, y, z, pathname, maptype)
                }
            })
        }
        resolve()
    })
}

String.prototype.format = function (json) {
    var temp = this
    for (var key in json) {
        temp = temp.replace('{' + key + '}', json[key])
    }
    return temp
}

const mkdirsSync = function (dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp
        dirpath.split('/').forEach(function (dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname)
            } else {
                pathtmp = dirname
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false
                }
            }
        })
    }
    return true
}


const mosaic = function (left, right, top, bottom, zoom, output, filename) {
    const sizeX = (right - left + 1) * 256
    const sizeY = (bottom - top + 1) * 256
    mkdirsSync('output')

    const tasks = []

    for (let x = left; x < right + 1; x++) {
        for (let y = top; y < bottom + 1; y++) {
            tasks.push(cloneImage(x, y, left, top, zoom, filename))
        }
    }

    Promise.all(tasks)
        .then(function (clones) {
            lwip.create(sizeX, sizeY, function (err, canvas){
                if(err) throw new Error(err)

                 async.eachSeries(clones, function (clone, callback) {
                    canvas.paste(clone.pasteX, clone.pasteY, clone.image, callback)
                }, function(err) {
                    if (err) throw new Error(err)

                    canvas.writeFile('output/' + output + '.png', function(err) {
                        if (err) throw new Error(err)
                    })
                })
            })
        })

}

const cloneImage = function (x, y, left, top, zoom, filename) {
    return new Promise(function (resolve, reject) {
        var pathname = 'tiles/{filename}/{z}/{x}/{y}.png'.format({ x: x, y: y, z: zoom, filename: filename })
        lwip.open(pathname, function (err, image) {
            if (err) reject(err)

            resolve({ image, pasteX: 256 * (x - left), pasteY: 256 * (y - top) })
        })
    })
}

module.exports = {
    procesLatlng,
    processTilenum
}