const express = require('express')
const { taskCreateValidation, taskUpdateValidation } = require('../validators/taksValidator')
      router  = new express.Router()

// ADD NEW TASK

router.post('/task/:owner/newTask',async(req,res)=>{
    try{
        const owner = req.params['owner']
        if(!owner) {
            return res.status(400).send({"error":"Employee Id Not Found!"})
        }

        req.body.employeeId = owner
        const data = req.body

        const {error} =  taskCreateValidation(data)

        if(error) {
            return res.status(400).send({"error": error.details[0].message})
        }

        let sql = `INSERT INTO task (id,title,description,dueDate,employeeId) 
                    VALUES (NULL,'${data.title}','${data.description}','${data.dueDate}',${owner})`

        const dbRes = await dbquery(sql)
        
        res.status(201).send({"success": "Task Created Successfully"
        , "taskId": dbRes.insertId})

    }
    catch(err) {
         console.log(err)
         res.status(500).send({"error": "Could't Registered User"})
    }
})


// GET THE TASK WITH ID

router.get('/task/:id',async(req,res)=>{
    const id = req.params['id']

    if(!id) {
        return res.status(400).send({"error": "Task Id Not Found !"})
    }

    try {
        let sql = `SELECT * FROM task WHERE id=${id}`
        
        const dbRes = await dbquery(sql)
        
        if(dbRes.length == 0) {
            return res.status(204).send();
        }

        return res.status(201).send(dbRes[0])
    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error": "Internal Error"})
    } 
})


// GET ALL THE TASK OF A PERTICULAR EMPLOYEE

router.get('/task/getByEmployeeId/:employeeId', async(req, res)=>{
    const eId = req.params['employeeId']

    if(!eId) {
        return res.status(400).send({"error": "Employee Id not Found"})
    }
    try{
        let sql = `SELECT * FROM task WHERE employeeId = ${eId}`

        const dbRes = await dbquery(sql)

        if(dbRes.length ==0 ){
            return res.status(204).send();
        }

        return res.status(201).send(dbRes)
    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error": "Internal Server Error"})
    }
})


// UPDATE TASK WITH USER ID

router.put('/task/:id/update',async(req,res)=>{
    const id = req.params['id']
    if(!id) {
        return res.status(400).send({"error":"Task Id not Found"})
    }

    const data = req.body

    const {error} = taskUpdateValidation(data)

    if(error) {
        return res.status(400).send({"error":error.details[0].message})
    }
    try{
        let sql  = `UPDATE task SET `

        Object.entries(data).forEach(element => {
            if(element[0] == 'id') return
            sql += ' ' + element[0] + ' = '
            if (typeof element[1] == "number"){
                sql += ' ' + element[0]
            }
            else {
                sql += ` '${element[1]}',` 
            }
        });

        sql = sql.substring(0,sql.length-1)
        sql += ` WHERE id=${id} `
        
        await dbquery(sql)

        res.status(201).send({"success":"Update the Data Successfully"})
    }
    catch(err) {
         console.log(err)
         res.status(500).send({"error": "Could Not Update"})
    }
})




// DELETE PERTICULAR TASK

router.delete('/task/:id',async(req,res)=>{
    try {
        const id = req.params['id']

        if(!id) {
            return res.status(400).send({"error":"Task Id not Found !"})
        }

        let sql = `DELETE FROM task WHERE id=${id}`

        await dbquery(sql)

        res.status(201).send({"success": "Task Deleted Successfully!"})
    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error": "Could Not Delete Task"})
    }
})

module.exports = router