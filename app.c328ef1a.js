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
})({"app.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Box =
/*#__PURE__*/
function () {
  function Box(x, y, sideLength) {
    _classCallCheck(this, Box);

    this.x = x;
    this.y = y;
    this.sideLength = sideLength;
    this.isBeingDragged = false;
    this.dragPreviousLocation = null;
    this.isInsideBox = this.isInsideBox.bind(this);
    this.startDragging = this.startDragging.bind(this);
    this.render = this.render.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
    this.stopDragging = this.stopDragging.bind(this);
  }

  _createClass(Box, [{
    key: "isInsideBox",
    value: function isInsideBox(x, y) {
      return this.x <= x && this.y <= y && this.x + this.sideLength >= x && this.y + this.sideLength >= y;
    }
  }, {
    key: "startDragging",
    value: function startDragging(location) {
      this.isBeingDragged = true;
      this.dragPreviousLocation = location;
    }
  }, {
    key: "stopDragging",
    value: function stopDragging() {
      this.isBeingDragged = false;
    }
  }, {
    key: "updateLocation",
    value: function updateLocation(location) {
      var diffX = location.x - this.dragPreviousLocation.x;
      var diffY = location.y - this.dragPreviousLocation.y;
      this.x += diffX;
      this.y += diffY;
      this.dragPreviousLocation = location;
    }
  }, {
    key: "colourByMode",
    value: function colourByMode() {
      if (this.isBeingDragged) {
        return '#DDD';
      } else {
        return '#000';
      }
    }
  }, {
    key: "render",
    value: function render(ctx) {
      ctx.fillStyle = this.colourByMode();
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.sideLength, this.sideLength);
      ctx.closePath();
      ctx.fill();
    }
  }]);

  return Box;
}();

var CanvasOrchestrator =
/*#__PURE__*/
function () {
  function CanvasOrchestrator() {
    _classCallCheck(this, CanvasOrchestrator);

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.setCanvasLocation = this.setCanvasLocation.bind(this);
    this.render = this.render.bind(this);
    var canvas = document.getElementById('canvas');
    canvas.onmousedown = this.mouseDown;
    canvas.onmousemove = this.mouseMove;
    canvas.onmouseup = this.mouseUp;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d'); // Capture window size so we can calculate where in the canvas we are.

    this.setCanvasLocation();
    window.onresize = this.setCanvasLocation;
    this.draggedBoxes = [];
    this.boxes = [new Box(10, 30, 20), new Box(50, 80, 20), new Box(100, 80, 80), new Box(200, 40, 50)];
    this.render();
  }

  _createClass(CanvasOrchestrator, [{
    key: "setCanvasLocation",
    value: function setCanvasLocation() {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      this.canvasStartX = (windowWidth - this.canvas.width) / 2;
      this.canvasStartY = (windowHeight - this.canvas.height) / 2;
    }
  }, {
    key: "translateToLocationInCanvas",
    value: function translateToLocationInCanvas(x, y) {
      return {
        x: x - this.canvasStartX,
        y: y - this.canvasStartY
      };
    }
  }, {
    key: "eventLocationToCanvasLocation",
    value: function eventLocationToCanvasLocation(e) {
      return this.translateToLocationInCanvas(e.clientX, e.clientY);
    }
  }, {
    key: "mouseDown",
    value: function mouseDown(e) {
      var _this = this;

      var location = this.eventLocationToCanvasLocation(e);
      this.boxes.forEach(function (box) {
        if (box.isInsideBox(location.x, location.y)) {
          box.startDragging(location);

          _this.draggedBoxes.push(box);
        }
      });
      this.render();
    }
  }, {
    key: "mouseMove",
    value: function mouseMove(e) {
      var location = this.eventLocationToCanvasLocation(e);
      this.draggedBoxes.forEach(function (box) {
        return box.updateLocation(location);
      });
      this.render();
    }
  }, {
    key: "mouseUp",
    value: function mouseUp(e) {
      this.draggedBoxes.forEach(function (box) {
        return box.stopDragging();
      });
      this.draggedBoxes = [];
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.boxes.forEach(function (box) {
        box.render(_this2.ctx);
      });
    }
  }]);

  return CanvasOrchestrator;
}();

new CanvasOrchestrator();
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52174" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map