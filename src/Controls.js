import React from "../_snowpack/pkg/react.js";
import messagingService from "./messagingService.js";
const moveLeftMessage = {
  action: "move-left"
};
const moveRightMessage = {
  action: "move-right"
};
const resetMessage = {
  action: "reset"
};
const createChangeTextMessage = (text) => ({
  action: "change-text",
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
  const onTextChange = (e) => {
    const newText = e.target.value;
    messagingService.send(createChangeTextMessage(newText));
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "controls"
  }, /* @__PURE__ */ React.createElement("label", {
    className: "text-control"
  }, "Text", /* @__PURE__ */ React.createElement("input", {
    onChange: onTextChange
  })), /* @__PURE__ */ React.createElement("button", {
    onClick: onClickLeft
  }, "Left"), /* @__PURE__ */ React.createElement("button", {
    onClick: onClickRight
  }, "Right"), /* @__PURE__ */ React.createElement("button", {
    onClick: onClickReset
  }, "Reset"));
};
export default Controls;
