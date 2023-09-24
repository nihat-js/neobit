# Neotin - Server with sample data, live server and express syntax

  

### Get  route syntax 

    neo.get("/products",(req,res)=>{
    	res.send('My products')
    })

### Post route syntax

	 neo.post("/products",(req,res)=>{
    	res.send('My products')
    })
### PUT route syntax

	 neo.put("/products",(req,res)=>{
    	res.send('My products')
    })
 
### PATCH route syntax   
			
	neo.patch("/products",(req,res)=>{
    	res.send('My products')
    })


  

### It als supports group route nesting

    neo.group('/api', () => {
    
	    neo.group('/comments/', () => {
	    
		    neo.get("/user", (req, res) => {
			    res.send("User section")
		    })
		})
	})


#### Example Syntax for params route "api/auth/:lang:/:token". 
Params should be seperated by forward slash and you must use only one param between two slashes. Params are stored in req.params object.

    neo.get('/tickets/:lang/:id',(req,res)=>{
      res.send(`Ticket  lang = ${req.params.lang} and token= ${req.params.token}`)
    })