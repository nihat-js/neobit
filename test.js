const { Neobit } = require("./index")


const neo = new Neobit()

let contacts = [
  { id: 1, name: "nihat", surname: "Abdullazade", phoneNumber: "0507514178", },
  { id: 2, name: "zaur", surname: "Bedelov", phoneNumber: "0516678123", },
  { id: 3, name: "ilkin", surname: "Amalov", phoneNumber: "0515229201", },
  { id: 4, name: "elxan", surname: "Ceferov", phoneNumber: "0705421122", },
  { id: 5, name: "ilqar", surname: "Isgenderli", phoneNumber: "0513924123", },

]



neo.get("/contact-us", (req, res, next) => {
  console.log("this is first middlewares")
  next()
}, (req, res, next) => {
  console.log("tihs is second middleware")
  next()
}, (req, res, next) => {
  console.log('this is third middleware')
  next()
}, (req, res, next) => {
  console.log("this is forth middleware")
  next()
}, (req, res) => {
  console.log("Cb here")
  res.send("After middlewares contact us")
})

neo.get('/account', (req, res) => {
  res.send("Account created");
})


neo.buildApiFromArray({ name: "contacts", prefix: "api/", arr: contacts })
neo.listen(1000)
