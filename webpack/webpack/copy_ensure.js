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
              // e????????????????????????promise???.the???????????????`promises`
              // ?????????f?????????????????????j?????????????????????????????????????????????f[j](chunkId, promises)
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
              // l????????????????????????????????????????????????url?????????script?????????????????????src??????????????????script???????????????head???
              // ????????????chunk
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
                // ??????12s?????????????????????????????????????????????12s????????????onScriptComplete???????????????????????????
  /******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
  /******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
                // onload?????????????????????
                // ???????????????????????????script???????????????
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
                  // ??????installedChunks????????????chunkId???????????????????????????????????????????????????
                  // ????????????????????????0??????????????????????????????chunk
  /******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
  /******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
  /******/ 		
  /******/ 					// a Promise means "currently loading".
                    // ???????????????????????????????????????installedChunkData = [resolve, reject, promise]
                    // ?????????????????????2???promise
  /******/ 					if(installedChunkData) {
  /******/ 						promises.push(installedChunkData[2]);
  /******/ 					} else {
  /******/ 						if(true) { // all chunks have JS
  /******/ 							// setup Promise in chunk cache
  /******/ 							// ?????????promise?????????installedChunkData???
  /******/ 							// ????????????????????????chunkId??????
  /******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
  /******/ 							promises.push(installedChunkData[2] = promise);
  /******/ 		
  /******/ 							// start chunk loading
                        // ?????????chunk???url
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
                        // ??????url??????script?????????js
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
                    // ??????moduleId???moreModules???????????????????????????????????????????????????m???
                    // ??????????????????????????????????????????????????????in????????????????????????????????????????????????
  /******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
                      // m = __webpack_modules = ?????????????????????
                      // ?????????????????????????????????????????????chunki??????????????????js??????
  /******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
  /******/ 					}
  /******/ 				}
  /******/ 				if(runtime) var result = runtime(__webpack_require__);
  /******/ 			}
                // ?????????parentChunkLoadingFunction = chunkLoadingGlobal?????????push
  /******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
                console.log('parentChunkLoadingFunction after', chunkLoadingGlobal)
  /******/ 			for(;i < chunkIds.length; i++) {
  /******/ 				chunkId = chunkIds[i];
  /******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
                    // ???????????????????????????js
                    // ?????????????????????????????????????????????????????????????????????
                    // ?????????installedChunks[chunkId][0] = ???????????????resolve
                    // ?????????????????????????????????promose???resolve???
                    // ???????????????????????????.then
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