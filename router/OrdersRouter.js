import { Router } from "express";
import * as OrdersController from '../controller/OrdersController.js';

const router = new Router();

router.post('/create-order',OrdersController.createOrder);
router.patch('/update-order',OrdersController.updateOrder);
router.patch('/update-order-status',OrdersController.updateOrderStatus);
router.delete('/delete-order',OrdersController.deleteOrder);
router.get('/get-all-orders',OrdersController.getAllOrders);
router.get('/get-all-orders-for-manager',OrdersController.getAllOrdersForManager);
router.get('/sort-by-status',OrdersController.sortByStatus);
router.get('/sort-by-status-for-manager',OrdersController.sortByStatusForManager);
router.get('/sort-by-manager',OrdersController.sortByManager);
router.get('/get-one-order/:id',OrdersController.getOneOrder);

export default router;