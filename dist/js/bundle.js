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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Helper functions
var toArray = function (arrLike) { return [].slice.call(arrLike); };
var uuid = function () { return new Date().getTime() + "-" + (uuid._ = ++uuid._ || 1); };
var DropIt = (function () {
    function DropIt(draggableSelector, dropZoneSelector, config) {
        this.draggables = toArray(document.querySelectorAll(draggableSelector));
        this.dropZones = toArray(document.querySelectorAll(dropZoneSelector));
        this.config = Object.assign({}, DropIt.DEFAULT_CONFIG, config);
        this.dragstartListener = this.onDragStart.bind(this);
        this.dragendListener = this.onDragEnd.bind(this);
        this.dragenterListener = this.onDragEnter.bind(this);
        this.dragoverListener = this.onDragOver.bind(this);
        this.dragleaveListener = this.onDragLeave.bind(this);
        this.dropListener = this.onDrop.bind(this);
        this.pubsub = {};
        this.activateDraggables();
    }
    DropIt.prototype.listen = function (eventType, callback) {
        (this.pubsub[eventType] = this.pubsub[eventType] || []).push(callback);
    };
    DropIt.prototype.notify = function (eventType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (this.pubsub[eventType] || []).forEach(function (callback) { return callback.apply(null, args); });
    };
    DropIt.prototype.destroy = function () {
        this.deactivateDraggables();
        this.deactivateDropZones();
    };
    DropIt.prototype.onDragStart = function (event) {
        var dragSrcEl = this.dragSrcEl = event.currentTarget;
        var dataTransfer = event.dataTransfer;
        dragSrcEl.classList.add(this.config.draggingCls);
        this.activateDropZones();
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData('text/html', dragSrcEl.innerHTML);
        this.notify('dragstart', dragSrcEl, dataTransfer);
    };
    DropIt.prototype.onDragEnd = function (event) {
        var dragSrcEl = event.target;
        dragSrcEl.classList.remove(this.config.draggingCls);
        this.deactivateDropZones();
        this.dragSrcEl = void 0;
        this.notify('dragend', dragSrcEl);
    };
    DropIt.prototype.onDragEnter = function (event) {
        var dropZone = event.currentTarget;
        var dataTransfer = event.dataTransfer;
        dropZone.classList.add(this.config.overCls);
        dataTransfer.dropEffect = 'copy';
        this.notify('dragenter', dropZone, dataTransfer, this.dragSrcEl);
    };
    DropIt.prototype.onDragOver = function (event) {
        event.preventDefault();
        var dropZone = event.currentTarget;
        this.notify('dragover', dropZone, this.dragSrcEl);
    };
    DropIt.prototype.onDragLeave = function (event) {
        var dropZone = event.currentTarget;
        dropZone.classList.remove(this.config.overCls);
        this.notify('dragleave', dropZone, this.dragSrcEl);
    };
    DropIt.prototype.onDrop = function (event) {
        event.stopPropagation();
        var dropZone = event.currentTarget;
        dropZone.classList.remove(this.config.overCls);
        var droppedTarget;
        if (this.config.cloneOnDrop) {
            droppedTarget = this.dragSrcEl.cloneNode(true);
            droppedTarget.classList.remove(this.config.draggingCls);
        }
        else if (typeof this.config.droppedTargetProvider === 'function') {
            droppedTarget = typeof this.config.droppedTargetProvider();
        }
        else {
            droppedTarget = document.createElement('div');
        }
        droppedTarget.classList.add(this.config.droppedTargetCls);
        if (this.config.canDragOut) {
            this.makeDraggable(droppedTarget);
        }
        else {
            droppedTarget.draggable = false;
        }
        if (this.config.detachSource) {
            this.dragSrcEl.parentElement.removeChild(this.dragSrcEl);
        }
        else {
            this.dragSrcEl.classList.add(this.config.droppedSourceCls);
        }
        // binds draggables to their dropzones
        var boundId = dropZone.dataset['dropZone'] || uuid();
        this.dragSrcEl.dataset['droppedSource'] = boundId;
        dropZone.dataset['dropZone'] = boundId;
        droppedTarget.dataset['droppedTarget'] = boundId;
        this.notify('drop', dropZone, droppedTarget, this.dragSrcEl);
    };
    DropIt.prototype.activateDraggables = function () {
        this.draggables.forEach(this.makeDraggable.bind(this));
    };
    DropIt.prototype.makeDraggable = function (el) {
        el.draggable = true;
        el.addEventListener('dragstart', this.dragstartListener);
        el.addEventListener('dragend', this.dragendListener);
    };
    DropIt.prototype.deactivateDraggables = function () {
        this.draggables.forEach(this.makeUndraggable.bind(this));
    };
    DropIt.prototype.makeUndraggable = function (el) {
        el.draggable = false;
        el.removeEventListener('dragstart', this.dragstartListener);
        el.removeEventListener('dragend', this.dragendListener);
    };
    DropIt.prototype.activateDropZones = function () {
        var _this = this;
        var dragSrcEl = this.dragSrcEl;
        // We don't want to activate the dropzone that contains the source
        this.dropZones.forEach(function (el) {
            if (dragSrcEl.dataset['droppedTarget'] &&
                dragSrcEl.dataset['droppedTarget'] === el.dataset['dropZone'])
                return;
            el.addEventListener('dragenter', _this.dragenterListener);
            el.addEventListener('dragover', _this.dragoverListener);
            el.addEventListener('dragleave', _this.dragleaveListener);
            el.addEventListener('drop', _this.dropListener);
            el.classList.add(_this.config.activeCls);
        });
    };
    DropIt.prototype.deactivateDropZones = function () {
        var _this = this;
        this.dropZones.forEach(function (el) {
            el.removeEventListener('dragenter', _this.dragenterListener);
            el.removeEventListener('dragover', _this.dragoverListener);
            el.removeEventListener('dragleave', _this.dragleaveListener);
            el.removeEventListener('drop', _this.dropListener);
            el.classList.remove(_this.config.activeCls);
        });
    };
    return DropIt;
}());
DropIt.DEFAULT_CONFIG = {
    draggingCls: 'dragging',
    activeCls: 'active',
    overCls: 'over',
    droppedSourceCls: 'dropped-source',
    droppedTargetCls: 'dropped-target',
    droppedTargetProvider: void 0,
    cloneOnDrop: true,
    detachSource: false,
    canDragOut: false
};
exports.DropIt = DropIt;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// import * as setupTouchDNDCustomEvents from 'touch-dnd-custom-events';
var drop_it_js_1 = __webpack_require__(0);
// setupTouchDNDCustomEvents();
var dnd = new drop_it_js_1.DropIt('.draggable', '.dropzone', {
    canDragOut: true
});
dnd.listen('dragstart', function (dragSrcEl, dataTransfer) {
    console.log('dragstart');
});
dnd.listen('dragend', function (dragSrcEl) {
    console.log('dragend');
});
dnd.listen('dragenter', function (dropZone, dataTransfer, dragSrcEl) {
    console.log('dragenter');
});
dnd.listen('dragover', function (dropZone, dragSrcEl) {
    console.log('dragover');
});
dnd.listen('dragleave', function (dropZone, dragSrcEl) {
    console.log('dragleave');
});
dnd.listen('drop', function (dropZone, dragSrcClone, dragSrcEl) {
    console.log('drop');
    if (dropZone.classList.contains('zone')) {
        if (!dropZone.querySelector('ul')) {
            dropZone.appendChild(document.createElement('ul'));
        }
        var ul = dropZone.querySelector('ul');
        var li = document.createElement('li');
        li.appendChild(dragSrcClone);
        ul.appendChild(li);
    }
    else {
        dropZone.appendChild(dragSrcClone);
    }
});


/***/ })
/******/ ]);