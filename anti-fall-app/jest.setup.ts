import '@testing-library/jest-dom';
import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.assign(global, {
  ResizeObserver: ResizeObserverMock,
  crypto: {
    randomUUID: () => 'test-random-uuid',
  },
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { priority, fill, ...rest } = props;
    return React.createElement('img', rest);
  },
}));
