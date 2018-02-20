!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.reduxModel=t():e.reduxModel=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(t,"__esModule",{value:!0}),t.createModel=t.extractReducers=t.feedStore=void 0;var u=r(1),a=n(u),c=r(2),s=n(c),f=r(4),p=n(f),l=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},h=r(3),y=(t.feedStore=function(e,t){t.forEach(function(t){t.store=e})},t.extractReducers=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,h.combineReducers)(t.reduce(function(e,t){return d({},e,i({},t.namespace,t.reducer))},{}))},function(e){return function(t,r){return{type:e,payload:t,meta:r,error:t instanceof Error||void 0}}}),v=function(){function e(){var t=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=r.namespace,u=r.state,a=r.computations,c=r.effects,s=r.actionCreators,f=r.reducer;o(this,e),b.call(this),this.namespace=n,this.initialState=u;var l=(0,p.default)(a);(0,p.default)(c).concat((0,p.default)(s)).forEach(function(e){l.includes(e)?console.warn("Duplicated key '"+e+"' found! ('computations', 'effects' and 'actionCreators' should not contain the same key)"):l.push(e)}),this.actionTypes=l;var h=l.reduce(function(e,r){return d({},e,i({},r,t._generateActionCreator(r)))},{});this._actionCreators=d({},h,this._mapCreatorTypes(s)),this.reducer=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.initialState,r=arguments[1],n=f?f(e,r):e,o=t._unprefixType(r.type);return a[o]?a[o](n,r.payload,r.meta,r.error):n}}return l(e,[{key:"store",set:function(e){var t=this;this.dispatch=e.dispatch;var r=(0,s.default)(this._actionCreators,function(e){return t._bindDispatch(e)});(0,a.default)(this,r)}}]),e}(),b=function(){var e=this;this._generateActionCreator=function(t){return y(e._prefixType(t))},this._unprefixType=function(t){var r=e.namespace+"/";return t.startsWith(r)?t.substr(r.length):t},this._prefixType=function(t){return e.namespace?e.namespace+"/"+t:t},this._mapCreatorTypes=function(t){return(0,s.default)(t,function(t,r){var n=e._prefixType(r);return function(){return d({type:n},t.apply(void 0,arguments))}})},this._bindDispatch=function(t){return function(){return e.dispatch(t.apply(void 0,arguments))}}};t.createModel=function(e){return new v(e)}},function(e,t){e.exports=require("lodash/assign")},function(e,t){e.exports=require("lodash/mapValues")},function(e,t){e.exports=require("redux")},function(e,t){e.exports=require("lodash/keys")}])});