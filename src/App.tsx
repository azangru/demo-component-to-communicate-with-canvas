import React, { useEffect, useRef } from 'react';

import messagingService from './messagingService';

import TextPositionInfo from './TextPositionInfo';
import Controls from './Controls';

import './my-canvas-element';
import { MyCanvasElement } from './my-canvas-element/myCanvasElement';

import './App.css';

// Since it's a custom element, we can't directly use it in JSX like so: <my-canvas-element />
// because typescript, which is not aware of the existence of this element, will object
const CustomCanvasComponent = () => {
  const componentRef = useRef<MyCanvasElement | null>();

  useEffect(() => {
    const element = componentRef.current as MyCanvasElement;
    messagingService.setElement(element);
    messagingService.send({ action: 'activate' });

    return () => {
      messagingService.clearElement();
    }
  }, []);
  
  return React.createElement('my-canvas-element', {
    ref: componentRef
  });
}

const App = () => (
  <div className="wrapper">
    <CustomCanvasComponent />
    <Controls />
    <TextPositionInfo />
  </div>
);

export default App;
