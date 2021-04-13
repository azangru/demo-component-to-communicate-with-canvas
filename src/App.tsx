import React, { useEffect, useState } from 'react';

import MessagingService from './messagingService';

import TextPositionInfo from './TextPositionInfo';
import Controls from './Controls';
import {createMessagingAction, MessagingAction} from  './actions';

import './App.css';

// Since it's a custom element, we can't directly use it in JSX like so: <my-canvas-element />
// because typescript, which is not aware of the existence of this element, will object
const BrowserControls = (props: {elementId: string}) => {

  const [messagingService, setMessagingService] = useState<MessagingService | null>(null);

  useEffect(() => {

    setMessagingService(new MessagingService(props.elementId));
    if(!messagingService){
      return;
    }
    messagingService.send(
      createMessagingAction({
        action: MessagingAction.ACTIVATE
      })
    );

    return () => {
      messagingService.clearElement();
    }
  }, []);
  
  return (
    <>
      {messagingService && (
        <>
          <Controls messagingService={messagingService} />
          <TextPositionInfo  messagingService={messagingService} />
        </>
      )}
    </>
  )
}

const App = () => {
  
 return  <div className="container">
    <div className="wrapper">
      <div className={'browser'} id={'browser1'}></div>
      <BrowserControls elementId={'browser1'} />
    </div>
    <div  className="wrapper">
      <div className={'browser'} id={'browser2'}></div>
      <BrowserControls elementId={'browser2'} />
    </div>
  </div>
};

export default App;
