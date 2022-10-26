import fetch from "node-fetch";
import { OK, SYSTEM_ERROR } from "../constant/HttpResponseCode.js";
import BookTicket from "../models/BookTicket.js";
import TrainStation from "../models/TrainStation.js";
import myLogger from "../winstonLog/winston.js";

const urlTicket = "https://dsvn.vn/api/banveweb/SearchTauByGaDiGaDenNgayXP"

// node-fetch call API 
export async function getInforTicket(from, to, departureDate, arrivalDate) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    const objTicket = {
        1: from,
        2: to,
        3: departureDate,
        4: arrivalDate,
        5: true,
        6: ''
    };
    const body = JSON.stringify(objTicket);
    myLogger.info("Body %o: ", body);
    return await fetch(urlTicket, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' }
    }).then(response =>
        response.json()
    )
        .then(json => {
            let { TauDis, BookingCode } = json;
            let infoTicket = [];
            TauDis.forEach(taudi => {
                let { Id, MacTau, NgayDi, NgayDen, GioDi, GioDen, BangGiaVes, ToaXes, TongChoCon, TongChoLock } = taudi;
                let giaVes = [];
                BangGiaVes.forEach(banggiave => {
                    let { Id, LoaiCho, TenLoaiCho, GiaVe, Chos, Thue, PhiTra, BaoHiem } = banggiave;
                    giaVes.push({ Id, LoaiCho, TenLoaiCho, GiaVe, Chos, Thue, PhiTra, BaoHiem });
                })
                let toaXes = [];
                ToaXes.forEach(ToaXe => {
                    let { Id, ToaSo, ToaSoSX, ToaXeDienGiai, ToaXeStatus, NhomChoWeb } = ToaXe;
                    toaXes.push({ Id, ToaSo, ToaSoSX, ToaXeDienGiai, ToaXeStatus, NhomChoWeb });
                })
                infoTicket.push({ Id, MacTau, NgayDi, NgayDen, GioDi, GioDen, giaVes, toaXes, TongChoCon, TongChoLock, BookingCode });
            });
            ret = { statusCode: OK, data: infoTicket };
            return ret;
        });
}


// node-fetch call APi và save data vào entity của mongo
export async function getAllTrain() {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    const urlGa = "https://k.vnticketonline.vn/api/GTGV/LoadDmGa";
    let model = null;
    return await fetch(urlGa, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then((response) => response.json())
        .then(async json => {
            json.forEach(o => {
                let { Id, TenGa, MaGa, SKeys, ThoiGian } = o;
                model = TrainStation({
                    id: Id,
                    tenGa: TenGa,
                    maGa: MaGa,
                    sKeys: SKeys,
                    thoiGian: ThoiGian
                })
                model.save();
            })
            // find() -> lấy tất cả data tương đương với select * from.
            let info = await TrainStation.find({})
            // tìm theo id
            // let info = await TrainStation.findById({id: ''})
            // tìm theo id và update
            // let info = await TrainStation.findOneAndUpdate({})
            // ....
            ret = { statusCode: OK, data: info };
            // ret = { statusCode: OK, data: model };
            return ret;
        })
}


function generate_string(n = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < n; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// save data bình thường
export async function bookTicket(trainID, trainCode, tickets) {
    let ret = { statusCode: SYSTEM_ERROR, error: 'ERROR', description: 'First error!' };
    let listTick = [];
    let model = null;
    let totalPrice = null;
    tickets.forEach(ticket => {
        let { Id, quantity, unitPrice } = ticket;
        totalPrice += quantity * unitPrice
        myLogger.info("TotalPrice %o: ", totalPrice)
        listTick.push({ Id, quantity, unitPrice })
    })
    model = new BookTicket({
        trainID: trainID,
        trainCode: trainCode,
        codeBH: generate_string(),
        TotalBH: 5000,
        bookingCode: generate_string(),
        tickets: listTick,
        Total: totalPrice,
    })
    model.save();
    ret = { statusCode: OK, data: model };
    return ret;
}