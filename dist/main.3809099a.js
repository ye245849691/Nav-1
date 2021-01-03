// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $dlg = $('.dlg-container');
var $deleteBtn = $(".delete-btn");
var $finishBtn = $(".finish-btn");
var $cancelBtn = $(".cancel-btn"); //取出缓存x
//将JSON数据重新转换为对象

var xObject = JSON.parse(localStorage.getItem('x')); //如果xObject不为falsy值，使用xObject,如果是falsy值，使用初始值

var hashMap = xObject || [{
  logo: 'A',
  url: 'https://www.acfun.cn',
  des: 'Acfun'
}, {
  logo: 'B',
  url: 'https://bilibili.com',
  des: 'Bilibili'
}];

var removeHeader = function removeHeader(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '');
};

var dlg = {
  show: function show() {
    var site = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      des: '',
      url: ''
    };
    var des = site.des,
        url = site.url;
    $("#des").val(des);
    $("#url").val(url);
    $dlg.removeClass("hide-dlg");
  },
  hide: function hide() {
    var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (reload) {
      render();
    }

    $dlg.addClass("hide-dlg");
  },
  selIndex: null
};
loadEvent();
render();

function render() {
  // $siteList.find('li:not(.lastLi)').remove();
  var lis = [];
  hashMap.forEach(function (node, index) {
    var $li = "\n    <a href=\"".concat(node.url, "\">\n      <li class=\"site\">\n        <div class=\"logo\">").concat(node.logo, "</div>\n        <div class=\"link\">").concat(node.des, "</div>\n        <button data-index=\"").concat(index, "\" class=\"list-more\" title=\"\u4FEE\u6539\"></button>\n      </li>\n    </a>\n    ");
    lis.push($li);
  });
  lis.push("<li class=\"lastLi\">\n          <div class=\"addButton\">\n            <svg class=\"icon\" aria-hidden=\"true\">\n              <use xlink:href=\"#iconadd\"></use>\n            </svg>\n          </div>\n        </li>");
  $siteList.html(lis.join(""));
  $(".list-more").click(function (e) {
    var index = e.target.dataset.index;
    dlg.selIndex = index;
    dlg.show(hashMap[index]);
    e.stopPropagation();
    e.preventDefault();
  });
  $('.addButton').on('click', function () {
    dlg.selIndex = null;
    dlg.show();
  });
}

function loadEvent() {
  $cancelBtn.click(function (e) {
    dlg.hide();
  });
  $finishBtn.click(function (e) {
    var des = $("#des").val();
    var url = $("#url").val();

    if (des && url) {
      var site = getSite(des, url);

      if (dlg.selIndex < url) {
        hashMap[dlg.selIndex] = site;
      } else {
        hashMap.push(site);
      }

      dlg.hide(true);
    }
  });
  $deleteBtn.click(function () {
    if (dlg.selIndex) {
      hashMap.splice(dlg.selIndex, 1);
    }

    dlg.hide(true);
  });

  window.onbeforeunload = function () {
    localStorage.setItem("siteStorage", JSON.stringify(siteList));
  };
}

function getSite(des, url) {
  var logo = removeHeader(url)[0].toUpperCase();
  return {
    logo: logo,
    url: url,
    des: des
  };
}

window.onbeforeunload = function () {
  //将hashmap转换成JSON格式(即字符串类型)，存入本地缓存
  var string = JSON.stringify(hashMap);
  localStorage.setItem('x', string);
};

$(document).on('keypress', function (e) {
  var key = e.key;

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toUpperCase() === key.toUpperCase()) {
      window.open(hashMap[i].url);
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.3809099a.js.map