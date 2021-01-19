const express = require( 'express' );
const router = express.Router();
const { verificaToken } = require('../middlewares/auth');
const ticketController = require('../Controllers/ticketController');

router.post('/save-ticket', verificaToken, ticketController.createTicket );
router.post('/ticket-items/:user', verificaToken, ticketController.getTicketItems);
router.post('/tickets-graph/:user', verificaToken, ticketController.getTicketsForGraphics);
router.get('/get-tickets/:userid', verificaToken, ticketController.getTicketsForTable);
router.get('/get-products', verificaToken, ticketController.getAccumulatededProductsAmounts);
router.get('/graphics', verificaToken, ticketController.dataGraphics);
router.get('/compare-graphics', verificaToken, ticketController.dataGraphics);
router.get('/tickets-pie-chart', verificaToken, ticketController.dataForPieChart);
router.delete('/delete-ticket/:ticketid', verificaToken, ticketController.deleteTicket);

module.exports = router;