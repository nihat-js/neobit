"use strict";

function apiBuilderDeleteByQueries() {
  neo.delete(key, async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let liveData = await getData();
    data[key] = data[key].filter(el => {
      for (let key in req.queries) {
        if (el[key] == req.queries[key])
          return false;
      }
      return el;
    });
    res.send("Ok");
  });
}

function apiBuilderDeleteById({ name, prefix, arr }: IApiBuilderFromArray) {

  this.delete(prefix + name + "/:id", async (req: IReq, res: IRes) => {
    console.log("baxaq gorek gelirmi")
    res.setHeader('Access-Control-Allow-Origin', '*');
    let index: number
    for (let i in arr) {
      if (arr[i].id == req.params.id) {
        index = i;
        break
      }
    }
    if (index) {
      res.setStatusCode(200).send(JSON.stringify(arr[index]))
      arr.splice(index, 1)
    } else {
      res.setStatusCode(404).send("Element with that id not found. Try deleting with queries")
    }
  })
}


module.exports  = {
  apiBuilderDeleteById
}


//

