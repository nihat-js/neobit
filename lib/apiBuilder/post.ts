function apiBuilderPost({name,prefix,arr}){

  this.post(prefix + name, async  (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let body = await req.getBody()
    try {
      body = JSON.parse(body)
      arr.push(body);
      // saveData()
      res.send('OK')
    } catch (e) {
      res.send('Problem');
    })
}

module.exports = {
  apiBuilderPost
}