import fabric from 'fabric';
import { getIsMouseOnCanvasStatus, executeFunctionOnceOnMouseOver, executeFunctionOnceOnMouseOut } from '../../../keyEvents/mouse/mouseOverOut';
import { getLastMouseMoveEvent } from '../../../keyEvents/mouse/mouseMove';

let canvasCrosshairLineX = null;
let canvasCrosshairLineY = null;
let outsideCrosshairLineX = null;
let outsideCrosshairLineY = null;
const HORIZONTAL_DELTA = 0.3;
const VERTICAL_DELTA = 0.7;

function moveCanvasCrosshair(event, canvas) {
  if (!event.pointer.x) return;
  canvasCrosshairLineX.set({
    x1: event.pointer.x + VERTICAL_DELTA,
    x2: event.pointer.x + VERTICAL_DELTA,
  });
  canvasCrosshairLineY.set({
    y1: event.pointer.y - HORIZONTAL_DELTA,
    y2: event.pointer.y - HORIZONTAL_DELTA,
  });
  canvas.renderAll();
}

function hideCanvasCrosshair(canvas) {
  canvasCrosshairLineX.set({ x1: -10, x2: -10, y2: canvas.height });
  canvasCrosshairLineY.set({ y1: -10, y2: -10, x2: canvas.width });
  canvas.renderAll();
}

function hideOutsideCrosshair() {
  outsideCrosshairLineX.style.top = '-10px';
  outsideCrosshairLineY.style.left = '-10px';
}

function hideCrosshair(canvasObj) {
  const canvas = canvasObj || this;
  hideCanvasCrosshair(canvas);
  hideOutsideCrosshair();
}

function newCanvasCrosshairLine() {
  return new fabric.Line([0, 0, 0, 0], {
    fill: 'white',
    stroke: 'white',
    strokeWidth: 1,
    selectable: false,
    evented: false,
  });
}

function addCanvasCrosshairLines(canvas) {
  canvasCrosshairLineX = newCanvasCrosshairLine();
  canvasCrosshairLineY = newCanvasCrosshairLine();
  canvas.add(canvasCrosshairLineX);
  canvas.add(canvasCrosshairLineY);
  hideCanvasCrosshair(canvas);
}

// decided not move the outer crosshair upon mouse click or redrawing of a shape
// to prevent extra mouse listeners
function addMouseMoveEventHandlerToElement(element, crosshairX, crosshairY) {
  element.addEventListener('mousemove', (event) => {
    if (!event.pageY) {
      event = getLastMouseMoveEvent();
    }
    crosshairX.style.top = `${event.pageY - HORIZONTAL_DELTA}px`;
    crosshairY.style.left = `${event.pageX + VERTICAL_DELTA}px`;
  });
}

// need to remove these event listeners later on
function addCrosshairOutsideOfCanvas() {
  outsideCrosshairLineX = document.getElementById('crosshair-line-x');
  outsideCrosshairLineY = document.getElementById('crosshair-line-y');
  addMouseMoveEventHandlerToElement(document.getElementById('canvas-absolute-container-1'), outsideCrosshairLineX, outsideCrosshairLineY);
  addMouseMoveEventHandlerToElement(document.getElementById('canvas-absolute-container-2'), outsideCrosshairLineX, outsideCrosshairLineY);
  // document.getElementById('zoom-overflow-wrapper-parent')
  // .addEventListener('mousemove', (event) => {
  //   // crosshair deltas
  //   const top = `${event.pageY}px`;
  //   outsideCrossshairLineX.style.top = top;
  //   const left = `${event.pageX}px`;
  //   outsideCrosshairLineY.style.left = left;
  // });
  // get UX help: one of the two, full crosshair in grey space or no crosshair in greenspace
  // with the crosshair being only in the canvas area
  // document.getElementById('zoom-overflow-wrapper-parent').style.cursor = 'none';
}

function removeCrosshairLinesIfExisting(canvas) {
  if (canvasCrosshairLineX) canvas.remove(canvasCrosshairLineX);
  if (canvasCrosshairLineY) canvas.remove(canvasCrosshairLineY);
}

function setAllObjectsToUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
    iteratedObj.hoverCursor = 'none';
  });
}

function moveCrosshairToPosition(canvasArg) {
  const canvas = canvasArg || this;
  const lastMouseMoveEvent = getLastMouseMoveEvent();
  const lastCanvasPointer = canvas.getPointer(lastMouseMoveEvent);
  const pointerEvent = { pointer: lastCanvasPointer };
  moveCanvasCrosshair(pointerEvent, canvas);
  document.getElementById('canvas-absolute-container-1').dispatchEvent(new Event('mousemove'));
  document.getElementById('canvas-absolute-container-2').dispatchEvent(new Event('mousemove'));
}

function setDrawWithCrosshairMode(canvas, resetting) {
  canvas.discardActiveObject();
  canvas.defaultCursor = 'none';
  canvas.hoverCursor = 'none';
  setAllObjectsToUneditable(canvas);
  executeFunctionOnceOnMouseOut(hideCrosshair.bind(canvas));
  // upon attempting to draw after labelling a shape, wait for the onmouseenter event
  // to be emitted by the canvas
  if (resetting) {
    executeFunctionOnceOnMouseOver(moveCrosshairToPosition.bind(canvas));
  } else {
    removeCrosshairLinesIfExisting(canvas);
    addCanvasCrosshairLines(canvas);
    addCrosshairOutsideOfCanvas();
    if (getIsMouseOnCanvasStatus()) moveCrosshairToPosition(canvas);
    canvas.renderAll();
  }
}

export {
  setDrawWithCrosshairMode, hideCrosshair,
  setAllObjectsToUneditable, moveCanvasCrosshair,
};
