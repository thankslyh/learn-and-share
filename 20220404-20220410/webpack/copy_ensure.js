/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index-ensure.js":
/*!*************************!*\
  !*** ./index-ensure.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

  eval("__webpack_require__.e(/*! import() */ \"split_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./split.js */ \"./split.js\")).then(code => {\n  console.log(code)\n  __webpack_require__.e(/*! import() */ \"split2_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./split2.js */ \"./split2.js\")).then(code => console.log(code))\n})\n\n//# sourceURL=webpack:///./index-ensure.js?");

  /***/ })
  
  /******/ 	});
  /************************************************************************/
  /******/ 	// The module cache
  /******/ 	var __webpack_module_cache__ = {};
  /******/ 	
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/ 		// Check if module is in cache
  /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
  /******/ 		if (cachedModule !== undefined) {
  /******/ 			return cachedModule.exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = __webpack_module_cache__[moduleId] = {
  /******/ 			// no module.id needed
  /******/ 			// no module.loaded needed
  /******/ 			exports: {}
  /******/ 		};
  /******/ 	
  /******/ 		// Execute the module function
  /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  /******/ 	
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/ 	
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = __webpack_modules__;
  /******/ 	
  /************************************************************************/
  /******/ 	/* webpack/runtime/define property getters */
  /******/ 	(() => {
  /******/ 		// define getter functions for harmony exports
  /******/ 		__webpack_require__.d = (exports, definition) => {
  /******/ 			for(var key in definition) {
  /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
  /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
  /******/ 				}
  /******/ 			}
  /******/ 		};
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/ensure chunk */
  /******/ 	(() => {
  /******/ 		__webpack_require__.f = {};
  /******/ 		// This file contains only the entry chunk.
  /******/ 		// The chunk loading function for additional chunks
              // e函数返回值是一个promise，.the返回的会是`promises`
              // 这里的f函数上只有一个j函数，也就是说这里执行的其实是f[j](chunkId, promises)
  /******/ 		__webpack_require__.e = (chunkId) => {
  /******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
  /******/ 				__webpack_require__.f[key](chunkId, promises);
  /******/ 				return promises;
  /******/ 			}, []));
  /******/ 		};
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/get javascript chunk filename */
  /******/ 	(() => {
  /******/ 		// This function allow to reference async chunks
  /******/ 		__webpack_require__.u = (chunkId) => {
  /******/ 			// return url for filenames based on template
  /******/ 			return "" + chunkId + ".bundle-ensure.js";
  /******/ 		};
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
  /******/ 	(() => {
  /******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/load script */
  /******/ 	(() => {
  /******/ 		var inProgress = {};
  /******/ 		// data-webpack is not used as build has no uniqueName
  /******/ 		// loadScript function to load a script via script tag
              // l函数总结下来最重要的作用就是根据url获取到script标签，然后设置src属性，并且把script标签添加到head中
              // 动态加载chunk
  /******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
  /******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
  /******/ 			var script, needAttach;
  /******/ 			if(key !== undefined) {
  /******/ 				var scripts = document.getElementsByTagName("script");
  /******/ 				for(var i = 0; i < scripts.length; i++) {
  /******/ 					var s = scripts[i];
  /******/ 					if(s.getAttribute("src") == url) { script = s; break; }
  /******/ 				}
  /******/ 			}
  /******/ 			if(!script) {
  /******/ 				needAttach = true;
  /******/ 				script = document.createElement('script');
  /******/ 		
  /******/ 				script.charset = 'utf-8';
  /******/ 				script.timeout = 120;
  /******/ 				if (__webpack_require__.nc) {
  /******/ 					script.setAttribute("nonce", __webpack_require__.nc);
  /******/ 				}
  /******/ 		
  /******/ 				script.src = url;
  /******/ 			}
  /******/ 			inProgress[url] = [done];
  /******/ 			var onScriptComplete = (prev, event) => {
  /******/ 				// avoid mem leaks in IE.
  /******/ 				script.onerror = script.onload = null;
  /******/ 				clearTimeout(timeout);
  /******/ 				var doneFns = inProgress[url];
  /******/ 				delete inProgress[url];
  /******/ 				script.parentNode && script.parentNode.removeChild(script);
  /******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
  /******/ 				if(prev) return prev(event);
  /******/ 			}
  /******/ 		;
                // 设置12s的超时时间，如果加载该模块超过12s就直接给onScriptComplete返回超时的报错信息
  /******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
  /******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
                // onload成功的回调函数
                // 同时会执行被加载的script里面的代码
  /******/ 			script.onload = onScriptComplete.bind(null, script.onload);
  /******/ 			needAttach && document.head.appendChild(script);
  /******/ 		};
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/make namespace object */
  /******/ 	(() => {
  /******/ 		// define __esModule on exports
  /******/ 		__webpack_require__.r = (exports) => {
  /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 			}
  /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 		};
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/publicPath */
  /******/ 	(() => {
  /******/ 		__webpack_require__.p = "./";
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/jsonp chunk loading */
  /******/ 	(() => {
  /******/ 		// no baseURI
  /******/ 		
  /******/ 		// object to store loaded and loading chunks
  /******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
  /******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
  /******/ 		var installedChunks = {
  /******/ 			"main": 0
  /******/ 		};
  /******/ 		
  /******/ 		__webpack_require__.f.j = (chunkId, promises) => {
  /******/ 				// JSONP chunk loading for javascript
                  // 判断installedChunks中是否有chunkId，如果有直接拿到，为啥不直接返回？
                  // 上面我们说了只有0这个状态才是加载完成chunk
  /******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
  /******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
  /******/ 		
  /******/ 					// a Promise means "currently loading".
                    // 如果这里执行了，也就意味着installedChunkData = [resolve, reject, promise]
                    // 就直接取到下标2的promise
  /******/ 					if(installedChunkData) {
  /******/ 						promises.push(installedChunkData[2]);
  /******/ 					} else {
  /******/ 						if(true) { // all chunks have JS
  /******/ 							// setup Promise in chunk cache
  /******/ 							// 保存该promise存储的installedChunkData里
  /******/ 							// 同时改变缓存里的chunkId的值
  /******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
  /******/ 							promises.push(installedChunkData[2] = promise);
  /******/ 		
  /******/ 							// start chunk loading
                        // 设置该chunk的url
  /******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
  /******/ 							// create error before stack unwound to get useful stacktrace later
  /******/ 							var error = new Error();
  /******/ 							var loadingEnded = (event) => {
  /******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
  /******/ 									installedChunkData = installedChunks[chunkId];
  /******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
  /******/ 									if(installedChunkData) {
  /******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
  /******/ 										var realSrc = event && event.target && event.target.src;
  /******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
  /******/ 										error.name = 'ChunkLoadError';
  /******/ 										error.type = errorType;
  /******/ 										error.request = realSrc;
  /******/ 										installedChunkData[1](error);
  /******/ 									}
  /******/ 								}
  /******/ 							};
                        // 通过url使用script加载该js
  /******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
  /******/ 						} else installedChunks[chunkId] = 0;
  /******/ 					}
  /******/ 				}
  /******/ 		};
  /******/ 		
  /******/ 		// no prefetching
  /******/ 		
  /******/ 		// no preloaded
  /******/ 		
  /******/ 		// no HMR
  /******/ 		
  /******/ 		// no HMR manifest
  /******/ 		
  /******/ 		// no on chunks loaded
  /******/ 		
  /******/ 		// install a JSONP callback for chunk loading
  /******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
  /******/ 			var [chunkIds, moreModules, runtime] = data;
                console.log(data);
  /******/ 			// add "moreModules" to the modules object,
  /******/ 			// then flag all "chunkIds" as loaded and fire callback
  /******/ 			var moduleId, chunkId, i = 0;
  /******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
  /******/ 				for(moduleId in moreModules) {
                    // 如果moduleId在moreModules上，并且是他自己的属性，就把它放到m上
                    // 这一步主要是为了只拿自己的属性，因为in方法会把原型上可枚举的属性也拿到
  /******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
                      // m = __webpack_modules = 全局的模块缓存
                      // 目的是在使用的时候可以直接通过chunki的到该模块的js代码
  /******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
  /******/ 					}
  /******/ 				}
  /******/ 				if(runtime) var result = runtime(__webpack_require__);
  /******/ 			}
                // 这里的parentChunkLoadingFunction = chunkLoadingGlobal原生的push
  /******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
                console.log('parentChunkLoadingFunction after', chunkLoadingGlobal)
  /******/ 			for(;i < chunkIds.length; i++) {
  /******/ 				chunkId = chunkIds[i];
  /******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
                    // 执行该被加载模块的js
                    // 也就是到这一步，一个被分割的模块已经加载完成了
                    // 这里的installedChunks[chunkId][0] = 上面缓存的resolve
                    // 调用了这个也就是把这个promose給resolve了
                    // 然后会执行最上面的.then
  /******/ 					installedChunks[chunkId][0]();
  /******/ 				}
  /******/ 				installedChunks[chunkId] = 0;
  /******/ 			}
  /******/ 		
  /******/ 		}
  /******/ 		
  /******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
  /******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
  /******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
  /******/ 	})();
  /******/ 	
  /************************************************************************/
  /******/ 	
  /******/ 	// startup
  /******/ 	// Load entry module and return exports
  /******/ 	// This entry module can't be inlined because the eval devtool is used.
  /******/ 	var __webpack_exports__ = __webpack_require__("./index-ensure.js");
  /******/ 	
  /******/ })()
  ;