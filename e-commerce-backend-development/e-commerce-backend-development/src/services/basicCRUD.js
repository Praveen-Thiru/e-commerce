import { logger } from '../logger/logger.js';
import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';


export default class BasicServices {
  #Model;

  constructor(Model) {
    this.#Model = Model;
  }

  //get all items
  getAll = async req => {
    try {
      logger.info('Inside getAll method');
     
      // Perform scan operation to get all
      const userList = await this.#Model.scan().exec();
      return sendResponse(CODES.OK, userList);
    } catch (error) {
      logger.error(`Error in Get All API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get All  API');
    }
  }
  

  //get one item by id
  getOne = async req => {
    try {
      logger.info('Inside getOne method');
      const{id} = req.params
      // Perform scan operation to get one
      const data = await this.#Model.get(id)
      if (!data)return sendResponse(CODES.NOT_FOUND, 'Not Found');
      return sendResponse(CODES.OK, data);
    } catch (error) {
      logger.error(`Error in Get one API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in Get one  API');
    }
  }
  

  //delete one item
  deleteOne = async req => {
    try {
      logger.info('Inside deleteOne method');
      const{id} = req.params
      if(!id)return sendResponse(CODES.BAD_REQUEST, 'Send specific Id');

      // Perform scan operation to get one
      const data = await this.#Model.get(id)
      if (!data)return sendResponse(CODES.NOT_FOUND, 'Not Found');

      // delete item
      await this.#Model.delete(id);
      return sendResponse(CODES.OK, 'Item deleted successfully');
    
    } catch (error) {
      logger.error(`Error in delete one API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in delete  API');
    }
  }

  // update data
  updateOne = async req => {
    try {
        logger.info('Inside updateOne method');
        const { id } = req.params;
        const updateFields = req.body; // Expecting an object with fields to update

        if (!id) return sendResponse(CODES.BAD_REQUEST, 'Send specific Id');
        if (Object.keys(updateFields).length === 0) 
            return sendResponse(CODES.BAD_REQUEST, 'Provide at least one field to update');

        // Perform scan operation to get the current data
        const existingData = await this.#Model.get(id);
        if (!existingData) return sendResponse(CODES.NOT_FOUND, 'Item not found');

        // Merge existing data with new fields
        const updatedData = {
            ...updateFields,
        };

        // Save the updated item
        const data = await this.#Model.update(id, updatedData);
        return sendResponse(CODES.OK, 'Item updated successfully', {data});

    } catch (error) {
        logger.error(`Error in update one API: ${error.message}`);
        return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in update API');
    }
    
}


createOne = async req => {
  try {
      logger.info('Inside createOne method');
      const newData = req.body; // Expecting an object with fields to save

      // Validate the input
      if (Object.keys(newData).length === 0) 
          return sendResponse(CODES.BAD_REQUEST, 'Provide data to save');

      // Save the new item
      const savedData = await this.#Model.create(newData); // Adjust according to your ORM/model method
      return sendResponse(CODES.CREATED, 'Item saved successfully', savedData);

  } catch (error) {
      logger.error(`Error in save new data API: ${error.message}`);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in save API');
  }
}



}
