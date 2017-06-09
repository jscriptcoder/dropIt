System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var toArray, uuid, DropIt;
    return {
        setters: [],
        execute: function () {
            // Helper functions
            toArray = function (arrLike) { return [].slice.call(arrLike); };
            uuid = function () { return new Date().getTime() + "-" + (uuid._ = ++uuid._ || 1); };
            DropIt = (function () {
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
                    if (this.config.detachSource) {
                        this.dragSrcEl.parentElement.removeChild(this.dragSrcEl);
                    }
                    else {
                        this.dragSrcEl.classList.add(this.config.droppedSourceCls);
                    }
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
            exports_1("DropIt", DropIt);
        }
    };
});
