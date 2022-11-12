import { Worker } from 'worker_threads'

const worker = new Worker('./src/workers/image-background.worker.js')

worker.on('message', (message) => {
    console.log(message)
})

worker.on('messageerror', (message) => {
    console.log(message)
})

worker.postMessage({
    imageUrl: 'https://static.wikia.nocookie.net/mkwikia/images/e/ee/Predator_render.png',
    backgroundUrl: 'https://wallpaperaccess.com/full/3057585.jpg'
})