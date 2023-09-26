# Neobit - Server with sample data, live server 

## Live Server
Install neobit globally

    npm i neobit -g

Run command

    neobit-live --port=8000 --template=users --name=user --prefix=/
    
Port number (optional) : 8000 (default)  
Template (optional)  : users (default) 
Endpoint (optional) : api/user (default)
Path (optional) : null (default)

## Standart using

#### Create class instance
    const {Neobit} = require('neobit')
    let neo = new Neobit()

####  All Methods : get, post, put, patch   

    neo.get("/demo",(req,res)=>{
    	res.send('demo testing')
    })
    // neo.post
    // neo.put
    // neo.patch
  
#### Middlewares are functions before callback.You can add as many as you want. If everything is OK, invoke next() to proceed next middleware or callback
    neo.delete("/api/v2/products/5", (req, res, next) => {
      console.log("this is first middlewares")
      next()
      }, (req, res, next) => {
      console.log("this is second middleware")
      next()
      }, (req, res, next) => {
      console.log('this is third middleware')
      next()
      }, (req, res) => {
      console.log("Cb here")
      res.send("After middlewares contact us")
  })


####  Group routing   ( works well with nested routing )

    neo.group('/api', () => {
    
	    neo.group('/comments/', () => {
	    
		    neo.get("/user", (req, res) => {
			    res.send("User section")
		    })
		  })
	  })


#### Params route  (ex: "api/auth/:lang:/:token"). 
Params should be seperated by forward slash and you must use only one param between two slashes. Params are stored in req.params object.

    neo.get('/tickets/:lang/:id',(req,res)=>{
      res.send(`Ticket  lang = ${req.params.lang} and token= ${req.params.token}`)
    })


Queries are stored in req.queries     