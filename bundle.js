/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./App.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./App.js":
/*!****************!*\
  !*** ./App.js ***!
  \****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./main.js");


function init() {
  document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById('root');
    new _main__WEBPACK_IMPORTED_MODULE_0__["default"](container);
  });
}

init();

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! exports provided: default */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /home/vincentt24738/Desktop/JS_project/main.js: Unexpected token (30:17)\n\n\u001b[0m \u001b[90m 28 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 29 | \u001b[39m    }\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 30 | \u001b[39m        \u001b[36mfunction\u001b[39m formula(x\u001b[33m,\u001b[39m offset \u001b[33m=\u001b[39m \u001b[35m0\u001b[39m) {\u001b[0m\n\u001b[0m \u001b[90m    | \u001b[39m                 \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 31 | \u001b[39m            let y \u001b[33m=\u001b[39m x \u001b[33m*\u001b[39m curvatureFactor\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 32 | \u001b[39m            \u001b[90m// let y = x;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 33 | \u001b[39m            \u001b[90m// return (Math.sin(0.5 * y) + Math.sin(y) + 0.2 * Math.sin(3 * y)) * 50 + offset / 2;\u001b[39m\u001b[0m\n    at Object._raise (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:742:17)\n    at Object.raiseWithData (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:735:17)\n    at Object.raise (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:729:17)\n    at Object.unexpected (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:8757:16)\n    at Object.parseClassMemberWithIsStatic (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:12047:12)\n    at Object.parseClassMember (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11940:10)\n    at withTopicForbiddingContext (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11885:14)\n    at Object.withTopicForbiddingContext (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:10956:14)\n    at Object.parseClassBody (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11862:10)\n    at Object.parseClass (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11836:22)\n    at Object.parseExportDefaultExpression (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:12272:19)\n    at Object.parseExport (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:12185:31)\n    at Object.parseStatementContent (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11185:27)\n    at Object.parseStatement (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11081:17)\n    at Object.parseBlockOrModuleBlockBody (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11656:25)\n    at Object.parseBlockBody (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11642:10)\n    at Object.parseTopLevel (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:11012:10)\n    at Object.parse (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:12637:10)\n    at parse (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/parser/lib/index.js:12688:38)\n    at parser (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/core/lib/parser/index.js:54:34)\n    at parser.next (<anonymous>)\n    at normalizeFile (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/core/lib/transformation/normalize-file.js:93:38)\n    at normalizeFile.next (<anonymous>)\n    at run (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/core/lib/transformation/index.js:31:50)\n    at run.next (<anonymous>)\n    at Function.transform (/home/vincentt24738/Desktop/JS_project/node_modules/@babel/core/lib/transform.js:27:41)\n    at transform.next (<anonymous>)\n    at step (/home/vincentt24738/Desktop/JS_project/node_modules/gensync/index.js:254:32)\n    at gen.next (/home/vincentt24738/Desktop/JS_project/node_modules/gensync/index.js:266:13)\n    at async.call.value (/home/vincentt24738/Desktop/JS_project/node_modules/gensync/index.js:216:11)");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map