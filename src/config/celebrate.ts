import {Joi} from 'celebrate';

const sessionsReqRules = {
    body: Joi.object().keys({
        email: Joi.string().required().email({ minDomainSegments: 2 }).label('e-mail'), // .label(name): Overrides the key name in error messages.
        password: Joi.string().min(6).max(32).required().messages({
            'string.base': `"password" should be a type of 'text'`,
            'string.empty': `"password" cannot be an empty field`,
            'string.min': `"password" should have a minimum length of {#limit}`,
            'string.max': `"password" should have a maximum length of {#limit}`,
            'any.required': `"password" is a required field`
        }),
        created: Joi.date().default(Date.now)
    })
}

const usersReqRules = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email().label('e-mail'), // .label(name): Overrides the key name in error messages.
        phone: Joi.string().pattern(new RegExp('^\(\d{2}\)\d{4,5}\-\d{4}$')),
        password: Joi.string().min(6).max(32).required(),
        image: Joi.string().pattern(new RegExp('^([a-zA-Z0-9\s_\\.\\-\(\):])+(.gif|.jpg|.jpeg|.png)$')).default('fake-image.png'),
        city: Joi.string().alphanum(),
        uf: Joi.string().alphanum().max(2).min(2).messages({
            'string.base': `"uf" should be a type of 'text'`,
            'string.empty': `"uf" cannot be an empty field`,
            'string.min': `"uf" should have a minimum length of {#limit}`,
            'string.max': `"uf" should have a maximum length of {#limit}`,
            'any.required': `"uf" is a required field`
        }),
        created: Joi.date() //.default(Date.now)
    })
}

const usersUpdateReqRules = {
    body: Joi.object().keys({
        name: Joi.string(),
        email: Joi.string().email().label('e-mail'), // .label(name): Overrides the key name in error messages.
        phone: Joi.string().pattern(new RegExp('^\(\d{2}\)\d{4,5}\-\d{4}$')),
        password: Joi.string().min(6).max(32),
        image: Joi.string().pattern(new RegExp('^([a-zA-Z0-9\s_\\.\\-\(\):])+(.gif|.jpg|.jpeg|.png)$')).default('fake-image.png'),
        city: Joi.string().alphanum(),
        uf: Joi.string().alphanum().max(2).min(2).messages({
            'string.base': `"uf" should be a type of 'text'`,
            'string.empty': `"uf" cannot be an empty field`,
            'string.min': `"uf" should have a minimum length of {#limit}`,
            'string.max': `"uf" should have a maximum length of {#limit}`,
            'any.required': `"uf" is a required field`
        }),
        created: Joi.date() //.default(Date.now)
    })
}

const locationsReqRules = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email().label('e-mail'), // .label(name): Overrides the key name in error messages.
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2).min(2).messages({
            'string.base': `"uf" should be a type of 'text'`,
            'string.empty': `"uf" cannot be an empty field`,
            'string.min': `"uf" should have a minimum length of {#limit}`,
            'string.max': `"uf" should have a maximum length of {#limit}`,
            'any.required': `"uf" is a required field`
          }),
        items: Joi.array().items(Joi.number()).required() // .array().items(Joi.number()): fiels are required and needs to be an array, and each items needs to be a number
    })
}
const joiOpts = {
    abortEarly: false,  //List all error messages
    errors: {
        escapeHtml: true  //scape HTML texts at values
    }
}

export {
    locationsReqRules, 
    usersReqRules,
    usersUpdateReqRules,
    sessionsReqRules,
    joiOpts
}