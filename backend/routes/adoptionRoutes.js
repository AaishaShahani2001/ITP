import express from 'express';
import { protect } from '../middleware/auth.js';
import { allocateVisitDate, cancelAdoption, changeAdoptionStatus, createAdoption, getUserAdoptions } from '../controller/adoptionController.js';

const adoptionRouter = express.Router();

adoptionRouter.post('/create', protect, createAdoption)
adoptionRouter.get('/user', protect, getUserAdoptions)
adoptionRouter.post('/change-status', protect, changeAdoptionStatus)
adoptionRouter.post('/update-visit', protect, allocateVisitDate)
adoptionRouter.post('/cancel-adoption', protect, cancelAdoption)

export default adoptionRouter;