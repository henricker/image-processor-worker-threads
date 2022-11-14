import { jest } from '@jest/globals'

export const mockSharp = jest.fn().mockReturnValue({
    composite: jest.fn().mockReturnValue({
        toBuffer: jest.fn().mockResolvedValue(new Promise(resolve => resolve({
            toString: jest.fn().mockReturnValue(Buffer.from('any_composite_image', 'base64'))
        })))
    }),
})

mockSharp.gravity =  {
    south: 'any_gravity'
}

