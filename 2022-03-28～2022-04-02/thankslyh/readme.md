# 模块化发展史
主要分为IIFE、AMD、CMD、CommonJS、UMD、webpack（require.ensure）、ES Module `<script type="module"></script>`

为什么要模块化？

1. 避免变量污染
2. 复用代码
3. 隔离作用域

## IIFE
``` javascript
// 自执行函数，变量只在函数体内生效，隔离了作用域;互不影响
(function(win) {
  var a = 1
  win.test1A = a
})(window)

(function(win) {
  var a = 2
  win.test2A = a
})(window)
```

## requireJS AMD(Asynchronous Module Definition)
``` javascript
// main.js 注册模块的方法
requirejs.config({
  baseUrl: '',
  paths: {
    say: 'js/say',
  }
})
// 引用say方法
require(['say'], (say) => {
  say('hello');
});

// say.js 定义方法
define([''], function () {
  return (word) => {
    console.log(word)
  }
});
```
特点：

1. 依赖提前声明好
2. 比起IIFE更好维护，可寻踪方法是在哪个文件

核心原理：根据定义的工具(config方法传递的)的js文件地址，动态生成script加载对应js，得到其方法缓存到一个对象里以paths的name为key，等到require的时候找到这个方法
```javascript
// 用上面的demo举例就是
// 1. 动态生成script加载js/say
const script = documnet.createElemment('script').src = 'js/say.js'
document.head.append(script)
// 这个时候系统会去执行这个该js，也就是define(xxx)
var modules = {}
function define(deps, factory) {
  // deps是这个工具所依赖的其他工具，暂不用管
  modules.say = factory()
}
// require的时候
function require(deps, callback) {
  const id = deps.pop()
  // 根据id找到模块方法，并当作参数传出去
  callback(modules[id])
}
```

## seaJS CMD(Common Module Definition)
```javascript
// 定义
seajs.config({

  // 设置路径，方便跨目录调用
  paths: {
    'arale': 'https://a.alipayobjects.com/arale',
    'jquery': 'https://a.alipayobjects.com/jquery'
  },

  // 设置别名，方便调用
  alias: {
    'class': 'arale/class/1.0.0/class',
    'jquery': 'jquery/jquery/1.10.1/jquery'
  }

});

// 使用
define(function(require, exports, module) {
  var jquery = require('jquery')
  // doSomeThings
});
```
特点：

1. 使用时在进行创建script保存变量方法

与requireJS不同点
```javascript
// 它的创建script是在require里
// 她在define或config里只存方法址
exports = function () {
  
}

```
