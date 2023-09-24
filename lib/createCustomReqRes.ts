export { };
const { log } = require('console');
const fs = require('fs/promises')

function createCustomReqRes(req: any, res: any, params = {}, queries = {}) {
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

        req.on('data', (chunk: any) => {
          data += chunk;
        });
        req.on("end", () => {

          res(data.toString())
        })

      })
    }

  };
  let sRes = {
    setJsonHeader: () => {
      res.setHeader('Content-Type', 'appliaction/json');
    },
    send: function (data: any) {
      res.end(data);
    },
    sendFile: async function (path: string) {
      let data = await fs.readFile(path, "utf-8")
      res.end(data)
    }

  };
  return [sReq, sRes];
}

module.exports = {
  createCustomReqRes
}