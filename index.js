"use strict";
const { log } = require('console');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { specialReqRes, createCustomReqRes } = require('./lib/createCustomReqRes');
const { apiBuilderFromArray } = require("./lib/apiBuilder/index");
class Neobit {
    constructor(isDebugging = true) {
        this.endPoints = [];
        this.port = 3000;
        // this.endPoints = [];
        this.isDebugging = isDebugging;
        this.urlPrefix = "/"; //for grouping
    }
    // async buildApiFromObject({ data }: { data: any }) { return new Promise((res, rej) =>  res(apiBuilder.call(this, { data, dataType: "object" }) )   )  }
    // buildApiFromJson({ filePath, prefix }: { filePath: string, prefix: string }) { apiBuilder.call(this, { filePath, data: filePath, dataType: "json" }) }
    buildApiFromArray({ name, prefix, arr }) { apiBuilderFromArray.call(this, { name, prefix, arr }); }
    // async createTemplateData({ templateName = "users", override = true, destination }: { templateName: string, override: boolean, destination: string }) {
    //   let source = path.resolve(__dirname, "defaulte", templateName + ".json")
    //   destination = destination || path.resolve(process.cwd(), "db", templateName + ".json")
    //   await fs.mkdir(path.resolve(process.cwd(), "db"))
    //   console.log({ source, destination })
    //   await fs.copyFile(source, destination)
    // }
    //
    get(url, ...functions) {
        if (functions.length == 0) {
            throw new Error("CB is required");
        }
        let cb = functions.at(-1);
        let middlewares = functions.slice(0, functions.length - 1);
        this.endPoints.push({ method: 'GET', url: this.getFinalUrl(url), cb, middlewares });
    }
    post(url, ...functions) {
        if (functions.length == 0) {
            throw new Error("CB is required");
        }
        let cb = functions.at(-1);
        let middlewares = functions.slice(0, functions.length - 1);
        this.endPoints.push({ method: 'POST', url: this.getFinalUrl(url), cb, middlewares });
    }
    delete(url, ...functions) {
        if (functions.length == 0) {
            throw new Error("CB is required");
        }
        let cb = functions.at(-1);
        let middlewares = functions.slice(0, functions.length - 1);
        this.endPoints.push({ method: 'DELETE', url: this.getFinalUrl(url), cb, middlewares });
    }
    put(url, ...functions) {
        if (functions.length == 0) {
            throw new Error("CB is required");
        }
        let cb = functions.at(-1);
        let middlewares = functions.slice(0, functions.length - 1);
        this.endPoints.push({ method: 'PUT', url: this.getFinalUrl(url), cb, middlewares });
    }
    patch(url, ...functions) {
        if (functions.length == 0) {
            throw new Error("CB is required");
        }
        let cb = functions.at(-1);
        let middlewares = functions.slice(0, functions.length - 1);
        this.endPoints.push({ method: 'PATCH', url: this.getFinalUrl(url), cb, middlewares });
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
            console.log(this.endPoints);
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
                function next($i, $lastI) {
                    if ($i <= $lastI) {
                        x.middlewares[$i](cReq, cRes, next.bind({}, $i + 1, $lastI));
                    }
                    else {
                        x.cb(cReq, cRes);
                    }
                }
                if (x.middlewares.length > 0) {
                    x.middlewares[0](cReq, cRes, next.bind({}, 1, x.middlewares.length - 1));
                }
                else {
                    x.cb(cReq, cRes);
                    break mainLoop;
                }
            }
            // api user :id
            // api user 5
            //   let endPointArrIndexTillColon = endPointUrl.findIndex(el => /^:/.test(el))
            //   // let myUrlArrIndexTillColon  = myUrl.findIndex(el => /^:/.test(el))
            //   let part1 = endPointUrl.slice(0, endPointArrIndexTillColon).join("/")
            //   let part2 = myUrl.slice(0, endPointArrIndexTillColon).join("/")
            //   console.log({ part1, part2 })
            //   let newEndPointArr = endPointUrl.slice(endPointArrIndexTillColon,)
            //   let newMyUrlArr = myUrl.slice(endPointArrIndexTillColon)
        })
            .listen(this.port, () => {
            console.log(`Neobit started at ${this.port} `);
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
    Neobit
};
