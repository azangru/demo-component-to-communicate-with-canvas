export type Message = {
  action: string;
  payload?: Record<string, unknown>
};

const subscriptions = new Map<string, Set<Function>>();

let element: HTMLElement | null = null;

const setElement = (el: HTMLElement) => {
  element = el;
  element.addEventListener('outgoing-message', handleMessage);
};

const clearElement = () => element = null;

const handleMessage = (event: Event) => {
  const detail: Message = (event as CustomEvent).detail;
  const { action, payload } = detail;
  const subscriptionsToAction = subscriptions.get(action);
  subscriptionsToAction?.forEach(fn => fn(payload));
}

const send = (message: Message) => {
  if (!element) {
    return;
  }
  const event = new CustomEvent('incoming-message', {
    detail: message,
    bubbles: false 
  });
  element.dispatchEvent(event);
};

const subscribe = (action: string, callback: Function) => {
  const subscriptionsToAction = subscriptions.get(action);
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

export default {
  setElement,
  clearElement,
  send,
  subscribe
};
