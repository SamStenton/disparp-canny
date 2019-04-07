const { workerData, parentPort } = require('worker_threads')
const Image = require('image-js').Image;
const cannyEdgeDetector = require('canny-edge-detector');


Image.load(workerData).then((img) => {
  const grey = img.grey();
  const edge = cannyEdgeDetector(grey);
  edge.save(workerData);
  parentPort.postMessage(edge.data.buffer)
})


