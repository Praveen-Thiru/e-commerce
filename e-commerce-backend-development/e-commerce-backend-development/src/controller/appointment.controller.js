import { logger } from '../logger/logger.js';
import { AppointmentModel } from '../models/appointment.model.js';
import BasicServices from '../services/basicCRUD.js';
import AddAppointmentService from '../services/appointmentService/addAppointment.js';
import TodayAppointmentService from '../services/appointmentService/todayAppointment.js';
import RescheduleAppointmentService from '../services/appointmentService/rescheduled.js';
import UserAppointmentService from '../services/appointmentService/getUserAppointment.js';

const addAppointment = async (req, res) => {
    logger.info(`Post Appointment api is Executing`);
    const postAppointmentService = new AddAppointmentService(AppointmentModel);
    const responseMessage = await postAppointmentService.bookAppointment(req);
    logger.info(`Post Appointment api is Executed`);
    res.status(responseMessage.status).json(responseMessage);
  };

const getAppointments = async (req, res) => {
  logger.info(`Get Appointment api Executing`);
  const getAppointmentService = new BasicServices(AppointmentModel);
  const responseMessage = await getAppointmentService.getAll(req);
  logger.info(`Get Appointment api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getAppointmentById = async (req, res) => {
  logger.info('Get Appointment By iD api is Executing');
  const getAppointmentByIdService = new BasicServices(AppointmentModel);
  const responseMessage = await getAppointmentByIdService.getOne(req);
  logger.info(`Get Appointment By Id Api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const updateAppointment = async (req, res) => {
  logger.info('Update Appointment API is Executing');
  const updateAppointmentService = new BasicServices(AppointmentModel);
  const responseMessage = await updateAppointmentService.updateOne(req);
  logger.info('Update Appointment API is Executed');
  res.status(responseMessage.status).json(responseMessage);
};

const deleteAppointment = async (req, res) => {
  logger.info(`delete Appointment api is executing`);
  const deleteAppointmentService = new BasicServices(AppointmentModel);
  const responseMessage = await deleteAppointmentService.deleteOne(req);
  logger.info(`delete Appointment api is executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const getTodayAppointment = async (req, res) => {
  logger.info(`today Appointment api is executing`);
  const todayAppointmentService = new TodayAppointmentService(AppointmentModel);
  const responseMessage = await todayAppointmentService.getTodayAppointments(req);
  logger.info(`today Appointment api is executed`);
  res.status(responseMessage.status).json(responseMessage);
};

const appointmentReschedule = async (req, res) => {
  logger.info(`reschedule Appointment api is executing`);
  const appointmentRescheduleService = new RescheduleAppointmentService(AppointmentModel);
  const responseMessage = await appointmentRescheduleService.rescheduleAppointment(req);
  logger.info(`reschedule Appointment api is executed`);
  res.status(responseMessage.status).json(responseMessage);
};


const getUserAppointment = async (req, res) => {
  logger.info('Get Appointment api is Executing');
  const getUserAppointmentService = new UserAppointmentService(AppointmentModel);
  const responseMessage = await getUserAppointmentService.getUserAppointments(req);
  logger.info(`Get Appointment Api Executed`);
  res.status(responseMessage.status).json(responseMessage);
};

  export { addAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment, getTodayAppointment, appointmentReschedule, getUserAppointment };