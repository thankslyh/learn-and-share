## 回顾
AMD：代表是requireJs，它的特点是异步模块定义，模块在定义的时候也就被加载了
CMD：代表是seaJs，它的特点是按需加载，在真正require的时候被引入加载
CommonJs：nodeJs的模块加载，它的特点是给js代码增加上下文，以用node 的 runInThisContext执行
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

> 如何实现umd的commonjs规范？
```
综上所述UMD其实是一种规范，它兼容了AMD、CMD、Commonjs等各种规范

## esModule
1. 运行时执行js
2. live binding
3. 摇树机制（后续补充）

我们先看入口文件
```javascript
// startup
// Load entry module and return exports
// This entry module can't be inlined because the eval devtool is used.
var __webpack_exports__ = __webpack_require__("./index.js");


// 全局缓存变量
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {
	// 检查是否存在缓存，目的是有缓存可以直接用
	var cachedModule = __webpack_module_cache__[moduleId];
	if (cachedModule !== undefined) {
		return cachedModule.exports;
	}
	// 创建一个module，并放入缓存
	var module = __webpack_module_cache__[moduleId] = {
		// no module.id needed
		// no module.loaded needed
		exports: {}
	};

	// 执行该module的js代码
  // 第一个参数是this
  // 第二个参数是该模块
  // 第三个参数是要导出的东西
  // 第四个参数是require函数，也就是当前模块
	__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	// 返回导出的模块
	return module.exports;
}
```
在我们接着着理解上面的调用之前先看一个demo
```javascript
var obj1 = {
  a: 1
}
function testEval() {
  var evalObj = {
    name: '这是一个eval'
  }
  eval("console.log(evalObj)") // {name: '这是一个eval'}
  eval("console.log(obj1)") // {a: 1}
}
testEval()
```
通过这个例子我们了解到`eval`执行代码时，代码的上下文和`eval`所处于同一个上下文,它的变量查找符合作用域链
<br />
<br />

接下来我们看被调用的这个js，代码如下
```javascript
// 代码有删减
// 我们可以看到上面`__webpack_require__`调用的其实index.js的值，它是一个函数
var __webpack_modules__ = ({
  "./index.js":((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    "use strict";
    eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _todo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todo */ \"./todo.js\");\n/* harmony import */ var _umd_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./umd.js */ \"./umd.js\");\n/* harmony import */ var _umd_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_umd_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common.js */ \"./common.js\");\n/* harmony import */ var _common_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_common_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n(0,_todo__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(_todo__WEBPACK_IMPORTED_MODULE_0__.b)\n\nconsole.log(_umd_js__WEBPACK_IMPORTED_MODULE_1__)\nconsole.log((_common_js__WEBPACK_IMPORTED_MODULE_2___default()))\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  name: '这是根模块'\n});\n\n//# sourceURL=webpack:///./index.js?");
  }),
  "./todo.js": "./todo.js":((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"b\": () => (/* binding */ b),\n/* harmony export */   \"default\": () => (/* binding */ todo),\n/* harmony export */   \"todo2\": () => (/* binding */ todo2)\n/* harmony export */ });\nfunction todo(somethings) {\n  console.log(somethings)\n}\n\nconst b = 2\n\nfunction todo2 (somethings) {\n  console.log(somethings)\n}\n\n//# sourceURL=webpack:///./todo.js?");

  })
  });
// __webpack_require__.r(__webpack_exports__);
// 我么可以看到他的第一段代码是执行了__webpack_require__.r

// eval todo格式化之后的代码
// `__webpack_require__.d(__webpack_exports__, {
  //               "b": () => (b),
  //               "default": () => (todo) 
  //               });
  //               function todo(somethings) {
  //                   console.log(somethings)
  //               }
  //               const b = 2`
```
接下来我们来看这个`__webpack_require__.r`

```javascript
// 給模块增加类型定义该模块为esModule
__webpack_require__.r = (exports) => {
  if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    // 这一块我理解是规范，类似于Map
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  }
  Object.defineProperty(exports, '__esModule', { value: true });
};
```
上面我们知道了`__webpack_require__.r`只是给`exports`增加了个标示(作用后面讲)和规范，那我们接下来看下一个函数`__webpack_require__.d`和它内部的`__webpack_require__.o`,代码如下：

```javascript
// d函数
// 从代码我们可以看出d函数主要作用是给exports增加了getter
// 目的是为了live binding
// 最中我们在使用变量的时候都会触发这个getter
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
		}
	}
};
// o函数
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
```

在这里已经给exports完成了赋值，在`__webpack_require__`里返回了，这是esModule加载esModule，那他是怎么加载其他模块的呢？
<br>
<br>

加载commonjs代码如下：
```javascript
// indexjs 引入 commonjs
var _common_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common.js */ \"./common.js\");

// commonjs 函数
// 我们回一下这个module其实就是第一个尝试，也就是__webpack_require__调用这个commonjs的时候传入的第二个参数
{"./common.js": ((module) => {

  eval("module.exports = {\n  name: '这是一个commonjs模块'\n}\n\n//# sourceURL=webpack:///./common.js?")
 })
}

// index对commonjs导出变量的使用
var _common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./common.js");
var _common_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_common_js__WEBPACK_IMPORTED_MODULE_0__);
console.log((_common_js__WEBPACK_IMPORTED_MODULE_0___default()))

// __webpack_require__.n 函数的作用
__webpack_require__.n = (module) => {
var getter = module && module.__esModule ?
	() => (module['default']) :
	() => (module);
__webpack_require__.d(getter, { a: getter });
return getter;
};
```
我们可以看出来它对于非`esModule`模块是有做处理的，非`esModule`模块直接得到module

通过`__webpack_require__`调用commonjs的方法，传入`module`得到`module.exports`导出的值

> 总结

1. webpack会根据入口使用`__webpack_require__`加载入口
2. 如果是`esModule`模块会调用`__webpack_require__.r`给`module`打上`esModule`模块的标示,并使用d函数给其加上`getter`，目的是为了`live binding`如果是非`esModule`模块，会通过`__webpack_require__.n`判断其上面有没有`__esModule`的属性，有的话取出`module['default']`加上getter，反之则取module
3. 返回module.exports

> 流程图

![](./assets//%E6%B5%81%E7%A8%8B%E5%9B%BE.jpg)

## require.ensure
`require.ensure`叫动态引入、按需加载，代码如下

```javascript
(() => { // webpackBootstrap
	var __webpack_modules__ = ({
  "./index-ensure.js": ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__.e(/*! import() */ \"split_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./split.js */ \"./split.js\")).then(code => console.log(code))\n\n//# sourceURL=webpack:///./index-ensure.js?"); })

	});
	// The module cache
	var __webpack_module_cache__ = {};
	
	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = __webpack_modules__;
	
	
	/* webpack/runtime/ensure chunk */
	__webpack_require__.f = {};
  // This file contains only the entry chunk.
  // The chunk loading function for additional chunks
  // e函数返回值是一个promise，.the返回的会是`promises`
  // 这里的f函数上只有一个j函数，也就是说这里执行的其实是f[j](chunkId, promises)
  // 注意这里又使用了函数引用传参
  // 也就是调用完__webpack_require__.e之后得到的是一个promises，关于这个是什么，我们接着往下看
  __webpack_require__.e = (chunkId) => {
    return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
      __webpack_require__.f[key](chunkId, promises);
      return promises;
    }, []));
  };
	
	/* webpack/runtime/get javascript chunk filename */
	// This function allow to reference async chunks
  __webpack_require__.u = (chunkId) => {
    // return url for filenames based on template
    return "" + chunkId + ".bundle-ensure.js";
  };

	
	/* webpack/runtime/load script */
	var inProgress = {};
  // data-webpack is not used as build has no uniqueName
  // loadScript function to load a script via script tag
  // l函数总结下来最重要的作用就是根据url获取到script标签，然后设置src属性，并且把script标签添加到head中
  // 动态加载chunk
  __webpack_require__.l = (url, done, key, chunkId) => {
    if(inProgress[url]) { inProgress[url].push(done); return; }
    var script, needAttach;
    if(key !== undefined) {
      var scripts = document.getElementsByTagName("script");
      for(var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if(s.getAttribute("src") == url) { script = s; break; }
      }
    }
    if(!script) {
      needAttach = true;
      script = document.createElement('script');
  
      script.charset = 'utf-8';
      script.timeout = 120;
      if (__webpack_require__.nc) {
        script.setAttribute("nonce", __webpack_require__.nc);
      }
  
      script.src = url;
    }
    inProgress[url] = [done];
    var onScriptComplete = (prev, event) => {
      // avoid mem leaks in IE.
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var doneFns = inProgress[url];
      delete inProgress[url];
      script.parentNode && script.parentNode.removeChild(script);
      doneFns && doneFns.forEach((fn) => (fn(event)));
      if(prev) return prev(event);
    }
    ;
    // 超时后告诉onScriptComplete处理异常
    var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
    // onload成功的回调函数
    // 同时会执行被加载的script里面的代码
    // 也就是对应chunk里的代码
    script.onerror = onScriptComplete.bind(null, script.onerror);
    script.onload = onScriptComplete.bind(null, script.onload);
    needAttach && document.head.appendChild(script);
  };
	
	/* webpack/runtime/publicPath */
	__webpack_require__.p = "./";
	
	/* webpack/runtime/jsonp chunk loading */
	(() => {
		// no baseURI
		
		// object to store loaded and loading chunks
		// undefined = chunk not loaded, null = chunk preloaded/prefetched
		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
		var installedChunks = {
			"main": 0
		};
		
		__webpack_require__.f.j = (chunkId, promises) => {
				// JSONP chunk loading for javascript
        // 判断installedChunks中是否有chunkId，如果有直接拿到，为啥不直接返回？
        // 上面我们说了只有0这个状态才是加载完成chunk
				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
				if(installedChunkData !== 0) { // 0 means "already installed".
		
					// a Promise means "currently loading".
          // 如果这里执行了，也就意味着installedChunkData是 = [resolve, reject, promise]
          // 就直接取到下标2的promise
					if(installedChunkData) {
						promises.push(installedChunkData[2]);
					} else {
						if(true) { // all chunks have JS
							// setup Promise in chunk cache
              // 保存该promise存储的installedChunkData里
         			// 同时改变缓存里的chunkId的值
							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
							promises.push(installedChunkData[2] = promise);
		
							// start chunk loading
              // 的到该chunk的url
							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
							// create error before stack unwound to get useful stacktrace later
							var error = new Error();
              // 这里只是加载结束的错误处理机制，也不是很重要
							var loadingEnded = (event) => {
								if(__webpack_require__.o(installedChunks, chunkId)) {
									installedChunkData = installedChunks[chunkId];
									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
									if(installedChunkData) {
										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
										var realSrc = event && event.target && event.target.src;
										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
										error.name = 'ChunkLoadError';
										error.type = errorType;
										error.request = realSrc;
										installedChunkData[1](error);
									}
								}
							};
              // 通过url使用script加载该js
							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
						} else installedChunks[chunkId] = 0;
					}
				}
		};
		
		
		// install a JSONP callback for chunk loading
    // 很重要

    // 
		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
    console.log(parentChunkLoadingFunction, data);
			var [chunkIds, moreModules, runtime] = data;
			// add "moreModules" to the modules object,
			// then flag all "chunkIds" as loaded and fire callback
			var moduleId, chunkId, i = 0;
			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
				for(moduleId in moreModules) {
          // 如果moduleId在moreModules上，并且是他自己的属性，就把它放到m上
          // 这一步主要是为了只拿自己的属性，因为in方法会把原型上可枚举的属性也拿到
					if(__webpack_require__.o(moreModules, moduleId)) {
            // m = __webpack_modules = 全局的模块缓存
            // 目的是在使用的时候可以直接通过chunkId的到该模块的js代码
						__webpack_require__.m[moduleId] = moreModules[moduleId];
					}
				}
				if(runtime) var result = runtime(__webpack_require__);
			}
      // 这里的parentChunkLoadingFunction = chunkLoadingGlobal原生的push
			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
			for(;i < chunkIds.length; i++) {
				chunkId = chunkIds[i];
				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
          // 执行该被加载模块的js, 也就是到这一步，一个被分割的模块已经加载完成了
          // 这里的installedChunks[chunkId][0] = 上面缓存的resolve | installedChunkData = installedChunks[chunkId] = [resolve, reject])
          // 调用了这个也就是把这个promise給resolve了, 会把存储的第三个参数promise給fulled，然后执行.then
					installedChunks[chunkId][0]();
				}
				installedChunks[chunkId] = 0;
			}
		
		}
		
		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
	})();
	
	
	// startup
	// Load entry module and return exports
	// This entry module can't be inlined because the eval devtool is used.
  // 首先还是先找到入口，根据入口找到这个js
	var __webpack_exports__ = __webpack_require__("./index-ensure.js");
	
})();

// 子chunk的代码
// 这里的push其实就是被重写后的push，执行的是webpackJsonpCallback
// 调用push传入的一个参数，其实是webpackJsonpCallback的第二个参数，因为被重写的时候第一个参数已经被bind了原生的push
(self["webpackChunk"] = self["webpackChunk"] || []).push([["split2_js"],{
  "./split2.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  split2: true\n});\n\n//# sourceURL=webpack:///./split2.js?");
})

}]);
```

这段代码比较多，但它主要干的事情如下：
1. 定义了一个`installedChunks`的object变量，存储加载过的chunk和需要加载的chunk
  - 0 = 已经加载过
  - undefined = 没有被加载
  - null = chunk被prefetch/preload
  - [reolve, reject, promise] = 正在被加载中
2. 声明`self["webpackChunk"]`属性，并重写`push`方法为`webpackJsonpCallback`, 然后调用push的时候其实就是执行`webpackJsonpCallback`函数去加载chunk
3. j&l函数去加载具体的chunk

> 总结

1. 找到入口用`__webpack_requre`执行，同时声明`self["webpackChunk"]`属性，并重写`push`方法为`webpackJsonpCallback`, 然后调用push的时候其实就是执行`webpackJsonpCallback`函数去加载chunk
2. 执行`__webpack_require__.e`，让执行f上的j方法去使用`installedChunks`缓存改chunk的状态[resolve, reject, promise]
3. 根据chunkId的到url，使用`__webpack_require__.l`函数创建`script`去加载改chunk脚本
4. 加载完成该chunk的同时会触发改`chunk`的自执行函数,调用`self["webpackChunk"].push = webpackJsonpCallback`,作为第二个参数传入
5. 根据`chunkId`在`installedChunks`找到该chunk的状态`[resolve, reject, promise]`，并执行`resolve`，触发promise的.then
6. 这个时候触发的其实是`__webpack_require__.e`的返回值：promise，这个里面又使用`__webpack_reuqire`加载了这个chunk，返回该chunk的exports給then，也就是再次.then的到的就是导出的内容

## esModule和CommonJs的区别

> CommonJs

1. CommonJs可以动态加载语句，代码发生在运行时
3. CommonJs导出值是拷贝，可以修改导出的值，这在代码出错时，不好排查引起变量污染

> esModule

1. esModule是静态的，不可以动态加载语句，只能声明在该文件的最顶部，代码发生在编译时(新版本的import(xx)可以动态)
2. esModule混合导出，单个导出，默认导出，完全互不影响
3. esModule导出的基本类型有live binding

## 总结
1. 从开始到现在我们分析了所有的模块化，其实它的基本原理无非就那几个
  - 生成script加载模块
  - 代码直接打包到文件里
2. 更加好的利用promise的机制，实现异步编程
  - 一个promis的resolve和reject是可以单独拿出去使用，并触发该promise
3. 合理使用bind可以保存原方法和进行预置参数