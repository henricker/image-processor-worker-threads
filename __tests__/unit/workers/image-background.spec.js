import { describe, it, expect, beforeEach, afterEach, jest, beforeAll } from '@jest/globals'
import { parentPortMock } from './mocks/parent-port-mock.js'
import { ImageBackgroundWorker } from '../../../src/workers/image-background.worker.js'
import { mockAxios } from './mocks/axios-mock.js'
import { mockSharp } from './mocks/sharp-mock.js'

describe('#imageBackground - WORKER', () => {
    let imageBackgroundWorker = new ImageBackgroundWorker({ parentPort: parentPortMock, axios: mockAxios, sharp: mockSharp })

    beforeEach(async () => {
        imageBackgroundWorker = new ImageBackgroundWorker({ parentPort: parentPortMock, axios: mockAxios, sharp: mockSharp })
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

		jest.spyOn(mockAxios, 'get').mockRejectedValueOnce(new Error('any_error'))
  
        await imageBackgroundWorker.handleMessage(message)

		expect(parentPortMock.emit).toHaveBeenCalledWith('messageerror', 'Internal server error')
       	expect(parentPortMock.removeAllListeners).toBeCalled()
		expect(parentPortMock.unref).toBeCalled()
    })
    it('Should send message to parent process with base 64 image', async () => {
        const message = {
            imageUrl: 'https://google.com',
            backgroundUrl: 'https://google.com'
        }

        const imageBuffer = Buffer.from('any_image_buffer')
        const backgroundBuffer = Buffer.from('any_background_buffer')

        jest.spyOn(mockAxios, 'get').mockResolvedValueOnce({
            data: imageBuffer
        }).mockResolvedValueOnce({
            data: backgroundBuffer
        })

        await imageBackgroundWorker.handleMessage(message)

        expect(parentPortMock.postMessage).toBeCalledWith(Buffer.from('any_composite_image', 'base64'))
    })
})