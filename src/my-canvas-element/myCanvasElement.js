import {Canvas} from "../example-canvas/canvas.js";
const template = document.createElement("template");
template.innerHTML = `
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
export class MyCanvasElement extends HTMLElement {
  constructor() {
    super();
    this.canvas = null;
    this.resizeObserver = null;
    this.attachShadow({mode: "open"});
    this.addEventListener("incoming-message", this.handleIncomingMessage);
  }
  connectedCallback() {
    this.addResizeObserver();
  }
  disconnectedCallback() {
    this.canvas = null;
    this.removeResizeObserver();
  }
  handleIncomingMessage(event) {
    const message = event.detail;
    if (message.action === "activate") {
      this.activateCanvas();
    }
    this.canvas?.receiveMessage(message);
  }
  activateCanvas() {
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
    this.canvas = new Canvas(this);
    this.shadowRoot?.appendChild(this.canvas.getCanvasElement());
  }
  addResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.canvas?.resize();
    });
    this.resizeObserver = resizeObserver;
    this.resizeObserver.observe(this);
  }
  removeResizeObserver() {
    this.resizeObserver?.unobserve(this);
  }
}
