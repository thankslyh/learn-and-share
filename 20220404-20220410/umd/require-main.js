requirejs.config({
  baseUrl: '',
  paths: {
    'umd': './umd.js'
  }
})

define(['umd'], function(test) {
  console.log(test)
});