import { jest } from '@jest/globals'

export const parentPortMock = {
        on: jest.fn(),
        emit: jest.fn(),
        postMessage: jest.fn(),
        removeAllListeners: jest.fn(),
        unref: jest.fn()
 }