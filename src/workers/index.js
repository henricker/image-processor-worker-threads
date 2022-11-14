import Piscina from 'piscina'

export const imageBackgroundPoolThreads = new Piscina({
    filename: './src/workers/image-background.worker.js'
})