import { parentPort as parentThreadPort } from 'worker_threads'
import axios from 'axios'
import sharp from 'sharp'
import errors from '../error/index.js'
import * as yup from 'yup';
const { 
    BusinessError,
    InternalServerError,
} = errors

const kparentPort = Symbol('parentPort')
export class ImageBackgroundWorker {
    
    #sharp = null;
    #axios = null;
    constructor({ parentPort, axios, sharp }) {
        this[kparentPort] = parentPort
        this.#sharp = sharp
        this.#axios = axios
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
        const response = await this.#axios.get(url, {
            responseType: 'arraybuffer'
        })

        return response.data;
    }

    async processThread({ imageUrl, backgroundUrl }) {
        try {
            const isValid = await this.#validateData({ imageUrl, backgroundUrl })
            if(!isValid.valid) {
                throw new BusinessError(isValid.errors)
            }

            const imageBuffer = await this.#downloadImage(imageUrl)
            const backgroundBuffer = await this.#downloadImage(backgroundUrl)

            const compositeImage = await this.#sharp(backgroundBuffer).composite([
                { input: imageBuffer, gravity: this.#sharp.gravity.south }
            ]).toBuffer()

            return compositeImage.toString('base64')
        } catch(err) {
            const message = err instanceof InternalServerError ? 'Internal server error' : err.message 

            if(message === 'Internal server error') {
                const internalError = new InternalServerError(message)
                internalError.stack = err.stack
                throw internalError
            }
        
            throw err
        }
    }
}

export default (data) => {
    if(process.env.NODE_ENV !== 'test') {
        return new ImageBackgroundWorker({ parentPort: parentThreadPort, axios, sharp }).processThread(data)
    }
}



