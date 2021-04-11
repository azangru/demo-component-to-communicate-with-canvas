// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".wrapper {\n  height: 100%;\n  display: grid;\n  grid-template-areas:\n              'header header'\n              'main   aside';\n  grid-template-columns: 1fr 10vw;\n  grid-template-rows: 20vh 1fr; \n}\n\nmy-canvas-element {\n  box-sizing: border-box;\n  grid-area: main;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n\n.controls {\n  grid-area: aside;\n  padding: 0.6rem;\n}\n\n.text-control input {\n  margin-bottom: 1rem;\n}\n\n.text-control input {\n  max-width: 100%;\n}\n\n.textPositionInfo {\n  grid-area: header;\n  align-self: center;\n  justify-self: center;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}