!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("naver",[],e):"object"==typeof exports?exports.naver=e():t.naver=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=93)}([function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){"use strict";e.__esModule=!0,e["default"]=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){var r=n(33)("wks"),o=n(37),i=n(0).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},function(t,e){var n=t.exports={version:"2.6.10"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(8);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){t.exports=!n(26)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(14),o=n(32);t.exports=n(5)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(0),o=n(3),i=n(12),u=n(6),s=n(13),a=function(t,e,n){var c,f,l,h=t&a.F,p=t&a.G,d=t&a.S,v=t&a.P,g=t&a.B,m=t&a.W,y=p?o:o[e]||(o[e]={}),_=y.prototype,x=p?r:d?r[e]:(r[e]||{}).prototype;p&&(n=e);for(c in n)(f=!h&&x&&x[c]!==undefined)&&s(y,c)||(l=f?x[c]:n[c],y[c]=p&&"function"!=typeof x[c]?n[c]:g&&f?i(l,r):m&&x[c]==l?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(l):v&&"function"==typeof l?i(Function.call,l):l,v&&((y.virtual||(y.virtual={}))[c]=l,t&a.R&&_&&!_[c]&&u(_,c,l)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){t.exports={}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var r=n(10);t.exports=function(t,e,n){if(r(t),e===undefined)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var r=n(4),o=n(53),i=n(74),u=Object.defineProperty;e.f=n(5)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(s){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(55),o=n(16);t.exports=function(t){return r(o(t))}},function(t,e){t.exports=function(t){if(t==undefined)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var r=n(8),o=n(0).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,e){t.exports=!0},function(t,e,n){"use strict";function r(t){var e,n;this.promise=new t(function(t,r){if(e!==undefined||n!==undefined)throw TypeError("Bad Promise constructor");e=t,n=r}),this.resolve=o(e),this.reject=o(n)}var o=n(10);t.exports.f=function(t){return new r(t)}},function(t,e,n){var r=n(14).f,o=n(13),i=n(2)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},function(t,e,n){var r=n(33)("keys"),o=n(37);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e,n){t.exports={"default":n(48),__esModule:!0}},function(t,e,n){var r=n(11),o=n(2)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(n){}};t.exports=function(t){var e,n,s;return t===undefined?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(s=r(e))&&"function"==typeof e.callee?"Arguments":s}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e){t.exports=function(t){try{return!!t()}catch(e){return!0}}},function(t,e,n){var r=n(0).document;t.exports=r&&r.documentElement},function(t,e,n){"use strict";var r=n(18),o=n(7),i=n(69),u=n(6),s=n(9),a=n(58),c=n(20),f=n(64),l=n(2)("iterator"),h=!([].keys&&"next"in[].keys()),p=function(){return this};t.exports=function(t,e,n,d,v,g,m){a(n,e,d);var y,_,x,k=function(t){if(!h&&t in b)return b[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},T=e+" Iterator",S="values"==v,w=!1,b=t.prototype,L=b[l]||b["@@iterator"]||v&&b[v],M=L||k(v),E=v?S?k("entries"):M:undefined,P="Array"==e?b.entries||L:L;if(P&&(x=f(P.call(new t)))!==Object.prototype&&x.next&&(c(x,T,!0),r||"function"==typeof x[l]||u(x,l,p)),S&&L&&"values"!==L.name&&(w=!0,M=function(){return L.call(this)}),r&&!m||!h&&!w&&b[l]||u(b,l,M),s[e]=M,s[T]=p,v)if(y={values:S?M:k("values"),keys:g?M:k("keys"),entries:E},m)for(_ in y)_ in b||i(b,_,y[_]);else o(o.P+o.F*(h||w),e,y);return y}},function(t,e,n){var r=n(65),o=n(25);t.exports=Object.keys||function(t){return r(t,o)}},function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(e){return{e:!0,v:e}}}},function(t,e,n){var r=n(4),o=n(8),i=n(19);t.exports=function(t,e){if(r(t),o(e)&&e.constructor===t)return e;var n=i.f(t);return(0,n.resolve)(e),n.promise}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var r=n(3),o=n(0),i=o["__core-js_shared__"]||(o["__core-js_shared__"]={});(t.exports=function(t,e){return i[t]||(i[t]=e!==undefined?e:{})})("versions",[]).push({version:r.version,mode:n(18)?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,e,n){var r=n(4),o=n(10),i=n(2)("species");t.exports=function(t,e){var n,u=r(t).constructor;return u===undefined||(n=r(u)[i])==undefined?e:o(n)}},function(t,e,n){var r,o,i,u=n(12),s=n(54),a=n(27),c=n(17),f=n(0),l=f.process,h=f.setImmediate,p=f.clearImmediate,d=f.MessageChannel,v=f.Dispatch,g=0,m={},y=function(){var t=+this;if(m.hasOwnProperty(t)){var e=m[t];delete m[t],e()}},_=function(t){y.call(t.data)};h&&p||(h=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return m[++g]=function(){s("function"==typeof t?t:Function(t),e)},r(g),g},p=function(t){delete m[t]},"process"==n(11)(l)?r=function(t){l.nextTick(u(y,t,1))}:v&&v.now?r=function(t){v.now(u(y,t,1))}:d?(o=new d,i=o.port2,o.port1.onmessage=_,r=u(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",_,!1)):r="onreadystatechange"in c("script")?function(t){a.appendChild(c("script")).onreadystatechange=function(){a.removeChild(this),y.call(t)}}:function(t){setTimeout(u(y,t,1),0)}),t.exports={set:h,clear:p}},function(t,e,n){var r=n(22),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(t===undefined?"":t,")_",(++n+r).toString(36))}},function(t,e,n){"use strict";e.__esModule=!0;var r=n(1),o=function(t){return t&&t.__esModule?t:{"default":t}}(r),i=function(){function t(e,n){(0,o["default"])(this,t),this.error=e,this.errorMessage=n}return t.prototype.isError=function(){return this.error!==undefined&&null!=this.error},t.prototype.getError=function(){return this.error},t.prototype.getErrorMessage=function(){return this.errorMessage},t}();e["default"]=i},function(t,e,n){"use strict";e.__esModule=!0;var r=function(t){return document.cookie.split("; ").reduce(function(e,n){var r=n.split("=");return r[0]===t?decodeURIComponent(r[1]):e},"")},o=function(t,e){var n=arguments.length>2&&arguments[2]!==undefined?arguments[2]:3600,r=arguments.length>3&&arguments[3]!==undefined?arguments[3]:"/",o=new Date(Date.now()+n).toGMTString();document.cookie=t+"="+encodeURIComponent(e)+"; expires="+o+"; path="+r},i=function(t,e){o(t,"",-1,e)};e.getCookie=r,e.setCookie=o,e.expireCookie=i},function(t,e,n){"use strict";e.__esModule=!0;var r=function(t){try{var e=localStorage.getItem(t);return null==e||e===undefined||""===e?null:e}catch(n){return null}},o=function(t,e){try{return localStorage.setItem(t,e),!0}catch(n){return!1}},i=function(t){try{return localStorage.removeItem(t),!0}catch(e){return!1}};e.getLocalStorageValue=r,e.setLocalStorageValue=o,e.removeLocalStorageValue=i},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}e.__esModule=!0;var o=n(23),i=r(o),u=n(1),s=r(u),a=n(86),c=r(a),f=n(38),l=r(f),h=function(){function t(e){(0,s["default"])(this,t),this.age=e.age,this.birthday=e.birthday,this.email=e.email,this.gender=e.gender,this.id=e.id,this.name=e.name,this.nickname=e.nickname,this.profile_image=e.profile_image,this.birthyear=e.birthyear,this.mobile=e.mobile}return t.prototype.getAge=function(){return this.age},t.prototype.getBirthday=function(){return this.birthday},t.prototype.getEmail=function(){return this.email},t.prototype.getGender=function(){return this.gender},t.prototype.getName=function(){return this.name},t.prototype.getNickName=function(){return this.nickname},t.prototype.getId=function(){return this.id},t.prototype.getProfileImage=function(){return this.profile_image},t.prototype.getBirthyear=function(){return this.birthyear},t.prototype.getMobile=function(){return this.mobile},t.getUserProfile=function(e){return new i["default"](function(n,r){var o=null;(0,c["default"])({url:"https://openapi.naver.com/v1/nid/me",params:{access_token:e.accessToken}}).then(function(e){o=new t(e.response),n(o)})["catch"](function(){o=new l["default"]("024","Authentication failed"),r(o)})})},t}();e["default"]=h},function(t,e,n){"use strict";e.__esModule=!0;var r=n(1),o=function(t){return t&&t.__esModule?t:{"default":t}}(r),i=function(){function t(e,n){(0,o["default"])(this,t),this.accessToken=e,this.ttl=n,this.expires=this.calcExpires()}return t.prototype.calcExpires=function(){return Math.floor((new Date).valueOf()/1e3)+this.ttl},t.prototype.isValidToken=function(){return Math.floor((new Date).valueOf()/1e3)<this.expires},t.prototype.toString=function(){return this.isValidToken()?"bearer."+this.accessToken+"."+this.expires:null},t.getOauthTokenFromInfoStr=function(e){if(e===undefined||null==e)return null;var n=e.split(".");if(3!==n.length)return null;var r=Math.floor((new Date).valueOf()/1e3),o=parseInt(n[2],10)-r;return o<0?null:new t(n[1],o)},t}();e["default"]=i},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}e.__esModule=!0;var o=n(1),i=r(o),u=n(91),s=r(u),a=n(39),c=n(40),f=function(){function t(e){(0,i["default"])(this,t),this.state=e,this.stateTokenName="com.naver.nid.oauth.state_token",this.useLocalStorage=localStorage!==undefined}return t.prototype.getStateToken=function(){return this.isValid()?this.state:(this.generateStateToken(),this.state)},t.prototype.generateStateToken=function(){var t=s["default"].generateUUID();this.setStateTokenToLocal(t),this.state=t},t.prototype.checkStateToken=function(t){return this.getStateTokenFromLocal()===t},t.prototype.isValid=function(){var t=this.getStateTokenFromLocal();return!!t&&(this.state=t,!0)},t.prototype.setStateTokenToLocal=function(t){var e=!1;this.useLocalStorage&&(e=(0,c.setLocalStorageValue)(this.stateTokenName,t)),e||(0,a.setCookie)(this.stateTokenName,t,600,"/")},t.prototype.getStateTokenFromLocal=function(){var t=void 0;return this.useLocalStorage&&(t=(0,c.getLocalStorageValue)(this.stateTokenName)),t!==undefined&&null!=t||(t=(0,a.getCookie)(this.stateTokenName)),t},t.prototype.expireStateToken=function(){(0,a.expireCookie)(this.stateTokenName),(0,c.removeLocalStorageValue)(this.stateTokenName)},t}();e["default"]=f},function(t,e,n){"use strict";!window.addEventListener&&function(t,e,n,r,o,i,u){t.addEventListener=e.addEventListener=n.addEventListener=function(t,e){var n=this;u.unshift([n,t,e,function(t){t.currentTarget=n,t.preventDefault=function(){t.returnValue=!1},t.stopPropagation=function(){t.cancelBubble=!0},t.target=t.srcElement||n,e.call(n,t)}]),this.attachEvent("on"+t,u[0][3])},t.removeEventListener=e.removeEventListener=n.removeEventListener=function(t,e){for(var n,r=0;n=u[r];++r)if(n[0]==this&&n[1]==t&&n[2]==e)return this.detachEvent("on"+t,u.splice(r,1)[0][3])},t.dispatchEvent=e.dispatchEvent=n.dispatchEvent=function(t){return this.fireEvent("on"+t.type,t)}}(Window.prototype,HTMLDocument.prototype,Element.prototype,0,0,0,[])},function(t,e,n){"use strict";e.__esModule=!0,e.LoginWithNaverId=undefined;var r=n(89),o=function(t){return t&&t.__esModule?t:{"default":t}}(r);e.LoginWithNaverId=o["default"]},function(t,e,n){t.exports={"default":n(47),__esModule:!0}},function(t,e,n){n(81),t.exports=n(3).Object.entries},function(t,e,n){n(78),n(80),n(84),n(79),n(82),n(83),t.exports=n(3).Promise},function(t,e){t.exports=function(){}},function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||r!==undefined&&r in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var r=n(15),o=n(36),i=n(72);t.exports=function(t){return function(e,n,u){var s,a=r(e),c=o(a.length),f=i(u,c);if(t&&n!=n){for(;c>f;)if((s=a[f++])!=s)return!0}else for(;c>f;f++)if((t||f in a)&&a[f]===n)return t||f||0;return!t&&-1}}},function(t,e,n){var r=n(12),o=n(57),i=n(56),u=n(4),s=n(36),a=n(76),c={},f={},e=t.exports=function(t,e,n,l,h){var p,d,v,g,m=h?function(){return t}:a(t),y=r(n,l,e?2:1),_=0;if("function"!=typeof m)throw TypeError(t+" is not iterable!");if(i(m)){for(p=s(t.length);p>_;_++)if((g=e?y(u(d=t[_])[0],d[1]):y(t[_]))===c||g===f)return g}else for(v=m.call(t);!(d=v.next()).done;)if((g=o(v,y,d.value,e))===c||g===f)return g};e.BREAK=c,e.RETURN=f},function(t,e,n){t.exports=!n(5)&&!n(26)(function(){return 7!=Object.defineProperty(n(17)("div"),"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t,e,n){var r=n===undefined;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},function(t,e,n){var r=n(11);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e,n){var r=n(9),o=n(2)("iterator"),i=Array.prototype;t.exports=function(t){return t!==undefined&&(r.Array===t||i[o]===t)}},function(t,e,n){var r=n(4);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(u){var i=t["return"];throw i!==undefined&&r(i.call(t)),u}}},function(t,e,n){"use strict";var r=n(62),o=n(32),i=n(20),u={};n(6)(u,n(2)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},function(t,e,n){var r=n(2)("iterator"),o=!1;try{var i=[7][r]();i["return"]=function(){o=!0},Array.from(i,function(){throw 2})}catch(u){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(u){}return n}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){var r=n(0),o=n(35).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,s=r.Promise,a="process"==n(11)(u);t.exports=function(){var t,e,n,c=function(){var r,o;for(a&&(r=u.domain)&&r.exit();t;){o=t.fn,t=t.next;try{o()}catch(i){throw t?n():e=undefined,i}}e=undefined,r&&r.enter()};if(a)n=function(){u.nextTick(c)};else if(!i||r.navigator&&r.navigator.standalone)if(s&&s.resolve){var f=s.resolve(undefined);n=function(){f.then(c)}}else n=function(){o.call(r,c)};else{var l=!0,h=document.createTextNode("");new i(c).observe(h,{characterData:!0}),n=function(){h.data=l=!l}}return function(r){var o={fn:r,next:undefined};e&&(e.next=o),t||(t=o,n()),e=o}}},function(t,e,n){var r=n(4),o=n(63),i=n(25),u=n(21)("IE_PROTO"),s=function(){},a=function(){var t,e=n(17)("iframe"),r=i.length;for(e.style.display="none",n(27).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;r--;)delete a.prototype[i[r]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(s.prototype=r(t),n=new s,s.prototype=null,n[u]=t):n=a(),e===undefined?n:o(n,e)}},function(t,e,n){var r=n(14),o=n(4),i=n(29);t.exports=n(5)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),s=u.length,a=0;s>a;)r.f(t,n=u[a++],e[n]);return t}},function(t,e,n){var r=n(13),o=n(73),i=n(21)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,e,n){var r=n(13),o=n(15),i=n(51)(!1),u=n(21)("IE_PROTO");t.exports=function(t,e){var n,s=o(t),a=0,c=[];for(n in s)n!=u&&r(s,n)&&c.push(n);for(;e.length>a;)r(s,n=e[a++])&&(~i(c,n)||c.push(n));return c}},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var r=n(5),o=n(29),i=n(15),u=n(66).f;t.exports=function(t){return function(e){for(var n,s=i(e),a=o(s),c=a.length,f=0,l=[];c>f;)n=a[f++],r&&!u.call(s,n)||l.push(t?[n,s[n]]:s[n]);return l}}},function(t,e,n){var r=n(6);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},function(t,e,n){t.exports=n(6)},function(t,e,n){"use strict";var r=n(0),o=n(3),i=n(14),u=n(5),s=n(2)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[s]&&i.f(e,s,{configurable:!0,get:function(){return this}})}},function(t,e,n){var r=n(22),o=n(16);t.exports=function(t){return function(e,n){var i,u,s=String(o(e)),a=r(n),c=s.length;return a<0||a>=c?t?"":undefined:(i=s.charCodeAt(a),i<55296||i>56319||a+1===c||(u=s.charCodeAt(a+1))<56320||u>57343?t?s.charAt(a):i:t?s.slice(a,a+2):u-56320+(i-55296<<10)+65536)}}},function(t,e,n){var r=n(22),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},function(t,e,n){var r=n(16);t.exports=function(t){return Object(r(t))}},function(t,e,n){var r=n(8);t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){var r=n(0),o=r.navigator;t.exports=o&&o.userAgent||""},function(t,e,n){var r=n(24),o=n(2)("iterator"),i=n(9);t.exports=n(3).getIteratorMethod=function(t){if(t!=undefined)return t[o]||t["@@iterator"]||i[r(t)]}},function(t,e,n){"use strict";var r=n(49),o=n(60),i=n(9),u=n(15);t.exports=n(28)(Array,"Array",function(t,e){this._t=u(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=undefined,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(t,e){},function(t,e,n){"use strict";var r,o,i,u,s=n(18),a=n(0),c=n(12),f=n(24),l=n(7),h=n(8),p=n(10),d=n(50),v=n(52),g=n(34),m=n(35).set,y=n(61)(),_=n(19),x=n(30),k=n(75),T=n(31),S=a.TypeError,w=a.process,b=w&&w.versions,L=b&&b.v8||"",M=a.Promise,E="process"==f(w),P=function(){},O=o=_.f,j=!!function(){try{var t=M.resolve(1),e=(t.constructor={})[n(2)("species")]=function(t){t(P,P)};return(E||"function"==typeof PromiseRejectionEvent)&&t.then(P)instanceof e&&0!==L.indexOf("6.6")&&-1===k.indexOf("Chrome/66")}catch(r){}}(),C=function(t){var e;return!(!h(t)||"function"!=typeof(e=t.then))&&e},I=function(t,e){if(!t._n){t._n=!0;var n=t._c;y(function(){for(var r=t._v,o=1==t._s,i=0;n.length>i;)!function(e){var n,i,u,s=o?e.ok:e.fail,a=e.resolve,c=e.reject,f=e.domain;try{s?(o||(2==t._h&&N(t),t._h=1),!0===s?n=r:(f&&f.enter(),n=s(r),f&&(f.exit(),u=!0)),n===e.promise?c(S("Promise-chain cycle")):(i=C(n))?i.call(n,a,c):a(n)):c(r)}catch(l){f&&!u&&f.exit(),c(l)}}(n[i++]);t._c=[],t._n=!1,e&&!t._h&&U(t)})}},U=function(t){m.call(a,function(){var e,n,r,o=t._v,i=A(t);if(i&&(e=x(function(){E?w.emit("unhandledRejection",o,t):(n=a.onunhandledrejection)?n({promise:t,reason:o}):(r=a.console)&&r.error&&r.error("Unhandled promise rejection",o)}),t._h=E||A(t)?2:1),t._a=undefined,i&&e.e)throw e.v})},A=function(t){return 1!==t._h&&0===(t._a||t._c).length},N=function(t){m.call(a,function(){var e;E?w.emit("rejectionHandled",t):(e=a.onrejectionhandled)&&e({promise:t,reason:t._v})})},B=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),I(e,!0))},R=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=C(t))?y(function(){var r={_w:n,_d:!1};try{e.call(t,c(R,r,1),c(B,r,1))}catch(o){B.call(r,o)}}):(n._v=t,n._s=1,I(n,!1))}catch(r){B.call({_w:n,_d:!1},r)}}};j||(M=function(t){d(this,M,"Promise","_h"),p(t),r.call(this);try{t(c(R,this,1),c(B,this,1))}catch(e){B.call(this,e)}},r=function(t){this._c=[],this._a=undefined,this._s=0,this._d=!1,this._v=undefined,this._h=0,this._n=!1},r.prototype=n(68)(M.prototype,{then:function(t,e){var n=O(g(this,M));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=E?w.domain:undefined,this._c.push(n),this._a&&this._a.push(n),this._s&&I(this,!1),n.promise},"catch":function(t){return this.then(undefined,t)}}),i=function(){var t=new r;this.promise=t,this.resolve=c(R,t,1),this.reject=c(B,t,1)},_.f=O=function(t){return t===M||t===u?new i(t):o(t)}),l(l.G+l.W+l.F*!j,{Promise:M}),n(20)(M,"Promise"),n(70)("Promise"),u=n(3).Promise,l(l.S+l.F*!j,"Promise",{reject:function(t){var e=O(this);return(0,e.reject)(t),e.promise}}),l(l.S+l.F*(s||!j),"Promise",{resolve:function(t){return T(s&&this===u?M:this,t)}}),l(l.S+l.F*!(j&&n(59)(function(t){M.all(t)["catch"](P)})),"Promise",{all:function(t){var e=this,n=O(e),r=n.resolve,o=n.reject,i=x(function(){var n=[],i=0,u=1;v(t,!1,function(t){var s=i++,a=!1;n.push(undefined),u++,e.resolve(t).then(function(t){a||(a=!0,n[s]=t,--u||r(n))},o)}),--u||r(n)});return i.e&&o(i.v),n.promise},race:function(t){var e=this,n=O(e),r=n.reject,o=x(function(){v(t,!1,function(t){e.resolve(t).then(n.resolve,r)})});return o.e&&r(o.v),n.promise}})},function(t,e,n){"use strict";var r=n(71)(!0);n(28)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:undefined,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){var r=n(7),o=n(67)(!0);r(r.S,"Object",{entries:function(t){return o(t)}})},function(t,e,n){"use strict";var r=n(7),o=n(3),i=n(0),u=n(34),s=n(31);r(r.P+r.R,"Promise",{"finally":function(t){var e=u(this,o.Promise||i.Promise),n="function"==typeof t;return this.then(n?function(n){return s(e,t()).then(function(){return n})}:t,n?function(n){return s(e,t()).then(function(){throw n})}:t)}})},function(t,e,n){"use strict";var r=n(7),o=n(19),i=n(30);r(r.S,"Promise",{"try":function(t){var e=o.f(this),n=i(t);return(n.e?e.reject:e.resolve)(n.v),e.promise}})},function(t,e,n){n(77);for(var r=n(0),o=n(6),i=n(9),u=n(2)("toStringTag"),s="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),a=0;a<s.length;a++){var c=s[a],f=r[c],l=f&&f.prototype;l&&!l[u]&&o(l,u,c),i[c]=i.Array}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}e.__esModule=!0;var o=n(1),i=r(o),u=n(92),s=r(u),a=n(43),c=r(a),f=n(42),l=r(f),h=n(38),p=r(h),d=function(){function t(){(0,i["default"])(this,t),this.parameterMap=window.location.hash!==undefined?s["default"].getParameterMapFromLocationHash():s["default"].getParameterMapFromQueryString()}return t.prototype.isValidCallbackRequest=function(){return(new c["default"]).checkStateToken(this.parameterMap.state)},t.prototype.isSuccessCallbackRequest=function(){if(null==this.parameterMap||this.parameterMap.state===undefined)return!1;var t=this.parameterMap.error;return t===undefined&&null==t},t.prototype.getErrorResponse=function(){return new p["default"](this.parameterMap.error,this.parameterMap.error_description)},t.prototype.getAccessTokenInfo=function(){return new l["default"](this.parameterMap.access_token,parseInt(this.parameterMap.expires_in,10))},t}();e["default"]=d},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}e.__esModule=!0;var o=n(23),i=r(o),u=n(46),s=r(u),a=function(t,e){var n=!1;if(-1===t.indexOf("?")&&(n=!0),e!==Object(e)||e===undefined)return t;var r=t;return n&&(r+="?"),(0,s["default"])(e).forEach(function(t){var e=t[0],n=t[1];r+="&"+e+"="+encodeURIComponent(n)}),r},c=function(t,e){var n=document.createElement("script");return n.src=t+(t.indexOf("?")>=0?"&":"?")+"oauth_callback="+e,n},f=function(t){var e=a(t.url,t.params);return new i["default"](function(t,n){var r="_jsonp_callback_"+Math.round(1e5*Math.random()),o=c(e,r),i=document.getElementsByTagName("script")[0]||document.head;i.appendChild(o),o.onerror=n,window[r]=function(e){t(e),window[r]=null,delete window[r],i.removeChild(o)}})};e["default"]=f},function(t,e,n){"use strict";e.__esModule=!0;var r=n(1),o=function(t){return t&&t.__esModule?t:{"default":t}}(r),i=function(){function t(e){(0,o["default"])(this,t),null!=e?(this.use=!0,this.color=e.color,this.type=e.type,this.height=e.height,this.version=e.version):this.use=!1}return t.prototype.createButtonElement=function(){if(!0===this.use){for(var t=document.getElementById("naverIdLogin");t.firstChild;)t.removeChild(t.firstChild);var e=document.createElement("a");e.id="naverIdLogin_loginButton",e.href="#";var n=document.createElement("img");return n.src=this.generateImageUrl(),n.height=this.height,e.appendChild(n),e}return null},t.prototype.generateImageUrl=function(){if(!0===this.use){var t="g",e="button",n="";switch(this.color){case"white":t="w";break;default:t="g"}switch(this.type){case 1:e="button";break;case 2:e="small",n="_in";break;default:e="big"}return"https://static.nid.naver.com/oauth/"+e+"_"+t+n+".PNG?version=js-"+this.version}return null},t}();e["default"]=i},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}e.__esModule=!0;var o=n(1),i=r(o),u=n(40),s=n(39),a=n(42),c=r(a),f=n(41),l=r(f),h=function(){function t(e){(0,i["default"])(this,t),this.accessTokenName="com.naver.nid.access_token",this.status=!1,this.naverUser=null,this.accessToken=e}return t.prototype.getAccessTokenFromLocal=function(){var t=(0,u.getLocalStorageValue)(this.accessTokenName);if(null!=t&&t!==undefined||(t=(0,s.getCookie)(this.accessTokenName)),null==t||t===undefined)return null;var e=c["default"].getOauthTokenFromInfoStr(t);return null==e?null:(null!=this.accessToken&&this.accessToken.accessToken===e.accessToken||(this.accessToken=e),this.accessToken)},t.prototype.setNaverUser=function(t){var e=this;l["default"].getUserProfile(this.accessToken).then(function(n){e.naverUser=n,t&&(e.status=!0,e.setAccessTokenToLocal())},function(t){e.naverUser=t,e.status=!1,e.accessToken=null})},t.prototype.setLoginStatus=function(){return null!=this.accessToken&&this.accessToken!==undefined&&(this.setNaverUser(!0),this.status)},t.prototype.setAccessTokenToLocal=function(){return null!=this.accessToken&&this.accessToken!==undefined&&(!!(0,u.setLocalStorageValue)(this.accessTokenName,this.accessToken.toString())||(0,s.setCookie)(this.accessTokenName,this.accessToken.toString(),this.accessToken.ttl,"/"))},t.prototype.getLoginStatus=function(){return this.getAccessTokenFromLocal(),!1===this.status&&((0,u.removeLocalStorageValue)(this.accessTokenName),(0,s.expireCookie)(this.accessTokenName)),this.status},t.prototype.resetLoginStatus=function(){this.status=!1,(0,u.removeLocalStorageValue)(this.accessTokenName),(0,s.expireCookie)(this.accessTokenName)},t}();e["default"]=h},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}e.__esModule=!0;var o=n(1),i=r(o),u=n(90),s=r(u),a=n(41),c=r(a),f=n(43),l=r(f),h=n(85),p=r(h),d=n(88),v=r(d),g=n(87),m=r(g),y=function(){function t(e){(0,i["default"])(this,t),this.clientId=e.clientId,this.callbackUrl=e.callbackUrl,this.isPopup=e.isPopup,this.state=e.state,this.userLoginButtons=e.userLoginButtons,this.version="2.0.1",this.accessToken=null,this.loginButtonOptions=e.loginButton}return t.prototype.init=function(){this.callbackHandler=new p["default"],this.loginStatus=new v["default"],this.callbackHandler.isSuccessCallbackRequest()&&this.oauthCallback(),null!=this.loginButtonOptions&&(this.loginButtonOptions.version=this.version),this.loginButtonHandler=new m["default"](this.loginButtonOptions),this.setLoginButton(),!0===this.isPopup?this.popup():this.attachLoginButtonEvent()},t.prototype.setLoginButton=function(){var t=this.loginButtonHandler.createButtonElement();null!=t&&document.getElementById("naverIdLogin").appendChild(t)},t.prototype.setOauthCallbackUrl=function(t){this.callbackUrl=t},t.prototype.generateAuthorizeUrl=function(){this.generateState();var t="https://nid.naver.com/oauth2.0/authorize?response_type=code";return t+="&client_id="+this.clientId,t+="&state="+this.state,t+="&redirect_uri="+encodeURIComponent(this.callbackUrl),t+="&version=js-"+this.version,!1===this.isPopup&&(t+="&svctype=1"),t},t.prototype.generateReauthenticateUrl=function(){var t=this.generateAuthorizeUrl();return t+="&auth_type=reauthenticate"},t.prototype.generateRefromptUrl=function(){var t=this.generateAuthorizeUrl();return t+="&auth_type=reprompt"},t.prototype.reprompt=function(){this.logout(),window.location.replace(this.generateRefromptUrl())},t.prototype.generateState=function(){return this.state=(new l["default"]).getStateToken(),this.state},t.prototype.getVersion=function(){return this.version},t.prototype.popup=function(){var t=this.generateAuthorizeUrl();new s["default"](t,"600","800",null,"naver_login",null).attachOnclickEvent("naverIdLogin_loginButton")},t.prototype.attachLoginButtonEvent=function(){var t=this,e=document.getElementById("naverIdLogin_loginButton");null!=e&&e.addEventListener("click",function(e){return t.authorize(e)})},t.prototype.authorize=function(){var t=this.generateAuthorizeUrl();window.location.href=t},t.prototype.oauthCallback=function(){this.callbackHandler.isValidCallbackRequest()&&(this.accessToken=this.callbackHandler.getAccessTokenInfo(),this.loginStatus=new v["default"](this.accessToken),this.loginStatus.setAccessTokenToLocal())},t.prototype.getLoginStatus=function(t){var e=this;null==this.loginStatus&&(this.loginStatus=new v["default"](this.accessToken)),null==this.accessToken&&(this.accessToken=this.loginStatus.getAccessTokenFromLocal()),c["default"].getUserProfile(this.accessToken).then(function(n){e.loginStatus.status=!0,e.loginStatus.naverUser=n,e.user=e.loginStatus.naverUser,t!==undefined&&t(!0)},function(n){e.loginStatus.status=!1,e.loginStatus.naverUser=n,e.user=e.loginStatus.naverUser,t!==undefined&&t(!1)})},t.prototype.logout=function(){this.loginStatus.resetLoginStatus()},t}();e["default"]=y},function(t,e,n){"use strict";e.__esModule=!0;var r=n(1),o=function(t){return t&&t.__esModule?t:{"default":t}}(r),i=function(){function t(e,n,r,i,u,s){(0,o["default"])(this,t),this.width=n,this.height=r,this.target=i,this.name=u,this.options=s,this.url=e}return t.prototype.makeDefaultOptions=function(){this.options&&""!==this.options||(this.options="titlebar=1, resizable=1, scrollbars=yes"),this.options+=", width="+this.width,this.options+=", height="+this.height,console.debug("option "+this.options)},t.prototype.popup=function(){this.makeDefaultOptions(),window.open(this.url,this.target,this.options)},t.prototype.attachOnclickEvent=function(t){var e=this,n=document.getElementById(t);null!=n&&n.addEventListener("click",function(t){return e.popup(t)})},t}();e["default"]=i},function(t,e,n){"use strict";e.__esModule=!0;var r=n(1),o=function(t){return t&&t.__esModule?t:{"default":t}}(r),i=function(){function t(){(0,o["default"])(this,t)}return t.generateUUID=function(){var t=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var n=(t+16*Math.random())%16|0;return t=Math.floor(t/16),("x"===e?n:3&n|8).toString(16)})},t}();e["default"]=i},function(t,e,n){"use strict";e.__esModule=!0;var r=n(1),o=function(t){return t&&t.__esModule?t:{"default":t}}(r),i=function(){function t(){(0,o["default"])(this,t)}return t.getLocationHash=function(){return window.location.hash},t.getLocationSearch=function(){return window.location.search},t.getParameterMap=function(t){if(t===undefined||""===t)return null;for(var e=t.split("&"),n={},r=0;r<e.length;r+=1){var o=e[r].split("=",2);1===o.length?n[o[0]]="":n[o[0]]=decodeURIComponent(o[1].replace(/\+/g," "))}return n},t.getParameterMapFromLocationHash=function(){var t=this.getLocationHash();return t===undefined||""===t?null:this.getParameterMap(t.substr(1))},t.getParameterMapFromQueryString=function(){var t=this.getLocationSearch();return t===undefined||""===t?null:this.getParameterMap(t.substr(1))},t}();e["default"]=i},function(t,e,n){n(44),t.exports=n(45)}])});