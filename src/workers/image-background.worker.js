import { parentPort } from 'worker_threads'
import { BusinessError } from '../error/business-error'

const kparentPort = Symbol('parentPort')

class ImageBackgroundWorker {
    constructor() {
        this[kparentPort] = parentPort
        this.#listenEvents()
    }

    #listenEvents() {
        this[kparentPort].on('message', this.handleMessage.bind(this))
    }

    handleMessage({ imageUrl, backgroundUrl }) {
        try {
            
        } catch(err) {
            if(err instanceof BusinessError) {
                this[kparentPort].emit('messageerror', err.message)
            } else {
                this[kparentPort].emit('messageError', 'Internal Server Error')
            } 
            this[kparentPort].removeAllListeners()
            this[kparentPort].unref()
        }
    }
}