# nodemap_spider
A Spider for web map


# Node.js 笔记五：nodemap-spider

>源码github地址在此，记得点星：
https://github.com/brandonxiang/nodemap_spider

> 灵感来自[pyMap](http://www.jianshu.com/p/a3b2e01f602f)，这个库它的nodejs实现。我在这个库的构建当中感受到nodejs异步的魅力还有麻烦。

我采用了node-image实现拼图功能，但是发现内存占有甚至比python还多。不知道是不是应该换一个图像处理的库。

## 原理

参考[pyMap](http://www.jianshu.com/p/a3b2e01f602f)的原理。

## 用法

硬编码，改文件内容。

```
procesLatlng(23.3488500800, 112.4821141700, 21.6283230000, 115.0540240000, 10, 'gaode', 'gaode')
```

- 参数一： 西北角维度
- 参数二： 西北角经度
- 参数三： 东南角维度
- 参数四： 东南角经度
- 参数五： 级别
- 参数六： 输出文件名
- 参数七：地图类型

## TODO

运用一个更加节省内存的图像处理库

转载，请表明出处。[总目录Awesome GIS](http://www.jianshu.com/p/3b3efa92dd6d)
转载，请表明出处。[总目录前端经验收集器](http://www.jianshu.com/p/c1e3b96c1293)
