// TODO 待完善
(function(win) {
  var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
  var SLASH_RE = /\\\\/g
  function parseDependencies(code) {
    var ret = []
  
    code.replace(SLASH_RE, "")
        .replace(REQUIRE_RE, function(m, m1, m2) {
          if (m2) {
            ret.push(m2)
          }
        })
  
    return ret
  }

  class SimpleSea {
    constructor() {
      this.deps = {}
      this.modules = {}
    }
    // 根据入口加载资源
    use(url) {
      this.request(url)
    }
    request(url) {
      const script = document.createElement('script')
      script.src = url
      document.body.appendChild(script)
      script.onload = () => {
        document.body.removeChild(script)
      }
    }
  }
  var define = function(factory) {
    // 解析转为字符串后的function
    // 目的是为了从里面匹配出require引用的模块路径
    // 也就是它的依赖
    const deps = parseDependencies(factory.toString())
    console.log(deps)
    this.deps[url] = deps
  }
  win.define = define
  win.seajs = new SimpleSea()
})(window)