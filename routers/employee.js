const express = require('express')
const { empCreateValidation , empUpdateValidation }  = require('../validators/empValidator') 
const router = new express.Router()




// Employee Account Creation Router

router.post('/employee/create',async(req,res)=>{
    try{
        const {error} =  empCreateValidation(req.body)
        
        if(error) {
            return res.status(400).send({"error": error.details[0].message})
        }

        // ADD EMPLOYEE TO THE DATABASE
        const data =  req.body;
        let sql = `INSERT INTO employee (id,name,email,phone,hireDate,position)
        VALUES(NULL,'${data.name}','${data.email}','${data.phone}','${data.hireDate}','${data.position}')`
        
        const dbRes = await dbquery(sql)
    
        res.status(201).send({"success":"Employee Registered Successfully",
        "id": dbRes.insertId})
    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error":"Internal Server Error"})
    }
})


// Employee Details Fetch Route 

router.get('/employee/:id',async(req,res)=>{
    try{
        const id = req.params['id']
        if(!id) {
            return res.status(400).send({"error":"ID Not Found!"})
        }
        
        let sql = `SELECT* FROM employee WHERE id = ${id}`
        
        const dbRes = await dbquery(sql)

        if(dbRes.length==0) {
            return res.status(404).send({"error":"Employee Not Found"})
        }

        res.status(201).send(dbRes[0])
    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error":"Internal Server Error"})
    }
})

// Employee Details Update Route

router.put('/employee/:id/update',async(req,res)=>{
    const id = req.params['id']
    if(!id) {
        return res.status(400).send({"error": "Employee Id not Found !"})
    }

    const data = req.body

    const {error} = empUpdateValidation(data)
    
    if(error) {
        return res.status(400).send({"error": error.details[0].message})
    }
    try {
        let sql = 'UPDATE employee SET '
         
        Object.entries(data).forEach(element=>{
            if(element[0] == 'id') return
            sql += ` ${element[0]} = '${element[1]}',`

        })
        sql =  sql.substring(0,sql.length-1)
        sql += ` WHERE id = ${id}`

        const dbRes = await dbquery(sql)

        return res.status(201).send({"success": "Data Update Successful"})

    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error": "Could Not Update"})
    }
})


// Employee Data Deletion Route

router.delete('/employee/:id',async(req,res)=>{
    try{
        const id = req.params['id']
        if(!id) {
            return res.status(400).send({"error":"ID Not Found!"});
        }

        let sql = `DELETE FROM employee WHERE id=${id}`

        const dbRes = await dbquery(sql)

        res.status(201).send({"success": "Employee records deleted successfully"})
    }
    catch(err) {
        res.status(500).send({"error":"Unable to Delete Data"})
    }
})

module.exports = router