import React from 'react';

import messagingService from './messagingService';

const moveLeftMessage = {
  action: 'move-left'
};

const moveRightMessage = {
  action: 'move-right'
};

const resetMessage = {
  action: 'reset'
};

const createChangeTextMessage = (text: string) => ({
  action: 'change-text',
  payload: {
    text
  }
});

const Controls = () => {

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
