// Helper functions
const toArray = arrLike => [].slice.call(arrLike);
const uuid: {(): string; _?: number} = () => `${new Date().getTime()}-${uuid._ = ++uuid._ || 1}`;

export interface DropItConfig {
  draggingCls?: string;
  activeCls?: string;
  overCls?: string;
  droppedSourceCls?: string;
  droppedTargetCls?: string;
  droppedTargetProvider?: () => HTMLElement,
  cloneOnDrop?: boolean;
  detachSource?: boolean;
  canDragOut?: boolean;
}

export class DropIt {
  
  private static DEFAULT_CONFIG = <DropItConfig>{
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

  private draggables: HTMLElement[];
  private dropZones: HTMLElement[];
  private config: DropItConfig;

  private dragstartListener: EventListener;
  private dragendListener: EventListener;
  private dragenterListener: EventListener;
  private dragoverListener: EventListener;
  private dragleaveListener: EventListener;
  private dropListener: EventListener;

  private pubsub: {[eventType: string]: Function[]};
  private dragSrcEl: HTMLElement;

  constructor(draggableSelector: string, dropZoneSelector: string, config: DropItConfig) {
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
  
  public listen(eventType: string, callback: Function) {
    (this.pubsub[eventType] = this.pubsub[eventType] || []).push(callback);
  }
  
  public notify(eventType: string, ...args: any[]) {
    (this.pubsub[eventType] || []).forEach(callback => callback.apply(null, args));
  }
  
  public destroy() {
    this.deactivateDraggables();
    this.deactivateDropZones();
  }
  
  private onDragStart(event: DragEvent) {
    const dragSrcEl = this.dragSrcEl = <HTMLElement>event.currentTarget;
    const dataTransfer = event.dataTransfer;
    
    dragSrcEl.classList.add(this.config.draggingCls);
    
    this.activateDropZones();
    
    dataTransfer.effectAllowed = 'move';
    dataTransfer.setData('text/html', dragSrcEl.innerHTML);
    
    this.notify('dragstart', dragSrcEl, dataTransfer);
  }
  
  private onDragEnd(event: DragEvent) {
    const dragSrcEl = <HTMLElement>event.target;
    dragSrcEl.classList.remove(this.config.draggingCls);
    
    this.deactivateDropZones();
    
    this.dragSrcEl = void 0;
    
    this.notify('dragend', dragSrcEl);
  }
  
  public onDragEnter(event: DragEvent) {
    const dropZone = <HTMLElement>event.currentTarget;
    const dataTransfer = event.dataTransfer;
    
    dropZone.classList.add(this.config.overCls);
    dataTransfer.dropEffect = 'copy';
    
    this.notify('dragenter', dropZone, dataTransfer, this.dragSrcEl);
  }
  
  public onDragOver(event: DragEvent) {
    event.preventDefault();
    
    const dropZone = <HTMLElement>event.currentTarget;
    
    this.notify('dragover', dropZone, this.dragSrcEl);
  }
  
  public onDragLeave(event: DragEvent) {
    const dropZone = <HTMLElement>event.currentTarget;
    dropZone.classList.remove(this.config.overCls);
    
    this.notify('dragleave', dropZone, this.dragSrcEl);
  }
  
  public onDrop(event: DragEvent) {
    event.stopPropagation();
    
    const dropZone = <HTMLElement>event.currentTarget;
    dropZone.classList.remove(this.config.overCls);

    if (this.config.detachSource) {
      this.dragSrcEl.parentElement.removeChild(this.dragSrcEl);
    } else {
      this.dragSrcEl.classList.add(this.config.droppedSourceCls);
    }
    
    let droppedTarget;
    if (this.config.cloneOnDrop) {
      droppedTarget = this.dragSrcEl.cloneNode(true);
      droppedTarget.classList.remove(this.config.draggingCls);
    } else if (typeof this.config.droppedTargetProvider === 'function') {
      droppedTarget = typeof this.config.droppedTargetProvider();
    } else {
      droppedTarget = document.createElement('div');
    }
    
    droppedTarget.classList.add(this.config.droppedTargetCls);

    if (this.config.canDragOut) {
      this.makeDraggable(droppedTarget);
    } else {
      droppedTarget.draggable = false;
    }
    
    // binds draggables to their dropzones
    const boundId = dropZone.dataset['dropZone'] || uuid();
    this.dragSrcEl.dataset['droppedSource'] = boundId;
    dropZone.dataset['dropZone'] = boundId;
    droppedTarget.dataset['droppedTarget'] = boundId;
    
    this.notify('drop', dropZone, droppedTarget, this.dragSrcEl);
  }
  
  private activateDraggables() {
    this.draggables.forEach(this.makeDraggable.bind(this));
  }
  
  private makeDraggable(el: HTMLElement) {
    el.draggable = true;
    el.addEventListener('dragstart', this.dragstartListener);
    el.addEventListener('dragend', this.dragendListener);
  }
  
  private deactivateDraggables() {
    this.draggables.forEach(this.makeUndraggable.bind(this));
  }
  
  private makeUndraggable(el: HTMLElement) {
    el.draggable = false;
    el.removeEventListener('dragstart', this.dragstartListener);
    el.removeEventListener('dragend', this.dragendListener);
  }
  
  private activateDropZones() {
    const dragSrcEl = this.dragSrcEl;

    // We don't want to activate the dropzone that contains the source
    this.dropZones.forEach(el => {
      if (
          dragSrcEl.dataset['droppedTarget'] &&
          dragSrcEl.dataset['droppedTarget'] === el.dataset['dropZone']
        ) return;
      
      el.addEventListener('dragenter', this.dragenterListener);
      el.addEventListener('dragover', this.dragoverListener);
      el.addEventListener('dragleave', this.dragleaveListener);
      el.addEventListener('drop', this.dropListener);
      el.classList.add(this.config.activeCls)
    });
  }
  
  private deactivateDropZones() {
    this.dropZones.forEach(el => {
      el.removeEventListener('dragenter', this.dragenterListener);
      el.removeEventListener('dragover', this.dragoverListener);
      el.removeEventListener('dragleave', this.dragleaveListener);
      el.removeEventListener('drop', this.dropListener);
      el.classList.remove(this.config.activeCls)
    });
  }
  
}