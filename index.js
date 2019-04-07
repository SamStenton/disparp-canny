const { Worker } = require('worker_threads')

const Image = require('image-js').Image;
const cannyEdgeDetector = require('./canny');

const run = async () => {
  Image.load('./images/image2.JPG').then((img) => {
    const start = new Date();
    const grey = img.grey();
    const edge = cannyEdgeDetector(grey);
    edge.save('output.jpg');
    console.log("Run Took: ", new Date() - start);
  });
};

run();
