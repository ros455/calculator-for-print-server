import { Router } from "express";
import * as CalculationsController from '../controller/CalculationsController.js';

const router = new Router();

router.post('/create-calculation',CalculationsController.createCalculation);
router.patch('/update-calculation',CalculationsController.updateCalculation);
router.delete('/delete-calculation',CalculationsController.deleteCalculation);
router.get('/get-all-calculations',CalculationsController.getAllCalculations);
router.get('/get-one-calculation/:id',CalculationsController.getOneCalculation);

export default router;