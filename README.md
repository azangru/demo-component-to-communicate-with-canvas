# Description

This is a little proof-of-concept demo investigating the feasibility of encapsulating code responsible for drawing things on a canvas in a web component which serves as an interface for communication with the outside world. It further investigates how well such a component will function inside a React app.

## Quick tour of the repo

1) The central part of this demo is the web component itself (see [src/my-canvas-element](src/my-canvas-element/myCanvasElement)). The component is very basic. The scope of its responsibilities is:
  - To bootstrap the canvas code when it gets mounted onto the DOM.
  - To present a surface that can both receive and emit events for communication with the outside world. The events do not bubble; which means that they should not spread beyond the component's surface.
  - To keep an eye on its dimensions and to inform the canvas module when they change.
  - To clean up after itself when it gets removed from the DOM.

2) [example-canvas](src/example-canvas) is a very simple module that's responsible for creating a canvas and displaying text on it. The canvas module informs the outside world of the position of the text every time it changes by dispatching a custom event.

3) A [simple React wrapper](src/App.tsx) to test web component's behaviour. It can tell the component to move the text to the right or to the left, to change the text, or to reset it to the initial value. This communication is happening by dispatching events against the custom element. On the other hand, the React wrapper can subscribe to the events emitted by the custom element, and thus be informed of the goings-on inside the canvas (e.g. the text's x coordinate). 
