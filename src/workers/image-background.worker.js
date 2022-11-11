import { parentPort as parentThreadPort } from 'worker_threads'
import { BusinessError } from '../error/business-error'
import * as yup from 'yup';

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

    async handleMessage({ imageUrl, backgroundUrl }) {
        try {
            const isValid = await this.#validateData({ imageUrl, backgroundUrl })
            if(!isValid.valid) {
                throw new BusinessError(isValid.errors)
            }
        } catch(err) {
            const message = err instanceof BusinessError ? err.message : 'Internal server error' 
            this[kparentPort].emit('messageError', message.trim())
            this[kparentPort].removeAllListeners()
            this[kparentPort].unref()
        }
    }
}