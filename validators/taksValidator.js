const Joi = require('@hapi/joi')


// TASK CREATE VALIDATION

const taskCreateValidation = (data)=> {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        description: Joi.string().min(5).required(),
        dueDate: Joi.date().iso().required(),
        employeeId: Joi.number().positive().greater(999).required()
    })
  
    return schema.validate(data)
} 

// TASK 

const taskUpdateValidation = (data)=>{
    const schema = Joi.object({
        title: Joi.string().min(5),
        description: Joi.string().min(5),
        dueDate: Joi.date().iso(),
        employeeId: Joi.number().positive().greater(999)
    })

    return schema.validate(data)
}


module.exports = { taskCreateValidation , taskUpdateValidation }