const subscriptions = new Map();
let element = null;
const setElement = (el) => {
  element = el;
  element.addEventListener("outgoing-message", handleMessage);
};
const clearElement = () => element = null;
const handleMessage = (event) => {
  const detail = event.detail;
  const {action, payload} = detail;
  const subscriptionsToAction = subscriptions.get(action);
  subscriptionsToAction?.forEach((fn) => fn(payload));
};
const send = (message) => {
  if (!element) {
    return;
  }
  const event = new CustomEvent("incoming-message", {
    detail: message,
    bubbles: false
  });
  element.dispatchEvent(event);
};
const subscribe = (action, callback) => {
  const subscriptionsToAction = subscriptions.get(action);
  if (subscriptionsToAction) {
    subscriptionsToAction.add(callback);
  } else {
    subscriptions.set(action, new Set([callback]));
  }
  return {
    unsubscribe() {
      subscriptionsToAction?.delete(callback);
    }
  };
};
export default {
  setElement,
  clearElement,
  send,
  subscribe
};
