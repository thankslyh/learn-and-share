## UMD (Universal Module Definition) 流行模块定义
思考几个问题
1. 我引用一个第三方库，我该使用AMD规范 or CMD规范？
2. 假如这个模块既不是AMD也不是CMD该怎么办？

UMD包的规范就是满足流行模块使用的定义

```javascript
(function(root, factory) {
  // 如果当前环境是amd
  if (typeof define === 'function' && define.amd) {
    define(factory)
    // 如果当前环境是cmd
  } else if (typeof define === 'function' && define.cmd) {
    define(function(require, exports, module) {
      module.exports = factory()
    })
  } else {
    root.umdModule = factory()
  }
})(this, function(depModule){
  return {
    name: '这是一个UMD模块'
  }
})
```