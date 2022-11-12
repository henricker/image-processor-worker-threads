import { parentPort as parentThreadPort } from 'worker_threads'
import { BusinessError } from '../error/business-error.js'
import * as yup from 'yup';
import sharp from 'sharp';
import axios from 'axios'

const kparentPort = Symbol('parentPort')
export class ImageBackgroundWorker {
    
    constructor({ parentPort }) {
        this[kparentPort] = parentPort
        this.#listenEvents()
    }

    #listenEvents() {
        this[kparentPort].on('message', this.handleMessage.bind(this))
    }

    async #validateData(data) {
        const schema = yup.object().shape({
            imageUrl: yup.string().url().required(),
            backgroundUrl: yup.string().url().required()
        })

        try {
            await schema.validate(data, {
                abortEarly: false
            })
            return { valid: true }
        } catch(err) {
            return {
                valid: false,
                errors: err.errors.join(', ')
            }
        }
    }

    async #downloadImage(url) {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        })

        return response.data;
    }

    async handleMessage({ imageUrl, backgroundUrl }) {
        try {
            const isValid = await this.#validateData({ imageUrl, backgroundUrl })
            if(!isValid.valid) {
                throw new BusinessError(isValid.errors)
            }
            const imageBuffer = await this.#downloadImage(imageUrl)
            const backgroundBuffer = await this.#downloadImage(backgroundUrl)

            const compositeImage = await sharp(backgroundBuffer).composite([
                { input: imageBuffer, gravity: sharp.gravity.south }
            ]).toBuffer()

            const compositeBase64 = compositeImage.toString('base64')


            this[kparentPort].postMessage(compositeBase64)
        } catch(err) {
            const message = err instanceof BusinessError ? err.message : 'Internal server error' 
            this[kparentPort].emit('messageerror', message.trim())
            this[kparentPort].removeAllListeners()
            this[kparentPort].unref()
        }
    }
}

if(process.env.NODE_ENV !== 'test') {
    new ImageBackgroundWorker({ parentPort: parentThreadPort })
}

