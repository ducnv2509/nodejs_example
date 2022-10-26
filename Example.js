import express, { urlencoded } from 'express';
import mongoose from "mongoose";
import myLogger from "./winstonLog/winston.js";
import apiController from './routers/TicketRouter.js'
import dotenv from 'dotenv';
import cors from 'cors';
import { BAD_REQUEST, CREATED, NO_CONTENT, OK } from './constant/HttpResponseCode.js';

// lấy thông tin các biến trong file env
dotenv.config();
const app = express();
app.use(cors());
const dbname = process.env.DB_NAME;
const cluseter = process.env.DB_CLUSTER;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

app.use(express.json())
app.use(urlencoded({ extended: false }));
app.use('/api', apiController)
app.use((data, req, res, next) => {
    let statusCode = data.statusCode;
    // myLogger.info(data)
    if (statusCode !== OK && statusCode !== CREATED && statusCode !== NO_CONTENT) {
        let { method, url } = req;
        // myLogger.info("Method:" + method + ", URl:" + url + ", Error: " + JSON.stringify(data), { label: "RESPONSE-ERROR" });
        res.status(statusCode || BAD_REQUEST).send({
            code: statusCode,
            error: data.data ? data.data : data.error,
            description: data.description
        })
    } else {
        let { method, url } = req;
        // myLogger.info("Method:" + method + ", URl:" + url + ", Data: %o", data.data, { label: "RESPONSE-OK" });
        // myLogger.info("Method:" + method + ", URl:" + url + ", Data: " + JSON.stringify(data.data), { label: "RESPONSE-OK" });
        res.status(statusCode).send(data.data)
    }
});

const dburl = `mongodb+srv://${user}:${pass}@${cluseter}.qtkj13e.mongodb.net/${dbname}`
myLogger.info('info db %o', dburl)
mongoose.connect(dburl,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            myLogger.info("%o", err)
        } else {
            myLogger.info("Connected")
        }
    })
const portNode = process.env.PORT_NODE || 3000
const host_node = '0.0.0.0';
function myListener() {
    myLogger.info(`Listening on port ${portNode}..`);
}
app.listen(portNode, host_node, myListener)