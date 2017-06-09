System.register(["./drop-it.js"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var drop_it_js_1, dnd;
    return {
        setters: [
            function (drop_it_js_1_1) {
                drop_it_js_1 = drop_it_js_1_1;
            }
        ],
        execute: function () {
            dnd = new drop_it_js_1.DropIt('.draggable', '.dropzone', {
                canDragOut: true,
                detachSource: true
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
        }
    };
});
