import { DropIt } from './drop-it.js';

const dnd = new DropIt('.draggable', '.dropzone', {
  canDragOut: true,
  detachSource: true
});

dnd.listen('dragstart', (dragSrcEl: HTMLElement, dataTransfer: DataTransfer) => {
  console.log('dragstart');
});

dnd.listen('dragend', (dragSrcEl: HTMLElement) => {
  console.log('dragend');
});

dnd.listen('dragenter', (dropZone: HTMLElement, dataTransfer: DataTransfer, dragSrcEl: HTMLElement) => {
  console.log('dragenter');
});

dnd.listen('dragover', (dropZone: HTMLElement, dragSrcEl: HTMLElement) => {
  console.log('dragover');
});

dnd.listen('dragleave', (dropZone: HTMLElement, dragSrcEl: HTMLElement) => {
  console.log('dragleave');
});

dnd.listen('drop', (dropZone: HTMLElement, dragSrcClone: HTMLElement, dragSrcEl: HTMLElement) => {
  console.log('drop');
  
  if (dropZone.classList.contains('zone')) {
    if (!dropZone.querySelector('ul')) {
      dropZone.appendChild(document.createElement('ul'));    
    }

    const ul = dropZone.querySelector('ul');
    const li = document.createElement('li');
    li.appendChild(dragSrcClone);

    ul.appendChild(li);
  } else {
    dropZone.appendChild(dragSrcClone);
  }
  
});