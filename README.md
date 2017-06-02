# nodemap_spider [中文文档](README_CN.md)

This is a crawler project for web raster map, implemented by nodejs.

## Similar Project

 - [brandonxiang/pyMap](https://github.com/brandonxiang/pyMap) Raster Map Download Helper by python.
 - [brandonxiang/pyMap_GFW](https://github.com/brandonxiang/pyMap_GFW) Raster Map Download Helper with [selenium](https://github.com/SeleniumHQ/selenium/) and [PhantomJS](http://phantomjs.org/)
 - [brandonxiang/pyMap_webapp](https://github.com/brandonxiang/pyMap_webapp) A webapp version for [pyMap]((https://github.com/brandonxiang/pyMap)
 - [brandonxiang/nodemap_spider](https://github.com/brandonxiang/nodemap_spider) Crawler Project for Raster Map by Electron.
 - [brandonxiang/nodemap](https://github.com/brandonxiang/nodemap) A electron app for [nodemap_spider](https://github.com/brandonxiang/nodemap_spider)

## Usage

Get the map by latitude and longitude of four corners 

```
procesLatlng(23.3488500800, 112.4821141700, 21.6283230000, 115.0540240000, 10, 'gaode', 'gaode')
```

- Parameter One：   Latitude for Northwest
- Parameter Two：   Longitude for Northwest
- Parameter Three： Latitude for Sourtheast
- Parameter Four：  Longitude for Sourtheast
- Parameter Five：  Zoom
- Parameter Six：   output filename
- Parameter Seven： type

Get the map by x-axis and y axis of four corners

```
processTilenum(803, 984, 857, 1061, 8, test, default)
```

- Parameter One：   x-axis for Northwest
- Parameter Two：   y-axis for Northwest
- Parameter Three： x-axis for Sourtheast
- Parameter Four：  y-axis for Northeast
- Parameter Five：  Zoom
- Parameter Six：   output filename
- Parameter Seven： type

## License

[MIT](LICENSE)