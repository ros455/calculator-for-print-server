import { Router } from "express";
import * as OrdersController from '../controller/OrdersController.js';

const router = new Router();

router.post('/create-order',OrdersController.createOrder);
router.patch('/update-order',OrdersController.updateOrder);
router.patch('/update-order-status',OrdersController.updateOrderStatus);
router.delete('/delete-order',OrdersController.deleteOrder);
router.get('/get-all-orders',OrdersController.getAllOrders);
router.get('/get-one-order/:id',OrdersController.getOneOrder);

export default router;