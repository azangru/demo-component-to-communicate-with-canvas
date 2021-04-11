import React, {useEffect, useState} from "../_snowpack/pkg/react.js";
import messagingService from "./messagingService.js";
const TextPositionInfo = () => {
  const [x, setX] = useState();
  const onTextMoved = (payload) => {
    setX(payload.x);
  };
  useEffect(() => {
    messagingService.subscribe("text-moved", onTextMoved);
  });
  return /* @__PURE__ */ React.createElement("div", {
    className: "textPositionInfo"
  }, /* @__PURE__ */ React.createElement("span", null, "Text x coordinate: "), /* @__PURE__ */ React.createElement("span", null, x));
};
export default TextPositionInfo;
