const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check_Auth');

const OrdersController = require('../controllers/orders');

router.get('/',checkAuth,OrdersController.orders_get_all);

router.post('/',checkAuth, OrdersController.orders_create);

router.get('/:orderId',checkAuth, OrdersController.orders_get_single);

router.delete('/:orderId',checkAuth, OrdersController.orders_delete);

module.exports = router;