var myModule = {
  exports: {}
}

function define(factory) {
  factory(myModule);
}

// define((module) => {
//   module.exports = '导出了一个字符串'
// })