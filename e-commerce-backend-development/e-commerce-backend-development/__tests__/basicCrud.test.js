// __tests__/BasicServices.test.js
import BasicServices from '../src/services/basicCRUD.js';
import { BlogModel } from '../src/models/blog.model.js';
import { sendResponse } from '../src/common/common.js';
import { CODES } from '../src/common/response-code.js';
import { logger } from '../src/logger/logger.js';

jest.mock('../src/models/blog.model.js'); // Mock the BlogModel
jest.mock('../src/common/common.js', () => ({
  sendResponse: jest.fn(),
}));

jest.mock('../src/logger/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('BasicServices', () => {
  let basicServices;

  beforeEach(() => {
    basicServices = new BasicServices(BlogModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll should return all blog items', async () => {
    const mockBlogs = [{ blogId: '1', title: 'Test Blog' }];
    BlogModel.scan.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockBlogs),
    });

    await basicServices.getAll({});
    
    expect(BlogModel.scan).toHaveBeenCalled();
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, mockBlogs);
  });

  test('getOne should return a single blog item by ID', async () => {
    const mockBlog = { blogId: '1', title: 'Test Blog' };
    BlogModel.get.mockResolvedValue(mockBlog);
    
    const req = { params: { id: '1' } };
    const response = await basicServices.getOne(req);
    
    expect(BlogModel.get).toHaveBeenCalledWith('1');
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, mockBlog);
  });

  test('getOne should return NOT_FOUND if blog does not exist', async () => {
    BlogModel.get.mockResolvedValue(null);
    
    const req = { params: { id: '999' } };
    const response = await basicServices.getOne(req);
    
    expect(BlogModel.get).toHaveBeenCalledWith('999');
    expect(sendResponse).toHaveBeenCalledWith(CODES.NOT_FOUND, 'Not Found');
  });

  test('deleteOne should delete a blog item', async () => {
    BlogModel.get.mockResolvedValue({ blogId: '1' });
    BlogModel.delete.mockResolvedValue();

    const req = { params: { id: '1' } };
    const response = await basicServices.deleteOne(req);

    expect(BlogModel.get).toHaveBeenCalledWith('1');
    expect(BlogModel.delete).toHaveBeenCalledWith('1');
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'Item deleted successfully');
  });

  test('deleteOne should return NOT_FOUND if item does not exist', async () => {
    BlogModel.get.mockResolvedValue(null);
    
    const req = { params: { id: '999' } };
    const response = await basicServices.deleteOne(req);
    
    expect(BlogModel.get).toHaveBeenCalledWith('999');
    expect(sendResponse).toHaveBeenCalledWith(CODES.NOT_FOUND, 'Not Found');
  });

  test('updateOne should update an existing blog item', async () => {
    const mockBlog = { blogId: '1', title: 'Old Title' };
    BlogModel.get.mockResolvedValue(mockBlog);
    BlogModel.update.mockResolvedValue();

    const req = { params: { id: '1' }, body: { title: 'New Title' } };
    const response = await basicServices.updateOne(req);

    expect(BlogModel.get).toHaveBeenCalledWith('1');
    expect(BlogModel.update).toHaveBeenCalledWith('1', { title: 'New Title' });
    expect(sendResponse).toHaveBeenCalledWith(CODES.OK, 'Item updated successfully', { data: undefined });
  });

  test('createOne should create a new blog item', async () => {
    const newBlog = { title: 'New Blog' };
    const req = { body: newBlog };
    BlogModel.create.mockResolvedValue(newBlog);

    const response = await basicServices.createOne(req);

    expect(BlogModel.create).toHaveBeenCalledWith(newBlog);
    expect(sendResponse).toHaveBeenCalledWith(CODES.CREATED, 'Item saved successfully', newBlog);
  });
});
