"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as setupTouchDNDCustomEvents from 'touch-dnd-custom-events';
var drop_it_js_1 = require("./drop-it.js");
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
