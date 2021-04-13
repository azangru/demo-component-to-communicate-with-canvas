import { Message } from './actions';
import { Canvas } from './example-canvas/canvas';

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

const subscriptions = new Map<string, Set<Function>>();

let element: HTMLElement | null = null;
type IncomingMessage = {
  action: string;
  payload?: Record<string, unknown>
};


class MessagingService {

  canvas: Canvas | null = null;
  element: HTMLElement | null= null;
  elementId: string = '';
  resizeObserver: ResizeObserver | null = null;

   constructor (elementId: string) {
    this.elementId = elementId;
    this.setElement(elementId);

  };

  public setElement = (elementId: string) => {

    const el = document.getElementById(elementId) as HTMLElement;
    
    if(!el){
      return;
    }

    this.element = el;
  
    if(!this.element?.innerHTML){
      this.element?.appendChild(template.content.cloneNode(true));
      this.canvas = new Canvas(this.element, this.handleMessage);
      this.element?.appendChild(this.canvas.getCanvasElement());

      // this.element.addEventListener('outgoing-message', this.handleMessage);
      this.addResizeObserver();
    } else {
      this.canvas = new Canvas(this.element, this.handleMessage);
    }

  }

  public getElementId = () => this.elementId;
  
  public clearElement = () => element = null;
  
  private handleMessage = (message: Message) => {

    const { action, payload } = message;
    const subscriptionsToAction = subscriptions.get(`${this.elementId}-${action}`);

    subscriptionsToAction?.forEach(fn => fn(payload));
  }
  
  public send = (message: Message) => {
    if (!this.element) {
      return;
    }
  
    this.canvas?.receiveMessage(message);
  };
  
  public subscribe = (action: string, callback: Function) => {
    
    const subscriptionsToAction = subscriptions.get(`${this.elementId}-${action}`);
    if (subscriptionsToAction) {
      subscriptionsToAction.add(callback);
    } else {
      subscriptions.set(action, new Set([callback]));
    }
  
    return {
      unsubscribe() {
        subscriptionsToAction?.delete(callback)
      }
    }
  };


  private addResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.canvas?.resize();
    });
    this.resizeObserver = resizeObserver;
    this.resizeObserver.observe(this.element?.parentNode as Element);
  }

  // private removeResizeObserver() {
  //   this.resizeObserver?.unobserve(this.element as Element);
  // }

}

export default MessagingService;




