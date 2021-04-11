export class Canvas {
  constructor(rootElement) {
    this.initialTextValue = "Hello world";
    this.mouseDownCoords = null;
    this.textState = {
      value: "",
      x: 0,
      y: 0
    };
    this.onMouseDown = (e) => {
      this.canvas.addEventListener("mousemove", this.onDrag);
      this.canvas.addEventListener("mouseup", this.onDragEnd);
      this.canvas.addEventListener("mouseleave", this.onDragEnd);
      const {x: containerX, y: containerY} = this.rootElement.getBoundingClientRect();
      this.mouseDownCoords = {
        x: e.pageX - containerX,
        y: e.pageY - containerY
      };
    };
    this.onDrag = (e) => {
      if (!this.mouseDownCoords) {
        return;
      }
      const {x: containerX} = this.rootElement.getBoundingClientRect();
      const currentX = e.pageX - containerX;
      const diffX = currentX - this.mouseDownCoords.x;
      this.mouseDownCoords.x += diffX;
      this.textState.x += diffX;
      requestAnimationFrame(() => {
        this.clearCanvas();
        this.drawText();
      });
    };
    this.onDragEnd = () => {
      this.canvas.removeEventListener("mousemove", this.onDrag);
      this.canvas.removeEventListener("mouseup", this.onDragEnd);
      this.mouseDownCoords = null;
    };
    this.onMouseLeave = () => {
      this.canvas.removeEventListener("mousemove", this.onDrag);
      this.canvas.removeEventListener("mouseup", this.onDragEnd);
      this.mouseDownCoords = null;
    };
    this.rootElement = rootElement;
    this.canvas = document.createElement("canvas");
    this.initializeCanvas(rootElement);
    this.resetCanvas();
  }
  get initialTextX() {
    return this.canvas.width / 2;
  }
  get initialTextY() {
    return this.canvas.height / 2;
  }
  initializeCanvas(rootElement) {
    const {width: containerWidth, height: containerHeight} = rootElement.getBoundingClientRect();
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
    this.canvas.addEventListener("mousedown", this.onMouseDown);
  }
  resize() {
    const {width: containerWidth, height: containerHeight} = this.rootElement.getBoundingClientRect();
    this.canvas.width = containerWidth * devicePixelRatio;
    this.canvas.height = containerHeight * devicePixelRatio;
    this.textState.y = this.initialTextY;
    this.clearCanvas();
    this.drawText();
  }
  clearCanvas() {
    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText() {
    this.clearCanvas();
    const context = this.canvas.getContext("2d");
    context.font = `${60 * devicePixelRatio}px serif`;
    context.textBaseline = "middle";
    context.textAlign = "center";
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
    const event = new CustomEvent("outgoing-message", {
      bubbles: false,
      detail: {
        action: "text-moved",
        payload: {
          x: this.textState.x
        }
      }
    });
    this.rootElement.dispatchEvent(event);
  }
  receiveMessage(message) {
    const step = Math.floor(this.canvas.width / 20);
    if (message.action === "move-left") {
      this.textState.x -= step;
      this.drawText();
    } else if (message.action === "move-right") {
      this.textState.x += step;
      this.drawText();
    } else if (message.action === "reset") {
      this.resetCanvas();
    } else if (message.action === "change-text") {
      this.textState.value = message.payload.text;
      this.drawText();
    }
  }
}
