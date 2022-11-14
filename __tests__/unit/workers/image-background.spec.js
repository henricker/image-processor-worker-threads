import { describe, it, expect, beforeEach, afterEach, jest, beforeAll } from '@jest/globals'
import { parentPortMock } from './mocks/parent-port-mock.js'
import { ImageBackgroundWorker } from '../../../src/workers/image-background.worker.js'
import { mockAxios } from './mocks/axios-mock.js'
import { mockSharp } from './mocks/sharp-mock.js'
import { BusinessError } from '../../../src/error/business-error.js'

describe('#imageBackground - WORKER', () => {
    let imageBackgroundWorker = new ImageBackgroundWorker({ parentPort: parentPortMock, axios: mockAxios, sharp: mockSharp })

    beforeEach(async () => {
        imageBackgroundWorker = new ImageBackgroundWorker({ parentPort: parentPortMock, axios: mockAxios, sharp: mockSharp })
    })
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    it('Should send business error message if data is invalid', async () => {
      	const message = {
            imageUrl: 'invalid-url',
            backgroundUrl: 'invalid-url'
        }

        imageBackgroundWorker.processThread(message)
            .catch(err => {
                expect(err).toBeInstanceOf(BusinessError)
                expect(err.message).toBe('imageUrl must be a valid URL, backgroundUrl must be a valid URL')
            })
    
    })
    it('Should send internal server error message if error is not a business error', async () => {
        const message = {
            imageUrl: 'https://google.com',
            backgroundUrl: 'https://google.com'
        }

		jest.spyOn(mockAxios, 'get').mockRejectedValueOnce(new Error('any_error'))
  
        imageBackgroundWorker.processThread(message)
            .catch(err => {
                expect(err).toBeInstanceOf(Error)
                expect(err.message).toBe('Internal Server Error')
            })
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

        const imageCompositeBase64 = await imageBackgroundWorker.processThread(message)

        expect(imageCompositeBase64).toEqual(Buffer.from('any_composite_image', 'base64'))
    })
})