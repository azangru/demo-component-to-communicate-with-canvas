import React, {useEffect, useRef} from "../_snowpack/pkg/react.js";
import messagingService from "./messagingService.js";
import TextPositionInfo from "./TextPositionInfo.js";
import Controls from "./Controls.js";
import "./my-canvas-element/index.js";
import "./App.css.proxy.js";
const CustomCanvasComponent = () => {
  const componentRef = useRef();
  useEffect(() => {
    const element = componentRef.current;
    messagingService.setElement(element);
    messagingService.send({action: "activate"});
    return () => {
      messagingService.clearElement();
    };
  }, []);
  return React.createElement("my-canvas-element", {
    ref: componentRef
  });
};
const App = () => /* @__PURE__ */ React.createElement("div", {
  className: "wrapper"
}, /* @__PURE__ */ React.createElement(CustomCanvasComponent, null), /* @__PURE__ */ React.createElement(Controls, null), /* @__PURE__ */ React.createElement(TextPositionInfo, null));
export default App;
