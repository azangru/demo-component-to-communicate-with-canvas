import React, { useEffect, useState } from 'react';

import messagingService from './messagingService';

const TextPositionInfo = () => {
  const [x, setX] = useState<number | null>();

  const onTextMoved = (payload: { x: number }) => {
    setX(payload.x);
  };

  useEffect(() => {
    messagingService.subscribe('text-moved', onTextMoved);
  });
  
  return (
    <div className="textPositionInfo">
      <span>Text x coordinate: </span>
      <span>{x}</span>
    </div>
  )

}

export default TextPositionInfo;
