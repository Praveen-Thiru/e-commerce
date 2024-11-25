import express from 'express';
import { addAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment, getTodayAppointment, appointmentReschedule, getUserAppointment } from '../controller/appointment.controller.js';
import verifyJWTToken from '../middeleware/auth.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/addAppointment',verifyJWTToken, addAppointment);
appointmentRouter.get('/getAppointments', getAppointments);
appointmentRouter.get('/getOne/:id', getAppointmentById);
appointmentRouter.put('/updateAppointment/:id', updateAppointment);
appointmentRouter.delete('/delete/:id',verifyJWTToken, deleteAppointment);
appointmentRouter.get('/todayAppointments',verifyJWTToken, getTodayAppointment);
appointmentRouter.put('/reschedule',verifyJWTToken, appointmentReschedule);
appointmentRouter.get('/getUserAppointment',verifyJWTToken, getUserAppointment);


export { appointmentRouter };
