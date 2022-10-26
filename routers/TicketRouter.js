import express from 'express';
import { bookTicket, getAllTrain, getInforTicket } from '../controllers/TicketController.js';
import myLogger from '../winstonLog/winston.js';
const router = express.Router();


router.post('/getInfo', async (req, res, next) => {
    let { from, to, departureDate, arrivalDate} = req.body;
    let response = await getInforTicket(from, to, departureDate, arrivalDate);
    next(response);
})



router.post('/bookTicket', async (req, res, next) => {
    let {trainID, trainCode, tickets} = req.body;
    let response = await bookTicket(trainID, trainCode, tickets);
    next(response);
})


router.get('/getAllStation', async (req, res, next) => {
    let response = await getAllTrain();
    next(response);
})



export default router;
