import React, { useEffect, useState } from 'react';
import { MessagingAction } from './actions';

import MessagingService from './messagingService';

const TextPositionInfo = (props: {messagingService: MessagingService}) => {
  
  const {messagingService} = props;
  const elementId = messagingService.getElementId();

  const [x, setX] = useState<number | null>();

  const onTextMoved = (payload: { x: number }) => {
    setX(payload.x);
  };

  useEffect(() => {
    messagingService.subscribe(`${elementId}-${MessagingAction.TEXT_MOVED}`, onTextMoved);
  }, []);
  
  return (
    <div className="textPositionInfo">
      <span>Text x coordinate: </span>
      <span>{x}</span>
    </div>
  )

}

export default TextPositionInfo;
