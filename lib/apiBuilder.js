const fs = require('fs/promises')


async function apiBuilder({ dataType, data, dataPath, customPrefix = "/" }) {
  // type="object" || json
  async function getData() {
    if (dataType == "object") {
      return data
    }
    else if (dataType == "json") {
      let foo = await fs.readFile(source)
      return JSON.parse(foo)
    }

  }
  async function saveData(foo){
    if (type != "json") return false
    const result =  await fs.writeFile(JSON.stringify(dataPath))
  }



  for (let key in data) {

    if (!Array.isArray(data[key])) continue;

    // get all (optional queries)
    this.get(key, async (req, res) => {
      let liveData = await getData()

      if (Object.keys(req.queries).length == 0) {
        res.send(JSON.stringify(liveData[key]));
        return false
      }

      let findedData = liveData[key].find(el => {
        let keys = Object.keys(req.queries)
        for (let k of keys) {
          if (el[k] != req.queries[k]) return false
        }
        return true
      })

      if (findedData) {
        res.send(JSON.stringify(findedData))
      } else {
        res.send("Not Found")
      }
    });

    // get one by id
    this.get(key + "/:id", async (req, res) => {
      let liveData = await getData()
      let foo = JSON.stringify(liveData[key].find(el => el.id == req.params.id))
      if (foo) {
        res.send(foo)
      } else {
        res.send("Error happened")
      }
    })

    this.post(key, async (req, res) => {
      let liveData = await getData()
      // console.log(req)

      let body = await req.getBody()
      try {
        body = JSON.parse(body)
        liveData[key].push(body);
        saveData()
        res.send('OK')
      } catch (e) {
        res.send('Problem');

      }

      // req.on('data', (chunk) => {
      //   console.log(chunk.toString())
      // });
    });

    // delete by id
    this.delete(key + "/:id", async (req, res) => {
      let liveData = await getData()
      liveData[key] = liveData[key].filter(it => it.id != req.params.id)
      await saveData(liveData)
      res.send("Ok")
    });
    // delete with queries
    this.delete(key, async  (req, res) => {
      let liveData = await getData()

      data[key] = data[key].filter(el => {
        for (let key in req.queries) {
          if (el[key] == req.queries[key]) return false
        }
        return el
      })
      res.send("Ok")
    })
  }
}



module.exports = {
  apiBuilder
}