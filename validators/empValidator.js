const Joi = require('@hapi/joi')


// CREATE VALIDATION


const empCreateValidation =  (data)=> {
    const schema = Joi.object ({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        hireDate: Joi.date().iso().required(),
        position: Joi.string().min(2).required()
    })
  return schema.validate(data)
}


const empUpdateValidation = (data) =>{
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/),
        hireDate: Joi.date().iso(),
        position: Joi.string().min(2)
    })
    return schema.validate(data)
}

module.exports = { empCreateValidation , empUpdateValidation }