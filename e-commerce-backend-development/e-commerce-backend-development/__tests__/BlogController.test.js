// __tests__/BlogController.test.js
import { addBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from '../src/controller/blog.controller.js';
import BasicServices from '../src/services/basicCRUD.js';
import { logger } from '../src/logger/logger.js';
import { sendResponse } from '../src/common/common.js';
import { CODES } from '../src/common/response-code.js';

jest.mock('../src/services/basicCRUD.js');

describe('Blog Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Reset the mocks for each test
    BasicServices.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('addBlog should create a blog and return success', async () => {
    req.body = { title: 'New Blog' };
    BasicServices.prototype.createOne = jest.fn().mockResolvedValue({ status: CODES.CREATED, data: req.body });

    await addBlog(req, res);

    expect(BasicServices.prototype.createOne).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(CODES.CREATED);
    expect(res.json).toHaveBeenCalledWith({ status: CODES.CREATED, data: req.body });
  });

  test('getBlogs should return all blogs', async () => {
    BasicServices.prototype.getAll = jest.fn().mockResolvedValue({ status: CODES.OK, data: [] });

    await getBlogs(req, res);

    expect(BasicServices.prototype.getAll).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(CODES.OK);
    expect(res.json).toHaveBeenCalledWith({ status: CODES.OK, data: [] });
  });

  test('getBlogById should return a single blog by ID', async () => {
    req.params.id = '1';
    BasicServices.prototype.getOne = jest.fn().mockResolvedValue({ status: CODES.OK, data: { blogId: '1', title: 'Test Blog' } });

    await getBlogById(req, res);

    expect(BasicServices.prototype.getOne).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(CODES.OK);
    expect(res.json).toHaveBeenCalledWith({ status: CODES.OK, data: { blogId: '1', title: 'Test Blog' } });
  });

  test('updateBlog should update an existing blog', async () => {
    req.params.id = '1';
    req.body = { title: 'Updated Blog' };
    BasicServices.prototype.updateOne = jest.fn().mockResolvedValue({ status: CODES.OK, data: { blogId: '1', title: 'Updated Blog' } });

    await updateBlog(req, res);

    expect(BasicServices.prototype.updateOne).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(CODES.OK);
    expect(res.json).toHaveBeenCalledWith({ status: CODES.OK, data: { blogId: '1', title: 'Updated Blog' } });
  });

  test('deleteBlog should delete a blog and return success', async () => {
    req.params.id = '1';
    BasicServices.prototype.deleteOne = jest.fn().mockResolvedValue({ status: CODES.OK, message: 'Item deleted successfully' });

    await deleteBlog(req, res);

    expect(BasicServices.prototype.deleteOne).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(CODES.OK);
    expect(res.json).toHaveBeenCalledWith({ status: CODES.OK, message: 'Item deleted successfully' });
  });
});
