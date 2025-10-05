import { jest } from '@jest/globals';

const mockCartItemResult = [{
  id: 1,
  sessionId: 'test-session',
  menuItemId: 6,
  quantity: 2,
}];

const mockMenuItemResult = [{
    id: 6,
    name: 'Mocked Item',
    price: 10,
}];

const mockImplementation = {
  then: jest.fn()
    .mockImplementationOnce(((onFulfilled: (value: any) => any) => Promise.resolve(onFulfilled(mockCartItemResult))) as any)
    .mockImplementationOnce(((onFulfilled: (value: any) => any) => Promise.resolve(onFulfilled(mockMenuItemResult))) as any)
    .mockImplementation(((onFulfilled: (value: any) => any) => Promise.resolve(onFulfilled([]))) as any),

  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),

  returning: jest.fn<() => Promise<any>>().mockResolvedValue(mockCartItemResult),
};

export const db = {
  select: jest.fn().mockReturnValue(mockImplementation),
  insert: jest.fn().mockReturnValue(mockImplementation),
  update: jest.fn().mockReturnValue(mockImplementation),
  delete: jest.fn().mockReturnValue(mockImplementation),
};