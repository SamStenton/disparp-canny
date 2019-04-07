const { Worker } = require('worker_threads')
const gm = require('gm');
const Image = require('image-js').Image;
const cannyEdgeDetector = require('canny-edge-detector');
// Get system thread count
const threadCount = (require('os')).cpus().length;

/**
 * Some boilerplate for running threads
 * @param {Any} workerData 
 */
function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  })
}

// obtain the size of an image
const getSize = (image) => new Promise((resolve, reject) => {
  gm(image).size((err, size) => {
    if(err) reject(err);
    resolve(size);
  });
})

const slice = (image, slices) => new Promise(async (resolve, reject) => {
  const images = [];
  size = await getSize(image);
  for (let i = 0; i < slices; i++) {
    await gm(image).crop(size.width / slices, size.height, (size.width / slices) * i + 1, 0).write(`output/output${i}.jpg`, (err) => reject);
    images.push(`output/output${i}.jpg`);
  }

  resolve(images);
});

const run = async () => {
  const images = await slice('images/image2.JPG', threadCount);
  const jobs = images.map(image => {
    return runWorker(image);
  })

  return Promise.all(jobs);
}

let start = new Date();
run().then((res) => {
  console.log("Threaded Image processing time: ", new Date() - start);
});

start = new Date();
Image.load('images/image2.JPG').then((img) => {
  const grey = img.grey();
  const edge = cannyEdgeDetector(grey);
  console.log("Non-Threaded Image processing time: ", new Date() - start);
})