"use strict";
function apiBuilderGet({ arr, prefix, name }) {
    this.get(prefix + name, function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (Object.keys(req.queries).length == 0) {
            res.send(JSON.stringify(arr));
            return false;
        }
        let findedData = arr.find((el) => {
            let keys = Object.keys(req.queries);
            for (let k of keys) {
                if (el[k] != req.queries[k])
                    return false;
            }
            return true;
        });
        if (findedData) {
            res.send(JSON.stringify(findedData));
        }
        else {
            res.setStatusCode(300).send();
            res.send("Not Found");
        }
    });
}
function apiBuilderGetById({ arr, prefix, name }) {
    this.get(prefix + name + "/:id", (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        let data = arr.find(el => el.id == req.params.id);
        if (data) {
            res.setStatusCode(200).send(JSON.stringify(data));
        }
        else {
            res.setStatusCode(404).send("No data with that id");
        }
    });
}
module.exports = {
    apiBuilderGet,
    apiBuilderGetById
};
