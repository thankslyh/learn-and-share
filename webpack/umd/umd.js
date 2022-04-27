(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof define === 'function' && define.cmd) {
    define(function(require, exports, module) {
      module.exports = factory()
    })
    // nodejs 
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory()
  } else {
    root.umdModule = factory()
  }
})(this, function(depModule){
  return {
    name: '这是一个UMD模块'
  }
})