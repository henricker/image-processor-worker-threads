import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { ImageBackgroundWorker } from '../../../src/workers/image-background.worker.js'
import { parentPortMock } from './mocks/parent-port-mock.js'

describe('#imageBackground - WORKER', () => {
    let imageBackgroundWorker = new ImageBackgroundWorker({ parentPort: parentPortMock })

    beforeEach(() => {
        imageBackgroundWorker = new ImageBackgroundWorker({ parentPort: parentPortMock })
    })
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })
    it('Should listen message event', () => {
        expect(parentPortMock.on).toHaveBeenCalledWith('message', expect.any(Function))
    })
    it('Should send business error message if data is invalid', async () => {
        const message = {
            imageUrl: 'invalid-url',
            backgroundUrl: 'invalid-url'
        }

       imageBackgroundWorker.handleMessage(message)
       .catch(_ => {
            expect(parentPortMock.emit).toHaveBeenCalledWith('messageError', 'imageUrl must be a valid URL, backgroundUrl must be a valid URL')
            expect(parentPortMock.removeAllListeners).toBeCalled()
            expect(parentPortMock.unref).toBeCalled()
       })
    })
    it.todo('Should send internal server error message if error is not a business error')
    it.todo('Should return a base64 image')
})