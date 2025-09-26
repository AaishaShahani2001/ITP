import express from 'express'
import { protect } from '../middleware/auth.js';
import { addPet, changeRoleToAdmin, getPets, removePet } from '../controller/adminController.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

adminRouter.post("/change-role", protect, changeRoleToAdmin)
adminRouter.post("/add-pet", upload.single("image"), protect, addPet)
adminRouter.post("pet", protect, getPets)
adminRouter.post("remove-pet", protect, removePet)

export default adminRouter;