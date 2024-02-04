import { Router } from "express";
import * as ClientController from '../controller/ClientController.js';

const router = new Router();

router.post('/create-client',ClientController.createClient);
router.patch('/update-client',ClientController.updateClient);
router.get('/get-all-clients',ClientController.getAllClients);
router.delete('/delete-client',ClientController.deleteClient);

export default router;