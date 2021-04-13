import React from 'react';

import MessagingService from './messagingService';
import {createMessagingAction, MessagingAction} from  './actions';


const moveLeftMessage = createMessagingAction({
  action: MessagingAction.MOVE_LEFT
});

const moveRightMessage = createMessagingAction({
  action: MessagingAction.MOVE_RIGHT
});

const resetMessage = createMessagingAction({
  action: MessagingAction.MOVE_LEFT
});

const createChangeTextMessage = (text: string) => createMessagingAction({
  action: MessagingAction.CHANGE_TEXT,
  payload: {
    text
  }
});


const Controls = (props: {messagingService: MessagingService}) => {

  const {messagingService} = props;
  
  const onClickLeft = () => {
    messagingService.send(moveLeftMessage);
  };

  const onClickRight = () => {
    messagingService.send(moveRightMessage);
  };

  const onClickReset = () => {
    messagingService.send(resetMessage);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    messagingService.send(createChangeTextMessage(newText));
  }

  return (
    <div className="controls">
      <label className="text-control">
        Text
        <input onChange={onTextChange} />
      </label>
      <button onClick={onClickLeft}>Left</button>
      <button onClick={onClickRight}>Right</button>
      <button onClick={onClickReset}>Reset</button>
    </div>
  );
};

export default Controls;
