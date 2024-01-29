import { Router } from "express";
import * as AdministrationRouter from '../controller/AdministrationController.js';

const router = new Router();

router.post('/register',AdministrationRouter.register);
router.post('/login',AdministrationRouter.login);
router.get('/get-me/:login',AdministrationRouter.getMe);

export default router;