import { Canvas } from '../example-canvas/canvas';

const template = document.createElement('template');
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

  canvas: Canvas | null = null;
  resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this.addEventListener('incoming-message', this.handleIncomingMessage);
  }

  connectedCallback() {
    this.addResizeObserver();
  }

  disconnectedCallback() {
    this.canvas = null;
    this.removeResizeObserver();
  }

  private handleIncomingMessage(event: Event) {
    const message = (event as CustomEvent).detail;
    if (message.action === 'activate') {
      this.activateCanvas();
    }
    console.log(message)
    this.canvas?.receiveMessage(message);
  }

  private activateCanvas() {
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
    this.canvas = new Canvas(this);
    this.shadowRoot?.appendChild(this.canvas.getCanvasElement());
  }

  private addResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.canvas?.resize();

    });
    this.resizeObserver = resizeObserver;
    this.resizeObserver.observe(this);
  }

  private removeResizeObserver() {
    this.resizeObserver?.unobserve(this);
  }

}

