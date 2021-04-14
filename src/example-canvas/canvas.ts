import { Message, MessagingAction } from "../actions";

export const canvasTemplate = document.createElement('template');
canvasTemplate.innerHTML = `
  <style>
    :host {
      border: 1px dashed black;
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  </style>
`;


export class Canvas {

  rootElement: HTMLElement;
  callback: (message: Message) => void;
  canvas: HTMLCanvasElement;
  resizeObserver: ResizeObserver | null = null;

  get initialTextX() {
    return this.canvas.width / 2;
  }
  get initialTextY() {
    return this.canvas.height / 2;
  }
  initialTextValue = 'Hello world'

  mouseDownCoords: { x: number, y: number } | null = null;

  textState = {
    value: '',
    x: 0,
    y: 0
  }
  

  constructor(rootElement: HTMLElement, callback: (message: Message) => void) {
    this.rootElement = rootElement;
    this.canvas = document.createElement('canvas');
    this.callback = callback;

    this.initializeCanvas(rootElement);
    this.resetCanvas();
    this.addResizeObserver();
  }

  initializeCanvas(rootElement: HTMLElement) {
    const { width: containerWidth, height: containerHeight } = rootElement.getBoundingClientRect();
    this.canvas.width = containerWidth * devicePixelRatio;
    this.canvas.height = containerHeight * devicePixelRatio;
  
    rootElement.appendChild(this.canvas);
    this.rootElement = rootElement;
    this.attachListeners();
  }

  getCanvasElement() {
    return this.canvas;
  }

  attachListeners() {
    this.canvas.addEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e: MouseEvent) => {
    this.canvas.addEventListener('mousemove', this.onDrag);
    this.canvas.addEventListener('mouseup', this.onDragEnd);
    this.canvas.addEventListener('mouseleave', this.onDragEnd);

    const { x: containerX, y: containerY } = this.rootElement.getBoundingClientRect();
    this.mouseDownCoords = {
      x: e.pageX - containerX,
      y: e.pageY - containerY
    };
  }

  onDrag = (e: MouseEvent) => {
    if (!this.mouseDownCoords) {
      return;
    }
    const { x: containerX } = this.rootElement.getBoundingClientRect();
    const currentX = e.pageX - containerX;
    const diffX = currentX - this.mouseDownCoords.x;
    this.mouseDownCoords.x += diffX;
    this.textState.x += diffX;
    requestAnimationFrame(() => {
      this.clearCanvas();
      this.drawText();
    })
  }

  onDragEnd = () => {
    this.canvas.removeEventListener('mousemove', this.onDrag);
    this.canvas.removeEventListener('mouseup', this.onDragEnd);
    this.mouseDownCoords = null;
  }

  onMouseLeave = () => {
    this.canvas.removeEventListener('mousemove', this.onDrag);
    this.canvas.removeEventListener('mouseup', this.onDragEnd);
    this.mouseDownCoords = null;
  }

  resize() {
    const { width: containerWidth, height: containerHeight } = this.rootElement.getBoundingClientRect();
    this.canvas.width = containerWidth * devicePixelRatio;
    this.canvas.height = containerHeight * devicePixelRatio;
    
    this.textState.y = this.initialTextY;
    this.clearCanvas();
    this.drawText();
  }

  clearCanvas() {
    const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  drawText() {
    this.clearCanvas();
    const context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    context.font = `${60 * devicePixelRatio}px serif`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    const {
      x: textX,
      y: textY,
      value: text
    } = this.textState;

    context.fillText(text, textX, textY);
    this.reportTextMove();
  }

  resetCanvas() {
    this.textState = {
      value: this.initialTextValue,
      x: this.initialTextX,
      y: this.initialTextY
    };
    this.drawText();
  }

  reportTextMove() {
    const message = {
        action: MessagingAction.TEXT_MOVED,
        payload: {
          x: this.textState.x
        }
      };

    this.callback(message);
  }

  receiveMessage(message: Message) {

    if (message.action === MessagingAction.MOVE_LEFT) {
      this.moveLeft();
    } else if (message.action === MessagingAction.MOVE_RIGHT) {
      this.moveRight();
    } else if (message.action === MessagingAction.RESET) {
      this.resetCanvas();
    } else if (message.action === MessagingAction.CHANGE_TEXT) {
      this.changeText(message.payload.text);
    }
  }

  changeText (text: string) {
      this.textState.value = text;
      this.drawText();
  }

  moveRight() {
    const step = Math.floor(this.canvas.width / 20);
    this.textState.x += step;
      this.drawText();
  }

  moveLeft() {
    const step = Math.floor(this.canvas.width / 20);
    this.textState.x -= step;
    this.drawText();
  }


  private addResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver = resizeObserver;
    this.resizeObserver.observe(this.rootElement?.parentNode as Element);
  }

}
