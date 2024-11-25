import AddUserAddressService from '../../src/services/userService/addAddress.js';
import { sendResponse } from '../../src/common/common.js';
import { CODES } from '../../src/common/response-code.js';

// Mocking the user model
const mockUserModel = {
  get: jest.fn(),
};

describe('AddUserAddressService', () => {
  let service;

  beforeEach(() => {
    service = new AddUserAddressService(mockUserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add a new address and return updated user', async () => {
    const req = {
      body: {
        user: {
          email: 'test@example.com',
        },
        newAddress: {
          street: '123 Main St',
          city: 'Sample City',
          zip: '12345',
        },
      },
    };

    const existingUser = {
      email: 'test@example.com',
      address: [],
      save: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        address: [
          {
            street: '123 Main St',
            city: 'Sample City',
            zip: '12345',
          },
        ],
      }),
    };

    mockUserModel.get.mockResolvedValue(existingUser);

    const response = await service.addUserAddress(req);

    expect(response).toEqual(sendResponse(CODES.OK, {
      email: 'test@example.com',
      address: [
        {
          street: '123 Main St',
          city: 'Sample City',
          zip: '12345',
        },
      ],
    }));
    expect(existingUser.address).toHaveLength(1);
    expect(existingUser.save).toHaveBeenCalled();
  });

  test('should return an error if email or newAddress is missing', async () => {
    const req = {
      body: {
        user: {
          email: 'test@example.com',
        },
      },
    };

    const response = await service.addUserAddress(req);

    expect(response).toEqual(sendResponse(CODES.BAD_REQUEST, 'Email and new address are required'));
  });

  test('should return an error if user is not found', async () => {
    const req = {
      body: {
        user: {
          email: 'nonexistent@example.com',
        },
        newAddress: {
          street: '456 Another St',
          city: 'Another City',
          zip: '67890',
        },
      },
    };

    mockUserModel.get.mockResolvedValue(null);

    const response = await service.addUserAddress(req);

    expect(response).toEqual(sendResponse(CODES.NOT_FOUND, 'User not found'));
  });

  test('should return an error if an exception occurs', async () => {
    const req = {
      body: {
        user: {
          email: 'test@example.com',
        },
        newAddress: {
          street: '123 Main St',
          city: 'Sample City',
          zip: '12345',
        },
      },
    };

    mockUserModel.get.mockRejectedValue(new Error('Database error'));

    const response = await service.addUserAddress(req);

    expect(response).toEqual(sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in addUserAddress API'));
  });
});
