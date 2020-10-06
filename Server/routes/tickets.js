const express = require( 'express' );
const router = express.Router();
const { verificaToken } = require('../middlewares/auth');
const ticketController = require('../Controllers/ticketController');

router.post('/save-ticket', verificaToken, ticketController.createTicket );
router.post('/ticket-items/:user', verificaToken, ticketController.getTicketItems);
router.post('/tickets-graph/:user', verificaToken, ticketController.getTicketsForGraphics);
router.get('/get-tickets/:userid', verificaToken, ticketController.getTicketsForTable);

module.exports = router;