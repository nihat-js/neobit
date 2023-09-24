"use strict";
const { log } = require('console');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { specialReqRes, createCustomReqRes } = require('./lib/createCustomReqRes');
const { apiBuilder } = require('./lib/apiBuilder');
class Neotin {
    constructor(isDebugging = true) {
        this.port = 3000;
        this.endPoints = [];
        this.isDebugging = isDebugging;
        this.urlPrefix = "/"; //for grouping
    }
    buildApiFromObject({ data }) { apiBuilder({ data, dataType: "object" }); }
    buildApiFromJson({ data }) { apiBuilder({ data, dataType: "object" }); }
    async createTemplateData({ templateName = "users", override = true, destination }) {
        let source = path.resolve(__dirname, "default", templateName + ".json");
        destination = destination || path.resolve(process.cwd(), "db", templateName + ".json");
        await fs.mkdir(path.resolve(process.cwd(), "db"));
        console.log({ source, destination });
        await fs.copyFile(source, destination);
    }
    get(url, cb) {
        this.endPoints.push({ method: 'GET', url: this.getFinalUrl(url), cb });
    }
    post(url, cb) {
        this.endPoints.push({ method: 'POST', url: this.getFinalUrl(url), cb });
    }
    delete(url, cb) {
        this.endPoints.push({ method: 'DELETE', url: this.getFinalUrl(url), cb });
    }
    put(url, cb) {
        this.endPoints.push({ method: 'PUT', url: this.getFinalUrl(url), cb });
    }
    patch(url, cb) {
        this.endPoints.push({ method: 'PATCH', url: this.getFinalUrl(url), cb });
    }
    getFinalUrl(url) {
        if (url.startsWith("/"))
            url = url.slice(1);
        return this.urlPrefix + url;
    }
    group(url, cb) {
        if (url.startsWith("/"))
            url = url.slice(1);
        if (url.endsWith('/'))
            url = url.slice(0, url.length - 1);
        this.urlPrefix = this.urlPrefix + url + "/";
        cb();
        this.urlPrefix = "/";
    }
    listen(port) {
        if (port)
            this.port = port;
        if (this.isDebugging)
            console.log({ endPoints: this.endPoints });
        http.createServer((req, res) => {
            // users?id=:id//
            let [myUrlArr, queries] = parseAndRemoveQueries(splitToParts(req.url));
            mainLoop: for (let x of this.endPoints) {
                if (req.method !== x.method)
                    continue;
                let params = {};
                let endPointArray = splitToParts(x.url);
                if (endPointArray.length != myUrlArr.length)
                    continue;
                for (let i in endPointArray) {
                    if (!endPointArray[i].startsWith(":") && endPointArray[i] !== myUrlArr[i])
                        continue mainLoop;
                    if (endPointArray[i].startsWith(":")) {
                        params = { ...params, [endPointArray[i].slice(1)]: myUrlArr[i] };
                    }
                }
                const [cReq, cRes] = createCustomReqRes(req, res, params, queries);
                x.cb(cReq, cRes);
                break;
                // if (areArraysSame(endPointArray, myUrlArr)) {
                //   const [cReq, cRes] = createCustomReqRes(req, res, params, queries);
                //   x.cb(cReq, cRes); break;
                // }
                // api user :id
                // api user 5
                // if (x.url.indexOf(":") > -1) {
                //   let endPointArrIndexTillColon = endPointUrl.findIndex(el => /^:/.test(el))
                //   // let myUrlArrIndexTillColon  = myUrl.findIndex(el => /^:/.test(el))
                //   let part1 = endPointUrl.slice(0, endPointArrIndexTillColon).join("/")
                //   let part2 = myUrl.slice(0, endPointArrIndexTillColon).join("/")
                //   console.log({ part1, part2 })
                //   if (part1 != part2) continue;
                //   let newEndPointArr = endPointUrl.slice(endPointArrIndexTillColon,)
                //   let newMyUrlArr = myUrl.slice(endPointArrIndexTillColon)
                //   // console.log("line69",newEndPointArr,newMyUrlArr)
                //   let params = {}
                //   for (let i in newEndPointArr) {
                //     params[newEndPointArr[i].slice(1,)] = newMyUrlArr[i]
                //   }
                //   // console.log({ params })
                //   const [cReq, cRes] = createCustomReqRes(req, res, params)
                //   x.cb(cReq, cRes); break;
                //   // return false
                // }
            }
        })
            .listen(this.port, () => {
            console.log(`Neotin started at ${this.port} `);
        });
    }
    async getSampleObject(name = "users") {
        const fileNames = ['users', 'orders', 'products'];
        if (!fileNames.includes(name))
            throw Error('Wrong file name');
        let data = await fs.readFile(__dirname + "/default/" + name + ".json", "utf8");
        return JSON.parse(data);
    }
}
function splitToParts(url) { return url.split("/").filter(el => el != ""); }
function areArraysSame(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
        return true;
    }
}
function multiSplit(str, symbolsArr) {
    let arr = [];
    let part = "";
    for (let i in str) {
        if (symbolsArr.includes(str[i])) {
            arr.push(part);
            part = "";
        }
        else {
            part = part + str[i];
        }
    }
    if (part)
        arr.push(part);
    return arr;
}
function parseAndRemoveQueries(urlArr) {
    let queries = {}, newArr;
    newArr = urlArr.map(el => {
        let arr = multiSplit(el, ["?", "&", "="]);
        if (arr.length == 1)
            return el; // zero query
        for (let i = 1; i < arr.length;) {
            if (arr[i]) {
                queries = { ...queries, [arr[i]]: arr[i + 1] };
                i += 2;
            }
        }
        return arr[0]; //return before question mark
    });
    return [newArr, queries];
}
module.exports = {
    Neotin
};
