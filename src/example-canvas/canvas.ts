type Message = {
  action: 'move-left'
} | {
  action: 'move-right'
} | {
  action: 'reset'
} | {
  action: 'change-text',
  payload: {
    text: string
  }
};

export class Canvas {

  rootElement: HTMLElement;
  canvas: HTMLCanvasElement;

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

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.canvas = document.createElement('canvas');
    
    this.initializeCanvas(rootElement);
    this.resetCanvas();
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
    const event = new CustomEvent('outgoing-message', {
      bubbles: false,
      detail: {
        action: 'text-moved',
        payload: {
          x: this.textState.x
        }
      }
    });
    this.rootElement.dispatchEvent(event);
  }

  receiveMessage(message: Message) {
    const step = Math.floor(this.canvas.width / 20);
    if (message.action === 'move-left') {
      this.textState.x -= step;
      this.drawText();
    } else if (message.action === 'move-right') {
      this.textState.x += step;
      this.drawText();
    } else if (message.action === 'reset') {
      this.resetCanvas();
    } else if (message.action === 'change-text') {
      this.textState.value = message.payload.text;
      this.drawText();
    }
  }
}
