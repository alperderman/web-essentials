//polyfills
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === 'function' && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (!Object.assign) { Object.defineProperty(Object, 'assign', { enumerable: false, configurable: true, writable: true, value: function(target) { 'use strict'; if (target === undefined || target === null) { throw new TypeError('Cannot convert first argument to object'); } var to = Object(target); for (var i = 1; i < arguments.length; i++) { var nextSource = arguments[i]; if (nextSource === undefined || nextSource === null) { continue; } nextSource = Object(nextSource); var keysArray = Object.keys(Object(nextSource)); for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) { var nextKey = keysArray[nextIndex]; var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey); if (desc !== undefined && desc.enumerable) { to[nextKey] = nextSource[nextKey]; } } } return to; } }); }

if (!Object.values) { Object.values = function values(obj) { var res = []; for (var i in obj) { if (Object.prototype.hasOwnProperty.call(obj, i)) { res.push(obj[i]); } } return res; }; }

if (typeof window.CustomEvent !== 'function') { window.CustomEvent = function (event, params) { params = params || {bubbles: false, cancelable: false, detail: null}; var evt = document.createEvent('CustomEvent'); evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail); return evt; }; }

util = {};
util.encodeHtml = function (str) { //encode html entities function
    var i, buf = [];
    for (var i=str.length-1;i>=0;i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
};
util.decodeHtml = function (str) { //decode html entities function
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
};
util.isElement = function (el) { //check if input is html element
    return el instanceof Element || el instanceof HTMLDocument;  
};
util.isObject = function (item) { //check if input is an object
    return item && _typeof(item) === 'object' && !Array.isArray(item);
};
util.toObject = function (arr) { //convert to object
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
        rv[i] = arr[i];
    return rv;
};
util.getElementsByAttribute = function (x, att, val) { //get elements by their attribute and their value
    if (!val) {val = "";}
    var arr = [], arrCount = -1, i, l, y = x.getElementsByTagName("*"), z = att.toUpperCase();
    l = y.length;
    for (i = -1; i < l; i += 1) {
        if (i == -1) { y[i] = x; }
        if (y[i].getAttribute(z) !== null) {
            if (val == "" || y[i].getAttribute(z) == val) {
                arrCount += 1; arr[arrCount] = y[i];
            }
        }
    }
    return arr;
};
util.getElementByAttribute = function (x, att, val) { //get the first element by its attribute and their value
    if (!val) {val = "";}
    var i, l, y = x.getElementsByTagName("*"), z = att.toUpperCase();
    l = y.length;
    var result = false;
    for (i = -1; i < l; i += 1) {
        if (i == -1) { y[i] = x; }
        if (y[i].getAttribute(z) !== null) {
            if (val == "" || y[i].getAttribute(z) == val) {
                result = y[i];
                break;
            }
        }
    }
    return result;
};
util.removeDuplicatesFromArray = function (arr) { //remove duplicated values from array
    var m = {}, newArr = [];
    if(arr){
        for (var i=0;i < arr.length;i++) {
            var v = arr[i];
            if (!m[v] && v != "") {
                newArr.push(v);
                m[v]=true;
            }
        }
    }
    return newArr;
};
util.normalizeObject = function (obj) { //function for normalizing arrays and objects
    var result = {};
    if (Array.isArray(obj)) {
        obj = util.toObject(obj);
    }
    if (typeof obj === 'object' && !util.isElement(obj)) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                result[property.toLowerCase()] = util.normalizeObject(obj[property]);
            }
        }
    } else {
        result = obj;
    }
    return result;
};
util.mergeDeep = function (target, source) { //function for merging multi-dimensional objects
    var output = Object.assign({}, target);
    if (util.isObject(target) && util.isObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (util.isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, _defineProperty({}, key, source[key]));
                } else {
                    output[key] = util.mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, _defineProperty({}, key, source[key]));
            }
        });
    }
    
    return output;
};
util.recursiveWalk = function (obj, arg, depth) { //arg.result, arg.break, arg.before(arg), arg.after(arg), arg.finally(arg), arg.key, arg.val, arg.depth
    var i, result;
    if (depth == null) {depth = 0;}
    if (typeof obj == "object") {
      for (i = 0;i < Object.keys(obj).length;i++) {
        arg["key"] = Object.keys(obj)[i];
        arg["val"] = obj[Object.keys(obj)[i]];
        arg["depth"] = depth;
        if (arg.before != null) {
          arg = arg.before(arg);
        }
        result = util.rescursiveWalk(obj[Object.keys(obj)[i]], arg, depth+1);
        arg["key"] = Object.keys(obj)[i];
        arg["val"] = obj[Object.keys(obj)[i]];
        arg["depth"] = depth;
        if (arg.after != null) {
          arg = arg.after(arg);
        }
        arg["key"] = Object.keys(obj)[i];
        arg["val"] = obj[Object.keys(obj)[i]];
        arg["depth"] = depth;
        if (arg["break"]) {
          arg["break"] = false;
          break;
        }
      }
    } else {
      arg["val"] = obj;
      arg["depth"] = depth;
      if (arg.before != null) {
        arg = arg.before(arg);
      }
      result = arg["result"];
      if (arg.after != null) {
        arg = arg.after(arg);
      }
      arg["val"] = obj;
      arg["depth"] = depth;
    }
    if (depth == 0) {
      arg["depth"] = depth;
      if (arg.finally != null) {
        arg = arg.finally(arg);
      }
      result = arg["result"];
    }
    return result;
};
util.parseXML = function (m, p) { //convert xml elements to object
    var f=1,o=2,d=3,n=4,j=7,c=8,h=9,l,b,a,k={},g=[];if(!p){p={}}if(typeof p==='string'){p={find:p}}p.xmlns=p.xmlns||"*";if(p.parse!="function"){p.parse=e}function e(i){return i.split(":").pop().replace(/^ows_/,"").replace(/[^a-z,A-Z,0-9]/g,"")}switch(m.nodeType){case h:a=(!p.find)?m.childNodes:(m.getElementsByTagNameNS)?m.getElementsByTagNameNS(p.xmlns,p.find.split(":").pop()):m.getElementsByTagName(p.find);for(l=0;l<a.length;l++){k=util.parseXML(a[l]);if(k){g.push(k)}}k=(g.length&&g.length==1)?g[0]:g;break;case f:if(m.attributes.length==0&&m.childNodes.length==1&&m.childNodes.item(0).nodeValue){k=m.childNodes.item(0).nodeValue}for(l=0;l<m.attributes.length;l++){b=p.parse(m.attributes.item(l).nodeName);k[b]=m.attributes.item(l).nodeValue}for(l=0;l<m.childNodes.length;l++){if(m.childNodes.item(l).nodeType!=d){b=p.parse(m.childNodes.item(l).nodeName);if(typeof k[b]==='undefined'){k[b]=util.parseXML(m.childNodes.item(l))}else{if(typeof k[b].push==='undefined'){k[b]=[k[b]]}k[b].push(util.parseXML(m.childNodes.item(l)))}}}break;case n:k="<![CDATA["+m.nodeValue+"]]>";break;case d:k=m.nodeValue;break;case c:k="";break;default:k=null}return k
};
util.xhr = function (url, callback, cache, method, async) { //xhr function used for fetching external contents
    if (cache == null) {cache = true;}
    if (method == null) {method = 'GET';}
    if (async == null) {async = true;}
    var xhr, guid, cacheUrl, hashUrl;
    method = method.toUpperCase();
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            callback(xhr);
        }
    };
    if (!cache) { //cache buster
        guid = Date.now();
        cacheUrl = url.replace(/#.*$/, "");
        hashUrl = url.slice(cacheUrl.length);
        cacheURL = cacheUrl.replace(/([?&])_=[^&]*/, "$1");
        hashUrl = ((/\?/).test(cacheUrl) ? "&" : "?") + "_=" + (guid++) + hashUrl;
        url = cacheUrl + hashUrl;
    }
    xhr.open(method, url, async);
    xhr.send();
};
util.DOMLoad = function () { //imitate window onload
    document.dispatchEvent(new CustomEvent('DOMContentLoaded'));
    window.dispatchEvent(new CustomEvent('DOMContentLoaded'));
    window.dispatchEvent(new CustomEvent('load'));
};
util.DOMEval = function (code) { //script injection
    var script;
    script = document.createElement("script");
    script.text = code;
    document.head.appendChild(script).parentNode.removeChild(script);
};
util.getScript = function (url, callback) { //external script injection
    util.xhr(url, function (xhr) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                util.DOMEval(xhr.responseText);
            }
            if (typeof callback !== 'undefined') { //skip an execution frame and run callback function if its defined
                setTimeout(function () {callback(xhr)}, 0);
            }
        }
    });
};
