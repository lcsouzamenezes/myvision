import {
  createNewBndBoxBtnClick, createNewPolygonBtnClick,
  addPointsBtnClick, removeActiveShapeBtnClick,
  removePolygonPointBtnClick, downloadXMLBtnClick,
  uploadImageBtnClick, resetCanvasEventsToDefault,
} from './buttonEvents/facade';
import {
  interruptCanvasEventsBeforeFunc, interruptCanvasEventsAfterFunc,
  interruptCanvasEventsBeforeFuncWParams, doNothingIfLabellingInProgress,
  interruptCanvasEventsNoPointRemovalBeforeFunc,
} from './buttonMiddleware/buttonMiddleware';

function assignToolkitButtonEvents() {
  window.createNewBndBox = interruptCanvasEventsBeforeFunc.bind(this, createNewBndBoxBtnClick);
  window.createNewPolygon = interruptCanvasEventsBeforeFunc.bind(this, createNewPolygonBtnClick);
  window.addPoints = interruptCanvasEventsNoPointRemovalBeforeFunc.bind(this, addPointsBtnClick);
  window.removePoint = doNothingIfLabellingInProgress.bind(this, removePolygonPointBtnClick);
  window.downloadXML = interruptCanvasEventsBeforeFunc.bind(this, downloadXMLBtnClick);
  window.cancel = interruptCanvasEventsBeforeFunc.bind(this, resetCanvasEventsToDefault);
  window.uploadImage = interruptCanvasEventsBeforeFuncWParams.bind(this, this, uploadImageBtnClick);
  window.removeShape = interruptCanvasEventsAfterFunc.bind(this,
    removeActiveShapeBtnClick, resetCanvasEventsToDefault);
}

export { assignToolkitButtonEvents as default };
