"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { log } = require('console');
const fs = require('fs/promises');
function createCustomReqRes(req, res, params = {}, queries = {}) {
    let sReq = {
        method: req.method,
        url: req.url,
        params,
        queries,
        // on: function (arg1, arg2) {
        //   return req.on(arg1, arg2)
        // },
        getBody: function () {
            return new Promise((res, rej) => {
                let data = '';
                req.on('data', (chunk) => {
                    data += chunk;
                });
                req.on("end", () => {
                    res(data.toString());
                });
            });
        }
    };
    let sRes = {
        setStatusCode: function (code) { res.statusCode = code; return this; },
        setJsonHeader: () => {
            res.setHeader('Content-Type', 'appliaction/json');
        },
        setHeader: (a, b) => {
            res.setHeader(a, b);
        },
        send: function (data) {
            res.end(data);
        },
        sendFile: async function (path) {
            let data = await fs.readFile(path, "utf-8");
            res.end(data);
        }
    };
    return [sReq, sRes];
}
module.exports = {
    createCustomReqRes
};
