import { describe, it, expect, beforeEach, afterEach, jest, beforeAll } from '@jest/globals'
import { parentPortMock } from './mocks/parent-port-mock.js'
import axios from 'axios'

import { ImageBackgroundWorker } from '../../../src/workers/image-background.worker.js'

describe('#imageBackground - WORKER', () => {
    let imageBackgroundWorker = new ImageBackgroundWorker({ parentPort: parentPortMock })

    beforeEach(async () => {
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

       await imageBackgroundWorker.handleMessage(message)
     
			expect(parentPortMock.emit).toHaveBeenCalledWith('messageerror', 'imageUrl must be a valid URL, backgroundUrl must be a valid URL')
			expect(parentPortMock.removeAllListeners).toBeCalled()
			expect(parentPortMock.unref).toBeCalled()
    
    })
    it('Should send internal server error message if error is not a business error', async () => {
        const message = {
            imageUrl: 'https://google.com',
            backgroundUrl: 'https://google.com'
        }

				jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('any_error'))
  
        await imageBackgroundWorker.handleMessage(message)

				expect(parentPortMock.emit).toHaveBeenCalledWith('messageerror', 'Internal server error')
       	expect(parentPortMock.removeAllListeners).toBeCalled()
				expect(parentPortMock.unref).toBeCalled()
    })
    it.todo('Should return a base64 image')
})