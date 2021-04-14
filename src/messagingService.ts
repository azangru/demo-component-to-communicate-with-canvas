import { Message } from './actions';
import { Canvas, canvasTemplate } from './example-canvas/canvas';


const subscriptions = new Map<string, Set<Function>>();
class MessagingService {

  canvas: Canvas | null = null;
  element: HTMLElement | null= null;
  elementId: string = '';

   constructor (elementId: string) {
    this.elementId = elementId;
    this.setCanvasElement(elementId);

  };

  public setCanvasElement = (elementId: string) => {

    const el = document.getElementById(elementId) as HTMLElement;
    if(!el){
      return;
    }
    this.element = el;
    
    // If the canvas is already present, do not create another one
    if(!this.element?.getElementsByTagName('canvas')){
      this.element?.appendChild(canvasTemplate.content.cloneNode(true));
      this.canvas = new Canvas(this.element, this.handleMessage);
      this.element?.appendChild(this.canvas.getCanvasElement());
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


}

export default MessagingService;




