import { Router } from "express";
import * as AdministrationController from '../controller/AdministrationController.js';

const router = new Router();

router.post('/register',AdministrationController.register);
router.post('/login',AdministrationController.login);
router.get('/get-me/:login',AdministrationController.getMe);

export default router;